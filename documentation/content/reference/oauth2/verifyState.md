---
type: "function"
---

# `verifyState()`

Verifies the state by comparing it to the state stored. The order for the parameters does not matter. Returns `true` if both parameters are defined and matches.

```ts
function verifyState(state1: string | null | undefined, state2: string | null | undefined): boolean;
```

- `state1`
- `state2`

## Example

```ts
import { verifyState } from "oslo/oauth2";

// false
verifyState(null, null);
verifyState(undefined, undefined);
verifyState(null, undefined);

// true
verifyState("abc", "abc");
```
