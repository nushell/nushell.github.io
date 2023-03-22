# Testing in Nushell

## Assert commands

The [standard library](standard_library.md) has assert commands to verify your code. The foundation for every assertion is the `std assert` command. If the condition is not true, it makes an error. For example:

```
❯ std assert (1 == 2)
Error:
  × Assertion failed.
   ╭─[entry #13:1:1]
 1 │ std assert (1 == 2)
   ·             ───┬──
   ·                ╰── It is not true.
   ╰────
```

Optionally, a message can be set to show the intention of the assert command, what went wrong or what was expected:

```nushell
❯ std assert ($a == 19) $"The lockout code is wrong, received: ($a)"
Error:
  × The lockout code is wrong, received: 13
   ╭─[entry #25:1:1]
 1 │ std assert ($a == 19) $"The lockout code is wrong, received: ($a)"
   ·             ────┬───
   ·                 ╰── It is not true.
   ╰────
```

There are many assert commands, which behaves exactly as the base one with the proper operator. The additional value for them is the ability for better error messages.

For example this is not so helpful without additional message:

```
❯ std assert ($b | str contains $a)
Error:
  × Assertion failed.
   ╭─[entry #35:1:1]
 1 │ assert ($b | str contains $a)
   ·              ──────┬─────
   ·                    ╰── It is not true.
   ╰────
```

While with using `assert str contains`:

```
❯ std assert str contains $b $a
Error:
  × Assertion failed.
   ╭─[entry #34:1:1]
 1 │ assert str contains $b $a
   ·                     ──┬──
   ·                       ╰── 'haystack' does not contain 'a needle'.
   ╰────
```

In general for base `assert` command it is encouraged to always provide the additional message to show what went wrong. If you cannot use any built-in assert command, you can create a custom one with passing the label for [`error make`](error_make.md) for the `assert` command:

```
def "assert even" [number: int] {
    std assert ($number mod 2 == 0) --error-label {
        start: (metadata $number).span.start,
        end: (metadata $number).span.end,
        text: $"($number) is not an even number",
    }
}
```

Then you'll have your detailed custom error message:

```
❯ let $a = 13
❯ assert even $a
Error:
  × Assertion failed.
   ╭─[entry #37:1:1]
 1 │ assert even $a
   ·             ─┬
   ·              ╰── 13 is not an even number
   ╰────
```

## Test modules & test cases

The naming convention for test modules is `test_<your_module>.nu`. This module will be sourced many times during testing, so it is strongly discouraged to put any _main_ code there.

The test case commands must be exported commands with `test_<test name>` naming convention, without any required parameters.

For example, `test_math.nu`:

```nushell
use std.nu *

export def test_addition [] {
    assert equal (1 + 2) 3
}

export def test_multiplication [] {
    assert equal (2 * 3) 6
}

export def test_failing [] {
    assert false "This is just for testing"
}
```

## Test runner

You can find a test runner in the [standard library folder in Git repository](https://github.com/nushell/nushell/tree/main/crates/nu-utils/standard_library).

You can run tests in a given folder, including subfolders. You can run tests in a specified module, and you can run a specified test command, too.

```
❯ nu tests.nu --help
Test executor

It executes exported "test_*" commands in "test_*" modules

Usage:
  > main {flags}

Flags:
  --path <Filepath> - Path to look for tests. Default: directory of this file.
  --module <String> - Module to run tests. Default: all test modules found.
  --command <String> - Test command to run. Default: all test command found in the files.
  --list - Do not run any tests, just list them (dry run)
  -h, --help - Display the help message for this command
```

The test runner uses the log commands from standard library to display information, so you can set `NU_LOG_LEVEL` if you want more or less details:

```
❯ nu tests.nu --path .
❯ NU_LOG_LEVEL=DEBUG nu /path/to/tests.nu --path .
❯ NU_LOG_LEVEL=WARNING nu /path/to/tests.nu --path .
```
