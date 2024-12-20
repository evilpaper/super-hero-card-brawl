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
   * Sets the player's health with validation.
   * @param {number} value - The new health value.
   */
  setHealth(value: number): void {
    if (value < 0) {
      this.health = 0; // Ensure health doesn't go below 0.
    } else if (value > 21) {
      this.health = 21; // Cap health at 21.
    } else {
      this.health = value;
    }
  }

  /**
   * Gets the player's defence.
   * @returns {number} The current defence of the player.
   */
  getDefence(): number {
    return this.defence;
  }

  /**
   * Sets the player's defence.
   * @param {number} value - The new defence value.
   */
  setDefence(value: number): void {
    this.defence = value;
  }

  /**
   * Gets the player's stamina.
   * @returns {number} The current stamina of the player.
   */
  getStamina(): number {
    return this.stamina;
  }

  /**
   * Sets the player's stamina.
   * @param {number} value - The new stamina value.
   */
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
      this.setHealth(this.getHealth() + potionStrength);
      this.setCanHeal(false);
    } else {
      this.setCanHeal(true);
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
    this.setDefence(defenderStrength);
    this.setStamina(22);

    // If canHeal is false, reset it to true
    if (!this.getCanHeal()) {
      this.setCanHeal(true);
    }
  }

  brawl(opponentValue: number): void {
    if (opponentValue >= this.getStamina()) {
      this.setStamina(0);
      this.setDefence(0);
      this.setHealth(this.getHealth() - opponentValue);
    } else {
      const damage = Math.max(0, opponentValue - this.getDefence());

      this.setHealth(this.getHealth() - damage);
      this.setStamina(opponentValue);
    }
    // If canHeal is false, reset it to true
    if (!this.getCanHeal()) {
      this.setCanHeal(true);
    }
  }
}
