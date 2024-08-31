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
1. Commands that explicitly do not return a value (such as `print` or `if`) return `null`.
1. Commands that do not accept pipeline input have an input signature of `nothing`.

1. `null` is similar to JSON's "null". However, whenever Nushell would print the `null` value (outside of a string or data structure), it prints nothing instead.

   Example:

   ```nu
   > null | to json
   null
   > "null" | from json
   # => no output
   ```

1. You can add `ignore` at the end of a pipeline to convert any pipeline result to a `nothing`. This will prevent the command/pipeline's output from being displayed.

   ```nu
   git checkout featurebranch | ignore
   ```

1. It's important to understand that `null` is not the same as the absence of a value! It is possible for a table or list to have _missing_ values. Missing values are displayed with a ❎ character in interactive output.

   ```nu
   > let missing_value = [{a:1 b:2} {b:1}]
   > $missing_value
   ╭───┬────┬───╮
   │ # │ a  │ b │
   ├───┼────┼───┤
   │ 0 │  1 │ 2 │
   │ 1 │ ❎ │ 1 │
   ╰───┴────┴───╯
   ```

1. By default, attempting to access a missing value will not produce `null` but will instead generate an error:

   ```nu
   > let missing_value = [{a:1 b:2} {b:1}]
   > $missing_value.1.a
   Error: nu::shell::column_not_found

     × Cannot find column 'a'
     ╭─[entry #4:1:32]
   1 │ let missing_value = [{a:1 b:2} {b:1}]
     ·                                ──┬──
     ·                                  ╰── value originates here
     ╰────
     ╭─[entry #6:1:18]
   1 │ $missing_value.1.a
     ·                  ┬
     ·                  ╰── cannot find column 'a'
     ╰────
   ```

1. To safely access a value that may be missing, mark the cell-path member as _optional_ using a question-mark (`?`) after the key name.
   See [Navigating and Accessing Structured Data - Handling Missing Data](/book/navigating_structured_data.html#handling-missing-data) for more details and examples.

## Related commands

- [`default`](/commands/docs/default.html): Set a default value for missing (`null`) fields in a record or table
- [`compact`](/commands/docs/compact.html): Removes `null` values from a list
