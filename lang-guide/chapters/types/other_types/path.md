# Path

<!-- prettier-ignore -->
|     |     |
| --- | --- |
| **_Description:_**    | A string that will be expanded into a fully qualified pathname when passed to a command or closure
| **_Annotation:_**     | `path`                                                                                 
| **_Literal syntax:_** | None
| **_Casts:_**          | N/A (see below)

## Additional Language Notes

1. `path` is technically a "syntax shape" rather than a full "type".
   It is used for annotating strings that should be treated as a path to a filename or directory.
   `~` and `.` characters in the string will automatically be expanded treated as a `path`.

   Example:

   ```nu
   def show_difference [
    p: path
    s: string
   ] {
    print $"The path is expanded: ($p)"
    print $"The string is not: ($s)"
   }

   # Results
   cd ~/testing
   show_difference . .
   # => The path is expanded: /home/username/testing
   # => The string is not: .
   show_difference ~ ~
   # => The path is expanded: /home/username
   # => The string is not: ~

   # Multi-level directory traversal is also supported
   show_difference ... ...
   # => The path is expanded: /home/
   # => The string is not: ...
   ```

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
