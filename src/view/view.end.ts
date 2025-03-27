import Game from "../game/game";

export class OverlayView {
  private gameOverOverlay: HTMLElement | null;
  private gameWonOverlay: HTMLElement | null;
  private board: HTMLElement | null;

  constructor() {
    this.gameOverOverlay = document.querySelector(".game-over");
    this.gameWonOverlay = document.querySelector(".game-win");
    this.board = document.querySelector(".board");
  }

  private updateGameOver(game: Game) {
    if (this.gameOverOverlay) {
      const isGameOver = game.player.getHealth() <= 0;

      if (isGameOver) {
        setTimeout(() => {
          this.gameOverOverlay!.style.display = "flex";
          this.board?.classList.add("game-ended");
        }, 200);
      } else {
        this.gameOverOverlay.style.display = "none";
        this.board?.classList.add("game-ended");
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
        this.board?.classList.add("game-ended");
      } else {
        this.gameWonOverlay.style.display = "none";
        this.board?.classList.add("game-ended");
      }
    }
  }

  render(game: Game) {
    this.updateGameOver(game);
    this.updateGameWon(game);
  }
}
