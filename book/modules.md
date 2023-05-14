# Modules

Similar to many other programming languages, Nushell also has modules that let you organize your code into "bags". Each module is a "bag" containing a bunch of commands that you can export (take out or the bag) and use in your current scope. Since Nushell is also a shell, modules allow you to modify environment variables when importing the module.

## Quick Overview

There are three ways to define a module in Nushell:

1. "inline"
2. from a file
3. from a directory
   - directory must contain `mod.nu` file (can be empty)

In Nushell, creating a module and importing definitions from a module are two different actions. The former is done using the `module` keyword. The latter using the `use` keyword. You can think of `module` as "wrapping definitions into a bag" and `use` as "opening a bag and taking definitions from it".

You can define the following things inside a module:

- Commands (`def`, `def-env`)
- Aliases (`alias`)
- Known externals (`extern`)
- Submodules (`module`)
- Imported symbols from other modules (`use`)
- Environment setup (`export-env`)

Only definitions marked with `export` are available to import from the module ("take out of the bag"). Definitions not marked with `export` are allowed but are visible only inside the module (private). (_`export-env` is special and does not require `export`._)

## "Inline" modules

The simplest (and probably least useful) way to define a module is an "inline" module can be defined like this:

```nushell
module greetings {
    export def hello [name: string] {
        $"hello ($name)!"
    }

    export def hi [where: string] {
        $"hi ($where)!"
    }
}

use greetings hello

hello "world"
```

_You can paste the code into a file and run it with `nu`, or type into the REPL._

First, we create a module (wrap `hello` and `hi` commands into a "bag" called `greetings`), then we import the `hello` command from the module (find a "bag" called `greetings` and take `hello` command from it) using `use`.

## Modules from files

or in a file named the same as the module you want to create:

```nushell
# greetings.nu

export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}
```

then

```nushell
# in another file or REPL

use greetings.nu hello

hello
```

The result should be similar as in the previous section.

## Modules from directories

Using `/` at the end but it's not required

## `main`

## Using modules

By itself, the module does not do anything. To use what the module exports, we need to [`use`](/commands/docs/use.md) it.

```
> use greetings

> greetings hello "world"
hello world!

> greetings hi "there"
hi there!
```

The `hello` and `hi` commands are now available with the `greetings` prefix.

## Importing symbols

In general, anything after the [`use`](/commands/docs/use.md) keyword forms an **import pattern** which controls how the symbols are imported.
The import pattern can be one of the following:

`use greetings`

Imports all symbols with the module name as a prefix (we saw this in the previous example).

`use greetings hello`

The `hello` symbol will be imported directly without any prefix.

`use greetings [ hello, hi ]`

Imports multiple symbols directly without any prefix.

`use greetings *`

You can also use the module name and the `*` glob to import all names directly without any prefix.

## Module Files

Nushell lets you implicitly treat a source file as a module.
Let's start by saving the body of the module definition into a file:

```
# greetings.nu

export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}
```

Now, you can call [`use`](/commands/docs/use.md) directly on the file:

```
> use greetings.nu

> greetings hello "world"
hello world!

> greetings hi "there"
hi there!
```

Nushell automatically infers the module's name from the stem of the file ("greetings" without the ".nu" extension).
You can use any import patterns as described above with the file name instead of the module name.

## Local Custom Commands

Any custom commands defined in a module without the [`export`](/commands/docs/export.md) keyword will work only in the module's scope:

```
# greetings.nu

export def hello [name: string] {
    greetings-helper "hello" "world"
}

export def hi [where: string] {
    greetings-helper "hi" "there"
}

def greetings-helper [greeting: string, subject: string] {
    $"($greeting) ($subject)!"
}
```

Then, in Nushell we import all definitions from the "greetings.nu":

```
> use greetings.nu *

> hello "world"
hello world!

> hi "there"
hi there!

> greetings-helper "foo" "bar"  # fails because 'greetings-helper' is not exported
```

## Environment Variables

So far we used modules just to import custom commands.
However, modules can also define an environment using [`export-env`](/commands/docs/export-env.md):

```
# greetings.nu

export-env {
    let-env MYNAME = "Arthur, King of the Britons"
}

export def hello [] {
    $"hello ($env.MYNAME)"
}
```

[`use`](/commands/docs/use.md) will run the code inside the [`export-env`](/commands/docs/export-env.md) block and merge its environment into the current scope:

```
> use greetings.nu

> $env.MYNAME
Arthur, King of the Britons

> greetings hello
hello Arthur, King of the Britons!
```

::: tip
You might wonder why we can't just define [`let-env`](/commands/docs/let-env.md) at the top of the module.
The reason is that the `export-env {...}` block keeps its scope separate from the rest of the module which makes it more organized.
You can put a complex code defining your environment without polluting the namespace of the module, for example:

```
export-env {
    def tmp [] { "tmp" }
    def other [] { "other" }

    let len = (tmp | str length)

    load-env {
        OTHER_ENV: (other)
        TMP_LEN: $len
    }
}
```

Only `$env.TMP_LEN` and `$env.OTHER_ENV` are preserved after evaluating the `export-env` module.
:::

If you also want to keep your variables in separate modules and export its environment, you could try to [`export use`](/commands/docs/export_use.md) it:

```
# purpose.nu
export use greetings.nu
export-env {let-env MYPURPOSE = "to build an empire."}

export def greeting_purpose [] {
    $"Hello ($env.MYNAME). My purpose is ($env.MYPURPOSE)"
}

```

and then use it

```
> use purpose.nu
> purpose greeeting_purpose
```

However, this won't work, because the module would not export its environment unless defined manually, like so:

```
# purpose.nu

# preserves its environment
export-env {
    use greetings.nu
    let-env MYPURPOSE = "to build an empire."
}

export def greeting_purpose [] {
    $"Hello ($env.MYNAME). My purpose is ($env.MYPURPOSE)"
}

```

Now, everything is exported properly

```
> use purpose.nu
> purpose greeting_purpose
Hello Arthur, King of the Britons. My purpose is to build an empire.
```

## Exporting symbols

Apart from [`def`](/commands/docs/def.md) and [`def-env`](/commands/docs/def-env.md), you can also export [`alias`](/commands/docs/alias.md)es and [`extern`](/commands/docs/extern.md)s, giving you a way to only use these features when you need. Exporting externs also gives you the ability to hide custom completion commands in a module, so they don't have to be part of the global namespace.

Here's the full list of ways you can export:

- [`export def`](/commands/docs/export_def.md) - export a custom command
- [`export def-env`](/commands/docs/export_def-env.md) - export a custom environment command
- [`export alias`](/commands/docs/export_alias.md) - export an alias
- [`export extern`](/commands/docs/export_extern.md) - export a known external definition
- [`export use`](/commands/docs/export_use.md) - use definitions from a module and export them from this module

## What is possible to export?

Similar to [`def`](/commands/docs/def.md), it is also possible to mark [`def-env`](/commands/docs/def-env.md) with the [`export`](/commands/docs/export.md) keyword (you can learn more about [`def-env`](/commands/docs/def-env.md) in the [Environment](environment.md) chapter).

## Caveats

Like most programming language designs, even our modules are a product of a tradeoff and there are limitations:

- `export-env` runs only when the `use` call is _evaluated_.
- Module directory cannot contain .nu file named after the directory (`spam/spam.nu`)
  - Consider a `spam` directory containing both `spam.nu` and `mod.nu`, calling `use spam *` would create an ambiguous situation where the `spam` module would be defined twice.
- Module cannot contain file named after the module
  - Same case as above: Module `spam` containg both `main` and `spam` commands would create an ambiguous situation when exported as `use spam *`.

## Examples

### Re-exporting with `use` (files)

- `export module` vs. `export use`

### Directory structure as subcommad tree

### Dumping files into directory (completions, extern)

### Setting environment + aliases (conda style)

## Hiding (move away)

Any custom command or alias, imported from a module or not, can be "hidden", restoring the previous definition.
We do this with the [`hide`](/commands/docs/hide.md) command:

```
> def foo [] { "foo" }

> foo
foo

> hide foo

> foo  # error! command not found!
```

The [`hide`](/commands/docs/hide.md) command also accepts import patterns, just like [`use`](/commands/docs/use.md).
The import pattern is interpreted slightly differently, though.
It can be one of the following:

`hide foo` or `hide greetings`

- If the name is a custom command or an environment variable, hides it directly. Otherwise:
- If the name is a module name, hides all of its exports prefixed with the module name

`hide greetings hello`

- Hides only the prefixed command / environment variable

`hide greetings [hello, hi]`

- Hides only the prefixed commands / environment variables

`hide greetings *`

- Hides all of the module's exports, without the prefix

## Hiding Environment Variables (move away)

Environment variables can be hidden with [`hide-env`](/commands/docs/hide-env.md):

```
> let-env FOO = "FOO"

> $env.FOO
FOO

> hide-env FOO

> $env.FOO  # error! environment variable not found!
```
