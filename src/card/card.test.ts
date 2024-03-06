import { expect, test } from "vitest";
import Card from "./card";

test("card", () => {
  const card = new Card("♣︎", "2");
  expect(card.suite).toBe("♣︎");
  expect(card.rank).toBe("0");
});
