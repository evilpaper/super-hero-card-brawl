import Deck from "./deck";
import Wave from "./wave";
import Player from "./player";
import Card from "./card";

/**
 * Opponents are black cards: Spades, Clubs, and both Jokers.
 */
function isOpponent(card: Card): boolean {
  const suit = card.getSuit();
  return suit === "♠︎" || suit === "♣︎";
}

export default class Game {
  deck: Deck;
  wave: Wave;
  player: Player;
  private slippedPastPreviousWave: boolean;

  constructor() {
    this.deck = new Deck();
    this.wave = new Wave(this.deck);
    this.player = new Player();
    this.slippedPastPreviousWave = false;
    this.refreshSlipPastAvailability();
  }

  start() {
    this.deck.shuffle();
    this.wave.draw(4);
    this.refreshSlipPastAvailability();
  }

  restart() {
    this.deck = new Deck();
    this.wave = new Wave(this.deck);
    this.player = new Player();
    this.slippedPastPreviousWave = false;
    this.start();
  }

  playCard(card: Card) {
    if (card.getPlayed()) {
      return;
    }

    card.play();
    this.handleCardEffect(card);
    this.refreshSlipPastAvailability();
  }

  slipPast() {
    if (!this.player.getCanSlipPast()) {
      return;
    }

    this.slippedPastPreviousWave = true;
    this.wave.dealNext();
    this.refreshSlipPastAvailability();
  }

  completeWave() {
    this.slippedPastPreviousWave = false;
    this.wave.dealNext();
    this.refreshSlipPastAvailability();
  }

  refreshSlipPastAvailability() {
    this.player.setCanSlipPast(this.canSlipPastCurrentWave());
  }

  /**
   * Health at zero ends the Brawl as a knockout. The view decides when to
   * show that Screen; the rules only report the fact.
   */
  isKnockedOut(): boolean {
    return this.player.getHealth() <= 0;
  }

  /**
   * Victory is the moment no unplayed Opponent remains in the Wave or the
   * Deck, whatever red cards are left. Knocked out wins over this query.
   */
  hasVictory(): boolean {
    if (this.isKnockedOut()) {
      return false;
    }

    const unplayedInWave = this.wave.cards.some(
      (card) => isOpponent(card) && !card.getPlayed(),
    );
    const leftInDeck = this.deck.getCards().some((card) => isOpponent(card));

    return !unplayedInWave && !leftInDeck;
  }

  private canSlipPastCurrentWave() {
    if (!this.slippedPastPreviousWave) {
      return true;
    }

    const hasUnplayedOpponent = this.wave.cards.some((waveCard) => {
      if (waveCard.getPlayed()) {
        return false;
      }

      return isOpponent(waveCard);
    });

    return !hasUnplayedOpponent;
  }

  handleCardEffect(card: Card) {
    if (this.player.getHealth() <= 0) {
      return;
    }

    switch (card.getSuit()) {
      case "♥︎":
        this.player.playDefensiveBrawler(card.getValue());
        break;
      case "♦︎":
        this.player.playOffensiveBrawler(card.getValue());
        break;
      case "♠︎":
        this.player.brawl(card.getValue());
        break;
      case "♣︎":
        this.player.brawl(card.getValue());
        break;
    }
  }
}
