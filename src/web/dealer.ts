import Game from "../game/game";
import Card from "./card";
import Input from "./input";
import Scene from "./scene";
import Script from "./script";
import Slots from "./slots";

/**
 * Seconds between the last card being played and the Wave leaving. The flip
 * settles well inside it, and the rest is a beat to see the finished Wave.
 */
export const WAVE_PAUSE = 0.6;

/**
 * Seconds for the last card to drop out of sight once it is sent off.
 */
export const EXIT_TIME = 0.5;

/**
 * Brings Waves on and off the table. It holds the order of a Wave change and
 * leaves the details to others: Slots move the cards, Game applies the rules,
 * and the Scene shows whatever cards are current.
 *
 * Input is locked from the start of every change until the last new card is
 * on its way to its Slot.
 */
export default class Dealer {
  private game: Game;
  private scene: Scene;
  private slots: Slots;
  private script: Script;
  private input: Input;
  private cards: Card[];

  constructor(
    game: Game,
    scene: Scene,
    slots: Slots,
    script: Script,
    input: Input,
  ) {
    this.game = game;
    this.scene = scene;
    this.slots = slots;
    this.script = script;
    this.input = input;
    this.cards = [];
  }

  /**
   * @param unlockWhenDone - false under the cold-start title so a click
   *   dismisses it instead of playing a card.
   */
  dealOpeningWave(unlockWhenDone = true): void {
    this.input.lock();
    this.dealWave(unlockWhenDone);
  }

  /**
   * Called once every card in the Wave is played. The rules only deal the
   * next Wave after its cards are off screen, so the old Wave is never redrawn as
   * the new one.
   */
  nextWave(): void {
    this.input.lock();
    this.script.wait(WAVE_PAUSE);
    this.slots.sendOff(this.script);
    this.script.wait(EXIT_TIME);
    this.script.after(0, () => {
      this.cards.forEach((card) => this.scene.remove(card));
      this.game.completeWave();
      this.dealWave();
    });
  }

  private dealWave(unlockWhenDone = true): void {
    this.cards = this.game.wave.cards.map((card) => new Card(card));
    this.cards.forEach((card) => this.scene.add(card));
    this.slots.deal(this.cards, this.script);

    if (unlockWhenDone) {
      this.script.after(0, () => this.input.unlock());
    }
  }
}
