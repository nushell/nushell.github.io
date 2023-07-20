---
title: Miscellaneous
---

# Manage SSH passphrases

`eval` is not available in nushell, so run:

```nushell
ssh-agent -c
    | lines
    | first 2
    | parse "setenv {name} {value};"
    | transpose -r
    | into record
    | load-env
```

# Miscellaneous

- To finish or "accept" an autocomplete command, press the right arrow key. This can also be changed by changing the keybindings in the `config.nu` file.
