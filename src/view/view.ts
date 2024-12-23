import Card from "../card/card";
import Game from "../game/game";
import { animate } from "motion";
import { Suite } from "../card/card.types";

import clover2 from "../assets/images/cards/clover-2.jpg";
import clover3 from "../assets/images/cards/clover-3.jpg";
import clover4 from "../assets/images/cards/clover-4.jpg";
import clover5 from "../assets/images/cards/clover-5.jpg";
import clover6 from "../assets/images/cards/clover-6.jpg";
import clover7 from "../assets/images/cards/clover-7.jpg";
import clover8 from "../assets/images/cards/clover-8.jpg";
import clover9 from "../assets/images/cards/clover-9.jpg";
import clover10 from "../assets/images/cards/clover-10.jpg";
import cloverJ from "../assets/images/cards/clover-j.jpg";
import cloverQ from "../assets/images/cards/clover-q.jpg";
import cloverK from "../assets/images/cards/clover-k.jpg";
import cloverA from "../assets/images/cards/clover-a.jpg";
import cloverD from "../assets/images/cards/clover-d.jpg";
import spade2 from "../assets/images/cards/spade-2.jpg";
import spade3 from "../assets/images/cards/spade-3.jpg";
import spade4 from "../assets/images/cards/spade-4.jpg";
import spade5 from "../assets/images/cards/spade-5.jpg";
import spade6 from "../assets/images/cards/spade-6.jpg";
import spade7 from "../assets/images/cards/spade-7.jpg";
import spade8 from "../assets/images/cards/spade-8.jpg";
import spade9 from "../assets/images/cards/spade-9.jpg";
import spade10 from "../assets/images/cards/spade-10.jpg";
import spadeJ from "../assets/images/cards/spade-j.jpg";
import spadeQ from "../assets/images/cards/spade-q.jpg";
import spadeK from "../assets/images/cards/spade-k.jpg";
import spadeA from "../assets/images/cards/spade-a.jpg";
import spadeD from "../assets/images/cards/spade-d.jpg";
import heart2 from "../assets/images/cards/heart-2.jpg";
import heart3 from "../assets/images/cards/heart-3.jpg";
import heart4 from "../assets/images/cards/heart-4.jpg";
import heart5 from "../assets/images/cards/heart-5.jpg";
import heart6 from "../assets/images/cards/heart-6.jpg";
import heart7 from "../assets/images/cards/heart-7.jpg";
import heart8 from "../assets/images/cards/heart-8.jpg";
import heart9 from "../assets/images/cards/heart-9.jpg";
import heart10 from "../assets/images/cards/heart-10.jpg";
import heartJ from "../assets/images/cards/heart-j.jpg";
import heartQ from "../assets/images/cards/heart-q.jpg";
import heartK from "../assets/images/cards/heart-k.jpg";
import heartA from "../assets/images/cards/heart-a.jpg";
import tile2 from "../assets/images/cards/tile-2.jpg";
import tile3 from "../assets/images/cards/tile-3.jpg";
import tile4 from "../assets/images/cards/tile-4.jpg";
import tile5 from "../assets/images/cards/tile-5.jpg";
import tile6 from "../assets/images/cards/tile-6.jpg";
import tile7 from "../assets/images/cards/tile-7.jpg";
import tile8 from "../assets/images/cards/tile-8.jpg";
import tile9 from "../assets/images/cards/tile-9.jpg";
import tile10 from "../assets/images/cards/tile-10.jpg";
import tileJ from "../assets/images/cards/tile-j.jpg";
import tileQ from "../assets/images/cards/tile-q.jpg";
import tileK from "../assets/images/cards/tile-k.jpg";
import tileA from "../assets/images/cards/tile-a.jpg";

const suiteMap: Record<Suite, string> = {
  "♠︎": "spade",
  "♥︎": "heart",
  "♣︎": "clover",
  "♦︎": "tile",
};

function getSuiteName(suite: Suite): string {
  return suiteMap[suite];
}

const images: Record<string, string> = {
  "clover-2": clover2,
  "clover-3": clover3,
  "clover-4": clover4,
  "clover-5": clover5,
  "clover-6": clover6,
  "clover-7": clover7,
  "clover-8": clover8,
  "clover-9": clover9,
  "clover-10": clover10,
  "clover-J": cloverJ,
  "clover-Q": cloverQ,
  "clover-K": cloverK,
  "clover-A": cloverA,
  "clover-D": cloverD,
  "spade-2": spade2,
  "spade-3": spade3,
  "spade-4": spade4,
  "spade-5": spade5,
  "spade-6": spade6,
  "spade-7": spade7,
  "spade-8": spade8,
  "spade-9": spade9,
  "spade-10": spade10,
  "spade-J": spadeJ,
  "spade-Q": spadeQ,
  "spade-K": spadeK,
  "spade-A": spadeA,
  "spade-D": spadeD,
  "heart-2": heart2,
  "heart-3": heart3,
  "heart-4": heart4,
  "heart-5": heart5,
  "heart-6": heart6,
  "heart-7": heart7,
  "heart-8": heart8,
  "heart-9": heart9,
  "heart-10": heart10,
  "heart-J": heartJ,
  "heart-Q": heartQ,
  "heart-K": heartK,
  "heart-A": heartA,
  "tile-2": tile2,
  "tile-3": tile3,
  "tile-4": tile4,
  "tile-5": tile5,
  "tile-6": tile6,
  "tile-7": tile7,
  "tile-8": tile8,
  "tile-9": tile9,
  "tile-10": tile10,
  "tile-J": tileJ,
  "tile-Q": tileQ,
  "tile-K": tileK,
  "tile-A": tileA,
};

export default class View {
  private game: Game;
  private healthElement: HTMLElement | null;
  private defenseElement: HTMLElement | null;
  private staminaElement: HTMLElement | null;
  private slot1Element: HTMLElement | null;
  private slot2Element: HTMLElement | null;
  private slot3Element: HTMLElement | null;
  private slot4Element: HTMLElement | null;
  private actionButton: HTMLElement | null;
  private gameOverOverlay: HTMLElement | null;
  private gameWonOverlay: HTMLElement | null;

  constructor(game: Game) {
    this.game = game;

    this.healthElement = document.getElementById("health");
    this.defenseElement = document.getElementById("defence");
    this.staminaElement = document.getElementById("stamina");

    this.slot1Element = document.querySelector(".slot1");
    this.slot2Element = document.querySelector(".slot2");
    this.slot3Element = document.querySelector(".slot3");
    this.slot4Element = document.querySelector(".slot4");

    this.gameOverOverlay = document.querySelector(".game-over") as HTMLElement;
    this.gameWonOverlay = document.querySelector(".game-win") as HTMLElement;
    this.actionButton = document.querySelector(".action-button") as HTMLElement;

    this.actionButton?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (
        target?.dataset.buttonType === "evade" &&
        this.game.player.getCanMoveOn()
      ) {
        this.game.player.setCanMoveOn(false);
        this.game.board.clear();
        this.render();
      }

      if (target?.dataset.buttonType === "restart") {
        this.game.restart();
        this.render();
      }
    });

    const titleScreen = document.querySelector(".game-title") as HTMLElement;

    titleScreen.addEventListener("click", function () {
      titleScreen.style.display = "none";
    });

    document.addEventListener("keydown", function () {
      titleScreen.style.display = "none";
    });
  }

  playCard(card: Card) {
    this.game.playCard(card);
    this.checkBoardClear();
    this.render();
  }

  checkBoardClear() {
    if (this.game.player.getHealth() <= 0) {
      return;
    }
    if (this.game.board.isCleared()) {
      this.game.player.setCanMoveOn(true);
      setTimeout(() => {
        this.game.board.clear();
        this.game.board.draw(4);
        this.render();
      }, 500);
    }
  }

  private animateStatChange(element: HTMLElement | null, newValue: number) {
    if (element) {
      const previousValue = parseInt(element.innerText, 10);

      animate(previousValue, newValue, {
        duration: 0.3,
        ease: "circOut",
        onUpdate: (latest) => {
          if (element) {
            element.innerText = Math.round(latest).toString(); // Update the display
          }
        },
      });
    }
  }

  private updateSlot(index: number, cardElement: HTMLElement, card: Card) {
    const slotElements = [
      this.slot1Element,
      this.slot2Element,
      this.slot3Element,
      this.slot4Element,
    ];
    const slotElement = slotElements[index];

    if (slotElement) {
      const existingCardElement = slotElement.querySelector(
        ".card"
      ) as HTMLElement;
      if (
        existingCardElement?.dataset.value === card.getValue().toString() &&
        existingCardElement?.dataset.rank === card.getRank() &&
        existingCardElement?.dataset.suite === card.getSuite()
      ) {
        // Not changed, do nothing
      } else {
        // Should change, add new and remove old if it exists
        slotElement.appendChild(cardElement);
        if (existingCardElement) {
          existingCardElement.remove();
        }
      }
      if (card.getPlayed()) {
        existingCardElement?.classList.add("disabled");
      }
    }
  }

  render() {
    this.animateStatChange(this.healthElement, this.game.player.getHealth());
    this.animateStatChange(this.defenseElement, this.game.player.getDefence());
    this.animateStatChange(this.staminaElement, this.game.player.getStamina());

    this.game.board.cards.forEach((card, index) => {
      const cardElement = document.createElement("div") as HTMLElement;
      cardElement.classList.add("card");
      cardElement.dataset.value = card.getValue().toString();
      cardElement.dataset.suite = card.getSuite();
      cardElement.dataset.rank = card.getRank();
      cardElement.style.backgroundImage = `url("${
        images[`${getSuiteName(card.getSuite())}-${card.getRank()}`]
      }")`;

      setTimeout(() => {
        animateOnEnter(cardElement);

        if (!card.getPlayed()) {
          cardElement.addEventListener("click", () => {
            animateOnClick(cardElement);
            this.playCard(card);
          });
        }

        this.updateSlot(index, cardElement, card);
      }, index * 100);
    });

    /**
     * Game Over
     */

    if (this.gameOverOverlay?.style) {
      if (this.game.player.getHealth() <= 0 && this.gameOverOverlay) {
        this.gameOverOverlay.style.display = "flex";
      } else {
        this.gameOverOverlay.style.display = "none";
      }
    }

    /**
     * Game Won
     */

    if (this.gameWonOverlay?.style) {
      if (
        this.game.player.getHealth() > 0 &&
        this.game.deck.getCardCount() === 0 &&
        this.game.board.cards.length === 0 &&
        this.gameWonOverlay
      ) {
        this.gameWonOverlay.style.display = "flex";
      } else {
        this.gameWonOverlay.style.display = "none";
      }
    }

    /**
     * Action button logic
     */

    if (this.actionButton) {
      if (!this.game.player.getCanMoveOn()) {
        this.actionButton.classList.add("disabled");
      } else {
        this.actionButton.classList.remove("disabled");
      }

      if (this.game.player.getHealth() <= 0) {
        this.actionButton.classList.remove("disabled");
      }

      this.actionButton.innerHTML =
        this.game.player.getHealth() > 0 ? "Move on" : "Restart";
      this.actionButton.dataset.buttonType =
        this.game.player.getHealth() > 0 ? "evade" : "restart";
    }
  }
}

function animateOnClick(element: HTMLElement) {
  // Reset style
  element.style.transformOrigin = "center";

  animate(
    element,
    { opacity: [1, 0.4], scale: [1, 0.9, 1] },
    { duration: 0.3 }
  );
}

function animateOnEnter(element: HTMLElement) {
  // Set necessary style for the animation
  element.style.transformOrigin = "top left";

  // Then animate
  animate(
    element,
    { opacity: [0, 1], rotateY: ["-70deg", "0deg"] },
    {
      duration: 0.6,
      ease: [0.175, 0.885, 0.32, 1.275],
    }
  );
}
