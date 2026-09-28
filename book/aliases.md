# Aliases

Aliases in Nushell offer a way of doing a simple replacement of command calls (both external and internal commands). This allows you to create a shorthand name for a longer command, including its default arguments.

For example, let's create an alias called `ll` which will expand to `ls -l`.

```nu
alias ll = ls -l
```

We can now call this alias:

```nu
ll
```

Once we do, it's as if we typed `ls -l`. This also allows us to pass in flags or positional parameters. For example, we can now also write:

```nu
ll -a
```

And get the equivalent to having typed `ls -l -a`.

## Aliasing Parent Commands

An alias can also point to a command that has subcommands, such as `math` or `str`. The subcommands are then available through the alias as well:

```nu
alias m = math
[1 2 3 4] | m sum
# => 10
```

This is particularly handy for plugins with many subcommands. For example, after `alias pl = polars`, you can write `pl into-df`, `pl select` and `pl collect`.

## List All Loaded Aliases

Your useable aliases can be seen in `scope aliases` and `help aliases`.

Running `help` on an alias shows what it expands to, followed by the help for the aliased command. For example, with an alias for a small custom command:

```nu
# Say hello to someone
def greet [name: string] { $"Hello, ($name)!" }
alias hi = greet
help hi
# => Alias for greet
# =>
# => Alias: hi
# =>
# => Expansion:
# =>   greet
# =>
# => Say hello to someone
# =>
# => Usage:
# =>   > greet <name>
# =>
# => Flags:
# =>   -h, --help: Display the help message for this command
# =>
# => Command Type:
# =>   > custom
# =>
# => Parameters:
# =>   name <string>
# =>
# => Input/output types:
# =>   ╭───┬───────┬────────╮
# =>   │ # │ input │ output │
# =>   ├───┼───────┼────────┤
# =>   │ 0 │ any   │ any    │
# =>   ╰───┴───────┴────────╯
```

## Persisting

To make your aliases persistent they must be added to your _config.nu_ file by running `config nu` to open an editor and inserting them, and then restarting nushell.
e.g. with the above `ll` alias, you can add `alias ll = ls -l` anywhere in _config.nu_

```nu
$env.config = {
    # main configuration
}

alias ll = ls -l

# some other config and script loading
```

## Piping in Aliases

Note that `alias uuidgen = uuidgen | tr A-F a-f` (to make uuidgen on mac behave like linux) won't work.
The solution is to define a command without parameters that calls the system program `uuidgen` via `^`.

```nu
def uuidgen [] { ^uuidgen | tr A-F a-f }
```

See more in the [custom commands](custom_commands.md) section of this book.

Or a more idiomatic example with nushell internal commands

```nu
def lsg [] { ls | sort-by type name -i | grid -c | str trim }
```

displaying all listed files and folders in a grid.

## Replacing Existing Commands Using Aliases

::: warning Caution!
When replacing commands it is best to "back up" the command first and avoid a recursion error.
:::

::: tip Note
Parser keywords such as `if`, `for` or `let` can't be replaced. Using one as the name of an alias (or a custom command) is a `nu::parser::name_is_keyword` error.
:::

How to back up a command like `ls`:

```nu
alias core-ls = ls    # This will create a new alias core-ls for ls
```

Now you can use `core-ls` as `ls` in your nu-programming, even after `ls` itself has been replaced.

The reason you need to use alias is because, unlike `def`, aliases are position-dependent. So, you need to "back up" the old command first with an alias, before re-defining it.
If you do not backup the command and you replace the command using `def` you get a recursion error.

```nu
def ls [] { ls }; ls    # Do *NOT* do this! This will throw a recursion error
# => Error: nu::shell::recursion_limit_reached
# =>
# =>   × Recursion limit (50) reached
# =>    ╭─[repl_entry #1:1:11]
# =>  1 │ def ls [] { ls }; ls    # Do *NOT* do this! This will throw a recursion error
# =>    ·           ───┬──
# =>    ·              ╰── This called itself too many times
# =>    ╰────
```

The recommended way to replace an existing command is to shadow the command, and to call the original
built-in inside the new definition with the `%` sigil. `%ls` always runs the built-in `ls`, even when a
custom command or alias shadows it, so there is no recursion.
Here is an example shadowing the `ls` command.

```nu
# List the filenames, sizes, and modification times of items in a directory.
def ls [
    --all (-a),         # Show hidden files
    --long (-l),        # Get all available columns for each entry (slower; columns are platform-dependent)
    --short-names (-s), # Only print the file names, and not the path
    --full-paths (-f),  # display paths as absolute paths
    --du (-d),          # Display the apparent directory size ("disk usage") in place of the directory metadata size
    --directory (-D),   # List the specified directory itself instead of its contents
    --mime-type (-m),   # Show mime-type in type column instead of 'file' (based on filenames only; files' contents are not examined)
    --threads (-t),     # Use multiple threads to list contents. Output will be non-deterministic.
    ...pattern: glob,   # The glob pattern to use.
]: [ nothing -> table ] {
    let pattern = if ($pattern | is-empty) { [ '.' ] } else { $pattern }
    (%ls
        --all=$all
        --long=$long
        --short-names=$short_names
        --full-paths=$full_paths
        --du=$du
        --directory=$directory
        --mime-type=$mime_type
        --threads=$threads
        ...$pattern
    ) | sort-by type name -i
}
```

You can also type `%ls` at the prompt to run the built-in `ls` while it is shadowed.

Before the `%` sigil existed, the body called a backup alias instead, such as `ls-builtin` created with `alias ls-builtin = ls`. That still works, but only if the alias is created while `ls` still refers to the built-in command.

See [Shadowing Built-in Commands](custom_commands.md#shadowing-built-in-commands) for more about the `%` sigil.
