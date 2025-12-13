// src/App.jsx
import { useState, useEffect } from "react";
import Home from "./home";
import SetupSingle from "./SetupSingle";
import SetupMulti from "./SetupMulti";
import Board from "./Board";
import { getTheme, saveTheme, getSoundEnabled, saveSoundEnabled } from "./utils/storage";
import { sounds } from "./utils/sounds";
import "./styles.css";

export default function App() {
  const [view, setView] = useState("home"); // home | setup-single | setup-multi | game
  const [config, setConfig] = useState(null); // game configuration passed to Board
  const [theme, setTheme] = useState(getTheme());
  const [soundEnabled, setSoundEnabled] = useState(getSoundEnabled());

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // Update sound preference
  useEffect(() => {
    sounds.setEnabled(soundEnabled);
    saveSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  function handleStartGame(cfg) {
    setConfig(cfg);
    setView("game");
  }

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    sounds.playClick();
  }

  function toggleSound() {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    if (newValue) {
      sounds.playClick();
    }
  }

  return (
    <div className="app-root">
      <header className="header">
        <h1 className="title">Kit-Cat-Paw</h1>
        <p className="subtitle">a minimal, animated tic-tac-toe — petified</p>
      </header>

      <div className="controls-bar">
        <button 
          className="icon-button home-button" 
          onClick={() => setView("home")}
          aria-label="Go to home"
          title="Home"
        >
          🏠
        </button>
        
        <div className="controls-right">
          <button 
            className="icon-button" 
            onClick={toggleSound}
            aria-label="Toggle sound"
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button 
            className="icon-button" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

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
          <Board config={config} />
        )}
      </main>
    </div>
  );
}
