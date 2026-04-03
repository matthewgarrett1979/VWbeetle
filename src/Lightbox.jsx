import { useEffect } from "react";
import { S } from "./constants.js";

export default function Lightbox({ photos, index, onClose, onNavigate, imageStyle = {} }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") onNavigate(Math.min(index + 1, photos.length - 1));
      if (e.key === "ArrowLeft") onNavigate(Math.max(index - 1, 0));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, photos.length, onClose, onNavigate]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <img
        src={photos[index].full}
        alt=""
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", display: "block", border: S.border, ...imageStyle }}
      />
      <div
        onClick={onClose}
        style={{ position: "fixed", top: 20, right: 24, color: "#fff", fontSize: 28, cursor: "pointer", fontFamily: S.font, fontWeight: 300, lineHeight: 1, userSelect: "none" }}
      >
        ✕
      </div>
      <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", fontFamily: S.font, fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 3, textTransform: "uppercase" }}>
        {index + 1} / {photos.length}
      </div>
      {index > 0 && (
        <div
          onClick={e => { e.stopPropagation(); onNavigate(index - 1); }}
          style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", userSelect: "none" }}
        >
          ‹
        </div>
      )}
      {index < photos.length - 1 && (
        <div
          onClick={e => { e.stopPropagation(); onNavigate(index + 1); }}
          style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", userSelect: "none" }}
        >
          ›
        </div>
      )}
    </div>
  );
}
