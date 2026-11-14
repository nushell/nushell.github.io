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

| Pattern                                              | Matches                                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| `3`, `'text'`, `true`, `null`, `1sec`, `5kb`         | A value equal to the literal. A bare word such as `foo` is a string.             |
| `1..10`, `5..`, `1..<5`, `1..3..9`                   | A number the range contains, which is its start plus whole steps up to its end   |
| `(40 + 2)`, `($some_const)`                          | The value of a parse-time constant expression                                    |
| `$name`                                              | Any value, and binds it to `$name` for the guard and the arm                     |
| `_`                                                  | Any value (catch-all)                                                            |
| `p1 \| p2`                                           | Either pattern. Variables of the other alternative are `null`                    |
| `[$a, $b]`, `[]`                                     | A list with exactly that many items                                              |
| `[$first, ..$rest]`, `[.., $last]`, `[$a, ..$m, $z]` | A list with at least the listed items; `..$rest` binds the items `..` stands for |
| `{name: $n, type: file}`                             | A record that has at least these fields, with matching values                    |
| `{$name}`                                            | Shorthand for `{name: $name}`                                                    |

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

   Ints and floats are the exception. They compare by numeric value, so the float `1.0` matches the pattern `1`:

   ```nu
   match 1.0 { 1 => 'int pattern', 1.0 => 'float pattern' }
   # => int pattern
   ```

   It works the other way around too, so `match 1 { 1.0 => ... }` takes that arm.

1. Durations, file sizes, dates and binary values can be literal patterns as well. They compare by value, not by how they are written, so `1000ms` matches `1sec`:

   ```nu
   [1000ms 5kb 2024-01-01 0x[ff]] | each {|v|
     match $v {
       1sec => 'one second'
       5000b => '5 kB'
       2024-01-01 => 'new year'
       0x[ff] => 'byte ff'
     }
   }
   # => ╭───┬────────────╮
   # => │ 0 │ one second │
   # => │ 1 │ 5 kB       │
   # => │ 2 │ new year   │
   # => │ 3 │ byte ff    │
   # => ╰───┴────────────╯
   ```

1. A range pattern matches the numbers the range would produce if you iterated over it, which are its start plus whole steps, up to its end. `1..3..9` stands for 1, 3, 5, 7 and 9, so it doesn't match `4`. The default step is 1, so a float matches `1..3` only when it is a whole number of steps from the start, as `2.0` is and `2.5` isn't. A range whose end is lower than its start counts down, so `5..1` contains `3`:

   ```nu
   [1 4 7 2.0 2.5] | each {|n| match $n { 1..3..9 => 'in 1..3..9', 1..3 => 'in 1..3', _ => 'no match' } }
   # => ╭───┬────────────╮
   # => │ 0 │ in 1..3..9 │
   # => │ 1 │ no match   │
   # => │ 2 │ in 1..3..9 │
   # => │ 3 │ in 1..3    │
   # => │ 4 │ no match   │
   # => ╰───┴────────────╯
   ```

   To test whether a number falls anywhere between two bounds, use a guard: `$n if $n >= 1 and $n <= 3`.

1. A list pattern without `..` must have exactly as many items as the list:

   ```nu
   match [1 2 3] { [$a, $b] => 'two items', [$a, $b, $c] => 'three items' }
   # => three items
   ```

   Using the same variable twice doesn't check that the items are equal. The variable is bound to each item in turn and keeps the rightmost one, so `[$a, $a]` matches any two-item list. Compare the items in a guard instead:

   ```nu
   match [1 2] { [$a, $a] => $"same: ($a)" }
   # => same: 2
   ```

   ```nu
   match [1 2] { [$a, $b] if $a == $b => 'same', _ => 'different' }
   # => different
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

1. `..` or `..$name` can stand anywhere in a list pattern, not only at the end. The items before it match the start of the list, the items after it match the end, and `..$name` binds whatever is left in between (an empty list when nothing is):

   ```nu
   match [1 2 3 4] { [$first, ..$middle, $last] => {first: $first, middle: $middle, last: $last} } | to nuon
   # => {first: 1, middle: [2, 3], last: 4}
   ```

   ```nu
   match [build test done] { [.., 'done'] => 'finished', _ => 'running' }
   # => finished
   ```

   A list pattern can hold only one `..`. A second one is a parse error, `` `..` can only be used once per list pattern``. Each nested list pattern gets its own, so `[[.., 2], ..]` is allowed.

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

   The guard has to evaluate to a `bool`. Any other value, such as `1` or a string, stops the `match` with a `nu::shell::match_guard_not_bool` error when that arm is tried:

   ```nu
   match 5 { $n if 1 => 'yes', _ => 'no' }
   # => Error: nu::shell::match_guard_not_bool
   # =>
   # =>   × Match guard not bool
   # =>    ╭─[repl_entry #1:1:17]
   # =>  1 │ match 5 { $n if 1 => 'yes', _ => 'no' }
   # =>    ·                 ┬
   # =>    ·                 ╰── not a boolean expression
   # =>    ╰────
   # =>   help: Match guards should evaluate to a boolean
   ```

1. In an or-pattern (`p1 | p2`), the first alternative that matches wins. A variable that appears only in the alternatives that didn't match is set to `null`:

   ```nu
   match [1] { [$a, $b] | [$a] => {a: $a, b: $b} } | to nuon
   # => {a: 1, b: null}
   ```

   A guard after an or-pattern applies to the whole pattern, whichever alternative matched. When it is `false`, `match` moves on to the next arm:

   ```nu
   match 1 { 1 | 2 if false => 'guarded', _ => 'fell through' }
   # => fell through
   ```

1. To match on pipeline input, pass `$in` as the value:

   ```nu
   {name: 'nu', version: 116} | match $in { {$name, $version} => $"($name) 0.($version)" }
   # => nu 0.116
   ```
