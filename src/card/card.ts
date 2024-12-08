import { Suite, Rank, Value } from "./card.types";

export default class Card {
  suite: Suite;
  rank: Rank;
  value: Value;
  name: string;
  played: boolean;
  image: string;

  constructor(
    suite: Suite,
    rank: Rank,
    value: Value,
    name: string,
    image: string
  ) {
    this.suite = suite;
    this.rank = rank;
    this.value = value;
    this.name = name;
    this.played = false;
    this.image = image;
  }

  play() {
    this.played = true;
  }
}
