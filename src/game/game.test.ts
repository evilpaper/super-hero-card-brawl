import { expect, test } from "vitest";
import Game from "./game";
import Deck from "./deck";
import Wave from "./wave";
import Card from "./card";

function makeCard(
  suit: "♠︎" | "♥︎" | "♣︎" | "♦︎",
  rank: "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "Joker",
  value: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 13 | 15 | 17 | 21
) {
  return new Card(suit, rank, value, `${rank} of ${suit}`);
}

test("Game should be initialized with a deck and a wave", () => {
  const game = new Game();

  /**
   * Check if game has a deck
   */
  expect(game.deck).toBeInstanceOf(Deck);
  expect(game.deck.getCardCount()).toBe(54);

  /**
   * Check if game has a wave
   */
  expect(game.wave).toBeInstanceOf(Wave);
  expect(game.wave.cards.length).toBe(0);
});

test("Game should be able to be started. When so, wave should be populated with 4 cards from the deck", () => {
  const game = new Game();
  const initialDeckSize = game.deck.getCardCount();

  /**
   * Start game
   */
  game.start();

  /**
   * Check if wave have 4 cards
   */
  expect(game.wave.cards.length).toBe(4);

  /**
   * Ceck if deck have 4 fewer cards
   */
  expect(game.deck.getCardCount()).toBe(initialDeckSize - 4);
});

test("The first wave can be slipped past before any opponent is played", () => {
  const game = new Game();
  game.wave.cards = [makeCard("♠︎", "7", 7), makeCard("♥︎", "4", 4)];

  game.refreshSlipPastAvailability();

  expect(game.player.getCanSlipPast()).toBe(true);
});

test("A wave that was not slipped past still allows slipping past the next wave even with opponents face up", () => {
  const game = new Game();
  game.completeWave();
  game.wave.cards = [makeCard("♣︎", "Joker", 21), makeCard("♦︎", "5", 5)];

  game.refreshSlipPastAvailability();

  expect(game.player.getCanSlipPast()).toBe(true);
});

test("After slipping past the previous wave, slipping past stays unavailable while any opponent is still face up", () => {
  const game = new Game();
  game.slipPast();
  const firstOpponent = makeCard("♠︎", "2", 2);
  const secondOpponent = makeCard("♣︎", "3", 3);
  game.wave.cards = [firstOpponent, secondOpponent, makeCard("♥︎", "4", 4)];

  game.refreshSlipPastAvailability();
  expect(game.player.getCanSlipPast()).toBe(false);

  game.playCard(firstOpponent);

  expect(game.player.getCanSlipPast()).toBe(false);
});

test("After slipping past the previous wave, slipping past opens once every opponent is played, even if potions or shields remain", () => {
  const game = new Game();
  game.slipPast();
  const jokerOpponent = makeCard("♣︎", "Joker", 21);
  game.wave.cards = [jokerOpponent, makeCard("♥︎", "5", 5), makeCard("♦︎", "3", 3)];
  game.player.setDefence(21);
  game.player.setStamina(22);

  game.refreshSlipPastAvailability();
  expect(game.player.getCanSlipPast()).toBe(false);

  game.playCard(jokerOpponent);

  expect(game.player.getCanSlipPast()).toBe(true);
});

test("A card that is already played has no effect when played again", () => {
  const game = new Game();
  const opponent = makeCard("♠︎", "5", 5);
  game.wave.cards = [opponent];

  game.playCard(opponent);
  const healthAfterFirstPlay = game.player.getHealth();
  game.playCard(opponent);

  expect(healthAfterFirstPlay).toBeLessThan(21);
  expect(game.player.getHealth()).toBe(healthAfterFirstPlay);
});

test("A wave with no opponents can be slipped past even if the previous wave was slipped past", () => {
  const game = new Game();
  game.slipPast();
  game.wave.cards = [makeCard("♥︎", "6", 6), makeCard("♦︎", "8", 8)];

  game.refreshSlipPastAvailability();

  expect(game.player.getCanSlipPast()).toBe(true);
});
