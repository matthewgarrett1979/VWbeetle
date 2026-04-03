import { useState, useEffect } from "react";



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

export default function Gallery({ setPage }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // index of open photo

  useEffect(() => {
    fetchFolder("beetle/gallery").then(imgs => {
      setPhotos(imgs);
      setLoading(false);
    });
  }, []);

  // Keyboard nav for lightbox
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
            Build documentation
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: S.cream, letterSpacing: -1, lineHeight: 1 }}>
            Gallery.
          </div>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>
            VW Beetle 1966 1500 · Restoration pictures
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>
        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", fontSize: 10, color: "#aaa", letterSpacing: 4, textTransform: "uppercase" }}>
            Loading photos...
          </div>
        ) : photos.length === 0 ? (
          <div style={{ border: S.border, padding: "64px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: S.ink, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>No photos yet.</div>
            <div style={{ fontSize: 11, color: "#777", lineHeight: 1.8 }}>
              Upload photos to <strong>Cloudinary → beetle/gallery</strong><br />
              They will appear here automatically.
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 3 }}>
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  onClick={() => setLightbox(i)}
                  style={{ aspectRatio: "4/3", overflow: "hidden", cursor: "pointer", position: "relative", background: S.darkCream, border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <img
                    src={photo.thumb}
                    alt={`Build photo ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img
            src={photos[lightbox].full}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", display: "block", border: S.border }}
          />

          {/* Close */}
          <div onClick={() => setLightbox(null)}
            style={{ position: "fixed", top: 20, right: 24, color: "#fff", fontSize: 28, cursor: "pointer", fontFamily: S.font, fontWeight: 300, lineHeight: 1, userSelect: "none" }}>
            ✕
          </div>

          {/* Counter */}
          <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", fontFamily: S.font, fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 3, textTransform: "uppercase" }}>
            {lightbox + 1} / {photos.length}
          </div>

          {/* Prev */}
          {lightbox > 0 && (
            <div onClick={e => { e.stopPropagation(); setLightbox(i => i - 1); }}
              style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", userSelect: "none" }}>
              ‹
            </div>
          )}

          {/* Next */}
          {lightbox < photos.length - 1 && (
            <div onClick={e => { e.stopPropagation(); setLightbox(i => i + 1); }}
              style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", userSelect: "none" }}>
              ›
            </div>
          )}
        </div>
      )}
    </div>
  );
}
