# Testing your Nushell Code

## Assert Commands

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

## Running the Tests

Now that we are able to write tests by calling commands from `std assert`, it would be great to be able to run them and see our tests fail when there is an issue and pass when everything is correct :)


### Nupm Package

In this first case, we will assume that the code you are trying to test is part of a [Nupm] package.

In that case, it is as easy as following the following steps
- create a `tests/` directory next to the `nupm.nuon` package file of your package
- make the `tests/` directory a valid module by adding a `mod.nu` file into it
- write commands inside `tests/`
- call `nupm test`

The convention is that any command fully exported from the `tests` module will be run as a test, e.g.
- `export def some-test` in `tests/mod.nu` will run
- `def just-an-internal-cmd` in `tests/mod.nu` will NOT run
- `export def another-test` in `tests/spam.nu` will run if and only if there is something like `export use spam.nu *` in `tests/mod.nu`


### Standalone Tests

If your Nushell script or module is not part of a [Nupm] package, the simplest way is to write tests in standalone scripts and then call them, either from a `Makefile` or in a CI:

Let's say we have a simple `math.nu` module which contains a simple Fibonacci command:
```nushell
# `fib n` is the n-th Fibonacci number
export def fib [n: int] [ nothing -> int ] {
    if $n == 0 {
        return 0
    } else if $n == 1 {
        return 1
    }

    (fib ($n - 1)) + (fib ($n - 2))
}
```
then a test script called `tests.nu` could look like
```nushell
use math.nu fib
use std assert

for t in [
    [input, expected];
    [0, 0],
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 5],
    [6, 8],
    [7, 13],
] {
    assert equal (fib $t.input) $t.expected
}
```
and be invoked as `nu tests.nu`

[Nupm]: https://github.com/nushell/nupm
