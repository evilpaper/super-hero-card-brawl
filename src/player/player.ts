/**
 * Represents a player in the game.
 */
export default class Player {
  private health: number;
  private defence: number;
  private stamina: number;
  private canMoveOn: boolean;
  private canHeal: boolean;

  /**
   * Creates a new player with default health, defence, and stamina.
   */
  constructor() {
    this.health = 21;
    this.defence = 0;
    this.stamina = 0;
    this.canMoveOn = true;
    this.canHeal = true;
  }

  /**
   * Gets the player's health.
   * @returns {number} The current health of the player.
   */
  getHealth(): number {
    return this.health;
  }

  /**
   * Sets the player's health.
   * @param {number} value - The new health value.
   */
  setHealth(value: number): void {
    this.health = value;
  }

  getDefence(): number {
    return this.defence;
  }

  setDefence(value: number): void {
    this.defence = value;
  }

  getStamina(): number {
    return this.stamina;
  }

  setStamina(value: number): void {
    this.stamina = value;
  }

  getCanMoveOn(): boolean {
    return this.canMoveOn;
  }

  setCanMoveOn(value: boolean): void {
    this.canMoveOn = value;
  }

  getCanHeal(): boolean {
    return this.canHeal;
  }

  setCanHeal(value: boolean): void {
    this.canHeal = value;
  }

  /**
   * Plays a defensive brawler, increasing health.
   * @param {number} potionStrength - The strength of the defensive brawler.
   */
  playDefensiveBrawler(potionStrength: number): void {
    if (this.canHeal) {
      this.health = Math.min(this.health + potionStrength, 21);
      this.canHeal = false;
    } else {
      this.canHeal = true;
    }
  }

  /**
   * Plays an offensive brawler, increasing defence and stamina.
   * This method sets the player's defence to the given strength and resets stamina to a fixed value.
   * If the player was unable to heal, it resets the healing ability.
   *
   * @param {number} defenderStrength - The strength of the offensive brawler, which sets the player's defence.
   * @returns {void} This method does not return a value.
   */
  playOffensiveBrawler(defenderStrength: number): void {
    this.defence = defenderStrength;
    this.stamina = 22;

    // If canHeal is false, reset it to true
    if (!this.canHeal) {
      this.canHeal = true;
    }
  }

  brawl(opponentValue: number): void {
    if (opponentValue >= this.stamina) {
      this.stamina = 0;
      this.defence = 0;
      this.health = Math.max(0, this.health - opponentValue);
    } else {
      const damage = Math.max(0, opponentValue - this.defence);

      this.health = Math.max(0, this.health - damage);
      this.stamina = opponentValue;
    }
    // If canHeal is false, reset it to true
    if (!this.canHeal) {
      this.canHeal = true;
    }
  }
}
