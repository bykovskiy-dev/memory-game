import { createElement } from '../utils/dom.js';

export function createHeader({ onNewGame, onLeaderboard }) {
  const title = createElement('h1', {
    className: 'header__title',
    text: '🧠 Emoji Memory Match',
  });

  const newGameButton = createElement('button', {
    className: ['btn', 'btn--primary'],
    attrs: { type: 'button' },
    text: 'New Game',
  });

  const leaderboardButton = createElement('button', {
    className: ['btn', 'btn--secondary'],
    attrs: { type: 'button' },
    text: 'Leaderboard',
  });

  newGameButton.addEventListener('click', onNewGame);
  leaderboardButton.addEventListener('click', onLeaderboard);

  const actions = createElement('div', {
    className: 'header__actions',
    children: [newGameButton, leaderboardButton],
  });

  const header = createElement('header', {
    className: 'header',
    children: [title, actions],
  });

  return { element: header, newGameButton, leaderboardButton };
}
