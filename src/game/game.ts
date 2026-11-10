import Deck from "../deck/deck";
import Board from "../board/board";
import Player from "../player/player";
import Card from "../card/card";

export default class Game {
  deck: Deck;
  board: Board;
  player: Player;
  private escapedPreviousRoom: boolean;

  constructor() {
    this.deck = new Deck();
    this.board = new Board(this.deck);
    this.player = new Player();
    this.escapedPreviousRoom = false;
    this.refreshMoveOnAvailability();
  }

  start() {
    this.deck.shuffle();
    this.board.draw(4);
    this.refreshMoveOnAvailability();
  }

  restart() {
    this.deck = new Deck();
    this.board = new Board(this.deck);
    this.player = new Player();
    this.escapedPreviousRoom = false;
    this.start();
  }

  playCard(card: Card) {
    card.play();
    this.handleCardEffect(card);
    this.refreshMoveOnAvailability();
  }

  escapeRoom() {
    if (!this.player.getCanMoveOn()) {
      return;
    }

    this.escapedPreviousRoom = true;
    this.board.clear();
    this.refreshMoveOnAvailability();
  }

  clearHandledRoom() {
    this.escapedPreviousRoom = false;
    this.board.clear();
    this.refreshMoveOnAvailability();
  }

  refreshMoveOnAvailability() {
    this.player.setCanMoveOn(this.canMoveOnCurrentRoom());
  }

  private canMoveOnCurrentRoom() {
    if (!this.escapedPreviousRoom) {
      return true;
    }

    const hasUnplayedMonster = this.board.cards.some((boardCard) => {
      if (boardCard.getPlayed()) {
        return false;
      }

      const suite = boardCard.getSuite();
      return suite === "♠︎" || suite === "♣︎";
    });

    return !hasUnplayedMonster;
  }

  handleCardEffect(card: Card) {
    if (this.player.getHealth() <= 0) {
      return;
    }

    switch (card.getSuite()) {
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
