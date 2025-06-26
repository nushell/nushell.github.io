---
title: External Completers
---

# External Completers

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
    fish --command $"complete '--do-complete=($spans | str replace "'" "\\'" | str join ' ')'"
    | from tsv --flexible --noheaders --no-infer
    | rename value description
    | update value {
        if ($in | path exists) {$'"($in | str replace "\"" "\\\"" )"'} else {$in}
    }
}
```

A couple of things to note on this command:

- The fish completer will return lines of text, each one holding the `value` and `description` separated by a tab. The `description` can be missing, and in that case there won't be a tab after the `value`. If that happens, `from tsv` will fail, so we add the `--flexible` flag.
- The output of the fish completer does not contain a header (name of the columns), so we add `--noheaders` to prevent `from tsv` from treating the first row as headers and later give the columns their names using `rename`.
- `--no-infer` is optional. `from tsv` will infer the data type of the result, so a numeric value like some git hashes will be inferred as a number. `--no-infer` will keep everything as a string. It doesn't make a difference in practice but it will print a more consistent output if the completer is ran on it's own.
- Since fish only supports POSIX style escapes for file paths (`file\ name.txt`, etc.), file paths completed by fish will not be quoted or escaped properly on external commands. Nushell does not parse POSIX escapes, so we need to do this conversion manually such as by testing if the items are valid paths as shown in the example. This simple approach is imperfect, but it should cover 99.9% of use cases.

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

> **Note**
> In the example above, `$spans.0` is the command being run at the time. The completer will match the desired completer, and fallback to `$default_completer`.
>
> - If we try to autocomplete `git <tab>`, `spans` will be `[git ""]`. `match $spans.0 { ... }` will return the `$git_completer`.
> - If we try to autocomplete `other_command <tab>`, `spans` will be `[other_command ""]`. The match will fallback to the default case (`_`) and return the `$default_completer`.

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
    carapace $spans.0 nushell ...$spans
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
