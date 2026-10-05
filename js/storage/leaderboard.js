import { LEADERBOARD_KEY, LEADERBOARD_LIMIT } from '../config.js';

export function formatDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function getLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (entry) =>
        entry &&
        typeof entry.moves === 'number' &&
        typeof entry.date === 'string',
    );
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

export function addLeaderboardResult(moves) {
  const now = new Date();
  const entries = getLeaderboard();

  entries.push({
    moves,
    date: formatDate(now),
    timestamp: now.getTime(),
  });

  entries.sort((a, b) => {
    if (a.moves !== b.moves) {
      return a.moves - b.moves;
    }
    return (a.timestamp ?? 0) - (b.timestamp ?? 0);
  });

  const top = entries.slice(0, LEADERBOARD_LIMIT);
  saveLeaderboard(top);
  return top;
}
