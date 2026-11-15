# Operators

Nushell supports the following operators for common math, logic, and string operations:

| Operator           | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `+`                | add                                                                            |
| `-`                | subtract                                                                       |
| `*`                | multiply                                                                       |
| `/`                | divide                                                                         |
| `//`               | floor division                                                                 |
| `mod`              | modulo                                                                         |
| `**`               | exponentiation (power)                                                         |
| `==`               | equal                                                                          |
| `!=`               | not equal                                                                      |
| `<`                | less than                                                                      |
| `<=`               | less than or equal                                                             |
| `>`                | greater than                                                                   |
| `>=`               | greater than or equal                                                          |
| `older-than`       | datetime is before another datetime, or before now minus a duration            |
| `newer-than`       | datetime is after another datetime, or after now minus a duration              |
| `=~` or `like`     | regex match / string contains another                                          |
| `!~` or `not-like` | inverse regex match / string does *not* contain another                        |
| `in`               | value in list, substring of string, or key in record                           |
| `not-in`           | value not in list, not a substring, or not a key in record                     |
| `has`              | list has value, string contains another, or record has key                     |
| `not-has`          | list does not have value, string does not contain another, or record lacks key |
| `not`              | logical not                                                                    |
| `and`              | and two Boolean expressions (short-circuits)                                   |
| `or`               | or two Boolean expressions (short-circuits)                                    |
| `xor`              | exclusive or two boolean expressions                                           |
| `bit-or`           | bitwise or                                                                     |
| `bit-xor`          | bitwise xor                                                                    |
| `bit-and`          | bitwise and                                                                    |
| `bit-shl`          | bitwise shift left                                                             |
| `bit-shr`          | bitwise shift right                                                            |
| `starts-with`      | string starts with                                                             |
| `not-starts-with`  | string does not start with                                                     |
| `ends-with`        | string ends with                                                               |
| `not-ends-with`    | string does not end with                                                       |
| `++`               | concatenate two lists, two strings, or two binary values                       |


Parentheses can be used for grouping to specify evaluation order or for calling commands and using the results in an expression. See [Subexpressions](#subexpressions) below.

The [Operators chapter of the Language Guide](/lang-guide/chapters/operators.md) lists the types each operator accepts, with its edge cases and errors.

## Order of Operations

To understand the precedence of operations, you can run the command: `help operators | sort-by precedence -r`.

Presented in descending order of precedence, the article details the operations as follows:

- Parentheses (`()`)
- Exponentiation/Power (`**`)
- Multiply (`*`), Divide (`/`), Integer/Floor Division (`//`), and Modulo (`mod`)
- Add (`+`) and Subtract (`-`)
- Bit shifting (`bit-shl`, `bit-shr`)
- Comparison operations (`==`, `!=`, `<`, `>`, `<=`, `>=`, `older-than`, `newer-than`), membership tests (`in`, `not-in`, `has`, `not-has`, `starts-with`, `not-starts-with`, `ends-with`, `not-ends-with`), regex matching (`=~`, `!~`, `like`, `not-like`), and concatenation (`++`)
- Bitwise and (`bit-and`)
- Bitwise xor (`bit-xor`)
- Bitwise or (`bit-or`)
- Logical not (`not`)
- Logical and (`and`)
- Logical xor (`xor`)
- Logical or (`or`)
- Assignment operations

```nu
3 * (1 + 2)
# => 9
```

Operators on the same level group from left to right, so `10 - 2 + 3` is `11`. Only `**` groups from right to left, so `2 ** 3 ** 2` is `2 ** 9`, which is `512`. The [Language Guide](/lang-guide/chapters/operators.md#precedence) has the numeric precedence values that `help operators` shows.

## Negation

A `-` written directly in front of a variable or a parenthesized expression negates it. This works for numbers, durations and file sizes:

```nu
let x = 5
-$x
# => -5
-(1 + $x)
# => -6
let d = 2sec
-$d
# => -2sec
```

The `-` has to touch the value. `- $x`, with a space, is a parse error ("expected operator"). Negating any other type, such as a string or a bool, is a parse error with the hint "Only numbers, durations and filesizes can be negated." When the parser can't know the type, as with a variable declared `any`, the error comes when the line runs instead.

Negation binds more tightly than every binary operator, `**` included, so `-$x ** 2` is `25`. Write `-($x ** 2)` to get `-25`.

In a command call, Nushell reads a word that starts with `-` as a flag. `echo -$x` fails with "The `echo` command doesn't have flag `-$`", so put the negation in parentheses: `echo (-$x)`. An external command gets `-$x` as the literal text `-$x`, so use `^echo (-$x)` there too.

## Subexpressions

A pipeline inside parentheses is a subexpression. Nushell runs it and puts its value where the parentheses were, so a command's output can take part in an expression:

```nu
([1 2 3] | math sum) * 2
# => 12
```

A subexpression can hold several pipelines separated by `;`. Its value is the value of the last one:

```nu
(print "one"; 2 + 3)
# => one
# => 5
```

A newline inside the parentheses doesn't end a pipeline. Nushell treats it as a space, so a long pipeline can span several lines, as in [Multi-line pipelines](./pipelines.md#multi-line-pipelines). It also means that a subexpression with `print a` on one line and `print b` on the next runs a single `print` with three arguments. Use `;` to separate pipelines.

A cell path can follow the closing parenthesis to pick a field or an item out of the result:

```nu
let files = [[name size]; [a.txt 1kb] [b.txt 5kb]]
($files | where size > 2kb).name
# => ╭───┬───────╮
# => │ 0 │ b.txt │
# => ╰───┴───────╯
([a b c] | reverse).0
# => c
```

Inside an unquoted word, a subexpression is interpolated into the word. This works in arguments to external commands too:

```nu
^echo foo(1 + 2)
# => foo3
```

See [Interpolation in bare words](./working_with_strings.md#interpolation-in-bare-words) for the rules.

## Operators in command arguments

Nushell decides how to read each part of a pipeline by its first word. When that word is a value, the whole part is an expression and operators work in it. A value here means:

- a number or another literal, such as `10kb`, `2hr`, `2026-01-01`, `0x[ff]` or `1..5`
- a quoted or raw string
- a variable, such as `$x`
- anything that starts with `(`, `[`, `{` or `-`
- one of the words `true`, `false`, `null` or `not`

Anything else is a command name, and the words after it are the command's arguments. An operator in an argument list is one more argument. `echo 1 + 2` passes `1`, `+` and `2` to `echo`, which returns them as a list, and a command with no room for the extra arguments fails with `extra_positional`. Put the expression in parentheses to pass its result:

```nu
echo 1 + 2
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ + │
# => │ 2 │ 2 │
# => ╰───┴───╯
echo (1 + 2)
# => 3
```

Some keywords and commands take a whole expression as one argument, so operators work there without parentheses. That covers the condition of `if` and `while`, the value after `=` in `let`, `mut` and `const`, and the row condition of [`where`](/commands/docs/where.md) and of filters such as `all`, `any` and `take while`.

List items work the same way as command arguments, so `[1 + 1]` is a list of three items and `[(1 + 1)]` is `[2]`. `if` and `match` return values too, but an operator can't follow them directly. Write `(if $x { 1 } else { 2 }) + 1`.

An expression ends at the end of its line. A line that ends with an operator, such as `let x = 1 +`, fails with `incomplete_math_expression` instead of continuing on the next line. Wrap the expression in parentheses to split it across lines:

```nu
let x = (1 +
  2)
$x
# => 3
```

## Types

Not all operations make sense for all data types.
If you attempt to perform an operation on non-compatible data types, you will be met with an error message that should explain what went wrong:
```nu
"spam" - 1
# => Error: nu::parser::operator_unsupported_type
# =>
# =>   × The '-' operator does not work on values of type 'string'.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "spam" - 1
# =>    · ───┬── ┬
# =>    ·    │   ╰── does not support 'string'
# =>    ·    ╰── string
# =>    ╰────
```

The rules might sometimes feel a bit strict, but on the other hand there should be less unexpected side effects.

`null` is a common source of these errors, for example from an optional cell path like `$row.size?`. Comparisons with `<`, `<=`, `>` and `>=` return `null`, `==` and `!=` return a `bool`, and most other operators fail. The [row conditions](/lang-guide/chapters/filters/where-filter.md#row-conditions) section of the `where` guide lists the rules for each operator.

For example, `++` only concatenates two values of the same kind: two lists, two strings, or two binary values. To add a single item to a list, wrap the item in a list or use [`append`](/commands/docs/append.md):

```nu
[1 2] ++ 3
# => Error: nu::parser::operator_unsupported_type
# =>
# =>   × The '++' operator does not work on values of type 'int'.
# =>    ╭─[repl_entry #2:1:7]
# =>  1 │ [1 2] ++ 3
# =>    ·       ─┬ ┬
# =>    ·        │ ╰── int
# =>    ·        ╰── does not support 'int'
# =>    ╰────
# =>   help: if you meant to append a value to a list or a record to a table, use the `append` command or wrap the value in a list. For example: `$list ++ $value` should be `$list ++ [$value]` or `$list
# =>         | append $value`.

[1 2] ++ [3]
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => ╰───┴───╯
```

## Comparing datetimes

`older-than` and `newer-than` compare a datetime on the left with a point in time on the right. When the right side is a duration, the point is that long before now, so `$date older-than 2wk` asks whether `$date` is more than two weeks in the past. When the right side is a datetime, `older-than` is the same as `<` and `newer-than` is the same as `>`.

```nu
2020-01-01 older-than 2wk
# => true
2020-01-01 newer-than 2wk
# => false
2020-01-01 older-than 2021-01-01
# => true
```

Both comparisons are strict, so a datetime is neither older nor newer than itself. Nushell reads the clock each time the expression runs, as it would for `(date now) - 2wk`. Use them in a [`where`](/commands/docs/where.md) condition:

```nu
[[name modified]; [old.txt 2020-01-01] [new.txt 2099-01-01]] | where modified older-than 1wk | get name
# => ╭───┬─────────╮
# => │ 0 │ old.txt │
# => ╰───┴─────────╯
```

The datetime has to be on the left, and the duration has to be a duration value, not a string such as `"2wk"`. When either side is `null`, the result is `null`, as with `<`.

`<`, `<=`, `>` and `>=` don't accept a datetime and a duration. `$date < 2wk` is an error whose help points to `older-than`, and `$date > 2wk` points to `newer-than`. For `<=` and `>=`, the help suggests subtracting the duration from now, as in `$date <= (date now) - 2wk`, since `older-than` and `newer-than` never match the exact point in time.

## Regular Expression / string-contains Operators

The `=~` and `!~` operators provide a convenient way to evaluate [regular expressions](https://cheatography.com/davechild/cheat-sheets/regular-expressions/). You don't need to know regular expressions to use them - they're also an easy way to check whether 1 string contains another.

- `string =~ pattern` returns **true** if `string` contains a match for `pattern`, and **false** otherwise.
- `string !~ pattern` returns **false** if `string` contains a match for `pattern`, and **true** otherwise.

For example:

```nu
"foobarbaz" =~ "bar" # returns true
"foobarbaz" !~ "bar" # returns false
ls | where name =~ ^nu # returns all files whose names start with "nu"
```

Both operators use the [`fancy-regex`](https://docs.rs/fancy-regex) crate, which adds look-around and backreferences to the syntax of Rust's `regex` crate. See [Regular Expressions](./regular_expressions.md) for the syntax.

`like` and `not-like` are other names for `=~` and `!~`. They take a regular expression as well. SQL's `%` wildcard has no special meaning, so `"abc" like "a%"` is `false`.

Both sides must be strings. An `int`, a `glob` or `null` operand is a type error. A pattern that isn't a valid regular expression fails when the line runs:

```nu
"foo" =~ "("
# => Error: nu::shell::invalid_value
# =>
# =>   × Invalid value
# =>    ╭─[repl_entry #1:1:10]
# =>  1 │ "foo" =~ "("
# =>    ·          ─┬─
# =>    ·           ╰── expected a valid regular expression, but got '(' (Parsing error at position 1: Opening parenthesis without closing parenthesis)
# =>    ╰────
```

## Case Sensitivity

Operators are usually case-sensitive when operating on strings. There are a few ways to do case-insensitive work instead:

1. In the regular expression operators, specify the `(?i)` case-insensitive mode modifier:

```nu
"FOO" =~ "foo" # returns false
"FOO" =~ "(?i)foo" # returns true
```

2. Use the [`str contains`](/commands/docs/str_contains.md) command's `--ignore-case` flag:

```nu
"FOO" | str contains --ignore-case "foo"
```

3. Convert strings to lowercase with [`str lowercase`](/commands/docs/str_lowercase.md) before comparing:

```nu
("FOO" | str lowercase) == ("Foo" | str lowercase)
```

[`str lowercase`](/commands/docs/str_lowercase.md) also lowercases every string in a list. For a table or a record, name the columns to change, and the others stay as they are:

```nu
["FOO" "Bar"] | str lowercase
# => ╭───┬─────╮
# => │ 0 │ foo │
# => │ 1 │ bar │
# => ╰───┴─────╯
[[name kind]; [FOO BAR]] | str lowercase name
# => ╭───┬──────┬──────╮
# => │ # │ name │ kind │
# => ├───┼──────┼──────┤
# => │ 0 │ foo  │ BAR  │
# => ╰───┴──────┴──────╯
```

It replaces `str downcase`, which was deprecated in 0.114.0.

## Spread operator

Nushell has a spread operator (`...`) for unpacking lists and records. You may be familiar with it
if you've used JavaScript before. Some languages use `*` for their spread/splat operator. It can
expand lists or records in places where multiple values or key-value pairs are expected.

There are three places you can use the spread operator:

- [In list literals](#in-list-literals)
- [In record literals](#in-record-literals)
- [In command calls](#in-command-calls)

### In List literals

Suppose you have multiple lists you want to concatenate together, but you also want to intersperse
some individual values. This can be done with `append` and `prepend`, but the spread
operator can let you do it more easily.

```nu
let dogs = [Spot, Teddy, Tommy]
let cats = ["Mr. Humphrey Montgomery", Kitten]
[
  ...$dogs
  Polly
  ...($cats | each { |elt| $"($elt) \(cat\)" })
  ...[Porky Bessie]
  ...Nemo
]
# => ╭───┬───────────────────────────────╮
# => │ 0 │ Spot                          │
# => │ 1 │ Teddy                         │
# => │ 2 │ Tommy                         │
# => │ 3 │ Polly                         │
# => │ 4 │ Mr. Humphrey Montgomery (cat) │
# => │ 5 │ Kitten (cat)                  │
# => │ 6 │ Porky                         │
# => │ 7 │ Bessie                        │
# => │ 8 │ ...Nemo                       │
# => ╰───┴───────────────────────────────╯
```

The below code is an equivalent version using `append`:
```nu
$dogs |
  append Polly |
  append ($cats | each { |elt| $"($elt) \(cat\)" }) |
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

```nu
[ ... [] ]
# => ╭───┬────────────────╮
# => │ 0 │ ...            │
# => │ 1 │ [list 0 items] │
# => ╰───┴────────────────╯
```

This is mainly so that `...` won't be confused for the spread operator in commands such as `mv ... $dir`.

The value being spread has to be a list. A range is not a list, so `[...(1..3)]` fails with `cannot_spread_as_list`. Turn the range into a list first, for example with `(1..3 | each { $in })`. The one exception is `null`, which spreads to nothing:

```nu
let x = null
[1 ...$x 2]
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => ╰───┴───╯
```

A spread can't be used in a [table literal](/lang-guide/chapters/types/basic_types/table.md#table-literal-syntax), in either the header or a row. `[[...$cols]; [1 2]]` fails with "Cannot spread in a table row".

### In Record literals

Let's say you have a record with some configuration information and you want to add more fields to
this record:

```nu
let settings = { path: /tmp, limit: 5 }
```

You can make a new record with all the fields of `$settings` and some new additions using the spread
operator. You can use the spread multiple records inside a single record literal.

```nu
{
  ...$settings,
  users: [alice bob],
  ...{ url: example.com },
  ...(sys mem)
}
# => ╭────────────┬───────────────╮
# => │ path       │ /tmp          │
# => │ limit      │ 5             │
# => │            │ ╭───┬───────╮ │
# => │ users      │ │ 0 │ alice │ │
# => │            │ │ 1 │ bob   │ │
# => │            │ ╰───┴───────╯ │
# => │ url        │ example.com   │
# => │ total      │ 8.3 GB        │
# => │ free       │ 2.6 GB        │
# => │ used       │ 5.7 GB        │
# => │ available  │ 2.6 GB        │
# => │ swap total │ 2.1 GB        │
# => │ swap free  │ 18.0 MB       │
# => │ swap used  │ 2.1 GB        │
# => ╰────────────┴───────────────╯
```

Similarly to lists, inside record literals, the spread operator can only be used before variables (`...$foo`),
subexpressions (`...(foo)`), and record literals (`...{foo:bar}`). Here too, there needs to be no
whitespace between the `...` and the next expression for it to be recognized as the spread operator.

A key can appear only once in a record literal, and that includes the keys a spread brings in. A
later field doesn't override an earlier one. It's an error:

```nu
let settings = { path: /tmp, limit: 5 }
{ ...$settings, limit: 10 }
# => Error: nu::shell::column_defined_twice
# =>
# =>   × Record field or table column used twice: limit
# =>    ╭─[repl_entry #1:2:3]
# =>  1 │ let settings = { path: /tmp, limit: 5 }
# =>  2 │ { ...$settings, limit: 10 }
# =>    ·   ──────┬─────  ────┬────
# =>    ·         │           ╰── field redefined here
# =>    ·         ╰── field first defined here
# =>    ╰────
# =>   help: A record literal can't contain the same key twice, including keys
# =>         brought in with `...`. To replace a field, use `merge` or `update`.
```

To replace fields, use [`merge`](/commands/docs/merge.md) or [`update`](/commands/docs/update.md):

```nu
$settings | merge { limit: 10 }
# => ╭───────┬──────╮
# => │ path  │ /tmp │
# => │ limit │ 10   │
# => ╰───────┴──────╯
```

As in a list literal, a variable that holds `null` spreads to nothing.

### In Command calls

You can also spread arguments to a command. A list can be spread into a command that has a rest
parameter or into an external command, and a record can be spread into
[named flags](#spreading-records-into-flags).

Here is an example custom command that has a rest parameter:

```nu
def foo [ --flag req opt? ...args ] {
  { flag: $flag, req: $req, opt: $opt, args: $args } | to nuon
}
```

It has one flag (`--flag`), one required positional parameter (`req`), one optional positional parameter
(`opt?`), and rest parameter (`args`).

If you have a list of arguments to pass to `args`, you can spread it the same way you'd spread a list
[inside a list literal](#in-list-literals). The same rules apply: the spread operator is only
recognized before variables, subexpressions, and list literals, and no whitespace is allowed in between.

```nu
foo "bar" "baz" ...[1 2 3] # With ..., the numbers are treated as separate arguments
# => {flag: false, req: bar, opt: baz, args: [1, 2, 3]}
foo "bar" "baz" [1 2 3] # Without ..., [1 2 3] is treated as a single argument
# => {flag: false, req: bar, opt: baz, args: [[1, 2, 3]]}
```

A more useful way to use the spread operator is if you have another command with a rest parameter
and you want it to forward its arguments to `foo`:

```nu
def bar [ ...args ] { foo --flag "bar" "baz" ...$args }
bar 1 2 3
# => {flag: true, req: bar, opt: baz, args: [1, 2, 3]}
```

You can spread multiple lists in a single call, and also intersperse individual arguments:

```nu
foo "bar" "baz" 1 ...[2 3] 4 5 ...(6..9 | take 2) last
# => {flag: false, req: bar, opt: baz, args: [1, 2, 3, 4, 5, 6, 7, last]}
```

Flags/named arguments can go after a spread argument, just like they can go after regular rest arguments:

```nu
foo "bar" "baz" 1 ...[2 3] --flag 4
# => {flag: true, req: bar, opt: baz, args: [1, 2, 3, 4]}
```

If a spread argument comes before an optional positional parameter, that optional parameter is treated
as being omitted:

```nu
foo "bar" ...[1 2] "not opt" # The null means no argument was given for opt
# => {flag: false, req: bar, opt: null, args: [1, 2, "not opt"]}
```

A variable that holds `null` spreads to no arguments at all:

```nu
let none = null
foo "bar" "baz" ...$none
# => {flag: false, req: bar, opt: baz, args: []}
```

Spreading a list into a Nushell command that has no rest parameter is a parse error:

```nu
def greet [name] { $"hi ($name)" }
greet ...[Ann]
# => Error: nu::parser::unexpected_spread_arg
# =>
# =>   × This command does not have a ...rest parameter
# =>    ╭─[repl_entry #1:2:7]
# =>  1 │ def greet [name] { $"hi ($name)" }
# =>  2 │ greet ...[Ann]
# =>    ·       ────┬───
# =>    ·           ╰── unexpected spread argument
# =>    ╰────
# =>   help: To spread arguments, the command needs to define a multi-positional
# =>         parameter in its signature, such as ...rest
```

#### Spreading Records into Flags

A record can be spread into a command call to pass named flags. Each field name is a flag name
(without the leading `--`), and its value is the flag's value. For a switch like `--flag`, `true`
sets it, while `false` or `null` leaves it off. This works with both built-in and custom commands:

```nu
foo ...{ flag: true } "bar"
# => {flag: true, req: bar, opt: null, args: []}

let sort_options = { reverse: true }
[3 1 2] | sort ...$sort_options
# => ╭───┬───╮
# => │ 0 │ 3 │
# => │ 1 │ 2 │
# => │ 2 │ 1 │
# => ╰───┴───╯
```

Field values are checked against the types of the flags, and a field that doesn't match any flag
of the command is an error. See [Custom Commands](custom_commands.md#passing-flags-from-a-record)
for more examples, including how `null` values are handled for flags that take a value.
