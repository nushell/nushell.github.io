# Custom commands

Nu's ability to compose long pipelines allows you a lot of control over your data and system, but it comes at the price of a lot of typing. Ideally, you'd be able to save your well-crafted pipelines to use again and again.

This is where custom commands come in.

An example definition of a custom command:

```nu
def greet [name] {
  ['hello' $name]
}
```

::: tip
The value produced by the last line of a command becomes the command's returned value. In this case, a list containing the string `'hello'` and `$name` is returned. To prevent this, you can place `null` (or the [`ignore`](/commands/docs/ignore.md) command) at the end of the pipeline, like so: `['hello' $name] | null`. Also note that most file system commands, such as [`save`](/commands/docs/save.md) or [`cd`](/commands/docs/cd.md), always output `null`.
:::

In this definition, we define the `greet` command, which takes a single parameter `name`. Following this parameter is the block that represents what will happen when the custom command runs. When called, the custom command will set the value passed for `name` as the `$name` variable, which will be available to the block.

To run the above, we can call it like we would call built-in commands:

```nu
> greet "world"
```

As we do, we also get output just as we would with built-in commands:

```
───┬───────
 0 │ hello
 1 │ world
───┴───────
```

::: tip
If you want to generate a single string, you can use the string interpolation syntax to embed $name in it:

```nu
def greet [name] {
  $"hello ($name)"
}

greet nushell
```

returns `hello nushell`
:::

## Command names

In Nushell, a command name is a string of characters. Here are some examples of valid command names: `greet`, `get-size`, `mycommand123`, `my command`, and `😊`.

_Note: It's common practice in Nushell to separate the words of the command with `-` for better readability._ For example `get-size` instead of `getsize` or `get_size`.

## Sub-commands

You can also define subcommands to commands using a space. For example, if we wanted to add a new subcommand to [`str`](/commands/docs/str.md), we can create it by naming our subcommand to start with "str ". For example:

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
  "this is a custom command with a space in the name!"
}
```

## Parameter types

When defining custom commands, you can name and optionally set the type for each parameter. For example, you can write the above as:

```nu
def greet [name: string] {
  $"hello ($name)"
}
```

The types of parameters are optional. Nushell supports leaving them off and treating the parameter as `any` if so. If you annotated a type on a parameter, Nushell will check this type when you call the function.

For example, let's say you wanted to take in an `int` instead:

```nu
def greet [name: int] {
  $"hello ($name)"
}

greet world
```

If we try to run the above, Nushell will tell us that the types don't match:

```
error: Type Error
  ┌─ shell:6:7
  │
5 │ greet world
  │       ^^^^^ Expected int
```

This can help you guide users of your definitions to call them with only the supported types.

The currently accepted types are (as of version 0.65.0):

- `any`
- `block`
- `cell-path`
- `duration`
- `path`
- `expr`
- `filesize`
- `glob`
- `int`
- `math`
- `number`
- `operator`
- `range`
- `cond`
- `bool`
- `signature`
- `string`
- `variable`
- `record`
- `list`
- `table`
- `error`

## Parameters with a default value

To make a parameter optional and directly provide a default value for it you can provide a default value in the command definition.

```nu
def greet [name = "nushell"] {
  $"hello ($name)"
}
```

You can call this command either without the parameter or with a value to override the default value:

```nu
> greet
hello nushell
> greet world
hello world
```

You can also combine a default value with a [type requirement](#parameter-types):

```nu
def congratulate [age: int = 18] {
  $"Happy birthday! You are ($age) years old now!"
}
```

If you want to check if an optional parameter is present or not and not just rely on a default value use [optional positional parameters](#optional-positional-parameters) instead.

## Optional positional parameters

By default, positional parameters are required. If a positional parameter is not passed, we will encounter an error:

```nu
  × Missing required positional argument.
   ╭─[entry #23:1:1]
 1 │ greet
   ·      ▲
   ·      ╰── missing name
   ╰────
  help: Usage: greet <name>
```

We can instead mark a positional parameter as optional by putting a question mark (`?`) after its name. For example:

```nu
def greet [name?: string] {
  $"hello ($name)"
}

greet
```

Making a positional parameter optional does not change its name when accessed in the body. As the example above shows, it is still accessed with `$name`, despite the `?` suffix in the parameter list.

When an optional parameter is not passed, its value in the command body is equal to `null`. We can use this to act on the case where a parameter was not passed:

```nu
def greet [name?: string] {
  if ($name == null) {
    "hello, I don't know your name!"
  } else {
    $"hello ($name)"
  }
}

greet
```

If you just want to set a default value when the parameter is missing it is simpler to use a [default value](#parameters-with-a-default-value) instead.

If required and optional positional parameters are used together, then the required parameters must appear in the definition first.

## Flags

In addition to passing positional parameters, you can also pass named parameters by defining flags for your custom commands.

For example:

```nu
def greet [
  name: string
  --age: int
] {
  [$name $age]
}
```

In the `greet` definition above, we define the `name` positional parameter as well as an `age` flag. This allows the caller of `greet` to optionally pass the `age` parameter as well.

You can call the above using:

```nu
> greet world --age 10
```

Or:

```nu
> greet --age 10 world
```

Or even leave the flag off altogether:

```nu
> greet world
```

Flags can also be defined to have a shorthand version. This allows you to pass a simpler flag as well as a longhand, easier-to-read flag.

Let's extend the previous example to use a shorthand flag for the `age` value:

```nu
def greet [
  name: string
  --age (-a): int
] {
  [$name $age]
}
```

_Note:_ Flags are named by their longhand name, so the above example would need to use `$age` and not `$a`.

Now, we can call this updated definition using the shorthand flag:

```nu
> greet -a 10 hello
```

Flags can also be used as basic switches. This means that their presence or absence is taken as an argument for the definition. Extending the previous example:

```nu
def greet [
  name: string
  --age (-a): int
  --twice
] {
  if $twice {
    [$name $name $age $age]
  } else {
    [$name $age]
  }
}
```

And the definition can be either called as:

```nu
> greet -a 10 --twice hello
```

Or just without the switch flag:

```nu
> greet -a 10 hello
```

Flags can contain dashes. They can be accessed by replacing the dash with an underscore:

```nu
def greet [
  name: string
  --age (-a): int
  --two-times
] {
  if $two_times {
    [$name $name $age $age]
  } else {
    [$name $age]
  }
}
```

## Rest parameters

There may be cases when you want to define a command which takes any number of positional arguments. We can do this with a rest parameter, using the following `...` syntax:

```nu
def greet [...name: string] {
  print "hello all:"
  for $n in $name {
    print $n
  }
}

greet earth mars jupiter venus
```

We could call the above definition of the `greet` command with any number of arguments, including none at all. All of the arguments are collected into `$name` as a list.

Rest parameters can be used together with positional parameters:

```nu
def greet [vip: string, ...name: string] {
  print $"hello to our VIP ($vip)"
  print "and hello to everybody else:"
  for $n in $name {
    print $n
  }
}

#     $vip          $name
#     ---- ------------------------
greet moon earth mars jupiter venus
```

## Documenting your command

In order to best help users of your custom commands, you can also document them with additional descriptions for the commands and parameters.

Taking our previous example:

```nu
def greet [
  name: string
  --age (-a): int
] {
  [$name $age]
}
```

Once defined, we can run `help greet` to get the help information for the command:

```nu
Usage:
  > greet <name> {flags}

Parameters:
  <name>

Flags:
  -h, --help: Display this help message
  -a, --age <integer>
```

You can see the parameter and flag that we defined, as well as the `-h` help flag that all commands get.

To improve this help, we can add descriptions to our definition that will show up in the help:

```nu
# A greeting command that can greet the caller
def greet [
  name: string      # The name of the person to greet
  --age (-a): int   # The age of the person
] {
  [$name $age]
}
```

The comments that we put on the definition and its parameters then appear as descriptions inside the [`help`](/commands/docs/help.md) of the command.

::: warning Note
A Nushell comment that continues on the same line for argument documentation purposes requires a space before the ` #` pound sign.
:::

Now, if we run `help greet`, we're given a more helpful help text:

```
A greeting command that can greet the caller

Usage:
  > greet <name> {flags}

Parameters:
  <name> The name of the person to greet

Flags:
  -h, --help: Display this help message
  -a, --age <integer>: The age of the person
```

## Pipeline Output

Custom commands stream their output just like built-in commands. For example, let's say we wanted to refactor this pipeline:

```nu
> ls | get name
```

Let's move [`ls`](/commands/docs/ls.md) into a command that we've written:

```nu
def my-ls [] { ls }
```

We can use the output from this command just as we would [`ls`](/commands/docs/ls.md).

```
> my-ls | get name
───┬───────────────────────
 0 │ myscript.nu
 1 │ myscript2.nu
 2 │ welcome_to_nushell.md
───┴───────────────────────
```

This lets us easily build custom commands and process their output. Note, that we don't use return statements like other languages. Instead, we build pipelines that output streams of data that can be connected to other pipelines.

## Pipeline Input

Custom commands can also take input from the pipeline, just like other commands. This input is automatically passed to the block that the custom command uses.

Let's make our own command that doubles every value it receives as input:

```nu
def double [] {
  each { |it| 2 * $it }
}
```

Now, if we call the above command later in a pipeline, we can see what it does with the input:

```nu
> [1 2 3] | double
───┬─────
 0 │ 2
 1 │ 4
 2 │ 6
───┴─────
```

We can also store the input for later use using the `$in` variable:

```nu
def nullify [...cols] {
  let start = $in
  $cols | reduce --fold $start { |col, df|
    $df | upsert $col null
  }
}
```

## Persisting

For information about how to persist custom commands so that they're visible when you start up Nushell, see the [configuration chapter](configuration.md) and add your startup script.
