import { expect, test } from "vitest";
import Game from "../game/game";
import Card, { CARD_HEIGHT } from "./card";
import Dealer, { EXIT_TIME, WAVE_PAUSE } from "./dealer";
import Input from "./input";
import Scene from "./scene";
import Script from "./script";
import Slots, { DEAL_INTERVAL, arrange } from "./slots";

const WIDTH = 1400;
const HEIGHT = 800;

function setup() {
  const game = new Game();
  game.start();
  const scene = new Scene();
  const slots = new Slots();
  const script = new Script();
  const taps: Card[] = [];
  const input = new Input(scene, (object) => taps.push(object as Card));
  const dealer = new Dealer(game, scene, slots, script, input);
  slots.layout(WIDTH, HEIGHT);
  return { game, scene, script, input, dealer, taps };
}

/**
 * Advances the script and the cards together, the way the loop does.
 */
function run(script: Script, scene: Scene, seconds: number) {
  const frames = Math.ceil(seconds * 60);
  for (let frame = 0; frame < frames; frame++) {
    script.update(1 / 60);
    scene.update(1 / 60);
  }
}

/**
 * The game card shown in each Slot, or null for an empty Slot.
 */
function cardsInSlots(scene: Scene) {
  return arrange(WIDTH, HEIGHT).centers.map((center) => {
    const object = scene.objectAt(center.x, center.y);
    return object instanceof Card ? object.getCard() : null;
  });
}

function tap(input: Input, x: number, y: number) {
  input.press(x, y);
  input.release(x, y);
}

function tapSlot(input: Input, slot: number) {
  const { x, y } = arrange(WIDTH, HEIGHT).centers[slot];
  tap(input, x, y);
}

test("The opening Wave should be dealt into the Slots with input locked until it is", () => {
  const { game, scene, script, input, dealer, taps } = setup();

  dealer.dealOpeningWave();

  /**
   * Before the first step runs, every card waits below the centre of the
   * window, so a tap there would land on a card if input were not locked.
   */
  tap(input, WIDTH / 2, HEIGHT + CARD_HEIGHT);
  expect(taps).toEqual([]);

  run(script, scene, 1);

  expect(cardsInSlots(scene)).toEqual(game.wave.cards);
  tapSlot(input, 0);
  expect(taps).toHaveLength(1);
});

test("The next Wave should replace the played one once it is off screen", () => {
  const { game, scene, script, dealer } = setup();
  dealer.dealOpeningWave();
  run(script, scene, 1);
  const firstWave = [...game.wave.cards];

  firstWave.forEach((card) => card.play());
  dealer.nextWave();

  run(script, scene, WAVE_PAUSE / 2);
  expect(cardsInSlots(scene)).toEqual(firstWave);

  run(script, scene, WAVE_PAUSE / 2 + DEAL_INTERVAL * 3 + EXIT_TIME + 1);

  const secondWave = game.wave.cards;
  expect(secondWave).toHaveLength(4);
  expect(secondWave.some((card) => firstWave.includes(card))).toBe(false);
  expect(cardsInSlots(scene)).toEqual(secondWave);
});

test("dealOpeningWave can leave input locked for the title Screen", () => {
  const { scene, script, input, dealer, taps } = setup();

  dealer.dealOpeningWave(false);
  run(script, scene, 1);

  tapSlot(input, 0);
  expect(taps).toEqual([]);
});

test("redealBrawl clears the table and deals a fresh Wave", () => {
  const { game, scene, script, dealer } = setup();
  dealer.dealOpeningWave();
  run(script, scene, 1);
  const firstWave = [...game.wave.cards];

  dealer.redealBrawl();
  run(script, scene, 1);

  expect(game.wave.cards).toHaveLength(4);
  expect(game.wave.cards.some((card) => firstWave.includes(card))).toBe(false);
  expect(cardsInSlots(scene)).toEqual(game.wave.cards);
  expect(game.player.getHealth()).toBe(21);
});
