import "./style.css";
import Game from "./game/game";
import View from "./view/view";

const game = new Game();
const view = new View(game);

game.start();
view.render();
