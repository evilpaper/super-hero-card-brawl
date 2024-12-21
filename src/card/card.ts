import { Suite, Rank, Value } from "./card.types";

export default class Card {
  private suite: Suite;
  private rank: Rank;
  private value: Value;
  private name: string;
  private played: boolean;

  constructor(suite: Suite, rank: Rank, value: Value, name: string) {
    this.suite = suite;
    this.rank = rank;
    this.value = value;
    this.name = name;
    this.played = false;
  }

  getSuite(): Suite {
    return this.suite;
  }

  getRank(): Rank {
    return this.rank;
  }

  getValue(): Value {
    return this.value;
  }

  getName(): string {
    return this.name;
  }

  getPlayed(): boolean {
    return this.played;
  }

  setPlayed() {
    this.played = true;
  }

  play() {
    this.setPlayed();
  }
}
