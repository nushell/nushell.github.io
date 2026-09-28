# Path

<!-- prettier-ignore -->
|     |     |
| --- | --- |
| **_Description:_**    | A string that is treated as a filesystem path when passed to a custom command. `~` and multi-dot (`...`) shorthands are expanded.
| **_Annotation:_**     | `path`                                                                                 
| **_Literal syntax:_** | None
| **_Casts:_**          | N/A (see below)

## Additional Language Notes

1. `path` is technically a "syntax shape" rather than a full "type".
   It is used for annotating custom command parameters that should be treated as a path to a filename or directory.
   Inside the command, the value is a `string`.

   When a bare-word (unquoted) argument is passed to a `path` parameter:

   - A leading `~` is expanded to the home directory.
   - Multi-dot shorthands are expanded: `...` becomes `../..`, `....` becomes `../../..`, and so on.
   - `.` and `..` segments are resolved textually (`foo/../bar` becomes `bar`).
   - A relative path stays relative. It is **not** converted to an absolute path.

   Quoted strings and values passed in variables are not changed.

   Example:

   ```nu
   def show_difference [
    p: path
    s: string
   ] {
    print $"The path is: ($p)"
    print $"The string is: ($s)"
   }

   # Results
   show_difference ~ ~
   # => The path is: /home/username
   # => The string is: ~
   show_difference ... ...
   # => The path is: ../..
   # => The string is: ...
   show_difference foo/../bar foo/../bar
   # => The path is: bar
   # => The string is: foo/../bar
   show_difference . .
   # => The path is: .
   # => The string is: .
   ```

   Use `path expand` inside the command when you need an absolute path.

2. The built-in syntax highlighting also treats strings and
   paths differently. Notice when typing the commands in the
   above example that, depending on your color configuration,
   the first and second argument will have different colorization.

## Casts

There is no `into path` command, but several commands can be used to convert to and from a `path`:

- `path expand`
- `path join`
- `path parse`

## Common commands that can work with `path`

- `path (subcommands)`
  - See: `help path` for a full list
- Most filesystem commands (e.g., `ls`, `rm`)
  - See: `help commands | where category == filesystem`
