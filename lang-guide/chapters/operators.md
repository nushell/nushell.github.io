# Operators

For a full list with precedence values, run `help operators`. See also [Operators](/book/operators.md) in the Book.

## Arithmetic Operators

- `+` - Plus / Addition
- `-` - Minus / Subtraction
- `*` - Multiply
- `/` - Divide (always returns a `float` for numbers, e.g. `10 / 2` is `5.0`)
- `//` - Floor Division
- `mod` - Modulo (floor semantics: the result has the sign of the divisor)
- `**` - Pow
- `++` - Concatenates two lists, two strings, or two binary values
- `-` directly before a variable or a parenthesized expression (`-$x`, `-(1 + $x)`) - Negation of a number, duration or file size. There is no space after the `-`, and negation binds more tightly than `**`. See [Negation](/book/operators.md#negation) in the Book.

```nu
10 / 4
# => 2.5
-7 // 2
# => -4
-7 mod 3
# => 2
2 ** 10
# => 1024
[1 2] ++ [3]
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => ╰───┴───╯
```

An `int` combined with a `float` gives a `float`. That holds for `//`, `mod` and `**` too:

```nu
5.5 // 2
# => 2.0
5.5 mod 2
# => 1.5
2 ** 0.5
# => 1.4142135623730951
```

`+` and `-` won't mix a file size or a duration with a plain number. `1kb + 1` and `1hr - 5` are `operator_incompatible_types` errors, so give the number a unit: `1kb + 1b`. `*` accepts the number on either side, and `mod` also works between two file sizes or two durations:

```nu
2 * 1kb
# => 2.0 kB
1.5 * 1hr
# => 1hr 30min
5kb mod 2kb
# => 1.0 kB
```

A subtraction can give a negative file size or duration. Subtracting one datetime from another gives a duration, negative when the later date is on the right:

```nu
1kb - 2kb
# => -1.0 kB
2026-01-01 - 2026-01-02
# => -1day
```

A duration can be added to a datetime with either one first, so `2wk + 2026-01-01` and `2026-01-01 + 2wk` are the same date. It can only be subtracted from a datetime, though, so `1day - 2026-01-01` is a type error. A datetime can't be multiplied or divided.

`*` doesn't repeat strings or lists. `"ab" * 3` is a type error.

`/`, `//` and `mod` raise `division_by_zero` when the divisor is zero, and that includes floats, so `1.0 / 0.0` is an error, not `inf`. A float result too large to represent does become `inf`, without an error, so `1e308 * 10` is `inf`. An `int` result that overflows is an `operator_overflow` error, as the [`int`](types/basic_types/int.md#additional-language-notes) page explains.

With an `int` base, the exponent can't be negative. `2 ** -1` fails with "Negative exponent for integer power is unsupported; use floats instead.", while `2.0 ** -1` is `0.5`. An `int` power past the 64-bit range, such as `2 ** 63`, is an `operator_overflow` error. A minus sign written against a number is part of that number, so `-2 ** 2` is `(-2) ** 2`, which is `4`. Write `-(2 ** 2)` to get `-4`.

## Comparison Operators

- `==` - Equal
- `!=` - Not Equal
- `<` - Less Than
- `>` - Greater Than
- `<=` - Less Than or Equal To
- `>=` - Greater Than or Equal To
- `older-than` - A datetime is before another datetime, or before now minus a duration
- `newer-than` - A datetime is after another datetime, or after now minus a duration

`==` and `!=` accept any two values, and comparing values of different types isn't an error. Values of different types are never equal, except that an `int` and a `float` with the same value are, and so are a glob and a string with the same text. Two `null`s are equal. Lists, records, ranges and binary values compare by content, and a record's field order doesn't matter:

```nu
1 == "1"
# => false
true == 1
# => false
1 == 1.0
# => true
null == null
# => true
{a: 1, b: 2} == {b: 2, a: 1}
# => true
[1 2] == [2 1]
# => false
```

Two closures are equal when they come from the same closure literal in the source. Their captured values aren't compared. Two closures written separately are never equal, even with identical code:

```nu
{|| 1} == {|| 1}
# => false
let fs = [1 2] | each {|x| {|| $x } }
$fs.0 == $fs.1
# => true
```

`<`, `<=`, `>` and `>=` need two values that have an order: numbers, strings, bools, file sizes, durations, or two datetimes. Strings compare by Unicode code point, so every uppercase ASCII letter sorts before every lowercase one. `false` is less than `true`. Lists, records, ranges and binary values have no order, and comparing them is a type error. When either side is `null`, these four operators return `null` instead of a bool, while `==` and `!=` still return a bool.

```nu
"B" < "a"
# => true
"abc" < "abz"
# => true
false < true
# => true
1 < null | describe
# => nothing
```

Comparisons don't chain. `1 < 2 < 3` reads as `(1 < 2) < 3`, which compares a `bool` with an `int` and fails. Write `1 < 2 and 2 < 3` instead.

A datetime can't be compared with a duration using these operators. See [Comparing datetimes](/book/operators.md#comparing-datetimes) in the Book for the errors and for `older-than` and `newer-than`.

## Bitwise Operators

Nushell provides support for these bitwise operators:

- `bit-or` - bitwise or
- `bit-xor` - bitwise exclusive or
- `bit-and` - bitwise and
- `bit-shl` - bitwise shift left
- `bit-shr` - bitwise shift right

```nu
6 bit-and 3
# => 2
6 bit-or 3
# => 7
6 bit-xor 3
# => 5
1 bit-shl 4
# => 16
-16 bit-shr 2
# => -4
```

They take `int` operands only. A `float` or `binary` operand is a type error. For binary data, use the [`bits` commands](/commands/docs/bits.md).

For both shifts, the amount on the right must be from 0 to 63. Anything else, a negative amount included, raises `operator_overflow`. `bit-shl` drops the bits it shifts past the top of the 64-bit integer without an error, so `3 bit-shl 63` is `-9223372036854775808`. `bit-shr` is an arithmetic shift, so a negative number stays negative.

Comparisons bind more tightly than `bit-and`, `bit-xor` and `bit-or`. `6 bit-and 3 == 2` parses as `6 bit-and (3 == 2)` and fails because `bit-and` gets a `bool`. Write `(6 bit-and 3) == 2`.

## Boolean Operators

- `and` - And (short-circuiting)
- `or` - Or (short-circuiting)
- `xor` - Exclusive or
- `not` - Negates the expression that follows it

`xor` is `true` when exactly one side is `true`. Unlike `and` and `or`, it always evaluates both sides, since it can't know the answer from the left side alone:

```nu
true xor false
# => true
true xor true
# => false
false xor (print "evaluated"; true)
# => evaluated
# => true
```

`not` applies to everything up to the next `and`, `xor` or `or`. `not $a == $b` is `not ($a == $b)`, and `not $a and $b` is `(not $a) and $b`. It can be stacked, as in `not not $x`. Its operand must be a `bool`. Anything else, `null` included, fails with `cant_convert` ("Can't convert to boolean").

```nu
let a = false
let b = false
not $a and $b
# => false
not ($a and $b)
# => true
```

## Other operators

- `=~`/`like` - Regex Match / Contains
- `!~`/`not-like` - Not Regex Match / Not Contains
- `in` - Is a member of (doesn't use regex)
- `not-in` - Is not a member of (doesn't use regex)
- `has` - Contains a value of (doesn't use regex)
- `not-has` - Does not contain a value of (doesn't use regex)
- `starts-with` - Starts With
- `not-starts-with` - Does not start with
- `ends-with` - Ends With
- `not-ends-with` - Does not end with

`like` and `not-like` are other names for `=~` and `!~`. All four take a regular expression, not the `%` and `_` wildcards of SQL's `LIKE`. Both sides must be strings, so an `int`, a `glob` or `null` operand is a type error. A pattern that isn't a valid regular expression fails with `invalid_value` when the line runs. See [Regular Expressions](/book/regular_expressions.md) for the syntax.

```nu
"abc" like "a%"
# => false
"abc" like "a.c"
# => true
"foobar" =~ "foo(?=bar)"
# => true
```

`in` and `has` are the same test with the operands swapped. `$x in $list` is the same as `$list has $x`. The container can be a list, a string (substring test), a record (key test) or a range. `not-in` and `not-has` return the opposite.

A range contains a number only when the range would produce it, so the step counts. `1.5 in 1..2` is `false` because the range steps by 1, and `5 in 0..2..10` is `false` because that range holds only even numbers. The direction doesn't matter. Ints and floats with the same value match each other.

```nu
5 in 1..10
# => true
5 in 10..1
# => true
1.5 in 1..2
# => false
4 in 0..2..10
# => true
1 in [1.0]
# => true
1..10 has 5
# => true
null in [null]
# => true
```

The container side can't be `null`, so `1 in null` and `null has 1` are type errors. A list on the right of `has`, or on the left of `in`, is one element to look for, not a sublist. `[a b] has [a]` is a type error, while `[[a] b] has [a]` is `true`.

## Assignment Operators

These operators work on mutable variables (declared with `mut`):

- `=` - Assign
- `+=` - Add and assign
- `-=` - Subtract and assign
- `*=` - Multiply and assign
- `/=` - Divide and assign
- `++=` - Concatenate and assign

## Precedence

From highest to lowest: `**`; `*`, `/`, `//`, `mod`; `+`, `-`; `bit-shl`, `bit-shr`; the comparison operators, the operators in "Other operators" and `++`; `bit-and`; `bit-xor`; `bit-or`; `not`; `and`; `xor`; `or`; and finally the assignment operators.

`help operators` lists the same order as numbers. A higher number binds more tightly:

| Precedence | Operators                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------- |
| 100        | `**`                                                                                         |
| 95         | `*`, `/`, `//`, `mod`                                                                        |
| 90         | `+`, `-`                                                                                     |
| 85         | `bit-shl`, `bit-shr`                                                                         |
| 80         | `==`, `!=`, `<`, `<=`, `>`, `>=`, `older-than`, `newer-than`, `=~`, `like`, `!~`, `not-like`, `in`, `not-in`, `has`, `not-has`, `starts-with`, `not-starts-with`, `ends-with`, `not-ends-with`, `++` |
| 75         | `bit-and`                                                                                    |
| 70         | `bit-xor`                                                                                    |
| 60         | `bit-or`                                                                                     |
| 55         | `not`                                                                                        |
| 50         | `and`                                                                                        |
| 45         | `xor`                                                                                        |
| 40         | `or`                                                                                         |
| 10         | `=`, `+=`, `-=`, `*=`, `/=`, `++=`                                                           |

Operators with the same precedence group from left to right, so `10 - 2 + 3` is `(10 - 2) + 3`. The exception is `**`, which groups from right to left. Assignments can't be chained. `$a = $b = 3` is a type error, because an assignment returns nothing.

```nu
1 + 2 * 3
# => 7
10 - 2 + 3
# => 11
2 ** 3 ** 2
# => 512
```

## Brackets

### `[` and `]`
The brackets can be used to make [lists](types/basic_types/list.md).
```nu
[ 1, 2, 3 ]
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => ╰───┴───╯
```

### `{` and `}`
The braces can be used to make [records](types/basic_types/record.md) and [closures](types/basic_types/closure.md).
```nu
{ a: 1, b: 2 }
# => ╭───┬───╮
# => │ a │ 1 │
# => │ b │ 2 │
# => ╰───┴───╯
```

### `(` and `)`
The parentheses can be used to denote sub-expressions.
```nu
# This would fail without parentheses
{ a: ('aaa' | str length), b: 2 }
# => ╭───┬───╮
# => │ a │ 3 │
# => │ b │ 2 │
# => ╰───┴───╯
```

See [Subexpressions](/book/operators.md#subexpressions) in the Book for several pipelines in one subexpression, newlines inside the parentheses, and cell paths on the result. [Operators in command arguments](/book/operators.md#operators-in-command-arguments) explains when Nushell reads a pipeline element as an expression and when as a command call.
