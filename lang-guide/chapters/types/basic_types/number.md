# Number

|                       |                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------- |
| **_Description:_**    | When used in a type annotation or signature, matches either an `int` or a `float`. |
| **_Annotation:_**     | `number`                                                                           |
| **_Literal syntax:_** | N/A - Any [int](int.md) or [float](float.md) literal can be assigned to a `number` |
| **_Casts:_**          | N/A                                                                                |

## Additional Language Notes

1. `number` is a type for annotations, like [`any`](any.md). No single value has the type `number`. A value annotated as `number` keeps its own type, so `describe` reports `int` or `float`:

   ```nu
   def kind [x: number] { $x | describe }
   [(kind 1) (kind 1.5)] | to nuon
   # => [int, float]
   ```

   `describe` shows `number` only for a collection that mixes ints and floats:

   ```nu
   [1 2.5] | describe
   # => list<number>
   ```

2. Other types are rejected, including text that looks like a number and the number-like `filesize` and `duration` types. A literal is checked when the code is parsed:

   ```nu
   let n: number = "1"
   # => Error: nu::parser::type_mismatch
   # =>
   # =>   × Type mismatch.
   # =>    ╭─[repl_entry #1:1:17]
   # =>  1 │ let n: number = "1"
   # =>    ·                 ─┬─
   # =>    ·                  ╰── expected number, found string
   # =>    ╰────
   ```

   Convert text with [`into int`](/commands/docs/into_int.md) or [`into float`](/commands/docs/into_float.md) first.

3. A `mut` variable without an annotation keeps the type of its first value, so an int variable can't later hold a float. Annotate it as `number` to allow both:

   ```nu
   mut total: number = 0
   $total = $total + 2.5
   $total
   # => 2.5
   ```

   Without the annotation, `$total = 2.5` after `mut total = 0` fails with `nu::parser::operator_incompatible_types`.

4. `number` also works as an input or output type, and inside other types such as `list<number>`:

   ```nu
   def half []: number -> float { $in / 2 }
   [(4 | half) (1.5 | half)] | to nuon
   # => [2.0, 0.75]
   ```

   Many built-in commands use it this way. `help math abs`, for example, lists `number` and `list<number>` among its input types.

5. A `number` can be passed where an `int` or a `float` is expected. The parser lets it through, and the value is checked when the command runs. See [Which values a type accepts](../type_signatures.md#which-values-a-type-accepts).
