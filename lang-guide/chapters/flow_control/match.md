# `match`

`match` compares a value against a list of patterns, top to bottom, and evaluates the arm of the first pattern that matches. Like `if`, it is an expression: its result is the value of the chosen arm, so it can be assigned or piped.

```text
match <value> {
  <pattern> => <expression>
  <pattern> if <condition> => <expression>
  ...
}
```

See also: [`match` command help](/commands/docs/match.md) and [Control Flow - `match`](/book/control_flow.md#match) in the Book.

```nu
[1 5 12 -3] | each {|n|
  match $n {
    1 | 2 | 3 => 'small'
    4..10 => 'medium'
    $x if $x < 0 => 'negative'
    _ => 'large'
  }
}
# => ╭───┬──────────╮
# => │ 0 │ small    │
# => │ 1 │ medium   │
# => │ 2 │ large    │
# => │ 3 │ negative │
# => ╰───┴──────────╯
```

## Patterns

| Pattern                        | Matches                                                                   |
| ------------------------------ | ------------------------------------------------------------------------- |
| `3`, `'text'`, `true`, `null`  | A value equal to the literal. A bare word such as `foo` is a string.      |
| `1..10`, `5..`, `1..<5`        | A number inside the range                                                 |
| `(40 + 2)`, `($some_const)`    | The value of a parse-time constant expression                             |
| `$name`                        | Any value, and binds it to `$name` for the guard and the arm              |
| `_`                            | Any value (catch-all)                                                     |
| `p1 \| p2`                     | Either pattern                                                            |
| `[$a, $b]`, `[]`               | A list with exactly that many items                                       |
| `[$first, ..$rest]`, `[$a, ..]` | A list with at least the listed items; `..$rest` binds the remainder      |
| `{name: $n, type: file}`       | A record that has at least these fields, with matching values             |
| `{$name}`                      | Shorthand for `{name: $name}`                                             |

List and record patterns can be nested, and a pattern can be followed by an `if` guard.

## Language Notes

1. Arms are separated by commas or newlines. An arm's result is a single expression. Use a block (`{ ... }`) for several statements:

   ```nu
   match 3 {
     1 => 'one'
     2 => 'two'
     $n => {
       let doubled = $n * 2
       $"($n) doubled is ($doubled)"
     }
   }
   # => 3 doubled is 6
   ```

1. If no arm matches, `match` evaluates to `nothing`. End with `_ => ...` when every value must be handled.

   ```nu
   match 42 { 1 => 'one' } | describe
   # => nothing
   ```

1. A `$name` pattern always _binds_ a new variable. It never compares against an existing variable of the same name. The following matches `5`, not `1`:

   ```nu
   let expected = 1
   match 5 { $expected => $"matched ($expected)" }
   # => matched 5
   ```

   To compare against a runtime value, use a guard. To compare against a [`const`](../declarations.md), wrap it in parentheses:

   ```nu
   let expected = 1
   match 5 { $n if $n == $expected => 'expected', $n => $"unexpected ($n)" }
   # => unexpected 5
   ```

   ```nu
   const expected = 5
   match 5 { ($expected) => 'expected', _ => 'unexpected' }
   # => expected
   ```

1. Values are compared by type as well as value, so the string `"3"` does not match the integer `3`:

   ```nu
   match "3" { 3 => 'int', "3" => 'string' }
   # => string
   ```

1. A list pattern without `..` must have exactly as many items as the list:

   ```nu
   match [1 2 3] { [$a, $b] => 'two items', [$a, $b, $c] => 'three items' }
   # => three items
   ```

   ```nu
   match [1 2 3 4] { [$first, ..$rest] => {first: $first, rest: $rest} }
   # => ╭───────┬───────────╮
   # => │ first │ 1         │
   # => │       │ ╭───┬───╮ │
   # => │ rest  │ │ 0 │ 2 │ │
   # => │       │ │ 1 │ 3 │ │
   # => │       │ │ 2 │ 4 │ │
   # => │       │ ╰───┴───╯ │
   # => ╰───────┴───────────╯
   ```

1. A record pattern ignores extra fields, but every field it names must be present. Literal field values let you dispatch on a "tag" field:

   ```nu
   let events = [
     {type: click, x: 10, y: 20}
     {type: key, key: 'q'}
     {type: resize}
   ]
   $events | each {|e|
     match $e {
       {type: click, x: $x, y: $y} => $"click at ($x),($y)"
       {type: key, key: 'q'} => 'quit'
       {type: $t} => $"unhandled ($t)"
     }
   }
   # => ╭───┬──────────────────╮
   # => │ 0 │ click at 10,20   │
   # => │ 1 │ quit             │
   # => │ 2 │ unhandled resize │
   # => ╰───┴──────────────────╯
   ```

1. A guard is checked only after its pattern matches, and it can use the variables the pattern bound. If the guard is `false`, matching continues with the next arm:

   ```nu
   match [1, 2] { [$a, $b] if $a > $b => 'descending', [$a, $b] => 'ascending' }
   # => ascending
   ```

1. To match on pipeline input, pass `$in` as the value:

   ```nu
   {name: 'nu', version: 116} | match $in { {$name, $version} => $"($name) 0.($version)" }
   # => nu 0.116
   ```
