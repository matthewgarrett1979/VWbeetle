import { useState, useEffect } from "react";

const CLOUDINARY_CLOUD = "dnpglftl4";

const S = {
  font: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  black: "#111111",
  cream: "#f2efe8",
  darkCream: "#e8e4db",
  red: "#cc0000",
  border: "2px solid #111",
  ink: "#1a1a1a",
};

async function fetchFolder(folder) {
  try {
    const res = await fetch(`/api/photos?folder=${encodeURIComponent(folder)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.images || []);
  } catch { return []; }
}

export default function History({ setPage }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetchFolder("beetle/history").then(imgs => {
      setPhotos(imgs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") setLightbox(i => Math.min(i + 1, photos.length - 1));
      if (e.key === "ArrowLeft") setLightbox(i => Math.max(i - 1, 0));
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, photos.length]);

  return (
    <div style={{ minHeight: "100vh", background: S.cream, fontFamily: S.font }}>

      {/* Header */}
      <div style={{ background: S.ink, borderBottom: S.border, padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 9, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>
            Archive
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: S.cream, letterSpacing: -1, lineHeight: 1 }}>
            Previous History.
          </div>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>
            CJD 511D → GVU 798D · 1966–present
          </div>
        </div>
      </div>

      {/* Provenance note */}
      <div style={{ borderBottom: S.border, background: S.darkCream }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px 32px" }}>
            {[
              ["Original registration", "CJD 511D"],
              ["Current registration", "GVU 798D"],
              ["Delivered", "Ramsgate, GB — Aug 1966"],
              ["Original colour", "L633 VW Blue"],
            ].map(([label, value]) => (
              <div key={label} style={{ borderLeft: `2px solid ${S.red}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 9, color: "#888", letterSpacing: 3, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 12, color: S.ink, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>
        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", fontSize: 10, color: "#aaa", letterSpacing: 4, textTransform: "uppercase" }}>
            Loading archive...
          </div>
        ) : photos.length === 0 ? (
          <div style={{ border: S.border, padding: "64px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.3 }}>📷</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: S.ink, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              No archive photos yet.
            </div>
            <div style={{ fontSize: 11, color: "#777", lineHeight: 1.8 }}>
              Upload old photos, documents and period images to<br />
              <strong>Cloudinary → beetle/history</strong>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
              {photos.length} {photos.length === 1 ? "item" : "items"} in archive
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 3 }}>
              {photos.map((photo, i) => (
                <div
                  key={photo.public_id || i}
                  onClick={() => setLightbox(i)}
                  style={{ aspectRatio: "4/3", overflow: "hidden", cursor: "pointer", background: S.darkCream, border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <img
                    src={photo.thumb}
                    alt={`Archive ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease", filter: "sepia(15%)" }}
                    onMouseEnter={e => { e.target.style.transform = "scale(1.04)"; e.target.style.filter = "sepia(0%)"; }}
                    onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.filter = "sepia(15%)"; }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src={photos[lightbox].full}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", display: "block", border: S.border, filter: "sepia(10%)" }}
          />
          <div onClick={() => setLightbox(null)} style={{ position: "fixed", top: 20, right: 24, color: "#fff", fontSize: 28, cursor: "pointer", fontWeight: 300, userSelect: "none" }}>✕</div>
          <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", fontFamily: S.font, fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 3, textTransform: "uppercase" }}>
            {lightbox + 1} / {photos.length}
          </div>
          {lightbox > 0 && (
            <div onClick={e => { e.stopPropagation(); setLightbox(i => i - 1); }} style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", userSelect: "none" }}>‹</div>
          )}
          {lightbox < photos.length - 1 && (
            <div onClick={e => { e.stopPropagation(); setLightbox(i => i + 1); }} style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", userSelect: "none" }}>›</div>
          )}
        </div>
      )}
    </div>
  );
}
