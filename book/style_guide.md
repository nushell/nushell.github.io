# Best practices

## Formatting

- **Always** put one space before and after pipe `|` symbol, commands, subcommands, their options and arguments.
- **Always** put pipe `|` symbol before `\n` and indent next command one level more first command in pipeline
  when dealing with long pipelines. By long pipeline here we mean a such one that takes more than 80 characters counting
  from the first character of the first command name of this pipeline.
- **Always** spread blocks and closures over several lines putting first brace `}` on a separate line.
- **Always** put zero spaces between square brackets `[]` for custom commands without parameters.
- **Always** put all custom command parameters on separate lines indented one level more than `def`.

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
