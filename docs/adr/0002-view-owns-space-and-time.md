# The view owns space and time; the game logic owns the rules

The game logic (`Game`, `Board`, `Deck`, `Card`, `Player`) stays free of rendering concerns and is not changed to suit the renderer. The renderer reads game state and calls `Game` commands; it never mutates state directly.

Everything spatial or about timing belongs to the renderer, even when it looks like game state:

- **Slot order.** Players can drag cards between Slots. The order on screen lives in the renderer, mapped by card id; `Board.cards` keeps the order cards were dealt in, because order has no rule meaning.
- **When a Room ends.** When every card is played, the renderer lets the last flip finish, gathers the cards, and only then calls `Game.clearHandledRoom()`. Input is locked during Room changes.
- **Restarting.** On knockout or victory the renderer detects it from game state, plays its transition, and calls `Game.restart()`.

The alternative, moving these into `Game` (e.g. `Board.moveCard`, auto-advancing inside `playCard`), was rejected: it would bend tested rules code around presentation, and the renderer would have to reconstruct the old Room to animate it away.
