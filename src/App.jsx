import { useState, useEffect, useCallback } from "react";
import Checklist from "./Checklist.jsx";

const DRIVE_URL = "https://drive.google.com/drive/folders/15H1ICgPyXokmRCnPz8n1pw360WBuNr59?usp=drive_link";

const S = {
  font: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  black: "#111111",
  white: "#f5f5f0",
  red: "#cc0000",
  border: "2px solid #111",
};

// Slideshow — placeholder VW-era style images
// Replace src values with your own Google Drive direct image URLs:
// 1. In Drive, right-click image → Share → change to "Anyone with link"
// 2. Copy link: https://drive.google.com/file/d/FILE_ID/view
// 3. Replace with: https://drive.google.com/uc?id=FILE_ID&export=view
const SLIDES = [
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90", caption: "Think small." },
  { url: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1400&q=90", caption: "It still works." },
  { url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1400&q=90", caption: "Restoration in progress." },
];

function VWBadge({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill={S.black} />
      <circle cx="50" cy="50" r="38" fill="none" stroke={S.white} strokeWidth="2" />
      {/* VW */}
      <text x="50" y="62" textAnchor="middle" fill={S.white} fontSize="32" fontFamily="'Inter', Helvetica, Arial" fontWeight="900" letterSpacing="-2">VW</text>
    </svg>
  );
}

function Slideshow() {
  const [current, setCurrent] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const goTo = useCallback((idx) => {
    setOpacity(0);
    setTimeout(() => { setCurrent(idx); setOpacity(1); }, 500);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [current, goTo]);

  return (
    <div style={{ position: "relative", width: "100%", height: "80vh", minHeight: 480, maxHeight: 700, overflow: "hidden", background: S.black }}>
      <img
        src={SLIDES[current].url}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: opacity * 0.55, transition: "opacity 0.5s ease", display: "block" }}
      />
      {/* Big white ad-style overlay */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 0 0 0" }}>
        {/* Bottom white strip — classic DDB style */}
        <div style={{ background: S.white, padding: "32px 48px 28px", borderTop: S.border }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontFamily: S.font, fontSize: 11, letterSpacing: 6, color: "#999", textTransform: "uppercase", marginBottom: 8 }}>
                1967 Volkswagen Beetle
              </div>
              <div
                style={{
                  fontFamily: S.font,
                  fontSize: "clamp(28px, 6vw, 56px)",
                  fontWeight: 900,
                  color: S.black,
                  lineHeight: 0.95,
                  letterSpacing: -2,
                }}
              >
                {SLIDES[current].caption}
              </div>
            </div>
            <VWBadge size={64} />
          </div>
        </div>
      </div>

      {/* Dot nav */}
      <div style={{ position: "absolute", top: 20, right: 24, display: "flex", gap: 8 }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{ width: i === current ? 28 : 8, height: 8, borderRadius: 4, background: i === current ? S.white : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "all 0.3s" }} />
        ))}
      </div>

      {/* Add photos link */}
      <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{ position: "absolute", top: 20, left: 24, fontFamily: S.font, fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", background: "rgba(0,0,0,0.4)", padding: "5px 10px", border: "1px solid rgba(255,255,255,0.2)" }}>
        📷 Add photos →
      </a>
    </div>
  );
}

function StatBox({ number, label }) {
  return (
    <div style={{ borderLeft: `4px solid ${S.black}`, paddingLeft: 16 }}>
      <div style={{ fontFamily: S.font, fontSize: 40, fontWeight: 900, color: S.black, lineHeight: 1, letterSpacing: -2 }}>{number}</div>
      <div style={{ fontFamily: S.font, fontSize: 10, color: "#888", letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
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
        background: hov ? S.black : S.white,
        transition: "background 0.15s",
        height: "100%",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 20 }}>{icon}</div>
      <div style={{ fontFamily: S.font, fontSize: 18, fontWeight: 900, color: hov ? S.white : S.black, letterSpacing: -0.5, marginBottom: 10, textTransform: "uppercase", lineHeight: 1.1 }}>{headline}</div>
      <div style={{ fontFamily: S.font, fontSize: 12, color: hov ? "#aaa" : "#666", lineHeight: 1.7, marginBottom: 20 }}>{body}</div>
      <div style={{ fontFamily: S.font, fontSize: 11, fontWeight: 700, color: hov ? S.white : S.red, letterSpacing: 2, textTransform: "uppercase" }}>{cta} →</div>
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>{inner}</a>;
  return inner;
}

function HomePage({ setPage }) {
  const totalJobs = 44;
  const doneCount = (() => {
    try { return Object.values(JSON.parse(localStorage.getItem("beetle-checklist-v1")) || {}).filter(Boolean).length; }
    catch { return 0; }
  })();
  const pct = Math.round((doneCount / totalJobs) * 100);
  const remaining = totalJobs - doneCount;

  return (
    <div style={{ background: S.white, fontFamily: S.font }}>
      <Slideshow />

      {/* Stats strip */}
      <div style={{ borderBottom: S.border, background: S.white }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px", display: "flex", gap: 48, flexWrap: "wrap" }}>
          <StatBox number={`${pct}%`} label="Complete" />
          <StatBox number={doneCount} label="Jobs done" />
          <StatBox number={remaining} label="Jobs left" />
          <StatBox number="9" label="Phases" />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: "#ddd" }}>
        <div style={{ height: 6, width: `${pct}%`, background: S.red, transition: "width 0.5s" }} />
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 24px" }}>
        {/* Section label */}
        <div style={{ fontSize: 10, letterSpacing: 6, color: "#999", textTransform: "uppercase", marginBottom: 24 }}>The project.</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 2 }}>
          <NavCard
            icon="✅"
            headline="Work Checklist"
            body="9 phases. Every job in order. Video guides and references linked. Ticks save to this browser."
            cta="Open checklist"
            onClick={() => setPage("checklist")}
          />
          <NavCard
            icon="📁"
            headline="Build Folder"
            body="Photos and documents from the restoration. Add your own photos directly in Google Drive."
            cta="Open Drive"
            href={DRIVE_URL}
          />
          <NavCard
            icon="🔧"
            headline="Suppliers"
            body="Just Kampers · Heritage Parts Centre · Alan H Schofield · Wolfsburg West · Dave the Trimmer"
            cta="Just Kampers"
            href="https://www.justkampers.com/air-cooled-vw-parts/vw-beetle-parts.html"
          />
        </div>
      </div>

      {/* Spec table — full DDB ad style */}
      <div style={{ borderTop: S.border, borderBottom: S.border, background: S.black }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: "#666", textTransform: "uppercase", marginBottom: 32 }}>Technical specification.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "24px 32px" }}>
            {[
              ["VIN", "117070752"],
              ["Product", "1500 Sedan — RHD"],
              ["Model year", "1967"],
              ["Manufactured", "9th August 1966"],
              ["Delivered", "11th August 1966"],
              ["Delivered in", "Ramsgate, Great Britain"],
              ["Original paint", "L633 VW Blue"],
              ["Current colour", "White (resprayed)"],
              ["Interior", "86 / Platinum leatherette"],
              ["Gearbox", "4-speed manual"],
              ["Original engine", "H / 4-Cyl 1.5L / 44hp"],
              ["Current engine", "1641cc Twin Port"],
              ["Carburettor", "Solex PICT 34"],
              ["Exhaust", "EMPI GT Two Tip"],
              ["Tyres", "5.60-15 tubeless"],
              ["Wheelbase", "2400mm"],
              ["Weight", "800kg (empty)"],
              ["Spec M348", "Equipment for Great Britain"],
              ["Spec M042", "British market regulations"],
              ["Certificate", "Wolfsburg — 30 Apr 2025"],
              ["Location", "GU12"],
            ].map(([label, value]) => (
              <div key={label} style={{ borderLeft: `2px solid ${S.red}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 9, color: "#666", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: S.white, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontSize: 10, color: "#bbb", letterSpacing: 3, textTransform: "uppercase" }}>
          Restoration 2024–2025 · GU12
        </div>
        <VWBadge size={36} />
      </div>
    </div>
  );
}

function Header({ page, setPage }) {
  return (
    <div style={{ background: S.white, borderBottom: S.border, position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <VWBadge size={30} />
          <div>
            <div style={{ fontFamily: S.font, fontSize: 12, fontWeight: 900, color: S.black, letterSpacing: -0.5, lineHeight: 1 }}>1967 BEETLE</div>
            <div style={{ fontFamily: S.font, fontSize: 9, color: "#999", letterSpacing: 2, textTransform: "uppercase" }}>Restoration</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 0 }}>
          {[{ id: "home", label: "Home" }, { id: "checklist", label: "Checklist" }].map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ background: page === item.id ? S.black : "transparent", color: page === item.id ? S.white : "#888", border: "none", borderLeft: "1px solid #ddd", padding: "0 16px", height: 52, cursor: "pointer", fontFamily: S.font, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", transition: "all 0.15s" }}>
              {item.label}
            </button>
          ))}
          <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{ background: "transparent", color: "#888", borderLeft: "1px solid #ddd", padding: "0 16px", height: 52, display: "flex", alignItems: "center", fontFamily: S.font, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>
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
