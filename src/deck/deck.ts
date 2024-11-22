import Card from "../card/card"
import { Rank, Suite, Value } from "../card/card.types";

export default class Deck {
    cards: Array<Card>

    constructor() {
        this.cards = [];
        const suites: Suite[] = ["♠︎", "♥︎", "♣︎", "♦︎"];
        const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        
        for (const suite of suites) {
            for (const rank of ranks) {
                // Map rank to value (A=1, J=11, Q=13, K=15)
                let value: Value;
                if (rank === "A") value = 1;
                else if (rank === "J") value = 11;
                else if (rank === "Q") value = 13;
                else if (rank === "K") value = 15;
                else value = parseInt(rank) as Value;
                
                this.cards.push(new Card(suite, rank, value, `${rank} of ${suite}`));
            }
        }
    }

    shuffle(): void {
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            // Generate random index from 0 to i
            const j = Math.floor(Math.random() * (i + 1));
            // Swap elements at indices i and j
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(count: number) {
        return count
    }
}