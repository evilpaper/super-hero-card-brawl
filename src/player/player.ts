export default class Player {
  health: number;
  defence: number;
  stamina: number;

  constructor() {
    this.health = 21;
    this.defence = 0;
    this.stamina = 0;
  }

  attack(monsterStrength: number): void {
    if (monsterStrength <= this.defence) {
      return; // No damage taken if monster is weaker than defense
    }
    const damage = monsterStrength - this.defence;
    this.health -= damage;
    this.defence = 0; // Reset defense after taking damage
  }

  addDefense(shieldValue: number): void {
    this.defence = shieldValue;
  }
}
