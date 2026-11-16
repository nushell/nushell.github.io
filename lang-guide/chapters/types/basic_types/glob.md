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

   - It will interpret an interpolated string as a glob when the string has at least one `( )` part. This holds for `$"..."`, `$'...'` and [bare-word interpolation](/book/working_with_strings.md#interpolation-in-bare-words). An interpolated string with nothing to interpolate is a plain string:

     ```nu
     let prefix = "a"
     ls $"($prefix)*.txt"   # lists the files that start with `a` and end in `.txt`
     ls ($prefix)*.txt      # the same
     ls $"a*.txt"           # no `( )`, so it looks for a file named `a*.txt`
     ```

     The glob comes from writing the interpolation as the argument. If you store it in a variable first, the variable holds a string, so use `into glob` or a `glob` annotation.

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

   For an interpolated argument, only a bare word that doesn't start with `(` is expanded. `^echo *($prefix)*` passes the matching file names, while `^echo $"*($prefix)*"` and `^echo ($prefix)*` pass the text as written.

   The quoting rules are the same as for internal commands. Bare words and backtick-quoted words are expanded. Single- and double-quoted strings are not, and neither is a string stored in a variable. A `glob` value is always expanded, so annotate the variable or use `into glob` to expand a pattern you built. A pattern that matches nothing is passed on unchanged, as Bash does by default, while `ls` and the other file commands report an error for it. In a directory holding `a.txt` and `b.txt`:

   ```nu
   ^echo *.txt
   # => a.txt b.txt
   ^echo "*.txt"
   # => *.txt
   let s = "*.txt"; ^echo $s
   # => *.txt
   let g: glob = "*.txt"; ^echo $g
   # => a.txt b.txt
   ^echo *.zip
   # => *.zip
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

   Only the string-to-glob direction happens on its own. A string is accepted where a `glob` is expected, as with `$glob1` above, but a glob is rejected where a `string` is expected:

   ```nu
   let x: string = ("*" | into glob)
   # => Error: nu::parser::type_mismatch
   # =>
   # =>   × Type mismatch.
   # =>    ╭─[repl_entry #1:1:17]
   # =>  1 │ let x: string = ("*" | into glob)
   # =>    ·                 ────────┬────────
   # =>    ·                         ╰── expected string, found glob
   # =>    ╰────
   ```

   The same error comes from passing a glob to a `string` parameter. Convert it with `into string` first. See [Which values a type accepts](../type_signatures.md#which-values-a-type-accepts).

1. Globs can also represent directory trees recursively using the `**` pattern.

   For example, in Unix-like systems you might use a combination of the `find` and `xargs` commands to operate on directory trees:

   ```bash
   find -iname *.txt | xargs -I {} echo {} | tr "[:lower:]" "[:upper:]"
   ```

   In Nushell, it is more idiomatic to use this pattern:

   ```nu
   # Nostalgic for the Good Ole DOS days?
   ls **/*.txt | get name | str uppercase
   ```

## The `glob` command

The [`glob` **command**](/commands/docs/glob.md) provides additional globbing options. It is distinct from the `glob` **type**.

Simple example:

```nu
glob *.nu
# => ╭───┬──────────────────────╮
# => │ 0 │ /home/you/dev/baz.nu │
# => │ 1 │ /home/you/dev/bar.nu │
# => │ 2 │ /home/you/dev/foo.nu │
# => ╰───┴──────────────────────╯
```

Notice the glob, after expansion, always returns a `list` of fully qualified pathnames.

### Additional `glob` command options

For example, it can ignore directories using the `-D` flag. Here `build` is a directory:

```nu
glob b* | path basename | sort
# => ╭───┬────────╮
# => │ 0 │ bar.nu │
# => │ 1 │ baz.nu │
# => │ 2 │ build  │
# => ╰───┴────────╯
glob -D b* | path basename | sort
# => ╭───┬────────╮
# => │ 0 │ bar.nu │
# => │ 1 │ baz.nu │
# => ╰───┴────────╯
```

The other options:

- `--no-file` (`-F`) and `--no-symlink` (`-S`) leave out files and symbolic links, the way `--no-dir` (`-D`) leaves out directories. A symbolic link counts only as a link, so `--no-file` keeps a link to a file, and `--no-dir` keeps a link to a directory.
- `--depth` (`-d`) limits how far `**` searches. Depth 1 is the entries of the current directory, depth 2 adds one level of subdirectories, and so on.
- `--follow-symlinks` (`-l`) makes `**` descend into directories that are reached through a symbolic link. Without it, a linked directory is listed but not searched.
- `--exclude` (`-e`) takes a list of patterns to leave out. `glob` doesn't walk into a directory that an exclude pattern matches, which saves time in large trees such as `target` or `node_modules`. The pattern has to match the paths inside the directory, so write `target/**`. Plain `target` excludes nothing below it.

For a project that holds `build.rs`, `src/main.rs`, `src/util/mod.rs` and `target/debug/out.rs`:

```nu
glob **/*.rs --depth 2 | path relative-to (pwd) | sort
# => ╭───┬─────────────╮
# => │ 0 │ build.rs    │
# => │ 1 │ src/main.rs │
# => ╰───┴─────────────╯
glob **/*.rs --exclude [target/**] | path relative-to (pwd) | sort
# => ╭───┬─────────────────╮
# => │ 0 │ build.rs        │
# => │ 1 │ src/main.rs     │
# => │ 2 │ src/util/mod.rs │
# => ╰───┴─────────────────╯
```

### Pattern syntax of the `glob` command

The `glob` command reads its pattern with the [wax](https://docs.rs/wax/latest/wax/) crate, not with `nu_glob` like `ls`, `rm` and the other file commands. Wax patterns have features that the file commands lack:

- `{a,b}` matches either alternative: `glob *.{rs,toml}`.
- `<pattern:n,m>` matches the pattern between `n` and `m` times. `glob "file<[0-9]:1,2>"` matches `file1` and `file10` but not `file100`.
- `(?i)` at the start makes the match case-insensitive: `glob "(?i)readme*"`.

`ls *.{rs,toml}` doesn't work, since `ls` has no `{a,b}` alternatives and looks for that pattern literally. Use `glob` and pass its result on, as in `ls ...(glob *.{rs,toml})`.

The experimental option `dc-glob` replaces both backends with one, so `glob` uses the same rules as `ls` and the other file commands, and all of them get `{a,b}` alternatives. With it on, wax's `<pattern:n,m>` repetitions, the `(?i)` flag and `\` escapes no longer work in `glob`, and `dir/**` lists only the directories below `dir`. Use `dir/**/*` to list everything. See [Experimental options](/book/configuration.md#experimental-options) for how to turn it on.

## Common commands that can work with `glob`

- `cp`
- `du`
- `ls`
- `glob`
- `mv`
- `rm`
