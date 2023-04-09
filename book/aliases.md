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
```
## List all loaded aliases

Your useable aliases can be seen in `$nu.scope.aliases`.

## Persisting

To make your alias persistent it must be added to your _config.nu_ file.

For more details about how to persist aliases so that they're visible when you start up Nushell, see the [configuration chapter](configuration.md).
