---
title: Scripts
---

In Nushell, you can write and run scripts in the Nushell language. To run a script, you can pass it as an argument to the `nu` commandline application:

```nu
nu myscript.nu
```

This will run the script to completion in a new instance of Nu. You can also run scripts inside the _current_ instance of Nu using [`source`](/commands/docs/source):

```nu
source myscript.nu
```

Let's look at an example script file:

```nu title="myscript.nu"
def greet [name] {
  ["hello" $name]
}

greet "world"
```

A script file defines the definitions for custom commands as well as the main script itself, which will run after the custom commands are defined.

In the above, first `greet` is defined by the Nushell interpreter. This allows us to later call this definition. We could have written the above as:

```nu title="myscript.nu"
greet "world"

def greet [name] {
  ["hello" $name]
}
```

There is no requirement that definitions have to come before the parts of the script that call the definitions, allowing you to put them where you feel comfortable.

## How scripts are processed

In a script, definitions run first. This allows us to call the definitions using the calls in the script.

After the definitions run, we start at the top of the script file and run each group of commands one after another.

## Script lines

To better understand how Nushell sees lines of code, let's take a look at an example script:

```nu title="myscript.nu"
a
b; c | d
```

When this script is run, Nushell will first run the `a` command to completion and view its results. Next, Nushell will run `b; c | d` following the rules in the ["Semicolons" section](/book/pipelines#semicolons).

## Parameterizing Scripts

Script files can optionally contain a special "main" command. `main` will be run after any other Nu code, and is primarily used to add parameters to scripts. You can pass arguments to scripts after the script name (`nu <script name> <script args>`).

For example:

```nu title="myscript.nu"

def main [x: int] {
  $x + 10
}
```

```nu
nu myscript.nu 100
# 110
```

## Argument Type Interpretation

By default, arguments provided to a script are interpreted with the type `Type::Any`, implying that they are not constrained to a specific data type and can be dynamically interpreted as fitting any of the available data types during script execution.

In the previous example, `main [x: int]` denotes that the argument x should possess an integer data type. However, if arguments are not explicitly typed, they will be parsed according to their apparent data type.

For example:

```nu title="implicit_type.nu"
def main [x] {
  $"Hello ($x | describe) ($x)"
}
```

```nu title="explicit_type.nu"
def main [x: string] {
  $"Hello ($x | describe) ($x)"
}
```

```nu
nu implicit_type.nu +1
# Hello int 1

nu explicit_type.nu +1
# Hello string +1
```

## Subcommands

A script can have multiple sub-commands like `run`, `build`, etc. which allows to execute a specific main sub-function. The important part is to expose them correctly with `def main [] {}`. See more details in the [Custom Command](/book/custom_commands#sub-commands) section.

For example:

```nu title="myscript.nu"
def "main run" [] {
    print "running"
}

def "main build" [] {
    print "building"
}

# important for the command to be exposed to the outside
def main [] {}
```

```nu
nu myscript.nu build
# building
nu myscript.nu run
# running
```

## Shebangs (`#!`)

On Linux and macOS you can optionally use a [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>) to tell the OS that a file should be interpreted by Nu. For example, with the following in a file named `myscript`:

```nu title="myscript"
#!/usr/bin/env nu
"Hello World!"
```

```nu
./myscript
# Hello World!
```

For script to have access to standard input, `nu` should be invoked with `--stdin` flag:

```nu title="myscript"
#!/usr/bin/env -S nu --stdin
echo $"stdin: ($in)"
```

```nu
echo "Hello World!" | ./myscript
# stdin: Hello World!
```
