// App.jsx
import { useState } from "react";
import Checklist from "./Checklist.jsx";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      <Header page={page} setPage={setPage} />
      {page === "home" && <Home />}
      {page === "checklist" && <Checklist />}
    </div>
  );
}

function Header({ page, setPage }) {
  return (
    <div style={{
      borderBottom: "2px solid #111",
      background: "#f4f0e7",
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div style={{ fontWeight: 900 }}>1967 BEETLE</div>
      <div>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("checklist")}>Checklist</button>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div style={{
      height: "80vh",
      background: "#f4f0e7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 48,
      fontWeight: 900
    }}>
      Think small.
    </div>
  );
}