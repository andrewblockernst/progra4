/**
 * Represents the game state for Tic Tac Toe
 * @typedef {Object} GameState
 * @property {string[][]} board - 3x3 array representing the game board
 * @property {string} currentPlayer - Current player ('X' or 'O')
 * @property {string|null} winner - Winner of the game ('X', 'O', 'tie', or null if game is ongoing)
 * @property {boolean} gameOver - Whether the game is over
 */

/**
 * Global state object for Tic Tac Toe game
 * @type {GameState}
 */

export const state = {
  board: Array(3)
    .fill(null)
    .map(() => Array(3).fill("")),
  currentPlayer: "X",
  winner: null,
  gameOver: false,
};
