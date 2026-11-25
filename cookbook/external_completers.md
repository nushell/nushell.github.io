---
title: External Completers
---

# External Completers

An external completer is a closure assigned to `$env.config.completions.external.completer`. Nushell calls it to complete the arguments of external commands. Like other [custom completers](/book/custom_completions.md#context-aware-custom-completions), the closure declares which inputs it wants by naming its parameters. The recipes on this page use `place`, whose `command` field is the command being completed as a list of words. For example, completing `git checkout ma` gives `$place.command` the value `[git, checkout, ma]`, and completing `git ` gives `[git, ""]`.

## Completers

### Carapace completer

```nu
let carapace_completer = {|place|
    carapace $place.command.0 nushell ...$place.command | from json
}
```

### Fish completer

This completer will use [the fish shell](https://fishshell.com/) to handle completions. Fish handles out of the box completions for many popular tools and commands.

```nu
let fish_completer = {|place|
    fish --command $"complete '--do-complete=($place.command | str replace --all "'" "\\'" | str join ' ')'"
    | from tsv --flexible --noheaders
    | rename value description
    | update value {|row|
      let value = $row.value
      let need_quote = ['\' ',' '[' ']' '(' ')' ' ' '\t' "'" '"' "`"] | any {$in in $value}
      if ($need_quote and ($value | path exists)) {
        let expanded_path = if ($value starts-with '~') {$value | path expand --no-symlink} else {$value}
        $'"($expanded_path | str replace --all "\"" "\\\"")"'
      } else {$value}
    }
}
```

A couple of things to note on this command:

- The fish completer will return lines of text, each one holding the `value` and `description` separated by a tab. The `description` can be missing, and in that case there won't be a tab after the `value`. If that happens, `from tsv` will fail, so we add the `--flexible` flag.
- The output of the fish completer does not contain a header (name of the columns), so we add `--noheaders` to prevent `from tsv` from treating the first row as headers and later give the columns their names using `rename`.
- Since fish only supports POSIX style escapes for file paths (`file\ name.txt`, etc.), file paths completed by fish will not be quoted or escaped properly on external commands. Nushell does not parse POSIX escapes, so we need to do this conversion manually such as by testing if the items are valid paths as shown in the example. To minimize the overhead of path lookups, we first check the string for common escape characters. If the string needs escaping, and it is a path on the filesystem, then the value is double-quoted. Also before double-quoting the file path we expand any ~ at the beginning of the path, so that completions continue to work. This simple approach is imperfect, but it should cover 99.9% of use cases.

To use one of these completers, assign it to the config:

```nu
$env.config.completions.external.completer = $fish_completer
```

You can check the result without pressing <kbd>Tab</kbd> by using [`commandline complete`](/commands/docs/commandline_complete.md):

```nu
'git swi' | commandline complete --detailed | select value description
# => ╭───┬────────┬────────────────────╮
# => │ # │ value  │    description     │
# => ├───┼────────┼────────────────────┤
# => │ 0 │ switch │ Switch to a branch │
# => ╰───┴────────┴────────────────────╯
```

### Multiple completer

Sometimes, a single external completer is not flexible enough. Luckily, as many as needed can be combined into a single one. The following example uses the `$fish_completer` from above for `git`, and the `$carapace_completer` for all other commands:

```nu
let multiple_completers = {|place|
    match $place.command.0 {
        git => $fish_completer
        _ => $carapace_completer
    } | do $in $place
}
$env.config.completions.external.completer = $multiple_completers
```

> **Note**
> In the example above, `$place.command.0` is the command being run at the time. The completer will match the desired completer, and fallback to `$carapace_completer`.
>
> - If we try to autocomplete `git <tab>`, `$place.command` will be `[git, ""]`. `match $place.command.0 { ... }` will return the `$fish_completer`.
> - If we try to autocomplete `other_command <tab>`, `$place.command` will be `[other_command, ""]`. The match will fallback to the default case (`_`) and return the `$carapace_completer`.

### fzf picker

This completer hands carapace's suggestions to [fzf](https://github.com/junegunn/fzf), so you pick a completion from fzf's searchable list instead of the completion menu. fzf needs the terminal, so the work happens in a command marked [`@interactive`](/book/custom_completions.md#interactive-completers), and the closure calls it:

```nu
@interactive
def "nu-complete carapace-fzf" [place: record] {
    carapace $place.command.0 nushell ...$place.command
    | from json
    | get value
    | to text
    | ^fzf --height=40% --select-1 --exit-0
    | lines
}

$env.config.completions.external.completer = {|place| nu-complete carapace-fzf $place }
```

Typing `git sw` and pressing <kbd>Tab</kbd> inserts `switch` straight away, because `--select-1` makes fzf take the only match without showing its list. After `git `, <kbd>Tab</kbd> opens fzf on all of git's subcommands. Pressing <kbd>Esc</kbd> in fzf leaves the line as it was, and `--exit-0` makes fzf exit at once when carapace has nothing to offer. Either way, Nushell doesn't fall back to file names.

Nushell only treats the closure as interactive when the `@interactive` command is the last thing it calls. A closure that pipes the result further, or that picks a completer with `match ... | do $in $place` as in [Multiple completer](#multiple-completer), runs in the background like any other completer, where fzf can't use the terminal. With this completer set, `commandline complete` in a script stops with an error for external commands instead of running fzf.

## Troubleshooting

### Alias completions

External completers receive aliases already expanded. If `gco` is an alias for `git checkout`, completing `gco ma` gives the completer `[git, checkout, ma]` in `$place.command`, so no extra code is needed to support aliases.

### `ERR unknown shorthand flag` using carapace

Carapace will return this error when a non-supported flag is provided. For example, with `cargo -1`:

| value | description                       |
| ----- | --------------------------------- |
| -1ERR | unknown shorthand flag: "1" in -1 |
| -1\_  |                                   |

The solution to this is to set `$env.CARAPACE_LENIENT = 1`, see [the carapace documentation](https://carapace-sh.github.io/carapace-bin/setup/environment.html#carapace_lenient).

## Putting it all together

This is an example of how an external completer definition might look like:

```nu
let fish_completer = {|place|
    fish --command $"complete '--do-complete=($place.command | str replace --all "'" "\\'" | str join ' ')'"
    | from tsv --flexible --noheaders
    | rename value description
    | update value {|row|
      let value = $row.value
      let need_quote = ['\' ',' '[' ']' '(' ')' ' ' '\t' "'" '"' "`"] | any {$in in $value}
      if ($need_quote and ($value | path exists)) {
        let expanded_path = if ($value starts-with '~') {$value | path expand --no-symlink} else {$value}
        $'"($expanded_path | str replace --all "\"" "\\\"")"'
      } else {$value}
    }
}

let carapace_completer = {|place|
    CARAPACE_LENIENT=1 carapace $place.command.0 nushell ...$place.command | from json
}

# This completer will use carapace by default
let external_completer = {|place|
    match $place.command.0 {
        # carapace completions are incorrect for nu
        nu => $fish_completer
        # fish completes commits and branch names in a nicer way
        git => $fish_completer
        # carapace doesn't have completions for asdf
        asdf => $fish_completer
        _ => $carapace_completer
    } | do $in $place
}

$env.config.completions.external.completer = $external_completer
```
