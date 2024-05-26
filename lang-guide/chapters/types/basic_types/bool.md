# Bool

What it is: A logical data type that can have only `true` or `false` values.

Annotation: `bool`

## Literals

- `true`
- `false`

## Example 1

```nu
> if true { print hello }
# => hello
```

## Example 2

```nu
let truth: bool  = true
> echo $truth
# => true
```

## Casts

The command `into bool` can convert other data types into bool.
For a complete list see: `help into bool`.

## Subset of commands that use bool

- `if`, `while`
- `match`
  - in clauses where the expression matches the clause expression, or the `_` value which is always true
- `any`, `all`, `skip until`, `skip while`, `take until`, `take while`
  - when the closure returns bool value
- `where`
- `filter`
  - when closure returns the bool value of true or false
- `is-empty`, `is-not-empty`
- `is-admin`
- `is-terminal`

## Operators that use bool

- `==`, `!=`, `<`, `<=`, `>`, `>=`
- `and`, `or`, `not`
- `in`
- `=~`, `!~` `<regex>`
- `ends-with`, `starts-with`
  - String comparison operators
