import { createElement } from '../utils/dom.js';

export function createVictoryContent({ moves, onNewGame, onClose }) {
  const title = createElement('h2', {
    className: 'modal__title',
    text: '🎉 You win!',
  });

  const message = createElement('p', {
    className: 'modal__text',
    text: 'You matched them all!',
  });

  const movesInfo = createElement('p', {
    className: 'modal__stats',
    text: `Moves: ${moves}`,
  });

  const newGameButton = createElement('button', {
    className: ['btn', 'btn--primary'],
    attrs: { type: 'button' },
    text: 'New Game',
  });

  const closeButton = createElement('button', {
    className: ['btn', 'btn--secondary'],
    attrs: { type: 'button' },
    text: 'Close',
  });

  newGameButton.addEventListener('click', onNewGame);
  closeButton.addEventListener('click', onClose);

  const actions = createElement('div', {
    className: 'modal__actions',
    children: [newGameButton, closeButton],
  });

  return createElement('div', {
    className: 'modal__body',
    children: [title, message, movesInfo, actions],
  });
}

export function createLeaderboardContent({ entries, onClose }) {
  const title = createElement('h2', {
    className: 'modal__title',
    text: 'Leaderboard',
  });

  const closeButton = createElement('button', {
    className: ['btn', 'btn--secondary'],
    attrs: { type: 'button' },
    text: 'Close',
  });
  closeButton.addEventListener('click', onClose);

  let body;

  if (entries.length === 0) {
    body = createElement('p', {
      className: 'modal__text',
      text: 'No results yet',
    });
  } else {
    const headerRow = createElement('div', {
      className: ['leaderboard__row', 'leaderboard__row--head'],
      children: [
        createElement('span', { text: '#' }),
        createElement('span', { text: 'Moves' }),
        createElement('span', { text: 'Date' }),
      ],
    });

    const rows = entries.map((entry, index) =>
      createElement('div', {
        className: 'leaderboard__row',
        children: [
          createElement('span', { text: String(index + 1) }),
          createElement('span', { text: String(entry.moves) }),
          createElement('span', { text: entry.date }),
        ],
      }),
    );

    body = createElement('div', {
      className: 'leaderboard',
      attrs: { role: 'table', 'aria-label': 'Top results' },
      children: [headerRow, ...rows],
    });
  }

  const actions = createElement('div', {
    className: 'modal__actions',
    children: [closeButton],
  });

  return createElement('div', {
    className: 'modal__body',
    children: [title, body, actions],
  });
}
