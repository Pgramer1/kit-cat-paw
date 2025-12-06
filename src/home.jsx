// src/Home.jsx
export default function Home({ onSingle, onMulti }) {
  return (
    <section className="home">
      <div className="home-card">
        <h2 className="home-title">Play Kit-Cat-Paw</h2>
        <p className="home-sub">Choose a mode to get started</p>

        <div className="home-actions">
          <button className="big-btn" onClick={onSingle}>
            Single Player
            <span className="hint">Easy • Medium • Hard</span>
          </button>

          <button className="big-btn outline" onClick={onMulti}>
            Multiplayer
            <span className="hint">Two players on one device</span>
          </button>
        </div>

        <div className="home-footer">
          <p className="footer-text">Purr-fectly crafted with ❤️ • Paw-some tic-tac-toe</p>
          <p className="footer-tagline">May the best pet win 🐱🐶 • © 2025</p>
        </div>
      </div>
    </section>
  );
}
