import { useState, useEffect } from "react";

const phases = [
  {
    id: 1,
    phase: "Phase 1 — Gearbox (Engine Out)",
    note: "Best access with the engine out. Do all gearbox work now — you won't want to revisit this once the engine is in.",
    colour: "#b45309",
    jobs: [
      { id: "1a", text: "Replace gearbox input shaft oil seal (113-311-113A)", resource: { label: "▶ Rear hub oil seal guide — Historic VW Club", url: "https://www.historicvws.org.uk/rearhuboilseals" } },
      { id: "1b", text: "Install new release bearing into bellhousing", resource: { label: "▶ Clutch installation video — JBugs", url: "https://www.jbugs.com/product/video-1971SB-Beetle-Clutch-Installation.html" } },
      { id: "1c", text: "Route and initially fit clutch cable", resource: { label: "▶ Clutch cable replacement video — JBugs", url: "https://www.jbugs.com/product/Video-Clutch-Accelerator-Cable-Replacement.html" } },
    ],
  },
  {
    id: 2,
    phase: "Phase 2 — Steering",
    note: "New box and new damper already fitted. Centre the box, check the column and coupler, confirm damper mountings. Tracking done after road test.",
    colour: "#1d4ed8",
    jobs: [
      { id: "2a", text: "Centre new steering box — count full lock to lock, set to mid-point before connecting drag link", resource: { label: "▶ Steering box adjustment — Torkwerks", url: "https://torkwerks.com/vw-beetle-steering-box-adjustment/" } },
      { id: "2b", text: "Check steering column and coupler / rag joint for wear or play", resource: { label: "▶ Steering box & column — Volkszone", url: "https://www.volkszone.com/threads/steering-box-adjustment.1602295/" } },
      { id: "2c", text: "New steering damper already fitted — confirm correct orientation and torque mountings" },
    ],
  },
  {
    id: 3,
    phase: "Phase 3 — Body Electrical (Front)",
    note: "Drill wings and run all wiring before any trim goes in. Swarf and cable runs are impossible to manage later.",
    colour: "#1d4ed8",
    jobs: [
      { id: "3a", text: "Mark and drill indicator holes — centre hole ~35mm (wiring grommet), 2 small fixing holes fore/aft. Position: 7¾\" from headlamp, 1¾\" ahead of quarter panel chrome strip", resource: { label: "▶ Position reference — 1966vwbeetle.com", url: "https://www.1966vwbeetle.com/Forum/viewtopic.php?t=1567" } },
      { id: "3b", text: "Install front wing indicators with correct gaskets (OEM ref: 113 953 041J)" },
      { id: "3c", text: "Run indicator wiring — connect to loom", resource: { label: "▶ 1966/67 wiring diagram — JBugs", url: "https://www.jbugs.com/VW-Tech-Article-1966-67-Wiring.html" } },
      { id: "3d", text: "Install new headlamp units with new glass/lenses (7\" round, H4)" },
      { id: "3e", text: "Connect headlamp wiring, check dip/main beam operation", resource: { label: "▶ 1966/67 wiring diagram — JBugs", url: "https://www.jbugs.com/VW-Tech-Article-1966-67-Wiring.html" } },
      { id: "3f", text: "Aim headlamps (UK: 1% below horizontal at 10m)", resource: { label: "▶ MOT lighting manual — GOV.UK", url: "https://www.gov.uk/guidance/mot-inspection-manual-for-private-passenger-and-light-commercial-vehicles/4-lighting-and-signalling" } },
      { id: "3g", text: "⚠️ MISSING? — Check/install horn and connect to loom" },
    ],
  },
  {
    id: 4,
    phase: "Phase 4 — Soundproofing",
    note: "All deadening goes in before carpet, door cards or headliner. No exceptions.",
    colour: "#15803d",
    jobs: [
      { id: "4a", text: "Install floor pan tar board set (Heritage Parts Centre)", resource: { label: "▶ Sound deadening install guide — HPC", url: "https://www.heritagepartscentre.com/en-gb/blog/how-to-install-sound-deadening-vw-beetle" } },
      { id: "4b", text: "Install bitumen pads to floor, transmission tunnel, footwells", resource: { label: "▶ Sound deadening install guide — HPC", url: "https://www.heritagepartscentre.com/en-gb/blog/how-to-install-sound-deadening-vw-beetle" } },
      { id: "4c", text: "Install soundproofing to rear quarters / wheel arches" },
      { id: "4d", text: "Install soundproofing inside door skins (both sides)" },
    ],
  },
  {
    id: 5,
    phase: "Phase 5 — Radio & In-Car Wiring",
    note: "Run all wiring before any panels, door cards or carpet go in. Aerial cable needs routing under trim.",
    colour: "#15803d",
    jobs: [
      { id: "5a", text: "Run aerial cable from roof/screen area to dash" },
      { id: "5b", text: "Run speaker cable(s) to door or rear positions", resource: { label: "▶ 1966/67 wiring diagram — JBugs", url: "https://www.jbugs.com/VW-Tech-Article-1966-67-Wiring.html" } },
      { id: "5c", text: "Install radio unit into dash" },
      { id: "5d", text: "Connect radio wiring and test" },
    ],
  },
  {
    id: 6,
    phase: "Phase 6 — Glazing, Headliner & Seals (Dave — Frimley)",
    note: "Bundle into a single Dave visit: headliner first, then rear screen, then windscreen. Chrome into rubber on bench first, then cord-pull the assembly into aperture. Dave: 07871 487617.",
    colour: "#6d28d9",
    jobs: [
      { id: "6a", text: "Install headliner (Dave — before screens so he has room to work)" },
      { id: "6b", text: "Fit chrome C-trim into rear window rubber on the bench first", resource: { label: "▶ Window rubber & chrome fitting — YouTube", url: "https://youtu.be/tGMd0CrEQig?si=Uvyb7qG8pJF_JPD4" } },
      { id: "6c", text: "Fit rear window and rubber as an assembly into aperture — cord-pull method", resource: { label: "▶ Window rubber & chrome fitting — YouTube", url: "https://youtu.be/tGMd0CrEQig?si=Uvyb7qG8pJF_JPD4" } },
      { id: "6d", text: "Fit chrome windscreen surround trim into rubber on the bench first", resource: { label: "▶ Window rubber & chrome fitting — YouTube", url: "https://youtu.be/tGMd0CrEQig?si=Uvyb7qG8pJF_JPD4" } },
      { id: "6e", text: "Fit windscreen and rubber as an assembly into aperture — cord-pull method", resource: { label: "▶ Window rubber & chrome fitting — YouTube", url: "https://youtu.be/tGMd0CrEQig?si=Uvyb7qG8pJF_JPD4" } },
      { id: "6f", text: "Check both screens for leaks (garden hose, check inside for drips)" },
      { id: "6g", text: "Install door glass and run channels" },
      { id: "6h", text: "Install door window winding mechanisms" },
      { id: "6i", text: "Install quarterlight assemblies (vent windows)" },
      { id: "6j", text: "Adjust door glass alignment and operation" },
    ],
  },
  {
    id: 7,
    phase: "Phase 7 — Door Seals & Interior Trim",
    note: "Door seals before door cards. Carpet before door cards where they overlap at the sill.",
    colour: "#be123c",
    jobs: [
      { id: "7a", text: "Install door aperture seals (body-to-door rubber)" },
      { id: "7b", text: "Install carpet — front footwells, transmission tunnel, rear" },
      { id: "7c", text: "Install door cards / liners (both sides)" },
      { id: "7d", text: "⚠️ MISSING? — Fit door pull straps / handles to door cards" },
      { id: "7e", text: "⚠️ MISSING? — Install running boards (Wolfsburg West — 111821507/508)", resource: { label: "▶ Running board installation — JBugs", url: "https://www.jbugs.com/product/video-VW-Running-Board-Installation.html" } },
    ],
  },
  {
    id: 8,
    phase: "Phase 8 — Engine Install & Commission",
    note: "Everything else is done. Fit clutch to flywheel, dress the engine, drop it in and commission ready for run-in.",
    colour: "#b45309",
    jobs: [
      { id: "8a", text: "Fit clutch plate and pressure plate to flywheel — use alignment tool, torque bolts in star pattern to 20 ft/lb", resource: { label: "▶ Clutch installation video — JBugs", url: "https://www.jbugs.com/product/video-1971SB-Beetle-Clutch-Installation.html" } },
      { id: "8b", text: "Install all tinware (baffles, fan housing, lower tins)" },
      { id: "8c", text: "Install fuel filter" },
      { id: "8d", text: "Install engine into car, mate to gearbox", resource: { label: "▶ Engine installation video — JBugs", url: "https://www.jbugs.com/product/video-VW-Beetle-Engine-Installation.html" } },
      { id: "8e", text: "Fit heat exchangers / heating boxes" },
      { id: "8f", text: "Install EMPI GT exhaust system" },
      { id: "8g", text: "Connect fuel line, throttle cable, choke cable", resource: { label: "▶ 1966/67 wiring & cable diagram — JBugs", url: "https://www.jbugs.com/VW-Tech-Article-1966-67-Wiring.html" } },
      { id: "8h", text: "Final clutch cable adjustment — 10–15mm freeplay at the pedal", resource: { label: "▶ Clutch adjustment guide — VW Resource", url: "https://www.vw-resource.com/clutch.html" } },
      { id: "8i", text: "Fill engine oil (20W-50 mineral), check all fluid levels" },
      { id: "8j", text: "Commission engine — start, set timing (5° BTDC static), set carb, check for leaks", resource: { label: "▶ Ignition timing guide — VW Resource", url: "https://www.vw-resource.com/timing.html" } },
      { id: "8k", text: "First start — rev to 2,000 RPM immediately, vary between 2,000–4,000 RPM for 15 mins to bed cam and lifters", resource: { label: "▶ First start & break-in — JBugs", url: "https://www.jbugs.com/product/video-vw-super-beetle-engine-start-up.html" } },
      { id: "8l", text: "Check oil pressure, fan belt tension (~10mm deflection), no leaks" },
    ],
  },
  {
    id: 9,
    phase: "Phase 9 — Final Checks, Run-In & Sign-Off",
    note: "Don't skip this phase. Check everything before the first proper drive, then check again after the first heat cycle.",
    colour: "#374151",
    jobs: [
      { id: "9a", text: "Check all lights — indicators, headlamps, tail, brake, reverse", resource: { label: "▶ MOT lighting manual — GOV.UK", url: "https://www.gov.uk/guidance/mot-inspection-manual-for-private-passenger-and-light-commercial-vehicles/4-lighting-and-signalling" } },
      { id: "9b", text: "⚠️ MISSING? — Check/bleed brakes, check brake fluid level" },
      { id: "9c", text: "Check all window seals for water ingress (garden hose test)" },
      { id: "9d", text: "Check heating system operation (cables, flaps, heat exchangers)" },
      { id: "9e", text: "Road test — clutch, steering feel, no leaks, brakes pull straight" },
      { id: "9f", text: "Book and complete front wheel tracking at a garage — immediately after road test" },
      { id: "9g", text: "Torque check critical fasteners after first heat cycle" },
      { id: "9h", text: "Begin run-in — vary revs, avoid sustained high speed, first oil change at 500 miles", resource: { label: "▶ Engine break-in guide — VW Resource", url: "https://www.vw-resource.com/engine_break_in.html" } },
    ],
  },
];

const STORAGE_KEY = "beetle-checklist-v1";

export default function App() {
  const totalJobs = phases.reduce((acc, p) => acc + p.jobs.length, 0);

  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [saveFlash, setSaveFlash] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
      setSaveFlash(true);
      const t = setTimeout(() => setSaveFlash(false), 1000);
      return () => clearTimeout(t);
    } catch {}
  }, [checked]);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / totalJobs) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f2", fontFamily: "'Courier New', Courier, monospace", color: "#1a1a1a" }}>
      {/* Header */}
      <div style={{ background: "#1a1a1a", color: "#faf7f2", padding: "32px 24px 24px", borderBottom: "4px solid #b45309", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.03) 24px, rgba(255,255,255,0.03) 25px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#b45309", marginBottom: 8, textTransform: "uppercase" }}>
            Workshop Job Card — 1967 VW Beetle 1500
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: "bold", letterSpacing: 1, lineHeight: 1.2 }}>
            RESTORATION ORDER OF WORKS
          </h1>
          <div style={{ fontSize: 11, color: "#999", marginTop: 6, letterSpacing: 2 }}>
            AUG 1966 BUILD · 12V · 1641CC TWIN PORT · ENGINE LAST
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#aaa", marginBottom: 6, letterSpacing: 2 }}>
              <span>PROGRESS</span>
              <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: saveFlash ? "#4ade80" : "transparent", transition: "color 0.2s" }}>saved ✓</span>
                <span>{doneCount}/{totalJobs} — {pct}%</span>
              </span>
            </div>
            <div style={{ height: 6, background: "#333" }}>
              <div style={{ height: 6, width: `${pct}%`, background: "#b45309", transition: "width 0.3s ease" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 16px 48px" }}>
        {phases.map((phase) => {
          const phaseDone = phase.jobs.filter((j) => checked[j.id]).length;
          const phaseComplete = phaseDone === phase.jobs.length;
          return (
            <div key={phase.id} style={{ marginBottom: 28, border: `1px solid ${phaseComplete ? "#15803d" : "#ddd"}`, background: phaseComplete ? "#f0fdf4" : "#fff", transition: "background 0.3s, border-color 0.3s" }}>
              <div style={{ borderLeft: `5px solid ${phase.colour}`, padding: "14px 16px 10px", borderBottom: "1px solid #eee", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>{phase.phase}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4, lineHeight: 1.5, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{phase.note}</div>
                </div>
                <div style={{ flexShrink: 0, fontSize: 11, fontWeight: "bold", letterSpacing: 1, color: phaseComplete ? "#15803d" : "#999", whiteSpace: "nowrap", paddingTop: 2 }}>{phaseDone}/{phase.jobs.length}</div>
              </div>
              <div>
                {phase.jobs.map((job, i) => {
                  const isWarning = job.text.startsWith("⚠️");
                  const done = !!checked[job.id];
                  return (
                    <div key={job.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 16px", borderBottom: i < phase.jobs.length - 1 ? "1px solid #f0ede8" : "none", background: done ? "#f9fafb" : isWarning ? "#fffbeb" : "transparent" }}>
                      <div onClick={() => toggle(job.id)} style={{ width: 18, height: 18, flexShrink: 0, marginTop: 3, cursor: "pointer", border: `2px solid ${done ? phase.colour : isWarning ? "#d97706" : "#ccc"}`, background: done ? phase.colour : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", userSelect: "none" }}>
                        {done && (
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <polyline points="1.5,5 4,7.5 8.5,2" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span onClick={() => toggle(job.id)} style={{ fontSize: 10, color: "#bbb", letterSpacing: 1, marginRight: 6, textTransform: "uppercase", cursor: "pointer", userSelect: "none" }}>{job.id.toUpperCase()}</span>
                        <span onClick={() => toggle(job.id)} style={{ fontSize: 13, color: done ? "#aaa" : isWarning ? "#92400e" : "#1a1a1a", textDecoration: done ? "line-through" : "none", lineHeight: 1.5, cursor: "pointer", userSelect: "none" }}>{job.text}</span>
                        {job.resource && (
                          <span style={{ display: "inline-block", marginLeft: 8 }}>
                            <a href={job.resource.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontSize: 10, color: "#2563eb", textDecoration: "none", fontFamily: "'Courier New', monospace", border: "1px solid #bfdbfe", borderRadius: 2, padding: "1px 6px", background: "#eff6ff", whiteSpace: "nowrap", verticalAlign: "middle" }}>
                              {job.resource.label}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: 16, fontSize: 10, color: "#999", letterSpacing: 2, textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
          <span>August 1966 · GU12 · Progress saves automatically</span>
          <span>⚠️ = Flagged · ▶ = Guide / video</span>
        </div>
      </div>
    </div>
  );
}
