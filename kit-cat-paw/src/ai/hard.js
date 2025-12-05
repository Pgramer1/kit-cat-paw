// src/ai/hard.js
// Minimax with alpha-beta pruning for Tic-Tac-Toe
const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board) {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // "cat" or "dog"
    }
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

function availableMoves(board) {
  const res = [];
  board.forEach((v,i) => { if (!v) res.push(i); });
  return res;
}

/**
 * hardMove(board, aiSymbol, debug=false)
 * - board: Array(9) with "cat"|"dog"|null
 * - aiSymbol: "cat" or "dog"
 * - debug: if true, logs minimax decision info to console
 *
 * returns index (0..8) or null
 */
export function hardMove(board, aiSymbol, debug = false) {
  const human = aiSymbol === "cat" ? "dog" : "cat";

  // small optimization: if board empty, take center
  const empties = availableMoves(board);
  if (empties.length === 9) {
    if (debug) console.log("[hardMove] board empty -> choose center (4)");
    return 4;
  }

  // minimax returns { score, index }
  function minimax(bd, depth, isMaximizing, alpha, beta) {
    const winner = checkWinner(bd);
    if (winner === aiSymbol) return { score: 10 - depth };
    if (winner === human) return { score: -10 + depth };
    if (winner === "draw") return { score: 0 };

    const moves = availableMoves(bd);

    if (isMaximizing) {
      let bestVal = { score: -Infinity, index: null };
      for (const idx of moves) {
        bd[idx] = aiSymbol;
        const res = minimax(bd, depth + 1, false, alpha, beta);
        bd[idx] = null;
        if (res.score > bestVal.score) {
          bestVal = { score: res.score, index: idx };
        }
        alpha = Math.max(alpha, bestVal.score);
        if (beta <= alpha) break; // beta cut-off
      }
      return bestVal;
    } else {
      let bestVal = { score: Infinity, index: null };
      for (const idx of moves) {
        bd[idx] = human;
        const res = minimax(bd, depth + 1, true, alpha, beta);
        bd[idx] = null;
        if (res.score < bestVal.score) {
          bestVal = { score: res.score, index: idx };
        }
        beta = Math.min(beta, bestVal.score);
        if (beta <= alpha) break; // alpha cut-off
      }
      return bestVal;
    }
  }

  // For extra debugging info: compute score for each immediate move
  let debugCandidates = null;
  if (debug) debugCandidates = [];

  const best = minimax([...board], 0, true, -Infinity, Infinity);

  if (debug) {
    // compute candidates (immediate move scores) for logging (optional)
    const moves = availableMoves(board);
    for (const idx of moves) {
      board[idx] = aiSymbol;
      const res = minimax(board, 0, false, -Infinity, Infinity); // score when AI places idx
      board[idx] = null;
      debugCandidates.push({ idx, score: res.score });
    }

    console.group("%c[hardMove] minimax decision", "color:#0b7285; font-weight:700");
    console.log("aiSymbol:", aiSymbol, "human:", human);
    console.log("board:", board);
    console.log("candidates (idx:score):", debugCandidates.map(d => `${d.idx}:${d.score}`).join(", "));
    console.log("chosen ->", best.index, "score:", best.score);
    console.groupEnd();
  }

  return best.index;
}

export default hardMove;
