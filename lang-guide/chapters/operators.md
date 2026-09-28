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

## Comparison Operators

- `==` - Equal
- `!=` - Not Equal
- `<` - Less Than
- `>` - Greater Than
- `<=` - Less Than or Equal To
- `>=` - Greater Than or Equal To

## Bitwise Operators

Nushell provides support for these bitwise operators:

- `bit-or` - bitwise or
- `bit-xor` - bitwise exclusive or
- `bit-and` - bitwise and
- `bit-shl` - bitwise shift left
- `bit-shr` - bitwise shift right

## Boolean Operators

- `and` - And (short-circuiting)
- `or` - Or (short-circuiting)
- `xor` - Exclusive or
- `not` - Negates the expression that follows it

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

```nu
1 + 2 * 3
# => 7
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
