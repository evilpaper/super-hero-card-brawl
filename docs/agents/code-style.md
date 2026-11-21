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
