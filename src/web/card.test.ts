import { expect, test } from "vitest";
import GameCard from "../game/card";
import Card, { CARD_HEIGHT, CARD_WIDTH } from "./card";

function makeCard() {
  return new Card(new GameCard("♠︎", "5", 5, "5 of ♠︎"));
}

test("contains should hit the card where it is placed", () => {
  const card = makeCard();
  card.placeAt(100, 100);

  expect(card.contains(100, 100)).toBe(true);
  expect(card.contains(100 + CARD_WIDTH / 2 - 1, 100)).toBe(true);
  expect(card.contains(100 + CARD_WIDTH / 2 + 1, 100)).toBe(false);
});

test("contains should follow the card's rotation", () => {
  const card = makeCard();
  card.placeAt(0, 0, Math.PI / 2);

  /**
   * Turned a quarter, the card is wider than it is tall.
   */
  expect(card.contains(CARD_HEIGHT / 2 - 1, 0)).toBe(true);
  expect(card.contains(0, CARD_HEIGHT / 2 - 1)).toBe(false);
});

test("contains should follow the card's scale", () => {
  const card = makeCard();
  card.placeAt(0, 0, 0, 0.5);

  expect(card.contains(CARD_WIDTH / 4 - 1, 0)).toBe(true);
  expect(card.contains(CARD_WIDTH / 4 + 1, 0)).toBe(false);
});

test("A card should stop being tappable once it is played", () => {
  const card = makeCard();

  expect(card.isTappable()).toBe(true);
  card.getCard().play();
  expect(card.isTappable()).toBe(false);
});
