import Deck from "./deck";
import Wave from "./wave";
import Player from "./player";
import Card from "./card";

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

  private canSlipPastCurrentWave() {
    if (!this.slippedPastPreviousWave) {
      return true;
    }

    const hasUnplayedOpponent = this.wave.cards.some((waveCard) => {
      if (waveCard.getPlayed()) {
        return false;
      }

      const suit = waveCard.getSuit();
      return suit === "♠︎" || suit === "♣︎";
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
