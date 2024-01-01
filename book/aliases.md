# Aliases

Aliases in Nushell offer a way of doing a simple replacement of command calls (both external and internal commands). This allows you to create a shorthand name for a longer command, including its default arguments.

For example, let's create an alias called `ll` which will expand to `ls -l`.

```nu
> alias ll = ls -l
```

We can now call this alias:

```nu
> ll
```

Once we do, it's as if we typed `ls -l`. This also allows us to pass in flags or positional parameters. For example, we can now also write:

```nu
> ll -a
```

And get the equivalent to having typed `ls -l -a`.

## List all loaded aliases

Your useable aliases can be seen in `scope aliases` and `help aliases`.

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

## Piping in aliases

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

## Replacing aliases
> Caution! When replacing commands like below, it is not possible to pass flags to the command.

```nu
alias ll = do { ls -l | sort-by type name -i}
alias ls = do { ls | sort-by type name -i} # Needs to be below other alias like `ll` when using ls
```
The reason why `ls` needs to be below alias `ll` is because we are "overriding" the normal `ls` with this function that does not take any arguments.
And the ls is used with flag `ls -l` in the `ll` alias.

Another way to do it is to shadow the `ls` command. This way you do not use the "hacky" way using `do` command.

```nu
# An escape hatch to have access to the original ls command
alias core-ls = ls

# Call the built-in ls command with a path parameter
def old-ls [path] {
  core-ls $path | sort-by type name -i
}

# Shadow the ls command so that you always have the sort type you want
def ls [path?] {
  if $path == null {
    old-ls .
  } else {
    old-ls $path
  }
}
```

