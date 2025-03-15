import { animate } from "motion";
import Game from "../game/game";

export class ActionButton {
  private actionButton: HTMLElement | null;

  constructor() {
    this.actionButton = document.querySelector(".action-button");
  }

  private updateActionButton(game: Game) {
    if (this.actionButton) {
      const wasDisabled = this.actionButton.classList.contains("disabled");
      if (!game.player.getCanMoveOn()) {
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

      if (game.player.getHealth() <= 0) {
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

      this.actionButton.innerHTML = getActionButtonInnerHTML(game);
      this.actionButton.dataset.buttonType = getActionButtonButtonType(game);
    }
  }

  render(game: Game) {
    this.updateActionButton(game);
  }
}
