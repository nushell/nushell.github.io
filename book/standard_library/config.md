# `std/config`

The `std/config` module has three commands that return values for your configuration. None of them changes anything by itself. You assign what they return in `config.nu` or `env.nu`.

```nu
use std/config
```

## `config dark-theme` and `config light-theme`

These return a record of colors for [`$env.config.color_config`](../coloring_and_theming.md), one meant for terminals with a dark background and one for a light background:

```nu
$env.config.color_config = (config light-theme)
```

See [Working on Light Background Terminal](../coloring_and_theming.md#working-on-light-background-terminal) for more.

## `config env-conversions`

`config env-conversions` returns a record of ready-made conversions for [`$env.ENV_CONVERSIONS`](../configuration.md#env-conversions). In Nushell 0.117.0 it has a single entry, `path`, for variables that hold a list of paths:

```nu
config env-conversions
# => ╭──────┬───────────────────╮
# => │ path │ {record 2 fields} │
# => ╰──────┴───────────────────╯
```

`path` is a record with the two closures that `ENV_CONVERSIONS` expects:

- `from_string` splits the string at the path separator, `(char esep)`, which is `:` or `;` on Windows. Then it expands each path with `path expand --no-symlink`, which makes it absolute and expands `~` but doesn't resolve symbolic links.
- `to_string` expands each path the same way and joins them with the separator.

Use it for a variable such as `XDG_DATA_DIRS`, which Nushell doesn't convert on its own:

```nu
$env.ENV_CONVERSIONS = $env.ENV_CONVERSIONS | merge {
    XDG_DATA_DIRS: (config env-conversions).path
}
$env.XDG_DATA_DIRS ++= ["~/.local/share"]
$env.XDG_DATA_DIRS
# => ╭───┬──────────────────╮
# => │ 0 │ /usr/share       │
# => │ 1 │ /usr/local/share │
# => │ 2 │ ~/.local/share   │
# => ╰───┴──────────────────╯
^sh -c 'echo $XDG_DATA_DIRS'
# => /usr/share:/usr/local/share:/home/myuser/.local/share
```

The list keeps a path as you added it. The `~` is expanded only when `to_string` turns the list back into a string for an external program. This is the same pair of closures as the `XDG_DATA_DIRS` example in [ENV_CONVERSIONS](../configuration.md#env-conversions).
