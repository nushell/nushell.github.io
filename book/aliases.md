# Aliases

Aliases in Nushell offer a way of doing a simple, textual replacement. This allows you to create a shorthand name for a longer command, including its default arguments.

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

## How to write an alias with Pipes

If you want to add a pipe to your alias you must must enclose it with parentheses which are a pair of round brackets ( ) used to mark off your set of commands with pipes.

```
alias lsname = (ls | get name)
```

Here is an alias with more than one pipe

```
alias lt = (ls | sort-by modified -r | sort-by type)
```

## Persisting

To make your alias persistent it must be added to your *config.nu* file.

For more details about how to persist aliases so that they're visible when you start up Nushell, see the [configuration chapter](configuration.md).
