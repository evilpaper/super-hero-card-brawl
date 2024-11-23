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
                            <span class="suite">${card.suite}</span>
                            <span>${card.value}</span>
                        </button>
                    </li>
                `;

                if (!card.played) {
                    cardElement.addEventListener("click", () => card.play());
                }
                
                boardElement.appendChild(cardElement);
            });
        }
    }
}