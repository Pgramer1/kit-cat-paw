// Local storage utilities for game stats
const STORAGE_KEY = 'kitcatpaw_stats';

export const getStats = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
      gamesPlayed: 0,
      catWins: 0,
      dogWins: 0,
      draws: 0,
      history: []
    };
  } catch {
    return {
      gamesPlayed: 0,
      catWins: 0,
      dogWins: 0,
      draws: 0,
      history: []
    };
  }
};

export const saveGameResult = (winner, mode, players) => {
  const stats = getStats();
  stats.gamesPlayed++;
  
  if (winner === 'draw') {
    stats.draws++;
  } else if (winner === 'cat') {
    stats.catWins++;
  } else if (winner === 'dog') {
    stats.dogWins++;
  }
  
  // Add to history (keep last 10 games)
  stats.history.unshift({
    winner,
    mode,
    players,
    timestamp: Date.now()
  });
  
  if (stats.history.length > 10) {
    stats.history = stats.history.slice(0, 10);
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
  
  return stats;
};

export const clearStats = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear stats:', e);
  }
};

// Theme storage
const THEME_KEY = 'kitcatpaw_theme';

export const getTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch {
    return 'dark';
  }
};

export const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
};

// Sound preference
const SOUND_KEY = 'kitcatpaw_sound';

export const getSoundEnabled = () => {
  try {
    const value = localStorage.getItem(SOUND_KEY);
    return value === null ? true : value === 'true';
  } catch {
    return true;
  }
};

export const saveSoundEnabled = (enabled) => {
  try {
    localStorage.setItem(SOUND_KEY, enabled.toString());
  } catch (e) {
    console.error('Failed to save sound preference:', e);
  }
};
