import Card from "../card/card";
import Game from "../game/game";
import { animate } from "motion";
import { images } from "./view.images";
import { Suite } from "../card/card.types";
import { OverlayView } from "./view.end";
import { TitleScreenView } from "./view.title";
import { HowView } from "./view.instructions";

const suiteMap: Record<Suite, string> = {
  "♠︎": "spade",
  "♥︎": "heart",
  "♣︎": "clover",
  "♦︎": "tile",
};

function getSuiteName(suite: Suite): string {
  return suiteMap[suite];
}

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
    this.actionButton = document.querySelector(".action-button") as HTMLElement;
    this.overlays = new OverlayView();

    new TitleScreenView();
    new HowView();

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
        opacity: [startingOpacity, 0.8],
        x: [0, -distanceFromCenter],
        y: [0, "90vh"],
        rotate: [0, -90], // Add slight rotation
        scale: [1, 0.4],
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

    if (!slotElement) return;

    const existingCardElement = slotElement.querySelector(
      ".card"
    ) as HTMLElement;

    // If card hasn't changed, just update disabled state if needed
    if (
      existingCardElement?.dataset.value === card.getValue().toString() &&
      existingCardElement?.dataset.rank === card.getRank() &&
      existingCardElement?.dataset.suite === card.getSuite() &&
      existingCardElement?.dataset.id === card.getId()
    ) {
      if (card.getPlayed()) {
        existingCardElement?.classList.add("disabled");
      }
      return;
    }

    // Prepare the new card but don't add it to DOM yet
    cardElement.style.opacity = "0"; // Start invisible

    if (existingCardElement) {
      // Animate out existing card first
      this.animateOnExit(existingCardElement, index).then(() => {
        existingCardElement.remove();
        // Now add and animate in the new card
        slotElement.appendChild(cardElement);
        /**
         * Without requestAnimationFrame, this sequence happens:
         * Card is appended to DOM
         * Animation starts immediately
         * Browser might not have processed the DOM update yet
         * This can cause the flickering as the browser tries to handle both operations at once
         *
         * With requestAnimationFrame:
         * Card is appended to DOM
         * Browser queues our animation function for the next frame
         * Browser completes the DOM update
         * On next frame, animation starts with the element properly placed
         *
         * It's like saying "Hey browser, first add this card to the DOM, and once you've done that, on the next available frame, start the animation."
         */
        requestAnimationFrame(() => {
          this.animateOnEnter(cardElement, index);
        });
      });
    } else {
      // No existing card, just add and animate in the new one
      slotElement.appendChild(cardElement);
      requestAnimationFrame(() => {
        this.animateOnEnter(cardElement, index);
      });
    }

    if (card.getPlayed()) {
      cardElement.classList.add("disabled");
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
      cardElement.dataset.id = card.getId();
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
     * Overlays handle Game Won and Game Over screens
     */
    this.overlays.render(this.game);

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

      function getActionButtonInnerHTML(game: Game) {
        const isGameOver = game.player.getHealth() <= 0;
        const isGameWon =
          game.player.getHealth() > 0 &&
          game.deck.getCardCount() === 0 &&
          game.board.cards.length === 0;

        if (isGameOver) {
          return "Restart";
        } else if (isGameWon) {
          return "Play again";
        } else {
          return "Move on";
        }
      }

      function getActionButtonButtonType(game: Game) {
        const isGameOver = game.player.getHealth() <= 0;
        const isGameWon =
          game.player.getHealth() > 0 &&
          game.deck.getCardCount() === 0 &&
          game.board.cards.length === 0;

        if (isGameWon || isGameOver) {
          return "restart";
        } else {
          return "evade";
        }
      }

      this.actionButton.innerHTML = getActionButtonInnerHTML(this.game);
      this.actionButton.dataset.buttonType = getActionButtonButtonType(
        this.game
      );
    }
  }
}
