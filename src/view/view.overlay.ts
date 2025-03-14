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
    // ... game over logic
  }

  private updateGameWon(game: Game) {
    // ... game won logic
  }
}
