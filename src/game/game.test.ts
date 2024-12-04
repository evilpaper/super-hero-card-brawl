import { expect, test } from "vitest";
import Game from "./game";
import Deck from "../deck/deck";
import Board from "../board/board";

test("Game should be initialized with a deck and a board", () => {
  const game = new Game();

  // Check if game has a deck
  expect(game.deck).toBeInstanceOf(Deck);
  expect(game.deck.cards.length).toBe(54);

  // Check if game has a board
  expect(game.board).toBeInstanceOf(Board);
  expect(game.board.cards.length).toBe(0);
});

test("Game should be able to be started. When so, board should be populated with 4 cards from the deck", () => {
  const game = new Game();
  const initialDeckSize = game.deck.cards.length;

  // Start game
  game.start();

  // Check if board have 4 cards
  expect(game.board.cards.length).toBe(4);

  // Ceck if deck have 4 fewer cards
  expect(game.deck.cards.length).toBe(initialDeckSize - 4);
});

test("Game should end when player health reach zero", () => {});
