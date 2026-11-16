# `std/random`

The `std/random` module has one command, `random dice`, which rolls dice. Import the module without a glob, so the command keeps its `random` prefix and sits next to the built-in [`random`](/commands/docs/random.md) commands:

```nu
use std/random
```

With `use std/random *`, the command is just `dice`.

## `random dice`

`random dice` returns a list with one random number per die. Each number is between `1` and the number of sides, inclusive. `--dice` sets how many dice to roll and defaults to `1`, and `--sides` sets how many sides each die has and defaults to `6`. Neither flag has a short form.

The result is always a list, even for one die, so use [`math sum`](/commands/docs/math_sum.md) to total a roll:

```nu
random dice --dice 3 --sides 20 | describe
# => list<int>
random dice --dice 2 | math sum
```

There must be at least one die, and a die must have at least two sides. Other values fail with the message of an [`assert greater`](./assert.md#comparing-two-values) check, whose labels point into the module's source:

```nu
random dice --sides 1
# => Error: nu::shell::error
# =>
# =>   × The amount of sides must be greater than 1
# =>   │ The condition *left > right* is not satisfied
# =>     ╭─[std/random/mod.nu:17:13]
# =>  16 │     greater $dice 0 "The amount of dice must be greater than 0"
# =>  17 │     greater $sides 1 "The amount of sides must be greater than 1"
# =>     ·             ───┬── ┬
# =>     ·                │   ╰── right: 1
# =>     ·                ╰── left: 1
# =>  18 │
# =>     ╰────
```

`random dice --dice 0` fails the same way with `The amount of dice must be greater than 0`.
