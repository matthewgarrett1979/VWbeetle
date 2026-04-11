import { useState, useEffect } from "react";
import { S } from "./constants.js";

export default function Setup() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/setup")
      .then(res => {
        if (res.status === 403) throw new Error("disabled");
        if (!res.ok) throw new Error("error");
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const font = S.font;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: S.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <div style={{ fontSize: 10, letterSpacing: 4, color: "#999", textTransform: "uppercase" }}>Loading...</div>
    </div>
  );

  if (error === "disabled") return (
    <div style={{ minHeight: "100vh", background: S.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 6, color: "#999", textTransform: "uppercase", marginBottom: 16 }}>TOTP Setup</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: S.red, letterSpacing: -0.5 }}>Setup complete. This page is disabled.</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: S.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <div style={{ fontSize: 13, color: S.red }}>An error occurred. Please try again.</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: S.cream, fontFamily: font, padding: "clamp(32px, 6vw, 64px) clamp(16px, 4vw, 48px)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        <div style={{ fontSize: 9, letterSpacing: 6, color: "#999", textTransform: "uppercase", marginBottom: 12 }}>One-time setup</div>
        <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900, color: S.ink, letterSpacing: -0.5, marginBottom: 32, lineHeight: 1.1 }}>
          Authenticator Setup.
        </div>

        {data.qrDataUrl && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ border: `4px solid ${S.ink}`, padding: 8, background: "#fff", display: "inline-block" }}>
              <img src={data.qrDataUrl} alt="TOTP QR Code" style={{ display: "block", width: 200, height: 200 }} />
            </div>
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#999", textTransform: "uppercase", marginBottom: 8 }}>Secret key</div>
          <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: S.ink, background: S.darkCream, border: `2px solid ${S.ink}`, padding: "12px 16px", letterSpacing: 2, wordBreak: "break-all", userSelect: "all" }}>
            {data.secret}
          </div>
        </div>

        <div style={{ border: `2px solid ${S.red}`, padding: "20px 20px", marginBottom: 32 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S.red, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>Instructions</div>
          <ol style={{ margin: 0, padding: "0 0 0 18px", fontSize: 13, color: "#444", lineHeight: 2 }}>
            <li>Open Google Authenticator or Authy.</li>
            <li>Tap <strong>Add Account</strong>.</li>
            <li>Scan this QR code.</li>
            <li>Add <code style={{ background: "#eee", padding: "1px 5px", fontSize: 12 }}>TOTP_SECRET</code> to Vercel environment variables with the secret shown above.</li>
            <li>Redeploy. This page will then be permanently disabled.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
