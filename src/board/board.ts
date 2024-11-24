import Card from "../card/card";
import Deck from "../deck/deck";

export default class Board {
  cards: Array<Card>;
  deck: Deck;

  constructor(deck: Deck) {
    this.cards = [];
    this.deck = deck;
  }

  draw(count: number): void {
    // Don't draw if it would exceed 4 cards
    if (this.cards.length + count > 4) {
      return;
    }

    const drawnCards = this.deck.draw_card(count);
    this.cards.push(...drawnCards);
  }

  clear() {
    this.cards = [];
  }

  isCleared() {
    return this.cards.every((card) => card.played);
  }
}
