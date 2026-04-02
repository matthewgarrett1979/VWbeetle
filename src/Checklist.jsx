import { useState, useEffect } from "react";

const STORAGE_KEY = "beetle-checklist-v1";

const S = {
  bg: "#f4f0e7",
  ink: "#111",
  red: "#a94442",
  font: "'Inter', Arial, sans-serif",
};

function PaperBackground() {
  return (
    <>
      <div style={{
        position: "fixed",
        inset: 0,
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,0,0,0.02) 30px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.05))",
        pointerEvents: "none",
      }} />
    </>
  );
}

export default function Checklist() {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (id) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const jobs = [
    { id: "1", text: "Fit gearbox seals" },
    { id: "2", text: "Install steering box" },
    { id: "3", text: "Wire headlights" },
    { id: "4", text: "Fit windows" },
    { id: "5", text: "Install interior" },
    { id: "6", text: "Install engine" },
  ];

  const done = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: S.bg,
      fontFamily: S.font
    }}>

      <PaperBackground />

      {/* Header */}
      <div style={{
        background: "#111",
        color: "#fff",
        padding: 24
      }}>
        <div style={{ fontSize: 32, fontWeight: 900 }}>
          Order of works.
        </div>
        <div>{done}/{jobs.length} complete</div>
      </div>

      {/* Jobs */}
      <div style={{
        maxWidth: 700,
        margin: "40px auto",
        position: "relative",
        zIndex: 1
      }}>
        {jobs.map(job => (
          <div key={job.id}
            onClick={() => toggle(job.id)}
            style={{
              padding: 12,
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
              display: "flex",
              gap: 12
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              border: "2px solid #111",
              background: checked[job.id] ? "#111" : "transparent"
            }} />
            <div style={{
              textDecoration: checked[job.id] ? "line-through" : "none"
            }}>
              {job.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}