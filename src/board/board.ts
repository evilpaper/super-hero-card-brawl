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

  clear(): void {
    // Find cards that haven't been played
    const unplayedCards = this.cards.filter((card) => !card.played);

    // Add unplayed cards back to the end of the deck
    this.deck.cards.push(...unplayedCards);

    // Clear the board
    this.cards = [];

    // Draw the minimum between 4 and available cards in deck
    const cardsToDraw = Math.min(4, this.deck.cards.length);
    this.draw(cardsToDraw);
  }

  isCleared() {
    return this.cards.every((card) => card.played);
  }
}
