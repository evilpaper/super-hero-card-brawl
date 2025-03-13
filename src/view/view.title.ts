export class TitleScreenView {
  private titleScreen: HTMLElement;

  constructor() {
    this.titleScreen = document.querySelector(".game-title") as HTMLElement;
    this.initialize();
  }

  private initialize() {
    // Click handler
    this.titleScreen.addEventListener("click", () => {
      this.hide();
    });

    // Keyboard handler
    document.addEventListener("keydown", () => {
      this.hide();
    });
  }

  private hide() {
    this.titleScreen.style.display = "none";
  }
}
