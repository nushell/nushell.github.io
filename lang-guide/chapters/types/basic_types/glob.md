# Glob

What it is: A pattern to match pathnames in a filesystem.

Annotation: `glob`

Nu supports creating a value as a glob, it's similar to string, but if you pass it to some commands that support glob pattern(e.g: `open`), it will be expanded. It's best to see difference between `glob` and `string` by example:

```nu
let f = "a*c.txt"   # a string type.
open $f   # opens a file names `a*c.txt`

let g: glob = "a*c.txt"   # a glob type.
open $g   # opens files matches the glob pattern, e.g: `abc.txt`, `aac.txt`
```

The same rules happened if you are using custom command:

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

You can use `into glob` and `into string` to convert values between `glob` and `string`.

If you pass a `string` or a `bare word` to `builtin commands` which support glob pattern directly(not passing a variable or subexpression etc.), it follows some rules, let's see them by examples:

```nu
open *.txt    # opens all files which ends with `.txt`
open `*.txt`  # it's backtick quoted, it's a bare word, so nu opens all files which ends with `.txt`
open "*.txt"  # it's quoted, opens a file named `*.txt`
open '*.txt'  # it's quoted, opens a file named `*.txt`
```

You can use the `glob` command to expand a glob when needed.

```nu
glob *.nu
# => /home/you/dev/foo.nu /home/you/dev/bar.nu
```

Notice the glob, after expansion, always gets expanded into a list of fully quallified pathanes.

Here is a idiomatic Nu way to get just the simple filenames in the current directory:

```nu
glob -D * | path basename | str join ' '
foo.nu bar.nu
# => foo.nu bar.nu baz.nu
```

Another caveat when using Nushell over traditional shells is the `ls` command.
The ls command only takes a single glob pattern argument. which it internally expands.

```nu
# Try to expand the glob ourselves
ls (glob *.nu)
# Error [TODO: Show the actual error]
```

Globs can also represent directory trees recursively. In Unix like systems you might use a combination of the `find` and `xargs` commands to operate on directory trees. In Nushell, it is more idiomatic to use this pattern:

```nu
# Nostalgic for the Good Ole DOS days?
glob **/*.txt | each {|p| $p | path split } | each {|l| $l | str join '\' } | each {|p| $p | str upcase }
# upper case pathnames
```

## Casts

Using the `into glob` command, you can convert other types like strings into globs.

#### Using globs as a first class object

Globs can be saved in a variable, passed to a custom command and returned from a custom command.

```nu
let g: glob = **/*.nu
glob $g
# Returns list of pathnames
```

## Escaping globs

Sometimes you might want to not let a command expand a possible glob pattern before executing. You can use the `str escape-glob` command for this.

Note: As of Release 0.91.0 of Nu, `str escape-glob` is deprecated.

As of release 0.91.0, if you pass a string variable to commands that support glob patterns, then Nushell won't auto-expand the glob pattern.

## Commands that use glob

- `cp`
- `du`
- `ls`
- `glob`
- `mv`
- `rm`
