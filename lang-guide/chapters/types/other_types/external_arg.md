# External argument

<!-- prettier-ignore -->
|     |     |
| --- | --- |
| **_Description:_**    | A parameter that reads its argument the way an external command's argument is read
| **_Annotation:_**     | `external_arg`
| **_Literal syntax:_** | None
| **_Casts:_**          | N/A
| **_See also:_**       | [Custom Commands - Parameter types](/book/custom_commands.md#parameter-types) in the Book

## Additional Language Notes

1. Like [`path`](path.md), `external_arg` is a "syntax shape" rather than a full type. It is meant for custom command parameters, where it changes how the argument is parsed:

   - A bare word keeps the exact text you typed. `0001`, `5` and `true` aren't turned into an int or a bool. The value is a `glob` holding that text, so when you pass it on to an external command, a pattern such as `*.md` or a leading `~` is expanded there.
   - A quoted string stays a `string`, and isn't expanded.
   - A variable, subexpression or list literal keeps its own value and type.

   ```nu
   def show [x: external_arg] { [$x ($x | describe)] | to nuon }
   show 0001
   # => ["0001", glob]
   show "a b"
   # => ["a b", string]
   show (1 + 1)
   # => [2, int]
   ```

   An untyped parameter parses the same bare word as a number, so `show-any 0001` with `def show-any [x] { ... }` receives the int `1`.

2. It is mainly useful for commands that hand their arguments to an external program, such as the `main` command of a [script](/book/scripts.md) called from another shell, or a wrapper with a rest parameter. In a directory that holds `README.md`:

   ```nu
   def run-echo [...args: external_arg] { ^echo ...$args }
   run-echo 0001 *.md "*.md"
   # => 0001 README.md *.md
   ```

   Here the bare `*.md` matched `README.md`, while the quoted `"*.md"` was passed as written. The untyped rest parameter of a `def --wrapped` command uses this shape too (see [Rest Parameters with Wrapped External Commands](/book/custom_commands.md#rest-parameters-with-wrapped-external-commands)).

3. On a variable, `external_arg` doesn't change how the value is parsed. It accepts any value, as [`any`](../basic_types/any.md) does, so a variable annotated this way behaves like an unannotated one:

   ```nu
   let e: external_arg = 0001
   $e | describe
   # => int
   ```
