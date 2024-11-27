import { describe, it, expect } from "vitest";
import Player from "./player";

describe("Player", () => {
  it("should initialize with correct default values", () => {
    const player = new Player();

    expect(player.health).toBe(21);
    expect(player.defence).toBe(0);
    expect(player.stamina).toBe(0);
  });

  describe("attack", () => {
    it("should take damage when attacking stronger monster", () => {
      const player = new Player();
      const opponentStrength = 10;

      player.attack(opponentStrength);

      expect(player._health).toBe(11); // 21 - 10 = 11
    });

    it("should not take damage when attacking weaker monster", () => {
      const player = new Player();
      const opponentStrength = 5;
      const brawlerValue = 6;

      player.defence = brawlerValue;

      player.attack(opponentStrength);

      expect(player._health).toBe(21); // Health remains unchanged
    });
  });

  describe("defence", () => {
    it("should add shield value to defence", () => {
      const player = new Player();
      const brawlerValue = 5;

      player.defence = brawlerValue;

      expect(player.defence).toBe(5);
    });

    it("should reduce incoming damage by defence value", () => {
      const player = new Player();
      const brawlerValue = 5;
      const opponentStrength = 10;

      player.defence = brawlerValue;
      player.attack(opponentStrength);

      expect(player.health).toBe(16); // 21 - (10 - 5) = 16
    });

    it("should reset defence after taking damage", () => {
      const player = new Player();
      const brawlerValue = 5;
      const opponentStrength = 10;

      player.defence = brawlerValue;
      player.attack(opponentStrength);

      expect(player.defence).toBe(0);
    });
  });
});