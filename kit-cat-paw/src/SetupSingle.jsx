// src/SetupSingle.jsx
import { useState } from "react";

export default function SetupSingle({ onBack, onStart }) {
  const [symbol, setSymbol] = useState("cat"); // human symbol
  const [difficulty, setDifficulty] = useState("easy");
  const [debugAI, setDebugAI] = useState(false);

  function start() {
    // config fields for Board: mode will be set by App
    onStart({
      humanSymbol: symbol,
      difficulty,
      debugAI
    });
  }

  return (
    <div className="setup-card">
      <button className="ghost-btn" onClick={onBack}>← Back</button>

      <h3>Single Player</h3>
      <p className="muted">Choose your side and difficulty. Who goes first is randomized.</p>

      <div className="form-row">
        <label className="label">You are</label>
        <div className="radio-row">
          <label className="radio">
            <input type="radio" name="sym" checked={symbol==="cat"} onChange={() => setSymbol("cat")} />
            <span className="radio-emoji">🐱</span> Cat
          </label>

          <label className="radio">
            <input type="radio" name="sym" checked={symbol==="dog"} onChange={() => setSymbol("dog")} />
            <span className="radio-emoji">🐶</span> Dog
          </label>
        </div>
      </div>

      <div className="form-row">
        <label className="label">Difficulty</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy (random)</option>
          <option value="medium">Medium (win/block)</option>
          <option value="hard">Hard (minimax)</option>
        </select>
      </div>

      <div className="form-row small">
        <label>
          <input type="checkbox" checked={debugAI} onChange={() => setDebugAI(!debugAI)} />
          <span style={{marginLeft:8}}>Enable hard AI debug logs</span>
        </label>
      </div>

      <div className="actions-row">
        <button className="btn" onClick={start}>Start Game</button>
        <button className="btn ghost" onClick={onBack}>Cancel</button>
      </div>
    </div>
  );
}
