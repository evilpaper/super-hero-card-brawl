# Code style

## Comments

Always write comments as multi-line block comments, even when the text fits on one line:

```ts
/**
 * A damped spring that chases a target value.
 * Set the target and the value follows with velocity.
 */
```

- Never use `//` line comments, and never put a comment at the end of a line of code. Put the block on its own lines above the code it describes.
- The only exceptions are tool directives that must stay in their own syntax, such as `// prettier-ignore` and `/// <reference types="..." />`.

## Naming

Follow Martin Fowler's rule: name a type for the role the caller sees, and leave the data structure out of the type name. A scene that stores its sprites in a list is a `Scene`, not a `DisplayList`. The list can change shape later; the call site still reads `scene.add(card)`.
