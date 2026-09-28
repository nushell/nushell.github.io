# Nothing

|                       |                                                                             |
| --------------------- | --------------------------------------------------------------------------- |
| **_Description:_**    | The `nothing` type is to be used to represent the absence of another value. |
| **_Annotation:_**     | `nothing`                                                                   |
| **_Literal Syntax:_** | `null`                                                                      |
| **_Casts:_**          | `ignore`                                                                    |
| **_See also:_**       | [Types of Data - Nothing](/book/types_of_data.md#nothing-null)              |

## Additional Language Notes

1. Recommended for use as a missing value indicator.
1. Commands that explicitly do not return a value (such as `print` or a `for` loop) return `null`. An `if` without an `else` also returns `null` when its condition is false.
1. Commands that do not accept pipeline input have an input signature of `nothing`.

1. `null` is similar to JSON's "null". However, whenever Nushell would print the `null` value (outside of a string or data structure), it prints nothing instead.

   Example:

   ```nu
   null | to json
   # => null
   "null" | from json   # prints nothing
   "null" | from json | describe
   # => nothing
   ```

1. You can add `ignore` at the end of a pipeline to convert any pipeline result to a `nothing`. This will prevent the command/pipeline's output from being displayed.

   ```nu
   git checkout featurebranch | ignore
   ```

   By default, `ignore` discards only the standard output. An external command's stderr, such as git's `Switched to branch 'featurebranch'` message, is still shown. Use `ignore --stdout --stderr` to discard both.

1. It's important to understand that `null` is not the same as the absence of a value! It is possible for a table or list to have _missing_ values. Missing values are displayed with a ❎ character in interactive output.

   ```nu
   let missing_value = [{a:1 b:2} {b:1}]
   $missing_value
   # => ╭───┬────┬───╮
   # => │ # │ a  │ b │
   # => ├───┼────┼───┤
   # => │ 0 │  1 │ 2 │
   # => │ 1 │ ❎ │ 1 │
   # => ╰───┴────┴───╯
   ```

1. By default, attempting to access a missing value will not produce `null` but will instead generate an error:

   ```nu
   let missing_value = [{a:1 b:2} {b:1}]
   $missing_value.1.a
   # => Error: nu::shell::column_not_found
   # =>
   # =>   × Cannot find column 'a'
   # =>    ╭─[repl_entry #1:1:32]
   # =>  1 │ let missing_value = [{a:1 b:2} {b:1}]
   # =>    ·                                ──┬──
   # =>    ·                                  ╰── value originates here
   # =>  2 │ $missing_value.1.a
   # =>    ·                  ┬
   # =>    ·                  ╰── column 'a' is missing in one or more values
   # =>    ╰────
   # =>   help: If some rows have this column, try using 'a?' for optional access, or pre-fill using the `default` command
   ```

1. To safely access a value that may be missing, mark the cell-path member as _optional_ using a question-mark (`?`) after the key name.
   See [Navigating and Accessing Structured Data - Handling Missing Data](/book/navigating_structured_data.html#handling-missing-data) for more details and examples.

   ```nu
   let missing_value = [{a:1 b:2} {b:1}]
   $missing_value.1.a? | describe
   # => nothing
   ```

## Related commands

- [`default`](/commands/docs/default.html): Set a default value for missing (`null`) fields in a record or table
- [`compact`](/commands/docs/compact.html): Removes `null` values from a list
