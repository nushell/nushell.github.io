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

Nushell has a spread operator (`...`) for unpacking lists and records. You may be familiar with it
if you've used JavaScript before. Some languages use `*` for their spread/splat operator. It can
expand lists or records in places where multiple values or key-value pairs are expected.

There are three places you can use the spread operator:

- [In list literals](#in-list-literals)
- [In record literals](#in-record-literals)
- [In command calls](#in-command-calls)

### In list literals

Suppose you have multiple lists you want to concatenate together, but you also want to intersperse
some individual values. This can be done with `append` and `prepend`, but the spread
operator can let you do it more easily.

```nushell
> let dogs = [Spot, Teddy, Tommy]
> let cats = ["Mr. Humphrey Montgomery", Kitten]
> [
    ...$dogs
    Polly
    ...($cats | each { |it| $"($it) \(cat\)" })
    ...[Porky Bessie]
    ...Nemo
  ]
╭───┬───────────────────────────────╮
│ 0 │ Spot                          │
│ 1 │ Teddy                         │
│ 2 │ Tommy                         │
│ 3 │ Polly                         │
│ 4 │ Mr. Humphrey Montgomery (cat) │
│ 5 │ Kitten (cat)                  │
│ 6 │ Porky                         │
│ 7 │ Bessie                        │
│ 8 │ ...Nemo                       │
╰───┴───────────────────────────────╯
```

The below code is an equivalent version using `append`:
```nushell
> $dogs |
    append Polly |
    append ($cats | each { |it| $"($it) \(cat\)" }) |
    append [Porky Bessie] |
    append ...Nemo
```

Note that each call to `append` results in the creation of a new list, meaning that in this second
example, 3 unnecessary intermediate lists are created. This is not the case with the spread operator,
so there may be (very minor) performance benefits to using `...` if you're joining lots of large
lists together, over and over.

You may have noticed that the last item of the resulting list above is `"...Nemo"`. This is because
inside list literals, it can only be used to spread lists, not strings. As such, inside list literals, it can
only be used before variables (`...$foo`), subexpressions (`...(foo)`), and list literals (`...[foo]`).

The `...` also won't be recognized as the spread operator if there's any whitespace between it and
the next expression:

```nushell
> [ ... [] ]
╭───┬────────────────╮
│ 0 │ ...            │
│ 1 │ [list 0 items] │
╰───┴────────────────╯
```

This is mainly so that `...` won't be confused for the spread operator in commands such as `mv ... $dir`.

### In record literals

Let's say you have a record with some configuration information and you want to add more fields to
this record:

```nushell
> let config = { path: /tmp, limit: 5 }
```

You can make a new record with all the fields of `$config` and some new additions using the spread
operator. You can use the spread multiple records inside a single record literal.

```nushell
> {
    ...$config,
    users: [alice bob],
    ...{ url: example.com },
    ...(sys | get mem)
  }
╭────────────┬───────────────╮
│ path       │ /tmp          │
│ limit      │ 5             │
│            │ ╭───┬───────╮ │
│ users      │ │ 0 │ alice │ │
│            │ │ 1 │ bob   │ │
│            │ ╰───┴───────╯ │
│ url        │ example.com   │
│ total      │ 8.3 GB        │
│ free       │ 2.6 GB        │
│ used       │ 5.7 GB        │
│ available  │ 2.6 GB        │
│ swap total │ 2.1 GB        │
│ swap free  │ 18.0 MB       │
│ swap used  │ 2.1 GB        │
╰────────────┴───────────────╯
```

Similarly to lists, inside record literals, the spread operator can only be used before variables (`...$foo`),
subexpressions (`...(foo)`), and record literals (`...{foo:bar}`). Here too, there needs to be no
whitespace between the `...` and the next expression for it to be recognized as the spread operator.

### In command calls

You can also spread arguments to a command, provided that it either has a rest parameter or is an
external command.

Here is an example custom command that has a rest parameter:

```nushell
> def foo [ --flag req opt? ...args ] { [$flag, $req, $opt, $args] | to nuon }
```

It has one flag (`--flag`), one required positional parameter (`req`), one optional positional parameter
(`opt?`), and rest parameter (`args`).

If you have a list of arguments to pass to `args`, you can spread it the same way you'd spread a list
[inside a list literal](#in-list-literals). The same rules apply: the spread operator is only
recognized before variables, subexpressions, and list literals, and no whitespace is allowed in between.

```nushell
> foo "bar" "baz" ...[1 2 3] # With ..., the numbers are treated as separate arguments
[false, bar, baz, [1, 2, 3]]
> foo "bar" "baz" [1 2 3] # Without ..., [1 2 3] is treated as a single argument
[false, bar, baz, [[1, 2, 3]]]
```

A more useful way to use the spread operator is if you have another command with a rest parameter
and you want it to forward its arguments to `foo`:

```nushell
> def bar [ ...args ] { foo --flag "bar" "baz" ...$args }
> bar 1 2 3
[true, bar, baz, [1, 2, 3]]
```

You can spread multiple lists in a single call, and also intersperse individual arguments:

```nushell
> foo "bar" "baz" 1 ...[2 3] 4 5 ...(6..9 | take 2) last
[false, bar, baz, [1, 2, 3, 4, 5, 6, 7, last]]
```

Flags/named arguments can go after a spread argument, just like they can go after regular rest arguments:

```nushell
> foo "bar" "baz" 1 ...[2 3] --flag 4
[true, bar, baz, [1, 2, 3, 4]]
```

If a spread argument comes before an optional positional parameter, that optional parameter is treated
as being omitted:

```nushell
> foo "bar" ...[1 2] "not opt" # The null means no argument was given for opt
[false, bar, null, [1, 2, "not opt"]]
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
