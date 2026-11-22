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
 * Seconds between one card reaching for its Slot and the next.
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
 * The Wave's four Slots. It owns the Wave's cards on screen and only sets
 * their targets; the card in Slot i is the i-th card the Wave was dealt.
 * A Wave with fewer cards leaves its last Slots empty.
 */
export default class Slots {
  private cards: Card[];
  private width: number;
  private height: number;
  private dealtCount: number;

  constructor(cards: Card[]) {
    this.cards = cards;
    this.width = 0;
    this.height = 0;
    this.dealtCount = 0;

    /**
     * Later Slots draw on top, so cards crossing in flight overlap in deal order.
     */
    cards.forEach((card, slot) => card.setDepth(slot));
  }

  /**
   * Sends every dealt card to its Slot for a new window size. Cards still
   * waiting to be dealt stay where they are until their turn.
   */
  layout(width: number, height: number): void {
    this.width = width;
    this.height = height;

    for (let slot = 0; slot < this.dealtCount; slot++) {
      this.sendToSlot(slot);
    }
  }

  /**
   * Snaps every card below the window, tilted, then queues one step per card
   * that sends it to its Slot, Slot 1 first.
   */
  deal(script: Script): void {
    const { scale, centers } = arrange(this.width, this.height);

    this.cards.forEach((card, slot) => {
      const tilt = (slot % 2 === 0 ? -1 : 1) * (0.3 + 0.05 * slot);
      card.placeAt(centers[slot].x, this.height + CARD_HEIGHT, tilt, scale);

      script.after(slot === 0 ? 0 : DEAL_INTERVAL, () => {
        this.dealtCount = slot + 1;
        this.sendToSlot(slot);
      });
    });
  }

  private sendToSlot(slot: number): void {
    const { scale, centers } = arrange(this.width, this.height);
    this.cards[slot].moveTo(centers[slot].x, centers[slot].y, 0, scale);
  }
}
