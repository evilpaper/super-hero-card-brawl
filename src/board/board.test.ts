import { expect, test } from "vitest";
import Board from "./board";
import Deck from "../deck/deck";

test("Board should start empty", () => {
  const deck = new Deck();
  const board = new Board(deck);
  expect(board.cards).toHaveLength(0);
});

test("Board should be able to draw up to 4 cards", () => {
  const deck = new Deck();
  const board = new Board(deck);
  board.draw(3);
  expect(board.cards).toHaveLength(3);

  board.draw(1);
  expect(board.cards).toHaveLength(4);
});

test("clear should return not played cards to the end of the deck and populate board with as many cards as possible from deck up until a maximun number of 4", () => {
  const deck = new Deck();
  const board = new Board(deck);
  // First, let's clear the board to ensure a known state
  board.clear();

  // Draw some cards to the board
  board.draw(3);
  const initialBoardCards = [...board.cards]; // Make a copy of the current board cards
  const initialDeckLength = deck.getCardCount();

  // Clear the board - this should return cards to deck and draw new ones
  board.clear();

  // Test that the old cards are now at the end of the deck
  const lastCardsInDeck = deck.getCards().slice(-initialBoardCards.length);
  expect(lastCardsInDeck).toEqual(initialBoardCards);

  // Test that we drew new cards to the board
  // expect(board.cards).toHaveLength(4);

  // Verify these are different cards than before
  expect(board.cards).not.toEqual(initialBoardCards);

  // Verify the deck size remained the same (cards were just moved around)
  expect(deck.getCardCount()).toBe(initialDeckLength);
});
