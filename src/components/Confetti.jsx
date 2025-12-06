// Confetti animation component
import { useEffect } from 'react';

export default function Confetti() {
  useEffect(() => {
    const colors = ['#ffffff', '#e0e0e0', '#c0c0c0', '#a0a0a0'];
    const emojis = ['🐱', '🐶', '🐾', '🦴', '⭐', '✨'];
    const confettiCount = 50;
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Mix of colored particles and emojis
      if (Math.random() > 0.5) {
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.fontSize = `${Math.random() * 20 + 20}px`;
      } else {
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
      }
      
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
      confetti.style.setProperty('--x', `${(Math.random() - 0.5) * 200}px`);
      
      container.appendChild(confetti);
    }

    // Cleanup after animation
    const timer = setTimeout(() => {
      container.remove();
    }, 4000);

    return () => {
      clearTimeout(timer);
      container.remove();
    };
  }, []);

  return null;
}
