import Game from "./game/game";
import View from "./view/view";
import { create } from "./view/how";

const game = new Game();
/**
 * Original class based approach. Inspired on my back then understanding of the MVC pattern.
 * Will move away from this pattern.
 */
const view = new View(game);

/**
 * This is a more functional way to set in up. Will transfer into this pattern.
 */
create("how-to-play-modal", ".info-button", ".close-button");

game.start();
// This small delay ensure first render does not cause layout shift when the actual card images are loaded and rendered
setTimeout(() => {
  view.render();
}, 300);
