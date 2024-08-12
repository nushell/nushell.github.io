# Boolean

- **_Description:_** True or False value
- **_Annotation:_** `bool`
- **_Literal syntax:_** Either a literal `true` or `false`
- **_Casts:_** [`into bool`](/commands/docs/into_bool.md)
- **_See also:_** [Language Reference](/lang-guide/chapters/types/basic_types/bool.md)

What it is: A logical data type that can have only `true` or `false` values.

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

## Common commands that use bool

- `if`, `while`
- `match` (in clauses where the expression matches the clause expression, or the `_` value which is always true)

- `is-empty`, `is-not-empty`
- `is-admin`
- `is-terminal`

The following commands take a closure as their main argument. The return value from the closure must be a boolean:

- `where`/`filter`
- `any`, `all`, `skip until`, `skip while`, `take until`, `take while`

## Operators that use bool

- `==`, `!=`, `<`, `<=`, `>`, `>=`
- `and`, `or`, `not`
- `in`
- Regex comparison operators: `=~`, `!~` `<regex>`
- String comparison operators: `ends-with`, `starts-with`
