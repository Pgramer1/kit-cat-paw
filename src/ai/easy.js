// src/ai/easy.js
export function easyMove(board) {
  // return random empty cell index, or null if none
  const empty = board
    .map((v, idx) => (v ? null : idx))
    .filter((v) => v !== null);

  if (empty.length === 0) return null;
  // random choice
  const idx = Math.floor(Math.random() * empty.length);
  return empty[idx];
}
