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

In the first line, we create a custom command that will return a list of three different animals. These are the values we'd like to use in the completion. Once we've created this command, we can now use it to provide completions for other custom commands and `extern`s.

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

## Custom completion and `extern`

A powerful combination is adding custom completions to [known `extern` commands](externs.md). These work the same way as adding a custom completion to a custom command: by creating the custom completion and then attaching it with a `@` to the type of one of the positional or flag arguments of the `extern`.

If you look closely at the examples in the default config, you'll see this:

```
export extern "git push" [
    remote?: string@"nu-complete git remotes", # the name of the remote
    refspec?: string@"nu-complete git branches"# the branch / refspec
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

## External completions

External completers can also be integrated, instead of relying solely on Nushell ones.
For this set the `external_completer` field in `config.nu` to a block which will be evaluated if no Nushell completions were found.
You can configure the block to run an external completer, such as [carapace](https://github.com/rsteube/carapace-bin).

This example should enable carapace external completions:

```nu
# config.nu
let carapace_completer = {|spans|
    carapace $spans.0 nushell $spans | from json
}

# The default config record. This is where much of your global configuration is setup.
let-env config = {
    # ... your config
    completions: {
        external: {
            enable: true
            max_results: 100
            completer: $carapace_completer
        }
    }
}
```

Multiple completers can be defined as such:

```nu
let external_completer = {|spans| 
  {
    $spans.0: { default_completer $spans | from json } # default
    ls: { ls_completer $spans | from json }
    git: { git_completer $spans | from json }
  } | get $spans.0 | each {|it| do $it}
}
```

> When the block returns unparsable json (e.g. an empty string) it defaults to file completion.
