import { useState, useEffect, useRef } from "react";
import { buildRecord, phases } from "./data/checklist-data.js";


const STORAGE_KEY = "beetle-checklist-v1";
const UPSTASH_URL = "https://tight-magpie-91087.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAWPPAAIncDEyZTk4MjE1MTdmMmU0ODJiYTkzOWY5NTlmZDhkOTgyOXAxOTEwODc";

async function remoteGet() {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${STORAGE_KEY}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  } catch { return null; }
}

async function remoteSet(value) {
  try {
    const encoded = encodeURIComponent(JSON.stringify(value));
    await fetch(`${UPSTASH_URL}/set/${STORAGE_KEY}/${encoded}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
  } catch {}
}

const S = {
  font: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  black: "#111111",
  white: "#f5f5f0",
  red: "#cc0000",
  border: "2px solid #111",
  thinBorder: "1px solid #ccc",
};

const AUTH_KEY = "beetle-auth";

function PINPrompt({ onUnlock }) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(false);
  const [inputError, setInputError] = useState(false);

  const attempt = async (val) => {
    setChecking(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: val }),
      });
      const data = await res.json();
      if (data.valid) {
        sessionStorage.setItem(AUTH_KEY, "1");
        onUnlock();
      } else {
        setInputError(true);
        setShake(true);
        setInput("");
        setTimeout(() => { setShake(false); setInputError(false); }, 500);
      }
    } catch {
      setInputError(true);
      setShake(true);
      setInput("");
      setTimeout(() => { setShake(false); setInputError(false); }, 500);
    } finally {
      setChecking(false);
    }
  };

  const press = (digit) => {
    if (checking) return;
    const next = input + digit;
    setInput(next);
    if (next.length === 6) attempt(next);
  };

  const handleTextChange = (e) => {
    if (checking) return;
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setInput(val);
    if (val.length === 6) attempt(val);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (checking) return;
    const val = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setInput(val);
    if (val.length === 6) attempt(val);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: S.black, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: S.font }}>
      <div style={{ fontSize: 10, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 32 }}>{checking ? "Checking..." : "Authenticator Code"}</div>

      {/* Text input */}
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={input}
        placeholder="······"
        onChange={handleTextChange}
        onPaste={handlePaste}
        autoFocus
        style={{ width: 160, fontSize: 28, fontWeight: 900, textAlign: "center", letterSpacing: 8, border: `2px solid ${inputError ? S.red : "#111"}`, background: S.cream, color: S.ink, fontFamily: S.font, padding: "12px 8px", outline: "none", marginBottom: 16, transition: "border-color 0.15s", boxSizing: "border-box" }}
      />

      {/* Code dots */}
      <div style={{ display: "flex", gap: 12, marginBottom: 40, animation: shake ? "shake 0.4s ease" : "none" }}>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${input.length > i ? "#f2efe8" : "#333"}`, background: input.length > i ? "#f2efe8" : "transparent", transition: "all 0.15s" }} />
        ))}
      </div>

      {/* Keypad */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 64px)", gap: 12 }}>
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
          <button key={i} onClick={() => d === "⌫" ? setInput(p => p.slice(0,-1)) : d ? press(d) : null}
            style={{ width: 64, height: 64, border: "1px solid #222", background: d ? "#1a1a1a" : "transparent", color: "#f2efe8", fontSize: d === "⌫" ? 18 : 22, fontWeight: 600, cursor: d ? "pointer" : "default", fontFamily: S.font, transition: "background 0.1s" }}
            onMouseEnter={e => { if(d) e.target.style.background = "#2a2a2a"; }}
            onMouseLeave={e => { if(d) e.target.style.background = "#1a1a1a"; }}>
            {d}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 40, fontSize: 9, color: "#333", letterSpacing: 3, textTransform: "uppercase" }}>
        View only — enter code to tick jobs
      </div>
    </div>
  );
}

export default function Checklist() {
  const BUILD_RECORD_TOTAL = buildRecord.reduce((acc, p) => acc + p.jobs.length, 0); // all completed
  const phaseJobsTotal = phases.reduce((acc, p) => acc + p.jobs.length, 0);
  const totalJobs = BUILD_RECORD_TOTAL + phaseJobsTotal;
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [showPin, setShowPin] = useState(false);
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  });
  const [saveStatus, setSaveStatus] = useState("");
  const [synced, setSynced] = useState(false);
  const isFirstLoad = useRef(true);

  // On mount — pull from Upstash (cloud is source of truth)
  useEffect(() => {
    remoteGet().then((remote) => {
      if (remote && Object.keys(remote).length > 0) {
        setChecked(remote);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      }
      setSynced(true);
    });
  }, []);

  // On every change after first load — save to both localStorage and Upstash
  useEffect(() => {
    if (isFirstLoad.current) { isFirstLoad.current = false; return; }
    if (!synced) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    setSaveStatus("saving");
    remoteSet(checked).then(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 1500);
    }).catch(() => {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    });
  }, [checked, synced]);

  const toggle = (id) => {
    if (!unlocked) { setShowPin(true); return; }
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const phaseDoneCount = Object.values(checked).filter(Boolean).length;
  const doneCount = BUILD_RECORD_TOTAL + phaseDoneCount;
  const pct = Math.round((doneCount / totalJobs) * 100);

  return (
    <div style={{ minHeight: "100vh", background: S.white, fontFamily: S.font, overflowX: "hidden", width: "100%" }}>
      {/* PIN prompt overlay */}
      {showPin && <PINPrompt onUnlock={() => { setUnlocked(true); setShowPin(false); }} />}
      {/* Header bar */}
      <div style={{ background: S.black, padding: "28px clamp(16px, 4vw, 32px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 6, color: "#888", textTransform: "uppercase", marginBottom: 8 }}>
                Work Order
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: S.white, letterSpacing: -1, lineHeight: 1 }}>
                Order of Works.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 900, color: S.red, lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: 3, textTransform: "uppercase" }}>{doneCount} of {totalJobs} done</div>
              <div style={{ fontSize: 10, color: saveStatus === "saved" ? "#4ade80" : saveStatus === "saving" ? "#facc15" : saveStatus === "error" ? "#f87171" : "transparent", transition: "color 0.3s", letterSpacing: 2, marginTop: 4 }}>
                {saveStatus === "saving" ? "SYNCING..." : saveStatus === "error" ? "SYNC FAILED" : "SYNCED ✓"}
              </div>
              <div
                onClick={() => unlocked ? (sessionStorage.removeItem(AUTH_KEY), setUnlocked(false)) : setShowPin(true)}
                style={{ marginTop: 8, fontSize: 9, color: unlocked ? "#4ade80" : "#555", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", userSelect: "none" }}>
                {unlocked ? "🔓 Unlocked — tap to lock" : "🔒 Locked — tap to unlock"}
              </div>
            </div>
          </div>
          {/* Progress */}
          <div style={{ marginTop: 20, height: 3, background: "#333" }}>
            <div style={{ height: 3, width: `${pct}%`, background: S.red, transition: "width 0.4s" }} />
          </div>
        </div>
      </div>

      {/* Build Record */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px clamp(16px, 4vw, 32px) 0", width: "100%", boxSizing: "border-box" }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>Build Record</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: S.black, letterSpacing: -0.5 }}>Professional Works — GVU 798D.</div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>Bodyshop restoration Mar–Oct 2025. All items completed.</div>
        </div>
        {buildRecord.map((phase) => (
          <div key={phase.id} style={{ borderBottom: `1px solid #ddd`, marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 10, borderBottom: "1px solid #eee", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: S.black, textTransform: "uppercase", letterSpacing: -0.3 }}>{phase.phase}</div>
              <div style={{ fontSize: 9, color: "#aaa", letterSpacing: 3, textTransform: "uppercase" }}>{phase.date}</div>
            </div>
            {phase.jobs.map((job, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderBottom: i < phase.jobs.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1, background: S.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="9" height="9" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="#f5f5f0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div style={{ fontSize: 11, color: job.startsWith("NOTE:") ? "#cc6600" : "#666", lineHeight: 1.5, fontStyle: job.startsWith("NOTE:") ? "italic" : "normal" }}>{job}</div>
              </div>
            ))}
          </div>
        ))}
        <div style={{ marginTop: 24, marginBottom: 40, paddingTop: 16, borderTop: `2px solid ${S.black}` }}>
          <div style={{ fontSize: 9, color: "#bbb", letterSpacing: 3, textTransform: "uppercase" }}>Total professional works · Mar–Oct 2025 · GVU 798D</div>
        </div>
      </div>

      {/* Phases */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 64px", width: "100%", boxSizing: "border-box" }}>
        {phases.map((phase, pi) => {
          const phaseDone = phase.jobs.filter(j => checked[j.id]).length;
          const phaseComplete = phaseDone === phase.jobs.length;
          return (
            <div key={phase.id} style={{ borderBottom: S.border, paddingBottom: 0 }}>
              {/* Phase header */}
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "24px 0 16px", borderBottom: "1px solid #ddd" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: phaseComplete ? S.red : "#999", letterSpacing: 4, textTransform: "uppercase", minWidth: 24 }}>
                    {String(pi + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div style={{ fontSize: "clamp(12px, 3vw, 16px)", fontWeight: 900, color: S.black, letterSpacing: -0.5, textTransform: "uppercase" }}>
                      {phase.phase.replace(/Phase \d+ — /, "")}
                    </div>
                    <div style={{ fontSize: 11, color: "#777", marginTop: 4, lineHeight: 1.6, maxWidth: 560 }}>{phase.note}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: phaseComplete ? S.red : "#bbb", letterSpacing: 1, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {phaseComplete ? "DONE" : `${phaseDone}/${phase.jobs.length}`}
                </div>
              </div>

              {/* Jobs */}
              {phase.jobs.map((job, i) => {
                const isWarning = job.text.startsWith("⚠️");
                const done = !!checked[job.id];
                return (
                  <div key={job.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderBottom: i < phase.jobs.length - 1 ? "1px solid #e8e8e4" : "none", background: "transparent" }}>
                    {/* Checkbox */}
                    <div onClick={() => toggle(job.id)} style={{ width: 20, height: 20, flexShrink: 0, marginTop: 1, cursor: "pointer", border: `2px solid ${done ? S.black : isWarning ? "#cc6600" : "#bbb"}`, background: done ? S.black : "transparent", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none", transition: "all 0.1s" }}>
                      {done && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="#f5f5f0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <span onClick={() => toggle(job.id)} style={{ fontSize: 9, color: "#bbb", letterSpacing: 2, marginRight: 8, textTransform: "uppercase", cursor: "pointer", userSelect: "none", fontWeight: 700 }}>{job.id.toUpperCase()}</span>
                      <span onClick={() => toggle(job.id)} style={{ fontSize: "clamp(11px, 2.5vw, 13px)", color: done ? "#bbb" : isWarning ? "#cc6600" : S.black, textDecoration: done ? "line-through" : "none", cursor: "pointer", userSelect: "none", lineHeight: 1.5 }}>{job.text}</span>
                      {job.resource && (
                        <a href={job.resource.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginLeft: 10, fontSize: 10, color: S.red, textDecoration: "none", letterSpacing: 0.5, fontWeight: 700, verticalAlign: "middle" }}>
                          {job.resource.label} →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", fontSize: 10, color: "#bbb", letterSpacing: 3, textTransform: "uppercase" }}>
          <span>Volkswagen · Beetle · 1966 · Resto '26 · 60 Years Anniversary</span>
        </div>
      </div>
    </div>
  );
}
