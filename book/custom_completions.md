# Custom Completions

Custom completions allow you to mix together two features of Nushell: custom commands and completions. With them, you're able to create commands that handle the completions for positional parameters and flag parameters. These custom completions work both for [custom commands](custom_commands.md) and [known external, or `extern`, commands](externs.md).

A completion is defined in two steps:

- Define a completion command (a.k.a. completer) that returns the possible values to suggest
- Attach the completer to the type annotation (shape) of another command's argument using `<shape>@<completer>`

Here's a simple example:

```nu
# Completion command
def animals [] { ["cat", "dog", "eel" ] }
# Command to be completed
def my-command [animal: string@animals] { print $animal }
# Show what pressing Tab after `my-command ` would offer
'my-command ' | commandline complete
# => ╭───┬─────╮
# => │ 0 │ cat │
# => │ 1 │ dog │
# => │ 2 │ eel │
# => ╰───┴─────╯
```

The first line defines a custom command which returns a list of three different animals. These are the possible values for the completion.

::: tip
To suppress completions for an argument (for example, an `int` that can accept any integer), define a completer that returns an empty list (`[ ]`).
:::

In the second line, `string@animals` tells Nushell two things—the shape of the argument for type-checking and the completer which will suggest possible values for the argument.

To try the completion interactively, type the name of the custom command `my-command`, followed by a space, and then the <kbd>Tab</kbd> key. This displays a menu with the possible completions. Custom completions work the same as other completions in the system, allowing you to type `e` followed by the <kbd>Tab</kbd> key to complete "eel" automatically. The last line of the example uses [`commandline complete`](/commands/docs/commandline_complete.md) to print the same suggestions without pressing <kbd>Tab</kbd> (see [Testing Completers](#testing-completers)).

::: tip
When the completion menu is displayed, the prompt changes to include the `|` character by default. To change the prompt marker, modify the `marker` value of the record, where the `name` key is `completion_menu`, in the `$env.config.menus` list. See also [the completion menu configuration](/book/line_editor.md#completion-menu).
:::

::: tip
To fall back to Nushell's built-in file completions, return `null` rather than a list of suggestions. `null` means "I have no answer here", so the next completion source answers instead, while an empty list means "there is nothing to complete".
:::

## Options for Custom Completions

If you want to choose how your completions are filtered and sorted, you can also return a record rather than a list. The list of completion suggestions should be under the `completions` key of this record. Optionally, it can also have, under the `options` key, a record containing the following optional settings:

- `filter` - Set this to `true` to have Nushell filter your completions against the text typed so far, or `false` to show them exactly as returned. Completers attached to a parameter are filtered by default. The [external completer](#external-completions) is not filtered by default, because it usually does its own filtering.
- `sort` - Set this to `false` to stop Nushell from sorting your completions. By default, this is `true`, and completions are sorted according to `$env.config.completions.sort`. Completions are only sorted when Nushell also filters them.
- `case_sensitive` - Set to `true` for the custom completions to be matched case sensitively, `false` otherwise. Used for overriding `$env.config.completions.case_sensitive`.
- `completion_algorithm` - Set this to `prefix`, `substring`, or `fuzzy` to choose how your completions are matched against the typed text. Used for overriding `$env.config.completions.algorithm`.
- `match_description` - Set this to `true` to also match the typed text against each suggestion's description, in addition to its value. The inserted completion is still the suggestion's value. By default, this is `false`.

The record can also have a `fallback` key, described in [Adding to the Built-in Completions](#adding-to-the-built-in-completions).

Here's an example demonstrating how to set these options:

```nu
def animals [] {
    {
        options: {
            case_sensitive: false,
            completion_algorithm: substring,
            sort: false,
        },
        completions: [cat, rat, bat]
    }
}
def my-command [animal: string@animals] { print $animal }
```

Now, if you try to complete `A`, you get the following completions:

```nu
'my-command A' | commandline complete
# => ╭───┬─────╮
# => │ 0 │ cat │
# => │ 1 │ rat │
# => │ 2 │ bat │
# => ╰───┴─────╯
```

Because we made matching case-insensitive, Nushell will find the substring "a" in all of the completion suggestions. Additionally, because we set `sort: false`, the completions will be left in their original order. This is useful if your completions are already sorted in a particular order unrelated to their text (e.g. by date).

### Matching against descriptions

Custom completers can opt into matching the typed text against suggestion descriptions in addition to values, by setting `match_description: true` in the returned `options` record. The inserted completion is still the suggestion's value. This is useful when the value is an opaque identifier but the description is what the user is likely to type, such as completing an email address by the person's name:

```nu
def "nu-complete users" [] {
    {
        options: {
            match_description: true,
            completion_algorithm: "substring",
        },
        completions: [
            { value: "lk446763@example.com", description: "Lennart Kiil" },
            { value: "ab123456@example.com", description: "Alice Bob" },
        ]
    }
}
def send-to [user: string@"nu-complete users"] { }
'send-to Lennart' | commandline complete
# => ╭───┬──────────────────────╮
# => │ 0 │ lk446763@example.com │
# => ╰───┴──────────────────────╯
```

Typing `Lennart` and pressing the <kbd>Tab</kbd> key matches the description "Lennart Kiil" and inserts its value `lk446763@example.com`, even though the typed text doesn't appear in the value itself.

### Adding to the Built-in Completions

Normally, a completer that returns suggestions replaces Nushell's own completions for that argument. Set `fallback: true` in the returned record to keep your suggestions and also let the next completion source (such as file completion) add its own:

```nu
def "nu-complete preset" [] {
    {completions: ["@default"], fallback: true}
}
def build [target: string@"nu-complete preset"] { }
# In a directory containing `docs/`, `src/` and `notes.txt`
'build ' | commandline complete
# => ╭───┬───────────╮
# => │ 0 │ @default  │
# => │ 1 │ docs/     │
# => │ 2 │ notes.txt │
# => │ 3 │ src/      │
# => ╰───┴───────────╯
```

## Modules and Custom Completions

Since completion commands aren't meant to be called directly, it's common to define them in modules.

Extending the above example with a module:

```nu
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    export def my-command [animal: string@animals] {
        print $animal
    }
}
```

In this module, only the custom command `my-command` is exported. The `animals` completion is not exported. This allows users of this module to call the command, and even use the custom completion logic, without having access to the completion command itself. This results in a cleaner and more maintainable API.

::: tip
Completers are attached to custom commands using `@` at parse time. This means that, in order for a change to the completion command to take effect, the public custom command must be reparsed as well. Importing a module satisfies both of these requirements at the same time with a single `use` statement.
:::

## Context Aware Custom Completions

A completer can ask Nushell for information about where the completion is happening. This is useful in situations where it is necessary to know previous arguments or flags to generate accurate completions.

A completer asks for this information by declaring parameters with one or more of these names, in any order:

- `token` - a record describing the text under the cursor: its `text`, its `kind` (`head`, `flag`, `value` or `block`), and its `span` in the line.
- `place` - a record describing what is being completed. `kind` says what sort of site the cursor is at (such as `positional`, `flag-name`, `flag-value` or `external-arg`), with `index` or `flag` when they apply. `target` is the range a suggestion replaces, and `command` is the command being completed as a list of words, even after a pipe, inside a closure, or through an alias.
- `buffer` - the whole command line, up to the cursor.

Applying this to the previous example:

```nu
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    def animal-names [place: record] {
        match $place.command.1 {
            cat => ["Missy", "Phoebe"]
            dog => ["Lulu", "Enzo"]
            eel => ["Eww", "Slippy"]
        }
    }

    export def my-command [
        animal: string@animals
        name: string@animal-names
    ] {
        print $"The ($animal) is named ($name)."
    }
}
use commands *
```

Here, the command `animal-names` returns the appropriate list of names. When completing `my-command dog `, `$place.command` is `[my-command, dog, ""]`, so `$place.command.1` is the animal that was already typed.

```nu
'my-command ' | commandline complete
# => ╭───┬─────╮
# => │ 0 │ cat │
# => │ 1 │ dog │
# => │ 2 │ eel │
# => ╰───┴─────╯
'my-command dog ' | commandline complete
# => ╭───┬──────╮
# => │ 0 │ Enzo │
# => │ 1 │ Lulu │
# => ╰───┴──────╯
my-command dog Enzo
# => The dog is named Enzo.
```

To see exactly what a completer would receive at a given point, use `commandline complete --input`:

```nu
def my-command [animal: string, name: string] {}
'ls | my-command dog L' | commandline complete --input
# => ╭────────┬──────────────────────────────────╮
# => │        │ ╭──────┬────────────────╮        │
# => │ token  │ │ text │ L              │        │
# => │        │ │ kind │ value          │        │
# => │        │ │      │ ╭───────┬────╮ │        │
# => │        │ │ span │ │ start │ 20 │ │        │
# => │        │ │      │ │ end   │ 21 │ │        │
# => │        │ │      │ ╰───────┴────╯ │        │
# => │        │ ╰──────┴────────────────╯        │
# => │        │ ╭─────────┬────────────────────╮ │
# => │ place  │ │ cursor  │ 21                 │ │
# => │        │ │         │ ╭───────┬────╮     │ │
# => │        │ │ target  │ │ start │ 20 │     │ │
# => │        │ │         │ │ end   │ 21 │     │ │
# => │        │ │         │ ╰───────┴────╯     │ │
# => │        │ │ kind    │ positional         │ │
# => │        │ │ index   │ 1                  │ │
# => │        │ │ shape   │ string             │ │
# => │        │ │         │ ╭───┬────────────╮ │ │
# => │        │ │ command │ │ 0 │ my-command │ │ │
# => │        │ │         │ │ 1 │ dog        │ │ │
# => │        │ │         │ │ 2 │ L          │ │ │
# => │        │ │         │ ╰───┴────────────╯ │ │
# => │        │ ╰─────────┴────────────────────╯ │
# => │ buffer │ ls | my-command dog L            │
# => ╰────────┴──────────────────────────────────╯
```

::: tip
Use `buffer` rather than calling `commandline` from inside a completer: `buffer` is always the line being completed. If you need the line split into tokens, `use std/util` and call `util structure $buffer`, which returns a `{text, kind, span}` table.
:::

::: warning
Older completers declared `[context: string]` (optionally with a second `position: int` parameter), or `[spans: list]` for external and command-wide completers. These still receive their old values, but Nushell prints a `Positional completer input deprecated` warning the first time one is used. Switch to `buffer`, `place` or `token`: `$buffer` replaces the old context string, `$place.cursor` replaces the position, and `$place.command` replaces `spans`.
:::

## Custom Completion and [`extern`](/commands/docs/extern.md)

A powerful combination is adding custom completions to [known `extern` commands](externs.md). These work the same way as adding a custom completion to a custom command: by creating the custom completion and then attaching it with a `@` to the type of one of the positional or flag arguments of the `extern`.

For example, here is a simplified version of the `git push` completions from the [nu_scripts repository](https://github.com/nushell/nu_scripts/blob/main/custom-completions/git/git-completions.nu):

```nu
def "nu-complete git remotes" [] {
    ^git remote | lines
}

def "nu-complete git branches" [] {
    ^git branch --format '%(refname:short)' | lines
}

export extern "git push" [
    remote?: string@"nu-complete git remotes",  # the name of the remote
    ...refs: string@"nu-complete git branches"  # the branch / refspec
    --all                                       # push all refs
    --force(-f)                                 # force updates
]
```

Inside a git repository, `git push <Tab>` now offers the names of the remotes, and `git push origin <Tab>` offers the local branches.

Custom completions will serve the same role in this example as in the previous examples. The examples above call into two different custom completions, based on the position the user is currently in.

## Command-wide Completers

Instead of attaching a completer to each parameter, you can attach one completer to all of a command's arguments with the [`@complete`](/commands/docs/attr_complete.md) attribute. This is handy for commands that take a free-form list of arguments. A command-wide completer is called for every argument, and Nushell does not filter what it returns, so it usually filters on `$token.text` itself:

```nu
def "nu-complete deploy" [token: record, place: record] {
    let candidates = if ($place.command | length) <= 2 {
        [staging production]
    } else {
        [--dry-run --force]
    }
    $candidates | where $it starts-with $token.text
}

@complete "nu-complete deploy"
def deploy [...args: string] { $args }

'deploy p' | commandline complete
# => ╭───┬────────────╮
# => │ 0 │ production │
# => ╰───┴────────────╯
'deploy staging --d' | commandline complete
# => ╭───┬───────────╮
# => │ 0 │ --dry-run │
# => ╰───┴───────────╯
```

`@complete external` instead sends a command's arguments to the [external completer](#external-completions). Use it for a wrapper that has the same name as the external command it wraps, so the external completer knows which command it is completing:

```nu
@complete external
def --wrapped jc [...args] {
    ^jc ...$args | from json
}
```

## Custom Descriptions and Styles

As an alternative to returning a list of strings, a completion function can also return a list of records with a `value` field and any of these optional fields:

- `description` - text shown beside the value in the menu.
- `style` - how to color the value in the menu (see below).
- `display_override` - text shown in the menu (and matched against the typed text) in place of `value`. The inserted text is still `value`.
- `span` - a `{start, end}` record giving the part of the line, in byte offsets, that the value replaces. By default, the value replaces the token being completed.
- `extra` - a list of strings shown with the selected value. It only appears in a `description` menu.

The style can be one of the following:

- A string with the foreground color, either a hex code or a color name such as `yellow`. For a list of valid color names, see `ansi --list`.
- A record with the fields `fg` (foreground color), `bg` (background color), and `attr` (attributes such as underline and bold). This record is in the same format that `ansi --escape` accepts. See the [`ansi`](/commands/docs/ansi) command reference for a list of possible values for the `attr` field.
- The same record, but converted to a JSON string.

```nu
def my_commits [] {
    [
        { value: "5c2464", description: "Add .gitignore", style: red },
        # "attr: ub" => underlined and bolded
        { value: "f3a377", description: "Initial commit", style: { fg: green, bg: "#66078c", attr: ub } }
    ]
}
```

::: tip Note
With the following snippet:

```nu
def my-command [commit: string@my_commits] {
    print $commit
}
```

... be aware that, even though the completion menu will show you something like

```ansi
>_ [36mmy-command[0m <TAB>
[1;31m5c2464[0m  [33mAdd .gitignore[0m
[1;4;48;2;102;7;140;32mf3a377  [0m[33mInitial commit[0m
```

... only the value (i.e., "5c2464" or "f3a377") will be used in the command arguments!
:::

## Interactive Completers

Completers normally run in the background, so a slow completer never blocks the line editor. A completer that needs the terminal, such as one that launches a fuzzy finder like `fzf` or uses [`input list`](/commands/docs/input_list.md), must be marked with the [`@interactive`](/commands/docs/attr_interactive.md) attribute. It then runs in the foreground with the terminal to itself, and whatever it returns becomes the completion:

```nu
@interactive
def pick-file [token: record] {
    ls | get name | to text | ^fzf --query $token.text | lines
}

def open-file [path: string@pick-file] {
    open $path
}
```

Typing `open-file ` and pressing <kbd>Tab</kbd> opens `fzf`, and the file you pick is inserted into the command line.

## Testing Completers

The [`commandline complete`](/commands/docs/commandline_complete.md) command runs the completion engine on a string, as if the cursor were at its end. This makes it easy to check a completer without pressing <kbd>Tab</kbd>:

- `commandline complete` returns the suggestion values.
- `commandline complete --detailed` returns the suggestions as records, in the same format a custom completer returns.
- `commandline complete --input` returns the `{token, place, buffer}` record a completer would receive, without running any completer.
- `commandline complete --type <source>` runs only one of Nushell's built-in completion sources (`directory`, `path`, `glob`, `command`, `variable` or `env-var`). A completer can use it to combine Nushell's own suggestions with its own:

```nu
def "nu-complete dirs-or-default" [token: record] {
    ['@default'] ++ ($token.text | commandline complete --type directory)
}
def build [target: string@"nu-complete dirs-or-default"] { }
# In a directory containing `docs/`, `src/` and `notes.txt`
'build ' | commandline complete
# => ╭───┬──────────╮
# => │ 0 │ @default │
# => │ 1 │ docs/    │
# => │ 2 │ src/     │
# => ╰───┴──────────╯
```

## External Completions

External completers can also be integrated, instead of relying solely on Nushell ones.

For this, set `$env.config.completions.external.completer` in `config.nu` to a [closure](types_of_data.md#closures). Nushell calls it to complete the arguments of external commands, that is, commands that aren't built-in, custom, or [`extern`](externs.md) commands. Like any other completer, the closure asks for `token`, `place` or `buffer` by naming its parameters, and it can return the same values as a custom completer. When the closure returns `null`, Nushell falls back to file completion.

Most external completers only need `$place.command`, the command being completed as a list of words. For example, typing `git checkout ma` and pressing <kbd>Tab</kbd> gives the closure `[git, checkout, ma]`, and typing `my-command --arg1 ` gives `[my-command, --arg1, ""]`, with an empty string for the argument that hasn't been typed yet. Aliases are already expanded: if `gco` is an alias for `git checkout`, typing `gco ma` also gives `[git, checkout, ma]`.

You can configure the closure to run an external completer, such as [carapace](https://github.com/carapace-sh/carapace-bin). This example will enable carapace external completions:

```nu
$env.config.completions.external.completer = {|place|
    carapace $place.command.0 nushell ...$place.command | from json
}
```

::: tip Note
The `enable` and `max_results` settings in `$env.config.completions.external` control whether (and how many) external command names from your `PATH` are offered when completing a command name. They don't affect the external completer.
:::

To use the external completer for a custom command as well, mark the command with [`@complete external`](#command-wide-completers).

[More examples of external completers can be found in the cookbook](../cookbook/external_completers.md).
