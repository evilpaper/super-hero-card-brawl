import Game from "../game/game";

export class OverlayView {
  private gameOverOverlay: HTMLElement | null;
  private gameWonOverlay: HTMLElement | null;

  constructor() {
    this.gameOverOverlay = document.querySelector(".game-over");
    this.gameWonOverlay = document.querySelector(".game-win");
  }

  render(game: Game) {
    this.updateGameOver(game);
    this.updateGameWon(game);
  }

  private updateGameOver(game: Game) {
    // Handle game over overlay visibility
    if (this.gameOverOverlay) {
      const isGameOver = game.player.getHealth() <= 0;

      if (isGameOver) {
        // Small delay to ensure animations complete
        setTimeout(() => {
          this.gameOverOverlay!.style.display = "flex";
        }, 180);
      } else {
        this.gameOverOverlay.style.display = "none";
      }
    }
  }

  private updateGameWon(game: Game) {
    // ... game won logic
  }
}
