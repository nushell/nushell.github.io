---
title: External Completers
---

# External Completers

## Completers

### Carapace completer

```nu
let carapace_completer = {|spans|
    carapace $spans.0 nushell $spans | from json
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
