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
                    <li>
                        <button ${card.played && "disabled"} class="card">
                          <div class="top-left">
                              <span class="value">${card.rank}</span>
                              <span class="suite">${card.suite}</span>
                            </div>
                            <div class="center">
                              <span class="suite">${card.suite}</span>
                            </div>
                            <div class="bottom-right">
                              <span class="value">${card.rank}</span>
                              <span class="suite">${card.suite}</span>
                            </div>
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
