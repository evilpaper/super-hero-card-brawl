import { expect, test } from "vitest";
import Card from "./card";

const card = new Card("♠︎", "9", 9, "Wolverine");

test("Card has correct properties", () => {
  expect(card).toEqual({
    name: "Wolverine",
    rank: "9",
    suite: "♠︎",
    value: 9,
    element: null,
  });
});

test("Card can be appended to the DOM", () => {
  expect(card).to;
});
