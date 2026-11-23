import { Suit, Rank, Value } from "./card.types";

export default class Card {
  private suit: Suit;
  private rank: Rank;
  private value: Value;
  private name: string;
  private played: boolean;
  private readonly id: string;

  constructor(suit: Suit, rank: Rank, value: Value, name: string) {
    this.suit = suit;
    this.rank = rank;
    this.value = value;
    this.name = name;
    this.played = false;
    this.id = crypto.randomUUID();
  }

  getId(): string {
    return this.id;
  }

  getSuit(): Suit {
    return this.suit;
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
