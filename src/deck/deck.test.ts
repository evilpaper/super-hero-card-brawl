import { expect, test } from "vitest";
import Deck from "./deck";

test("Deck should be created with 52 cards", () => {
    const deck = new Deck();
    expect(deck.cards.length).toBe(52);
});

test("shuffle should randomize card order", () => {
    const deck = new Deck();

    const originalOrder = [...deck.cards];
    
    deck.shuffle();
    
    // Check that cards are in different order
    const orderHasChanged = deck.cards.some((card, index) => {
        const originalCard = originalOrder[index];
        return card.suite !== originalCard.suite || card.value !== originalCard.value;
    });
    
    // Verify all original cards are still present
    const allCardsPresent = originalOrder.every(originalCard => 
        deck.cards.some(shuffledCard => 
            shuffledCard.suite === originalCard.suite && 
            shuffledCard.value === originalCard.value
        )
    );

    expect(orderHasChanged).toBe(true);
    expect(allCardsPresent).toBe(true);
    expect(deck.cards.length).toBe(52);
});

