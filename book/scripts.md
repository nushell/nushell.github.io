# Scripts

In Nushell, you can write and run scripts in the Nushell language. To run a script, you can pass it as an argument to the `nu` commandline application:

```nu
nu myscript.nu
```

This will run the script to completion in a new instance of Nu. You can also run scripts inside the _current_ instance of Nu using [`source`](/commands/docs/source.md):

```nu
source myscript.nu
```

To use a script as one stage of a pipeline, use [`run`](/commands/docs/run.md), described in [Scripts in a Pipeline](#scripts-in-a-pipeline) below.

Let's look at an example script file:

```nu
# hello.nu
def greet [name] {
  ["hello" $name]
}

greet "world"
```

A script file defines the definitions for custom commands as well as the main script itself, which will run after the custom commands are defined.

In the above example, first `greet` is defined by the Nushell interpreter. This allows us to later call this definition. We could have written the above as:

```nu
greet "world"

def greet [name] {
  ["hello" $name]
}
```

There is no requirement that definitions have to come before the parts of the script that call the definitions, allowing you to put them where you feel comfortable.

Keep in mind that a script displays only the value of its last pipeline. In this second version the last pipeline is the `def`, so `greet` still runs, but its result isn't displayed. Use [`print`](/commands/docs/print.md) to display a value from anywhere in a script.

## How Scripts are Processed

In a script, definitions run first. This allows us to call the definitions using the calls in the script.

After the definitions run, we start at the top of the script file and run each group of commands one after another.

## Script Lines

To better understand how Nushell sees lines of code, let's take a look at an example script:

```nu
print "a"
"b"; "c" | str uppercase
# => a
# => C
```

When this script is run, Nushell will first run `print "a"` to completion, which prints `a`. Next, Nushell will run `"b"; "c" | str uppercase` following the rules in the ["Semicolons" section](pipelines.html#semicolons): the value `"b"` is discarded, and `"c" | str uppercase` is a normal pipeline. Since it is the last pipeline of the script, its result, `C`, is displayed.

## Parameterizing Scripts

Script files can optionally contain a special "main" command. `main` will be run after any other Nu code, and is primarily used to allow positional parameters and flags in scripts. You can pass arguments to scripts after the script name (`nu <script name> <script args>`).

For example:

```nu
# add_ten.nu
def main [x: int] {
  $x + 10
}
```

```nu
nu add_ten.nu 100
# => 110
```

## Argument Type Interpretation

By default, arguments provided to a script are interpreted with the type `Type::Any`, implying that they are not constrained to a specific data type and can be dynamically interpreted as fitting any of the available data types during script execution.

In the previous example, `main [x: int]` denotes that the argument x should possess an integer data type. However, if arguments are not explicitly typed, they will be parsed according to their apparent data type.

For example:

```nu
# implicit_type.nu
def main [x] {
  $"Hello ($x | describe) ($x)"
}
```

```nu
# explicit_type.nu
def main [x: string] {
  $"Hello ($x | describe) ($x)"
}
```

```nu
nu implicit_type.nu +1
# => Hello int 1

nu explicit_type.nu +1
# => Hello string +1
```

To receive an argument exactly as it was typed, the way an external command would, give the parameter the type `external_arg`. Nushell then doesn't convert the argument at all. An unquoted argument arrives as a `glob` value (use [`into string`](/commands/docs/into_string.md) if you need a string). This also works for flags and rest parameters.

```nu
# external_type.nu
def main [x: external_arg] {
  $"Hello ($x | describe) ($x)"
}
```

```nu
nu implicit_type.nu 007
# => Hello int 7

nu external_type.nu 007
# => Hello glob 007
```

Unlike `string`, `external_arg` also accepts arguments such as `true` that Nushell would otherwise parse as a different type: `nu explicit_type.nu true` fails with `Parse mismatch: expected string`, while `nu external_type.nu true` prints `Hello glob true`.

## Arguments Starting with a Dash

Nushell usually reads an argument that starts with `-` as a flag. To pass such a value as a positional argument, put `--` in front of it. Every argument after `--` is treated as a positional argument, even if it looks like a flag:

```nu
# greet.nu
def main [--upper, name: string] {
  if $upper { $name | str uppercase } else { $name }
}
```

```nu
nu greet.nu -alice
# => Error: nu::parser::unknown_flag
# =>
# =>   × The `greet.nu` command doesn't have flag `-a`.
# =>    ╭─[<commandline>:1:7]
# =>  1 │ main -alice
# =>    ·       ┬
# =>    ·       ╰── unknown flag
# =>    ╰────
# =>   help: Use `--help` to see available flags

nu greet.nu -- -alice
# => -alice

nu greet.nu --upper -- -alice
# => -ALICE
```

## Arguments with `nu -c`

Code passed to `nu --commands` (`-c`) can define a `main` command as well. Any arguments after the code are passed to it, just like the arguments of a script file. If the code doesn't define `main`, the arguments are ignored.

```nu
nu -c 'def main [name: string, --upper] { if $upper { $name | str uppercase } else { $name } }' nushell --upper
# => NUSHELL
```

A `--` after the code works as described above, so every argument after it is passed to `main` as a positional argument:

```nu
nu -c 'def main [...args] { $args | to nuon }' -- --verbose -x
# => [--verbose, -x]
```

## Subcommands

A script can have multiple [subcommands](custom_commands.html#subcommands), like `run` or `build` for example:

```nu
# myscript.nu
def "main run" [] {
    print "running"
}

def "main build" [] {
    print "building"
}

def main [] {
    print "hello from myscript!"
}
```

You can then execute the script's subcommands when calling it:

```nu
nu myscript.nu
# => hello from myscript!
nu myscript.nu build
# => building
nu myscript.nu run
# => running
```

[Unlike modules](modules/creating_modules.md#main-exports), `main` does _not_ need to be exported in order to be visible. In the above example, our `main` command is not `export def`, however it was still executed when running `nu myscript.nu`. If we had used myscript as a module by running `use myscript.nu`, rather than running `myscript.nu` as a script, trying to execute the `myscript` command would not work since `myscript` is not exported.

It is important to note that you must define a `main` command in order for subcommands of `main` to be correctly exposed. For example, if we had just defined the `run` and `build` subcommands, they wouldn't be accessible when running the script:

```nu
# no_main.nu
def "main run" [] {
    print "running"
}

def "main build" [] {
    print "building"
}
```

```nu
nu no_main.nu build
nu no_main.nu run
```

Neither command prints anything. Without a `main` command, Nushell only runs the script's top-level code (here, just the two definitions) and ignores the arguments.

This is a limitation of the way scripts are currently processed. If your script only has subcommands, you can add an empty `main` to expose the subcommands, like so:

```nu
def main [] {}
```

## Scripts in a Pipeline

`nu myscript.nu` runs a script in a new Nushell process, and `source` runs it in the current scope. To use a script as one stage of a pipeline instead, use [`run`](/commands/docs/run.md). The script receives the pipeline input, and its result is passed on to the next command.

A script without a `main` command is evaluated as a whole, with the pipeline input available as `$in`:

```nu
# shout.nu
str uppercase
```

```nu
"Hello Nushell!" | run shout.nu
# => HELLO NUSHELL!

"Hello Nushell!" | run shout.nu | str camel-case
# => helloNushell
```

If the script defines `main`, `run` calls it with the pipeline input and with any arguments given after the script name:

```nu
# prefix.nu
def main [--prefix: string = ">"] {
  each {|line| $"($prefix) ($line)" }
}
```

```nu
[a b] | run prefix.nu --prefix ">>>"
# => ╭───┬───────╮
# => │ 0 │ >>> a │
# => │ 1 │ >>> b │
# => ╰───┴───────╯
```

The script runs in its own scope, so environment changes it makes (such as setting `$env.FOO` or calling `cd`) don't carry over to the caller.

Like `source`, `run` is a parser keyword: the file name must be a constant, and the file is looked up in the current directory and then in `$NU_LIB_DIRS`. The script is parsed together with the code that calls it. If the script can change after that, for example when a loop calls it again each time you save the file, use `--full-reparse` (`-f`) to reload and reparse it on every call:

```nu
for _ in (watch . --glob=*.nu) { run --full-reparse ./test.nu }
```

## Shebangs (`#!`)

On Linux and macOS you can optionally use a [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>) to tell the OS that a file should be interpreted by Nu. For example, with the following in a file named `myscript`:

```nu
#!/usr/bin/env nu
"Hello World!"
```

```nu
./myscript
# => Hello World!
```

For script to have access to standard input, `nu` should be invoked with `--stdin` flag. For example, in a file named `stdin-script`:

```nu
#!/usr/bin/env -S nu --stdin
def main [] {
  echo $"stdin: ($in)"
}
```

```nu
echo "Hello World!" | ./stdin-script
# => stdin: Hello World!
```
