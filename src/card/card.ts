type Suite = "♠︎" | "♥︎" | "♣︎" | "♦︎;";

export default class Card {
  suite: Suite;
  rank: string;
  element: HTMLDivElement;

  constructor(suite: Suite, rank: string) {
    this.suite = suite;
    this.rank = rank;
    this.element = document.createElement("div");
  }
}
