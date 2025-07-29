import './App.css';
import React from "react";
import CSVUploader from "./CSVUploader"; // Import the CSVUploader component
import BackgroundCarousel from "./BackgroundCarousel";

function App() {
  return (
    <div>
      <BackgroundCarousel />
      <h1
        style={{
          position: "absolute",
          top: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Urbanist', sans-serif",
          fontSize: "3rem",
          fontWeight: 900,
          color: "#fff",
          letterSpacing: "0.04em",
          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          zIndex: 2,
          margin: 0,
        }}
      >
        HeadsUp
      </h1>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Urbanist', sans-serif",
          background: "transparent",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.25)",
            borderRadius: "32px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.18)",
            padding: "3rem 2.5rem",
            maxWidth: "520px",
            width: "100%",
            height: "500px",
            overflowY: "auto",
            zIndex: 1,
          }}
        >
          <CSVUploader />
        </div>
      </div>
    </div>
  );
}

export default App;
