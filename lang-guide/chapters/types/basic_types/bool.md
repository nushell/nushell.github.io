# Boolean

|                       |                                                             |
| --------------------- | ----------------------------------------------------------- |
| **_Description:_**    | A logical data type that can have only True or False values |
| **_Annotation:_**     | `bool`                                                      |
| **_Literal syntax:_** | Either a literal `true` or `false`                          |
| **_Casts:_**          | [`into bool`](/commands/docs/into_bool.md)                  |
| **_See also:_**       | [Types of Data - Booleans](/book/types_of_data.md#booleans) |

## Common commands that can be used with `bool`

- `if`, `while`
- `match` (in clauses where the expression matches the clause expression, or the `_` value which is always true)

- `is-empty`, `is-not-empty`
- `is-admin`
- `is-terminal`

The following commands take a closure (or a row condition) as their main argument. The return value from the closure must be a boolean:

- `where`
- `any`, `all`, `skip until`, `skip while`, `take until`, `take while`

## Common operators that can be used with `bool`

- `==`, `!=`, `<`, `<=`, `>`, `>=`
- `and`, `or`, `xor`, `not`
- `in`
- Regex comparison operators: `=~`, `!~` `<regex>`
- String comparison operators: `ends-with`, `starts-with`

## Short-circuit evaluation

`and` and `or` short-circuit: the right-hand operand is only evaluated when the left-hand operand doesn't already decide the result. With `and`, the right-hand side is skipped when the left-hand side is `false`; with `or`, it is skipped when the left-hand side is `true`.

```nu
def check [] { print "check was called"; true }

false and (check)
# => false

true or (check)
# => true

true and (check)
# => check was called
# => true
```

This means a condition can guard an expression that would otherwise fail:

```nu
let text = ""
($text != "") and (($text | split chars | last) == "%")
# => false
```
