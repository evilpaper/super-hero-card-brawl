import Card from "./card";
import { Suit, Rank, Value } from "./card.types";

export default class Deck {
  private cards: Array<Card>;

  constructor() {
    this.cards = [];
    const suits: Suit[] = ["♠︎", "♥︎", "♣︎", "♦︎"];
    const ranks: Rank[] = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];

    for (const suit of suits) {
      for (const rank of ranks) {
        /**
         * Determine value based on rank and suit
         */
        let value: Value;
        if (rank === "A") {
          value = suit === "♠︎" || suit === "♣︎" ? 17 : 11;
        } else if (rank === "J") {
          value = suit === "♠︎" || suit === "♣︎" ? 11 : 11;
        } else if (rank === "Q") {
          value = suit === "♠︎" || suit === "♣︎" ? 13 : 11;
        } else if (rank === "K") {
          value = suit === "♠︎" || suit === "♣︎" ? 15 : 11;
        } else {
          value = parseInt(rank) as Value;
        }

        this.cards.push(new Card(suit, rank, value, `${rank} of ${suit}`));
      }
    }

    /**
     * Add the two Jokers
     */
    this.cards.push(new Card("♣︎", "Joker", 21, "Joker A"));
    this.cards.push(new Card("♠︎", "Joker", 21, "Joker B"));
  }

  getCards(): Array<Card> {
    /**
     * Return a copy to maintain encapsulation
     */
    return [...this.cards];
  }

  getCardCount(): number {
    return this.cards.length;
  }

  shuffle(): void {
    /**
     * Fisher-Yates shuffle algorithm
     */
    for (let i = this.cards.length - 1; i > 0; i--) {
      /**
       * Generate random index from 0 to i
       */
      const j = Math.floor(Math.random() * (i + 1));
      /**
       * Swap elements at indices i and j
       */
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard(count: number): Array<Card> {
    /**
     * Handle invalid inputs
     */
    if (count <= 0 || count > 4) {
      return [];
    }

    /**
     * Check if we have enough cards
     */
    if (count > this.cards.length) {
      return [];
    }

    /**
     * Remove and return the specified number of cards from the top
     */
    return this.cards.splice(0, count);
  }

  returnCard(cards: Array<Card>): void {
    /**
     * Validate input
     */
    if (!Array.isArray(cards)) {
      return;
    }

    /**
     * Validate card count
     */
    if (cards.length > 4) {
      return;
    }

    /**
     * Add cards back to deck
     */
    this.cards.push(...cards);
  }
}
