---
title: External Completers
---

## Completers

### Carapace completer

```nu
let carapace_completer = {|spans|
    carapace $spans.0 nushell ...$spans | from json
}
```

### Fish completer

This completer will use [the fish shell](https://fishshell.com/) to handle completions. Fish handles out of the box completions for many popular tools and commands.

```nu
let fish_completer = {|spans|
    fish --command $'complete "--do-complete=($spans | str join " ")"'
    | $"value(char tab)description(char newline)" + $in
    | from tsv --flexible --no-infer
}
```

A couple of things to note on this command:

- The fish completer will return lines of text, each one holding the `value` and `description` separated by a tab. The `description` can be missing, and in that case there won't be a tab after the `value`. If that happens, `from tsv` will fail, so we add the `--flexible` flag.
- `$"value(char tab)description(char newline)" + $in` exists to fix another edge case. Even with the `--flexible` flag, if the first line of the input doesn't have a second column the parser will skip that column for **all** the input. This is fixed adding a header to the input before-hand.
- `--no-infer` is optional. `from tsv` will infer the data type of the result, so a numeric value like some git hashes will be inferred as a number. `--no-infer` will keep everything as a string. It doesn't make a difference in practice but it will print a more consistent output if the completer is ran on it's own.

### Zoxide completer

[Zoxide](https://github.com/ajeetdsouza/zoxide) allows easily jumping between visited folders in the system. It's possible to autocomplete matching folders with this completer:

```nu
let zoxide_completer = {|spans|
    $spans | skip 1 | zoxide query -l $in | lines | where {|x| $x != $env.PWD}
}
```

This completer is not usable for almost every other command, so it's recommended to add it as an override in the [multiple completer](#multiple-completer):

```nu
{
    z => $zoxide_completer
    zi => $zoxide_completer
}
```

:::note
Zoxide sets an alias (`z` by default) that calls the `__zoxide_z` function.
If [alias completions](#alias-completions) are supported, the following snippet can be used instead:

```nu
{
     __zoxide_z => $zoxide_completer
     __zoxide_zi => $zoxide_completer
}
```

:::

### Multiple completer

Sometimes, a single external completer is not flexible enough. Luckily, as many as needed can be combined into a single one. The following example uses `$default_completer` for all commands except the ones explicitly defined in the record:

```nu
let multiple_completers = {|spans|
    match $spans.0 {
        ls => $ls_completer
        git => $git_completer
        _ => $default_completer
    } | do $in $spans
}
```

:::note
In the example above, `$spans.0` is the command being run at the time. The completer will match the desired completer, and fallback to `$default_completer`.

- If we try to autocomplete `git <tab>`, `spans` will be `[git ""]`. `match $spans.0 { ... }` will return the `$git_completer`.
- If we try to autocomplete `other_command <tab>`, `spans` will be `[other_command ""]`. The match will fallback to the default case (`_`) and return the `$default_completer`.

:::

## Troubleshooting

### Alias completions

Nushell currently has a [bug where autocompletions won't work for aliases](https://github.com/nushell/nushell/issues/8483). This can be worked around adding the following snippet at the beginning of the completer:

```nu
# if the current command is an alias, get it's expansion
let expanded_alias = (scope aliases | where name == $spans.0 | get -i 0 | get -i expansion)

# overwrite
let spans = (if $expanded_alias != null  {
    # put the first word of the expanded alias first in the span
    $spans | skip 1 | prepend ($expanded_alias | split row " " | take 1)
} else { $spans })
```

This code will take the first span, find the first alias that matches it, and replace the beginning of the command with the alias expansion.

### `ERR unknown shorthand flag` using carapace

Carapace will return this error when a non-supported flag is provided. For example, with `cargo -1`:

| value | description                       |
| ----- | --------------------------------- |
| -1ERR | unknown shorthand flag: "1" in -1 |
| -1\_  |                                   |

The solution to this involves manually checking the value to filter it out:

```nu
let carapace_completer = {|spans: list<string>|
    carapace $spans.0 nushell $spans
    | from json
    | if ($in | default [] | where value == $"($spans | last)ERR" | is-empty) { $in } else { null }
}
```

## Putting it all together

This is an example of how an external completer definition might look like:

```nu
let fish_completer = ...

let carapace_completer = {|spans: list<string>|
    carapace $spans.0 nushell ...$spans
    | from json
    | if ($in | default [] | where value =~ '^-.*ERR$' | is-empty) { $in } else { null }
}

# This completer will use carapace by default
let external_completer = {|spans|
    let expanded_alias = scope aliases
    | where name == $spans.0
    | get -i 0.expansion

    let spans = if $expanded_alias != null {
        $spans
        | skip 1
        | prepend ($expanded_alias | split row ' ' | take 1)
    } else {
        $spans
    }

    match $spans.0 {
        # carapace completions are incorrect for nu
        nu => $fish_completer
        # fish completes commits and branch names in a nicer way
        git => $fish_completer
        # carapace doesn't have completions for asdf
        asdf => $fish_completer
        # use zoxide completions for zoxide commands
        __zoxide_z | __zoxide_zi => $zoxide_completer
        _ => $carapace_completer
    } | do $in $spans
}

$env.config = {
    # ...
    completions: {
        external: {
            enable: true
            completer: $external_completer
        }
    }
    # ...
}
```
