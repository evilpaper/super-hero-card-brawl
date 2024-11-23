import Game from "../game/game";

export default class View {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  render() {
    const boardElement = document.getElementById("board");

    if (boardElement) {
      boardElement.innerHTML = "";

      this.game.board.cards.forEach((card) => {
        const cardElement = document.createElement("li");
        cardElement.innerHTML = `
                    <li class="card">
                        <button>
                            <div>
                                <span class="suite">${card.suite}</span>
                                <span>${card.value}</span>
                            </div>
                             <span>${card.played}</span>
                        </button>
                    </li>
                `;

        if (!card.played) {
          cardElement.addEventListener("click", () => {
            card.play();
            this.render();
          });
        }

        boardElement.appendChild(cardElement);
      });
    }
  }
}
