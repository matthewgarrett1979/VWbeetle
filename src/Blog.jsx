import { useState, useEffect } from "react";
import { S } from "./constants.js";

const UPSTASH_URL = "https://tight-magpie-91087.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAWPPAAIncDEyZTk4MjE1MTdmMmU0ODJiYTkzOWY5NTlmZDhkOTgyOXAxOTEwODc";
const BLOG_KEY = "beetle-blog-posts";
const AUTH_KEY = "beetle-auth";

async function fetchPosts() {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${BLOG_KEY}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : [];
  } catch { return []; }
}

async function savePosts(posts) {
  try {
    const encoded = encodeURIComponent(JSON.stringify(posts));
    await fetch(`${UPSTASH_URL}/set/${BLOG_KEY}/${encoded}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
  } catch {}
}

// ─── Lock icons ───────────────────────────────────────────────────────────────
function LockIcon({ unlocked }) {
  return unlocked ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="8" rx="1" stroke="#22c55e" strokeWidth="1.5"/>
      <path d="M5 7V5a3 3 0 0 1 6 0" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="11" r="1" fill="#22c55e"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="8" rx="1" stroke="#888" strokeWidth="1.5"/>
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="11" r="1" fill="#888"/>
    </svg>
  );
}

export default function Blog({ setPage }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinChecking, setPinChecking] = useState(false);
  const [pinInputError, setPinInputError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === "1") setAdminMode(true);
    fetchPosts().then(p => { setPosts(p); setLoading(false); });
  }, []);

  // ─── TOTP verify ─────────────────────────────────────────────────────────────
  async function verifyCode(code) {
    setPinChecking(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: code }),
      });
      const data = await res.json();
      if (data.valid) {
        setAdminMode(true);
        sessionStorage.setItem(AUTH_KEY, "1");
        setShowPinEntry(false);
        setPin("");
      } else {
        setPinError(true);
        setPinInputError(true);
        setTimeout(() => { setPin(""); setPinError(false); setPinInputError(false); }, 600);
      }
    } catch {
      setPinError(true);
      setPinInputError(true);
      setTimeout(() => { setPin(""); setPinError(false); setPinInputError(false); }, 600);
    } finally {
      setPinChecking(false);
    }
  }

  function handlePinDigit(d) {
    if (pin.length >= 6 || pinChecking) return;
    const next = pin + d;
    setPin(next);
    setPinError(false);
    if (next.length === 6) verifyCode(next);
  }

  function handlePinBack() {
    setPin(p => p.slice(0, -1));
    setPinError(false);
  }

  function handleLockToggle() {
    if (adminMode) {
      setAdminMode(false);
      sessionStorage.removeItem(AUTH_KEY);
    } else {
      setPin("");
      setPinError(false);
      setShowPinEntry(true);
    }
  }

  // ─── Publish ─────────────────────────────────────────────────────────────────
  async function handlePublish() {
    if (!newTitle.trim() || !newBody.trim()) return;
    setSaving(true);
    const now = new Date();
    const month = now.toLocaleString("en-GB", { month: "long" });
    const year = now.getFullYear();
    const post = {
      id: Date.now(),
      date: `${month} ${year}`,
      title: newTitle.trim(),
      body: newBody.trim(),
      summary: newBody.trim().slice(0, 120),
    };
    const updated = [post, ...posts];
    await savePosts(updated);
    setPosts(updated);
    setNewTitle("");
    setNewBody("");
    setSaving(false);
    setShowEditor(false);
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;
    const updated = posts.filter(p => p.id !== id);
    await savePosts(updated);
    setPosts(updated);
    setSelectedPost(null);
  }

  // ─── PIN overlay ─────────────────────────────────────────────────────────────
  if (showPinEntry) {
    const digits = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: S.font }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 32 }}>{pinChecking ? "Checking..." : "Authenticator Code"}</div>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          placeholder="······"
          autoFocus
          onChange={e => {
            if (pinChecking) return;
            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPin(val);
            setPinError(false);
            if (val.length === 6) verifyCode(val);
          }}
          onPaste={e => {
            e.preventDefault();
            if (pinChecking) return;
            const val = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            setPin(val);
            setPinError(false);
            if (val.length === 6) verifyCode(val);
          }}
          style={{ width: 160, fontSize: 28, fontWeight: 900, textAlign: "center", letterSpacing: 8, border: `2px solid ${pinInputError ? S.red : "#111"}`, background: S.cream, color: S.ink, fontFamily: S.font, padding: "12px 8px", outline: "none", marginBottom: 16, transition: "border-color 0.15s", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: pin.length > i ? (pinError ? S.red : S.cream) : "#333", transition: "background 0.15s" }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 64px)", gap: 10 }}>
          {digits.map((d, i) => (
            <button key={i} onClick={() => d === "⌫" ? handlePinBack() : d !== "" ? handlePinDigit(d) : null}
              style={{ height: 64, background: d === "" ? "transparent" : "#1a1a1a", border: d === "" ? "none" : "1px solid #333", color: S.cream, fontSize: d === "⌫" ? 20 : 22, fontFamily: S.font, cursor: d === "" ? "default" : "pointer", borderRadius: 2 }}>
              {d}
            </button>
          ))}
        </div>
        <button onClick={() => { setShowPinEntry(false); setPin(""); }} style={{ marginTop: 32, background: "none", border: "none", color: "#555", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: S.font }}>Cancel</button>
      </div>
    );
  }

  // ─── Editor ──────────────────────────────────────────────────────────────────
  if (showEditor) {
    return (
      <div style={{ minHeight: "100vh", background: S.cream, fontFamily: S.font, overflowX: "hidden", width: "100%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px clamp(16px, 4vw, 48px) 64px" }}>
          <button onClick={() => setShowEditor(false)} style={{ background: "none", border: "none", fontFamily: S.font, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#888", cursor: "pointer", padding: 0, marginBottom: 32 }}>← Back</button>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Post title"
            style={{ display: "block", width: "100%", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, color: S.ink, fontFamily: S.font, border: "none", borderBottom: S.border, background: "transparent", outline: "none", paddingBottom: 12, marginBottom: 28, letterSpacing: -0.5, boxSizing: "border-box" }}
          />
          <textarea
            value={newBody}
            onChange={e => setNewBody(e.target.value)}
            placeholder="Write your post here..."
            rows={18}
            style={{ display: "block", width: "100%", fontSize: 14, fontFamily: S.font, color: "#333", lineHeight: 1.9, border: S.border, background: S.cream, outline: "none", padding: 16, resize: "vertical", boxSizing: "border-box", marginBottom: 24 }}
          />
          <button onClick={handlePublish} disabled={saving || !newTitle.trim() || !newBody.trim()}
            style={{ background: saving ? "#555" : S.ink, color: S.cream, border: "none", fontFamily: S.font, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", padding: "14px 32px", cursor: saving ? "default" : "pointer" }}>
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Full post view ───────────────────────────────────────────────────────────
  if (selectedPost) {
    return (
      <div style={{ minHeight: "100vh", background: S.cream, fontFamily: S.font, overflowX: "hidden", width: "100%" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px clamp(16px, 4vw, 48px) 64px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
            <button onClick={() => setSelectedPost(null)} style={{ background: "none", border: "none", fontFamily: S.font, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#888", cursor: "pointer", padding: 0 }}>← Back</button>
            {adminMode && (
              <button onClick={() => handleDelete(selectedPost.id)} style={{ background: "none", border: "none", fontFamily: S.font, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: S.red, cursor: "pointer", padding: 0, fontWeight: 700 }}>Delete</button>
            )}
          </div>
          <div style={{ fontSize: 9, color: S.red, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>{selectedPost.date}</div>
          <div style={{ fontSize: "clamp(22px, 5vw, 42px)", fontWeight: 900, color: S.ink, letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 28 }}>{selectedPost.title}.</div>
          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.9 }}>
            {selectedPost.body.split("\n").map((para, i) => para.trim() ? <p key={i} style={{ marginBottom: 16 }}>{para}</p> : <br key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // ─── Posts list ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: S.cream, fontFamily: S.font }}>
      {/* Header */}
      <div style={{ background: S.ink, borderBottom: S.border, padding: "32px clamp(16px, 4vw, 48px) 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: "100%", boxSizing: "border-box" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 6, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>Restoration log</div>
            <div style={{ fontSize: "clamp(22px, 5vw, 42px)", fontWeight: 900, color: S.cream, letterSpacing: -1, lineHeight: 1 }}>Build Journal.</div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>A record of the restoration as it happens.</div>
          </div>
          <div onClick={handleLockToggle} style={{ cursor: "pointer", paddingBottom: 4 }}>
            <LockIcon unlocked={adminMode} />
          </div>
        </div>
      </div>

      {/* Admin: new post button */}
      {adminMode && (
        <div style={{ borderBottom: S.border, background: S.darkCream }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "12px clamp(16px, 4vw, 48px)" }}>
            <button onClick={() => setShowEditor(true)}
              style={{ background: S.red, color: "#fff", border: "none", fontFamily: S.font, fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", padding: "10px 20px", cursor: "pointer" }}>
              New Post +
            </button>
          </div>
        </div>
      )}

      {/* Posts */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px clamp(16px, 4vw, 48px) 64px" }}>
        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", fontSize: 10, color: "#aaa", letterSpacing: 4, textTransform: "uppercase" }}>Loading...</div>
        ) : posts.length === 0 ? (
          <div style={{ border: S.border, padding: "64px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: S.ink, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>No posts yet.</div>
            <div style={{ fontSize: 11, color: "#777", lineHeight: 1.8 }}>Updates from the build will appear here.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {posts.map(post => (
              <div key={post.id} onClick={() => setSelectedPost(post)} style={{ border: S.border, padding: "24px", cursor: "pointer", background: S.cream, transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = S.darkCream}
                onMouseLeave={e => e.currentTarget.style.background = S.cream}>
                <div style={{ fontSize: 9, color: S.red, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>{post.date}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: S.ink, letterSpacing: -0.3, marginBottom: 8, lineHeight: 1.2 }}>{post.title}</div>
                <div style={{ fontSize: 12, color: "#777", lineHeight: 1.7 }}>{post.summary}{post.summary.length >= 120 ? "…" : ""}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
