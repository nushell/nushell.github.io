# Operators

Nushell supports the following operators for common math, logic, and string operations:

| Operator | Description                                             |
| -------- | ------------------------------------------------------- |
| `+`      | add                                                     |
| `-`      | subtract                                                |
| `*`      | multiply                                                |
| `/`      | divide                                                  |
| `**`     | exponentiation (power)                                  |
| `mod`    | modulo                                                  |
| `==`     | equal                                                   |
| `!=`     | not equal                                               |
| `<`      | less than                                               |
| `<=`     | less than or equal                                      |
| `>`      | greater than                                            |
| `>=`     | greater than or equal                                   |
| `=~`     | regex match / string contains another                   |
| `!~`     | inverse regex match / string does *not* contain another |
| `in`     | value in list                                           |
| `not-in` | value not in list                                       |
| `not`    | logical not                                             |
| `&&`, `and`   | and two Boolean values                             |
| `\|\|`, `or`  | or two Boolean values                              |
| `//`          | floor division                                     |
| `**`          | pow                                                |
| `bit-or`      | bitwise or                                         |
| `bit-xor`     | bitwise xor                                        |
| `bit-and`     | bitwise and                                        |
| `bit-shl`     | bitwise shift left                                 |
| `bit-shr`     | bitwise shift right                                |
| `starts-with` | string starts with                                 |
| `ends-with`   | string ends with                                   |

Parentheses can be used for grouping to specify evaluation order or for calling commands and using the results in an expression.

## Order of Operations

Math operations are evaluated in the follow order (from highest precedence to lowest):

- Parentheses (`()`)
- Multiply (`*`) and Divide (`/`) and Power (`**`)
- Add (`+`) and Subtract (`-`)

```
> 3 * (1 + 2)
9
```

## Types

Not all operations make sense for all data types.
If you attempt to perform an operation on non-compatible data types, you will be met with an error message that should explain what went wrong:
```
> "spam" - 1
Error: nu::parser::unsupported_operation (link)

  × Types mismatched for operation.
   ╭─[entry #49:1:1]
 1 │ "spam" - 1
   · ───┬── ┬ ┬
   ·    │   │ ╰── int
   ·    │   ╰── doesn't support these values.
   ·    ╰── string
   ╰────
  help: Change string or int to be the right types and try again.
```

The rules might sometimes feel a bit strict, but on the other hand there should be less unexpected side effects.

## Regular Expression / string-contains Operators

The `=~` and `!~` operators provide a convenient way to evaluate [regular expressions](https://cheatography.com/davechild/cheat-sheets/regular-expressions/). You don't need to know regular expressions to use them - they're also an easy way to check whether 1 string contains another.

- `string =~ pattern` returns **true** if `string` contains a match for `pattern`, and **false** otherwise.
- `string !~ pattern` returns **false** if `string` contains a match for `pattern`, and **true** otherwise.

For example:

```bash
foobarbaz =~ bar # returns true
foobarbaz !~ bar # returns false
ls | where name =~ ^nu # returns all files whose names start with "nu"
```

Both operators use [the Rust regex crate's `is_match()` function](https://docs.rs/regex/latest/regex/struct.Regex.html#method.is_match).

## Case Sensitivity

Operators are usually case-sensitive when operating on strings. There are a few ways to do case-insensitive work instead:

1. In the regular expression operators, specify the `(?i)` case-insensitive mode modifier:

```bash
"FOO" =~ "foo" # returns false
"FOO" =~ "(?i)foo" # returns true
```

2. Use the [`str contains`](commands/str_contains.md) command's `--insensitive` flag:

```bash
"FOO" | str contains --insensitive "foo"
```

3. Convert strings to lowercase with [`str downcase`](commands/str_downcase.md) before comparing:

```bash
("FOO" | str downcase) == ("Foo" | str downcase)
```
