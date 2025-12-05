// src/SetupMulti.jsx
import { useState } from "react";

const ICONS = [
  { key: "cat", emoji: "🐱", label: "Cat" },
  { key: "dog", emoji: "🐶", label: "Dog" },
  { key: "paw", emoji: "🐾", label: "Paw" },
  { key: "bone", emoji: "🦴", label: "Bone" }
];

export default function SetupMulti({ onBack, onStart }) {
  const [p1, setP1] = useState("cat");
  const [p2, setP2] = useState("dog");

  function start() {
    // ensure different icons
    if (p1 === p2) {
      alert("Pick different icons for Player 1 and Player 2.");
      return;
    }
    onStart({
      player1: p1,
      player2: p2
    });
  }

  return (
    <div className="setup-card">
      <button className="ghost-btn" onClick={onBack}>← Back</button>

      <h3>Multiplayer</h3>
      <p className="muted">Choose icons for both players. Player 1 starts.</p>

      <div className="form-row">
        <label className="label">Player 1</label>
        <div className="icon-grid">
          {ICONS.map(ic => (
            <button
              key={ic.key}
              className={`icon-btn ${p1===ic.key ? "selected" : ""}`}
              onClick={() => setP1(ic.key)}
              aria-label={ic.label}
            >
              <span className="big-emoji">{ic.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <label className="label">Player 2</label>
        <div className="icon-grid">
          {ICONS.map(ic => (
            <button
              key={ic.key}
              className={`icon-btn ${p2===ic.key ? "selected" : ""}`}
              onClick={() => setP2(ic.key)}
              aria-label={ic.label}
            >
              <span className="big-emoji">{ic.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="actions-row">
        <button className="btn" onClick={start}>Start Game</button>
        <button className="btn ghost" onClick={onBack}>Cancel</button>
      </div>
    </div>
  );
}
