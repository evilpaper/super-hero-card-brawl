import { expect, test } from "vitest";
import Card from "./card";

test("card", () => {
  const card = new Card("clover");
  expect(card.suite).toBeDefined();
});
