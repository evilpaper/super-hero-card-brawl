type Action = () => void;

interface Step {
  delay: number;
  action: Action;
}

/**
 * A scripted moment as a queue of timed steps, such as "deal, wait, deal".
 * Each step waits its delay after the previous step ran, then runs once.
 *
 * Time only moves through update(dt), so a script follows the loop's clock:
 * it pauses with a backgrounded tab instead of firing every step on return.
 */
export default class Script {
  private steps: Step[];
  private waited: number;

  constructor() {
    this.steps = [];
    this.waited = 0;
  }

  after(seconds: number, action: Action): void {
    this.steps.push({ delay: seconds, action });
  }

  update(dt: number): void {
    this.waited += dt;

    while (this.steps.length > 0 && this.waited >= this.steps[0].delay) {
      const step = this.steps.shift()!;
      this.waited -= step.delay;
      step.action();
    }

    /**
     * Idle time must not count toward steps queued later, or they would run
     * the moment they are added.
     */
    if (this.steps.length === 0) {
      this.waited = 0;
    }
  }
}
