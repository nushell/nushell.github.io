# Operators

Nushell supports the following operators for common math, logic, and string operations:

| Operator      | Description                                             |
| ------------- | ------------------------------------------------------- |
| `+`           | add                                                     |
| `-`           | subtract                                                |
| `*`           | multiply                                                |
| `/`           | divide                                                  |
| `//`          | floor division                                          |
| `mod`         | modulo                                                  |
| `**`          | exponentiation (power)                                  |
| `==`          | equal                                                   |
| `!=`          | not equal                                               |
| `<`           | less than                                               |
| `<=`          | less than or equal                                      |
| `>`           | greater than                                            |
| `>=`          | greater than or equal                                   |
| `=~`          | regex match / string contains another                   |
| `!~`          | inverse regex match / string does *not* contain another |
| `in`          | value in list                                           |
| `not-in`      | value not in list                                       |
| `not`         | logical not                                             |
| `and`         | and two Boolean expressions (short-circuits)            |
| `or`          | or two Boolean expressions (short-circuits)             |
| `xor`         | exclusive or two boolean expressions                    |
| `bit-or`      | bitwise or                                              |
| `bit-xor`     | bitwise xor                                             |
| `bit-and`     | bitwise and                                             |
| `bit-shl`     | bitwise shift left                                      |
| `bit-shr`     | bitwise shift right                                     |
| `starts-with` | string starts with                                      |
| `ends-with`   | string ends with                                        |
| `++`          | append lists                                            |


Parentheses can be used for grouping to specify evaluation order or for calling commands and using the results in an expression.

## Order of Operations

Operations are evaluated in the following order (from highest precedence to lowest):

- Parentheses (`()`)
- Exponentiation/Power (`**`)
- Multiply (`*`), Divide (`/`), Integer/Floor Division (`//`), and Modulo (`mod`)
- Add (`+`) and Subtract (`-`)
- Bit shifting (`bit-shl`, `bit-shr`)
- Comparison operations (`==`, `!=`, `<`, `>`, `<=`, `>=`), membership tests (`in`, `not-in`, `starts-with`, `ends-with`), regex matching (`=~`, `!~`), and list appending (`++`)
- Bitwise and (`bit-and`)
- Bitwise xor (`bit-xor`)
- Bitwise or (`bit-or`)
- Logical and (`&&`, `and`)
- Logical xor (`xor`)
- Logical or (`||`, `or`)
- Assignment operations

```
> 3 * (1 + 2)
9
```

## Types

Not all operations make sense for all data types.
If you attempt to perform an operation on non-compatible data types, you will be met with an error message that should explain what went wrong:
```nu
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

```nu
foobarbaz =~ bar # returns true
foobarbaz !~ bar # returns false
ls | where name =~ ^nu # returns all files whose names start with "nu"
```

Both operators use [the Rust regex crate's `is_match()` function](https://docs.rs/regex/latest/regex/struct.Regex.html#method.is_match).

## Case Sensitivity

Operators are usually case-sensitive when operating on strings. There are a few ways to do case-insensitive work instead:

1. In the regular expression operators, specify the `(?i)` case-insensitive mode modifier:

```nu
"FOO" =~ "foo" # returns false
"FOO" =~ "(?i)foo" # returns true
```

2. Use the [`str contains`](/commands/docs/str_contains.md) command's `--insensitive` flag:

```nu
"FOO" | str contains --insensitive "foo"
```

3. Convert strings to lowercase with [`str downcase`](/commands/docs/str_downcase.md) before comparing:

```nu
("FOO" | str downcase) == ("Foo" | str downcase)
```

## Spread operator

The spread operator (`...`) allows to expand lists and records.

lists in a list literal or records in a record literal, as well as expand a list into multiple arguments in a command call.

### Creating lists and records

When creating a list literal, the spread operator can expand the values of another list. For example, to insert a list into another list:

```nu
> [sam, ...[fred, george], susan]
╭───┬────────╮
│ 0 │ sam    │
│ 1 │ fred   │
│ 2 │ george │
│ 3 │ susan  │
╰───┴────────╯
```

This is shorter than to chain multiple `append` or `prepend` commans for each list part. Also, since only one new list is created, it might be slightly more performant.

When creating a record literal, the spread operator can expand the values of another record. For example, to insert a record into another record:

```nu
> { ...{ name: sam, rank: 10 }, age: 21 }
╭──────┬─────╮
│ name │ sam │
│ rank │ 10  │
│ age  │ 21  │
╰──────┴─────╯
```

### Multiple command arguments

When calling a command with a rest parameter or an external command, the spread operator can expand the values of a list of arguments.

```nushell
> print ...[1 2 3]
```

## Cell path access

To access a value in a list or record in the output of a command, we can pipe it into `get` and specify the index or key. However, if we have a literal or variable this would often require a separate subexpression. Instead, we can use cell path access like this:

```nu
> [sam, fred, george].1
fred
> {name: sam, rank: 10}.name
sam
```

:::tip

If the key isn't a bare string, it needs quotes:

```nu
> {"first name": sam, rank: 10}."first name"
sam
> {"1": sam, 2: fred}."1"
sam
```

:::

To access nested values, we can chain cell path access members:

```nu
> [{name: sam, rank: 10}, {name: bob, rank: 7}].1.name
bob
```

Since this is much shorter than chaining multiple `get`s, `get` also accepts a cell path:

```nu
> [{name: sam, rank: 10}, {name: bob, rank: 7}] | get 1.name
bob
```

One advantage over `get` is that cell path members can be optional using `?`. If the value doesn't exist it returns `null` instead of an error:

```nu
> [sam, fred, george].3?
> {name: sam, rank: 10}.age?
> [{name: sam, rank: 10}, {rank: 7}] | get name?
╭───┬─────╮
│ 0 │ sam │
│ 1 │     │
╰───┴─────╯
```
