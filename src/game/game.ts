import Deck from "../deck/deck";
import Board from "../board/board"

export default class Game {
    deck: Deck;
    board: Board;

    constructor(deck: Deck, board: Board) {
        this.deck = deck;
        this.board = board;
    }

    start() {
        this.board.draw(4)
    }
}