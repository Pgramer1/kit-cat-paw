// src/ai/medium.js
// Heuristic AI: win/block -> center -> corner -> side

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function findWinningMove(board, symbol) {
  // return index that makes `symbol` win, or null
  for (const [a,b,c] of WIN_LINES) {
    const vals = [board[a], board[b], board[c]];
    // if two are symbol and the third empty -> return empty index
    const countSym = vals.filter(v => v === symbol).length;
    const empties = [a,b,c].filter(i => !board[i]);
    if (countSym === 2 && empties.length === 1) return empties[0];
  }
  return null;
}

function randomChoice(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function mediumMove(board, aiSymbol) {
  const human = aiSymbol === "cat" ? "dog" : "cat";

  // 1) Win if possible
  const winIdx = findWinningMove(board, aiSymbol);
  if (winIdx !== null) return winIdx;

  // 2) Block human win
  const blockIdx = findWinningMove(board, human);
  if (blockIdx !== null) return blockIdx;

  // 3) Center
  if (!board[4]) return 4;

  // 4) Choose a random available corner
  const corners = [0,2,6,8].filter(i => !board[i]);
  if (corners.length) return randomChoice(corners);

  // 5) Sides
  const sides = [1,3,5,7].filter(i => !board[i]);
  if (sides.length) return randomChoice(sides);

  // fallback: random empty
  const empties = board.map((v,i) => (v ? null : i)).filter(i => i !== null);
  return empties.length ? randomChoice(empties) : null;
}

export default mediumMove;
