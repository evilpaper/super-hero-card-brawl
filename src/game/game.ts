import Deck from "../deck/deck";
import Board from "../board/board";
import Player from "../player/player";
import Card from "../card/card";

export default class Game {
  deck: Deck;
  board: Board;
  player: Player;

  constructor() {
    this.deck = new Deck();
    this.board = new Board(this.deck);
    this.player = new Player();
  }

  start() {
    this.deck.shuffle();
    this.board.draw(4);
  }

  restart() {
    this.deck = new Deck();
    this.board = new Board(this.deck);
    this.player = new Player();
    this.start();
  }

  playCard(card: Card) {
    card.play();
    this.handleCardEffect(card);
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
