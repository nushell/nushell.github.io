---
title: Direnv
---

# Direnv

Many people use [direnv](https://direnv.net) to load an environment upon entering a directory as well as unloading it when exiting the directory.
Configuring direnv to work with nushell requires nushell version 0.66 or later.

---

### Configuring direnv

To make direnv work with nushell the way it does with other shells, we can use the "hooks" functionality:

```nu
$env.config = {
  hooks: {
    pre_prompt: [{ ||
      if (which direnv | is-empty) {
        return
      }

      direnv export json | from json | default {} | load-env
      if 'ENV_CONVERSIONS' in $env and 'PATH' in $env.ENV_CONVERSIONS {
        $env.PATH = do $env.ENV_CONVERSIONS.PATH.from_string $env.PATH
      }
    }]
  }
}
```

::: tip Note
you can follow the [`nu_scripts` of Nushell](https://github.com/nushell/nu_scripts/blob/main/nu-hooks/nu-hooks/direnv/config.nu)
for the always up-to-date version of the hook above
:::

With that configuration in place, direnv should now work with nushell.
