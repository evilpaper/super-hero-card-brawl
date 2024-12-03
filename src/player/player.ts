export default class Player {
  _health: number;
  _defence: number;
  _stamina: number;

  constructor() {
    this._health = 21;
    this._defence = 0;
    this._stamina = 0;
  }

  get health(): number {
    return this._health;
  }

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

  playDefensiveBrawler(potionStrength: number): void {
    this._health = Math.min(this._health + potionStrength, 21);
  }

  playOffensiveBrawler(defenderStrength: number): void {
    this._defence = defenderStrength;
    this.stamina = 21;
  }

  brawl(opponentValue: number): void {
    if (opponentValue > this.stamina) {
      this.stamina = 0;
      this.defence = 0;
      this.health = Math.max(0, this.health - opponentValue);
    } else {
      const damage = Math.max(0, opponentValue - this.defence);

      this.health = Math.max(0, this.health - damage);
      this.stamina = opponentValue;
    }
  }
}
