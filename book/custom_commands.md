# Custom Commands

As with any programming language, you'll quickly want to save longer pipelines and expressions so that you can call them again easily when needed.

This is where custom commands come in.

::: tip Note
Custom commands are similar to functions in many languages, but in Nushell, custom commands _act as first-class commands themselves_. As you'll see below, they are included in the Help system along with built-in commands, can be a part of a pipeline, are parsed in real-time for type errors, and much more.
:::

[[toc]]

## Creating and Running a Custom Command

Let's start with a simple `greet` custom command:

```nu
def greet [name] {
  $"Hello, ($name)!"
}
```

Here, we define the `greet` command, which takes a single parameter `name`. Following this parameter is the block that represents what will happen when the custom command runs. When called, the custom command will set the value passed for `name` as the `$name` variable, which will be available to the block.

To run this command, we can call it just as we would call built-in commands:

```nu
greet "World"
# => Hello, World!
```

## Returning Values from Commands

You might notice that there isn't a `return` or `echo` statement in the example above.

Like some other languages, such as PowerShell and JavaScript (with arrow functions), Nushell features an _implicit return_, where the value of the final expression in the command becomes its return value.

In the above example, there is only one expression—The string. This string becomes the return value of the command.

```nu
greet "World" | describe
# => string
```

A typical command, of course, will be made up of multiple expressions. For demonstration purposes, here's a non-sensical command that has 3 expressions:

```nu
def eight [] {
  1 + 1
  2 + 2
  4 + 4
}

eight
# => 8
```

The return value, again, is simply the result of the _final_ expression in the command, which is `4 + 4` (8).

Additional examples:

::: details Early return
Commands that need to exit early due to some condition can still return a value using the [`return` statement](/commands/docs/return.md).

```nu
def process-list [] {
  let input_length = length
  if $input_length > 10_000 {
    print "Input list is too long"
    return null
  }

  $in | each {|i|
    # Process the list
    $i * 4.25
  }
}
```

:::

::: details Suppressing the return value
You'll often want to create a custom command that acts as a _statement_ rather than an expression, and doesn't return a a value.

You can use the `ignore` keyword in this case:

```nu
def create-three-files [] {
  [ file1 file2 file3 ] | each {|filename|
    touch $filename
  } | ignore
}
```

Without the `ignore` at the end of the pipeline, the command will return an empty list from the `each` statement.

You could also return a `null` as the final expression. Or, in this contrived example, use a `for` statement, which doesn't return a value (see next example).
:::

::: details Statements which don't return a value
Some keywords in Nushell are _statements_ which don't return a value. If you use one of these statements as the final expression of a custom command, the _return value_ will be `null`. This may be unexpected in some cases. For example:

```nu
def exponents-of-three [] {
  for x in [ 0 1 2 3 4 5 ] {
    3 ** $x
  }
}
exponents-of-three
```

The above command will not display anything, and the return value is empty, or `null` because `for` is a _statement_ which doesn't return a value.

To return a value from an input list, use a filter such as the `each` command:

````nu
def exponents-of-three [] {
  [ 0 1 2 3 4 5 ] | each {|x|
    3 ** $x
  }
}

exponents-of-three

# => ╭───┬─────╮
# => │ 0 │   1 │
# => │ 1 │   3 │
# => │ 2 │   9 │
# => │ 3 │  27 │
# => │ 4 │  81 │
# => │ 5 │ 243 │
# => ╰───┴─────╯
:::

::: details Match expression
```nu
# Return a random file in the current directory
def "random file" [] {
  let files = (ls)
  let num_files = ($files | length)

  match $num_files {
    0 => null  # Return null for empty directory
    _ => {
      let random_file = (random int 0..($num_files - 1))
      ($files | get $random_file)
    }
  }
}
````

In this case, the final expression is the `match` statement which can return:

- `null` if the directory is empty
- Otherwise, a `record` representing the randomly chosen file
  :::

## Custom Commands and Pipelines

Just as with built-in commands, the return value of a custom command can be passed into the next command in a pipeline. Custom commands can also accept pipeline input. In addition, whenever possible, pipeline input and output is streamed as it becomes available.

::: tip Important!
See also: [Pipelines](./pipelines.html)
:::

### Pipeline Output

```nu
> ls | get name
```

Let's move [`ls`](/commands/docs/ls.md) into a command that we've written:

```nu
def my-ls [] { ls }
```

We can use the output from this command just as we would [`ls`](/commands/docs/ls.md).

```nu
> my-ls | get name
# => ╭───┬───────────────────────╮
# => │ 0 │ myscript.nu           │
# => │ 1 │ myscript2.nu          │
# => │ 2 │ welcome_to_nushell.md │
# => ╰───┴───────────────────────╯
```

This lets us easily build custom commands and process their output. Remember that that we don't use return statements like other languages. Instead, the [implicit return](#returning-values-from-a-command) allows us to build pipelines that output streams of data that can be connected to other pipelines.

::: tip Note
The `ls` content is still streamed in this case, even though it is in a separate command. Running this command against a long-directory on a slow (e.g., networked) filesystem would return rows as they became available.
:::

### Pipeline Input

Custom commands can also take input from the pipeline, just like other commands. This input is automatically passed to the custom command's block.

Let's make our own command that doubles every value it receives as input:

```nu
def double [] {
  each { |num| 2 * $num }
}
```

Now, if we call the above command later in a pipeline, we can see what it does with the input:

```nu
[1 2 3] | double
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 4 │
# => │ 2 │ 6 │
# => ╰───┴───╯
```

::: tip Cool!
This command demonstrates both input and output _streaming_. Try running it with an infinite input:

```nu
1.. | each {||} | double
```

Even though the input command hasn't ended, the `double` command can still receive and output values as they become available.

Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the command.
:::

We can also store the input for later use using the [`$in` variable](pipelines.html#pipeline-input-and-the-special-in-variable):

```nu
def nullify [...cols] {
  let start = $in
  $cols | reduce --fold $start { |col, table|
    $table | upsert $col null
  }
}

ls | nullify name size
# => ╭───┬──────┬──────┬──────┬───────────────╮
# => │ # │ name │ type │ size │   modified    │
# => ├───┼──────┼──────┼──────┼───────────────┤
# => │ 0 │      │ file │      │ 8 minutes ago │
# => │ 1 │      │ file │      │ 8 minutes ago │
# => │ 2 │      │ file │      │ 8 minutes ago │
# => ╰───┴──────┴──────┴──────┴───────────────╯
```

## Naming Commands

In Nushell, a command name can be a string of characters. Here are some examples of valid command names: `greet`, `get-size`, `mycommand123`, `my command`, `命令` (English translation: "command"), and even `😊`.

Strings which might be confused with other parser patterns should be avoided. For instance, the following command names might not be callable:

- `1`, `"1"`, or `"1.5"`: Nushell will not allow numbers to be used as command names
- `4MiB` or `"4MiB"`: Nushell will not allow filesizes to be use₫ as command names
- `"number#four"` or `"number^four"`: Carets and hash symbols are not allowed in command names
- `-a`, `"{foo}"`, `"(bar)"`: Will not be callable, as Nushell will interpret them as flags, closures, or expressions.

While names like `"+foo"` might work, they are best avoided as the parser rules might change over time. When in doubt, keep command names as simple as possible.

::: tip
It's common practice in Nushell to separate the words of the command with `-` for better readability. For example `get-size` instead of `getsize` or `get_size`.
:::

::: tip
Because `def` is a parser keyword, the command name must be known at parse time. This means that command names may not be a variable or constant. For example, the following is _not allowed_:

```nu
let name = "foo"
def $name [] { foo }
:::
```

### Subcommands

You can also define subcommands of commands using a space. For example, if we wanted to add a new subcommand to [`str`](/commands/docs/str.md), we can create it by naming our subcommand starting with "str ". For example:

```nu
def "str mycommand" [] {
  "hello"
}
```

Now we can call our custom command as if it were a built-in subcommand of [`str`](/commands/docs/str.md):

```nu
> str mycommand
```

Of course, commands with spaces in their names are defined in the same way:

```nu
def "custom command" [] {
  "This is a custom command with a space in the name!"
}
```

## Parameters

### Multiple parameters

In the `def` command, the parameters are defined in a [`list`](./types_of_data.md#lists). This means that multiple parameters can be separated with spaces, commas, or line-breaks.

For example, here's a version of `greet` that accepts two names. Any of these three definitions will work:

```nu
# Spaces
def greet [name1 name2] {
  $"Hello, ($name1) and ($name2)!"
}

# Commas
def greet [name1, name2] {
  $"Hello, ($name1) and ($name2)!"
}

# Linebreaks
def greet [
  name1
  name2
] {
  $"Hello, ($name1) and ($name2)!"
}
```

### Required positional parameters

The basic argument definitions used above are _positional_. The first argument passed into the `greet` command above is assigned to the `name1` parameter (and, as mentioned above, the `$name1` variable). The second argument becomes the `name2` parameter and the `$name2` variable.

By default, positional parameters are _required_. Using our previous definition of `greet` with two required, positional parameters:

```nu
def greet [name1, name2] {
  $"Hello, ($name1) and ($name2)!"
}

greet Wei Mei
# => Hello, Wei and Mei!

greet Wei
# => Error: nu::parser::missing_positional
# =>
# =>
# => × Missing required positional argument.
# => ╭─[entry #10:1:10]
# => 1 │ greet Mei
# => ╰────
# => help: Usage: greet <name1> <name2> . Use `--help` for more information.
```

::: tip
Try typing a third name after this version of `greet`. Notice that the parser automatically detects the error and highlights the third argument as an error even before execution.
:::

### Optional Positional Parameters

We can define a positional parameter as optional by putting a question mark (`?`) after its name. For example:

```nu
def greet [name?: string] {
  $"Hello, ($name | default 'You')"
}

greet

# => Hello, You
```

::: tip
Notice that the name used to access the variable does not include the `?`; only its definition in the command signature.
:::

When an optional parameter is not passed, its value in the command body is equal to `null`. The above example uses the `default` command to provide a default of "You" when `name` is `null`.

You could also compare the value directly:

```nu
def greet [name?: string] {
  match $name {
    null => "Hello! I don't know your name!"
    _ => $"Hello, ($name)!"
  }
}

greet

# => Hello! I don't know your name!
```

If required and optional positional parameters are used together, then the required parameters must appear in the definition first.

#### Parameters with a Default Value

You can also set a default value for the parameter when it is missing. Parameters with a default value are also optional when calling the command.

```nu
def greet [name = "Nushell"] {
  $"Hello, ($name)!"
}
```

You can call this command either without the parameter or with a value to override the default value:

```nu
greet
# => Hello, Nushell!

greet world
# => Hello, World!
```

You can also combine a default value with a [type annotation](#parameter-types):

```nu
def congratulate [age: int = 18] {
  $"Happy birthday! You are ($age) years old now!"
}
```

### Parameter Types

For each parameter, you can optionally define its type. For example, you can write the basic `greet` command as:

```nu
def greet [name: string] {
  $"Hello, ($name)"
}
```

If a parameter is not type-annotated, Nushell will treat it as an [`any` type](./types_of_data.html#any). If you annotate a type on a parameter, Nushell will check its type when you call the function.

For example, let's say you wanted to only accept an `int` instead of a `string`:

```nu
def greet [name: int] {
  $"hello ($name)"
}

greet World
```

If we try to run the above, Nushell will tell us that the types don't match:

```nu
error: Type Error
  ┌─ shell:6:7
  │
5 │ greet world
  │       ^^^^^ Expected int
```

::: tip Cool!
Type checks are a parser feature. When entering a custom command at the command-line, the Nushell parser can even detect invalid argument types in real-time and highlight them before executing the command.

The highlight style can be changed using a [theme](https://github.com/nushell/nu_scripts/tree/main/themes) or manually using `$env.config.color_config.shape_garbage`.
:::

::: details List of Type Annotations
Most types can be used as type-annotations. In addition, there are a few "shapes" which can be used. For instance:

- `number`: Accepts either an `int` or a `float`
- `path`: A string where the `~` and `.` characters have special meaning and will automatically be expanded to the full-path equivalent. See [Path](/lang-guide/chapters/types/other_types/path.html) in the Language Reference Guide for example usage.
- `directory`: A subset of `path` (above). Only directories will be offered when using tab-completion for the parameter. Expansions take place just as with `path`.
- `error`: Available, but currently no known valid usage. See [Error](/lang-guide/chapters/types/other_types/error.html) in the Language Reference Guide for more information.

The following [types](./types_of_data.html) can be used for parameter annotations:

- `any`
- `binary`
- `bool`
- `cell-path`
- `closure`
- `datetime`
- `duration`
- `filesize`
- `float`
- `glob`
- `int`
- `list`
- `nothing`
- `range`
- `record`
- `string`
- `table`
  :::

### Flags

In addition to positional parameters, you can also define named flags.

For example:

```nu
def greet [
  name: string
  --age: int
] {
    {
      name: $name
      age: $age
    }
}
```

In this version of `greet`, we define the `name` positional parameter as well as an `age` flag. The positional parameter (since it doesn't have a `?`) is required. The named flag is optional. Calling the command without the `--age` flag will set `$age` to `null`.

The `--age` flag can go before or after the positional `name`. Examples:

```nu
greet Lucia --age 23
# => ╭──────┬───────╮
# => │ name │ Lucia │
# => │ age  │ 23    │
# => ╰──────┴───────╯

greet --age 39 Ali
# => ╭──────┬─────╮
# => │ name │ Ali │
# => │ age  │ 39  │
# => ╰──────┴─────╯

greet World
# => ╭──────┬───────╮
# => │ name │ World │
# => │ age  │       │
# => ╰──────┴───────╯
```

Flags can also be defined with a shorthand version. This allows you to pass a simpler flag as well as a longhand, easier-to-read flag.

Let's extend the previous example to use a shorthand flag for the `age` value:

```nu
def greet [
  name: string
  --age (-a): int
] {
    {
      name: $name
      age: $age
    }
  }
```

::: tip
The resulting variable is always based on the long flag name. In the above example, the variable continues to be `$age`. `$a` would not be valid.
:::

Now, we can call this updated definition using the shorthand flag:

```nu
greet Akosua -a 35
# => ╭──────┬────────╮
# => │ name │ Akosua │
# => │ age  │ 35     │
# => ╰──────┴────────╯
```

Flags can also be used as basic switches. When present, the variable based on the switch is `true`. When absent, it is `false`.

```nu
def greet [
  name: string
  --caps
] {
    let greeting = $"Hello, ($name)!"
    if $caps {
      $greeting | str upcase
    } else {
      $greeting
    }
}

greet Miguel --caps
# => HELLO, MIGUEL!

greet Chukwuemeka
# => Hello, Chukwuemeka!
```

You can also assign it to `true`/`false` to enable/disable the flag:

```nu
greet Giulia --caps=false
# => Hello, Giulia!

greet Hiroshi --caps=true
# => HELLO, HIROSHI!
```

::: tip
Be careful of the following mistake:

```nu
greet Gabriel --caps true
```

Typing a space instead of an equals sign will pass `true` as a positional argument, which is likely not the desired result!

To avoid confusion, annotating a boolean type on a flag is not allowed:

```nu
def greet [
    --caps: bool   # Not allowed
] { ... }
```

:::

Flags can contain dashes. They can be accessed by replacing the dash with an underscore in the resulting variable name:

```nu
def greet [
  name: string
  --all-caps
] {
    let greeting = $"Hello, ($name)!"
    if $all_caps {
      $greeting | str upcase
    } else {
      $greeting
    }
}
```

### Rest parameters

There may be cases when you want to define a command which takes any number of positional arguments. We can do this with a "rest" parameter, using the following `...` syntax:

```nu
def multi-greet [...names: string] {
  for $name in $names {
    print $"Hello, ($name)!"
  }
}

multi-greet Elin Lars Erik
# => Hello, Elin!
# => Hello, Lars!
# => Hello, Erik!
```

We could call the above definition of the `greet` command with any number of arguments, including none at all. All of the arguments are collected into `$names` as a list.

Rest parameters can be used together with positional parameters:

```nu
def vip-greet [vip: string, ...names: string] {
  for $name in $names {
    print $"Hello, ($name)!"
  }

  print $"And a special welcome to our VIP today, ($vip)!"
}

#         $vip          $name
#         ----- -------------------------
vip-greet Rahul Priya Arjun Anjali Vikram
# => Hello, Priya!
# => Hello, Arjun!
# => Hello, Anjali!
# => Hello, Vikram!
# => And a special welcome to our VIP today, Rahul!
```

To pass a list to a rest parameter, you can use the [spread operator](/book/operators#spread-operator) (`...`). Using the `vip-greet` command definition above:

```nu
let vip = "Tanisha"
let guests = [ Dwayne, Shanice, Jerome ]
vip-greet $vip ...$guests
# => Hello, Dwayne!
# => Hello, Shanice!
# => Hello, Jerome!
# => And a special welcome to our VIP today, Tanisha!
```

## Pipeline Input-Output Signature

By default, custom commands accept [`<any>` type](./types_of_data.md#any) as pipeline input and likewise can output `<any>` type. But custom commands can also be given explicit signatures to narrow the types allowed.

For example, the signature for [`str stats`](/commands/docs/str_stats.md) looks like this:

```nu
def "str stats" []: string -> record { }
```

Here, `string -> record` defines the allowed types of the _pipeline input and output_ of the command:

- It accepts a `string` as pipeline input
- It outputs a `record`

If there are multiple input/output types, they can be placed within brackets and separated with commas or newlines, as in [`str join`](/commands/docs/str_join.md):

```nu
def "str join" [separator?: string]: [
  list -> string
  string -> string
] { }
```

This indicates that `str join` can accept either a `list<any>` or a `string` as pipeline input. In either case, it will output a `string`.

Some commands don't accept or require data as pipeline input. In this case, the input type will be `<nothing>`. The same is true for the output type if the command returns `null` (e.g., [`rm`](/commands/docs/rm.md) or [`hide`](/commands/docs/hide.md)):

```nu
def xhide [module: string, members?]: nothing -> nothing { }
```

::: tip Note
The example above is renamed `xhide` so that copying it to the REPL will not shadow the built-in `hide` command.
:::

Input-output signatures are shown in the `help` for a command (both built-in and custom) and can also be introspected through:

```nu
help commands | where name == <command_name>
scope commands | where name == <command_name>
```

:::tip Cool!
Input-Output signatures allow Nushell to catch two additional categories of errors at parse-time:

- Attempting to return the wrong type from a command. For example:

  ```nu
    def inc []: int -> int {
    $in + 1
    print "Did it!"
  }

  # => Error: nu::parser::output_type_mismatch
  # =>
  # => × Command output doesn't match int.
  # => ╭─[entry #12:1:24]
  # => 1 │ ╭─▶ def inc []: int -> int {
  # => 2 │ │     $in + 1
  # => 3 │ │     print "Did it!"
  # => 4 │ ├─▶ }
  # => · ╰──── expected int, but command outputs nothing
  # => ╰────
  ```

- And attempting to pass an invalid type into a command:

  ```nu
  def inc []: int -> int { $in + 1 }
  "Hi" | inc
  # => Error: nu::parser::input_type_mismatch
  # =>
  # =>     × Command does not support string input.
  # =>      ╭─[entry #16:1:8]
  # =>    1 │ "Hi" | inc
  # =>      ·        ─┬─
  # =>      ·         ╰── command doesn't support string input
  # =>      ╰────
  ```

  :::

## Documenting Your Command

In order to best help users understand how to use your custom commands, you can also document them with additional descriptions for the commands and parameters.

Run `help vip-greet` to examine our most recent command defined above:

```text
Usage:
  > vip-greet <vip> ...(names)

Flags:
  -h, --help - Display the help message for this command

Parameters:
  vip <string>
  ...names <string>

Input/output types:
  ╭───┬───────┬────────╮
  │ # │ input │ output │
  ├───┼───────┼────────┤
  │ 0 │ any   │ any    │
  ╰───┴───────┴────────╯
```

::: tip Cool!
You can see that Nushell automatically created some basic help for the command simply based on our definition so far. Nushell also automatically adds a `--help`/`-h` flag to the command, so users can also access the help using `vip-greet --help`.
:::

We can extend the help further with some simple comments describing the command and its parameters:

```nu
# Greet guests along with a VIP
#
# Use for birthdays, graduation parties,
# retirements, and any other event which
# celebrates an event # for a particular
# person.
def vip-greet [
  vip: string        # The special guest
   ...names: string  # The other guests
] {
  for $name in $names {
    print $"Hello, ($name)!"
  }

  print $"And a special welcome to our VIP today, ($vip)!"
}
```

Now run `help vip-greet` again to see the difference:

```text
Greet guests along with a VIP

Use for birthdays, graduation parties,
retirements, and any other event which
celebrates an event # for a particular
person.

Category: default

This command:
- does not create a scope.
- is not a built-in command.
- is not a subcommand.
- is not part of a plugin.
- is a custom command.
- is not a keyword.

Usage:
  > vip-greet <vip>


Flags:


  -h, --help - Display the help message for this command

Signatures:

  <any> | vip-greet[ <string>] -> <any>

Parameters:

  vip: <string> The special guest
  ...rest: <string> The other guests
```

Notice that the comments on the lines immediately before the `def` statement become a description of the command in the help system. Multiple lines of comments can be used. The first line (before the blank-comment line) becomes the Help `description`. This information is also shown when tab-completing commands.

The remaining comment lines become its `extra_description` in the help data.

::: tip
Run:

```nu
scope commands
| where name == 'vip-greet'
| wrap help
```

This will show the Help _record_ that Nushell creates.
:::

The comments following the parameters become their description. Only a single-line comment is valid for parameters.

::: tip Note
A Nushell comment that continues on the same line for argument documentation purposes requires a space before the ` #` pound sign.
:::

## Changing the Environment in a Custom Command

Normally, environment variable definitions and changes are [_scoped_ within a block](./environment.html#scoping). This means that changes to those variables are lost when they go out of scope at the end of the block, including the block of a custom command.

```nu
def foo [] {
    $env.FOO = 'After'
}

$env.FOO = "Before"
foo
$env.FOO
# => Before
```

However, a command defined using [`def --env`](/commands/docs/def.md) or [`export def --env`](/commands/docs/export_def.md) (for a [Module](modules.md)) will preserve the environment on the caller's side:

```nu
def --env foo [] {
    $env.FOO = 'After'
}

$env.FOO = "Before"
foo
$env.FOO
# => After
```

### Changing Directories in a Custom Command

Likewise, changing the directory using the `cd` command results in a change of the `$env.PWD` environment variable. This means that directory changes (the `$env.PWD` variable) will also be reset when a custom command ends. The solution, as above, is to use `def --env` or `export def --env`.

```nu
def --env go-home [] {
  cd ~
}

cd /
go-home
pwd
# => Your home directory
```

## Persisting

To make custom commands available in future Nushell sessions, you'll want to add them to your startup configuration. You can add command definitions:

- Directly in your `config.nu`
- To a file sourced by your `config.nu`
- To a [module](./modules.html) imported by your `config.nu`

See the [configuration chapter](configuration.md) for more details.
