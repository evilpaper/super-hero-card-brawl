# Own the game loop on Canvas 2D, no runtime dependencies

The browser game is drawn on a single Canvas 2D element, and we own the whole render and interaction loop instead of using the DOM, an animation library, or an engine like PixiJS or Phaser. The goal is a juicy, motion-rich feel (Balatro, Card Crawl) from a small amount of code we fully understand. TypeScript, Vite and Vitest stay as build-time tools; nothing ships at runtime.

The shape is borrowed from LÖVE, the framework Balatro is built on:

- **One loop, two callbacks.** A `requestAnimationFrame` loop calls `update(dt)` and then `draw()` every frame. `update` changes state; `draw` only reads it.
- **Capped frame time.** `dt` is clamped so a backgrounded tab or a hitch doesn't make objects jump. Variable `dt` was chosen over a fixed timestep to stay smooth on high-refresh displays without interpolation; springs sub-step internally to stay stable.
- **Flat list, drawn in depth order.** A scene keeps its objects in one list sorted by depth, not in a scene graph. A card game has a handful of objects and no need for nested transforms.
- **Set a target, let it chase.** Animated properties are damped springs: game code sets targets, and the visible value chases them with velocity, which gives overshoot and wobble for free. Scripted moments ("flip, wait, send off, deal") are queued timed steps that set targets, never one-off animation code.
- **Areas place cards.** An area (first: the Wave's four Slots) owns a set of cards and only sets their targets. Layout decisions, like one row versus 2×2, live there.
- **One input dispatcher.** A single pointer handler hit-tests the depth-sorted list and routes taps and drags. Objects don't register their own listeners. A tap is a press and release on the same object without moving more than a few pixels; moving further is a drag, so an accidental drag never plays a card. Player actions call `Game` commands from here. `update` never applies rules itself: it moves what is on screen, and the only `Game` commands it reaches are the ones a scripted moment calls when it finishes (see ADR 0002).
- **Further scenes later.** Title screen, UI and end screens arrive as their own scenes once there is more than the Wave.

## Considered options

- **DOM + an animation library (the previous approach).** Easy layout, but motion fights the layout engine and every effect is a one-off.
- **PixiJS / Phaser.** Scene graph, input and tweens included, but far more than a few cards need, and a runtime dependency we'd have to learn instead of own.
- **Entity-component systems.** Built for hundreds of kinds of objects; overkill here.
