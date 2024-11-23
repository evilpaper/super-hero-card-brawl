import { expect, test } from "vitest";
import Board from "./board";
import Deck from "../deck/deck";

test("Board should start empty", () => {
    const deck = new Deck();
    const board = new Board(deck);
    expect(board.cards).toHaveLength(0);
});

test("Board should be able to draw up to 4 cards", () => {
    const deck = new Deck();
    const board = new Board(deck);
    
    board.draw(3);
    expect(board.cards).toHaveLength(3);
    
    board.draw(1);
    expect(board.cards).toHaveLength(4);
});

