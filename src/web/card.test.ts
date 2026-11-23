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

test("A card should grow under the pointer and settle back when it leaves", () => {
  const card = makeCard();
  card.placeAt(0, 0);
  const pastRest = CARD_WIDTH / 2 + 2;

  expect(card.contains(pastRest, 0)).toBe(false);
  expect(card.getDepth()).toBe(0);

  card.setPointer(0, 0);

  expect(card.getDepth()).toBeGreaterThan(0);

  for (let frame = 0; frame < 90; frame++) {
    card.update(1 / 60);
  }

  expect(card.contains(pastRest, 0)).toBe(true);

  card.setPointer(null, null);

  for (let frame = 0; frame < 90; frame++) {
    card.update(1 / 60);
  }

  expect(card.contains(pastRest, 0)).toBe(false);
  expect(card.getDepth()).toBe(0);
});

test("A card should stop being tappable once it is played", () => {
  const card = makeCard();

  expect(card.isTappable()).toBe(true);
  card.getCard().play();
  expect(card.isTappable()).toBe(false);
});

test("A grabbed card should stay lifted after the pointer leaves", () => {
  const card = makeCard();
  card.placeAt(0, 0);
  card.grab();
  card.setPointer(null, null);

  expect(card.getDepth()).toBeGreaterThan(0);

  card.letGo();

  expect(card.getDepth()).toBe(0);
});

