import { useState, useEffect, useRef } from "react";

const phases = [
  {
    id: 1,
    phase: "Phase 1 — Gearbox",
    note: "Best access with the engine out. Do all gearbox work now — you won't want to revisit this once the engine is in.",
    colour: "#111",
    jobs: [
      { id: "1a", text: "Replace gearbox input shaft oil seal (113-311-113A)", resource: { label: "▶ Oil seal guide", url: "https://www.historicvws.org.uk/rearhuboilseals" } },
      { id: "1b", text: "Install new release bearing into bellhousing", resource: { label: "▶ Clutch install — JBugs", url: "https://www.jbugs.com/product/video-1971SB-Beetle-Clutch-Installation.html" } },
      { id: "1c", text: "Route and initially fit clutch cable", resource: { label: "▶ Cable replacement — JBugs", url: "https://www.jbugs.com/product/Video-Clutch-Accelerator-Cable-Replacement.html" } },
    ],
  },
  {
    id: 2,
    phase: "Phase 2 — Steering",
    note: "New box and new damper already fitted. Centre the box, check the column and coupler. Tracking done after road test.",
    colour: "#111",
    jobs: [
      { id: "2a", text: "Centre new steering box — count full lock to lock, set to mid-point before connecting drag link", resource: { label: "▶ Adjustment guide — Torkwerks", url: "https://torkwerks.com/vw-beetle-steering-box-adjustment/" } },
      { id: "2b", text: "Check steering column and coupler / rag joint for wear or play", resource: { label: "▶ Column discussion — Volkszone", url: "https://www.volkszone.com/threads/steering-box-adjustment.1602295/" } },
      { id: "2c", text: "New steering damper already fitted — confirm correct orientation and torque mountings" },
    ],
  },
  {
    id: 3,
    phase: "Phase 3 — Body Electrical",
    note: "Drill wings and run all wiring before any trim goes in. Swarf and cable runs are impossible to manage later.",
    colour: "#111",
    jobs: [
      { id: "3a", text: "Mark and drill indicator holes — centre hole ~35mm, 2 fixing holes fore/aft. Position: 7¾\" from headlamp, 1¾\" ahead of quarter panel chrome strip", resource: { label: "▶ Position ref — 1966vwbeetle.com", url: "https://www.1966vwbeetle.com/Forum/viewtopic.php?t=1567" } },
      { id: "3b", text: "Install front wing indicators with correct gaskets (OEM ref: 113 953 041J)" },
      { id: "3c", text: "Run indicator wiring — connect to loom", resource: { label: "▶ Wiring diagram — JBugs", url: "https://www.jbugs.com/VW-Tech-Article-1966-67-Wiring.html" } },
      { id: "3d", text: "Install new headlamp units with new glass/lenses (7\" round, H4)" },
      { id: "3e", text: "Connect headlamp wiring, check dip/main beam operation", resource: { label: "▶ Wiring diagram — JBugs", url: "https://www.jbugs.com/VW-Tech-Article-1966-67-Wiring.html" } },
      { id: "3f", text: "Aim headlamps (UK: 1% below horizontal at 10m)", resource: { label: "▶ MOT lighting — GOV.UK", url: "https://www.gov.uk/guidance/mot-inspection-manual-for-private-passenger-and-light-commercial-vehicles/4-lighting-and-signalling" } },
      { id: "3g", text: "⚠️ MISSING? — Check/install horn and connect to loom" },
    ],
  },
  {
    id: 4,
    phase: "Phase 4 — Soundproofing",
    note: "All deadening goes in before carpet, door cards or headliner. No exceptions.",
    colour: "#111",
    jobs: [
      { id: "4a", text: "Install floor pan tar board set (Heritage Parts Centre)", resource: { label: "▶ Install guide — HPC", url: "https://www.heritagepartscentre.com/en-gb/blog/how-to-install-sound-deadening-vw-beetle" } },
      { id: "4b", text: "Install bitumen pads to floor, transmission tunnel, footwells", resource: { label: "▶ Install guide — HPC", url: "https://www.heritagepartscentre.com/en-gb/blog/how-to-install-sound-deadening-vw-beetle" } },
      { id: "4c", text: "Install soundproofing to rear quarters / wheel arches" },
      { id: "4d", text: "Install soundproofing inside door skins (both sides)" },
    ],
  },
  {
    id: 5,
    phase: "Phase 5 — Radio & Wiring",
    note: "Run all wiring before any panels, door cards or carpet go in. Aerial cable needs routing under trim.",
    colour: "#111",
    jobs: [
      { id: "5a", text: "Run aerial cable from roof/screen area to dash" },
      { id: "5b", text: "Run speaker cable(s) to door or rear positions", resource: { label: "▶ Wiring diagram — JBugs", url: "https://www.jbugs.com/VW-Tech-Article-1966-67-Wiring.html" } },
      { id: "5c", text: "Install radio unit into dash" },
      { id: "5d", text: "Connect radio wiring and test" },
    ],
  },
  {
    id: 6,
    phase: "Phase 6 — Glazing",
    note: "Chrome into rubber on the bench first, then cord-pull the assembly into the aperture. Screens before door glass.",
    colour: "#111",
    jobs: [
      { id: "6b", text: "Fit chrome C-trim into rear window rubber on the bench first", resource: { label: "▶ Window fitting — YouTube", url: "https://youtu.be/tGMd0CrEQig?si=Uvyb7qG8pJF_JPD4" } },
      { id: "6c", text: "Fit rear window and rubber as an assembly into aperture — cord-pull method", resource: { label: "▶ Window fitting — YouTube", url: "https://youtu.be/tGMd0CrEQig?si=Uvyb7qG8pJF_JPD4" } },
      { id: "6d", text: "Fit chrome windscreen surround trim into rubber on the bench first", resource: { label: "▶ Window fitting — YouTube", url: "https://youtu.be/tGMd0CrEQig?si=Uvyb7qG8pJF_JPD4" } },
      { id: "6e", text: "Fit windscreen and rubber as an assembly into aperture — cord-pull method", resource: { label: "▶ Window fitting — YouTube", url: "https://youtu.be/tGMd0CrEQig?si=Uvyb7qG8pJF_JPD4" } },
      { id: "6f", text: "Check both screens for leaks (garden hose, check inside for drips)" },
      { id: "6g", text: "Install door glass and run channels" },
      { id: "6h", text: "Install door window winding mechanisms" },
      { id: "6i", text: "Install quarterlight assemblies (vent windows)" },
      { id: "6j", text: "Adjust door glass alignment and operation" },
    ],
  },
  {
    id: 7,
    phase: "Phase 7 — Interior Trim",
    note: "Door seals before door cards. Carpet before door cards where they overlap at the sill. Running boards last once interior is complete.",
    colour: "#111",
    jobs: [
      { id: "7a", text: "Install door aperture seals (body-to-door rubber)" },
      { id: "7b", text: "Install carpet — front footwells, transmission tunnel, rear" },
      { id: "7c", text: "Install door cards / liners (both sides)" },
      { id: "7d", text: "Fit door pull straps / handles to door cards" },
      { id: "7e", text: "Install running boards (Wolfsburg West — 111821507/508)", resource: { label: "▶ Running board install — JBugs", url: "https://www.jbugs.com/product/video-VW-Running-Board-Installation.html" } },
      { id: "7f", text: "Headliner — book and complete separately once all other trim is done" },
    ],
  },
  {
    id: 8,
    phase: "Phase 8 — Engine",
    note: "Everything else is done. Fit clutch to flywheel, dress the engine, drop it in and commission ready for run-in.",
    colour: "#111",
    jobs: [
      { id: "8a", text: "Fit clutch plate and pressure plate to flywheel — alignment tool, star pattern to 20 ft/lb", resource: { label: "▶ Clutch install — JBugs", url: "https://www.jbugs.com/product/video-1971SB-Beetle-Clutch-Installation.html" } },
      { id: "8b", text: "Install all tinware (baffles, fan housing, lower tins)" },
      { id: "8c", text: "Install fuel filter" },
      { id: "8d", text: "Install engine into car, mate to gearbox", resource: { label: "▶ Engine install — JBugs", url: "https://www.jbugs.com/product/video-VW-Beetle-Engine-Installation.html" } },
      { id: "8e", text: "Fit heat exchangers / heating boxes" },
      { id: "8f", text: "Install EMPI GT exhaust system" },
      { id: "8g", text: "Connect fuel line, throttle cable, choke cable", resource: { label: "▶ Cable diagram — JBugs", url: "https://www.jbugs.com/VW-Tech-Article-1966-67-Wiring.html" } },
      { id: "8h", text: "Final clutch cable adjustment — 10–15mm freeplay at the pedal", resource: { label: "▶ Clutch adjustment — VW Resource", url: "https://www.vw-resource.com/clutch.html" } },
      { id: "8i", text: "Fill engine oil (20W-50 mineral), check all fluid levels" },
      { id: "8j", text: "Commission engine — start, set timing (5° BTDC static), set carb, check for leaks", resource: { label: "▶ Timing guide — VW Resource", url: "https://www.vw-resource.com/timing.html" } },
      { id: "8k", text: "First start — rev to 2,000 RPM immediately, vary 2,000–4,000 RPM for 15 mins to bed cam", resource: { label: "▶ First start — JBugs", url: "https://www.jbugs.com/product/video-vw-super-beetle-engine-start-up.html" } },
      { id: "8l", text: "Check oil pressure, fan belt tension (~10mm deflection), no leaks" },
    ],
  },
  {
    id: 9,
    phase: "Phase 9 — Sign-Off",
    note: "Don't skip this phase. Check everything before the first drive, then again after the first heat cycle.",
    colour: "#111",
    jobs: [
      { id: "9a", text: "Check all lights — indicators, headlamps, tail, brake, reverse", resource: { label: "▶ MOT lighting — GOV.UK", url: "https://www.gov.uk/guidance/mot-inspection-manual-for-private-passenger-and-light-commercial-vehicles/4-lighting-and-signalling" } },
      { id: "9b", text: "⚠️ MISSING? — Check/bleed brakes, check brake fluid level" },
      { id: "9c", text: "Check all window seals for water ingress (garden hose test)" },
      { id: "9d", text: "Check heating system operation (cables, flaps, heat exchangers)" },
      { id: "9e", text: "Road test — clutch, steering feel, no leaks, brakes pull straight" },
      { id: "9f", text: "Book and complete front wheel tracking — immediately after road test" },
      { id: "9g", text: "Torque check critical fasteners after first heat cycle" },
      { id: "9h", text: "Begin run-in — vary revs, avoid sustained high speed, first oil change at 500 miles", resource: { label: "▶ Break-in guide — VW Resource", url: "https://www.vw-resource.com/engine_break_in.html" } },
    ],
  },
];

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

export default function Checklist() {
  const totalJobs = phases.reduce((acc, p) => acc + p.jobs.length, 0);
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  });
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved", "error"
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

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / totalJobs) * 100);

  return (
    <div style={{ minHeight: "100vh", background: S.white, fontFamily: S.font }}>
      {/* Header bar */}
      <div style={{ background: S.black, padding: "28px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
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
              <div style={{ fontSize: 48, fontWeight: 900, color: S.red, lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: 3, textTransform: "uppercase" }}>{doneCount} of {totalJobs} done</div>
              <div style={{ fontSize: 10, color: saveStatus === "saved" ? "#4ade80" : saveStatus === "saving" ? "#facc15" : saveStatus === "error" ? "#f87171" : "transparent", transition: "color 0.3s", letterSpacing: 2, marginTop: 4 }}>
                {saveStatus === "saving" ? "SYNCING..." : saveStatus === "error" ? "SYNC FAILED" : "SYNCED ✓"}
              </div>
            </div>
          </div>
          {/* Progress */}
          <div style={{ marginTop: 20, height: 3, background: "#333" }}>
            <div style={{ height: 3, width: `${pct}%`, background: S.red, transition: "width 0.4s" }} />
          </div>
        </div>
      </div>

      {/* Phases */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px 64px" }}>
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
                    <div style={{ fontSize: 16, fontWeight: 900, color: S.black, letterSpacing: -0.5, textTransform: "uppercase" }}>
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
                      <span onClick={() => toggle(job.id)} style={{ fontSize: 13, color: done ? "#bbb" : isWarning ? "#cc6600" : S.black, textDecoration: done ? "line-through" : "none", cursor: "pointer", userSelect: "none", lineHeight: 1.5 }}>{job.text}</span>
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
          <span>Surrey, UK · Aug 1966 · Saves automatically</span>
          <span>⚠️ = Check needed · → = Guide</span>
        </div>
      </div>
    </div>
  );
}
