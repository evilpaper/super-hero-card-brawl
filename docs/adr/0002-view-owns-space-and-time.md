# The view owns space and time; the game logic owns the rules

The game logic (`Game`, `Board`, `Deck`, `Card`, `Player`) stays free of rendering concerns and is not changed to suit the renderer. The renderer reads game state and calls `Game` commands; it never mutates state directly.

Everything spatial or about timing belongs to the renderer, even when it looks like game state:

- **Slot order.** Players can drag cards between Slots. The order on screen lives in the renderer, mapped by card id; `Board.cards` keeps the order cards were dealt in, because order has no rule meaning.
- **When a Wave ends.** When every card is played, the renderer lets the last flip finish, gathers the cards, and only then calls `Game.clearHandledRoom()`. Input is locked while Waves change.
- **Ending a Brawl.** The renderer detects a knockout (Health at zero) and Victory (no unplayed Opponents left in the Deck or the Wave) from game state, plays its transition, and calls `Game.restart()`.

The alternative, moving these into `Game` (e.g. `Board.moveCard`, auto-advancing inside `playCard`), was rejected: it would bend tested rules code around presentation, and the renderer would have to reconstruct the old Wave to animate it away.

## Consequences

The logic predates the vocabulary in `CONTEXT.md` and is deliberately left alone, so some names differ: a Wave is `Board` / "room" (`escapeRoom`, `clearHandledRoom`), Slip past is `escapeRoom`, and a Joker is rank `"D"` named "Donsol". Renderer code uses the `CONTEXT.md` terms.

Rules live in `src/game` and import nothing outside it. The browser host lives in `src/web`, and `src/web/main.ts` is its entry. A later terminal host would be a sibling of `web`.
