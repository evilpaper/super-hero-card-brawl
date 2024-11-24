import "./style.css";
import Game from "./game/game";
import View from "./view/view";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <p>
      Super Hero Card Brawl
    </p>
    <div class="stats">
      <p>Health:</p>
      <span id="health"></span> 
      <p>Defense</p>
      <span id="defense"></span>
    </div>
    <ul id="board"></ul>
    <section class="controls">
      <button id="restart">Restart</button>
      <button id="escape">Escape</button>
    </sectino>
  </div>
`;

const game = new Game();
const view = new View(game);

game.start();
view.render();
