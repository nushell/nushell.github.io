# Best practices

## Formatting

### Defaults

- **Always** assume that by default no spaces or tabs allowed, but the following rules define where they are allowed.

### Basic

- **Always** put one space before and after pipe `|` symbol, commands, subcommands, their options and arguments.

#### One-line format

One-line format is a format for writting all commands in one line.

- **Always** put no spaces before and after pipe `|` symbol denoting block or closure parameter list beginning,
- **Always** put one space after comma `,` after block, closure parameter or record key.
- **Always** put no space before and one space after pipe `|` symbol denoting block or closure parameter list end.
- **Always** put one space before first record key and after last record key value.
- **Always** put one space after `:` after record key.
- **Always** put one space before opening square `[` or curly brace `{`.
- **Always** put one space after closing square `]` or curly brace `{`.
- **Always** put no spaces between square `[]` or curly brackets `{}` with nothing between them.

#### Multi-line format

Multi-line format is a format for writting all commands in several lines. It inherits all rules from one-line format
and modifies them slightly. When not stated explicitly, rule is inherited without change.

- **Always** put zero trailing spaces after pipe `|` symbol when `\n\t` follows it.
- **Always** put no space before and one `\n` after pipe `|` symbol denoting block or closure parameter list end.
- **Always** put one `\n\t` before first record key and `\n` after last record key value.
- **Always** put `\t` before list value or record key.

When referring to `\t` it's supposed that it's done relatively to the current indentation level.

### Spreading long lines

- **Always** default to short format unless you are writting scripts.
- **Always** default to short format in scripts for lists unless they more than 80 characters long.
- **Always** use long format for pipelines more than 80 characters long.

```nushell
export def "log ERROR_LEVEL_PREFIX" [
--short (-s)  # incorrect: "--short (-s)" indent should be one \t; fix: add \t before "--short (-s)"
] {
    if $short { "E" # incorrect: `{}` content should be on it's own lines; fix: move "E" on a separate line
    } else {
        "ERR" } # incorrect: `{}` content should be on it's own lines; fix: move "}" on a separate line
}
```

## Options and parameters of custom commands

- **Always** keep count of all positional parameters less than or equal to 4, for remaining inputs use options.
- **Always** use positional parameters unless they can't be used due to rules listed here or technical restrictions.
  For instance, when there are several kinds of optional parameters (but at least one parameter should be provided)
  use options. Great example of this is `ansi gradient` command where at least foreground or background must be passed.
- **Always** provide both long and short options.

## Documentation

- **Always** provide documentation for all exported entities (like custom commands) and their
  inputs (like custom command parameters and options).
