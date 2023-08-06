---
title: ssh-agent
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
