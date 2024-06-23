import { Suite, Rank, Value } from "./card.types";

export default class Card {
  suite: Suite;
  rank: Rank;
  value: Value;
  name: string;
  isFlipped: boolean;
  element?: HTMLDivElement;

  constructor(
    suite: Suite,
    rank: Rank,
    value: Value,
    name: string,
    element?: HTMLDivElement
  ) {
    this.suite = suite;
    this.rank = rank;
    this.value = value;
    this.name = name;
    this.element = element;
    this.isFlipped = false;
  }

  flip() {
    this.isFlipped = true;
  }
}
