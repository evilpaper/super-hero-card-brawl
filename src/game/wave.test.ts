import { expect, test, vi } from "vitest";
import Wave from "./wave";
import Deck from "./deck";

test("Wave should start empty", () => {
  const deck = new Deck();
  const wave = new Wave(deck);
  expect(wave.cards).toHaveLength(0);
});

test("Wave should be able to draw up to 4 cards", () => {
  const deck = new Deck();
  const wave = new Wave(deck);
  wave.draw(3);
  expect(wave.cards).toHaveLength(3);

  wave.draw(1);
  expect(wave.cards).toHaveLength(4);
});

test("dealNext should shuffle unplayed cards back into the deck and keep played cards out", () => {
  const deck = new Deck();
  const wave = new Wave(deck);
  wave.draw(4);

  const initialWaveCards = [...wave.cards];
  const playedCard = initialWaveCards[0];
  playedCard.play();
  const unplayedCards = initialWaveCards.slice(1);

  const initialDeckLength = deck.getCardCount();
  const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

  /**
   * Deal the next Wave - this should return cards to deck and draw new ones
   */
  wave.dealNext();
  randomSpy.mockRestore();

  /**
   * One played card should stay out of the deck.
   */
  expect(deck.getCardCount()).toBe(initialDeckLength - 1);
  expect(deck.getCards()).not.toContain(playedCard);

  /**
   * Returned cards should not remain grouped at the very end in the same order.
   */
  const lastCardsInDeck = deck.getCards().slice(-unplayedCards.length);
  expect(lastCardsInDeck).not.toEqual(unplayedCards);

  /**
   * Returned cards must still be present somewhere after reshuffle.
   */
  const inDeckOrWave = [...deck.getCards(), ...wave.cards];
  unplayedCards.forEach((card) => {
    expect(inDeckOrWave).toContain(card);
  });
});

test("dealNext should not reshuffle the remaining deck when the wave is fully played", () => {
  const deck = new Deck();
  const wave = new Wave(deck);
  wave.draw(4);

  wave.cards.forEach((card) => card.play());
  const expectedNextWave = deck.getCards().slice(0, 4);
  const shuffleSpy = vi.spyOn(deck, "shuffle");

  wave.dealNext();

  expect(shuffleSpy).not.toHaveBeenCalled();
  expect(wave.cards).toEqual(expectedNextWave);
  shuffleSpy.mockRestore();
});
