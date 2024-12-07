import Card from "../card/card";
import Game from "../game/game";

export default class View {
  private game: Game;

  constructor(game: Game) {
    this.game = game;

    const actionButton = document.querySelector(
      ".action-button"
    ) as HTMLElement;

    actionButton?.addEventListener("click", (event) => {
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
    const healthElement = document.getElementById("health");
    const defenseElement = document.getElementById("defence");
    const staminaElement = document.getElementById("stamina");
    const slot1Element = document.querySelector(".slot1");
    const slot2Element = document.querySelector(".slot2");
    const slot3Element = document.querySelector(".slot3");
    const slot4Element = document.querySelector(".slot4");
    const gameOverOverlay = document.querySelector(".game-over") as HTMLElement;
    const gameWonOverlay = document.querySelector(".game-win") as HTMLElement;
    const actionButton = document.querySelector(
      ".action-button"
    ) as HTMLElement;

    /**
     * TODO:
     * [] Check if card has changed
     * [] if not, do nothing
     * [] if so, remove old card and add new card
     */

    if (healthElement) {
      healthElement.innerText = this.game.player.health.toString();
    }

    if (defenseElement) {
      defenseElement.innerText = this.game.player.defence.toString();
    }

    if (staminaElement) {
      staminaElement.innerText = this.game.player.stamina.toString();
    }

    this.game.board.cards.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("fluff-card");
      cardElement.dataset.value = card.value.toString();
      cardElement.dataset.suite = card.suite;
      cardElement.dataset.rank = card.rank;

      cardElement.innerHTML = `
                <div class="top-left">
                    <span class="value">${card.rank}</span>
                    <span class="suite">${card.suite}</span>
                  </div>
                  <div class="center">
                    <span class="value">${card.value}</span>
                  </div>
                  <div class="bottom-right">
                    <span class="value">${card.rank}</span>
                    <span class="suite">${card.suite}</span>
                  </div>
                `;

      if (!card.played) {
        cardElement.addEventListener("click", () => this.playCard(card));
      }

      if (index === 0) {
        if (slot1Element) {
          const slot1CardElement = slot1Element.querySelector(
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
            slot1Element?.appendChild(cardElement);
            if (slot1CardElement) {
              slot1CardElement.remove();
            }
          }
        }
      }
      if (index === 1) {
        if (slot2Element) {
          const slot2CardElement = slot2Element.querySelector(
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
            slot2Element?.appendChild(cardElement);
            if (slot2CardElement) {
              slot2CardElement.remove();
            }
          }
        }
      }
      if (index === 2) {
        if (slot3Element) {
          const slot3CardElement = slot3Element.querySelector(
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
            slot3Element?.appendChild(cardElement);
            if (slot3CardElement) {
              slot3CardElement.remove();
            }
          }
        }
      }
      if (index === 3) {
        if (slot4Element) {
          const slot4CardElement = slot4Element.querySelector(
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
            slot4Element?.appendChild(cardElement);
            if (slot4CardElement) {
              slot4CardElement.remove();
            }
          }
        }
      }
    });

    /**
     * Game Over
     */

    if (this.game.player.health <= 0 && gameOverOverlay) {
      gameOverOverlay.style.display = "flex";
    } else {
      gameOverOverlay.style.display = "none";
    }

    /**
     * Game Won
     */
    if (
      this.game.player.health > 0 &&
      this.game.deck.cards.length === 0 &&
      this.game.board.cards.length === 0 &&
      gameWonOverlay
    ) {
      gameWonOverlay.style.display = "flex";
    } else {
      gameWonOverlay.style.display = "none";
    }

    if (actionButton) {
      if (!this.game.player.canMoveOn) {
        actionButton.classList.add("disabled");
      } else {
        actionButton.classList.remove("disabled");
      }

      actionButton.innerHTML =
        this.game.player.health > 0 ? "Move on" : "Restart";
      actionButton.dataset.buttonType =
        this.game.player.health > 0 ? "evade" : "restart";
    }
  }
}
