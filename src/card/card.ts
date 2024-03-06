type Suite = "♠︎" | "♥︎" | "♣︎" | "♦︎";
// prettier-ignore
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"| "J" | "Q" | "K" | "X";

export default class Card {
  suite: Suite;
  rank: Rank;
  element: HTMLDivElement;

  constructor(suite: Suite, rank: Rank) {
    this.suite = suite;
    this.rank = rank;
    this.element = document.createElement("div");
  }
}
