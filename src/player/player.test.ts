import { test, expect } from "vitest";
import Player from "./player";

test("Player should initialize with health, defence and stamina with default values", () => {
  const player = new Player();

  expect(player.health).toBe(21);
  expect(player.defence).toBe(0);
  expect(player.stamina).toBe(0);
});

test("Drink potion (♥︎) adds health points up to a maximum of 21 health points", () => {
  const player = new Player();

  // Set initial health to a value less than 21
  player.health = 18;

  // Simulate drinking a potion with a value of 5
  player.drinkPotion(5);

  // Check that health does not exceed 21
  expect(player.health).toBe(21);

  // Test drinking a potion when health is already at maximum
  player.drinkPotion(3);
  expect(player.health).toBe(21);
});

test("Select a defence character (♦︎) set defence points according to the cards value", () => {
  const player = new Player();

  player.activateDefender(9);

  expect(player.defence).toBe(9);
});
