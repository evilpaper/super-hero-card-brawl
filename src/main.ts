import Game from "./game/game";
import View from "./view/view";

const game = new Game();
const view = new View(game);

// How to play section
const modal = document.getElementById("how-to-play-modal") as HTMLElement;
const infoButton = document.querySelector(".info-button") as HTMLButtonElement;
const closeButton = document.querySelector(".close-button") as HTMLElement;

infoButton.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close modal when X is clicked
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.style.display === "block") {
    modal.style.display = "none";
  }
});

game.start();
// This small delay ensure first render does not cause layout shift when the actual card images are loaded and rendered
setTimeout(() => {
  view.render();
}, 300);
