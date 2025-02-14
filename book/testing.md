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

## Running Tests

Now that we are able to write tests by calling commands from `std assert`, it would be great to be able to run them and see our tests fail when there is an issue and pass when everything is correct :)

There are a few options for this:
- [Nupm]
- [Nutest]
- Standalone

### Nupm

If your code is part of a [Nupm] package, you can use the bundled test runner to run your tests. In that case, it is as easy as following the following steps:
- create a `tests/` directory next to the `nupm.nuon` package file of your package
- make the `tests/` directory a valid module by adding a `mod.nu` file into it
- write commands inside `tests/`
- call `nupm test`

The convention is that any command fully exported from the `tests` module will be run as a test, e.g.
- `export def some-test` in `tests/mod.nu` will run
- `def just-an-internal-cmd` in `tests/mod.nu` will NOT run
- `export def another-test` in `tests/spam.nu` will run if and only if there is something like `export use spam.nu *` in `tests/mod.nu`

### Nutest

[Nutest] is a dedicated test framework for Nushell. A test is defined similar to the Rust approach of using comment-based annotations as follows:

```nushell
use std assert
use hello

# [test]
def "hello should greet the name supplied" [] {
    assert equal (hello "world") "Hello, world!" 
}
```

These tests will be discovered and run if the name of the test file as one of the supported patterns, such as `test_hello.nu` or `hello-test.nu`. Since Nutest is intended to help test both Nushell code and anything else given Nushell's convenient data-centric approach, there is flexibility in how the files are named and where they are placed.

Nutest is an appropriate choice if you want to test commands that are not exported, query test results as data, or produce reports that can be integrated into common CI/CD tooling.

### Standalone

If your testing requirements are simple enough not to need a framework, or you prefer not to depend on external modules, the following is a couple of illustrative examples how to achieve this.

#### Direct Invocation

The simplest method is to write tests in standalone scripts and then `use` or `source` the code under test.

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
then a test script called `tests.nu` might look like
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

#### Test Discovery

The direct invocation method can be expanded to call multiple test commands from a `main` declaration, but as the number of tests methods increases, it is convenient to discover and run them dynamically. The following makes use of `scope commands` to discover the list of tests within the test file, which can be run using `nu tests.nu`.

```nushell
use std assert

source fib.nu

def main [] {
    print "Running tests..."

    let test_commands = (
        scope commands
            | where ($it.type == "custom")
                and ($it.name | str starts-with "test ")
                and not ($it.description | str starts-with "ignore")
            | get name
            | each { |test| [$"print 'Running test: ($test)'", $test] } | flatten
            | str join "; "
    )

    nu --commands $"source ($env.CURRENT_FILE); ($test_commands)"
    print "Tests completed successfully"
}

def "test fib" [] {
    for t in [
        [input, expected];
        [0, 0],
        [1, 1],
        [2, 1],
        [3, 2],
        [4, 3],
        [5, 5],
        [6, 8],
        [7, 13]
    ] {
        assert equal (fib $t.input) $t.expected
    }
}

# ignore
def "test show-ignored-test" [] {
    print "This test will not be executed"
}
```


[Nupm]: https://github.com/nushell/nupm
[Nutest]: https://github.com/vyadh/nutest
