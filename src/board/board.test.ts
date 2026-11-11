import { expect, test, vi } from "vitest";
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

test("clear should shuffle unplayed cards back into the deck and keep folded cards out", () => {
  const deck = new Deck();
  const board = new Board(deck);
  board.draw(4);

  const initialBoardCards = [...board.cards];
  const foldedCard = initialBoardCards[0];
  foldedCard.play();
  const unplayedCards = initialBoardCards.slice(1);

  const initialDeckLength = deck.getCardCount();
  const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

  // Clear the board - this should return cards to deck and draw new ones
  board.clear();
  randomSpy.mockRestore();

  // One folded card should stay out of the deck.
  expect(deck.getCardCount()).toBe(initialDeckLength - 1);
  expect(deck.getCards()).not.toContain(foldedCard);

  // Returned cards should not remain grouped at the very end in the same order.
  const lastCardsInDeck = deck.getCards().slice(-unplayedCards.length);
  expect(lastCardsInDeck).not.toEqual(unplayedCards);

  // Returned cards must still be present somewhere after reshuffle.
  const inDeckOrBoard = [...deck.getCards(), ...board.cards];
  unplayedCards.forEach((card) => {
    expect(inDeckOrBoard).toContain(card);
  });
});

test("clear should not reshuffle the remaining deck when the room is fully folded", () => {
  const deck = new Deck();
  const board = new Board(deck);
  board.draw(4);

  board.cards.forEach((card) => card.play());
  const expectedNextRoom = deck.getCards().slice(0, 4);
  const shuffleSpy = vi.spyOn(deck, "shuffle");

  board.clear();

  expect(shuffleSpy).not.toHaveBeenCalled();
  expect(board.cards).toEqual(expectedNextRoom);
  shuffleSpy.mockRestore();
});
