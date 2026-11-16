# `std/math`

The `std/math` module exports five mathematical constants. It has no commands. The built-in [`math`](/commands/docs/math.md) commands are separate and don't need it.

| Constant | Value                | Meaning                                                  |
| -------- | -------------------- | -------------------------------------------------------- |
| `E`      | `2.718281828459045`  | Euler's number, the base of `math ln`                    |
| `PI`     | `3.141592653589793`  | π, the ratio of a circle's circumference to its diameter |
| `TAU`    | `6.283185307179586`  | τ, which is 2π                                           |
| `PHI`    | `1.618033988749895`  | φ, the golden ratio                                      |
| `GAMMA`  | `0.5772156649015329` | γ, the Euler-Mascheroni constant                         |

How you name them depends on the import:

- After `use std/math`, they are fields of the `$math` record, as in `$math.PI`.
- After `use std/math *`, they are variables of their own, as in `$PI`.
- After `use std/math PI`, only `$PI` is imported.
- After `use std`, they are under `$std.math`, as in `$std.math.PI`.

Because they are constants, you can use them where Nushell needs a value while it parses the code, such as in another `const`:

```nu
use std/math *
const CIRCUMFERENCE = 2 * $PI * 3
$CIRCUMFERENCE
# => 18.84955592153876
```

See [Importing Constants](../modules/using_modules.md#importing-constants) for more about constants in modules.
