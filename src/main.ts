import { animate } from "motion";
import Game from "./game/game";
import View from "./view/view";

const game = new Game();
const view = new View(game);

// How to play section
const modal = document.getElementById("how-to-play-modal") as HTMLElement;
const infoButton = document.querySelector(".info-button") as HTMLButtonElement;
const closeButton = document.querySelector(".close-button") as HTMLElement;

infoButton.addEventListener("click", () => {
  modal.style.display = "grid";
  animate(modal, { opacity: 1 }, { duration: 0.3 });
});

// Close modal when close button is clicked
closeButton.addEventListener("click", async () => {
  await animate(modal, { opacity: 0 }, { duration: 0.3 });
  modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", async (event) => {
  if (event.target === modal) {
    await animate(modal, { opacity: 0 }, { duration: 0.3 });
    modal.style.display = "none";
  }
});

// Close modal with Escape key
document.addEventListener("keydown", async (event) => {
  if (event.key === "Escape" && modal.style.display === "grid") {
    await animate(modal, { opacity: 0 }, { duration: 0.3 });
    modal.style.display = "none";
  }
});

game.start();
// This small delay ensure first render does not cause layout shift when the actual card images are loaded and rendered
setTimeout(() => {
  view.render();
}, 300);
