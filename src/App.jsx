import { useState, useEffect, useCallback } from "react";
import Checklist from "./Checklist.jsx";
import Gallery from "./Gallery.jsx";
import History from "./History.jsx";
import Blog from "./Blog.jsx";
import ModelYear from "./ModelYear.jsx";
import { S, FOLDERS } from "./constants.js";
import { fetchFolder as fetchFolderRaw } from "./utils.js";

// ─── CLOUDINARY via serverless API ───────────────────────────────────────────
async function fetchFolder(folder) {
  const imgs = await fetchFolderRaw(folder);
  return imgs.map(i => i.url);
}

// ─── Local advert scans (public/assets/adverts/) ─────────────────────────────
// Drop scanned 1960s VW ads here — they replace the rendered panels automatically
const advertModules = import.meta.glob('/public/assets/adverts/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const ADVERT_IMAGES = Object.values(advertModules);
const USE_REAL_ADVERTS = ADVERT_IMAGES.length > 0;

// ─── VW Beetle SVG ───────────────────────────────────────────────────────────
function BeetleSVG({ width = 320, opacity = 1 }) {
  return (
    <svg width={width} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <ellipse cx="195" cy="130" rx="160" ry="48" fill={S.ink} />
      <path d="M110 130 Q115 75 160 62 Q200 52 240 62 Q282 72 290 130Z" fill={S.ink} />
      <path d="M155 125 Q158 85 175 72 Q195 63 215 72 Q230 82 233 125Z" fill={S.cream} opacity="0.12" />
      <path d="M242 125 Q245 88 258 78 Q272 70 282 85 Q287 100 285 125Z" fill={S.cream} opacity="0.1" />
      <ellipse cx="98" cy="160" rx="36" ry="18" fill={S.cream} />
      <ellipse cx="98" cy="160" rx="28" ry="13" fill={S.ink} />
      <ellipse cx="98" cy="160" rx="10" ry="8" fill={S.cream} opacity="0.3" />
      <ellipse cx="290" cy="160" rx="40" ry="18" fill={S.cream} />
      <ellipse cx="290" cy="160" rx="30" ry="13" fill={S.ink} />
      <ellipse cx="290" cy="160" rx="11" ry="8" fill={S.cream} opacity="0.3" />
      <rect x="34" y="138" width="18" height="8" rx="3" fill={S.cream} opacity="0.6" />
      <rect x="348" y="136" width="18" height="8" rx="3" fill={S.cream} opacity="0.6" />
      <circle cx="55" cy="128" r="9" fill={S.cream} opacity="0.5" />
    </svg>
  );
}

// ─── VW Roundel ──────────────────────────────────────────────────────────────
// invert=false → on light/cream background (multiply removes white bg, black logo stays)
// invert=true  → on dark background (invert image + screen removes black bg, white logo stays)
function VWRoundel({ size = 48, invert = false }) {
  return (
    <img
      src="/assets/vw-logo.png"
      alt="VW"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        filter: invert ? "invert(1)" : "none",
        mixBlendMode: invert ? "screen" : "multiply",
      }}
    />
  );
}

// ─── Hero photo slideshow (beetle/hero folder) ────────────────────────────────
function PhotoSlideshow() {
  const [photos, setPhotos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolder(FOLDERS.hero).then(urls => {
      setPhotos(urls.length > 0 ? urls : ["/assets/photos/placeholder.svg"]);
      setLoading(false);
    });
  }, []);

  const goTo = useCallback((idx) => {
    setOpacity(0);
    setTimeout(() => { setCurrent(idx); setOpacity(1); }, 400);
  }, []);

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => goTo((current + 1) % photos.length), 5000);
    return () => clearInterval(t);
  }, [current, goTo, photos.length]);

  if (loading) return (
    <div style={{ width: "100%", height: "clamp(360px, 60vh, 620px)", background: S.black, borderBottom: S.border, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: S.font, fontSize: 10, color: "#444", letterSpacing: 4, textTransform: "uppercase" }}>Loading...</div>
    </div>
  );

  const src = photos[current];

  return (
    <div style={{ position: "relative", width: "100%", height: "clamp(360px, 60vh, 620px)", overflow: "hidden", background: S.black, borderBottom: S.border }}>
      <img src={src} alt="Beetle" style={{ width: "100%", height: "100%", objectFit: "cover", opacity, transition: "opacity 0.4s ease", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 32px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: S.font, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 }}>VIN 1170707xx · L519 VW Blue</div>
          <div style={{ fontFamily: S.font, fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>1966 Volkswagen Beetle.</div>
        </div>
        <VWRoundel size={40} invert={true} />
      </div>
      {photos.length > 1 && (
        <div style={{ position: "absolute", top: 16, right: 20, display: "flex", gap: 6, zIndex: 10 }}>
          {photos.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{ width: i === current ? 22 : 7, height: 7, borderRadius: 4, background: i === current ? "#fff" : "rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>
      )}
      {photos.length > 1 && ["‹", "›"].map((arrow, idx) => (
        <div key={arrow} onClick={() => goTo(idx === 0 ? (current - 1 + photos.length) % photos.length : (current + 1) % photos.length)}
          style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [idx === 0 ? "left" : "right"]: 14, width: 36, height: 36, border: "2px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.3)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", userSelect: "none", zIndex: 10 }}>
          {arrow}
        </div>
      ))}
    </div>
  );
}

// ─── DDB Ad panels ────────────────────────────────────────────────────────────
const ADS = [
  { headline: "Think small.", subhead: "1967 Volkswagen Beetle", body: "Our little car isn't so much of a novelty any more. A couple of dozen college kids don't try to squeeze inside it. Nobody even stares at our shape. In fact, some people who drive our little flivver don't even think 32 miles to the gallon is going much of a novelty. Or paying less for insurance. Or never needing anti-freeze. Or racking up 40,000 miles on a set of tyres. That's because once you get used to some of our economies, you don't even think about them any more. Except when you squeeze into a small parking spot. Or renew your small insurance. Or pay a small repair bill. Think it over." },
  { headline: "Lemon.", subhead: "Volkswagen quality control", body: "This Volkswagen missed the boat. The chrome strip on the glove compartment is blemished and must be replaced. Chances are you wouldn't have noticed it; Inspector Kurt Kroner did. There are 3,389 men at our Wolfsburg factory with only one job: to inspect Volkswagens at each stage of production. Every shock absorber is tested, every windshield scanned. VW's have been rejected for surface scratches barely visible to the eye. We pluck the lemons; you get the plums." },
  { headline: "It's ugly,\nbut it gets\nyou there.", subhead: "Volkswagen reliability", body: "The Volkswagen isn't much to look at. But it will get you to where you're going — and back — without the headaches. The engine is in the back, the heater is unusual, the shape is odd. The car will go 70 miles an hour all day without protest. 32 miles per gallon without trying. And it'll start in the morning when your neighbour's streamlined steel sculpture won't." },
  { headline: "After we paint the car, we paint the paint.", subhead: "Volkswagen craftsmanship", body: "Every Volkswagen is given a full 23-step paint job. First, the metal is treated so it won't rust. Then, successive layers of paint are applied — and baked — until we're done. In all, there are seven coats of paint on a VW. That's about the same number you'd find on a piece of fine jewellery. A Volkswagen is meant to last." },
  { headline: "Restoration\nin progress.", subhead: "VIN 1170707xx · Surrey, UK", body: "Manufactured 9th August 1966 at Wolfsburg. Delivered to Ramsgate, Great Britain, 11th August 1966. Original finish L633 VW Blue. Resprayed L519 VW Blue. Current engine 1641cc twin port. Nine phases of restoration work, carried out with the same obsessive attention to detail that Kurt Kroner would approve of. Almost.", isOwn: true },
];

function AdPanel({ ad }) {
  return (
    <div style={{ background: S.cream, border: S.border, display: "flex", flexDirection: "column", minHeight: 420 }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "32px 32px 0", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        <BeetleSVG width={220} opacity={0.8} />
      </div>
      <div style={{ flex: 1, padding: "24px 32px 20px", display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: S.font, fontSize: "clamp(16px, 2.5vw, 26px)", fontWeight: 900, color: S.ink, letterSpacing: -0.5, lineHeight: 1.05, marginBottom: 16, whiteSpace: "pre-line" }}>{ad.headline}</div>
        <div style={{ width: "100%", height: 1, background: S.ink, opacity: 0.25, marginBottom: 14 }} />
        <div style={{ fontFamily: S.font, fontSize: 10.5, color: "#333", lineHeight: 1.8, flex: 1 }}>{ad.body}</div>
      </div>
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.15)", padding: "10px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.04)" }}>
        <div style={{ fontFamily: S.font, fontSize: 8, color: "#888", letterSpacing: 3, textTransform: "uppercase" }}>{ad.subhead}</div>
        <VWRoundel size={28} />
      </div>
    </div>
  );
}

function AdCarousel() {
  const [start, setStart] = useState(0);
  const [advertImages, setAdvertImages] = useState([]);
  const perPage = typeof window !== "undefined" && window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1;

  // Fetch archive images on mount, fall back to local then SVG panels
  useEffect(() => {
    fetchFolder(FOLDERS.archive).then(urls => {
      if (urls.length > 0) {
        setAdvertImages(urls);
      } else {
        // Fall back to local scanned adverts if any, otherwise empty (uses SVG panels)
        setAdvertImages(USE_REAL_ADVERTS ? ADVERT_IMAGES : []);
      }
    });
  }, []);

  const useImages = advertImages.length > 0;
  const items = useImages ? advertImages : ADS;
  const maxStart = Math.max(0, items.length - perPage);

  useEffect(() => {
    const t = setInterval(() => setStart(s => s >= maxStart ? 0 : s + 1), 6000);
    return () => clearInterval(t);
  }, [maxStart]);

  const visible = items.slice(start, start + perPage);
  while (visible.length < perPage) visible.push(null);

  return (
    <div>
      <div style={{ borderTop: S.border, borderBottom: S.border, background: S.ink, padding: "20px clamp(16px, 4vw, 48px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: S.font, fontSize: 9, color: "#555", letterSpacing: 6, textTransform: "uppercase", marginBottom: 4 }}>Volkswagen · 1966</div>
            <div style={{ fontFamily: S.font, fontSize: 20, fontWeight: 900, color: S.cream, letterSpacing: -0.5 }}>From the archive.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStart(s => Math.max(0, s - 1))} disabled={start === 0} style={{ width: 36, height: 36, border: "2px solid #333", background: "transparent", color: start === 0 ? "#333" : S.cream, cursor: start === 0 ? "default" : "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <button onClick={() => setStart(s => Math.min(maxStart, s + 1))} disabled={start >= maxStart} style={{ width: 36, height: 36, border: "2px solid #333", background: "transparent", color: start >= maxStart ? "#333" : S.cream, cursor: start >= maxStart ? "default" : "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </div>
        </div>
      </div>
      <div style={{ background: S.darkCream, padding: "clamp(16px, 4vw, 24px)", borderBottom: S.border }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {visible.map((item, i) => {
            if (!item) return <div key={i} />;
            if (useImages) {
              return (
                <div key={i} style={{ border: S.border, background: S.cream, overflow: "hidden" }}>
                  <img src={item} alt="VW advertisement" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              );
            }
            return <AdPanel key={`${start}-${i}`} ad={item} />;
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
          {Array.from({ length: maxStart + 1 }).map((_, i) => (
            <div key={i} onClick={() => setStart(i)} style={{ width: i === start ? 20 : 7, height: 7, borderRadius: 4, background: i === start ? S.ink : "rgba(0,0,0,0.2)", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function StatBox({ number, label }) {
  return (
    <div style={{ borderLeft: `4px solid ${S.ink}`, paddingLeft: 16 }}>
      <div style={{ fontFamily: S.font, fontSize: "clamp(28px, 6vw, 40px)", fontWeight: 900, color: S.ink, lineHeight: 1, letterSpacing: -2 }}>{number}</div>
      <div style={{ fontFamily: S.font, fontSize: 9, color: "#888", letterSpacing: 4, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── Nav card ─────────────────────────────────────────────────────────────────
function ChecklistIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="1" y="1" width="26" height="26" stroke={S.ink} strokeWidth="2"/>
      <line x1="8" y1="9" x2="20" y2="9" stroke={S.ink} strokeWidth="1.5"/>
      <line x1="8" y1="14" x2="20" y2="14" stroke={S.ink} strokeWidth="1.5"/>
      <line x1="8" y1="19" x2="16" y2="19" stroke={S.ink} strokeWidth="1.5"/>
      <polyline points="4,14 6,16.5 10,11" stroke={S.red} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="1" y="1" width="26" height="26" stroke={S.ink} strokeWidth="2"/>
      <rect x="5" y="5" width="8" height="8" stroke={S.ink} strokeWidth="1.5"/>
      <rect x="15" y="5" width="8" height="8" stroke={S.ink} strokeWidth="1.5"/>
      <rect x="5" y="15" width="8" height="8" stroke={S.ink} strokeWidth="1.5"/>
      <rect x="15" y="15" width="8" height="8" stroke={S.ink} strokeWidth="1.5"/>
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="1" y="1" width="26" height="26" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="14" cy="14" r="7" stroke="#1a1a1a" strokeWidth="1.5"/>
      <polyline points="14,10 14,14 17,16" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function NavCard({ icon, headline, body, cta, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ border: S.border, padding: "28px 24px", cursor: "pointer", background: hov ? S.ink : S.cream, transition: "background 0.15s", height: "100%" }}>
      <div style={{ marginBottom: 20, filter: hov ? "invert(1)" : "none", transition: "filter 0.15s" }}>{icon}</div>
      <div style={{ fontFamily: S.font, fontSize: 15, fontWeight: 900, color: hov ? S.cream : S.ink, letterSpacing: -0.5, marginBottom: 10, textTransform: "uppercase", lineHeight: 1.1 }}>{headline}</div>
      <div style={{ fontFamily: S.font, fontSize: 11, color: hov ? "#aaa" : "#555", lineHeight: 1.8, marginBottom: 18 }}>{body}</div>
      <div style={{ fontFamily: S.font, fontSize: 9, fontWeight: 700, color: hov ? S.cream : S.red, letterSpacing: 3, textTransform: "uppercase" }}>{cta} →</div>
    </div>
  );
}

// ─── Story photo helper ───────────────────────────────────────────────────────
function StoryPhoto({ index, photos }) {
  if (!photos || !photos[index]) return null;
  return (
    <div style={{ margin: "32px 0", width: "100%", overflow: "hidden", borderLeft: "3px solid #cc0000" }}>
      <img
        src={photos[index].url}
        alt=""
        style={{ width: "100%", maxHeight: 320, objectFit: "cover", filter: "sepia(0.2) contrast(1.05)", display: "block" }}
      />
    </div>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const totalJobs = 147;
  const doneCount = (() => {
    try { return 83 + Object.values(JSON.parse(localStorage.getItem("beetle-checklist-v1")) || {}).filter(Boolean).length; }
    catch { return 83; }
  })();
  const pct = Math.round((doneCount / totalJobs) * 100);
  const remaining = totalJobs - doneCount;

  const [storyPhotos, setStoryPhotos] = useState([]);
  useEffect(() => {
    fetch("/api/photos?folder=beetle/gallery")
      .then(res => res.json())
      .then(data => setStoryPhotos(data.images || []))
      .catch(() => setStoryPhotos([]));
  }, []);

  return (
    <div style={{ background: S.cream, fontFamily: S.font }}>
      <PhotoSlideshow />

      <div style={{ borderBottom: S.border, background: S.cream }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px clamp(16px, 4vw, 48px)", display: "flex", gap: 40, flexWrap: "wrap" }}>
          <StatBox number={`${pct}%`} label="Complete" />
          <StatBox number={doneCount} label="Jobs done" />
          <StatBox number={remaining} label="Jobs left" />
          <StatBox number="9" label="Phases" />
        </div>
      </div>
      <div style={{ height: 5, background: S.darkCream }}>
        <div style={{ height: 5, width: `${pct}%`, background: S.red, transition: "width 0.5s" }} />
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px clamp(16px, 4vw, 48px) 32px" }}>

        {/* Personal intro */}
        <div style={{ borderBottom: S.border, paddingBottom: 40, marginBottom: 40 }}>
          <div style={{ fontFamily: S.font, fontSize: 9, letterSpacing: 6, color: "#999", textTransform: "uppercase", marginBottom: 20 }}>The story.</div>
          <div style={{ fontFamily: S.font, fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 900, color: S.ink, letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 24 }}>
            GVU 798D – 1967 Volkswagen Beetle 1500 Deluxe.
          </div>
          <div style={{ fontFamily: S.font, fontSize: 13, color: "#444", lineHeight: 1.9, maxWidth: 680, display: "flex", flexDirection: "column", gap: 16 }}>
            <p>Almost sixty years ago, in the Volkswagen factory at Wolfsburg, this car was built.</p>
            <p>9 August 1966. England had just won the World Cup. On a Tuesday, this Beetle rolled off the line, was loaded onto a transporter and began its journey north. Eleven days later it reached Ramsgate. From there it went to a dealer in east London, and in October 1966, two months after leaving the factory, it was registered in West Ham as CJD 511D.</p>

            <StoryPhoto index={0} photos={storyPhotos} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" transform="rotate(45 6 6)" fill="#111111"/></svg>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
            </div>

            <p>What happened over the following decades is largely unrecorded. It changed hands. It was resprayed at some point, tidied rather than properly repaired. Rust, inevitably, found its way in.</p>
            <p>By the time it came to me in May 2024, it carried the signs of a car that had been kept going rather than properly looked after. Nothing terminal, but enough to make it clear that doing things properly was the only sensible route. It arrived with a 1300cc single port AB engine, serviceable, but not what the car originally left the factory with.</p>
            <p>I've had a Beetle before, a 1968, my first car. I sold it at twenty when I couldn't afford to keep it as it deserved. That decision has a way of lingering. This felt less like a purchase and more like a correction.</p>

            <StoryPhoto index={1} photos={storyPhotos} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" transform="rotate(45 6 6)" fill="#111111"/></svg>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
            </div>

            <p>The Wolfsburg Certificate sets out the facts. Deluxe specification. Originally L633 VW Blue, the deeper export shade rather than the lighter catalogue colour. Platinum leatherette interior. Built for the UK market.</p>
            <p>The chassis number places it at the very start of the 1967 model year, that brief one-year-only specification where Volkswagen introduced a raft of meaningful changes — 12-volt electrics, front disc brakes, a revised engine and two-speed wipers. Properly documented cars from this point in production are not common.</p>

            <StoryPhoto index={2} photos={storyPhotos} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" transform="rotate(45 6 6)" fill="#111111"/></svg>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
            </div>

            <p>Once the extent of the work became clear, there was no real decision to make. It had to be restored properly, not simply improved.</p>
            <p>Beetlelink stripped it back to bare metal. Both heater channels were replaced. New quarter panels, A and B posts, boot panel, rear valance and front bulkhead. The floor pan was treated with POR-15, the arches and engine bay finished in Raptor. Seven months of work, completed in October 2025.</p>
            <p>What emerged was not just presentable, but structurally right — the sort of car where the quality sits beneath the paint as much as on it.</p>

            <StoryPhoto index={3} photos={storyPhotos} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" transform="rotate(45 6 6)" fill="#111111"/></svg>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
            </div>

            <p>It now wears L519 VW Blue, a slightly lighter shade, but one that suits the car as it stands. The glass has been refitted, the doors aligned properly, closing with the sort of precision that only comes when everything underneath is correct. Cavity wax has been applied throughout, in all the places that matter and none that show.</p>
            <p>The engine is now a 1641cc twin port, replacing the 1300cc single port unit it arrived with — the only real deviation from factory specification. It brings a useful increase in torque and usability without altering the character. A Sachs clutch, correct gearbox seals and fresh oil complete the mechanical work.</p>
            <p>A period correct Blaupunkt Frankfurt returns to the dashboard. The interior remains as Wolfsburg intended in form, though not yet in finish.</p>

            <StoryPhoto index={4} photos={storyPhotos} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" transform="rotate(45 6 6)" fill="#111111"/></svg>
              <div style={{ flex: 1, height: 1, background: "#cc0000" }}/>
            </div>

            <p>The target is June 2026.</p>
            <p>This is not the end of the work. A second phase is planned, focused on correcting the blistering to the paintwork on the dashboard, roof and engine lid, along with restoring the seats and headlining to the standard the rest of the car now warrants — cosmetic work, but worth doing properly when the time is right.</p>

            <p style={{ fontStyle: "italic", color: "#cc0000", textAlign: "center", fontSize: 13, letterSpacing: 2 }}>Sixty years on from Wolfsburg, back where it should be.</p>
          </div>
        </div>

        <div style={{ fontFamily: S.font, fontSize: 9, letterSpacing: 6, color: "#999", textTransform: "uppercase", marginBottom: 20 }}>The project.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
          <NavCard icon={<ChecklistIcon />} headline="Work Checklist" body="A full record of the restoration — professional works completed and outstanding jobs remaining." cta="Open checklist" onClick={() => setPage("checklist")} />
          <NavCard icon={<GalleryIcon />} headline="Build Gallery" body="Photos from the restoration, from strip-down to the current state of the build." cta="View gallery" onClick={() => setPage("gallery")} />
          <NavCard icon={<HistoryIcon />} headline="History" body="Archive photos and records from previous owners." cta="View archive" onClick={() => setPage("history")} />
        </div>
      </div>

      <div style={{ borderTop: S.border, borderBottom: S.border, background: S.ink }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px clamp(16px, 4vw, 48px)" }}>
          <div style={{ fontFamily: S.font, fontSize: 9, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 28 }}>Technical specification.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px 28px" }}>
            {[
              ["VIN", "1170707xx"], ["Product", "1500 Sedan — RHD"], ["Model year", "1967"],
              ["Original reg", "CJD 511D"], ["Current reg", "GVU 798D"],
              ["Manufactured", "9th August 1966"], ["Delivered", "11th August 1966"], ["Delivered in", "Ramsgate, GB"],
              ["Original paint", "L633 VW Blue"], ["Current colour", "L519 VW Blue (resprayed)"],
              ["Interior", "86 / Platinum leatherette"], ["Gearbox", "4-speed manual"],
              ["Original engine", "H / 4-Cyl 1.5L / 44hp"], ["Current engine", "1641cc Twin Port"],
              ["Carburettor", "Solex PICT 34"], ["Exhaust", "EMPI GT Two Tip"],
              ["Tyres", "5.60-15 tubeless"], ["Wheelbase", "2400mm"], ["Weight", "800kg (empty)"],
              ["Spec M348", "Equipment for GB"], ["Spec M042", "British regulations"],
              ["Certificate", "Wolfsburg 30 Apr 2025"], ["Location", "Surrey, UK"],
            ].map(([label, value]) => (
              <div key={label} style={{ borderLeft: `2px solid ${S.red}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: S.cream, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdCarousel />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: S.font, fontSize: 9, color: "#aaa", letterSpacing: 4, textTransform: "uppercase" }}>Volkswagen · Beetle · 1966 · Resto '26 · 60 Years Anniversary</div>
        <VWRoundel size={32} />
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ page, setPage }) {
  return (
    <div style={{ background: S.cream, borderBottom: S.border, position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <VWRoundel size={30} />
          <div>
            <div style={{ fontFamily: S.font, fontSize: 12, fontWeight: 900, color: S.ink, lineHeight: 1 }}>1966 BEETLE</div>
            <div style={{ fontFamily: S.font, fontSize: 10, color: "#999", letterSpacing: 3, textTransform: "uppercase" }}>Resto '26 · 60th Anniversary</div>
          </div>
        </div>
        <nav style={{ display: "flex", overflowX: "auto", whiteSpace: "nowrap" }}>
          {[
            { id: "home", label: "Home" },
            { id: "checklist", label: "Checklist" },
            { id: "gallery", label: "Gallery" },
            { id: "history", label: "History" },
            { id: "blog", label: "Journal" },
            { id: "modelyear", label: "1967" },
          ].map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{ background: page === item.id ? S.ink : "transparent", color: page === item.id ? S.cream : "#888", border: "none", borderLeft: "1px solid #ccc", padding: "0 10px", height: 52, cursor: "pointer", fontFamily: S.font, fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", transition: "all 0.15s" }}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
      <Header page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "checklist" && <Checklist />}
      {page === "gallery" && <Gallery setPage={setPage} />}
      {page === "history" && <History setPage={setPage} />}
      {page === "blog" && <Blog setPage={setPage} />}
      {page === "modelyear" && <ModelYear setPage={setPage} />}
    </div>
  );
}
