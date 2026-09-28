---
title: Custom Completers
---

# Custom Completers

## Zoxide Path Completions

[Zoxide](https://github.com/ajeetdsouza/zoxide) allows easily jumping between visited folders in the system. It's possible to autocomplete matching folders with this completer. It declares a `place` parameter, so Nushell passes it the command being completed as a list of words in `$place.command` (for example, `[z, nu]` when completing `z nu`):

```nu
def "nu-complete zoxide path" [place: record] {
    let parts = $place.command | skip 1
    {
      options: {
        sort: false,
        completion_algorithm: substring,
        case_sensitive: false,
      },
      completions: (^zoxide query --list --exclude $env.PWD -- ...$parts | lines),
    }
  }

def --env --wrapped z [...rest: string@"nu-complete zoxide path"] {
  __zoxide_z ...$rest
}
```

`__zoxide_z` is defined by the script that `zoxide init nushell` generates. Define this `z` after loading that script, so that it replaces zoxide's own `z` alias.

Do note that the above completer probably won't work with multiple keywords because each completion suggestion is a full path. Something like `z nu <TAB>` might provide `/home/user/nushell` as a suggestion, and if you select this suggestion, your commandline will be replaced with `z nu /home/user/nushell` rather than `z /home/user/nushell`. Running `z nu /home/user/nushell` will now fail.

Below is a more convoluted completer that provides odd-looking suggestions but does work with multiple keywords.

```nu
def "nu-complete zoxide path" [place: record] {
    let parts = $place.command | skip 1 | each { str lowercase }
    let completions = (
        ^zoxide query --list --exclude $env.PWD -- ...$parts
            | lines
            | each { |dir|
                if ($parts | length) <= 1 {
                    $dir
                } else {
                    let dir_lower = $dir | str lowercase
                    let rem_start = $parts | drop 1 | reduce --fold 0 { |part, rem_start|
                        ($dir_lower | str index-of --range $rem_start.. $part) + ($part | str length)
                    }
                    {
                        value: ($dir | str substring $rem_start..),
                        description: $dir
                    }
                }
            })
    {
        options: {
            sort: false,
            completion_algorithm: substring,
            case_sensitive: false,
        },
        completions: $completions,
    }
}
```
