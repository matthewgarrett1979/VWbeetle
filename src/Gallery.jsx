import { useState, useEffect } from "react";
import { S, FOLDERS, L519, L633 } from "./constants.js";
import { fetchFolder } from "./utils.js";
import Lightbox from "./Lightbox.jsx";

export default function Gallery({ setPage }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetchFolder(FOLDERS.gallery).then(imgs => {
      const sorted = [...imgs].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setPhotos(sorted);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: S.cream, fontFamily: S.font, overflowX: "hidden", width: "100%" }}>
      {/* Header */}
      <div style={{ background: S.ink, borderBottom: S.border, padding: "32px clamp(16px, 4vw, 48px) 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ fontSize: 9, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>
            Build documentation
          </div>
          <div style={{ fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 900, color: S.cream, letterSpacing: -1, lineHeight: 1, display: "flex", alignItems: "flex-end", gap: 12 }}>
            Gallery.
            <div style={{ display: "flex", gap: 2, paddingBottom: 4 }}>
              <div style={{ width: 10, height: 24, background: L519 }} title="L519 Bahama Blue — current" />
              <div style={{ width: 10, height: 24, background: L633 }} title="L633 VW Blue — original" />
            </div>
          </div>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>
            VIN 1170707xx · Surrey, UK
          </div>
        </div>
      </div>
      <div style={{ height: 3, background: L519, width: "100%" }} />

      {/* Grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px clamp(16px, 4vw, 48px) 64px", width: "100%", boxSizing: "border-box" }}>
        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", fontSize: 10, color: "#aaa", letterSpacing: 4, textTransform: "uppercase" }}>
            Loading photos...
          </div>
        ) : photos.length === 0 ? (
          <div style={{ border: S.border, padding: "64px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: S.ink, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>No photos yet.</div>
            <div style={{ fontSize: 11, color: "#777", lineHeight: 1.8 }}>
              Add photos to the build gallery<br />
              They will appear here automatically.
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 3 }}>
              {photos.map((photo, i) => (
                <div
                  key={photo.public_id || i}
                  onClick={() => setLightbox(i)}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${L519}`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                  style={{ aspectRatio: "4/3", overflow: "hidden", cursor: "pointer", position: "relative", background: S.darkCream, border: "1px solid rgba(0,0,0,0.08)", transition: "box-shadow 0.15s" }}
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

      {lightbox !== null && (
        <Lightbox
          photos={photos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={i => setLightbox(i)}
        />
      )}
    </div>
  );
}
