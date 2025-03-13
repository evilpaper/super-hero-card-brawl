export class TitleScreenView {
  private titleScreen: HTMLElement;

  constructor() {
    this.titleScreen = document.querySelector(".game-title") as HTMLElement;
    this.initialize();
  }

  private initialize() {
    this.titleScreen.addEventListener("click", () => {
      this.hide();
    });

    document.addEventListener("keydown", () => {
      this.hide();
    });
  }

  private hide() {
    this.titleScreen.style.display = "none";
  }
}
