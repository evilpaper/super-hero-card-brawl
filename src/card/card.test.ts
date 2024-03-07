import { expect, test } from "vitest";
import Card from "./card";

test("card", () => {
  const card = new Card("♠︎", "9", 9, "Wolverine");
  expect(card).toEqual({
    name: "Wolverine",
    rank: "9",
    suite: "♠︎",
    value: 9,
  });
});
