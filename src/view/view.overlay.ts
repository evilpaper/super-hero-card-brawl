import Game from "../game/game";

export class OverlayView {
  private gameOverOverlay: HTMLElement | null;
  private gameWonOverlay: HTMLElement | null;

  constructor() {
    this.gameOverOverlay = document.querySelector(".game-over");
    this.gameWonOverlay = document.querySelector(".game-win");
  }

  private updateGameOver(game: Game) {
    if (this.gameOverOverlay) {
      const isGameOver = game.player.getHealth() <= 0;

      if (isGameOver) {
        setTimeout(() => {
          this.gameOverOverlay!.style.display = "flex";
        }, 180);
      } else {
        this.gameOverOverlay.style.display = "none";
      }
    }
  }

  private updateGameWon(game: Game) {
    if (this.gameWonOverlay) {
      const isGameWon =
        game.player.getHealth() > 0 &&
        game.deck.getCardCount() === 0 &&
        game.board.cards.length === 0;

      if (isGameWon) {
        this.gameWonOverlay.style.display = "flex";
      } else {
        this.gameWonOverlay.style.display = "none";
      }
    }
  }

  render(game: Game) {
    this.updateGameOver(game);
    this.updateGameWon(game);
  }
}
