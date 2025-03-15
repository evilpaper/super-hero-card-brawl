import Card from "../card/card";
import Game from "../game/game";
import { animate } from "motion";
import { Suite } from "../card/card.types";
import { TitleScreenView } from "./view.title";

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
import { OverlayView } from "./view.overlay";

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
  private healthFill: HTMLElement | null;
  private defenseElement: HTMLElement | null;
  private defenseFill: HTMLElement | null;
  private staminaElement: HTMLElement | null;
  private cloverFill: HTMLElement | null;
  private spadesFill: HTMLElement | null;
  private slot1Element: HTMLElement | null;
  private slot2Element: HTMLElement | null;
  private slot3Element: HTMLElement | null;
  private slot4Element: HTMLElement | null;
  private actionButton: HTMLElement | null;
  private gameOverOverlay: HTMLElement | null;
  private gameWonOverlay: HTMLElement | null;
  private overlays: OverlayView;

  constructor(game: Game) {
    this.game = game;

    this.healthElement = document.getElementById("health");
    this.healthFill = document.getElementById("heart-background-rect-fill");

    this.defenseElement = document.getElementById("defence");
    this.defenseFill = document.getElementById("tile-background-rect-fill");

    this.staminaElement = document.getElementById("stamina");
    this.cloverFill = document.getElementById("clover-background-rect-fill");
    this.spadesFill = document.getElementById("spades-background-rect-fill");

    this.slot1Element = document.querySelector(".slot1");
    this.slot2Element = document.querySelector(".slot2");
    this.slot3Element = document.querySelector(".slot3");
    this.slot4Element = document.querySelector(".slot4");

    this.gameOverOverlay = document.querySelector(".game-over") as HTMLElement;
    this.gameWonOverlay = document.querySelector(".game-win") as HTMLElement;
    this.actionButton = document.querySelector(".action-button") as HTMLElement;

    this.overlays = new OverlayView();

    // We don't need to interact with the title screen later.
    // I so we should refactor it an use exposed methods.
    new TitleScreenView();

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

  private animateValue(element: HTMLElement | null, newValue: number) {
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

  private animateOnClick(element: HTMLElement) {
    // Reset style
    element.style.transformOrigin = "center";

    animate(
      element,
      {
        opacity: [1, 0.4],
        rotate: [0, -2, 1, -2, 1, 0],
        scale: [1, 0.95, 1.02, 1],
      },
      { duration: 0.18, ease: [0.22, 0.03, 0.26, 1] }
    );
  }

  private animateOnEnter(element: HTMLElement, index: number) {
    element.style.transformOrigin = "left";
    element.style.zIndex = "var(--z-cards)";

    const screenCenterX = window.innerWidth / 2;
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const distanceFromCenter = elementCenterX - screenCenterX;

    animate(
      element,
      {
        opacity: [0, 1],
        x: [-distanceFromCenter, 0],
        y: ["90vh", 0],
        rotate: [-90, 0],
        scale: [0.6, 1],
      },
      {
        type: "spring",
        stiffness: 180,
        damping: 20,
        duration: 0.2,
        delay: index * 0.1,
      }
    );
  }

  private animateOnExit(element: HTMLElement, index: number) {
    // Get the starting opacity to animate from. Will avoid flickering when opacity is not set.
    const computedStyle = window.getComputedStyle(element);
    const startingOpacity = Number(computedStyle.opacity);

    element.style.transformOrigin = "left";
    element.style.zIndex = "var(--z-cards)";

    const screenCenterX = window.innerWidth / 2;
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const distanceFromCenter = elementCenterX - screenCenterX;

    return animate(
      element,
      {
        opacity: [startingOpacity, 0],
        x: [0, -distanceFromCenter],
        y: [0, "90vh"],
        rotate: [0, -90], // Add slight rotation
        scale: [1, 0.6],
      },
      {
        type: "spring",
        stiffness: 180,
        damping: 20,
        duration: 0.2,
        delay: index * 0.1,
      }
    );
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
        // Should change
        // Check existing and remove if it exist before adding the new
        if (existingCardElement) {
          const exitAnimation = this.animateOnExit(existingCardElement, index);
          exitAnimation.then(() => {
            existingCardElement.remove();
            slotElement.appendChild(cardElement);
            this.animateOnEnter(cardElement, index);
          });
        } else {
          // In case no existing card exist, just add the new card
          slotElement.appendChild(cardElement);
          this.animateOnEnter(cardElement, index);
        }
      }
      if (card.getPlayed()) {
        existingCardElement?.classList.add("disabled");
      }
    }
  }

  render() {
    this.animateValue(this.healthElement, this.game.player.getHealth());
    if (this.healthFill) {
      const percentage = Math.floor(
        100 - (this.game.player.getHealth() / 21) * 100
      );
      this.healthFill.style.transform = `translateY(${percentage}%)`;
    }
    if (this.defenseFill) {
      const percentage = Math.floor(
        100 - (this.game.player.getDefence() / 11) * 100
      );
      this.defenseFill.style.transform = `translateY(${percentage}%)`;
    }
    if (this.cloverFill) {
      const percentage = Math.floor(
        100 - (this.game.player.getStamina() / 22) * 100
      );
      this.cloverFill.style.transform = `translateY(${percentage}%)`;
    }
    if (this.spadesFill) {
      const percentage = Math.floor(
        100 - (this.game.player.getStamina() / 22) * 100
      );
      this.spadesFill.style.transform = `translateY(${percentage}%)`;
    }

    this.animateValue(this.defenseElement, this.game.player.getDefence());
    this.animateValue(this.staminaElement, this.game.player.getStamina());

    this.game.board.cards.forEach((card, index) => {
      const cardElement = document.createElement("div") as HTMLElement;
      cardElement.classList.add("card");
      cardElement.dataset.value = card.getValue().toString();
      cardElement.dataset.suite = card.getSuite();
      cardElement.dataset.rank = card.getRank();
      cardElement.style.backgroundImage = `url("${
        images[`${getSuiteName(card.getSuite())}-${card.getRank()}`]
      }")`;

      if (!card.getPlayed()) {
        cardElement.addEventListener("click", () => {
          this.animateOnClick(cardElement);
          this.playCard(card);
        });
      }
      this.updateSlot(index, cardElement, card);
    });

    /**
     * Game Over
     */

    this.overlays.render(this.game);

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
      const wasDisabled = this.actionButton.classList.contains("disabled");
      if (!this.game.player.getCanMoveOn()) {
        this.actionButton.classList.add("disabled");
      } else {
        this.actionButton.classList.remove("disabled");
        if (wasDisabled) {
          // Only animate if it was previously disabled
          this.actionButton.style.transformOrigin = "50% 100%";
          animate(
            this.actionButton,
            {
              x: [
                "0px",
                "4px",
                "-6px",
                "6px",
                "-6px",
                "6px",
                "-6px",
                "4px",
                "-4px",
                "2px",
                "0px",
              ],
            },
            {
              duration: 1,
              ease: "easeInOut",
            }
          );
        }
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
