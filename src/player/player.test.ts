import { test, expect, describe } from "vitest";
import Player from "./player";

test("Player should initialize with health, defence and stamina with default values", () => {
  const player = new Player();

  expect(player.getHealth()).toBe(21);
  expect(player.getDefence()).toBe(0);
  expect(player.getStamina()).toBe(0);
});

test("Select a healer (♥︎) adds health points up to a maximum of 21 health points", () => {
  const player = new Player();

  // Set initial health to a value less than 21
  player.setHealth(18);

  // Play defensive brawler
  player.playDefensiveBrawler(5);

  // Check that health does not exceed 21. 18 + 5 equal 23 but we should cap at 21
  expect(player.getHealth()).toBe(21);

  // Test drinking a potion when health is already at maximum
  player.playDefensiveBrawler(3);

  // Check that health still remain at highest value and not higher
  expect(player.getHealth()).toBe(21);
});

test("Select another healer (♥︎) right after a healer (♥︎) will have no effect", () => {
  const player = new Player();

  // Set initial health to a value less than 21
  player.setHealth(10);

  // Simulate drinking a potion with a value of 5
  player.playDefensiveBrawler(5);

  // Simulate drinking another potion right after the first one, this time with a value of 4
  player.playDefensiveBrawler(4);

  // Check that the second potion didn't have any effect
  expect(player.getHealth()).toBe(15);
});

test("Select a defender (♦︎) set defence according to the card value", () => {
  const player = new Player();

  player.playOffensiveBrawler(9);

  expect(player.getDefence()).toBe(9);
});

test("Select a defender (♦︎) set stamina to 22", () => {
  const player = new Player();

  player.playOffensiveBrawler(9);

  expect(player.getStamina()).toBe(22);
});

describe("Brawl mechanics", () => {
  test("if opponent's value is lower than stamina, reduce stamina same value as opponent", () => {
    const player = new Player();

    player.playOffensiveBrawler(10);
    player.brawl(5);

    expect(player.getStamina()).toBe(5);
  });

  test("if opponent's value is higher than or equal to stamina, reset stamina and defence to 0 and reduce health by opponent value", () => {
    const player = new Player();

    player.playOffensiveBrawler(5); // Sets stamina to 22
    player.brawl(5); // Sets stamina to 5
    player.brawl(10);

    expect(player.getStamina()).toBe(0);
    expect(player.getDefence()).toBe(0);
    expect(player.getHealth()).toBe(11);

    player.playOffensiveBrawler(4); // Sets stamina to 22
    player.brawl(4); // Sets stamina to 4
    player.brawl(4);

    expect(player.getStamina()).toBe(0);
    expect(player.getDefence()).toBe(0);
    expect(player.getHealth()).toBe(7);
  });

  test("if opponent's value is lower than stamina but higher than defence, deal damage equal to difference between defence and opponent", () => {
    const player = new Player();

    player.playOffensiveBrawler(5);
    player.brawl(6);

    expect(player.getHealth()).toBe(20);
  });
});
