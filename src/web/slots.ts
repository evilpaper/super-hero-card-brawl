import Card, { CARD_HEIGHT, CARD_WIDTH } from "./card";
import Script from "./script";

export const SLOT_COUNT = 4;

/**
 * Space between Slots and around the edge of the window, in CSS pixels at
 * full card size. Both shrink with the cards.
 */
const GAP = 24;
const MARGIN = 24;

/**
 * Seconds between one card reaching for its Slot and the next. Sending cards
 * off uses the same rhythm.
 */
export const DEAL_INTERVAL = 0.08;

/**
 * Where the four Slots sit for one window size, and how big their cards are.
 * There are always four centres, whether or not every Slot holds a card.
 */
export interface Arrangement {
  scale: number;
  centers: Array<{ x: number; y: number }>;
}

/**
 * The card scale at which a grid of Slots fits the window, never above full size.
 */
function fit(columns: number, rows: number, width: number, height: number) {
  const fullWidth = columns * CARD_WIDTH + (columns - 1) * GAP + 2 * MARGIN;
  const fullHeight = rows * CARD_HEIGHT + (rows - 1) * GAP + 2 * MARGIN;
  return Math.min(1, width / fullWidth, height / fullHeight);
}

/**
 * One row or two by two, whichever gives bigger cards. A tie goes to the row.
 */
export function arrange(width: number, height: number): Arrangement {
  const rowScale = fit(SLOT_COUNT, 1, width, height);
  const gridScale = fit(2, 2, width, height);
  const [columns, rows, scale] =
    rowScale >= gridScale ? [SLOT_COUNT, 1, rowScale] : [2, 2, gridScale];

  const stepX = (CARD_WIDTH + GAP) * scale;
  const stepY = (CARD_HEIGHT + GAP) * scale;
  const centers = [];

  for (let slot = 0; slot < SLOT_COUNT; slot++) {
    const column = slot % columns;
    const row = Math.floor(slot / columns);
    centers.push({
      x: width / 2 + (column - (columns - 1) / 2) * stepX,
      y: height / 2 + (row - (rows - 1) / 2) * stepY,
    });
  }

  return { scale, centers };
}

/**
 * The Slot whose centre is closest to a point, among the first `count`.
 * A tie stays with `current`.
 */
function nearest(
  x: number,
  y: number,
  centers: Array<{ x: number; y: number }>,
  count: number,
  current: number,
) {
  let best = current;
  let bestDistance = Math.hypot(x - centers[current].x, y - centers[current].y);

  for (let slot = 0; slot < count; slot++) {
    const distance = Math.hypot(x - centers[slot].x, y - centers[slot].y);

    if (distance < bestDistance) {
      best = slot;
      bestDistance = distance;
    }
  }

  return best;
}

/**
 * Each Slot's card arrives and leaves at its own slight angle, alternating
 * sides, so a deal does not look like one block moving.
 */
function tilt(slot: number) {
  return (slot % 2 === 0 ? -1 : 1) * (0.3 + 0.05 * slot);
}

/**
 * The Wave's four Slots. They hold the current Wave's cards on screen and only
 * set their targets. Slot order starts as the order the Wave was dealt and
 * follows the card the player is holding. A Wave with fewer cards leaves its
 * last Slots empty.
 *
 * Cards come in from below the window and leave the same way, Slot 1 first.
 * Only seated cards, those that have been dealt and not yet sent off, follow
 * the layout when the window changes. A card in the hand stays on the pointer.
 */
export default class Slots {
  private cards: Card[];
  private seated: Set<Card>;
  private held: Card | null;
  private width: number;
  private height: number;

  constructor() {
    this.cards = [];
    this.seated = new Set();
    this.held = null;
    this.width = 0;
    this.height = 0;
  }

  layout(width: number, height: number): void {
    this.width = width;
    this.height = height;

    this.cards.forEach((card, slot) => {
      if (this.seated.has(card) && card !== this.held) {
        this.sendToSlot(card, slot);
      }
    });
  }

  /**
   * Picks a seated card up. A card still coming in or already held stays put.
   */
  grab(card: Card): void {
    if (this.held !== null || !this.seated.has(card)) {
      return;
    }

    this.held = card;
    card.grab();
  }

  /**
   * Moves the held card toward the pointer and gives its Slot to whichever
   * centre the card itself is nearest. The others slide along. The pointer
   * running ahead does not move them until the card arrives.
   */
  drag(card: Card, x: number, y: number): void {
    if (this.held !== card) {
      return;
    }

    this.giveWay(card);
    card.follow(x, y, arrange(this.width, this.height).scale);
  }

  /**
   * Lets the card spring into the Slot it currently occupies.
   */
  drop(card: Card): void {
    if (this.held !== card) {
      return;
    }

    this.held = null;
    card.letGo();
    this.sendToSlot(card, this.cards.indexOf(card));
  }

  /**
   * Takes the next Wave's cards, snaps them below the window, and queues one
   * step per card that sends it to its Slot.
   */
  deal(cards: Card[], script: Script): void {
    this.cards = cards;
    this.seated = new Set();

    cards.forEach((card, slot) => {
      /**
       * Later Slots draw on top, so cards crossing in flight overlap in deal order.
       */
      card.setDepth(slot);
      this.placeBelow(card, slot);

      script.after(slot === 0 ? 0 : DEAL_INTERVAL, () => {
        this.seated.add(card);
        this.sendToSlot(card, slot);
      });
    });
  }

  /**
   * Queues one step per card that sends it back below the window, the way it
   * came in.
   */
  sendOff(script: Script): void {
    this.cards.forEach((card, slot) => {
      script.after(slot === 0 ? 0 : DEAL_INTERVAL, () => {
        this.seated.delete(card);
        this.sendBelow(card, slot);
      });
    });
  }

  /**
   * Inserts the held card at the Slot nearest its drawn position, when that
   * is a different Slot from the one it already occupies. An equal distance
   * keeps the current Slot, so the card does not flicker on the boundary.
   */
  private giveWay(card: Card): void {
    const from = this.cards.indexOf(card);
    const { centers } = arrange(this.width, this.height);
    const to = nearest(card.getX(), card.getY(), centers, this.cards.length, from);

    if (to === from) {
      return;
    }

    this.cards.splice(from, 1);
    this.cards.splice(to, 0, card);
    this.cards.forEach((other, slot) => {
      other.setDepth(slot);

      if (other !== card) {
        this.sendToSlot(other, slot);
      }
    });
  }

  private sendToSlot(card: Card, slot: number): void {
    const { scale, centers } = arrange(this.width, this.height);
    card.moveTo(centers[slot].x, centers[slot].y, 0, scale);
  }

  private placeBelow(card: Card, slot: number): void {
    const { scale, centers } = arrange(this.width, this.height);
    card.placeAt(centers[slot].x, this.height + CARD_HEIGHT, tilt(slot), scale);
  }

  private sendBelow(card: Card, slot: number): void {
    const { scale, centers } = arrange(this.width, this.height);
    card.moveTo(centers[slot].x, this.height + CARD_HEIGHT, tilt(slot), scale);
  }
}
