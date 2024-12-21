import { expect, test } from "vitest";

import Deck from "./deck";

test("Deck should be created with 52 cards", () => {
  const deck = new Deck();
  expect(deck.getCardCount()).toBe(54);
});

test("Deck should be able to be shuffled", () => {
  const deck = new Deck();

  const originalOrder = [...deck.getCards()];

  deck.shuffle();

  // Check that cards are in different order
  const orderHasChanged = deck.getCards().some((card, index) => {
    const originalCard = originalOrder[index];
    return (
      card.getSuite() !== originalCard.getSuite() ||
      card.getValue() !== originalCard.getValue()
    );
  });

  // Verify all original cards are still present
  const allCardsPresent = originalOrder.every((originalCard) =>
    deck
      .getCards()
      .some(
        (shuffledCard) =>
          shuffledCard.getSuite() === originalCard.getSuite() &&
          shuffledCard.getValue() === originalCard.getValue()
      )
  );

  expect(orderHasChanged).toBe(true);
  expect(allCardsPresent).toBe(true);
  expect(deck.getCardCount()).toBe(54);
});

test("Deck should be able to return drawn cards, 1 - 4", () => {
  const deck = new Deck();

  // Test drawing 1 card
  const singleDraw = deck.drawCard(1);
  expect(singleDraw).toHaveLength(1);
  expect(deck.getCardCount()).toBe(53);

  // Test drawing 3 cards
  const threeDraw = deck.drawCard(3);
  expect(threeDraw).toHaveLength(3);
  expect(deck.getCardCount()).toBe(50);

  // Test drawing 4 cards
  const fourDraw = deck.drawCard(4);
  expect(fourDraw).toHaveLength(4);
  expect(deck.getCardCount()).toBe(46);

  // Test invalid count (0 or negative)
  expect(deck.drawCard(0)).toHaveLength(0);
  expect(deck.drawCard(-1)).toHaveLength(0);

  // Test count greater than 4
  expect(deck.drawCard(5)).toHaveLength(0);

  // Test drawing when less than requested cards remain
  const remainingCards = deck.getCardCount();
  for (let i = 0; i < remainingCards; i += 4) {
    deck.drawCard(4);
  }
  expect(deck.drawCard(4)).toHaveLength(0);
});

test("Deck should be able to receive returned cards, 1 - 4", () => {
  const deck = new Deck();

  // Test drawing and returning multiple cards
  const drawnCards = deck.drawCard(4);
  expect(deck.getCardCount()).toBe(50);

  deck.returnCard(drawnCards);
  expect(deck.getCardCount()).toBe(54);

  // Test returning empty array
  deck.returnCard([]);
  expect(deck.getCardCount()).toBe(54);

  // Test returning cards in multiple batches
  const moreDraw = deck.drawCard(3);
  expect(deck.getCardCount()).toBe(51);

  deck.returnCard(moreDraw.slice(0, 1));
  expect(deck.getCardCount()).toBe(52);

  deck.returnCard(moreDraw.slice(1));
  expect(deck.getCardCount()).toBe(54);
});
