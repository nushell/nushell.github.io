# Glob

<!-- prettier-ignore -->
|     |     |
| --- | --- |
| **_Description:_**    | A *pattern* that matches pathnames in a filesystem
| **_Annotation:_**     | `glob`                                                                                 
| **_Literal syntax:_** | None
| **_Casts:_**          | [`into glob`](/commands/docs/into_glob.md)
| **_See Also:_**       | [Moving around the system - Glob patterns](/book/moving_around.md#glob-patterns-wildcards) in the Book

## Additional Language Notes

1. A `glob` is similar to a string, but it is expanded to match files using a pattern.

1. Globs are implemented using the [nu_glob](https://docs.rs/nu-glob/latest/nu_glob/index.html) crate. The [possible glob patterns](https://docs.rs/nu-glob/latest/nu_glob/struct.Pattern.html) are documented there.

1. When a command accepts a glob pattern directly:

   - It will interpret a bare-word (or backtick-quoted) string as a glob. This means:
     ```nu
     open *.txt    # opens all files which ends with `.txt`
     open `*.txt`  # it's backtick quoted, it's a bare word, so nu opens all files which ends with `.txt`
     ```
   - It will interpret other string types as a string literal. This means:

     ```nu
     open "*.txt"  # it's quoted, opens a file named `*.txt`
     open '*.txt'  # it's quoted, opens a file named `*.txt`
     ```

1. There is no literal syntax for a glob. As seen above, it is usually created as a string and then interpreted by the calling command as a glob.

   Example

   <!-- TODO: Update example to use touch once it accepts glob properly -->
   <!-- touch can show the differences more tangibly -->

   ```nu
   let s = "a*c.txt"         # a string type.
   open $s                   # opens a file literally named `a*c.txt`

   let g: glob = "a*c.txt"   # a glob type.
   open $g                   # opens files matching the glob pattern, e.g: `abc.txt`, `aac.txt`
   ```

1. These expansions also take place with custom commands:

   ```nu
   # open files which match a given glob pattern
   def open-files [g: glob] {
     open $g
     # In case if you want to open one file only
     # open ($g | into string)
   }

   # open one file
   def open-one-file [g: string] {
     open $g
     # In case if you want to open with glob pattern
     # open ($g | into glob)
   }

   # open one file
   def open-one-file2 [g] {
     open $g
   }
   ```

1. Glob expansion also takes place with external commands:

   ```nu
   # Concatenate files using cat and then split to a list of lines
   ^cat *.txt | lines
   ```

1. As with most other types, globs can be saved in a variable, passed to custom commands and returned from custom commands.

1. You can use `into glob` and `into string` to convert values between `glob` and `string`.

   ```nu
   let glob1: glob = "*"
   let glob2 = ("*" | into glob)

   # Both result in the same glob pattern
   $glob1 == $glob2
   # => true
   ```

1. Globs can also represent directory trees recursively using the `**` pattern.

   For example, in Unix-like systems you might use a combination of the `find` and `xargs` commands to operate on directory trees:

   ```bash
   find -iname *.txt | xargs -I {} echo {} | tr "[:lower:]" "[:upper:]"
   ```

   In Nushell, it is more idiomatic to use this pattern:

   ```nu
   # Nostalgic for the Good Ole DOS days?
   ls **/*.txt | get name | str upcase
   ```

## The `glob` command

The [`glob` **command**](/commands/docs/glob.md) provides additional globbing options. It is distinct from the `glob` **type**.

Simple example:

```nu
glob *.nu
# => [ /home/you/dev/foo.nu /home/you/dev/bar.nu ]
```

Notice the glob, after expansion, always returns a `list` of fully qualified pathnames.

### Additional `glob` command options

For example, it can ignore directories using the `-D` flag:

```nu
glob -D * | path basename | str join ' '
foo.nu bar.nu
# => foo.nu bar.nu baz.nu
```

## Common commands that can work with `glob`

- `cp`
- `du`
- `ls`
- `glob`
- `mv`
- `rm`
