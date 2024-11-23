import { expect, test } from "vitest";
import Game from "./game";
import Deck from "../deck/deck";
import Board from "../board/board";

test("Game should be initialized with a deck and a board", () => {
    const deck = new Deck();
    const board = new Board(deck);
    const game = new Game(deck, board);
    
    // Check if game has a deck
    expect(game.deck).toBeInstanceOf(Deck);
    expect(game.deck.cards.length).toBe(52);
    
    // Check if game has a board
    expect(game.board).toBeInstanceOf(Board);
    expect(game.board.cards.length).toBe(0);
});

test("Game should be able to be started. When so, board should be populated with 4 cards from the deck", () => {
    // Setup
    const deck = new Deck();
    const board = new Board(deck);
    const game = new Game(deck, board);
    const initialDeckSize = game.deck.cards.length;
    
    // Act
    game.start();
    
    // Assert
    expect(game.board.cards.length).toBe(4);  // Board should have 4 cards
    expect(game.deck.cards.length).toBe(initialDeckSize - 4);  // Deck should have 4 fewer cards
});