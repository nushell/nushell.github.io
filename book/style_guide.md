# Best practices

## Options and parameters of custom commands

- **Always** keep count of all positional parameters less than or equal to 4, for remaining inputs use options.
- **Always** use positional parameters unless they can't be used due to rules listed here or technical restrictions.
  For instance, when there are several kinds of optional parameters (but at least one parameter should be provided)
  use options. Great example of this is `ansi gradient` command where at least foreground or background must be passed.
- **Always** provide both long and short options.

## Documentation

- **Always** provide documentation for all exported entities (like custom commands) and their
  inputs (like custom command parameters and options).
