export default function Square({ value, onClick, highlight, disabled }) {
  const emoji = value === "cat" ? "🐱" 
    : value === "dog" ? "🐶" 
    : value === "paw" ? "🐾" 
    : value === "bone" ? "🦴" 
    : "";
  
  // Easter egg: spawn floating emoji on click
  const handleClick = (e) => {
    if (!value && !disabled) {
      // Create floating easter egg
      const easterEgg = document.createElement('div');
      easterEgg.className = 'easter-egg';
      const randomEmojis = ['🐱', '🐶', '🐾', '🦴'];
      const randomEmoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
      easterEgg.textContent = randomEmoji;
      easterEgg.style.left = `${e.clientX}px`;
      easterEgg.style.top = `${e.clientY}px`;
      easterEgg.style.setProperty('--x', `${(Math.random() - 0.5) * 200}px`);
      easterEgg.style.setProperty('--y', `${-150 - Math.random() * 100}px`);
      document.body.appendChild(easterEgg);
      
      setTimeout(() => easterEgg.remove(), 3000);
    }
    onClick();
  };
  
  return (
    <button
      className={`square ${value ? "filled" : ""} ${highlight ? "highlight" : ""}`}
      onClick={handleClick}
      disabled={disabled || !!value}
      aria-label={value ? `${value}` : "empty"}
    >
      <span className="emoji">{emoji}</span>
      <span className="ripple" aria-hidden="true" />
    </button>
  );
}
