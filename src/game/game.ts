import Deck from "../deck/deck";
import Board from "../board/board"

export default class Game {
    deck: Deck;
    board: Board;

    constructor() {
        this.deck = new Deck();
        this.board = new Board(this.deck);
    }

    start() {
        this.deck.shuffle();
        this.board.draw(4)
    }
}