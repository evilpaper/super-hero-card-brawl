import Card from "../card/card";
import Game from "../game/game";

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
        this.game.player.canMoveOn
      ) {
        this.game.player.canMoveOn = false;
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
    if (this.game.player.health <= 0) {
      console.log("Player is knocked out!");
      return;
    }
    if (this.game.board.isCleared()) {
      this.game.player.canMoveOn = true;
      setTimeout(() => {
        this.game.board.clear();
        this.game.board.draw(4);
        this.render();
      }, 500);
    }
  }

  render() {
    if (this.healthElement) {
      this.healthElement.innerText = this.game.player.health.toString();
    }

    if (this.defenseElement) {
      this.defenseElement.innerText = this.game.player.defence.toString();
    }

    if (this.staminaElement) {
      this.staminaElement.innerText = this.game.player.stamina.toString();
    }

    this.game.board.cards.forEach((card, index) => {
      const cardElement = document.createElement("div") as HTMLElement;
      cardElement.classList.add("fluff-card");
      cardElement.dataset.value = card.value.toString();
      cardElement.dataset.suite = card.suite;
      cardElement.dataset.rank = card.rank;
      cardElement.style.backgroundImage = `url("./${card.image}")`;

      if (!card.played) {
        cardElement.addEventListener("click", () => this.playCard(card));
      }

      if (index === 0) {
        if (this.slot1Element) {
          const slot1CardElement = this.slot1Element.querySelector(
            ".fluff-card"
          ) as HTMLElement;
          if (
            slot1CardElement?.dataset.value === card.value.toString() &&
            slot1CardElement?.dataset.rank === card.rank &&
            slot1CardElement?.dataset.suite === card.suite
          ) {
            // Not changed, do nothing
          } else {
            // Should change, add new and remove old if it exist
            this.slot1Element?.appendChild(cardElement);
            if (slot1CardElement) {
              slot1CardElement.remove();
            }
          }
          if (card.played) {
            slot1CardElement.classList.add("disabled");
          }
        }
      }
      if (index === 1) {
        if (this.slot2Element) {
          const slot2CardElement = this.slot2Element.querySelector(
            ".fluff-card"
          ) as HTMLElement;
          if (
            slot2CardElement?.dataset.value === card.value.toString() &&
            slot2CardElement?.dataset.rank === card.rank &&
            slot2CardElement?.dataset.suite === card.suite
          ) {
            // Not changed, do nothing
          } else {
            // Should change, add new and remove old if it exist
            this.slot2Element?.appendChild(cardElement);
            if (slot2CardElement) {
              slot2CardElement.remove();
            }
          }
          if (card.played) {
            slot2CardElement.classList.add("disabled");
          }
        }
      }
      if (index === 2) {
        if (this.slot3Element) {
          const slot3CardElement = this.slot3Element.querySelector(
            ".fluff-card"
          ) as HTMLElement;
          if (
            slot3CardElement?.dataset.value === card.value.toString() &&
            slot3CardElement?.dataset.rank === card.rank &&
            slot3CardElement?.dataset.suite === card.suite
          ) {
            // Not changed, do nothing
          } else {
            // Should change, add new and remove old if it exist
            this.slot3Element?.appendChild(cardElement);
            if (slot3CardElement) {
              slot3CardElement.remove();
            }
          }
          if (card.played) {
            slot3CardElement.classList.add("disabled");
          }
        }
      }
      if (index === 3) {
        if (this.slot4Element) {
          const slot4CardElement = this.slot4Element.querySelector(
            ".fluff-card"
          ) as HTMLElement;
          if (
            slot4CardElement?.dataset.value === card.value.toString() &&
            slot4CardElement?.dataset.rank === card.rank &&
            slot4CardElement?.dataset.suite === card.suite
          ) {
            // Not changed, do nothing
          } else {
            // Should change, add new and remove old if it exist
            this.slot4Element?.appendChild(cardElement);
            if (slot4CardElement) {
              slot4CardElement.remove();
            }
          }
          if (card.played) {
            slot4CardElement.classList.add("disabled");
          }
        }
      }
    });

    /**
     * Game Over
     */

    if (this.game.player.health <= 0 && this.gameOverOverlay) {
      this.gameOverOverlay.style.display = "flex";
    } else {
      this.gameOverOverlay.style.display = "none";
    }

    /**
     * Game Won
     */
    if (
      this.game.player.health > 0 &&
      this.game.deck.cards.length === 0 &&
      this.game.board.cards.length === 0 &&
      this.gameWonOverlay
    ) {
      this.gameWonOverlay.style.display = "flex";
    } else {
      this.gameWonOverlay.style.display = "none";
    }

    if (this.actionButton) {
      if (!this.game.player.canMoveOn) {
        this.actionButton.classList.add("disabled");
      } else {
        this.actionButton.classList.remove("disabled");
      }

      if (this.game.player.health <= 0) {
        this.actionButton.classList.remove("disabled");
      }

      this.actionButton.innerHTML =
        this.game.player.health > 0 ? "Move on" : "Restart";
      this.actionButton.dataset.buttonType =
        this.game.player.health > 0 ? "evade" : "restart";
    }
  }
}
