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

/**
 * Deals a Wave and waits until every card is sitting in its Slot.
 */
function seat(slots: Slots, cards: Card[], width = 1400, height = 800) {
  const script = new Script();
  slots.layout(width, height);
  slots.deal(cards, script);
  script.update(1);
  settle(cards);
  return arrange(width, height);
}

/**
 * Holds a card over a point until its body and the other cards have arrived.
 * The order follows the card, so the drag has to keep being reported.
 */
function holdOver(
  slots: Slots,
  cards: Card[],
  card: Card,
  x: number,
  y: number,
) {
  slots.grab(card);

  for (let frame = 0; frame < 90; frame++) {
    slots.drag(card, x, y);
    cards.forEach((other) => other.update(1 / 60));
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

test("Dealing should park every card below the centre of the window", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  const script = new Script();
  const width = 1400;
  const height = 800;
  slots.layout(width, height);

  slots.deal(cards, script);

  cards.forEach((card) => {
    expect(card.contains(width / 2, height + CARD_HEIGHT)).toBe(true);
  });
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

test("A card still sitting in its Slot should keep that Slot while the pointer moves ahead", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  const { centers } = seat(slots, cards);

  slots.grab(cards[0]);
  slots.drag(cards[0], centers[3].x, centers[3].y);

  expect(cards[1].contains(centers[1].x, centers[1].y)).toBe(true);
  expect(cards[2].contains(centers[2].x, centers[2].y)).toBe(true);
  expect(cards[3].contains(centers[3].x, centers[3].y)).toBe(true);
});

test("Dragging a card onto another Slot should slide the others along", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  const { centers } = seat(slots, cards);
  const [held, left, middle, right] = cards;

  holdOver(slots, cards, held, centers[2].x, centers[2].y);

  expect(left.contains(centers[0].x, centers[0].y)).toBe(true);
  expect(middle.contains(centers[1].x, centers[1].y)).toBe(true);
  expect(right.contains(centers[3].x, centers[3].y)).toBe(true);
  expect(held.contains(centers[2].x, centers[2].y)).toBe(true);
});

test("Releasing a card should seat it in the Slot it claimed", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  const { centers } = seat(slots, cards);
  const [held, left] = cards;

  holdOver(slots, cards, held, centers[2].x, centers[2].y);
  slots.drop(held);
  settle(cards);

  expect(held.contains(centers[2].x, centers[2].y)).toBe(true);
  expect(left.contains(centers[0].x, centers[0].y)).toBe(true);
});

test("Dragging across a two by two layout should use the nearest Slot", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  const { centers } = seat(slots, cards, 390, 844);
  const [held, first, second, third] = cards;

  holdOver(slots, cards, held, centers[3].x, centers[3].y);

  expect(first.contains(centers[0].x, centers[0].y)).toBe(true);
  expect(second.contains(centers[1].x, centers[1].y)).toBe(true);
  expect(third.contains(centers[2].x, centers[2].y)).toBe(true);
  expect(held.contains(centers[3].x, centers[3].y)).toBe(true);
});

test("A card that has not been dealt in yet should not be picked up", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  const script = new Script();
  slots.layout(1400, 800);
  slots.deal(cards, script);

  slots.grab(cards[0]);

  expect(cards[0].getDepth()).toBe(0);
});

test("A resize should leave the held card on the pointer", () => {
  const cards = makeCards(4);
  const slots = new Slots();
  seat(slots, cards);

  slots.grab(cards[0]);
  slots.drag(cards[0], 10, 10);
  slots.layout(1200, 800);
  settle(cards);

  const { centers } = arrange(1200, 800);
  expect(cards[0].contains(10, 10)).toBe(true);
  expect(cards[1].contains(centers[1].x, centers[1].y)).toBe(true);
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
