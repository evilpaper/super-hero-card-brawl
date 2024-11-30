import { test, expect, describe } from "vitest";
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

describe("Brawl mechanics", () => {
  test("if stamina is higher than opponent, reduce stamina to 1 below opponent", () => {
    const player = new Player();
    player.activateDefender(10);

    player.brawl(5);

    expect(player.stamina).toBe(4);
  });

  test("if stamina is lower than opponent, reset stamina and defence to 0 and reduce healt by opponent value", () => {});
});
