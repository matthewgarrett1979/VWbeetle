import { S } from "./constants.js";

const sections = [
  {
    headline: "The 12 volt switch.",
    body: "1967 was the first year Volkswagen moved the Beetle to a 12 volt electrical system, replacing the 6 volt system used since 1938. This transformed reliability — better starting, brighter lights, more electrical capacity. A significant engineering change that went unnoticed by most owners but was felt every morning.",
  },
  {
    headline: "Disc brakes up front.",
    body: "For the first time on a Beetle, 1967 brought front disc brakes — a major safety improvement over the drums used previously. Combined with the rear drums, the 1967 stopping performance was a genuine step forward. Look for the larger front hubs — they tell the story.",
  },
  {
    headline: "The upright headlamps.",
    body: "1967 was the last year for the distinctive upright, slightly inward-angled headlamps that define the classic Beetle profile. From 1968 the headlamps moved to a more vertical position. The 1967 lamps give the car its characteristic friendly expression — unmistakably Beetle.",
  },
  {
    headline: "One year only features.",
    body: "Several features appeared on the 1967 Beetle and never again. The semi-trailing arm rear suspension was unique to this year. The fresh air heater system was revised. The door handles changed. Many of these details are subtle but they combine to make the 1967 the most sought-after year among serious collectors.",
  },
  {
    headline: "The 1500 engine.",
    body: "GVU 798D left Wolfsburg with the 1493cc flat four — 44 horsepower by the standards of the day. Modest by any modern measure but entirely adequate for a car weighing 800kg. The engine's reputation for longevity is well founded — units regularly exceed 100,000 miles with basic maintenance. Ours is being replaced with a rebuilt 1641cc twin port, the definitive air-cooled upgrade.",
  },
  {
    headline: "Deluxe specification.",
    body: "Not all 1967 Beetles were equal. The Deluxe — or Export — specification brought chrome window surrounds, padded sun visors, a dipping rear view mirror, two-speed wipers and the Platinum leatherette interior. Option code M348 confirms this car was built to Equipment for Great Britain specification. A Deluxe car in every sense.",
  },
];

const comparison = [
  {
    label: "Standard 1967 Beetle",
    dark: false,
    items: [
      "6 volt electrical (changed to 12v)",
      "Drum brakes all round",
      "Basic interior",
      "Single speed wipers",
    ],
  },
  {
    label: "This car — Deluxe spec",
    dark: true,
    items: [
      "12 volt electrical",
      "Front disc brakes",
      "Platinum leatherette interior",
      "Two-speed wipers",
      "Chrome surrounds",
      "M348 GB specification",
    ],
  },
];

export default function ModelYear({ setPage }) {
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
              The last of the true split-window era. Almost.
            </div>
            <div style={{ width: 40, height: 3, background: S.red, marginBottom: 20 }} />
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.9 }}>
              The 1967 Volkswagen Beetle was a pivotal year — the final model before significant changes transformed the car forever. It sits at the crossroads of old and new, retaining the character of the classic while introducing refinements that made it the most complete Beetle yet built.
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

      {/* Footer */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px clamp(16px, 4vw, 48px)" }}>
        <div style={{ fontSize: 9, color: "#aaa", letterSpacing: 4, textTransform: "uppercase" }}>
          Volkswagen · 1967 · VIN 1170707xx · Surrey, UK
        </div>
      </div>

    </div>
  );
}
