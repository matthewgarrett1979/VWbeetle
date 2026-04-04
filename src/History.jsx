import { useState, useEffect } from "react";
import { S, FOLDERS } from "./constants.js";
import { fetchFolder } from "./utils.js";
import Lightbox from "./Lightbox.jsx";

export default function History({ setPage }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetchFolder(FOLDERS.history).then(imgs => {
      setPhotos(imgs);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: S.cream, fontFamily: S.font, overflowX: "hidden", width: "100%" }}>

      {/* Header */}
      <div style={{ background: S.ink, borderBottom: S.border, padding: "32px clamp(16px, 4vw, 48px) 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ fontSize: 9, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>
            Archive
          </div>
          <div style={{ fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 900, color: S.cream, letterSpacing: -1, lineHeight: 1 }}>
            Previous History.
          </div>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>
            CJD 511D → GVU 798D · 1966–present
          </div>
        </div>
      </div>

      {/* Provenance note */}
      <div style={{ borderBottom: S.border, background: S.darkCream }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px clamp(16px, 4vw, 48px)", width: "100%", boxSizing: "border-box" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px 32px" }}>
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
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px clamp(16px, 4vw, 48px) 64px", width: "100%", boxSizing: "border-box" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 3 }}>
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

      {lightbox !== null && (
        <Lightbox
          photos={photos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={i => setLightbox(i)}
          imageStyle={{ filter: "sepia(10%)" }}
        />
      )}
    </div>
  );
}
