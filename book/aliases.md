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

## Path Aliases

You may want to add paths to executables as aliases. In order to do this you can use the `run-external` command to run the program.

Here is an alias that will run Firefox (on Windows):

```
alias firefox = run-external 'C:\Program Files\Mozilla Firefox\firefox.exe'
```

<!-- Is there a way to get rid of this? I know this doesnt happen with firefox but with other apps like gimp it waits -->

_Note: The terminal may for the program to exit before continuing._

## Persisting

To make your alias persistent it must be added to your _config.nu_ file.

For more details about how to persist aliases so that they're visible when you start up Nushell, see the [configuration chapter](configuration.md).
