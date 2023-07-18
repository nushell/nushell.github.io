# Custom completions

Custom completions allow you to mix together two features of Nushell: custom commands and completions. With them, you're able to create commands that handle the completions for positional parameters and flag parameters. These custom completions work both custom commands and [known external, or `extern`, commands](externs.md).

There are two parts to a custom command: the command that handles a completion and attaching this command to the type of another command using `@`.

## Example custom completion

Let's look at an example:

```
> def animals [] { ["cat", "dog", "eel" ] }
> def my-command [animal: string@animals] { print $animal }
>| my-command
cat                 dog                 eel
```

In the first line, we create a custom command that will return a list of three different animals. These are the values we'd like to use in the completion. Once we've created this command, we can now use it to provide completions for other custom commands and [`extern`](/commands/docs/extern.md)s.

In the second line, we use `string@animals`. This tells Nushell two things: the shape of the argument for type-checking and the custom completion to use if the user wants to complete values at that position.

On the third line, we type the name of our custom command `my-command` followed by hitting space and then the `<tab>` key. This brings up our completions. Custom completions work the same as other completions in the system, allowing you to type `e` followed by the `<tab>` key and get "eel" automatically completed.

## Modules and custom completions

You may prefer to keep your custom completions away from the public API for your code. For this, you can combine modules and custom completions.

Let's take the example above and put it into a module:

```
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    export def my-command [animal: string@animals] {
        print $animal
    }
}
```

In our module, we've chosen to export only the custom command `my-command` but not the custom completion `animals`. This allows users of this module to call the command, and even use the custom completion logic, without having access the the custom completion. This keeps the API cleaner, while still offering all the same benefits.

This is possible because custom completion tags using `@` are locked-in as the command is first parsed.

## Context aware custom completions

It is possible to pass the context to the custom completion command. This is useful in situations where it is necessary to know previous arguments or flags to generate accurate completions.

Let's apply this concept to the previous example:

```
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    def animal-names [context: string] {
        {
            cat: ["Missy", "Phoebe"]
            dog: ["Lulu", "Enzo"]
            eel: ["Eww", "Slippy"]
        } | get -i ($context | split words | last)
    }

    export def my-command [
        animal: string@animals
        name: string@animal-names
    ] {
        print $"The ($animal) is named ($name)."
    }
}
```

Here, the command `animal-names` returns the appropriate list of names. This is because `$context` is a string with where the value is the command that has been typed until now.

```
>| my-command
cat                 dog                 eel
>| my-command dog
Lulu                Enzo
>my-command dog enzo
The dog is named Enzo
```

On the second line, once we press the `<tab>` key, the argument `"my-command dog"` is passed to the `animal-names` command as context.

## Custom completion and [`extern`](/commands/docs/extern.md)

A powerful combination is adding custom completions to [known `extern` commands](externs.md). These work the same way as adding a custom completion to a custom command: by creating the custom completion and then attaching it with a `@` to the type of one of the positional or flag arguments of the `extern`.

If you look closely at the examples in the default config, you'll see this:

```
export extern "git push" [
    remote?: string@"nu-complete git remotes",  # the name of the remote
    refspec?: string@"nu-complete git branches" # the branch / refspec
    ...
]
```

Custom completions will serve the same role in this example as in the previous examples. The examples above call into two different custom completions, based on the position the user is currently in.

## Custom descriptions

As an alternative to returning a list of strings, a completion function can also return a list of records with a `value` and `description` field.

```
def my_commits [] {
    [
        { value: "5c2464", description: "Add .gitignore" },
        { value: "f3a377", description: "Initial commit" }
    ]
}
```

> **Note**
>
> with the following snippet
>
> ```nu
> def my-command [commit: string@my_commits] {
>     print $commit
> }
> ```
>
> be aware that, even though the completion menu will show you something like
>
> ```nu
> >_ my-command <TAB>
> 5c2464  Add .gitignore
> f3a377  Initial commit
> ```
>
> only the value, i.e. "5c2464" or "f3a377", will be used in the command arguments!

## External completions

External completers can also be integrated, instead of relying solely on Nushell ones.

For this, set the `external_completer` field in `config.nu` to a [closure](types_of_data.md#closures) which will be evaluated if no Nushell completions were found.

```nu
> $env.config.completions.external = {
>     enable: true
>     max_results: 100
>     completer: $completer
> }
```

You can configure the closure to run an external completer, such as [carapace](https://github.com/rsteube/carapace-bin).

When the closure returns unparsable json (e.g. an empty string) it defaults to file completion.

An external completer is a function that takes the current command as a string list, and outputs a list of records with `value` and `description` keys, like custom completion functions.

> **Note**
> This closure will accept the current command as a list. For example, typing `my-command --arg1 <tab>` will receive `[my-command --arg1 " "]`.

This example will enable carapace external completions:

```nu
let carapace_completer = {|spans|
    carapace $spans.0 nushell $spans | from json
}
```

[More examples of custom completers can be found in the cookbook](../cookbook/external_completers.md).
