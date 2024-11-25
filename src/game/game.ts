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

  playCard(card: Card) {
    card.play();
  }

  handleCardEffect(card: Card) {
    switch (card.suite) {
      case "♥︎":
        // this.player.heal(card.numericValue);
        break;
      case "♦︎":
        // this.player.setShield(card.numericValue);
        break;
      case "♠︎":
      case "♣︎":
        // this.handleMonsterCard(card);
        break;
    }
  }
}
