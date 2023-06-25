# Aliases

Aliases in Nushell offer a way of doing a simple replacement of command calls (both external and internal commands). This allows you to create a shorthand name for a longer command, including its default arguments.

For example, let's create an alias called `ll` which will expand to `ls -l`.

```
> alias ll = ls -l
```

We can now call this alias:

```
> ll
```

Once we do, it's as if we typed `ls -l`. This also allows us to pass in flags or positional parameters. For example, we can now also write:

```
> ll -a
```

And get the equivalent to having typed `ls -l -a`.

## List all loaded aliases

Your useable aliases can be seen in `$nu.scope.aliases`.

## Persisting

To make your aliases persistent they must be added to your _config.nu_ file by running `config nu` to open an editor and inserting them, and then restarting nushell.

## Piping in aliases

Note that `alias uuidgen = uuidgen | tr A-F a-f` (to make uuidgen on mac behave like linux) won't work.
The solution is to define a command without parameters that calls the system program `uuidgen` via `^`.

```
def uuidgen [] { ^uuidgen | tr A-F a-f }
```

See more in the [custom commands](custom_commands.md) section of this book.

Or a more idiomatic example with nushell internal commands

```
def lsg [] { ls | sort-by type name -i | grid -c | str trim }
```

displaying all listed files and folders in a grid.
