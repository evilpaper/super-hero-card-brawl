import { expect, test } from "vitest";
import Game from "./game";
import Deck from "../deck/deck";
import Board from "../board/board";
import Card from "../card/card";

function makeCard(
  suite: "♠︎" | "♥︎" | "♣︎" | "♦︎",
  rank: "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "D",
  value: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 13 | 15 | 17 | 21
) {
  return new Card(suite, rank, value, `${rank} of ${suite}`);
}

test("Game should be initialized with a deck and a board", () => {
  const game = new Game();

  // Check if game has a deck
  expect(game.deck).toBeInstanceOf(Deck);
  expect(game.deck.getCardCount()).toBe(54);

  // Check if game has a board
  expect(game.board).toBeInstanceOf(Board);
  expect(game.board.cards.length).toBe(0);
});

test("Game should be able to be started. When so, board should be populated with 4 cards from the deck", () => {
  const game = new Game();
  const initialDeckSize = game.deck.getCardCount();

  // Start game
  game.start();

  // Check if board have 4 cards
  expect(game.board.cards.length).toBe(4);

  // Ceck if deck have 4 fewer cards
  expect(game.deck.getCardCount()).toBe(initialDeckSize - 4);
});

test("The first room can be escaped before any monster is handled", () => {
  const game = new Game();
  game.board.cards = [makeCard("♠︎", "7", 7), makeCard("♥︎", "4", 4)];

  game.refreshMoveOnAvailability();

  expect(game.player.getCanMoveOn()).toBe(true);
});

test("A room that was not escaped still allows escaping the next room even with monsters face up", () => {
  const game = new Game();
  game.clearHandledRoom();
  game.board.cards = [makeCard("♣︎", "D", 21), makeCard("♦︎", "5", 5)];

  game.refreshMoveOnAvailability();

  expect(game.player.getCanMoveOn()).toBe(true);
});

test("After escaping the previous room, leaving stays unavailable while any monster is still face up", () => {
  const game = new Game();
  game.escapeRoom();
  const firstMonster = makeCard("♠︎", "2", 2);
  const secondMonster = makeCard("♣︎", "3", 3);
  game.board.cards = [firstMonster, secondMonster, makeCard("♥︎", "4", 4)];

  game.refreshMoveOnAvailability();
  expect(game.player.getCanMoveOn()).toBe(false);

  game.playCard(firstMonster);

  expect(game.player.getCanMoveOn()).toBe(false);
});

test("After escaping the previous room, leaving opens once every monster is handled, even if potions or shields remain", () => {
  const game = new Game();
  game.escapeRoom();
  const jokerMonster = makeCard("♣︎", "D", 21);
  game.board.cards = [jokerMonster, makeCard("♥︎", "5", 5), makeCard("♦︎", "3", 3)];
  game.player.setDefence(21);
  game.player.setStamina(22);

  game.refreshMoveOnAvailability();
  expect(game.player.getCanMoveOn()).toBe(false);

  game.playCard(jokerMonster);

  expect(game.player.getCanMoveOn()).toBe(true);
});

test("A room with no monsters can be escaped even if the previous room was escaped", () => {
  const game = new Game();
  game.escapeRoom();
  game.board.cards = [makeCard("♥︎", "6", 6), makeCard("♦︎", "8", 8)];

  game.refreshMoveOnAvailability();

  expect(game.player.getCanMoveOn()).toBe(true);
});
