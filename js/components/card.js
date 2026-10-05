import { createElement } from '../utils/dom.js';

export function createCard({ id, emoji, onClick }) {
  const front = createElement('div', {
    className: 'card__face card__face--front',
    text: emoji,
  });

  const back = createElement('div', {
    className: 'card__face card__face--back',
    attrs: { 'aria-hidden': 'true' },
  });

  const inner = createElement('div', {
    className: 'card__inner',
    children: [back, front],
  });

  const button = createElement('button', {
    className: 'card',
    attrs: {
      type: 'button',
      'data-id': id,
      'aria-label': 'Hidden card',
    },
    children: [inner],
  });

  button.addEventListener('click', () => onClick(id));

  const update = ({ isFlipped, isMatched }) => {
    button.classList.toggle('card--flipped', isFlipped || isMatched);
    button.classList.toggle('card--matched', isMatched);
    button.disabled = isMatched;

    if (isFlipped || isMatched) {
      button.setAttribute('aria-label', `Card ${emoji}`);
    } else {
      button.setAttribute('aria-label', 'Hidden card');
    }
  };

  return { element: button, id, update };
}
