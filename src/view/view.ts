import Card from "../card/card";
import Game from "../game/game";

export default class View {
  private game: Game;

  constructor(game: Game) {
    this.game = game;

    const escapeButton = document.getElementById("escape");

    escapeButton?.addEventListener("click", () => {
      this.game.board.clear();
      this.render(); // Re-render the view after clearing
    });
  }

  playCard(card: Card) {
    this.game.playCard(card);
    this.checkBoardClear();
    this.render();
  }

  checkBoardClear() {
    if (this.game.board.isCleared()) {
      setTimeout(() => {
        this.game.board.clear(); // Clear the board first
        this.game.board.draw(4); // Then draw 4 new cards
        this.render(); // Re-render the view
      }, 500); // Small delay for better UX
    }
  }

  render() {
    const boardElement = document.getElementById("board");
    const healthElement = document.getElementById("health");
    const defenseElement = document.getElementById("defence");

    if (healthElement) {
      healthElement.innerText = this.game.player.health.toString();
    }

    if (defenseElement) {
      defenseElement.innerText = this.game.player.defence.toString();
    }

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
          cardElement.addEventListener("click", () => this.playCard(card));
        }

        boardElement.appendChild(cardElement);
      });
    }
  }
}
