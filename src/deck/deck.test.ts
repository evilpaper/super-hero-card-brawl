import { expect, test } from "vitest";
import Deck from "./deck";

test("Deck should be created with 52 cards", () => {
    const deck = new Deck();
    expect(deck.cards.length).toBe(52);
});

