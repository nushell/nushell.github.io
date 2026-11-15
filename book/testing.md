# Testing your Nushell Code

## Assert Commands

Nushell provides a set of "assertion" commands in the standard library.
One could use built-in equality / order tests such as `==` or `<=` or more complex commands and throw errors manually when an expected condition fails, but using what the standard library has to offer is arguably easier!

In the following, it will be assumed that the `std/assert` module has been imported inside the current scope:

```nu
use std/assert
```

The foundation for every assertion is the `assert` command. If the condition is not true, it makes an error.

```nu
assert (1 == 2)
# => Error: nu::shell::error
# =>
# =>   × Assertion failed.
# =>    ╭─[repl_entry #13:1:9]
# =>  1 │ assert (1 == 2)
# =>    ·         ───┬──
# =>    ·            ╰── It is not true.
# =>    ╰────
```

Optionally, a message can be set to show the intention of the assert command, what went wrong or what was expected:

```nu
let a = 0
assert ($a == 19) $"The lockout code is wrong, received: ($a)"
# => Error: nu::shell::error
# =>
# =>   × The lockout code is wrong, received: 0
# =>    ╭─[repl_entry #25:2:9]
# =>  1 │ let a = 0
# =>  2 │ assert ($a == 19) $"The lockout code is wrong, received: ($a)"
# =>    ·         ────┬───
# =>    ·             ╰── It is not true.
# =>    ╰────
```

There are many assert commands, which behave exactly as the base one with the proper operator. The additional value for them is the ability for better error messages. [`std/assert`](./standard_library/assert.md) describes each of them, with the messages and labels it shows.

For example this is not so helpful without an additional message:

```nu
let a = "foo"
let b = "bar"
assert ($b | str contains $a)
# => Error: nu::shell::error
# =>
# =>   × Assertion failed.
# =>    ╭─[repl_entry #5:3:14]
# =>  2 │ let b = "bar"
# =>  3 │ assert ($b | str contains $a)
# =>    ·              ──────┬─────
# =>    ·                    ╰── It is not true.
# =>    ╰────
```

While with using `assert str contains`:

```nu
let a = "a needle"
let b = "haystack"
assert str contains $b $a
# => Error: nu::shell::error
# =>
# =>   × `$left` does not have the correct length
# =>    ╭─[repl_entry #7:3:21]
# =>  2 │ let b = "haystack"
# =>  3 │ assert str contains $b $a
# =>    ·                     ─┬ ─┬
# =>    ·                      │  ╰── expected: a needle
# =>    ·                      ╰── value: "haystack"
# =>    ╰────
```

The labels show the string and the text it looked for. Give it a message as a third argument, as in `assert str contains $b $a "the needle is missing"`, and that message comes first.

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
# => Error: nu::shell::error
# =>
# =>   × Assertion failed.
# =>    ╭─[repl_entry #37:2:13]
# =>  1 │ let $a = 13
# =>  2 │ assert even $a
# =>    ·             ─┬
# =>    ·              ╰── 13 is not an even number
# =>    ╰────
```

For an error that points at more than one argument, pass a list of these records with `--error-labels`. [`std/assert`](./standard_library/assert.md#assert) has an example.

## Running the Tests

Now that we are able to write tests by calling commands from `std/assert`, it would be great to be able to run them and see our tests fail when there is an issue and pass when everything is correct :)

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

```nu
# `fib n` is the n-th Fibonacci number
export def fib [n: int]: nothing -> int {
    if $n == 0 {
        return 0
    } else if $n == 1 {
        return 1
    }

    (fib ($n - 1)) + (fib ($n - 2))
}
```

then a test script called `tests.nu` could look like

```nu
use math.nu fib
use std/assert

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

### Basic Test Framework

It is also possible to define tests in Nushell as functions with descriptive names and discover
them dynamically without requiring a [Nupm] package. The following uses `scope commands` and a
second instance of Nushell to run the generated list of tests.

```nu
use std/assert

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

This is a simple example but could be extended to include many of the things you might expect from
a testing framework, including setup and tear down functions and test discovery across files.

### The `testing.nu` runner

The Nushell repository has a runner that does those things, and the standard library's own tests
use it. It isn't part of the standard library and isn't built into `nu`, so download
[`crates/nu-std/testing.nu`](https://github.com/nushell/nushell/blob/main/crates/nu-std/testing.nu)
first, preferably from the release tag that matches your Nushell version, and import it with
`use testing.nu`. The command it gives you is `testing run-tests`.

Mark the tests with the attributes from `std/testing`, which `use std/testing *` brings into
scope: `@test`, `@ignore`, `@before-all`, `@before-each`, `@after-each` and `@after-all`. Without
that import, `@test` is an unknown command. The attributes don't change the command. Each one is
an alias of [`echo`](/commands/docs/echo.md), as described in
[Defining your own attributes](./custom_commands.md#defining-your-own-attributes), so it only
adds a row to the command's `attributes` column in
[`scope commands`](/commands/docs/scope_commands.md). Running the module doesn't run the tests.
A runner has to read that column and call them, which is what `testing run-tests` does.

Using the `math.nu` module from the standalone example above, a test module `tests/test_fib.nu`
could look like this, with one test that is wrong on purpose:

```nu
use std/assert
use std/testing *
use ../math.nu fib

@test
def fib-seven [] {
    assert equal (fib 7) 13
}

@test
def fib-zero [] {
    assert equal (fib 0) 1
}

@ignore
def fib-thirty [] {
    assert equal (fib 30) 832040
}
```

```nu
use testing.nu
testing run-tests --path tests
# => 2026-11-14T16:29:17.609|INF|Running fib-seven in module test_fib
# => 2026-11-14T16:29:17.609|INF|Running fib-zero in module test_fib
# => 2026-11-14T16:29:17.625|ERR|Error while running fib-zero in module test_fib
# => Error: nu::shell::error
# =>
# =>   × These are not equal.
# =>     ╭─[/home/myuser/fib/tests/3ABzxausZT.nu:12:26]
# =>  11 │ def fib-zero [] {
# =>  12 │     assert equal (fib 0) 1
# =>     ·                          ┬
# =>     ·                          ╰── right: 1
# =>  13 │ }
# =>     ╰────
# =>    ╭─[/home/myuser/fib/tests/../math.nu:4:16]
# =>  3 │     if $n == 0 {
# =>  4 │         return 0
# =>    ·                ┬
# =>    ·                ╰── left: 0
# =>  5 │     } else if $n == 1 {
# =>    ╰────
# =>
# =>
# => Error: nu::shell::error
# =>
# =>   × some tests did not pass (see complete errors below):
# =>   │
# =>   │       test_fib fib-seven
# =>   │     ⨯ test_fib fib-zero
# =>   │     s test_fib fib-thirty
# =>   │
```

The final error lists every test, with `⨯` for a failure, `s` for a test skipped with `@ignore`,
and nothing for a pass. The runner never runs a skipped test, so the slow `fib-thirty` above
takes no time. When all tests pass, `testing run-tests` returns nothing and only the
progress lines appear. Those are logged with [`std/log`](./standard_library/log.md),
so `$env.NU_LOG_LEVEL = "ERROR"` leaves only the failures, and `"DEBUG"` also logs the module's
global context (see below) for each test.

#### How tests are found and run

The runner looks at every `.nu` file under `--path`, which defaults to the current directory, in
subdirectories too. It reads each file's commands in a separate `nu` process by
[`source`](/commands/docs/source.md)-ing the file. Any command marked `@test` is a test, exported
or not, and the file name without `.nu` is the module name.

::: warning
Discovery sources _every_ `.nu` file under the path, so code at the top level of any of them runs,
including scripts that aren't tests at all. Point `--path` at a directory that only holds test
modules.
:::

Each test runs in its own `nu --no-config-file` process, so your configuration doesn't apply. Use
`--plugins` with a list of plugin paths to load plugins in those processes. Modules and tests run
in parallel, on as many threads as the machine has CPUs. `--threads` lowers that number, with
anything below `1` treated as `1`. To run a test, the runner saves a copy of the module next to
it under a random name, such as `3ABzxausZT.nu` above, with an extra command that calls the test.
It deletes the copy afterwards. So errors point into that copy, the test directory has to be
writable, and an interrupted run can leave a copy behind. A test passes when its process exits
without an error.

#### Setup and teardown

A module can mark one command with each of the setup and teardown attributes. If more than one
command has the same attribute, the runner uses the first.

- `@before-all` runs once, in its own process, before the module's tests. The record it returns
  is the module's global context. If it fails, the run stops with `Before-all failed`.
- `@before-each` runs in each test's process, just before the test. The runner merges the
  record it returns into the global context.
- The test receives the merged record as its input, `$in`.
- `@after-each` runs after each test, also after a failing one, and receives the same record.
- `@after-all` runs once, in its own process, after the module's tests and receives the global
  context. The runner ignores its output and its errors.

```nu
use std/assert
use std/testing *

@before-all
def setup-all [] {
    {db: "test.db"}
}

@before-each
def setup [] {
    {user: "alice"}
}

@test
def context-is-merged [] {
    assert equal $in {db: "test.db", user: "alice"}
}
```

The global context reaches the tests as NUON text, so it can only hold values that
[`to nuon`](/commands/docs/to_nuon.md) can write. A closure in it makes `@before-all` fail.

#### Choosing tests

- `--test <regex>` runs only the tests whose names match, and `--exclude <regex>` leaves out the
  ones that match.
- `--exclude-module <regex>` leaves out the modules whose names match.
- `--list` returns a table of the modules it found and their tests, setup and teardown commands,
  without running anything.
- To run the tests of a single module, point `--path` at a directory that holds only that module.

If nothing is left to run, the runner fails with `no test to run`, and a `--path` that doesn't
exist gives `directory_not_found`.

[Nupm]: https://github.com/nushell/nupm
