import { describe, expect, test } from "@jest/globals";
import Card from "./card";

describe("Card", () => {
  describe("when created", () => {
    test("has a suite", () => {
      const card = new Card("clover");
      expect(card.suite).toBeDefined();
    });
  });
});
