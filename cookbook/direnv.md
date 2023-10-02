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
        let direnv = (direnv export json | from json | default {})
        if ($direnv | is-empty) {
            return
        }
        $direnv
        | items {|key, value|
           {
              key: $key
              value: (if $key in $env.ENV_CONVERSIONS {
                do ($env.ENV_CONVERSIONS | get $key | get from_string) $value
              } else {
                  $value
              })
            }
        } | transpose -ird | load-env
    }]
  }
}
```

With that configuration in place, direnv should now work with nushell.
