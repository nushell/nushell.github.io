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

In the second line, `string@animals` tells Nushell two things: the shape of the argument for type-checking, and the completer which will suggest possible values for the argument.

To try the completion interactively, type the name of the custom command `my-command`, followed by a space, and then the <kbd>Tab</kbd> key. This displays a menu with the possible completions. Custom completions work the same as other completions in the system, allowing you to type `e` followed by the <kbd>Tab</kbd> key to complete "eel" automatically. The last line of the example uses [`commandline complete`](/commands/docs/commandline_complete.md) to print the same suggestions without pressing <kbd>Tab</kbd> (see [Testing Completers](#testing-completers)).

::: tip
When the completion menu is displayed, the prompt changes to include the `|` character by default. To change the prompt marker, modify the `marker` value of the record, where the `name` key is `completion_menu`, in the `$env.config.menus` list. See also [the completion menu configuration](/book/line_editor.md#completion-menu).
:::

::: tip
To fall back to Nushell's own completions, return `null` rather than a list of suggestions. `null` means "I have no answer here", so the next completion source answers instead, while an empty list means "there is nothing to complete". The next source is the [command-wide completer](#command-wide-completers) if the command has one, and otherwise the [completion for the parameter's type](#built-in-completion-sources), which is usually file names. A completer that fails with an error offers nothing at all.
:::

## Ways to attach a completer

The part after `@` takes one of three forms:

- A command name, such as `string@animals`. Put a name that contains spaces in quotes, as in `string@"nu-complete git branches"`. An alias of such a command works too. The command must be one you define with `def`. The parser also accepts a built-in or plugin command such as `ls`, but it offers nothing when you press <kbd>Tab</kbd>.
- A list of values, such as `string@[up down left right]`. Nushell filters and sorts the list the same way it handles a list that a completer command returns. An item may be a record with a `value` field, but Nushell reads only the `value`, so use a completer command when you want descriptions or styles.
- A constant, such as `string@$SIZES`. Nushell attaches completers while it parses the definition, so the variable has to come from [`const`](/commands/docs/const.md), not `let` or `mut`. It can hold a list or the name of a command.

```nu
def go [direction: string@[up down left right]] { }
'go ' | commandline complete
# => ╭───┬───────╮
# => │ 0 │ down  │
# => │ 1 │ left  │
# => │ 2 │ right │
# => │ 3 │ up    │
# => ╰───┴───────╯

const SIZES = [small medium large]
def order [size: string@$SIZES] { }
'order ' | commandline complete
# => ╭───┬────────╮
# => │ 0 │ large  │
# => │ 1 │ medium │
# => │ 2 │ small  │
# => ╰───┴────────╯
```

Anything else after `@` is a parse error: a name that isn't a command, a `let` variable, which fails with `Not a constant`, a record, or a list item that is a record without `value`.

## Options for Custom Completions

If you want to choose how your completions are filtered and sorted, you can also return a record rather than a list. The list of completion suggestions should be under the `completions` key of this record. Optionally, it can also have, under the `options` key, a record containing the following optional settings:

- `filter` - Set this to `true` to have Nushell filter your completions against the text typed so far, or `false` to show them exactly as returned. Completers attached to a parameter are filtered by default. The [external completer](#external-completions) is not filtered by default, because it usually does its own filtering.
- `sort` - Set this to `false` to stop Nushell from sorting your completions. By default, this is `true`, and completions are sorted according to `$env.config.completions.sort`. Completions are only sorted when Nushell also filters them.
- `case_sensitive` - Set to `true` for the custom completions to be matched case sensitively, `false` otherwise. Used for overriding `$env.config.completions.case_sensitive`.
- `completion_algorithm` - Set this to `prefix`, `substring`, or `fuzzy` to choose how your completions are matched against the typed text. Used for overriding `$env.config.completions.algorithm`.
- `match_description` - Set this to `true` to also match the typed text against each suggestion's description, in addition to its value. The inserted completion is still the suggestion's value. By default, this is `false`.

The record can also have a `fallback` key, described in [Adding to the Built-in Completions](#adding-to-the-built-in-completions).

An option you leave out keeps its value from the [completion settings](#completion-settings). Nushell reads a returned record this way only when it has at least one of the keys `completions`, `options` and `fallback`. It reads any other record as a single suggestion (see [Custom Descriptions and Styles](#custom-descriptions-and-styles)), and a lone string as a single suggestion too. Nushell skips keys it doesn't know, whether they're in this record, in `options` or in a suggestion. Start Nushell with `nu --log-level error` to see a message for each one.

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
Use `buffer` rather than calling `commandline` from inside a completer: `buffer` is always the line being completed.
:::

If you need `buffer` split into tokens, the standard library's `structure` command does it. Call it as `util structure $buffer` after `use std/util`, or as `std structure $buffer` after `use std`. It runs [`ast --flatten`](/commands/docs/ast.md) on the line and returns a `text`, `kind`, `span` table. Each `kind` loses the `shape_` prefix that `ast` puts on it. When the parser reports the same span twice, as it does for `name` in a `where` condition, only the first row is kept:

```nu
use std/util
util structure 'ls -a | where name == foo' | select text kind
# => ╭───┬───────┬──────────────╮
# => │ # │ text  │     kind     │
# => ├───┼───────┼──────────────┤
# => │ 0 │ ls    │ internalcall │
# => │ 1 │ -a    │ flag         │
# => │ 2 │ |     │ pipe         │
# => │ 3 │ where │ internalcall │
# => │ 4 │ name  │ string       │
# => │ 5 │ ==    │ operator     │
# => │ 6 │ foo   │ string       │
# => ╰───┴───────┴──────────────╯
```

The parser doesn't keep everything you typed. In `^git commit -m `, the table has no `^` and no row for the argument after the trailing space, while `$place.command` ends with an empty string for that argument:

```nu
util structure '^git commit -m ' | get text
# => ╭───┬────────╮
# => │ 0 │ git    │
# => │ 1 │ commit │
# => │ 2 │ -m     │
# => ╰───┴────────╯
'^git commit -m ' | commandline complete --input | get place.command
# => ╭───┬────────╮
# => │ 0 │ git    │
# => │ 1 │ commit │
# => │ 2 │ -m     │
# => │ 3 │        │
# => ╰───┴────────╯
```

When the exact text matters, read `$buffer` itself.

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

Returning `options: {filter: true}` doesn't change that. Nushell then sorts what the completer returns, but still doesn't narrow it. The same goes for the external completer when `@complete external`, described below, sends it a custom command's arguments. For external commands, `filter: true` does narrow its results.

A command can have both a command-wide completer and completers on some of its parameters. A parameter's own completer runs first, and the command-wide completer answers only where that one returns `null` or sets `fallback: true`, and for parameters that have no completer. When you complete a flag name, Nushell lists the command's declared flags first, then adds whatever the command-wide completer returns, leaving out values it has already listed:

```nu
def "nu-complete stages" [] { [staging production] }
def "nu-complete release" [] { [--force --verbose us-east eu-west] }

@complete "nu-complete release"
def release [stage: string@"nu-complete stages", region?: string, --force] { }

'release ' | commandline complete | str join ', '
# => production, staging
'release staging ' | commandline complete | str join ', '
# => --force, --verbose, us-east, eu-west
'release --' | commandline complete | str join ', '
# => --force, --help, --verbose, us-east, eu-west
```

The first line uses `stage`'s own completer. `region` has none, so the second line gets the command-wide list. In the third, `--force` and `--help` come from the signature, and the command-wide completer adds `--verbose` and the two regions, unfiltered. If a command-wide completer fails with an error, Nushell completes file names instead.

`@complete external` instead sends a command's arguments to the [external completer](#external-completions). Use it for a wrapper that has the same name as the external command it wraps, so the external completer knows which command it is completing:

```nu
@complete external
def --wrapped jc [...args] {
    ^jc ...$args | from json
}
```

A `def --wrapped` command passes flags it doesn't declare on to its rest parameter. So a completer on that rest parameter is also called for arguments that start with `-`, and its suggestions are listed together with the command's own flags:

```nu
def "nu-complete what" [] { [--verbose --color=always plain] }
def --wrapped what [--local, ...args: string@"nu-complete what"] { $args }

'what --' | commandline complete
# => ╭───┬────────────────╮
# => │ 0 │ --local        │
# => │ 1 │ --color=always │
# => │ 2 │ --verbose      │
# => ╰───┴────────────────╯
```

## Custom Descriptions and Styles

As an alternative to returning a list of strings, a completion function can also return a list of records with a `value` field and any of these optional fields:

- `description` - text shown beside the value in the menu.
- `style` - how to color the value in the menu (see below).
- `display_override` - text shown in the menu (and matched against the typed text) in place of `value`. The inserted text is still `value`.
- `span` - a `{start, end}` record giving the part of the line, in byte offsets, that the value replaces. By default, the value replaces the token being completed. You can give only `start` or only `end`, and the other keeps its default. A completer never sees the text after the cursor, so an offset past the cursor counts as the cursor position. Nushell ignores a negative offset, and a `start` greater than `end` inserts the value at `end` without replacing anything.
- `extra` - a list of strings shown with the selected value. It only appears in a `description` menu.
- `kind` - what sort of thing the value is: `value` (the default), `command`, `cell-path`, `directory`, `file`, `flag`, `module`, `operator` or `variable`. The menu at the prompt looks the same either way, but `commandline complete --detailed` reports it, and the [language server](./language_server.md) uses it to choose the icon your editor shows.
- `append_whitespace` - set to `true` to add a space after the value when it's inserted, as Nushell does for command names. The default is `false`.
- `match_indices` - a list of character positions in the shown text to highlight as matching what was typed. Nushell replaces it with its own positions whenever it filters the list, so it only has an effect with `filter: false` or from a completer that Nushell doesn't filter.

A `type` field is allowed and ignored, so a completer can return the records that `commandline complete --detailed` produces as they are. Their `span` only fits the line they were computed for, though.

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

Completers normally run in the background, on a separate thread with no access to the terminal's input, so a slow completer never blocks the line editor. A completer that needs the terminal, such as one that launches a fuzzy finder like `fzf` or uses [`input list`](/commands/docs/input_list.md), must be marked with the [`@interactive`](/commands/docs/attr_interactive.md) attribute. It then runs in the foreground with the terminal to itself, and whatever it returns becomes the completion:

```nu
@interactive
def pick-file [token: record] {
    ls | get name | to text | ^fzf --query $token.text | lines
}

def open-file [path: string@pick-file] {
    open $path
}
```

Typing `open-file ` and pressing <kbd>Tab</kbd> opens `fzf`, and the file you pick is inserted into the command line. If you cancel the picker instead (for example with <kbd>Esc</kbd>), nothing is inserted and no menu stays open; pressing <kbd>Tab</kbd> again opens the picker again. What an interactive completer returns is final: when it returns nothing, returns `null` or fails, Nushell doesn't fall back to file names. It may return a single value instead of a list, which is what `input list` gives you.

The [external completer](#external-completions) is a closure, and a closure can't carry an attribute. Nushell treats it as interactive when the last command in the closure is an `@interactive` command. To send every external command's arguments through `pick-file` from above:

```nu
$env.config.completions.external.completer = {|token| pick-file $token }
```

Nushell decides this by reading the closure, not by running it, so the call has to come last. `{|token| pick-file $token | sort }` and `{|token| if true { pick-file $token } }` both run in the background like any other completer. The cookbook has a recipe that [feeds carapace's suggestions to `fzf`](../cookbook/external_completers.md#fzf-picker).

In a script or with `nu -c`, `commandline complete` refuses to run an interactive completer and stops with the error `An @interactive completer cannot run here`. `commandline complete --input` still shows the record it would receive.

## Testing Completers

The [`commandline complete`](/commands/docs/commandline_complete.md) command runs the completion engine on a string, as if the cursor were at its end. This makes it easy to check a completer without pressing <kbd>Tab</kbd>:

- `commandline complete` returns the suggestion values.
- `commandline complete --detailed` returns the suggestions as records, in the same format a custom completer returns.
- `commandline complete --input` returns the `{token, place, buffer}` record a completer would receive, without running any completer.
- `commandline complete --type <source>` runs only one of Nushell's [built-in completion sources](#built-in-completion-sources) (`directory`, `path`, `glob`, `command`, `variable` or `env-var`). A completer can use it to combine Nushell's own suggestions with its own:

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

In a script or with `nu -c`, `commandline complete` doesn't list the executables in `PATH`. Run it at the prompt to check suggestions that include them. The [completion menu](./line_editor.md#completion-menu) section of the line editor chapter uses `commandline complete` to show what Nushell completes without a custom completer, such as cell paths, operators, attributes and module exports.

Without pipeline input, `commandline complete` completes the line you're editing, at the cursor rather than at the end of the line. That lets a keybinding that runs [`executehostcommand`](./line_editor.md#keybindings) use it. This one prints what <kbd>Tab</kbd> would offer when you press <kbd>Alt</kbd>+<kbd>C</kbd>:

```nu
$env.config.keybindings ++= [{
    name: show_completions
    modifier: alt
    keycode: char_c
    mode: [emacs vi_insert vi_normal]
    event: { send: executehostcommand, cmd: "print (commandline complete | str join ', ')" }
}]
```

With `my-command ` from the first example on the line, <kbd>Alt</kbd>+<kbd>C</kbd> prints `cat, dog, eel` and leaves the line as it was.

## Built-in completion sources

These are the sources that `commandline complete --type` runs. Nushell also uses them on its own: when a parameter has no completer, or its completer returns `null`, the parameter's type picks the source.

- `path` and `glob` complete file and directory names. Parameters typed `path` or `glob` get this completion, and so do most other parameters that have no completer, unless the command has subcommands, in which case <kbd>Tab</kbd> offers those.
- `directory` completes only directory names, leaving files out. The path argument of [`cd`](/commands/docs/cd.md) is typed `directory`, so `cd <Tab>` lists only directories, and so does any parameter or flag value you type as `directory`, such as `--to` in `def backup [--to: directory] { }`.
- `command` completes command names, including executables in `PATH` (see [Command names, `^` and `%`](./line_editor.md#command-names-and)).
- `variable` completes the variables in scope, with each one's type as the description. The list includes `$nu`, `$env` and `$in`, and constants such as `$NU_LIB_DIRS`. This is what you get when you type `$` at the prompt and press <kbd>Tab</kbd>.
- `env-var` completes the names of environment variables, which is what [`hide-env`](/commands/docs/hide-env.md) offers. At the prompt, typing `$env.` completes the same names, and `$nu.` completes the fields of `$nu`, as [cell paths](./line_editor.md#cell-paths).

```nu
let animal = "cat"
'$' | commandline complete --detailed | select value description
# => ╭───┬─────────────────┬──────────────╮
# => │ # │      value      │ description  │
# => ├───┼─────────────────┼──────────────┤
# => │ 0 │ $animal         │ string       │
# => │ 1 │ $ans            │ any          │
# => │ 2 │ $env            │ any          │
# => │ 3 │ $in             │ any          │
# => │ 4 │ $nu             │ any          │
# => │ 5 │ $NU_LIB_DIRS    │ list<string> │
# => │ 6 │ $NU_PLUGIN_DIRS │ list<string> │
# => ╰───┴─────────────────┴──────────────╯
$env.PROJECT_ROOT = "/src/app"
$env.PROJECT_NAME = "app"
'$env.PROJ' | commandline complete
# => ╭───┬──────────────╮
# => │ 0 │ PROJECT_NAME │
# => │ 1 │ PROJECT_ROOT │
# => ╰───┴──────────────╯
```

### File and directory names

File completion matches each part of a path on its own, so `ls s/c/c` can complete to `src/completions/completer.rs`. A path that starts with `~` completes from your home directory and keeps the `~`. As with [`cd`](./moving_around.md#changing-the-current-directory), `...` stands for `../..`, and the suggestion keeps the dots you typed. Directories end with a separator, and names that start with `.` come after the others.

Nushell quotes a name that couldn't be typed bare. A name that contains a glob pattern such as `*`, `?` or `[...]`, or a backtick, goes in single quotes, so that a `glob` parameter matches it literally. If it also contains `'`, it goes in double quotes instead. Any other name with a space or one of `' " # ( ) { } [ ] | ;`, or one that starts with `-` or `$` or reads as a number, goes in backticks. The menu shows the name without the quotes:

```nu
# In a directory containing `#tag.md`, `-flag.txt`, `[draft].md`, `docs/`, `my notes.txt` and `notes.txt`
'open ' | commandline complete --detailed | select value display_override?
# => ╭───┬────────────────┬──────────────────╮
# => │ # │     value      │ display_override │
# => ├───┼────────────────┼──────────────────┤
# => │ 0 │ `#tag.md`      │ #tag.md          │
# => │ 1 │ `-flag.txt`    │ -flag.txt        │
# => │ 2 │ '[draft].md'   │ [draft].md       │
# => │ 3 │ docs/          │                  │
# => │ 4 │ `my notes.txt` │ my notes.txt     │
# => │ 5 │ notes.txt      │                  │
# => ╰───┴────────────────┴──────────────────╯
```

You can start a name with a quote yourself, as in `open "my`. Nushell matches what follows the quote and offers the name quoted its own way.

The menu colors file and directory names with the colors in the `LS_COLORS` environment variable, the same ones [`ls`](/commands/docs/ls.md) uses (see [`LS_COLORS`](./coloring_and_theming.md#ls-colors-colors-for-the-ls-command)). When `LS_COLORS` isn't set, Nushell uses its own defaults. Set `$env.config.completions.use_ls_colors = false` to show them in the menu's plain text style instead. The colors also need `$env.config.use_ansi_coloring` to be on.

## External Completions

External completers can also be integrated, instead of relying solely on Nushell ones.

For this, set `$env.config.completions.external.completer` in `config.nu` to a [closure](types_of_data.md#closures). Nushell calls it to complete the arguments of external commands, that is, commands that aren't built-in, custom, or [`extern`](externs.md) commands. Like any other completer, the closure asks for `token`, `place` or `buffer` by naming its parameters, and it can return the same values as a custom completer. When the closure returns `null`, Nushell falls back to file completion. It does the same when the closure fails with an error, while an empty list leaves the menu empty.

Most external completers only need `$place.command`, the command being completed as a list of words. For example, typing `git checkout ma` and pressing <kbd>Tab</kbd> gives the closure `[git, checkout, ma]`, and typing `my-command --arg1 ` gives `[my-command, --arg1, ""]`, with an empty string for the argument that hasn't been typed yet. Aliases are already expanded: if `gco` is an alias for `git checkout`, typing `gco ma` also gives `[git, checkout, ma]`.

You can configure the closure to run an external completer, such as [carapace](https://github.com/carapace-sh/carapace-bin). To give one external command its own completions instead, see [Generating completions for an external command](/cookbook/system.md#generating-completions-for-an-external-command). This example will enable carapace external completions:

```nu
$env.config.completions.external.completer = {|place|
    carapace $place.command.0 nushell ...$place.command | from json
}
```

::: tip Note
The `enable` and `max_results` settings in `$env.config.completions.external` control whether (and how many) external command names from your `PATH` are offered when completing a command name. They don't affect the external completer.

- `enable` defaults to `true`. With `false`, command name completion lists only Nushell's own commands. Turn it off when `PATH` includes slow filesystems, such as network drives or WSL's mounts of Windows directories, where scanning them makes <kbd>Tab</kbd> lag. Typing `^` before the name still lists the executables.
- `max_results` defaults to `100`. Nushell stops collecting matching executables once it has this many, taking them in the order it finds them while walking `PATH`, so a low limit can leave out names that would sort first. The limit also applies to the list after `^`.
  :::

To have the external completer run a picker such as `fzf`, make the closure call an `@interactive` command, as shown in [Interactive Completers](#interactive-completers).

To use the external completer for a custom command as well, mark the command with [`@complete external`](#command-wide-completers).

[More examples of external completers can be found in the cookbook](../cookbook/external_completers.md).

## Completion settings

The settings in `$env.config.completions` decide how Nushell matches, sorts and inserts suggestions. The first three apply to every kind of completion, from file names and flags to the lists that completers return. In its [`options` record](#options-for-custom-completions), a completer can choose its own algorithm and case sensitivity, and turn sorting off.

- `algorithm` decides which suggestions match what you typed. `"prefix"`, the default, keeps the ones that start with it, `"substring"` the ones that contain it anywhere, and `"fuzzy"` the ones that contain its characters in order, with gaps allowed. In a path, each part between separators is matched separately.
- `sort` is `"smart"` (the default) or `"alphabetical"`. The two differ only with the `fuzzy` algorithm, where `smart` puts the closest matches first. With `prefix` and `substring`, suggestions are always in alphabetical order.
- `case_sensitive` defaults to `false`, so typing `MA` matches `main`.

```nu
def branches [] { [main maintenance fix/main-crash remain merge-all] }
def switch-to [branch: string@branches] { }
'switch-to ma' | commandline complete | str join ', '
# => main, maintenance
$env.config.completions.algorithm = "substring"
'switch-to ma' | commandline complete | str join ', '
# => fix/main-crash, main, maintenance, remain
$env.config.completions.algorithm = "fuzzy"
'switch-to ma' | commandline complete | str join ', '
# => main, maintenance, fix/main-crash, merge-all, remain
$env.config.completions.sort = "alphabetical"
'switch-to ma' | commandline complete | str join ', '
# => fix/main-crash, main, maintenance, merge-all, remain
```

With `fuzzy`, names are compared exactly, both for `alphabetical` order and to order equally close matches under `smart`. A name that starts with an uppercase letter therefore comes before every lowercase one. With `prefix` and `substring`, the order ignores case unless `case_sensitive` is `true`.

The next settings change what <kbd>Tab</kbd> does in a menu with the `columnar` or `ide` layout, which includes the default completion and IDE completion menus:

- `quick` (default `true`) inserts the suggestion at once when there is only one, without opening the menu. With `false`, the menu opens even for a single suggestion, and you accept it with <kbd>Enter</kbd> or <kbd>Tab</kbd>. While a menu is open, `quick` also makes <kbd>Backspace</kbd> close it, unless `completions.persistent_menus` is `true`, in which case the menu stays open and updates instead (see [Menus](./line_editor.md#menus)).
- `partial` (default `true`) fills in the text that all the suggestions share before it shows the menu. If the only suggestions are `report` and `repository`, <kbd>Tab</kbd> after `re` changes the line to `repo` and opens the menu. With `false`, <kbd>Tab</kbd> opens the menu and leaves the line as you typed it.

`use_ls_colors` (default `true`) colors file and directory names, as described in [File and directory names](#file-and-directory-names). The settings under `completions.external` are described in [External Completions](#external-completions).
