import { useState, useEffect } from "react";
import { S } from "./constants.js";
import { fetchFolder } from "./utils.js";

const sections = [
  {
    headline: "12 volt electrics.",
    body: "From chassis 117 000 001, 1st August 1966, the Beetle moved to a 12 volt electrical system. The fuse box increased from 8 to 10 fuses — one dedicated to the windscreen wiper motor. The distributor was modified, the ignition coil updated to three connections at terminal 15, and the windscreen wiper motor became a two-speed unit with rotary switch replacing the former pull switch. Headlights moved to a vertically mounted sealed beam design on certain export models including Great Britain.",
  },
  {
    headline: "Disc brakes up front.",
    body: "The VW 1500 received front disc brakes from 1st August 1966 (chassis 117 000 003). The new hubs used 4 wheel bolts M14 x 1.5 with a tightening torque of 13 mkg and a hole PCD of 130mm — replacing the previous five M12 bolts at 10 mkg on a 250mm PCD. The steering stub axle was altered to suit, wheel trims were adapted to the modified hubs, and hub cap shape was changed.",
  },
  {
    headline: "Engine changes.",
    body: "The 1.5-litre engine producing 44 bhp was introduced from 1st August 1966 (chassis 117 000 002). Key changes included a revised carburettor pre-heating system drawing warm air from the heat exchangers via two pipes rather than from the underside of the cylinder heads. The push rod was lengthened from 8.14mm to 9mm. Big-end bearing cap radius changed from 4mm to 2.5mm. Oil pipe became seamless rather than welded. Crankcase studs M12 x 1.5 at bearing 2 fitted with sealing rings.",
  },
  {
    headline: "Steering and suspension.",
    body: "From August 1966 the steering wheel changed to a two-spoke design with deep set hub, replacing the former three-spoke wheel. The steering track-rod outer end was secured with a damping sleeve and inner end with a control nut. Rear suspension gained an equalizer spring on the rear axle from the same date (chassis 117 000 001), assisting the action of the rear torsion bars and giving a wider rear track of 1350mm. Brake and clutch pedals changed from cast iron to sheet steel construction.",
  },
  {
    headline: "Bodywork and interior.",
    body: "The engine cover was reshaped — the lower section shortened, making the registration plate surface more vertical. The central rib was dropped and the number plate light adapted. The VW 1500 motif was fitted to the engine hood. Chrome exterior moulding became narrower, secured with plastic clips. Interior control knobs changed to flexible plastic. Door handles were redesigned in Nirosta steel with the ignition lock now operable with the door key — a single key system. Door locks gained a locking plate secured with 4 screws (formerly 3). Front seat backrest lock moved to the upper part of the backrest.",
  },
  {
    headline: "Deluxe specification — this car.",
    body: "GVU 798D was built to Deluxe/Export specification confirmed by option code M348 (Equipment for Great Britain) on the Wolfsburg Certificate. The Deluxe specification brought chrome window surrounds, padded sun visors, a dipping interior mirror, two-speed windscreen wipers (standard from August 1966 on all models), and the Platinum leatherette interior (interior code 86). The car left Wolfsburg on 9th August 1966 — one of the first built to the full 1967 model year specification.",
  },
];

const comparison = [
  {
    label: "Pre-August 1966 Beetle",
    dark: false,
    items: [
      "6 volt electrical system",
      "8 fuse box",
      "Drum brakes all round",
      "Five stud wheel hubs (M12)",
      "Single speed wipers (pull switch)",
      "Cast iron pedals",
      "Three-spoke steering wheel",
    ],
  },
  {
    label: "This car — from 1st August 1966",
    dark: true,
    items: [
      "12 volt electrical system",
      "10 fuse box",
      "Front disc brakes (VW 1500)",
      "Four stud hubs M14 x 1.5",
      "Two-speed wipers (rotary switch)",
      "Sheet steel pedals",
      "Two-spoke steering wheel",
      "M348 GB specification",
      "Deluxe/Export trim",
    ],
  },
];

export default function ModelYear({ setPage }) {
  const [photos1967, setPhotos1967] = useState([]);
  const [lightbox1967, setLightbox1967] = useState(null);

  useEffect(() => {
    fetchFolder("beetle/1967").then(imgs => setPhotos1967(imgs));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: S.cream, fontFamily: S.font, overflowX: "hidden", width: "100%" }}>

      {/* Header */}
      <div style={{ background: S.ink, borderBottom: S.border, padding: "32px clamp(16px, 4vw, 48px) 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ fontSize: 9, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>
            Volkswagen · Wolfsburg · 1966–67
          </div>
          <div style={{ fontSize: "clamp(24px, 5vw, 52px)", fontWeight: 900, color: S.cream, letterSpacing: -1, lineHeight: 1 }}>
            1967 Model Year.
          </div>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>
            What makes this car unique.
          </div>
        </div>
      </div>

      {/* Intro — DDB style */}
      <div style={{ borderBottom: S.border, background: S.cream }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px clamp(16px, 4vw, 48px)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, color: S.ink, letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 20 }}>
              The crossroads car.
            </div>
            <div style={{ width: 40, height: 3, background: S.red, marginBottom: 20 }} />
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.9 }}>
              The 1967 Volkswagen Beetle — designated model year August 1966 to July 1967 — represents a significant step forward from everything that came before. Disc brakes, 12 volt electrics, two-speed wipers, revised engine, new steering. The changes introduced across chassis 117 000 001 onwards transformed the car from a refined 1950s design into something genuinely capable for the modern road. GVU 798D, built 9th August 1966, carries every one of these changes from day one.
            </div>
          </div>
        </div>
      </div>

      {/* Sections grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px clamp(16px, 4vw, 48px) 48px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
          {sections.map(({ headline, body }) => (
            <div key={headline} style={{ border: S.border, background: S.cream, display: "flex", flexDirection: "column", padding: "28px 24px" }}>
              <div style={{ width: 24, height: 3, background: S.red, marginBottom: 16 }} />
              <div style={{ fontSize: "clamp(18px, 4vw, 32px)", fontWeight: 900, color: S.ink, letterSpacing: -0.3, lineHeight: 1.1, marginBottom: 14 }}>
                {headline}
              </div>
              <div style={{ width: "100%", height: 1, background: S.ink, opacity: 0.12, marginBottom: 14 }} />
              <div style={{ fontSize: 11, color: "#444", lineHeight: 1.85, flex: 1 }}>
                {body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spec comparison */}
      <div style={{ borderTop: S.border, borderBottom: S.border }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: S.ink, padding: "20px clamp(16px, 4vw, 48px)", borderBottom: S.border }}>
            <div style={{ fontSize: 9, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 4 }}>Specification</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: S.cream, letterSpacing: -0.5 }}>Standard vs. this car.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {comparison.map(({ label, dark, items }) => (
              <div key={label} style={{ background: dark ? S.ink : S.darkCream, padding: "28px 24px", borderRight: S.border }}>
                <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: dark ? "#555" : "#888", marginBottom: 16 }}>{label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: dark ? S.red : S.ink, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ fontSize: 12, color: dark ? S.cream : S.ink, lineHeight: 1.5, fontWeight: dark ? 700 : 400 }}>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1967 photo strip */}
      {photos1967.length > 0 && (
        <div>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px clamp(16px, 4vw, 48px) 0" }}>
            <div style={{ fontSize: 9, letterSpacing: 6, color: "#cc0000", textTransform: "uppercase", marginBottom: 8 }}>Archive</div>
            <div style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#111", letterSpacing: -0.5, borderBottom: "2px solid #111", paddingBottom: 16, marginBottom: 0 }}>The 1967 Volkswagen Beetle.</div>
          </div>
          <div style={{ overflowX: "auto", whiteSpace: "nowrap", padding: "0", background: "#111", borderTop: "3px solid #cc0000", marginTop: 0 }}>
            {photos1967.map((photo, i) => (
              <img
                key={photo.public_id || i}
                src={photo.thumb}
                alt={`1967 ${i + 1}`}
                onClick={() => setLightbox1967(i)}
                style={{ display: "inline-block", height: 280, width: "auto", objectFit: "cover", marginRight: 3, filter: "sepia(0.3) contrast(1.1)", cursor: "pointer" }}
              />
            ))}
          </div>
          <div style={{ background: "#111", color: "#666", fontSize: 9, letterSpacing: 4, textTransform: "uppercase", textAlign: "center", padding: "12px 0 24px" }}>
            Archive — The 1967 Volkswagen Beetle
          </div>
        </div>
      )}

      {/* 1967 lightbox */}
      {lightbox1967 !== null && (
        <div
          onClick={() => setLightbox1967(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img
            src={photos1967[lightbox1967].full}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", display: "block" }}
          />
          <div onClick={() => setLightbox1967(null)} style={{ position: "fixed", top: 20, right: 24, color: S.cream, fontSize: 28, cursor: "pointer", fontFamily: S.font, fontWeight: 300, lineHeight: 1, userSelect: "none" }}>✕</div>
          {lightbox1967 > 0 && (
            <div onClick={e => { e.stopPropagation(); setLightbox1967(i => i - 1); }} style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", userSelect: "none" }}>‹</div>
          )}
          {lightbox1967 < photos1967.length - 1 && (
            <div onClick={e => { e.stopPropagation(); setLightbox1967(i => i + 1); }} style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", userSelect: "none" }}>›</div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px clamp(16px, 4vw, 48px)" }}>
        <div style={{ fontSize: 9, color: "#aaa", letterSpacing: 4, textTransform: "uppercase" }}>
          Volkswagen · 1967 · VIN 1170707xx · Surrey, UK
        </div>
      </div>


    </div>
  );
}
