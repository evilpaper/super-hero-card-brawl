import { expect, test } from "vitest";

import Deck from "./deck";

test("Deck should be created with 52 cards", () => {
    const deck = new Deck();
    expect(deck.cards.length).toBe(52);
});

test("Deck should be able to be shuffled. Shuffle should randomize card order", () => {
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

test("Deck should be able to return drawn cards, 1 - 4", () => {
    const deck = new Deck();
    
    // Test drawing 1 card
    const singleDraw = deck.draw_card(1);
    expect(singleDraw).toHaveLength(1);
    expect(deck.cards.length).toBe(51);
    
    // Test drawing 3 cards
    const threeDraw = deck.draw_card(3);
    expect(threeDraw).toHaveLength(3);
    expect(deck.cards.length).toBe(48);
    
    // Test drawing 4 cards
    const fourDraw = deck.draw_card(4);
    expect(fourDraw).toHaveLength(4);
    expect(deck.cards.length).toBe(44);
    
    // Test invalid count (0 or negative)
    expect(deck.draw_card(0)).toHaveLength(0);
    expect(deck.draw_card(-1)).toHaveLength(0);
    
    // Test count greater than 4
    expect(deck.draw_card(5)).toHaveLength(0);
    
    // Test drawing when less than requested cards remain
    const remainingCards = deck.cards.length;
    for (let i = 0; i < remainingCards; i += 4) {
        deck.draw_card(4);
    }
    expect(deck.draw_card(4)).toHaveLength(0);
});

test("Deck should be able to receive returned cards, 1 - 4", () => {
    const deck = new Deck();

    // Test drawing 1 card
    const singleDraw = deck.draw_card(1);
    expect(singleDraw).toHaveLength(1);
    expect(deck.cards.length).toBe(51);

    // Test returning drawn card
    deck.return_card(singleDraw);
    expect(deck.cards.length).toBe(52);
})

