# Path

What it is: This is a string that will be expanded into a fully qualified pathname when passed to a command or closure.

Annotation: `path`

Example:

You can easily recreate the `realpath` command from some Linux distros:

```nu
> def realpath [p: path] { $p }
> cd /bin
> realpath sh
/usr/bin/sh
```

## Casts

There is no `into path` command, but several commands can be used to convert to and from a `path`:

- `path expand`
- `path join`
- `path parse`

## Commands that use path

- `path (subcommands)`
  - See: `help path` for a full list
