import { Suite, Rank, Value } from "./card.types";

/**
 * What properties should a card have?
 * 1. suite
 * 2. rank
 * 3. value
 * 4. name
 * 5. element
 *
 * What should I be able to do with a card?
 * 1. createHTMLElement (to DOM)
 */

export default class Card {
  suite: Suite;
  rank: Rank;
  value: Value;
  name: string;
  element: HTMLDivElement | null;

  constructor(suite: Suite, rank: Rank, value: Value, name: string) {
    this.suite = suite;
    this.rank = rank;
    this.value = value;
    this.name = name;
    this.element = null;
  }

  // createHTMLElement = function () {};
}
