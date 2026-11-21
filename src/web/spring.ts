/**
 * Springs are integrated in steps no longer than this, so stiff springs stay stable
 * even when a frame is long.
 */
const MAX_STEP = 1 / 120;

/**
 * A damped spring that chases a target value.
 * Set the target and the value follows with velocity, overshooting a little when
 * damping is low. Kick it to add a burst of velocity (shakes, punches).
 */
export default class Spring {
  private value: number;
  private target: number;
  private velocity: number;
  private stiffness: number;
  private damping: number;

  constructor(value: number, stiffness = 170, damping = 20) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  getValue(): number {
    return this.value;
  }

  getTarget(): number {
    return this.target;
  }

  setTarget(target: number): void {
    this.target = target;
  }

  /** Jumps straight to a value and stops there. */
  snap(value: number): void {
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  kick(velocity: number): void {
    this.velocity += velocity;
  }

  update(dt: number): void {
    let remaining = dt;

    while (remaining > 0) {
      const step = Math.min(remaining, MAX_STEP);
      const force =
        -this.stiffness * (this.value - this.target) -
        this.damping * this.velocity;

      /**
       * Semi-implicit Euler: velocity first, then position with the new velocity.
       */
      this.velocity += force * step;
      this.value += this.velocity * step;
      remaining -= step;
    }
  }
}
