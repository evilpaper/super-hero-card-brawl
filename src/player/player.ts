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

  attack(opponentStrength: number): void {
    if (opponentStrength <= this._defence) {
      return; // No damage taken if monster is weaker than defence
    }
    const damage = opponentStrength - this._defence;
    this._health -= damage;
    this._defence = 0; // Reset defence after taking damage
  }

  activateHealer(potionStrength: number): void {
    this._health = Math.min(this._health + potionStrength, 21);
  }

  activateDefender(defenderStrength: number): void {
    this._defence = defenderStrength;
  }
}
