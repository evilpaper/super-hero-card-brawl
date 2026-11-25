# Title, knocked-out and victory are overlay Screens on the table

The host shows a title on cold start, and a knocked-out or victory Screen when a Brawl ends. Each is an overlay on the live table (dimmed Wave and readout underneath), not a separate world that replaces the Scene.

A thin **Director** in `src/web` owns the mode (`title` | `playing` | `knockedOut` | `victory`) and mounts the current overlay Screen. The table Scene, Dealer, Slots and Loop keep running underneath. This is the concrete form of ADR 0001's "further scenes": Screens as modules with `enter` / `exit`, shaped so a fuller Screen protocol can grow later without a scene-graph or DOM UI.

## Behaviour

- **Title**: only on cold start. The opening Wave is dealt under the title. Any click or key dismisses it into `playing`. Restart after an end Screen skips the title.
- **Knocked out**: the view detects Health at zero (ADR 0002), waits a short beat for the flip, then shows the overlay. Restart calls `Game.restart()` and redeals straight into `playing`.
- **Victory**: the view detects that no unplayed Opponent remains in the Wave or the Deck, same beat and Restart path as knocked out.
- Rules stay in `src/game`. `Game` may expose queries (`isKnockedOut`, `hasVictory`); it never names Screens.

## Considered options

- **Mode branches only in `main.ts`.** Fine for one overlay; becomes a switchyard as Screens grow. Rejected as the long-term shape.
- **Full Scene swap.** Fights the mockups, which keep the table visible under the dim.
- **DOM overlays.** Rejected by ADR 0001 (one canvas, owned loop).
