type Suite = "♠︎" | "♥︎" | "♣︎" | "♦︎;";

export default class Card {
  suite: Suite;
  rank: string;

  constructor(suite: Suite, rank: string) {
    this.suite = suite;
    this.rank = rank;
  }
}
