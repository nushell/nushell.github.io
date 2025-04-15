---
title: Direnv
---

# Direnv

Many people use [direnv](https://direnv.net) to load an environment when entering a directory and unload it when exiting the directory.

## How direnv works

From [direnv.net](https://direnv.net):

> Before each prompt, direnv checks for the existence of a `.envrc` file (and optionally a `.env` file) in the current and parent directories. If the file exists (and is authorized), it is loaded into a bash sub-shell and all exported variables are then captured by direnv and then made available to the current shell.

## Configuring direnv in Nushell

In Nushell, it's possible to run direnv each time the prompt displays (using a [`pre_prompt` hook](/book/hooks.html)). However, it's more efficient to update only when the directory is changed using an `env_change` hook along with:

- [`from json`](/commands/docs/from_json.md) to convert the direnv output to structured data
- [`load-env`](/commands/docs/load-env.md)
- An `env-conversion` helper for the `PATH` from the [Standard Library](/book/standard_library.md)

::: note

The direnv configuration below requires Nushell 0.104 or later.

:::

```nu
use std/config *

# Initialize the PWD hook as an empty list if it doesn't exist
$env.config.hooks.env_change.PWD = $env.config.hooks.env_change.PWD? | default []

$env.config.hooks.env_change.PWD ++= [{||
  if (which direnv | is-empty) {
    # If direnv isn't installed, do nothing
    return
  }

  direnv export json | from json | default {} | load-env
  # If direnv changes the PATH, it will become a string and we need to re-convert it to a list
  $env.PATH = do (env-conversions).path.from_string $env.PATH
}]
```

As with other configuration changes, this can be made permanent by adding it to your startup [configuration](/book/configuration.md).

With this in place, direnv will now add/remove environment variables when entering/leaving a directory with an `.envrc` or `.env` file.
