# Operators

## Arithmetic Operators

- `+` - Plus / Addition
- `-` - Minus / Subtraction
- `*` - Multiply
- `/` - Divide
- `==` - Equal
- `!=` - Not Equal
- `//` - Floor Division
- `<` - Less Than
- `>` - Greater Than
- `<=` - Less Than or Equal To
- `>=` - Greater Than or Equal To
- `mod` - Modulo
- `**` - Pow

## Bitwise Operators

Nushell provides support for these bitwise operators:

- `bit-or` - bitwise or
- `bit-xor` - bitwise exclusive or
- `bit-and` - bitwise and
- `bit-shl` - bitwise shift left
- `bit-shr` - bitwise shift right

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
- `and` - And
- `or` - Or

## Brackets

### `[` and `]`
The brackets can be used to make [lists](types/basic_types/list.md).
```nu
~> [ 1, 2, 3 ]
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
╰───┴───╯
```

### `{` and `}`
The braces can be used to make [records](types/basic_types/record.md) and [closures](types/basic_types/closure.md).
```nu
~> { a: 1, b: 2 }
╭───┬───╮
│ a │ 1 │
│ b │ 2 │
╰───┴───╯
```

### `(` and `)`
The parentheses can be used to denote sub-expressions.
```nu
~> # This would fail without parentheses
~> { a: ('aaa' | str length), b: 2 }
╭───┬───╮
│ a │ 3 │
│ b │ 2 │
╰───┴───╯
```
