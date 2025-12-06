// src/App.jsx
import { useState } from "react";
import Home from "./home";
import SetupSingle from "./SetupSingle";
import SetupMulti from "./SetupMulti";
import Board from "./Board";
import "./styles.css";

export default function App() {
  const [view, setView] = useState("home"); // home | setup-single | setup-multi | game
  const [config, setConfig] = useState(null); // game configuration passed to Board

  function handleStartGame(cfg) {
    setConfig(cfg);
    setView("game");
  }

  return (
    <div className="app-root">
      <header className="header">
        <h1 className="title">Kit-Cat-Paw</h1>
        <p className="subtitle">a minimal, animated tic-tac-toe — petified</p>
      </header>

      <main className="main-area">
        {view === "home" && (
          <Home
            onSingle={() => setView("setup-single")}
            onMulti={() => setView("setup-multi")}
          />
        )}

        {view === "setup-single" && (
          <SetupSingle
            onBack={() => setView("home")}
            onStart={(cfg) => handleStartGame({ ...cfg, mode: "single" })}
          />
        )}

        {view === "setup-multi" && (
          <SetupMulti
            onBack={() => setView("home")}
            onStart={(cfg) => handleStartGame({ ...cfg, mode: "multiplayer" })}
          />
        )}

        {view === "game" && (
          <div className="game-wrap">
            <button className="ghost-btn" onClick={() => setView("home")}>
              ← Home
            </button>
            <Board config={config} />
          </div>
        )}
      </main>

      {/* <footer className="footer">Purr-fectly crafted with ❤️ • Paw-some tic-tac-toe</footer> */}
    </div>
  );
}
