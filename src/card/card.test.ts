import { expect, test } from "vitest";

import Card from "./card";

/**
 * What properties should a card have?
 * 1. suite
 * 2. rank
 * 3. value
 * 4. name
 * 5. element
 *
 * What should we be able to do with a card?
 * 1. CreateHTMLElement (to DOM)
 * 2. Flip it
 */

const card = new Card("♠︎", "9", 9, "Wolverine");

test("Card get initialised with correct properties", () => {
  expect(card).toEqual({
    name: "Wolverine",
    rank: "9",
    suite: "♠︎",
    value: 9,
    played: false,
  });
});

test("Card can get flipped", () => {
  card.flip();
  expect(card.played).toEqual(true);
});
