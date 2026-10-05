import { createElement } from '../utils/dom.js';
import { TOTAL_PAIRS } from '../data/emojis.js';

export function createCounters() {
  const movesValue = createElement('span', {
    className: 'counters__value',
    attrs: { 'data-role': 'moves' },
    text: '0',
  });

  const pairsValue = createElement('span', {
    className: 'counters__value',
    attrs: { 'data-role': 'pairs' },
    text: `0 / ${TOTAL_PAIRS}`,
  });

  const movesLabel = createElement('div', {
    className: 'counters__item',
    children: [
      createElement('span', { className: 'counters__label', text: 'Moves: ' }),
      movesValue,
    ],
  });

  const pairsLabel = createElement('div', {
    className: 'counters__item',
    children: [
      createElement('span', { className: 'counters__label', text: 'Pairs: ' }),
      pairsValue,
    ],
  });

  const element = createElement('div', {
    className: 'counters',
    children: [movesLabel, pairsLabel],
  });

  const update = ({ moves, matchedPairs }) => {
    movesValue.textContent = String(moves);
    pairsValue.textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;
  };

  return { element, update };
}
