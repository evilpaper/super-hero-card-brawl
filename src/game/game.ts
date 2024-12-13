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

    switch (card.suite) {
      case "♥︎":
        this.player.playDefensiveBrawler(card.value);
        break;
      case "♦︎":
        this.player.playOffensiveBrawler(card.value);
        break;
      case "♠︎":
        this.player.brawl(card.value);
        break;
      case "♣︎":
        this.player.brawl(card.value);
        break;
    }
  }
}
