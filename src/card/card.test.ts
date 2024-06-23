import { expect, test } from "vitest";
import Card from "./card";

const card = new Card("♠︎", "9", 9, "Wolverine");

test("Card get initialised with correct properties", () => {
  expect(card).toEqual({
    name: "Wolverine",
    rank: "9",
    suite: "♠︎",
    value: 9,
    element: null,
    isFlipped: false,
  });
});
