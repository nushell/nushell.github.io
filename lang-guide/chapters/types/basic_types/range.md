# Range

|                       |                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **_Description:_**    | Describes a range of values from a starting value to an ending value, with an optional stride. |
| **_Annotation:_**     | `range`                                                                                        |
| **_Literal Syntax:_** | `<start_value>..<end_value> or `<start_value>..<second_value>..<end_value>. E.g., `1..10`.     |
| **_See also:_**       | [Types of Data](/book/types_of_data.md#ranges)                                                 |
| **_Casts:_**          | [`seq`](/commands/docs/seq.md)                                                                 |

Ranges are inclusive by default.

Examples:

- Values from 1 to 10 inclusive:

  ```nu
  > 1..5
  ╭───┬────╮
  │ 0 │  1 │
  │ 1 │  2 │
  │ 2 │  3 │
  │ 3 │  4 │
  │ 4 │  5 │
  ╰───┴────╯
  ```

- Values from 1 to 10, striding with 2 (only odds):

  ```nu
  > 1..3..10
  ╭───┬───╮
  │ 0 │ 1 │
  │ 1 │ 3 │
  │ 2 │ 5 │
  │ 3 │ 7 │
  │ 4 │ 9 │
  ╰───┴───╯
  ```

  ::: tip
  In many programming languages, the _step_ (or interval) is specified. Nushell's range is inspired by more functional languages, where the second value is literally the second value that should be generated. The step is then automatically calculated as the distance between the first and second values.
  :::

- You can also use `..<` to have values up to, but not including, the range end.

  Values from 1 to 5 (exclusive):

  ```nu
  > 1..<5
  ╭───┬───╮
  │ 0 │ 1 │
  │ 1 │ 2 │
  │ 2 │ 3 │
  │ 3 │ 4 │
  ╰───┴───╯
  ```

- Range values can be floats:

  ```nu
  (1.0)..(1.2)..(2.2)
  ╭───┬──────╮
  │ 0 │ 1.00 │
  │ 1 │ 1.20 │
  │ 2 │ 1.40 │
  │ 3 │ 1.60 │
  │ 4 │ 1.80 │
  │ 5 │ 2.00 │
  │ 6 │ 2.20 │
  ╰───┴──────╯
  ```

  Parentheses (subexpressions) are not required in this example; they are simply used for readability.

- Ranges can also work backward:

  ```nu
  > 5..1
  ╭───┬───╮
  │ 0 │ 5 │
  │ 1 │ 4 │
  │ 2 │ 3 │
  │ 3 │ 2 │
  │ 4 │ 1 │
  ╰───┴───╯
  ```

- The start value is optional. The default start value is `0`.

  ```nu
  > (..5) == (0..5)
  true
  ```

- The end value is also optional. The default end value is infinite:

  ```nu
  > 1..
  # => infinite range starting at 1
  ```

  Interrupt the generation of the above range using <kbd>Ctrl</kbd>+<kbd>C</kbd>.

- Ranges are lazy, meaning they do not generate their values until needed. You can use a range with no specified end point and combine it with a command that takes only the first n elements. For example, you could generate the numbers from 1 to 10 using:

  ```nu
  > 1.. | take 5
  ╭───┬───╮
  │ 0 │ 1 │
  │ 1 │ 2 │
  │ 2 │ 3 │
  │ 3 │ 4 │
  │ 4 │ 5 │
  ╰───┴───╯
  ```

## Conversions

Ranges may be converted to `list<int>` using:

```nu
1..5 | each {||}
```
