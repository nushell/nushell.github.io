# Testing your Nushell code

## Assert commands

Nushell provides a set of "assertion" commands in the standard library.
One could use built-in equality / order tests such as `==` or `<=` or more complex commands and throw errors manually when an expected condition fails, but using what the standard library has to offer is arguably easier!

In the following, it will be assumed that the `std assert` module has been imported inside the current scope
```nushell
use std assert
```

The foundation for every assertion is the `std assert` command. If the condition is not true, it makes an error.

```nu
assert (1 == 2)
```
```
Error:
  × Assertion failed.
   ╭─[entry #13:1:1]
 1 │ assert (1 == 2)
   ·         ───┬──
   ·            ╰── It is not true.
   ╰────
```

Optionally, a message can be set to show the intention of the assert command, what went wrong or what was expected:

```nu
let a = 0
assert ($a == 19) $"The lockout code is wrong, received: ($a)"
```
```
Error:
  × The lockout code is wrong, received: 13
   ╭─[entry #25:1:1]
 1 │ let a = 0
 2 │ assert ($a == 19) $"The lockout code is wrong, received: ($a)"
   ·         ────┬───
   ·             ╰── It is not true.
   ╰────
```

There are many assert commands, which behave exactly as the base one with the proper operator. The additional value for them is the ability for better error messages.

For example this is not so helpful without additional message:

```nu
let a = "foo"
let b = "bar"
assert ($b | str contains $a)
```
```
Error:   × Assertion failed.
   ╭─[entry #5:3:8]
 2 │ let b = "bar"
 3 │ assert ($b | str contains $a)
   ·        ───────────┬──────────
   ·                   ╰── It is not true.
   ╰────
```

While with using `assert str contains`:

```nu
let a = "a needle"
let b = "haystack"
assert str contains $b $a
```
```
Error:   × Assertion failed.
   ╭─[entry #7:3:21]
 2 │ let b = "bar"
 3 │ assert str contains $b $a
   ·                     ──┬──
   ·                       ╰─┤ This does not contain 'a needle'.
   ·                         │         value: "haystack"
   ╰────
```

In general for base `assert` command it is encouraged to always provide the additional message to show what went wrong. If you cannot use any built-in assert command, you can create a custom one with passing the label for [`error make`](/commands/docs/error_make.md) for the `assert` command:

```nu
def "assert even" [number: int] {
    assert ($number mod 2 == 0) --error-label {
        text: $"($number) is not an even number",
        span: (metadata $number).span,
    }
}
```

Then you'll have your detailed custom error message:

```nu
let $a = 13
assert even $a
```
```
Error:
  × Assertion failed.
   ╭─[entry #37:1:1]
 1 │ assert even $a
   ·             ─┬
   ·              ╰── 13 is not an even number
   ╰────
```
