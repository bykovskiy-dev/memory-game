import { CARD_EMOJIS, TOTAL_PAIRS } from '../data/emojis.js';
import { MISMATCH_DELAY_MS } from '../config.js';
import { shuffle } from '../utils/shuffle.js';

export class Game {
  constructor() {
    this.cards = [];
    this.firstCardId = null;
    this.secondCardId = null;
    this.moves = 0;
    this.matchedPairs = 0;
    this.isLocked = false;
    this.isWon = false;
    this.mismatchTimerId = null;
    this.onChange = null;
    this.onWin = null;
  }

  subscribe(callback) {
    this.onChange = callback;
  }

  onVictory(callback) {
    this.onWin = callback;
  }

  startNewGame() {
    this.clearMismatchTimer();
    this.cards = this.createShuffledCards();
    this.firstCardId = null;
    this.secondCardId = null;
    this.moves = 0;
    this.matchedPairs = 0;
    this.isLocked = false;
    this.isWon = false;
    this.emit();
  }

  createShuffledCards() {
    const pairs = CARD_EMOJIS.flatMap((emoji, index) => [
      { id: `${index}-a`, emoji, isFlipped: false, isMatched: false },
      { id: `${index}-b`, emoji, isFlipped: false, isMatched: false },
    ]);

    return shuffle(pairs);
  }

  flipCard(cardId) {
    if (this.isWon || this.isLocked) {
      return;
    }

    const card = this.cards.find((item) => item.id === cardId);
    if (!card || card.isFlipped || card.isMatched) {
      return;
    }

    card.isFlipped = true;

    if (!this.firstCardId) {
      this.firstCardId = cardId;
      this.emit();
      return;
    }

    if (this.firstCardId === cardId) {
      return;
    }

    this.secondCardId = cardId;
    this.moves += 1;
    this.isLocked = true;
    this.emit();

    const first = this.cards.find((item) => item.id === this.firstCardId);
    const second = card;

    if (first && first.emoji === second.emoji) {
      first.isMatched = true;
      second.isMatched = true;
      this.matchedPairs += 1;
      this.firstCardId = null;
      this.secondCardId = null;
      this.isLocked = false;

      if (this.matchedPairs === TOTAL_PAIRS) {
        this.isWon = true;
        this.emit();
        if (this.onWin) {
          this.onWin(this.moves);
        }
        return;
      }

      this.emit();
      return;
    }

    this.mismatchTimerId = setTimeout(() => {
      if (first) {
        first.isFlipped = false;
      }
      second.isFlipped = false;
      this.firstCardId = null;
      this.secondCardId = null;
      this.isLocked = false;
      this.mismatchTimerId = null;
      this.emit();
    }, MISMATCH_DELAY_MS);
  }

  clearMismatchTimer() {
    if (this.mismatchTimerId !== null) {
      clearTimeout(this.mismatchTimerId);
      this.mismatchTimerId = null;
    }
  }

  getState() {
    return {
      cards: this.cards.map((card) => ({ ...card })),
      moves: this.moves,
      matchedPairs: this.matchedPairs,
      isLocked: this.isLocked,
      isWon: this.isWon,
    };
  }

  emit() {
    if (this.onChange) {
      this.onChange(this.getState());
    }
  }
}
