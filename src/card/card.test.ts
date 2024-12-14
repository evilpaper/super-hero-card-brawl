import { expect, test } from "vitest";

import Card from "./card";

const card = new Card(
  "♠︎",
  "9",
  9,
  "Sabretooth",
  "../assets/images/cards/clover-9.jpg"
);

test("Card get initialised with correct properties", () => {
  expect(card).toEqual({
    name: "Sabretooth",
    rank: "9",
    suite: "♠︎",
    value: 9,
    played: false,
    image: "../assets/images/cards/clover-9.jpg",
  });
});

test("Card get played", () => {
  card.play();
  expect(card.played).toEqual(true);
});
