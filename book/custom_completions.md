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
my-command
# => cat                 dog                 eel
```

The first line defines a custom command which returns a list of three different animals. These are the possible values for the completion.

::: tip
To suppress completions for an argument (for example, an `int` that can accept any integer), define a completer that returns an empty list (`[ ]`).
:::

In the second line, `string@animals` tells Nushell two things—the shape of the argument for type-checking and the completer which will suggest possible values for the argument.

The third line is demonstration of the completion. Type the name of the custom command `my-command`, followed by a space, and then the <kbd>Tab</kbd> key. This displays a menu with the possible completions. Custom completions work the same as other completions in the system, allowing you to type `e` followed by the <kbd>Tab</kbd> key to complete "eel" automatically.

::: tip
When the completion menu is displayed, the prompt changes to include the `|` character by default. This can be changed using `$env.config.menus.marker`.
:::

## Options for Custom Completions

If you want to choose how your completions are filtered and sorted, you can return a record rather than a list. The list of completion suggestions should be under the `completions` key of this record. Optionally, it can also have, under the `options` key, a record containing the following optional settings:

- `sort` - Set this to `false` to stop Nushell from sorting your completions. By default, this is `true`, and completions are sorted according to `$env.config.completions.sort`.
- `case_sensitive` - Set to `true` for the custom completions to be matched case sensitively, `false` otherwise. Used for overriding `$env.config.completions.case_sensitive`.
- `completion_algorithm` - Set this to either `prefix` or `fuzzy` to choose how your completions are matched against the typed text. Used for overriding `$env.config.completions.algorithm`.
- `positional` - When prefix matching is used, setting this to `false` will use substring matching instead. `true` by default.

Here's an example demonstrating how to set these options:

```nu
def animals [] {
    {
        options: {
            case_sensitive: false,
            completion_algorithm: prefix,
            positional: false,
            sort: false,
        },
        completions: [cat, rat, bat]
    }
}
def my-command [animal: string@animals] { print $animal }
```

Now, if you try to complete `A`, you get the following completions:

```nu
>| my-command A
cat                 rat                 bat
```

Because we made matching case-insensitive and used `positional: false`, Nushell will find the substring "a" in all of the completion suggestions. Additionally, because we set `sort: false`, the completions will be left in their original order. This is useful if your completions are already sorted in a particular order unrelated to their text (e.g. by date).

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

In this module, only the the custom command `my-command` is exported. The `animals` completion is not exported. This allows users of this module to call the command, and even use the custom completion logic, without having access to the completion command itself. This results in a cleaner and more maintainable API.

::: tip
Completers are attached to custom commands using `@` at parse time. This means that, in order for a change to the completion command to take effect, the public custom command must be reparsed as well. Importing a module satisfies both of these requirements at the same time with a single `use` statement.
:::

## Context Aware Custom Completions

It is possible to pass the context to the completion command. This is useful in situations where it is necessary to know previous arguments or flags to generate accurate completions.

Applying this concept to the previous example:

```nu
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    def animal-names [context: string] {
        match ($context | split words | last) {
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
```

Here, the command `animal-names` returns the appropriate list of names. `$context` is a string where the value is the command-line that has been typed so far.

```nu
>| my-command
cat                 dog                 eel
>| my-command dog
Lulu                Enzo
>my-command dog enzo
The dog is named Enzo
```

On the second line, after pressing the <kbd>tab</kbd> key, the argument `"my-command dog"` is passed to the `animal-names` completer as context.

::: tip
Completers can also obtain the current cursor position on the command-line using:

```nu
def completer [context:string, position:int] {}
```

:::

## Custom Completion and [`extern`](/commands/docs/extern.md)

A powerful combination is adding custom completions to [known `extern` commands](externs.md). These work the same way as adding a custom completion to a custom command: by creating the custom completion and then attaching it with a `@` to the type of one of the positional or flag arguments of the `extern`.

If you look closely at the examples in the default config, you'll see this:

```nu
export extern "git push" [
    remote?: string@"nu-complete git remotes",  # the name of the remote
    refspec?: string@"nu-complete git branches" # the branch / refspec
    ...
]
```

Custom completions will serve the same role in this example as in the previous examples. The examples above call into two different custom completions, based on the position the user is currently in.

## Custom Descriptions and Styles

As an alternative to returning a list of strings, a completion function can also return a list of records with a `value` field as well as optional `description` and `style` fields. The style can be one of the following:

- A string with the foreground color, either a hex code or a color name. For a list of valid color names, see `ansi --list`.
- A record with the fields `fg` (foreground color), `bg` (background color), and `attr` (attributes such as underline and bold). This record is in the same format that `ansi --escape` accepts.
- The same record, but converted to a JSON string.

```nu
def my_commits [] {
    [
        { value: "5c2464", description: "Add .gitignore", style: red },
        { value: "f3a377", description: "Initial commit", style: { fg: green, bg: "#66078c", attr: u } }
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
>_ [36mmy-command[0m <TAB>
[1;31m5c2464[0m  [33mAdd .gitignore[0m
[4;48;2;102;7;140;32mf3a377  [0m[33mInitial commit[0m
```

... only the value (i.e., "5c2464" or "f3a377") will be used in the command arguments!
:::

## External Completions

External completers can also be integrated, instead of relying solely on Nushell ones.

For this, set the `external_completer` field in `config.nu` to a [closure](types_of_data.md#closures) which will be evaluated if no Nushell completions were found.

```nu
$env.config.completions.external = {
    enable: true
    max_results: 100
    completer: $completer
}
```

You can configure the closure to run an external completer, such as [carapace](https://github.com/rsteube/carapace-bin).

When the closure returns unparsable json (e.g., an empty string) it defaults to file completion.

An external completer is a function that takes the current command as a string list, and outputs a list of records with `value` and `description` keys, like custom completion functions.

::: tip Note
This closure will accept the current command as a list. For example, typing `my-command --arg1 <tab>` will receive `[my-command --arg1 " "]`.
:::

This example will enable carapace external completions:

```nu
let carapace_completer = {|spans|
    carapace $spans.0 nushell ...$spans | from json
}
```

[More examples of custom completers can be found in the cookbook](../cookbook/external_completers.md).
