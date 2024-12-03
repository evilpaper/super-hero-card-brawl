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
  player.playDefensiveBrawler(5);

  // Check that health does not exceed 21
  expect(player.health).toBe(21);

  // Test drinking a potion when health is already at maximum
  player.playDefensiveBrawler(3);
  expect(player.health).toBe(21);
});

test("Select a defender (♦︎) set defence according to the card value", () => {
  const player = new Player();

  player.playOffensiveBrawler(9);

  expect(player.defence).toBe(9);
});

test("Select a defender (♦︎) set stamina to 21", () => {
  const player = new Player();

  player.playOffensiveBrawler(9);

  expect(player.stamina).toBe(21);
});

describe("Brawl mechanics", () => {
  test("if opponents value is lower than stamina, reduce stamina same value as opponent", () => {
    const player = new Player();

    player.playOffensiveBrawler(10);
    player.brawl(5);

    expect(player.stamina).toBe(5);
  });

  test("if opponents value is higher than or equal to stamina, reset stamina and defence to 0 and reduce health by opponent value", () => {
    const player = new Player();

    player.playOffensiveBrawler(5); // Sets stamina to 21
    player.brawl(5); // Sets stamina to 5
    player.brawl(10);

    expect(player.stamina).toBe(0);
    expect(player.defence).toBe(0);
    expect(player.health).toBe(11);

    player.playOffensiveBrawler(4); // Sets stamina to 21
    player.brawl(4); // Sets stamina to 4
    player.brawl(4);

    expect(player.stamina).toBe(0);
    expect(player.defence).toBe(0);
    expect(player.health).toBe(7);
  });

  test("if opponents value is lower than stamina but higher that defence, deal damage equal to difference between defence and opponent", () => {
    const player = new Player();

    player.playOffensiveBrawler(5);
    player.brawl(6);

    expect(player.health).toBe(20);
  });
});
