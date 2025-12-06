// src/Board.jsx
import { useEffect, useRef, useState } from "react";
import Square from "./Square";
import Confetti from "./components/Confetti";
import { easyMove } from "./ai/easy";
import { mediumMove } from "./ai/medium";
import { hardMove } from "./ai/hard";
import { sounds } from "./utils/sounds";
import { getStats, saveGameResult, clearStats } from "./utils/storage";

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const LINE_META = {
  "0,1,2": { cx: 1, cy: 0, angle: 0 },
  "3,4,5": { cx: 1, cy: 1, angle: 0 },
  "6,7,8": { cx: 1, cy: 2, angle: 0 },
  "0,3,6": { cx: 0, cy: 1, angle: 90 },
  "1,4,7": { cx: 1, cy: 1, angle: 90 },
  "2,5,8": { cx: 2, cy: 1, angle: 90 },
  "0,4,8": { cx: 1, cy: 1, angle: 45 },
  "2,4,6": { cx: 1, cy: 1, angle: -45 }
};

export default function Board({ config }) {
  // config contains different fields depending on mode:
  // single: { mode: "single", humanSymbol, difficulty, debugAI }
  // multiplayer: { mode: "multiplayer", player1, player2 }
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("cat"); // who's turn (symbol key)
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });
  const [gameStarted, setGameStarted] = useState(false);
  const [stats, setStats] = useState(getStats());
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const boardRef = useRef(null);

  // determine mode & symbols
  const mode = config?.mode || "multiplayer";
  // multiplayer: player1 starts and player1/player2 keys chosen
  const player1 = config?.player1 || "cat";
  const player2 = config?.player2 || "dog";

  // single-player config
  const humanSymbol = config?.humanSymbol || "cat";
  const aiSymbol = humanSymbol === "cat" ? "dog" : "cat";
  const difficulty = config?.difficulty || "easy";
  const debugAI = Boolean(config?.debugAI);

  // for single mode we set who is AI symbol with ref
  const aiSymbolRef = useRef(aiSymbol);

  function checkWinner(bd) {
    for (const line of WIN_LINES) {
      const [a,b,c] = line;
      if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) {
        return { winner: bd[a], line };
      }
    }
    if (bd.every(Boolean)) return { winner: "draw", line: null };
    return { winner: null, line: null };
  }

  // start logic: for multiplayer set player1 start; for single randomize first
  useEffect(() => {
    setBoard(Array(9).fill(null));
    setWinnerInfo({ winner: null, line: null });

    if (mode === "multiplayer") {
      setPlayer(player1);
      setGameStarted(true);
    } else {
      // single: random first between human and AI
      const first = Math.random() < 0.5 ? humanSymbol : aiSymbol;
      aiSymbolRef.current = aiSymbol;
      setPlayer(first);
      setGameStarted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  function handleClick(i) {
    if (board[i] || winnerInfo.winner) return;
    // block human clicking on AI's turn when single
    if (mode === "single" && player === aiSymbolRef.current) return;

    const nb = [...board];
    nb[i] = player;
    setBoard(nb);

    // Play sound for the move
    if (player === "cat") sounds.playCat();
    else if (player === "dog") sounds.playDog();
    else sounds.playClick();

    const res = checkWinner(nb);
    if (res.winner) {
      setWinnerInfo(res);
      handleGameEnd(res.winner);
    } else {
      // swap turn based on mode
      if (mode === "multiplayer") {
        setPlayer(player === player1 ? player2 : player1);
      } else {
        setPlayer(player === "cat" ? "dog" : "cat");
      }
    }
  }

  function handleGameEnd(winner) {
    // Save game result
    const newStats = saveGameResult(winner, mode, { player1, player2 });
    setStats(newStats);

    // Play appropriate sound and animation
    if (winner === "draw") {
      sounds.playDraw();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      sounds.playWin();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }

  // AI effect for single mode
  useEffect(() => {
    if (mode !== "single") return;
    if (!gameStarted) return;
    if (winnerInfo.winner) return;

    const aiSym = aiSymbolRef.current;
    const human = humanSymbol;

    if (player === aiSym) {
      const t = setTimeout(() => {
        let idx = null;
        if (difficulty === "easy") idx = easyMove(board);
        else if (difficulty === "medium") idx = mediumMove(board, aiSym);
        else if (difficulty === "hard") idx = hardMove(board, aiSym, debugAI);

        if (idx == null) return;
        const nb = [...board];
        nb[idx] = aiSym;
        setBoard(nb);
        
        // Play sound for AI move
        if (aiSym === "cat") sounds.playCat();
        else sounds.playDog();
        
        const res = checkWinner(nb);
        if (res.winner) {
          setWinnerInfo(res);
          handleGameEnd(res.winner);
        }
        else setPlayer(human);
      }, 420);

      return () => clearTimeout(t);
    }
  }, [player, mode, board, winnerInfo, difficulty, gameStarted, humanSymbol, debugAI]);

  const winningKey = winnerInfo.line ? winnerInfo.line.join(",") : null;

  // helper to show emoji for many keys (extend as needed)
  function emojiFor(key) {
    return key === "cat" ? "🐱"
      : key === "dog" ? "🐶"
      : key === "paw" ? "🐾"
      : key === "bone" ? "🦴"
      : key;
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Stats Panel */}
      <div className="stats-panel">
        <h3 className="stats-title">📊 Game Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{stats.gamesPlayed}</span>
            <span className="stat-label">Games</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.catWins}</span>
            <span className="stat-label">🐱 Wins</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.dogWins}</span>
            <span className="stat-label">🐶 Wins</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.draws}</span>
            <span className="stat-label">Draws</span>
          </div>
        </div>

        {/* History */}
        {stats.history && stats.history.length > 0 && (
          <div className="history-section">
            <h4 className="stats-title">Recent Games</h4>
            <div className="history-list">
              {stats.history.slice(0, 5).map((game, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-result">
                    {game.winner === 'draw' ? '🤝 Draw' : `${emojiFor(game.winner)} Won`}
                  </span>
                  <span className="history-time">
                    {new Date(game.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="clear-stats-btn" onClick={() => {
          if (confirm('Clear all game statistics?')) {
            clearStats();
            setStats(getStats());
          }
        }}>
          Clear Stats
        </button>
      </div>

      <div className={`board-wrap board-game ${shake ? 'shake-animation' : ''}`} ref={boardRef}>
        <div className="status-row">
          <div className="turn">
            {winnerInfo.winner
              ? winnerInfo.winner === "draw" ? "🤝 It's a Draw!" : `${emojiFor(winnerInfo.winner)} Wins!`
              : mode === "single" && !gameStarted ? "Starting..." : `Turn: ${emojiFor(player)}`
            }
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {mode === "single" && <div className="muted">Difficulty: {difficulty}</div>}
            <button className="btn" onClick={() => {
              sounds.playClick();
              setBoard(Array(9).fill(null));
              setWinnerInfo({ winner: null, line: null });
              setShowConfetti(false);
              setShake(false);
              if (mode === "multiplayer") setPlayer(player1);
              else setPlayer(Math.random() < 0.5 ? humanSymbol : aiSymbol);
            }}>Restart</button>
          </div>
        </div>

        <div className="board">
          {board.map((v, idx) => (
            <Square
              key={idx}
              value={v}
              onClick={() => handleClick(idx)}
              highlight={winnerInfo.line && winnerInfo.line.includes(idx)}
              disabled={!!winnerInfo.winner}
            />
          ))}

          {winnerInfo.line && winnerInfo.winner !== "draw" && (
            <WinningLine lineKey={winningKey} />
          )}
        </div>
      </div>
    </>
  );
}

// WinningLine same as before
function WinningLine({ lineKey }) {
  const meta = LINE_META[lineKey];
  if (!meta) return null;
  const cellCenterPct = (n) => `${(n * 33.333) + 16.666}%`;
  const centerX = cellCenterPct(meta.cx);
  const centerY = cellCenterPct(meta.cy);
  const angle = meta.angle;
  const lengthPct = (angle === 0 || Math.abs(angle) === 90) ? "68%" : "95%";

  return (
    <div
      className="winning-line"
      style={{
        '--line-left': centerX,
        '--line-top': centerY,
        '--line-angle': `${angle}deg`,
        '--line-width': lengthPct
      }}
    />
  );
}
