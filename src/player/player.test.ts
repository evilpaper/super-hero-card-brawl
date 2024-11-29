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
  test("should reset stamina and defense when opponent's value is higher than player stamina", () => {
    const player = new Player();
    player.stamina = 5;
    player.defence = 3;

    player.brawl(8); // opponent value higher than stamina

    expect(player.stamina).toBe(0);
    expect(player.defence).toBe(0);
  });

  test("should reduce health by the difference when opponent's value is lower than stamina", () => {
    const player = new Player();
    player.stamina = 8;
    player.health = 21;

    player.brawl(5); // opponent value lower than stamina

    expect(player.health).toBe(18); // 21 - (8-5) = 18
    expect(player.stamina).toBe(8); // stamina unchanged
  });

  test("should not reduce health below zero during brawl", () => {
    const player = new Player();
    player.health = 2;
    player.stamina = 8;

    player.brawl(5); // would normally deal 3 damage

    expect(player.health).toBe(0);
  });

  test("should handle equal values between opponent and player stamina", () => {
    const player = new Player();
    player.stamina = 5;
    player.health = 21;

    player.brawl(5); // equal values

    expect(player.health).toBe(21); // no damage when equal
    expect(player.stamina).toBe(5); // stamina unchanged
  });
});
