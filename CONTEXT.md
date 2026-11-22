# Super Hero Card Brawl

A single-player, Donsol-style card game where the deck is a brawl between red and black: the player plays red, the opponent plays black. The player-facing rules, written in this vocabulary, are in [docs/how-to-play.md](./docs/how-to-play.md).

## Structure of play

**Brawl**:
One game, from the first Wave until the player is knocked out or wins.
_Avoid_: Run, match, round

**Deck**:
The 54 cards — Spades, Clubs, Hearts and Tiles of thirteen each, plus two Jokers — that a Brawl is played through.

**Wave**:
Up to four cards dealt from the Deck; fewer only when the Deck runs low. A Wave is complete when all its cards are played.
_Avoid_: Room, hand, board

**Slot**:
One of the four fixed positions a Wave's cards occupy. Slot order carries no rule meaning; the player may rearrange cards between Slots freely.
_Avoid_: Position, place

**Play**:
Using a card in the Wave. A played card engages, turns face-down, and stays in its Slot until the Wave ends.
_Avoid_: Fold, use, discard

**Engage**:
What a card does when played: an Opponent attacks, an Offensive brawler takes up the player's defence, a Defensive brawler restores Health.
_Avoid_: Activate, trigger, resolve

**Slip past**:
Leaving a Wave before all its cards are played; the unplayed cards are shuffled back into the Deck. Allowed if the player didn't slip past the previous Wave, or once every Opponent in this Wave has been played.
_Avoid_: Escape, move past, move on, evade, skip

**Knocked out**:
The player's Health reaching zero, which loses the Brawl. Playing an Opponent is also called knocking it out.
_Avoid_: Dead, game over, defeated

**Victory**:
The end of a Brawl the moment the last Opponent is played, whatever red cards remain.
_Avoid_: Clear, win screen

## Suits and roles

**Tile**:
The ♦ suit.
_Avoid_: Diamond

**Joker**:
One of the two extra cards in the Deck beyond the four suits. Every Joker is a Boss.
_Avoid_: Donsol

**Opponent**:
A black card — a Spade, Club or Joker — that attacks for its value when played.
_Avoid_: Monster, enemy, opponent brawler

**Boss**:
A Joker in its role as the strongest Opponent, worth 21.

**Brawler**:
A red card, fighting on the player's side: an Offensive or a Defensive brawler.
_Avoid_: Ally, helper

**Offensive brawler**:
A Tile. Playing it sets Defence to its value and refreshes Stamina.
_Avoid_: Shield

**Defensive brawler**:
A Heart. Playing it restores Health by its value; consecutive Defensive brawlers after the first do nothing.
_Avoid_: Potion, healer

## Player state

**Health**:
How much damage the player can still take, capped at 21. At zero the player is knocked out.
_Avoid_: HP, life

**Defence**:
The amount of an Opponent's attack the current Offensive brawler absorbs.
_Avoid_: Armor, shield value

**Stamina**:
How strong an Opponent the current Offensive brawler can still withstand. Each hit lowers it to that Opponent's value; an Opponent at or above it knocks the brawler out and leaves the player unguarded.
_Avoid_: Durability
