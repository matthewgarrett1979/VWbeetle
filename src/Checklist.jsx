import { useState, useEffect, useRef } from "react";
import { buildRecord, phases } from "./data/checklist-data.js";

const L519 = "#5b8fa8"; // Bahama Blue — current paint
const L633 = "#2b5c8a"; // VW Blue — original paint

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
  cream: "#f2efe8",
  ink: "#111111",
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

      <div style={{ display: "flex", gap: 12, marginBottom: 40, animation: shake ? "shake 0.4s ease" : "none" }}>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${input.length > i ? "#f2efe8" : "#333"}`, background: input.length > i ? "#f2efe8" : "transparent", transition: "all 0.15s" }} />
        ))}
      </div>

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

// ── Small components ──────────────────────────────────────────────────────────

function Chevron({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
      <polyline points="4,2 8,6 4,10" stroke="#999" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Tick({ color = "#f2efe8" }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10">
      <polyline points="1.5,5 4,7.5 8.5,2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="6.5" stroke="#cc6600" strokeWidth="1.5" fill="none" />
      <line x1="8" y1="7" x2="8" y2="11.5" stroke="#cc6600" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="4.8" r="0.9" fill="#cc6600" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Checklist() {
  const BUILD_RECORD_TOTAL = buildRecord.reduce((acc, p) => acc + p.jobs.length, 0);
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
  const [expandedBuild, setExpandedBuild] = useState({});
  const [expandedPhases, setExpandedPhases] = useState({});

  useEffect(() => {
    remoteGet().then((remote) => {
      if (remote && Object.keys(remote).length > 0) {
        setChecked(remote);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      }
      setSynced(true);
    });
  }, []);

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
    <div style={{ minHeight: "100vh", background: "#f2efe8", fontFamily: S.font, overflowX: "hidden" }}>
      {showPin && <PINPrompt onUnlock={() => { setUnlocked(true); setShowPin(false); }} />}

      {/* ── Sticky progress bar ── */}
      <div style={{ position: "fixed", top: 52, left: 0, right: 0, zIndex: 99, background: "#111111", padding: "10px 16px 0", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 9, letterSpacing: 4, color: "#f2efe8", textTransform: "uppercase", fontFamily: S.font }}>GVU 798D</span>
          <span style={{ fontSize: 9, color: "#cc0000", letterSpacing: 1, fontFamily: S.font }}>{doneCount} of {totalJobs} jobs</span>
        </div>
        <div style={{ height: 4, background: "#333", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ background: L633, height: "100%", width: `${pct}%`, transition: "width 0.4s ease" }} />
        </div>
        <div style={{ textAlign: "center", fontSize: 9, color: "#f2efe8", letterSpacing: 4, textTransform: "uppercase", fontFamily: S.font }}>{pct}% Complete</div>
        <div style={{ marginLeft: -16, marginRight: -16, marginTop: 10, height: 2, background: "#cc0000" }} />
        <div style={{ marginLeft: -16, marginRight: -16, height: 3, background: L519 }} />
      </div>

      {/* ── Main content ── */}
      <div style={{ paddingTop: 140 }}>

        {/* Lock / sync strip */}
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "4px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
          <div
            onClick={() => { if (unlocked) { sessionStorage.removeItem(AUTH_KEY); setUnlocked(false); } else { setShowPin(true); } }}
            style={{ fontSize: 9, color: unlocked ? "#4ade80" : "#aaa", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", userSelect: "none" }}>
            {unlocked ? "🔓 Unlocked — tap to lock" : "🔒 Locked — tap to unlock"}
          </div>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: saveStatus === "saved" ? "#4ade80" : saveStatus === "saving" ? "#facc15" : saveStatus === "error" ? "#f87171" : "transparent", transition: "color 0.3s" }}>
            {saveStatus === "saving" ? "SYNCING..." : saveStatus === "error" ? "SYNC FAILED" : "SYNCED ✓"}
          </div>
        </div>

        {/* ── Timeline ── */}
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 64px", position: "relative", boxSizing: "border-box" }}>

          {/* Vertical spine — absolute, runs full height of timeline */}
          <div style={{ position: "absolute", top: 0, bottom: 64, left: 43, width: 2, background: L519 + "4c" }} />

          {/* ── BUILD RECORD HEADER ── */}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ width: 56, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 16, position: "relative", zIndex: 1 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#111", border: "2px solid #111" }} />
            </div>
            <div style={{ flex: 1, paddingTop: 10, paddingBottom: 20 }}>
              <div style={{ fontSize: 9, letterSpacing: 6, color: "#888", textTransform: "uppercase", marginBottom: 4 }}>Beetlelink Professional Works</div>
              <div style={{ fontSize: 11, color: "#666", fontStyle: "italic", marginBottom: 10 }}>March — October 2025</div>
              <div style={{ display: "inline-block", padding: "3px 10px", background: "#111", color: "#f2efe8", fontSize: 9, letterSpacing: 2, fontFamily: S.font }}>
                {BUILD_RECORD_TOTAL} JOBS COMPLETE
              </div>
            </div>
          </div>

          {/* ── BUILD RECORD PHASES ── */}
          {buildRecord.map((phase) => {
            const isOpen = !!expandedBuild[phase.id];
            return (
              <div key={phase.id} style={{ display: "flex", alignItems: "flex-start" }}>
                {/* Node */}
                <div style={{ width: 56, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 14, position: "relative", zIndex: 1 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#111", border: "2px solid #111" }} />
                </div>
                {/* Content */}
                <div style={{ flex: 1, borderBottom: "1px solid #e8e4db" }}>
                  <div
                    onClick={() => setExpandedBuild(p => ({ ...p, [phase.id]: !p[phase.id] }))}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 8px", cursor: "pointer", userSelect: "none", gap: 8 }}
                  >
                    <div>
                      <div style={{ fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 700, color: "#111", lineHeight: 1.2 }}>{phase.phase}</div>
                      <div style={{ fontSize: 10, color: "#999", fontStyle: "italic", marginTop: 2 }}>{phase.date}</div>
                    </div>
                    <Chevron open={isOpen} />
                  </div>
                  {isOpen && (
                    <div style={{ paddingBottom: 12 }}>
                      {phase.jobs.map((job, i) => {
                        const isNote = job.startsWith("NOTE:");
                        return (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0", borderBottom: i < phase.jobs.length - 1 ? "1px solid #f0ede8" : "none" }}>
                            {isNote ? (
                              <InfoIcon />
                            ) : (
                              <div style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Tick />
                              </div>
                            )}
                            <div style={{ fontSize: 11, color: isNote ? "#cc6600" : "#999", lineHeight: 1.5, fontStyle: isNote ? "italic" : "normal" }}>
                              {job}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* ── YOUR RESTORATION DIVIDER ── */}
          <div style={{ marginLeft: -16, marginRight: -16, marginTop: 12, marginBottom: 4, background: "#e0ddd6", padding: "14px 72px 14px 72px" }}>
            <div style={{ fontSize: 9, letterSpacing: 6, color: "#888", textTransform: "uppercase" }}>Your Restoration</div>
          </div>

          {/* ── INTERACTIVE PHASES ── */}
          {phases.map((phase) => {
            const phaseDone = phase.jobs.filter(j => checked[j.id]).length;
            const phaseComplete = phaseDone === phase.jobs.length;
            const inProgress = phaseDone > 0 && !phaseComplete;
            const isOpen = !!expandedPhases[phase.id];

            const parts = phase.phase.split(" — ");
            const phaseLabel = parts[0];
            const phaseName = parts.slice(1).join(" — ") || parts[0];

            const dotBg = phaseComplete ? L633 : inProgress ? "#fff" : "#f2efe8";
            const dotBorder = phaseComplete ? L633 : inProgress ? "#111" : "#ccc";

            return (
              <div key={phase.id} style={{ display: "flex", alignItems: "flex-start" }}>
                {/* Node */}
                <div style={{ width: 56, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 14, position: "relative", zIndex: 1 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: dotBg, border: `2px solid ${dotBorder}`, transition: "background 0.2s, border-color 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {phaseComplete && <Tick color={S.cream} />}
                  </div>
                </div>
                {/* Content */}
                <div style={{ flex: 1, borderBottom: "1px solid #e8e4db" }}>
                  {/* Phase header */}
                  <div
                    onClick={() => setExpandedPhases(p => ({ ...p, [phase.id]: !p[phase.id] }))}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0 10px", cursor: "pointer", userSelect: "none", gap: 8 }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, letterSpacing: 5, color: "#999", textTransform: "uppercase", marginBottom: 3 }}>{phaseLabel}</div>
                      <div style={{ fontSize: "clamp(13px, 3vw, 15px)", fontWeight: 700, color: "#111", lineHeight: 1.2 }}>{phaseName}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, paddingTop: 4 }}>
                      {phaseComplete ? (
                        <span style={{ fontSize: 8, letterSpacing: 2, color: L633, border: `1px solid ${L633}`, padding: "2px 8px", fontWeight: 700, fontFamily: S.font }}>COMPLETE</span>
                      ) : (
                        <span style={{ fontSize: 10, color: "#aaa", fontFamily: S.font }}>{phaseDone}/{phase.jobs.length}</span>
                      )}
                      <Chevron open={isOpen} />
                    </div>
                  </div>
                  {/* Note — only when expanded */}
                  {isOpen && phase.note && (
                    <div style={{ fontSize: 11, color: "#777", fontStyle: "italic", lineHeight: 1.6, paddingBottom: 10, borderBottom: "1px solid #ece9e2" }}>
                      {phase.note}
                    </div>
                  )}
                  {/* Jobs */}
                  {isOpen && (
                    <div style={{ paddingTop: 6, paddingBottom: 12 }}>
                      {phase.jobs.map((job, i) => {
                        const isNote = job.text.startsWith("NOTE:");
                        const isWarning = job.text.startsWith("⚠️");
                        const done = !!checked[job.id];
                        return (
                          <div key={job.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < phase.jobs.length - 1 ? "1px solid #f0ede8" : "none" }}>
                            {isNote ? (
                              <div style={{ marginTop: 1, flexShrink: 0 }}><InfoIcon /></div>
                            ) : (
                              <div
                                onClick={() => toggle(job.id)}
                                style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, cursor: "pointer", border: `2px solid ${done ? "#111" : isWarning ? "#cc6600" : "#ccc"}`, background: done ? "#111" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none", transition: "background 0.1s, border-color 0.1s" }}
                              >
                                {done && <Tick />}
                              </div>
                            )}
                            <div style={{ flex: 1 }}>
                              <span
                                onClick={() => !isNote && toggle(job.id)}
                                style={{
                                  fontSize: 12,
                                  color: isNote ? "#cc6600" : isWarning ? "#cc6600" : done ? "#bbb" : "#111",
                                  cursor: isNote ? "default" : "pointer",
                                  userSelect: "none",
                                  lineHeight: 1.5,
                                  fontStyle: isNote ? "italic" : "normal",
                                  textDecoration: !isNote && done ? "line-through" : "none",
                                }}
                              >
                                {job.text}
                              </span>
                              {job.resource && (
                                <a href={job.resource.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 4, fontSize: 10, color: "#cc0000", textDecoration: "none", letterSpacing: 0.5 }}>
                                  {job.resource.label} →
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Footer */}
          <div style={{ marginTop: 48, paddingLeft: 56, fontSize: 10, color: "#bbb", letterSpacing: 3, textTransform: "uppercase" }}>
            Volkswagen · Beetle · 1966 · Resto '26 · 60 Years Anniversary
          </div>

        </div>
      </div>
    </div>
  );
}
