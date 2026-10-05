import { createElement } from './utils/dom.js';
import { createHeader } from './components/header.js';
import { createCounters } from './components/counters.js';
import { createBoard } from './components/board.js';
import { createModal } from './components/modal.js';
import {
  createVictoryContent,
  createLeaderboardContent,
} from './components/modal-content.js';
import { Game } from './game/game.js';
import { addLeaderboardResult, getLeaderboard } from './storage/leaderboard.js';

export function createApp() {
  const game = new Game();
  const modal = createModal();
  const counters = createCounters();
  let resultSavedForCurrentWin = false;

  const board = createBoard({
    onCardClick: (id) => game.flipCard(id),
  });

  const syncBoard = () => {
    const state = game.getState();
    board.render(state.cards);
    board.update(state.cards);
  };

  const startNewGame = () => {
    modal.close();
    resultSavedForCurrentWin = false;
    game.startNewGame();
    syncBoard();
  };

  const openLeaderboard = () => {
    const content = createLeaderboardContent({
      entries: getLeaderboard(),
      onClose: () => modal.close(),
    });
    modal.open(content);
  };

  const openVictory = (moves) => {
    if (!resultSavedForCurrentWin) {
      addLeaderboardResult(moves);
      resultSavedForCurrentWin = true;
    }

    const content = createVictoryContent({
      moves,
      onNewGame: startNewGame,
      onClose: () => modal.close(),
    });
    modal.open(content);
  };

  const header = createHeader({
    onNewGame: startNewGame,
    onLeaderboard: openLeaderboard,
  });

  const app = createElement('div', {
    className: 'app',
    children: [
      createElement('div', {
        className: 'app__container',
        children: [header.element, counters.element, board.element],
      }),
      modal.element,
    ],
  });

  game.subscribe((state) => {
    counters.update({
      moves: state.moves,
      matchedPairs: state.matchedPairs,
    });
    board.update(state.cards);
  });

  game.onVictory((moves) => {
    openVictory(moves);
  });

  const mount = (root = document.body) => {
    root.append(app);
    startNewGame();
  };

  return { mount, startNewGame, openLeaderboard };
}
