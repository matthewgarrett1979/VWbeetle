import { useState, useEffect, useRef } from "react";

// ─── BUILD RECORD — Professional workshop works (GVU 798D, Mar–Oct 2025) ─────
// All items completed by bodyshop. Read-only historical record.
const buildRecord = [
  {
    id: "br1",
    phase: "Strip Down",
    date: "Mar 2025",
    jobs: [
      "Put vehicle on ramp. Removed fuel tank, washer bottle, horn, all seats and carpet",
      "Removed front and rear bumpers, all wings, both doors, both running boards, seatbelts",
      "Disconnected all wiring looms, brake feed pipes and steering column",
      "Split body from chassis — body lifted and moved to separate work area",
      "Removed engine from chassis",
    ],
  },
  {
    id: "br2",
    phase: "Chassis & Floor Pan",
    date: "Mar 2025",
    jobs: [
      "Wire wheeled top and underside of chassis. Welded over holes. Covered joins with sprayable sealer",
      "Painted chassis in black POR15 — two coats",
      "Cut away and replaced both heater channels (n/s and o/s)",
      "Cut away and replaced rear crossmember sections",
      "Welded body mount captives. Corrected misaligned body mount holes on both heater channels",
      "Made and welded heating pipes. Welded throttle pedal bracket correctly. Welded frame head cover plate",
      "Applied underbody seal to underside of chassis",
    ],
  },
  {
    id: "br3",
    phase: "Body Shell — Structural Repairs",
    date: "Mar–May 2025",
    jobs: [
      "Cut away and replaced new bulkhead panel — trimmed, punched, welded and ground back",
      "Repaired and replaced bottom sections of both A posts (n/s and o/s)",
      "Repaired n/s and o/s B posts — cut away old repairs, made new sections, welded in",
      "Replaced both front quarter panels — fettled, aligned, welded and ground back",
      "Replaced n/s rear quarter panel — trimmed, joggled, welded top and bottom edges",
      "Replaced o/s rear quarter panel — cut away old, trimmed new, welded working slowly to prevent warping",
      "Replaced boot panel — trimmed top edge, spot welded bottom and sides, added blanking plate",
      "Replaced rear valance — ground away old, offered up new, clamped and welded",
      "Fitted rear suspension panels both sides — trimmed, tacked and fully welded",
      "Repaired inner rear quarter panels both sides",
      "Made and welded bonnet seal channel — shaped with shrinker/stretcher, spot welded on",
      "Repaired rear panel and rear valance fitment — manipulated, bent and welded",
      "Fitted front bumper mounts from donor vehicle — clamped and welded in correct position",
      "Welded up all small holes and imperfections throughout body shell",
    ],
  },
  {
    id: "br4",
    phase: "Protection & Sealing",
    date: "Jun–Jul 2025",
    jobs: [
      "Ground back all welds throughout — front to rear, inside and out",
      "Fibreglassed over internal welds on rear inner arches, A posts and boot area — sanded back",
      "Seam sealed all panel joins at front and rear of vehicle",
      "Drilled and fitted bakelite grommets with M6 rivnuts",
      "DA sanded floor pan. Applied two coats black POR15 to floor pan",
      "Keyed up all areas for Raptor coating",
      "Applied Raptor to boot area, heater channels, bulkhead, spare wheel well, all arches and engine bay",
    ],
  },
  {
    id: "br5",
    phase: "Mechanical Rebuild",
    date: "Jul 2025",
    jobs: [
      "Removed and replaced all four trailing arms — heated out old ball joints, pressed in new, painted POR15",
      "Replaced all trailing arm seals. Fitted all ball joint boots",
      "Wire wheeled and painted beam black POR15. Cut away old steering stop",
      "Fitted new steering box and coupler. Fitted new track rods with new track rod ends",
      "Fitted new steering damper. Fitted new front hubs with discs",
      "Fitted new master cylinder. Made new hard brake lines. Fitted pedal assembly",
      "Fitted new front shocks",
      "Lowered body onto chassis — fitted and torqued all body bolts",
      "Fitted new engine bay seal, gearbox seal, foam body seal",
      "Fitted engine and connected all wiring. Ran new fuel lines from hard line to pump to carb",
      "Connected throttle cable. Bled brake system. Connected and tested horn",
      "Fitted heat exchangers with new clamps, gaskets and copper nuts",
      "Fitted heat exchanger cables, heat control cables, flap cables and heating pipes",
      "Filled fuel tank and ran vehicle — first drive out of workshop",
      "Fitted new rear door cards, carpet (most), front seats, rear seat, handbrake lever",
      "Fitted wiring for horn down column. Fitted footlight button",
    ],
  },
  {
    id: "br6",
    phase: "Bodywork & Paint Prep",
    date: "Jul–Sep 2025",
    jobs: [
      "Repaired o/s rear quarter panel — fibreglass, fill, sand",
      "Stripped both side doors fully. Removed both rear side windows, front windscreen and rear screen",
      "Started sanding scuttle panel, front door shuts, bonnet, doors and boot lid",
      "Repaired front quarter panels. Welded plug holes on o/s front quarter and A post",
      "Replaced door hinge pins — pressed out seized pins, reamed to 8.2mm, commissioned custom 8.4mm stainless pins, pressed in",
      "Repaired n/s and o/s doors — ground, filled, primed inside and out",
      "Repaired bonnet — filler work, rub down, prime. Multiple cycles 320g / 500g",
      "Raptored insides of bonnet and front wings",
      "Masked entire vehicle. Epoxy primed all panels. Spray filled and rubbed down — multiple stages",
      "Painted insides of both doors",
    ],
  },
  {
    id: "br7",
    phase: "Paint & Final Assembly",
    date: "Sep–Oct 2025",
    jobs: [
      "Painted bonnet and both doors — flatted with 2000g and 3000g, polished",
      "Painted both front wings. Painted both rear wings. Flatted and polished all panels",
      "Machine polished roof. Compounded roof. Polished full car",
      "Fitted all windows — chrome into rubber on bench, cord-pulled into apertures (rear, front, side, quarterlights)",
      "Door alignment — made custom shims for door hinges, adjusted until no catching",
      "Fitted engine lid, engine lid catch, bonnet, bonnet catch, bonnet seal and engine lid seal",
      "Fitted all door handles (inner), door catches. Checked operation",
      "Fitted rear lamps to wings. Tested all lights — replaced 1x indicator bulb",
      "Fitted new gas struts for bonnet. Fitted new bumper seals",
      "Fitted n/s rear wing beading. Torqued wheels",
      "Replaced both rear brake slave cylinders. New shoes, brake adjusters, handbrake arms with new pins",
      "Bled rear brake system. Adjusted brakes and handbrake",
      "Replaced front shocks",
      "Cavity wax / wax oil — heater channels, doors, rear quarters, A posts",
      "Fitted blanking grommets, screenwash bottle, steering box cover",
      "Fitted tailpipes with new clamps. Fitted wing mirrors",
      "Removed and replaced faulty indicator switch — tested all lights",
      "Fitted steering stops — adjusted to prevent tyre contact on full lock",
      "Adjusted tracking. NOTE: full laser tracking recommended at tyre specialist",
      "NOTE: n/s rear drum threads stripped — rear drums and shoes replaced.",
      "NOTE: fuel tank has rust internally — fuel tank replaced.",
      "NOTE: engine idles high — engine and carb replacement outstanding (see Phase 8).",
      "NOTE: tyres perishing — replacement required",
      "Car driven in yard — drives, stops and steers. Not fully road tested",
    ],
  },
];

const phases = [
  {
    id: 1,
    phase: "Phase 1 — Gearbox & Inspection",
    note: "Car is on 4 axle stands — full access underneath. Do everything now before it comes down.",
    colour: "#111",
    jobs: [
      { id: "1a", text: "Replace gearbox input shaft oil seal (113-311-113A)" },
      { id: "1b", text: "Install new release bearing into bellhousing" },
      { id: "1c", text: "Route and initially fit clutch cable" },
      { id: "1d", text: "Gearbox oil change — drain, inspect magnetic drain plug, refill with SAE 90 gear oil (approx 2.5 litres)" },
      { id: "1e", text: "Check gearbox output shaft seals both sides — replace if weeping" },
      { id: "1f", text: "Inspect CV joint boots and axle gaiters both sides — replace if cracked or split" },
      { id: "1g", text: "Inspect front wheel bearings — repack or replace if any play or noise" },
      { id: "1h", text: "Inspect rear wheel bearings — repack or replace if any play or noise" },
      { id: "1i", text: "Check all flexible brake hoses — replace any that are perished or swollen" },
      { id: "1j", text: "Check front brake calipers for leaks or piston seizure" },
      { id: "1k", text: "Check steering rod end boots — replace any that are cracked or split" },
      { id: "1l", text: "Inspect fuel lines full length — replace any rubber sections showing age" },
      { id: "1m", text: "Check clutch cable full length — look for fraying or outer casing damage" },
      { id: "1n", text: "Inspect all underside wiring for chafing damage or missing clips" },
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
  {
    id: 10,
    phase: "Phase 10 — 2026 Works",
    note: "Final finishing works planned for 2026 — paint, headlining and interior to complete the restoration.",
    colour: "#111",
    jobs: [
      { id: "10a", text: "Strip roof to bare metal — remove all existing paint and filler back to steel" },
      { id: "10b", text: "Prep and prime roof — epoxy prime, spray fill, flat and cut" },
      { id: "10c", text: "Respray roof — colour coat and lacquer to match body" },
      { id: "10d", text: "Strip engine lid to bare metal — remove all existing paint and filler back to steel" },
      { id: "10e", text: "Prep and prime engine lid — epoxy prime, spray fill, flat and cut" },
      { id: "10f", text: "Respray engine lid — colour coat and lacquer to match body" },
      { id: "10g", text: "Headlining — book Dave the Trimmer (07871 487617), fit new headliner" },
      { id: "10h", text: "Interior dash respray — strip, prep and respray dash to match interior" },
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

const PIN = "140279"; // Change this to your preferred PIN
const PIN_KEY = "beetle-checklist-unlocked";

function PINPrompt({ onUnlock }) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);

  const attempt = (val) => {
    if (val === PIN) {
      sessionStorage.setItem(PIN_KEY, "1");
      onUnlock();
    } else if (val.length === PIN.length) {
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  };

  const press = (digit) => {
    const next = input + digit;
    setInput(next);
    if (next.length === PIN.length) attempt(next);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: S.black, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: S.font }}>
      <div style={{ fontSize: 10, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 32 }}>Checklist PIN</div>

      {/* PIN dots */}
      <div style={{ display: "flex", gap: 12, marginBottom: 40, animation: shake ? "shake 0.4s ease" : "none" }}>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
        {Array.from({ length: PIN.length }).map((_, i) => (
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
        View only — enter PIN to tick jobs
      </div>
    </div>
  );
}

export default function Checklist() {
  const BUILD_RECORD_TOTAL = buildRecord.reduce((acc, p) => acc + p.jobs.length, 0); // all completed
  const phaseJobsTotal = phases.reduce((acc, p) => acc + p.jobs.length, 0);
  const totalJobs = BUILD_RECORD_TOTAL + phaseJobsTotal;
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(PIN_KEY) === "1");
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
    <div style={{ minHeight: "100vh", background: S.white, fontFamily: S.font }}>
      {/* PIN prompt overlay */}
      {showPin && <PINPrompt onUnlock={() => { setUnlocked(true); setShowPin(false); }} />}
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
              <div
                onClick={() => unlocked ? (sessionStorage.removeItem(PIN_KEY), setUnlocked(false)) : setShowPin(true)}
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
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 0" }}>
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
          <span>Volkswagen · Beetle · 1966 · Resto '26 · 60 Years Anniversary</span>
        </div>
      </div>
    </div>
  );
}
