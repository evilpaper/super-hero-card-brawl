import { expect, test } from "vitest";
import Card from "./card";

test("card", () => {
  const card = new Card("♣︎", "0");
  expect(card.suite).toBe("♣︎");
  expect(card.rank).toBe("0");

  // test.todo("has rank");
  // test.todo("has value");
  // test.todo("has value");
  // test.todo("has name");
  // test.todo("has an html element");
});
