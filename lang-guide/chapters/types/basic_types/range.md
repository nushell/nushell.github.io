# Range

|                       |                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **_Description:_**    | Describes a range of values from a starting value to an ending value, with an optional stride. |
| **_Annotation:_**     | `range`                                                                                        |
| **_Literal Syntax:_** | `<start_value>..<end_value>` or `<start_value>..<second_value>..<end_value>`. E.g., `1..10`.   |
| **_Casts:_**          | [`seq`](/commands/docs/seq.md)                                                                 |
| **_See also:_**       | [Types of Data - Ranges](/book/types_of_data.md#ranges)                                        |

## Additional Language Notes

1. Ranges are inclusive by default.

   Examples:

   - Values from 1 to 5 inclusive:

   ```nu
   1..5
   # => ╭───┬───╮
   # => │ 0 │ 1 │
   # => │ 1 │ 2 │
   # => │ 2 │ 3 │
   # => │ 3 │ 4 │
   # => │ 4 │ 5 │
   # => ╰───┴───╯
   ```

   `..=` spells the inclusive form out, as Rust does. `1..=5` is the same range as `1..5`. The `=` goes only on the last `..`, so `1..3..=9` and `..=3` are ranges, but `1..=3..9` is not. Nushell reads that word as the name of an external command.

   ```nu
   (1..=5) == (1..5)
   # => true
   1..3..=9 | each {} | to nuon
   # => [1, 3, 5, 7, 9]
   ```

1. In many programming languages, the _step_ (or interval) is specified. Nushell's range is inspired by more functional languages, where the second value is literally the second value that should be generated. The step is then automatically calculated as the distance between the first and second values.

   Example - Values from 1 to 10, striding with 2 (only odds):

   ```nu
   1..3..10
   # => ╭───┬───╮
   # => │ 0 │ 1 │
   # => │ 1 │ 3 │
   # => │ 2 │ 5 │
   # => │ 3 │ 7 │
   # => │ 4 │ 9 │
   # => ╰───┴───╯
   ```

1. Exclusive range - You can also use `..<` to have values up to, but not including, the range end.

   Values from 1 to 5 (exclusive):

   ```nu
   1..<5
   # => ╭───┬───╮
   # => │ 0 │ 1 │
   # => │ 1 │ 2 │
   # => │ 2 │ 3 │
   # => │ 3 │ 4 │
   # => ╰───┴───╯
   ```

1. Range values can be floats:

   ```nu
   (1.0)..(1.2)..(2.2)
   # => ╭───┬──────╮
   # => │ 0 │ 1.00 │
   # => │ 1 │ 1.20 │
   # => │ 2 │ 1.40 │
   # => │ 3 │ 1.60 │
   # => │ 4 │ 1.80 │
   # => │ 5 │ 2.00 │
   # => │ 6 │ 2.20 │
   # => ╰───┴──────╯
   ```

   Note: Parentheses (subexpressions) are not required in this example; they are simply used for readability.

   If any of the values is a float, the whole range is a float range. `1..2.5` starts at `1.0`:

   ```nu
   1..2.5 | each {} | to nuon
   # => [1.0, 2.0]
   ```

1. The start, second and end values must be numbers. A range of strings or dates is a parse error:

   ```nu
   ("a")..("z")
   # => Error: nu::parser::operator_unsupported_type
   # =>
   # =>   × The '..' operator does not work on values of type 'string'.
   # =>    ╭─[repl_entry #1:1:1]
   # =>  1 │ ("a")..("z")
   # =>    · ──┬───┬
   # =>    ·   │   ╰── does not support 'string'
   # =>    ·   ╰── string
   # =>    ╰────
   ```

   Without the parentheses, `'a'..'z'` isn't a range at all. A quoted word runs to its last quote, so it is the single string `a'..'z` (see [Quotes inside a quoted word](/book/working_with_strings.md#quotes-inside-a-quoted-word)). For a sequence of letters, use [`seq char`](/commands/docs/seq_char.md), and for dates use [`seq date`](/commands/docs/seq_date.md).

1. When no second value is given, the step is `1` (or `-1` when counting down). The exception is a float range whose start and end are less than `1` apart. Its step is based on the order of magnitude of the difference:

   ```nu
   0.1..0.3
   # => ╭───┬──────╮
   # => │ 0 │ 0.10 │
   # => │ 1 │ 0.20 │
   # => │ 2 │ 0.30 │
   # => ╰───┴──────╯
   ```

1. Ranges can also work backward:

   ```nu
   5..1
   # => ╭───┬───╮
   # => │ 0 │ 5 │
   # => │ 1 │ 4 │
   # => │ 2 │ 3 │
   # => │ 3 │ 2 │
   # => │ 4 │ 1 │
   # => ╰───┴───╯
   ```

1. The start value is optional. The default start value is `0`.

   ```nu
   (..5) == (0..5)
   # => true
   ```

1. The end value is also optional. The default end value is infinite, so `1..` is an infinite range starting at 1:

   ```nu
   1.. | describe
   # => range
   ```

   Note: If you enter `1..` by itself at the prompt, Nushell starts listing its values. Interrupt the generation using <kbd>Ctrl</kbd>+<kbd>C</kbd>.

1. Ranges are lazy, meaning they do not generate their values until needed. You can use a range with no specified end point and combine it with a command that takes only the first n elements. For example, you could generate the numbers from 1 to 5 using:

   ```nu
   1.. | take 5
   # => ╭───┬───╮
   # => │ 0 │ 1 │
   # => │ 1 │ 2 │
   # => │ 2 │ 3 │
   # => │ 3 │ 4 │
   # => │ 4 │ 5 │
   # => ╰───┴───╯
   ```

1. Conversion - A range may be converted to a `list` using:

   ```nu
   1..5 | each {||} | describe
   # => list<int> (stream)
   ```

   A range stays a `range` when it is assigned to a variable or passed through `collect`. Most filter commands, such as `each`, `take` and `append`, produce a list from it.

## Range errors

Some ranges parse but can't produce any values. Nushell reports them when the range is evaluated, not when it is parsed, so a bad range inside an `if` branch that never runs causes no error. Each one fails with the same error, which underlines either the value at fault or the whole range:

```nu
1..1..5
# => Error: nu::shell::range_to_countable
# =>
# =>   × Can't convert range to countable values
# =>    ╭─[repl_entry #1:1:4]
# =>  1 │ 1..1..5
# =>    ·    ┬
# =>    ·    ╰── can't convert to countable values
# =>    ╰────
```

These ranges fail:

- The second value equals the start, as in `1..1..5`. The step would be zero.
- The second value is on the other side of the start from the end, as in `1..2..-5` or `5..1..10`. Counting would never reach the end.
- A float range has equal start and end and no second value, as in `1.0..1.0` or `1..1.0`. An int range with equal bounds is fine: `1..1` yields `[1]`.
- A float range starts at `inf`, `-inf` or `NaN` (`inf..5`), has a second value that isn't finite (`1..inf..5`), or ends at `NaN` (`1..2..NaN`). An end of `inf` is allowed and makes an endless range, like `1..`.
