import Card from "../card/card";
import Game from "../game/game";

export default class View {
  private game: Game;

  constructor(game: Game) {
    this.game = game;

    const moveOnButton = document.getElementById("move-on");
    const restartButton = document.getElementById("restart");

    moveOnButton?.addEventListener("click", () => {
      if (this.game.player.canMoveOn) {
        this.game.player.canMoveOn = false;
        this.game.board.clear();
        this.render();
      }
    });

    restartButton?.addEventListener("click", () => {
      this.game.restart();
      this.render();
    });
  }

  playCard(card: Card) {
    this.game.playCard(card);
    this.checkBoardClear();
    this.render();
  }

  checkBoardClear() {
    if (this.game.player.health <= 0) {
      console.log("Player is knocked out!");
      return;
    }
    if (this.game.board.isCleared()) {
      this.game.player.canMoveOn = true;
      setTimeout(() => {
        this.game.board.clear();
        this.game.board.draw(4);
        this.render();
      }, 500);
    }
  }

  render() {
    const boardElement = document.getElementById("board");
    const healthElement = document.getElementById("health");
    const defenseElement = document.getElementById("defence");
    const staminaElement = document.getElementById("stamina");

    if (healthElement) {
      healthElement.innerText = this.game.player.health.toString();
    }

    if (defenseElement) {
      defenseElement.innerText = this.game.player.defence.toString();
    }

    if (staminaElement) {
      staminaElement.innerText = this.game.player.stamina.toString();
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
                              <span class="value">${card.value}</span>
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

    if (this.game.player.health <= 0) {
      const gameOverElement = document.createElement("div");
      gameOverElement.className = "game-overlay";
      gameOverElement.innerHTML = `
        <h2>Game Over</h2>
      `;
      boardElement?.appendChild(gameOverElement);
    }

    if (
      this.game.player.health > 0 &&
      this.game.deck.cards.length === 0 &&
      this.game.board.cards.length === 0
    ) {
      const gameBeatenElement = document.createElement("div");
      gameBeatenElement.className = "game-overlay";
      gameBeatenElement.innerHTML = `
         <h2>You won!</h2>
      `;
      boardElement?.appendChild(gameBeatenElement);
    }
  }
}
