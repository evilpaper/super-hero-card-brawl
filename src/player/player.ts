/**
 * Represents a player in the game.
 */
export default class Player {
  _health: number;
  _defence: number;
  _stamina: number;
  _canMoveOn: boolean;
  _canHeal: boolean;

  /**
   * Creates a new player with default health, defence, and stamina.
   */
  constructor() {
    this._health = 21;
    this._defence = 0;
    this._stamina = 0;
    this._canMoveOn = true;
    this._canHeal = true;
  }

  /**
   * Gets the player's health.
   * @returns {number} The current health of the player.
   */
  get health(): number {
    return this._health;
  }

  /**
   * Sets the player's health.
   * @param {number} value - The new health value.
   */
  set health(value: number) {
    this._health = value;
  }

  get defence(): number {
    return this._defence;
  }

  set defence(value: number) {
    this._defence = value;
  }

  get stamina(): number {
    return this._stamina;
  }

  set stamina(value: number) {
    this._stamina = value;
  }

  get canMoveOn(): boolean {
    return this._canMoveOn;
  }

  set canMoveOn(value: boolean) {
    this._canMoveOn = value;
  }

  get canHeal(): boolean {
    return this._canHeal;
  }

  set canHeal(value: boolean) {
    this._canHeal = value;
  }

  /**
   * Plays a defensive brawler, increasing health.
   * @param {number} potionStrength - The strength of the defensive brawler.
   */
  playDefensiveBrawler(potionStrength: number): void {
    if (this.canHeal) {
      this._health = Math.min(this._health + potionStrength, 21);
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
    this._defence = defenderStrength;
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
