import Game from "./game/game";
import View from "./view/view";

const game = new Game();
const view = new View(game);

game.start();
// This small delay ensure first render does not cause layout shift when the actual card images are loaded and rendered
setTimeout(() => {
  view.render();
}, 300);
