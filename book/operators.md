# Operators

Nushell supports the following operators:

| Operator | Description                     |
| -------- | ------------------------------- |
| `+`      | add                             |
| `-`      | subtract                        |
| `*`      | multiply                        |
| `/`      | divide                          |
| `**`     | exponentiation (power)          |
| `mod`    | modulo                          |
| `==`     | equal                           |
| `!=`     | not equal                       |
| `<`      | less than                       |
| `<=`     | less than or equal              |
| `>`      | greater than                    |
| `>=`     | greater than or equal           |
| `=~`     | string contains another         |
| `!~`     | string does not contain another |
| `in`     | value in list                   |
| `not-in` | value not in list               |
| `&&`     | and two Boolean values          |
| `||`     | or two Boolean values           |

Parentheses can be used for grouping to specify evaluation order or for calling commands and using the results in an expression.

Commands that take a boolean expression, such as
`where`, `keep while`, `keep until`, `skip while`, and `skip until`,
are automatically evaluated in shorthand math mode.

For example, `let a = 2; let b = 3; $a * $b` outputs `6`.

## Case Sensitivity

Operators are always case-sensitive when operating on strings. In the future Nu may have simpler syntax for case-insensitive operations, but for now you can usually use the `str` subcommands (run `help str` for a full list). For example, this returns files whose names contain "foo" (case-sensitive):

```nushell
ls | where name =~ "foo"
```

And this will do the same but case-insensitive:

```nushell
ls | where ($it.name | str contains --insensitive "foo")
```
