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

[Working with Paths](/book/working_with_paths.md) explains `path join`, `path parse`, and the other `path` subcommands, including which of them read the filesystem and which input forms each one accepts.

### Absolute paths with `path expand`

[`path expand`](/commands/docs/path_expand.md) turns a string, or a list of strings, into absolute paths. It expands a leading `~` to the home directory and multi-dot shorthands such as `...`, makes a relative path absolute against the current directory, and removes `.` and `..` segments.

When the path exists, `path expand` also resolves symbolic links, so the result is the real location. When it doesn't exist, the command still returns the expanded text, without an error. Two flags change this:

- `--no-symlink` (`-n`) skips the symlink resolution. `..` segments are then removed as text, so `link/..` becomes the directory holding `link`, not the parent of the link's target.
- `--strict` (`-s`) makes a path that doesn't exist an error ("Could not expand path"). With `--no-symlink` as well, the path must still exist, but the result keeps its links.

With `link` a symbolic link to the directory `real`, in `/home/you/proj`:

```nu
"link/f.txt" | path expand
# => /home/you/proj/real/f.txt
"link/f.txt" | path expand --no-symlink
# => /home/you/proj/link/f.txt
"nope/x" | path expand
# => /home/you/proj/nope/x
"nope/x" | path expand --strict
# => Error: nu::shell::error
# =>
# =>   × Could not expand path
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "nope/x" | path expand --strict
# =>    · ────┬───
# =>    ·     ╰── could not be expanded (path might not exist, non-final component is not a directory, or other cause)
# =>    ╰────
```

## Common commands that can work with `path`

- `path (subcommands)`
  - See: `help path` for a full list, and [Working with Paths](/book/working_with_paths.md) for how they behave
- Most filesystem commands (e.g., `ls`, `rm`)
  - See: `help commands | where category == filesystem`
