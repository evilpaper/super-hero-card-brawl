import { animate } from "motion";

export class HowView {
  private modal: HTMLElement | null;
  private triggerButton: HTMLButtonElement | null;
  private closeButton: HTMLButtonElement | null;

  constructor() {
    this.modal = document.getElementById("how-to-play-modal");
    this.triggerButton = document.querySelector(".info-button");
    this.closeButton = document.querySelector(".close-button");

    this.initialize();
  }

  private show = async () => {
    if (this.modal) {
      this.modal.style.display = "grid";
      await animate(this.modal, { opacity: 1 }, { duration: 0.3 });
    }
  };

  private hide = async () => {
    if (this.modal) {
      await animate(this.modal, { opacity: 0 }, { duration: 0.3 });
      this.modal.style.display = "none";
    }
  };

  private initialize() {
    if (this.triggerButton && this.closeButton && this.modal) {
      this.triggerButton.addEventListener("click", this.show);
      this.closeButton.addEventListener("click", this.hide);

      window.addEventListener("click", async (event) => {
        if (event.target === this.modal) await this.hide();
      });

      document.addEventListener("keydown", async (event) => {
        if (this.modal) {
          if (event.key === "Escape" && this.modal.style.display === "grid") {
            await this.hide();
          }
        }
      });
    }
  }
}
