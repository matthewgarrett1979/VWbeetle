import { useState, useEffect, useCallback } from "react";
import Checklist from "./Checklist.jsx";

const DRIVE_URL = "https://drive.google.com/drive/folders/15H1ICgPyXokmRCnPz8n1pw360WBuNr59?usp=drive_link";

const S = {
  font: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  black: "#111111",
  cream: "#f2efe8",
  darkCream: "#e8e4db",
  red: "#cc0000",
  border: "2px solid #111",
  ink: "#1a1a1a",
};

function BeetleSVG({ width = 320, color = "#111111", opacity = 1 }) {
  return (
    <svg
      width={width}
      viewBox="0 0 520 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      aria-label="Classic Volkswagen Beetle silhouette"
    >
      {/* Main silhouette */}
      <path
        d="
          M42 182
          C48 160, 58 142, 76 126
          C94 110, 116 98, 142 92
          C152 72, 174 56, 204 48
          C242 38, 292 38, 334 48
          C375 58, 410 78, 436 104
          C454 107, 470 114, 484 126
          C496 137, 503 150, 506 164
          L484 164
          C478 150, 464 142, 446 142
          C425 142, 409 152, 402 172
          L336 172
          C330 149, 308 131, 280 131
          C251 131, 228 149, 221 172
          L134 172
          C128 149, 106 132, 78 132
          C53 132, 34 148, 28 170
          L18 170
          C20 164, 22 158, 24 152
          C28 144, 33 136, 39 128
          C36 145, 37 162, 42 182
          Z
        "
        fill={color}
      />

      {/* Roof and cabin cut-outs */}
      <path
        d="
          M142 92
          C152 72, 174 56, 204 48
          C242 38, 292 38, 334 48
          C374 58, 406 76, 432 102
          C408 100, 390 98, 368 98
          C352 77, 325 63, 292 58
          C252 52, 214 55, 186 68
          C165 78, 149 92, 142 92
          Z
        "
        fill={color}
      />

      {/* Window openings */}
      <path
        d="
          M158 96
          C165 80, 181 69, 202 63
          C233 55, 266 54, 294 59
          C320 64, 341 76, 356 95
          L348 96
          C342 85, 330 77, 314 73
          C287 67, 255 67, 226 72
          C198 78, 177 89, 165 105
          C160 109, 154 110, 149 108
          C146 104, 148 99, 158 96
          Z
        "
        fill="#EDE7DB"
      />

      <path
        d="
          M367 99
          C386 100, 404 102, 421 106
          C409 92, 394 81, 377 73
          C365 68, 352 70, 347 79
          C344 86, 347 93, 355 97
          C359 99, 363 99, 367 99
          Z
        "
        fill="#EDE7DB"
      />

      {/* Rear quarter window opening */}
      <path
        d="
          M132 99
          C117 102, 103 109, 90 119
          C79 128, 72 137, 68 147
          C66 153, 69 158, 76 159
          L114 159
          C124 159, 131 153, 131 143
          L131 106
          C131 103, 131 101, 132 99
          Z
        "
        fill="#EDE7DB"
      />

      {/* Door window opening */}
      <path
        d="
          M143 105
          C148 96, 160 88, 175 82
          C200 73, 230 70, 258 71
          C276 72, 291 76, 304 83
          C312 88, 317 95, 318 103
          L318 143
          C318 152, 311 159, 302 159
          L162 159
          C151 159, 143 151, 143 140
          Z
        "
        fill="#EDE7DB"
      />

      {/* Front screen opening */}
      <path
        d="
          M326 103
          C326 92, 332 84, 344 80
          C357 76, 373 77, 388 84
          C402 91, 414 101, 424 114
          C427 118, 427 122, 425 125
          C423 128, 419 129, 414 129
          L340 129
          C332 129, 326 122, 326 114
          Z
        "
        fill="#EDE7DB"
      />

      {/* Wing lines / bonnet accents */}
      <path
        d="M339 173 C345 154, 357 140, 374 129 C394 116, 418 112, 447 116"
        stroke="#EDE7DB"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M363 173 C370 150, 384 131, 403 118 C421 106, 443 101, 466 103"
        stroke="#EDE7DB"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Door shut lines */}
      <path
        d="M141 112 L141 173"
        stroke="#EDE7DB"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M216 108 L216 173"
        stroke="#EDE7DB"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Running board line */}
      <path
        d="M116 176 L244 176"
        stroke="#EDE7DB"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Front bumper */}
      <rect x="338" y="160" width="112" height="16" rx="8" fill="#EDE7DB" />

      {/* Headlights */}
      <circle cx="366" cy="140" r="16" fill="#EDE7DB" />
      <circle cx="472" cy="142" r="16" fill="#EDE7DB" />

      {/* Small lights */}
      <circle cx="400" cy="161" r="8" fill="#EDE7DB" />
      <circle cx="456" cy="161" r="7" fill="#EDE7DB" />

      {/* Wheels */}
      <circle cx="78" cy="180" r="34" fill={color} />
      <circle cx="78" cy="180" r="24" fill="#EDE7DB" />
      <circle cx="78" cy="180" r="9" fill={color} />

      <circle cx="286" cy="180" r="37" fill={color} />
      <circle cx="286" cy="180" r="26" fill="#EDE7DB" />
      <circle cx="286" cy="180" r="10" fill={color} />

      <circle cx="454" cy="182" r="34" fill={color} />
    </svg>
  );
}

function VWRoundel({ size = 48, invert = false }) {
  // Period-style dark VW blue rather than modern bright blue
  const vwBlue1966ish = "#0D4671";
  const cream = "#F5E9D8";
  const ink = "#111111";

  const bg = invert ? cream : vwBlue1966ish;
  const fg = invert ? vwBlue1966ish : cream;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="Volkswagen roundel">
      {/* Outer disc */}
      <circle cx="50" cy="50" r="48" fill={bg} />

      {/* Outer ring */}
      <circle cx="50" cy="50" r="38" fill="none" stroke={fg} strokeWidth="3" />

      {/* V */}
      <polyline
        points="35,30 50,58 65,30"
        fill="none"
        stroke={fg}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* W */}
      <polyline
        points="28,42 38,68 50,52 62,68 72,42"
        fill="none"
        stroke={fg}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Divider */}
      <line x1="28" y1="56" x2="72" y2="56" stroke={fg} strokeWidth="2.5" />
    </svg>
  );
}

// Each slide is a fully rendered DDB-style print ad
const ADS = [
  {
    headline: "Think small.",
    subhead: "1967 Volkswagen Beetle",
    body: "Our little car isn't so much of a novelty any more. A couple of dozen college kids don't try to squeeze inside it. The local greasy kid stuff doesn't mark it up. Nobody even stares at our shape. In fact, some people who drive our little flivver don't even think 32 miles to the gallon is going\u00a0much of a novelty. Or paying less for insurance. Or never needing anti-freeze. Or racking up 40,000 miles on a set of tyres. That's because once you get used to some of our economies, you don't even think about them any more. Except when you\u00a0squeeze into a small parking spot. Or renew your small insurance. Or pay a small repair bill. Or trade in your old VW for a new one. Think it over.",
    layout: "small-car", // car small, top left, lots of white space
  },
  {
    headline: "Lemon.",
    subhead: "Volkswagen quality control",
    body: "This Volkswagen missed the boat. The chrome strip on the glove compartment is blemished and must be replaced. Chances are you wouldn't have noticed it; Inspector Kurt Kroner did. There are 3,389 men at our Wolfsburg factory with only one job: to inspect Volkswagens at each stage of production. Every shock absorber is tested, every windshield scanned. VW's have been rejected for surface scratches barely visible to the eye. Final inspection is\u00a0really something! VW inspectors run each car off the line onto the Funktionsprüfstand, one of those unhuman rolling road beds, and\u00a0do\u00a0120 checks, one by one. This preoccupation with detail means the VW lasts longer and requires less maintenance, by and large, than other cars. It also means a used VW depreciates less than any other car. We pluck the lemons; you get the plums.",
    layout: "top-centre",
  },
  {
    headline: "It's ugly, but\u00a0it\u00a0gets you there.",
    subhead: "Volkswagen reliability",
    body: "The Volkswagen isn't much to look at. But it will get you to where you're going — and back — without the headaches. The engine is in the back, the heater is unusual, the shape is odd. The car will go 70 miles an hour all day without protest. 32 miles per gallon without trying. And it'll start in the morning when your neighbour's streamlined steel sculpture won't.",
    layout: "left-align",
  },
  {
    headline: "After we paint\u00a0the car,\u00a0we paint the\u00a0paint.",
    subhead: "Volkswagen craftsmanship",
    body: "Every Volkswagen is given a full 23-step paint job. First, the metal is treated so it won't rust. Then, successive layers of paint are applied — and baked — until we're done. In all, there are seven coats of paint on a VW. That's about the same number you'd find on a piece of fine jewellery. Which is not such an odd comparison. After all, a Volkswagen is meant to last.",
    layout: "right-align",
  },
  {
    headline: "Restoration\u00a0in progress.",
    subhead: "VIN 117070752 — GU12",
    body: "Manufactured 9th August 1966 at Wolfsburg. Delivered to Ramsgate, Great Britain, 11th August 1966. Original finish L633 VW Blue. Resprayed L519 VW Blue. Current engine 1641cc twin port. Nine phases of restoration work, carried out with the same obsessive attention to detail that Kurt Kroner would approve of. Almost.",
    layout: "restoration",
    isOwn: true,
  },
];

function AdSlide({ ad, visible }) {
  const isSmall = ad.layout === "small-car";
  const isTop = ad.layout === "top-centre";
  const isOwn = ad.isOwn;

  return (
    <div style={{
      position: "absolute", inset: 0,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.6s ease",
      background: S.cream,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      // Subtle paper texture via repeating gradient
      backgroundImage: `repeating-linear-gradient(
        0deg, transparent, transparent 28px,
        rgba(0,0,0,0.012) 28px, rgba(0,0,0,0.012) 29px
      )`,
    }}>
      {/* Main ad area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 56px 28px", maxWidth: 900, margin: "0 auto", width: "100%" }}>

        {isTop || isSmall ? (
          // Small car centred at top with lots of white space — "Think small" layout
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: isSmall ? "flex-start" : "center", marginBottom: 8, paddingTop: 8 }}>
              <BeetleSVG width={isSmall ? 200 : 240} opacity={0.85} />
            </div>
            <div style={{ flex: 1 }} />
          </div>
        ) : (
          // Larger car for other layouts
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <BeetleSVG width={300} opacity={0.85} />
          </div>
        )}

        {/* Headline — the hero element */}
        <div style={{
          fontFamily: S.font,
          fontSize: "clamp(22px, 4.5vw, 52px)",
          fontWeight: 900,
          color: S.ink,
          letterSpacing: "-1.5px",
          lineHeight: 1.0,
          marginBottom: 20,
          maxWidth: 680,
        }}>
          {ad.headline}
        </div>

        {/* Dividing rule */}
        <div style={{ width: "100%", height: 1, background: S.ink, marginBottom: 16, opacity: 0.3 }} />

        {/* Body copy — small, tight, period-correct */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 32, alignItems: "flex-start" }}>
          <div style={{
            fontFamily: S.font,
            fontSize: 11,
            color: "#333",
            lineHeight: 1.75,
            maxWidth: 600,
            columnCount: 2,
            columnGap: 28,
          }}>
            {ad.body}
          </div>
          {/* VW roundel — always bottom right of copy */}
          <div style={{ flexShrink: 0, alignSelf: "flex-end" }}>
            <VWRoundel size={52} />
          </div>
        </div>

      </div>

      {/* Bottom bar — newspaper-style */}
      <div style={{ borderTop: `2px solid ${S.ink}`, padding: "8px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", background: S.ink }}>
        <div style={{ fontFamily: S.font, fontSize: 9, color: "#aaa", letterSpacing: 4, textTransform: "uppercase" }}>
          {ad.subhead}
        </div>
        <div style={{ fontFamily: S.font, fontSize: 9, color: "#666", letterSpacing: 3, textTransform: "uppercase" }}>
          {isOwn ? "VIN 117070752 · GU12 · 1966" : "Volkswagen · 1966"}
        </div>
      </div>
    </div>
  );
}

function Slideshow() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((idx) => { setCurrent(idx); }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % ADS.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "clamp(480px, 70vh, 640px)", overflow: "hidden", background: S.cream, borderBottom: S.border }}>
      {ADS.map((ad, i) => (
        <AdSlide key={i} ad={ad} visible={i === current} />
      ))}

      {/* Dot navigation */}
      <div style={{ position: "absolute", bottom: 52, right: 56, display: "flex", gap: 8, zIndex: 10 }}>
        {ADS.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? S.ink : "rgba(0,0,0,0.2)",
              cursor: "pointer",
              transition: "all 0.3s",
              border: "1px solid rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>

      {/* Arrow nav */}
      {["‹", "›"].map((arrow, idx) => (
        <div
          key={arrow}
          onClick={() => goTo(idx === 0 ? (current - 1 + ADS.length) % ADS.length : (current + 1) % ADS.length)}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            [idx === 0 ? "left" : "right"]: 16,
            width: 36,
            height: 36,
            border: S.border,
            background: S.cream,
            color: S.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            cursor: "pointer",
            userSelect: "none",
            zIndex: 10,
            fontFamily: S.font,
          }}
        >
          {arrow}
        </div>
      ))}
    </div>
  );
}

function StatBox({ number, label }) {
  return (
    <div style={{ borderLeft: `4px solid ${S.ink}`, paddingLeft: 16 }}>
      <div style={{ fontFamily: S.font, fontSize: 40, fontWeight: 900, color: S.ink, lineHeight: 1, letterSpacing: -2 }}>{number}</div>
      <div style={{ fontFamily: S.font, fontSize: 9, color: "#888", letterSpacing: 4, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function NavCard({ icon, headline, body, cta, onClick, href }) {
  const [hov, setHov] = useState(false);
  const inner = (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: S.border,
        padding: "32px 28px",
        cursor: "pointer",
        background: hov ? S.ink : S.cream,
        transition: "background 0.15s",
        height: "100%",
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 18 }}>{icon}</div>
      <div style={{ fontFamily: S.font, fontSize: 16, fontWeight: 900, color: hov ? S.cream : S.ink, letterSpacing: -0.5, marginBottom: 10, textTransform: "uppercase", lineHeight: 1.1 }}>{headline}</div>
      <div style={{ fontFamily: S.font, fontSize: 11, color: hov ? "#aaa" : "#555", lineHeight: 1.8, marginBottom: 20 }}>{body}</div>
      <div style={{ fontFamily: S.font, fontSize: 10, fontWeight: 700, color: hov ? S.cream : S.red, letterSpacing: 3, textTransform: "uppercase" }}>{cta} →</div>
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>{inner}</a>;
  return inner;
}

function HomePage({ setPage }) {
  const totalJobs = 45;
  const doneCount = (() => {
    try { return Object.values(JSON.parse(localStorage.getItem("beetle-checklist-v1")) || {}).filter(Boolean).length; }
    catch { return 0; }
  })();
  const pct = Math.round((doneCount / totalJobs) * 100);
  const remaining = totalJobs - doneCount;

  return (
    <div style={{ background: S.cream, fontFamily: S.font }}>
      <Slideshow />

      {/* Stats strip */}
      <div style={{ borderBottom: S.border, background: S.cream }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px", display: "flex", gap: 48, flexWrap: "wrap" }}>
          <StatBox number={`${pct}%`} label="Complete" />
          <StatBox number={doneCount} label="Jobs done" />
          <StatBox number={remaining} label="Jobs left" />
          <StatBox number="9" label="Phases" />
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 5, background: S.darkCream }}>
        <div style={{ height: 5, width: `${pct}%`, background: S.red, transition: "width 0.5s" }} />
      </div>

      {/* Nav cards */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 24px" }}>
        <div style={{ fontFamily: S.font, fontSize: 9, letterSpacing: 6, color: "#999", textTransform: "uppercase", marginBottom: 24 }}>The project.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 2 }}>
          <NavCard icon="✅" headline="Work Checklist" body="Nine phases. Every job in order. Video guides and references linked." cta="Open checklist" onClick={() => setPage("checklist")} />
          <NavCard icon="📁" headline="Build Folder" body="Photos and documents from the restoration. Add photos directly in Google Drive." cta="Open Drive" href={DRIVE_URL} />
        </div>
      </div>

      {/* Spec table */}
      <div style={{ borderTop: S.border, borderBottom: S.border, background: S.ink }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ fontFamily: S.font, fontSize: 9, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 32 }}>Technical specification.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "24px 32px" }}>
            {[
              ["VIN", "117070752"],
              ["Product", "1500 Sedan — RHD"],
              ["Model year", "1967"],
              ["Manufactured", "9th August 1966"],
              ["Delivered", "11th August 1966"],
              ["Delivered in", "Ramsgate, GB"],
              ["Original paint", "L633 VW Blue"],
              ["Current colour", "L519 VW Blue (resprayed)"],
              ["Interior", "86 / Platinum leatherette"],
              ["Gearbox", "4-speed manual"],
              ["Original engine", "H / 4-Cyl 1.5L / 44hp"],
              ["Current engine", "1641cc Twin Port"],
              ["Carburettor", "Solex PICT 34"],
              ["Exhaust", "EMPI GT Two Tip"],
              ["Tyres", "5.60-15 tubeless"],
              ["Wheelbase", "2400mm"],
              ["Weight", "800kg (empty)"],
              ["Spec M348", "Equipment for GB"],
              ["Spec M042", "British regulations"],
              ["Certificate", "Wolfsburg 30 Apr 2025"],
              ["Location", "GU12"],
            ].map(([label, value]) => (
              <div key={label} style={{ borderLeft: `2px solid ${S.red}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: S.cream, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: S.font, fontSize: 12, color: "#aaa", letterSpacing: 4, textTransform: "uppercase" }}>VW Beetle 1966 Restoration 2024–2026 · Surrey</div>
        <VWRoundel size={34} />
      </div>
    </div>
  );
}

function Header({ page, setPage }) {
  return (
    <div style={{ background: S.cream, borderBottom: S.border, position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <VWRoundel size={30} />
          <div>
            <div style={{ fontFamily: S.font, fontSize: 11, fontWeight: 900, color: S.ink, letterSpacing: 0, lineHeight: 1 }}>1967 BEETLE</div>
            <div style={{ fontFamily: S.font, fontSize: 8, color: "#999", letterSpacing: 3, textTransform: "uppercase" }}>Restoration</div>
          </div>
        </div>
        <nav style={{ display: "flex" }}>
          {[{ id: "home", label: "Home" }, { id: "checklist", label: "Checklist" }].map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ background: page === item.id ? S.ink : "transparent", color: page === item.id ? S.cream : "#888", border: "none", borderLeft: "1px solid #ccc", padding: "0 16px", height: 52, cursor: "pointer", fontFamily: S.font, fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", transition: "all 0.15s" }}>
              {item.label}
            </button>
          ))}
          <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{ borderLeft: "1px solid #ccc", padding: "0 16px", height: 52, display: "flex", alignItems: "center", fontFamily: S.font, fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", color: "#888" }}>
            Photos ↗
          </a>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div>
      <Header page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "checklist" && <Checklist />}
    </div>
  );
}
