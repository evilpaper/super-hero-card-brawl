import "./style.css";
import Game from "./game/game"
import Draw from "./draw/draw";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <p>
      Super Hero Card Brawl
    </p>
    <ul id="board"></ul>
  </div>
`;

const game = new Game();
const draw = new Draw(game)

game.start();
draw.render();
