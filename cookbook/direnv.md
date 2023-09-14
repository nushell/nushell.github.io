---
title: Direnv
---

# Direnv

Many people use [direnv](https://direnv.net) to load an environment upon entering a directory as well as unloading it when exiting the directory.
Configuring direnv to work with nushell requires nushell version 0.66 or later.

---

### Configuring direnv

To make direnv work with nushell the way it does with other shells, we can use the "hooks" functionality:

```shell
$env.config = {
  hooks: {
    pre_prompt: [{ ||
      let direnv = (direnv export json | from json)
      let no_changes = $direnv | is-empty
      let changes = not $no_changes

      if $changes {
        let direnv = $direnv | upsert PATH {|direnv_result| ($direnv_result.PATH | split row ":") }
        $direnv | load-env
      }
    }]
  }
}
```

With that configuration in place, direnv should now work with nushell.
