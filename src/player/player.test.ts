import { test, expect } from "vitest";
import Player from "./player";

test("Player should initialize with health, defence and stamina with default values", () => {
  const player = new Player();

  expect(player.health).toBe(21);
  expect(player.defence).toBe(0);
  expect(player.stamina).toBe(0);
});

test("Select a healer (♥︎) adds health points up to a maximum of 21 health points", () => {
  const player = new Player();

  // Set initial health to a value less than 21
  player.health = 18;

  // Simulate drinking a potion with a value of 5
  player.activateHealer(5);

  // Check that health does not exceed 21
  expect(player.health).toBe(21);

  // Test drinking a potion when health is already at maximum
  player.activateHealer(3);
  expect(player.health).toBe(21);
});

test("Select a defender (♦︎) set defence according to the card value", () => {
  const player = new Player();

  player.activateDefender(9);

  expect(player.defence).toBe(9);
});

test("Select a defender (♦︎) set stamina to 21", () => {
  const player = new Player();

  player.activateDefender(9);

  expect(player.stamina).toBe(21);
});

("Select a character in the opposite team (♠︎) and (♣︎) trigger a brawl.");
("First compare the opponents value to the player stamina");
("If the opponents value is higher reset stamina to 0 and defence to 0");
("If the opponents value is equal or less deduct the damage as the difference between the opponents value and the players health. Minumum is zero");
("Reduce players health with the value equal to the damage");
