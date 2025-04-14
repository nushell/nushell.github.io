---
title: Direnv
---

# Direnv

Many people use [direnv](https://direnv.net) to load an environment upon entering a directory as well as unloading it when exiting the directory.
Configuring direnv to work with nushell requires nushell version 0.66 or later.

---

### Configuring direnv

To make direnv work with nushell the way it does with other shells, we can use the "hooks" functionality along with:

- [`load-env`](/commands/docs/load-env.md)
- An `env-conversion` helper for the `PATH` from the [Standard Library](/book/standard_library.md)

```nu
use std/config *
$env.config.hooks.pre_prompt = [{||
  if (which direnv | is-empty) {
    return
  }

  direnv export json | from json | default {} | load-env
  $env.PATH = do (env-conversions).path.from_string $env.PATH
}]
```

::: tip Note
you can follow the [`nu_scripts` of Nushell](https://github.com/nushell/nu_scripts/blob/main/nu-hooks/nu-hooks/direnv/config.nu)
for the always up-to-date version of the hook above
:::

With that configuration in place, direnv should now work with nushell.
