# Super Hero Card Brawl

A single-player, Donsol-style card game themed as a fighting-game brawl. The deck is a brawl between red and black; the player plays red.

## Structure of play

**Deck**:
The 54 cards — four suits of thirteen plus two Bosses — that a game is played through.

**Room**:
A set of up to four cards dealt from the Deck that the player handles before moving on. Shown to players as a "Wave".
_Avoid_: Board (as a game term), hand

**Slot**:
One of the four fixed positions a Room's cards occupy on the table. Slot order carries no rule meaning; the player may rearrange cards between Slots freely.
_Avoid_: Position, place

**Play**:
Using a card in the Room so its effect applies. A played card turns face-down and stays in its Slot until the Room ends.
_Avoid_: Fold, use, discard

**Escape**:
Leaving a Room before all its cards are played; the unplayed cards are shuffled back into the Deck. Shown to players as "Move on". Not allowed twice in a row unless every Opponent in the current Room has been played.
_Avoid_: Evade, skip, flee

## Card roles

**Defensive brawler**:
A ♥ card. Playing it restores Health by its value; consecutive Defensive brawlers heal only from the first.
_Avoid_: Potion, healer

**Offensive brawler**:
A ♦ card. Playing it sets Defence to its value and refreshes Stamina.
_Avoid_: Shield, tile (outside of asset names)

**Opponent**:
A ♠ or ♣ card. Playing it means fighting it, which may cost Health.
_Avoid_: Monster, enemy

**Boss**:
One of the two strongest Opponents, worth 21.
_Avoid_: Donsol, Joker

## Player state

**Health**:
How much damage the player can still take, capped at 21. At zero the player is knocked out.
_Avoid_: HP, life

**Defence**:
The amount of an Opponent's value that the current Offensive brawler absorbs.
_Avoid_: Armor, shield value

**Stamina**:
The ceiling an Opponent must stay under for Defence to apply; fighting an Opponent at or above it knocks out the Offensive brawler.
_Avoid_: Durability
