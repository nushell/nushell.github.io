---
prev:
  text: Programming in Nu
  link: /book/programming_in_nu.md
---

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

Put a space between the name and the `[`, since `def greet[name]` is a parse error. The body has to be written out as a `{ ... }` block. A variable that holds a closure can't be used in its place. See [Defining Custom Commands](/lang-guide/chapters/custom_commands.md#defining-custom-commands) in the Language Reference Guide for the exact errors.

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
You'll often want to create a custom command that acts as a _statement_ rather than an expression, and doesn't return a value.

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

```nu
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
```

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
```

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
ls | get name
```

Let's move [`ls`](/commands/docs/ls.md) into a command that we've written:

```nu
def my-ls [] { ls }
```

We can use the output from this command just as we would [`ls`](/commands/docs/ls.md).

```nu
my-ls | get name
# => ╭───┬───────────────────────╮
# => │ 0 │ commands              │
# => │ 1 │ myscript.nu           │
# => │ 2 │ myscript2.nu          │
# => │ 3 │ welcome_to_nushell.md │
# => ╰───┴───────────────────────╯
```

This lets us easily build custom commands and process their output. Remember that we don't use return statements like other languages. Instead, the [implicit return](#returning-values-from-commands) allows us to build pipelines that output streams of data that can be connected to other pipelines.

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
1.. | each {||} | double | first 3
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 4 │
# => │ 2 │ 6 │
# => ╰───┴───╯
```

Even though the input command never ends, the `double` command can still receive and output values as they become available, so `first` gets its three values and the pipeline stops.

Without the `first 3`, the pipeline would run forever. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop it.
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
# => │ 0 │      │ dir  │      │ 8 minutes ago │
# => │ 1 │      │ file │      │ 8 minutes ago │
# => │ 2 │      │ file │      │ 8 minutes ago │
# => │ 3 │      │ file │      │ 8 minutes ago │
# => ╰───┴──────┴──────┴──────┴───────────────╯
```

### Streaming and collecting input

Data moves through a pipeline in one of three forms:

- a single value, such as a number, a string, or a list that is already in memory
- a list stream, whose items arrive one at a time, such as the output of `ls` or `each`
- a byte stream, which is the raw output of an external command or of `open --raw`

[`describe`](/commands/docs/describe.md) tells you which one a command receives:

```nu
1..3 | each { $in } | describe
# => list<int> (stream)

^echo hi | describe
# => byte stream
```

A command such as `each` handles one item at a time, so a stream stays a stream. Some code has to wait for the end of the stream and turn it into a single value. This happens when you:

- use `$in`, as `nullify` does above
- assign the stream to a variable with `let` or `mut`
- pass a pipeline in parentheses as an argument, as in `my-command (ls)`
- run [`collect`](/commands/docs/collect.md)
- call a command that needs all of its input before it can output anything, such as `sort`, `reverse` or `length`

A collected list stream becomes a list. A collected byte stream becomes a string, or `binary` if the bytes aren't valid UTF-8.

To see the difference, print a message on both sides of the pipe. `double` uses `each` directly, so each number is doubled as soon as it arrives:

```nu
def double [] { each {|n| print $"double ($n)"; 2 * $n } }
[1 2 3] | each {|n| print $"send ($n)"; $n } | double | ignore
# => send 1
# => double 1
# => send 2
# => double 2
# => send 3
# => double 3
```

`double-all` stores `$in` in a variable first, so nothing is doubled until all three numbers have been sent:

```nu
def double-all [] {
  let nums = $in
  $nums | each {|n| print $"double ($n)"; 2 * $n }
}
[1 2 3] | each {|n| print $"send ($n)"; $n } | double-all | ignore
# => send 1
# => send 2
# => send 3
# => double 1
# => double 2
# => double 3
```

With an endless input such as `1..`, `double-all` would never finish. When a command doesn't need all of its input at once, write it in the style of `double`.

## Naming Commands

In Nushell, a command name can be a string of characters. Here are some examples of valid command names: `greet`, `get-size`, `mycommand123`, `my command`, `命令` (English translation: "command"), and even `😊`.

Strings which might be confused with other parser patterns should be avoided. For instance, the following command names might not be callable:

- `1`, `"1.5"`, `4MiB`, `5sec`, `2024-01-01`, `0x[ff]`, or `1..2`: When the first word of a name is a number, filesize, duration, datetime, binary literal or range, a call would read that word as a value and never reach the command, so Nushell rejects the name. Only the first word counts, so `def "retry 5sec"` is fine.
- `"number#four"`, `"number^four"`, or `"number%four"`: Carets, hash symbols, and percent signs are not allowed in command names
- `"foo  bar"`, `" foo"`, or `"foo "`: The words of a command name must be separated by single spaces, with no leading or trailing whitespace.
- `-a`, `"{foo}"`, `"(bar)"`: Will not be callable, as Nushell will interpret them as flags, closures, or expressions.

`def`, `extern`, and `alias` reject the names in the first three groups with a `nu::parser::variable_not_valid` error:

```nu
def 5sec [] { "five seconds" }
# => Error: nu::parser::variable_not_valid
# =>
# =>   × Command name not supported.
# =>    ╭─[repl_entry #1:1:5]
# =>  1 │ def 5sec [] { "five seconds" }
# =>    ·     ──┬─
# =>    ·       ╰── command name can't be a number, a filesize, a duration, a datetime, a binary literal or a range, contain #, ^, or %, or have whitespace other than single spaces between words
# =>    ╰────
```

Parser keywords such as `if`, `for`, `let`, `def`, `type`, `use` or `where` can't be used as command names at all, because shadowing them would break the language constructs they implement:

```nu
def if [] { "my if" }
# => Error: nu::parser::name_is_keyword
# =>
# =>   × Can't use parser keyword `if` as command name.
# =>    ╭─[repl_entry #1:1:5]
# =>  1 │ def if [] { "my if" }
# =>    ·     ─┬
# =>    ·      ╰── 'if' is a parser keyword
# =>    ╰────
# =>   help: Parser keywords cannot be shadowed (including via module exports and `use *`). Choose a different command name so language constructs keep working.
```

While names like `"+foo"` might work, they are best avoided as the parser rules might change over time. When in doubt, keep command names as simple as possible.

::: tip
It's common practice in Nushell to separate the words of the command with `-` for better readability. For example `get-size` instead of `getsize` or `get_size`.
:::

::: tip
Because `def` is a parser keyword, the command name must be known at parse time. This means that command names may not be a variable or constant. For example, the following is _not allowed_:

```nu
let name = "foo"
def $name [] { foo }
# => Error: nu::parser::unknown_state
# =>
# =>   × Unknown state.
# =>    ╭─[repl_entry #1:2:5]
# =>  1 │ let name = "foo"
# =>  2 │ def $name [] { foo }
# =>    ·     ──┬──
# =>    ·       ╰── Could not get string from string expression
# =>    ╰────
```

:::

### Subcommands

You can also define subcommands of commands using a space. For example, if we wanted to add a new subcommand to [`str`](/commands/docs/str.md), we can create it by naming our subcommand starting with "str ". For example:

```nu
def "str mycommand" [] {
  "hello"
}
```

Now we can call our custom command as if it were a built-in subcommand of [`str`](/commands/docs/str.md):

```nu
str mycommand
# => hello
```

Of course, commands with spaces in their names are defined in the same way:

```nu
def "custom command" [] {
  "This is a custom command with a space in the name!"
}
```

### Shadowing Built-in Commands

A custom command can have the same name as a built-in command. The custom command then _shadows_ the built-in: calling the name runs your version instead. To call the built-in anyway, prefix its name with the `%` sigil, much like `^` forces an [external command](./running_externals.md):

```nu
def echo [...args] { "echo is turned off" }

echo hello
# => echo is turned off

%echo hello
# => hello
```

The `%` sigil also works when the built-in's name is stored in a variable (`%$cmd`) or computed in a subexpression (`%($cmd)`):

```nu
let cmd = "echo"
%$cmd hello
# => hello
```

Only built-in commands can be called this way. Using `%` with a custom command, an alias or an unknown name is a parse error:

```nu
def greet [] { "hi" }
%greet
# => Error: nu::parser::error
# =>
# =>   × percent sigil requires a built-in command
# =>    ╭─[repl_entry #1:2:2]
# =>  1 │ def greet [] { "hi" }
# =>  2 │ %greet
# =>    ·  ──┬──
# =>    ·    ╰── unknown built-in command
# =>    ╰────
# =>   help: remove `%` to use normal resolution, or use `^` to run an external command explicitly
```

::: tip
`%` is handy inside a command that shadows a built-in, because the body can call the original without recursing into itself. See [Aliases](aliases.md#replacing-existing-commands-using-aliases) for a complete example that replaces `ls`.
:::

### Defining a command more than once

A block can define each command name only once. A second `def` (or [`extern`](externs.md)) with the same name in the same block is a parse error, so nothing in the block runs:

```nu
def greet [] { "hi" }; def greet [] { "hello" }
# => Error: nu::parser::duplicate_command_def
# =>
# =>   × Duplicate command definition within a block.
# =>    ╭─[repl_entry #1:1:28]
# =>  1 │ def greet [] { "hi" }; def greet [] { "hello" }
# =>    ·                            ──┬──
# =>    ·                              ╰── defined more than once
# =>    ╰────
```

A script file and a module are each a single block, so neither can define the same name twice. At the REPL, each entry is a new block, and entering a new `def greet` at the prompt replaces the earlier one:

```nu
def greet [] { "hi" }
def greet [] { "hello" }
greet
# => hello
```

A `def` inside a nested block, such as a `do` closure or another command's body, shadows the outer command only within that block:

```nu
def greet [] { "hi" }
do { def greet [] { "hello" }; greet }
# => hello
greet
# => hi
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
```

```nu
# Commas
def greet [name1, name2] {
  $"Hello, ($name1) and ($name2)!"
}
```

```nu
# Linebreaks
def greet [
  name1
  name2
] {
  $"Hello, ($name1) and ($name2)!"
}
```

The signature can also be written in parentheses instead of brackets, and a parameter name can start with `$`, the way the variable is written in the body:

```nu
def greet ($name1, $name2) {
  $"Hello, ($name1) and ($name2)!"
}
greet Wei Mei
# => Hello, Wei and Mei!
```

`$name1` and `name1` declare the same variable, but `help greet` then lists the parameter as `$name1`. Most code uses brackets and leaves out the `$`.

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
# =>   × Missing required positional argument.
# =>    ╭─[repl_entry #3:1:10]
# =>  1 │ greet Wei
# =>    ╰────
# =>   help: Usage: greet <name1> <name2> . Use `--help` for more information.
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

If required and optional positional parameters are used together, then the required parameters must appear in the definition first:

```nu
def greet [greeting?: string, name: string] {
  $"($greeting), ($name)!"
}
# => Error: nu::parser::required_after_optional
# =>
# =>   × Required positional parameter after optional parameter
# =>    ╭─[repl_entry #1:1:12]
# =>  1 │ def greet [greeting?: string, name: string] {
# =>    ·            ───────────────┬───────────────
# =>    ·                           ╰── required parameter name after optional parameter
# =>  2 │   $"($greeting), ($name)!"
# =>    ╰────
```

Because an optional parameter can be `null`, its type inside the body includes `nothing`. A parameter declared as `limit?: int` has the type `oneof<int, nothing>`, and that is the type error messages report for `$limit`. To work with a plain `int`, give the parameter a [default value](#parameters-with-a-default-value), or use `$limit | default 3` in the body.

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
# => Hello, world!
```

You can also combine a default value with a [type annotation](#parameter-types):

```nu
def congratulate [age: int = 18] {
  $"Happy birthday! You are ($age) years old now!"
}
```

Without an annotation, the parameter takes its type from the default value. Here `count` defaults to `1`, so it only accepts an `int`:

```nu
def repeat [text, count = 1] { 1..$count | each { $text } | str join " " }
repeat hi 2.5
# => Error: nu::parser::parse_mismatch
# =>
# =>   × Parse mismatch: expected int.
# =>    ╭─[repl_entry #1:2:11]
# =>  1 │ def repeat [text, count = 1] { 1..$count | each { $text } | str join " " }
# =>  2 │ repeat hi 2.5
# =>    ·           ─┬─
# =>    ·            ╰── expected int
# =>    ╰────
# =>   help: Check the syntax around this position — a typo, missing delimiter, or wrong separator is common.
```

This includes a `null` default. `def f [x = null]` gives `x` the type `nothing`, so any other argument is rejected with "expected nothing". For a parameter that is `null` when it's left out, write `x?`, or annotate it as `x: any = null`.

Nushell works out the default while it parses the definition, so the default has to be a [constant](./variables.md#constant-variables): a literal, an expression of literals such as `(1 + 2)`, or a `const` variable. A `let` variable can't be used:

```nu
let fallback = "Nushell"
def greet [name = $fallback] { $"Hello, ($name)!" }
# => Error: nu::parser::non_constant_default_value
# =>
# =>   × Default values should be constant expressions.
# =>    ╭─[repl_entry #1:2:19]
# =>  1 │ let fallback = "Nushell"
# =>  2 │ def greet [name = $fallback] { $"Hello, ($name)!" }
# =>    ·                   ────┬────
# =>    ·                       ╰── expected a constant value
# =>    ╰────
```

With `const fallback = "Nushell"` instead, the definition works.

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
```

If we try to call it with a string, Nushell will tell us that the types don't match:

```nu
greet World
# => Error: nu::parser::parse_mismatch
# =>
# =>   × Parse mismatch: expected int.
# =>    ╭─[repl_entry #2:1:7]
# =>  1 │ greet World
# =>    ·       ──┬──
# =>    ·         ╰── expected int
# =>    ╰────
# =>   help: Check the syntax around this position — a typo, missing delimiter, or wrong separator is common.
```

::: tip Cool!
Type checks are a parser feature. When entering a custom command at the command-line, the Nushell parser can even detect invalid argument types in real-time and highlight them before executing the command.

The highlight style can be changed using a [theme](https://github.com/nushell/nu_scripts/tree/main/themes) or manually using `$env.config.color_config.shape_garbage`.
:::

::: details List of Type Annotations
Most types can be used as type-annotations. In addition, there are a few "shapes" which can be used. For instance:

- `number`: Accepts either an `int` or a `float`. The value keeps its own type, so `describe` reports `int` or `float` for a `number` parameter. `describe` only shows `number` for a collection that mixes the two, such as `[1 2.5]`, which is a `list<number>`.
- `path`: A string that is treated as a filesystem path. A leading `~` is expanded to the home directory, and "n-dot" shorthands such as `...` are expanded to `../..`. Relative paths stay relative: `.` stays `.`, and `foo/../bar` becomes `bar`. See [Path](/lang-guide/chapters/types/other_types/path.html) in the Language Reference Guide for example usage.
- `directory`: A subset of `path` (above). Only directories will be offered when using tab-completion for the parameter. This is the shape of [`cd`](/commands/docs/cd.md)'s argument, which is why <kbd>Tab</kbd> after `cd` lists only directories. Expansions take place just as with `path`.
- `external_arg`: Parses the argument the way an [external command](./running_externals.md) would. A bare word is kept exactly as typed, so `0001` or `true` is not turned into an `int` or `bool`, while quoted strings, variables and subexpressions keep their own value. This is mainly useful for the `main` command of a [script](./scripts.md) that receives arguments from another shell. It only changes how a command's argument is parsed. On a variable, as in `let e: external_arg = 0001`, it accepts any value like `any` does, and `0001` is stored as the `int` `1`.
- `oneof<...>`: Accepts any one of the listed types, for example `oneof<int, string>`. A literal argument gets the first listed type that it matches, with the text-like types (`string`, `path`, `directory`, `glob`, `cell-path`, `external_arg`, and `any`) tried last whatever their position. So with `oneof<string, list<string>>`, `[foo bar]` is a list, and with `oneof<string, int>`, `5` (and `007`) is an `int`. Quote the argument if you need the text.
- `error`: Available, but currently no known valid usage. See [Error](/lang-guide/chapters/types/other_types/error.html) in the Language Reference Guide for more information.

For example, compare an untyped parameter with an `external_arg` parameter:

```nu
def as-any [value] { $value }
def as-external [value: external_arg] { $value }

as-any 0001
# => 1
as-external 0001
# => 0001
```

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

`list`, `record` and `table` can also say what they contain, for example `list<int>`, `record<name: string, age: int>` or `table<name: string>`. See [Type Signatures](/lang-guide/chapters/types/type_signatures.md) in the Language Reference Guide for the full syntax.

Custom value types work too. The built-in [`into semver`](/commands/docs/into_semver.md), [`into semver-range`](/commands/docs/into_semver-range.md) and [`into matrix`](/commands/docs/into_matrix.md) commands create values of type `semver`, `semver-range` and `matrix`, and a plugin can add its own, such as `polars_dataframe` from the Polars plugin. A plugin's type name is only known while the plugin is loaded. Custom value types take no type parameters.

`block` is not a valid annotation. Nushell rejects it with the hint `Use 'closure' instead of 'block'`.

:::

A parameter's type can be followed by `@` and a completer, which lists the values <kbd>Tab</kbd> offers for that argument. The completer can be the name of a command, a list, or a `const` variable that holds a list:

```nu
const colors = [red green blue]
def paint [color: string@$colors] { $color }
def pick [size: string@[small medium large]] { $size }
```

A list item can also be a record with a `value` field, but its other fields, such as `description` and `style`, are ignored. Completers only suggest values. Any `string` is still accepted. See [Custom Completions](./custom_completions.md) for completer commands and the other forms.

### Type Aliases

When several commands take or return the same structured data, writing out a type like `record<x: float, y: float>` each time gets long and easy to get wrong. The [`type`](/commands/docs/type.md) keyword gives a type a name:

```nu
type Point = record<x: float, y: float>
type Polygon = list<Point>

def first-x [poly: Polygon]: nothing -> float { $poly.0.x }

first-x [{x: 1.0, y: 2.0} {x: 3.0, y: 4.0}]
# => 1.0
```

A type alias is only a shorter way to write its type. The parser replaces the name with the full type wherever the name is used, so `help`, [`describe`](/commands/docs/describe.md), and error messages show the full type:

```nu
type Point = record<x: float, y: float>
def length-of [p: Point]: nothing -> float { ($p.x ** 2 + $p.y ** 2) | math sqrt }

length-of {x: 1, y: 2}
# => Error: nu::parser::type_mismatch
# =>
# =>   × Type mismatch.
# =>    ╭─[repl_entry #3:1:11]
# =>  1 │ length-of {x: 1, y: 2}
# =>    ·           ──────┬─────
# =>    ·                 ╰── expected record<x: float, y: float>, found record<x: int, y: int>
# =>    ╰────
```

You can use a type alias anywhere a type annotation goes: positional parameters, flags, rest parameters, closure parameters, input/output types, the annotations of `let`, `mut`, and `const`, inside other types (such as `list<Point>`), and on the right-hand side of another `type`.

A few rules apply:

- Like [`alias`](./aliases.md) and `const`, a type alias is visible from its definition to the end of the enclosing block. It must be defined above its first use, and it can't refer to itself.
- A type alias can't take the name of a built-in type. The reserved names are `any`, `binary`, `block`, `bool`, `cell-path`, `closure`, `datetime`, `directory`, `duration`, `error`, `external_arg`, `filesize`, `float`, `glob`, `int`, `list`, `nothing`, `number`, `oneof`, `path`, `range`, `record`, `string` and `table`. Using one is a `nu::parser::type_alias_shadows_builtin` error.
- A type alias has no type parameters. `type Pair<T> = ...` is not a valid name, and with `type Point = record<x: float, y: float>`, writing `Point<int>` is a `nu::parser::type_alias_with_params` error.
- A custom completer belongs to the parameter, not the type. Write it on the parameter, as in `def paint [color: Color@[red green blue]] { ... }`. `type Color = string@[red green blue]` is an error.
- In a module, a type alias is private unless it is defined with `export type`. See [Modules](./modules/creating_modules.md#exports) for how to export one and [Using Modules](./modules/using_modules.md#importing-type-aliases) for how to import it.

::: warning
`type` is a parser keyword, so a custom command, alias, or extern can't be named `type`. To run an external command named `type`, call it as `^type`, or use Nushell's [`which`](/commands/docs/which.md) to see what a command name refers to.
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
      $greeting | str uppercase
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
# => Error: nu::parser::extra_positional
# =>
# =>   × Extra positional argument.
# =>    ╭─[repl_entry #1:1:22]
# =>  1 │ greet Gabriel --caps true
# =>    ·                      ──┬─
# =>    ·                        ╰── extra positional argument
# =>    ╰────
# =>   help: Usage: greet {flags} <name>
```

Typing a space instead of an equals sign will pass `true` as a positional argument, which is likely not the desired result! Here, `greet` only takes one positional argument, so Nushell reports an error.

To avoid confusion, annotating a boolean type on a flag is not allowed:

```nu
def greet [
    --caps: bool   # Not allowed
] { $caps }
# => Error: nu::parser::error
# =>
# =>   × Type annotations are not allowed for boolean switches.
# =>    ╭─[repl_entry #1:2:13]
# =>  1 │ def greet [
# =>  2 │     --caps: bool   # Not allowed
# =>    ·             ──┬─
# =>    ·               ╰── Remove the `: bool` type annotation.
# =>  3 │ ] { $caps }
# =>    ╰────
```

:::

A flag with a default value is never a switch, even without a type annotation. It takes a value, and the default sets the value's type. So `--caps = false` declares a flag that needs a `bool` value, as in `--caps true`, and `--caps = null` declares one that only accepts `null`. Here `--times = 1` makes `--times` an `int` flag:

```nu
def greet [name: string, --times = 1] {
  1..$times | each { $"Hello, ($name)!" } | str join " "
}
greet Mia --times 2
# => Hello, Mia! Hello, Mia!
greet Mia --times
# => Error: nu::parser::missing_flag_param
# =>
# =>   × Missing flag argument.
# =>    ╭─[repl_entry #3:1:11]
# =>  1 │ greet Mia --times
# =>    ·           ───┬───
# =>    ·              ╰── flag missing int argument
# =>    ╰────
```

Flags can contain dashes. They can be accessed by replacing the dash with an underscore in the resulting variable name:

```nu
def greet [
  name: string
  --all-caps
] {
    let greeting = $"Hello, ($name)!"
    if $all_caps {
      $greeting | str uppercase
    } else {
      $greeting
    }
}
```

Because `--all-caps` creates `$all_caps`, it would collide with a parameter named `all_caps`. Parameters and flags share one set of variable names, and each short flag needs its own letter. Nushell rejects a repeated name when it parses the definition:

```nu
def greet [--all-caps, all_caps] { $all_caps }
# => Error: nu::parser::duplicate_parameter
# =>
# =>   × Duplicate parameter or flag.
# =>    ╭─[repl_entry #1:1:24]
# =>  1 │ def greet [--all-caps, all_caps] { $all_caps }
# =>    ·            ─────┬────  ────┬───
# =>    ·                 │          ╰── `all_caps` uses a name that is already taken
# =>    ·                 ╰── first used here
# =>    ╰────
# =>   help: Each parameter and flag needs its own name, and each short flag its own letter. A long flag's
# =>         variable replaces `-` with `_`, so `--foo-bar` and `foo_bar` clash.
```

The same error covers two parameters with one name, a rest parameter that reuses a name, and two flags with the same short letter, such as `--verbose (-v)` and `--version (-v)`. A flag with only a short form, like `-v`, creates the variable `$v`, so it also collides with a parameter named `v`.

The one name you can repeat is `_`. Use it for positional arguments the command doesn't need:

```nu
def third [_, _, value] { $value }
third a b c
# => c
```

The names of the built-in variables `in`, `nu`, `env` and `ans` are taken too. A parameter or flag with one of these names, such as `def show [--env] {}`, is a `nu::parser::name_is_builtin_var` error, the same as `let env = 1`. See [Reserved Names](/lang-guide/chapters/declarations.md#reserved-names).

#### Flags with a `null` Value

When a flag is given `null` as its value, what happens depends on the flag's type:

- If the type doesn't accept `nothing` (for example `--age: int`), Nushell treats the flag as if it hadn't been passed, so its default value (or `null`) is used.
- If the type does accept `nothing` (for example `--age: any` or `--age: oneof<int, nothing>`), the `null` is passed through to the command.

This makes it easy to write a command that forwards an optional flag to another command. For the following examples, we'll use this version of `greet`:

```nu
def greet [
  name: string
  --age: int = 18
  --caps
] {
  let greeting = $"Hello, ($name)! You are ($age)."
  if $caps { $greeting | str uppercase } else { $greeting }
}
```

`party` forwards its own `--age` flag. When the caller leaves it out, `$age` is `null`, so `greet` falls back to its default:

```nu
def party [name: string, --age: int] {
  greet $name --age=$age
}

party Kai
# => Hello, Kai! You are 18.

party Kai --age 30
# => Hello, Kai! You are 30.
```

#### Passing Flags from a Record

You can also use the [spread operator](/book/operators#spread-operator) (`...`) to pass a record as named flags. Each field name is a flag name (without the `--`), and each value becomes the flag's value. For a switch, `true` sets the flag, while `false` or `null` leaves it off:

```nu
let options = { age: 30, caps: true }
greet Kai ...$options
# => HELLO, KAI! YOU ARE 30.

greet Kai ...{ age: null, caps: false }
# => Hello, Kai! You are 18.
```

Field values are type-checked against the flag definitions, and a field that doesn't match any flag is an error:

```nu
greet Kai ...{ colour: red }
# => Error: nu::shell::error
# =>
# =>   × Unknown flag `colour` in spread record
# =>    ╭─[repl_entry #1:1:14]
# =>  1 │ greet Kai ...{ colour: red }
# =>    ·              ───────┬───────
# =>    ·                     ╰── `colour` is not a named argument of this command
# =>    ╰────
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

We could call the above definition of the `multi-greet` command with any number of arguments, including none at all. All of the arguments are collected into `$names` as a list.

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

A command can have only one rest parameter, and it has to be the last positional parameter, since it takes every remaining argument. Flags can still be listed after it. Putting the VIP last is a parse error:

```nu
def vip-greet [...names: string, vip: string] {}
# => Error: nu::parser::positional_after_rest
# =>
# =>   × Positional parameter after the rest parameter.
# =>    ╭─[repl_entry #1:1:34]
# =>  1 │ def vip-greet [...names: string, vip: string] {}
# =>    ·                                  ─┬─
# =>    ·                                   ╰── parameter vip after the rest parameter
# =>    ╰────
# =>   help: The rest parameter takes all remaining positional arguments, so it must be the last positional parameter. Flags can still follow it.
```

A second rest parameter is a `nu::parser::multiple_rest_params` error. A rest parameter also can't have a default value, so `...names = [Ada]` is a `nu::parser::assignment_mismatch` error. When no arguments are left for it, it is an empty list.

### Ending Flag Parsing with `--`

Arguments that start with `-` are normally parsed as flags, so passing a value like `-x` as a positional argument is an error. As in POSIX shells, a standalone `--` ends flag parsing. Every argument after it is treated as a positional argument, even if it starts with `-`, and the `--` itself isn't passed to the command:

```nu
def show-args [...args] { $args }

show-args -- --verbose -x foo
# => ╭───┬───────────╮
# => │ 0 │ --verbose │
# => │ 1 │ -x        │
# => │ 2 │ foo       │
# => ╰───┴───────────╯
```

This works for built-in commands too, for example `[a b] | str join -- -x` returns `a-xb`. Commands defined with `def --wrapped` (see below) are the exception: they receive the `--` in their rest parameter, so they can pass it on unchanged to the external command they wrap.

External commands also receive the `--`. Nushell passes the arguments of an external command through without treating any of them as its own flags, and that includes an external declared with [`extern`](externs.md). The `--` reaches the program like any other argument, and the program decides what it means. Compare the built-in `echo` with the system's `echo`:

```nu
echo -- --x
# => --x
^echo -- --x
# => -- --x
```

### Rest Parameters with Wrapped External Commands

Custom commands defined with `def --wrapped` will collect any unknown flags and arguments into a
rest-parameter which can then be passed, via list-spreading, to an external command. This allows
a custom command to "wrap" and extend the external command while still accepting all of its original
parameters. For example, the external `eza` command displays a directory listing. By default, it displays
a grid arrangement:

```nu
eza commands
# => categories  docs  README.md
```

We can define a new command `ezal` which will always display a long-listing, adding icons:

```nu
def --wrapped ezal [...rest] {
  eza -l ...$rest
}
```

:::note
You could also add `--icons`. We're omitting that in this example simply because those icons don't
display well in this guide.
:::

Notice that `--wrapped` forces any additional parameters into the `rest` parameter, so the command
can be called with any parameter that `eza` supports. Those additional parameters will be expanded via
the list-spreading operation `...$rest`.

```nu
ezal commands
# => drwxr-xr-x   - ntd  7 Feb 11:41 categories
# => drwxr-xr-x   - ntd  7 Feb 11:41 docs
# => .rw-r--r-- 936 ntd 14 Jun  2024 README.md

ezal -d commands
# => drwxr-xr-x - ntd 14 Jun  2024 commands
```

The custom command can check for certain parameters and change its behavior accordingly. For instance,
when using the `-G` option to force a grid, we can omit passing a `-l` to `eza`:

```nu
def --wrapped ezal [...rest] {
  if '-G' in $rest {
    eza ...$rest
  } else {
    eza -l --icons ...$rest
  }
}

ezal -G commands
# => categories  docs  README.md
```

A few rules apply to `def --wrapped`:

- The command must have a rest parameter. Without one, the definition is a `nu::parser::missing_positional` error.
- The rest parameter must be untyped or typed as `string`. Any other type is a `nu::parser::type_mismatch_help` error.
- An untyped rest parameter uses the [`external_arg`](#parameter-types) shape. Bare words and flags are kept as the strings you typed, so `0001` stays `"0001"`, while a subexpression keeps its value. With `...rest: string`, a subexpression must produce a string.
- Nushell doesn't add a `--help` flag to a wrapped command. `--help` and `-h` go into the rest parameter, so the wrapped program can show its own help. Use `help ezal` to see the help for the wrapper itself.

```nu
def --wrapped show-rest [...rest] { $rest | to nuon }
show-rest 0001 --help -x (1 + 1)
# => ["0001", --help, -x, 2]
```

## Pipeline Input-Output Signature

By default, custom commands accept [`<any>` type](./types_of_data.md#any) as pipeline input and likewise can output `<any>` type. But custom commands can also be given explicit signatures to narrow the types allowed.

For example, the signature for [`str stats`](/commands/docs/str_stats.md) looks like this:

```nu
def "str stats" []: string -> record { {} }
```

Here, `string -> record` defines the allowed types of the _pipeline input and output_ of the command:

- It accepts a `string` as pipeline input
- It outputs a `record`

::: tip Note
The body of a command with an input-output signature must produce the declared output type. An empty body (`{ }`) outputs its input, which here is a `string`, so Nushell reports an error. That's why the placeholder body above returns an empty record (`{}`).
:::

If there are multiple input/output types, they can be placed within brackets and separated with commas or newlines, as in [`str join`](/commands/docs/str_join.md):

```nu
def "str join" [separator?: string]: [
  list -> string
  string -> string
] { "" }
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
  # =>   × Command output doesn't match int.
  # =>    ╭─[repl_entry #1:1:24]
  # =>  1 │ ╭─▶ def inc []: int -> int {
  # =>  2 │ │     $in + 1
  # =>  3 │ │     print "Did it!"
  # =>  4 │ ├─▶ }
  # =>    · ╰──── expected int, but command outputs nothing
  # =>    ╰────
  ```

- And attempting to pass an invalid type into a command:

  ```nu
  def inc []: int -> int { $in + 1 }
  "Hi" | inc
  # => Error: nu::parser::input_type_mismatch
  # =>
  # =>   × Command does not support string input.
  # =>    ╭─[repl_entry #1:2:8]
  # =>  1 │ def inc []: int -> int { $in + 1 }
  # =>  2 │ "Hi" | inc
  # =>    ·        ─┬─
  # =>    ·         ╰── command doesn't support string input
  # =>    ╰────
  ```

:::

## Documenting Your Command

In order to best help users understand how to use your custom commands, you can also document them with additional descriptions for the commands and parameters.

Run `help vip-greet` to examine our most recent command defined above:

```text
Usage:
  > vip-greet <vip> ...(names)

Flags:
  -h, --help: Display the help message for this command

Command Type:
  > custom

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

Since every command already has `--help`, you can't declare a flag with that name:

```nu
def greet [--help] { "hi" }
# => Error: nu::parser::error
# =>
# =>   × The `--help` flag is reserved
# =>    ╭─[repl_entry #1:1:12]
# =>  1 │ def greet [--help] { "hi" }
# =>    ·            ───┬──
# =>    ·               ╰── every command already has `--help`
# =>    ╰────
# =>   help: Rename this flag. `--help` always shows the command's help.
```

The short form `-h` isn't reserved. Another flag can take it, as in `--hidden (-h)`, and then `-h` sets that flag while only `--help` shows the help. A command defined with `def --wrapped` gets no `--help` flag at all, as described in [Rest Parameters with Wrapped External Commands](#rest-parameters-with-wrapped-external-commands).

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

Usage:
  > vip-greet <vip> ...(names)

Flags:
  -h, --help: Display the help message for this command

Command Type:
  > custom

Parameters:
  vip <string>: The special guest
  ...names <string>: The other guests

Input/output types:
  ╭───┬───────┬────────╮
  │ # │ input │ output │
  ├───┼───────┼────────┤
  │ 0 │ any   │ any    │
  ╰───┴───────┴────────╯
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

This will show the Help _record_ that Nushell creates. Each column is described in [Inspecting commands](/lang-guide/chapters/custom_commands.md#inspecting-commands) in the Language Reference Guide.
:::

The comments following the parameters become their description. A comment can continue on the lines below its parameter. Nushell adds each comment-only line, up to the next parameter, to that parameter's description as a new line.

::: tip Note
A Nushell comment that continues on the same line for argument documentation purposes requires a space before the ` #` pound sign. See [Comments](/lang-guide/chapters/declarations.md#comments) in the Language Guide for where a `#` starts a comment.
:::

## Adding Attributes to Custom Commands via `attr`

As of version 0.103.0, Nushell allows authors of custom commands to enrich their work
with attributes with subcommands of the `attr` builtin, prefixed by the `@` symbol
before the definition of the command. For those coming from Python, Java, or JavaScript, this
will appear similar to decorators or annotations, but serve a slightly different purpose.

Each attribute goes on its own line, directly above `def`, `export def` or `extern`, and you can stack as many as you need. The command's doc comment goes above the attribute lines. A comment between an attribute and the definition is an error, because the attribute is then followed by something other than a definition:

```nu
@category math
# Double a number
def double [] { $in * 2 }
# => Error: nu::parser::attribute_requires_definition
# =>
# =>   × Attributes must be followed by a definition.
# =>    ╭─[repl_entry #1:1:2]
# =>  1 │ @category math
# =>    ·  ──────┬──────
# =>    ·        ╰── must be followed by a definition
# =>  2 │ # Double a number
# =>    ╰────
# =>   help: try following this line with a `def` or `extern` definition
```

To put an attribute on the same line as the definition, end it with `;`, as in `@category math; def double [] { $in * 2 }`. Without the `;`, `def` is read as another argument to the attribute.

Nushell evaluates an attribute's arguments while it parses the definition, so they must be [constants](./variables.md#constant-variables): literal values or `const` variables. With `let section = "math"`, `@category $section` fails with a `nu::shell::not_a_constant` error, while `const section = "math"` works.

Let's improve the documentation for the `vip-greet` custom command. The `example`
attribute adds to the output of `help {command}` or `{command} -h`:

```nu
# Greet guests along with a VIP
#
# Use for birthdays, graduation parties,
# retirements, and any other event which
# celebrates an event # for a particular
# person.
@example "Greet a VIP" {vip-greet "Bob"} --result "And a special welcome to our VIP today, Bob!"
@example "Greet multiple people" {vip-greet "Bob" "Alice" "Charlie"} --result "Hello, Alice!
Hello, Charlie!
And a special welcome to our VIP today, Bob!"
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

Now, run `help vip-greet` to see the examples added.

```text
Greet guests along with a VIP

Use for birthdays, graduation parties,
retirements, and any other event which
celebrates an event # for a particular
person.

Usage:
  > vip-greet <vip> ...(names)

Flags:
  -h, --help: Display the help message for this command

Command Type:
  > custom

Parameters:
  vip <string>: The special guest
  ...names <string>: The other guests

Input/output types:
  ╭───┬───────┬────────╮
  │ # │ input │ output │
  ├───┼───────┼────────┤
  │ 0 │ any   │ any    │
  ╰───┴───────┴────────╯

Examples:
  Greet a VIP
  > vip-greet "Bob"
  And a special welcome to our VIP today, Bob!

  Greet multiple people
  > vip-greet "Bob" "Alice" "Charlie"
  Hello, Alice!
  Hello, Charlie!
  And a special welcome to our VIP today, Bob!
```

The example can also be a string instead of a block. Nushell checks that a block parses, but keeps a string exactly as written:

```nu
@example "Greet the guests listed in a file" "vip-greet Bob ...(open guests.txt | lines)"
```

The examples are also stored in the `examples` column of [`scope commands`](/commands/docs/scope_commands.md), as a table with `description`, `example` and `result` columns:

```nu
scope commands | where name == vip-greet | get 0.examples.example
# => ╭───┬───────────────────────────────────╮
# => │ 0 │ vip-greet "Bob"                   │
# => │ 1 │ vip-greet "Bob" "Alice" "Charlie" │
# => ╰───┴───────────────────────────────────╯
```

When maintaining a script, module, plugin, or library written in nu, some custom
commands may end up being replaced by newer versions or removed completely, but
remain available temporarily to give users time to transition away from the older
functionality.

The `deprecated` attribute raises a warning to the users upon running
the custom command.

```nu
@deprecated
def greet [
  name: string
  --all-caps
] {
    let greeting = $"Hello, ($name)!"
    if $all_caps {
      $greeting | str uppercase
    } else {
      $greeting
    }
}
```

Run `greet {name}` to see the warning.

```nu
greet "bob"
# => Warning: nu::parser::deprecated
# =>
# =>   ⚠ Command deprecated.
# =>    ╭─[repl_entry #2:1:1]
# =>  1 │ greet "bob"
# =>    · ─────┬─────
# =>    ·      ╰── greet is deprecated and will be removed in a future release.
# =>    ╰────
# =>
# => Hello, bob!
```

The `--report` flag sets how often the warning appears. With the default, `--report first`, it is
only shown the first time the command is used in a session. `--report every` warns on every call.

Two more flags take version strings. `--since` gives the version that deprecated the command, and
`--remove` gives the version that will remove it. Each one replaces its part of the warning text:

```nu
@deprecated --since 0.9.0 --remove 1.0.0
def greet [] { "hi" }

greet
# => Warning: nu::parser::deprecated
# =>
# =>   ⚠ Command deprecated.
# =>    ╭─[repl_entry #2:1:1]
# =>  1 │ greet
# =>    · ──┬──
# =>    ·   ╰── greet was deprecated in 0.9.0 and will be removed in 1.0.0.
# =>    ╰────
# =>
# => hi
```

To deprecate a single flag instead of the whole command, name it with `--flag`, without its
dashes. Calls that don't use the flag get no warning:

```nu
@deprecated "Use --upper instead." --flag caps
def greet [--caps, --upper] { if $caps or $upper { "HI" } else { "hi" } }

greet --upper
# => HI
greet --caps
# => Warning: nu::parser::deprecated
# =>
# =>   ⚠ Flag deprecated.
# =>    ╭─[repl_entry #3:1:7]
# =>  1 │ greet --caps
# =>    ·       ───┬──
# =>    ·          ╰── greet --caps is deprecated and will be removed in a future release.
# =>    ╰────
# =>   help: Use --upper instead.
# =>
# => HI
```

Nushell doesn't check that the command has a flag with the name you give `--flag`, so a misspelled
name never produces a warning.

The `deprecation_info` column of [`scope commands`](/commands/docs/scope_commands.md) lists each
deprecation as a record with the fields `type`, `label`, `flag`, `since`, `expected_removal` and
`help`. `type` is `Command` or `Flag`, and `label` holds the warning text.

If there is a replacement command or additional context that would
assist the user when updating their workflows, add text after `@deprecated`.

The `category` attribute assigns the specified label when using `scope commands`
or `help` commands.

```nu
@deprecated "Use vip-greet as a replacement." --report every
@category "deprecated"
def greet [
  name: string
  --all-caps
] {
    let greeting = $"Hello, ($name)!"
    if $all_caps {
      $greeting | str uppercase
    } else {
      $greeting
    }
}
```

```nu
greet bob
# => Warning: nu::parser::deprecated
# =>
# =>   ⚠ Command deprecated.
# =>    ╭─[repl_entry #2:1:1]
# =>  1 │ greet bob
# =>    · ────┬────
# =>    ·     ╰── greet is deprecated and will be removed in a future release.
# =>    ╰────
# =>   help: Use vip-greet as a replacement.
# =>
# => Hello, bob!

help commands | where category == deprecated | select name category command_type
# => ╭───┬───────┬────────────┬──────────────╮
# => │ # │ name  │  category  │ command_type │
# => ├───┼───────┼────────────┼──────────────┤
# => │ 0 │ greet │ deprecated │ custom       │
# => ╰───┴───────┴────────────┴──────────────╯
```

Any string can be a category. A name that matches a built-in category, such as `math`, `strings`
or `deprecated`, puts the command in that category. Any other name, such as `"deploy"`, starts a
new category. The exception is `core`, which is kept for Nushell's own commands, so
`@category core` gives the category `custom_core`.

The [`search-terms`](/commands/docs/attr_search-terms.md) attribute adds words that should find the
command even though they aren't in its name or description. `help --find` and
[`help commands --find`](/cookbook/help.md#how-to-see-all-supported-commands) match them, ignoring
case, `help <command>` shows them on a `Search terms:` line, and `scope commands` returns them in its
`search_terms` column. Several `@search-terms` lines add up:

```nu
# Double a number
@search-terms multiply times
@search-terms twice
def double []: number -> number { $in * 2 }

help commands --find TWICE | select name search_terms
# => ╭───┬────────┬────────────────────────╮
# => │ # │  name  │      search_terms      │
# => ├───┼────────┼────────────────────────┤
# => │ 0 │ double │ multiply, times, twice │
# => ╰───┴────────┴────────────────────────╯
```

Each term is a string. A bare word needs no quotes, and a constant list can be spread in, as in
`@search-terms ...$terms`. A value of another type, such as `true` or a `const` that holds a number, is a
parse error. The attribute works on `extern` declarations too.

Attributes also work on [`extern`](externs.md) declarations. One of them, [`@structured`](/commands/docs/attr_structured.md),
applies only to `extern`. It lets an external command return data instead of text. See
[Structured Output](externs.md#structured-output) for examples.

To see other attributes available for use within nushell, check the [command reference](/commands/docs/attr.html)
or run `help attr` from the nushell REPL. Each built-in attribute is a subcommand of `attr`, so `@category`
runs `attr category`. Running `attr` by itself only prints that help.

### Defining your own attributes

An attribute such as `@owner` calls a command named `attr owner` while Nushell parses the definition, and stores the value that command returns. To create your own attribute, define an alias whose name starts with `attr ` and points to a built-in command that can run at parse time. [`echo`](/commands/docs/echo.md) is the usual choice, since it returns its arguments as they are:

```nu
alias "attr owner" = echo
alias "attr tags" = echo
alias "attr slow" = echo

@owner "platform-team"
@tags web api
@slow
@category "deploy"
def deploy [] { "deploying" }

@slow
def rebuild [] { "rebuilding" }

scope commands | where name == deploy | get 0.attributes
# => ╭───┬───────┬────────────────╮
# => │ # │ name  │     value      │
# => ├───┼───────┼────────────────┤
# => │ 0 │ owner │ platform-team  │
# => │ 1 │ tags  │ [list 2 items] │
# => │ 2 │ slow  │                │
# => ╰───┴───────┴────────────────╯
```

Nushell doesn't act on custom attributes. It stores them in the `attributes` column of [`scope commands`](/commands/docs/scope_commands.md), one row per attribute, with its name and value. Several arguments, as in `@tags web api`, give a list, and an attribute without arguments, like `@slow`, stores an empty string. Using the same attribute twice adds two rows. The built-in `@example`, `@search-terms`, `@category` and `@complete` attributes are applied to the command and aren't listed.

A script can read the attributes back to find the commands it cares about:

```nu
scope commands | where {|cmd| "slow" in $cmd.attributes.name } | get name
# => ╭───┬─────────╮
# => │ 0 │ deploy  │
# => │ 1 │ rebuild │
# => ╰───┴─────────╯
```

To share attributes, export the aliases from a module (`export alias "attr owner" = echo`) and import them with `use ownership.nu *`, or by name with `use ownership.nu ["attr owner"]`. A plain `use ownership.nu` puts the module name in front of the alias, so `@owner` can't find it. The standard library's `@test`, `@ignore` and other [testing attributes](./testing.md#the-testing-nu-runner) are aliases of `echo` exported this way.

The command behind an attribute has to be one that can run at parse time. An attribute backed by a custom command, such as `def "attr owner" [x] { $x }`, fails with a `Not a const command` error. An attribute also has to come right before a `def` or `extern`. Anywhere else, it is a `nu::parser::attribute_requires_definition` error.

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

### Changing Directories (cd) in a Custom Command

Likewise, changing the directory using the `cd` command results in a change of the `$env.PWD` environment variable. This means that directory changes (the `$env.PWD` variable) will also be reset when a custom command ends. The solution, as above, is to use `def --env` or `export def --env`.

```nu
def --env go-root [] {
  cd /
}

cd ~
go-root
pwd
# => /
```

## Persisting

To make custom commands available in future Nushell sessions, you'll want to add them to your startup configuration. You can add command definitions:

- Directly in your `config.nu`
- To a file sourced by your `config.nu`
- To a [module](./modules.html) imported by your `config.nu`

See the [configuration chapter](configuration.md) for more details.
