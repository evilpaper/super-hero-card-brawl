import { expect, test } from "vitest";

import Card from "./card";

const card = new Card("♠︎", "9", 9, "Sabretooth");

test("Card get initialised with correct properties", () => {
  expect(card).toEqual({
    name: "Sabretooth",
    rank: "9",
    suite: "♠︎",
    value: 9,
    played: false,
    id: expect.any(String),
  });
});

test("Card get played", () => {
  card.play();
  expect(card.getPlayed()).toEqual(true);
});
