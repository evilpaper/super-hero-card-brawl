import { expect, test } from "vitest";
import GameCard from "../game/card";
import Card, { CARD_HEIGHT } from "./card";
import Script from "./script";
import Slots, { DEAL_INTERVAL, SLOT_COUNT, arrange } from "./slots";

function makeCards(count: number) {
  return Array.from(
    { length: count },
    () => new Card(new GameCard("♠︎", "5", 5, "5 of ♠︎")),
  );
}

/**
 * Lets springs settle so a card sits where its targets point.
 */
function settle(cards: Card[]) {
  for (let frame = 0; frame < 300; frame++) {
    cards.forEach((card) => card.update(1 / 60));
  }
}

test("A wide window should lay the Slots out in one row at full size", () => {
  const { scale, centers } = arrange(1400, 800);

  expect(scale).toBe(1);
  expect(new Set(centers.map((center) => center.y)).size).toBe(1);
});

test("A narrow window should lay the Slots out two by two, scaled to fit", () => {
  const { scale, centers } = arrange(390, 844);

  expect(scale).toBeLessThan(1);
  expect(new Set(centers.map((center) => center.x)).size).toBe(2);
  expect(new Set(centers.map((center) => center.y)).size).toBe(2);
});

test("Cards should never grow past full size", () => {
  expect(arrange(4000, 4000).scale).toBe(1);
});

test("There should always be four Slot centres", () => {
  expect(arrange(390, 844).centers).toHaveLength(SLOT_COUNT);
});

test("Dealing should send each card to its own Slot, one step at a time", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  const script = new Script();
  const { centers } = arrange(1400, 800);
  slots.layout(1400, 800);

  slots.deal(cards, script);
  script.update(0);
  settle(cards);

  expect(cards[0].contains(centers[0].x, centers[0].y)).toBe(true);
  expect(cards[1].contains(centers[1].x, centers[1].y)).toBe(false);

  script.update(DEAL_INTERVAL * 3 + 0.001);
  settle(cards);

  cards.forEach((card, slot) => {
    expect(card.contains(centers[slot].x, centers[slot].y)).toBe(true);
  });
});

test("A short Wave should keep its cards in the first Slots", () => {
  const cards = makeCards(3);
  const slots = new Slots();
  const script = new Script();
  const { centers } = arrange(1400, 800);
  slots.layout(1400, 800);

  slots.deal(cards, script);
  script.update(1);
  settle(cards);

  cards.forEach((card, slot) => {
    expect(card.contains(centers[slot].x, centers[slot].y)).toBe(true);
  });
  expect(cards.some((card) => card.contains(centers[3].x, centers[3].y))).toBe(
    false,
  );
});

test("Sending off should move every card out of its Slot, below the window", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  const script = new Script();
  const { centers } = arrange(1400, 800);
  slots.layout(1400, 800);
  slots.deal(cards, script);
  script.update(1);
  settle(cards);

  slots.sendOff(script);
  script.update(1);
  settle(cards);

  cards.forEach((card, slot) => {
    expect(card.contains(centers[slot].x, centers[slot].y)).toBe(false);
    expect(card.contains(centers[slot].x, 800 + CARD_HEIGHT)).toBe(true);
  });
});

test("A resize should not pull cards that were sent off back into their Slots", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  const script = new Script();
  slots.layout(1400, 800);
  slots.deal(cards, script);
  script.update(1);
  slots.sendOff(script);
  script.update(1);

  slots.layout(1200, 800);
  settle(cards);

  const { centers } = arrange(1200, 800);
  cards.forEach((card, slot) => {
    expect(card.contains(centers[slot].x, centers[slot].y)).toBe(false);
  });
});
