import { createElement } from '../utils/dom.js';
import { createCard } from './card.js';

export function createBoard({ onCardClick }) {
  const element = createElement('div', {
    className: 'board',
    attrs: { role: 'grid', 'aria-label': 'Memory game board' },
  });

  const cardViews = new Map();

  const render = (cards) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    cardViews.clear();

    cards.forEach((cardData) => {
      const card = createCard({
        id: cardData.id,
        emoji: cardData.emoji,
        onClick: onCardClick,
      });
      cardViews.set(cardData.id, card);
      element.append(card.element);
    });
  };

  const update = (cards) => {
    cards.forEach((cardData) => {
      const view = cardViews.get(cardData.id);
      if (view) {
        view.update({
          isFlipped: cardData.isFlipped,
          isMatched: cardData.isMatched,
        });
      }
    });
  };

  return { element, render, update };
}
