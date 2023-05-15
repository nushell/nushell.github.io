# Modules

Similar to many other programming languages, Nushell also has modules to organize your code. Each module is a "bag" containing a bunch of definitions (typically commands) that you can export (take out or the bag) and use in your current scope. Since Nushell is also a shell, modules allow you to modify environment variables when importing them.

## Quick Overview

There are three ways to define a module in Nushell:

1. "inline"
   - `module spam { ... }`
2. from a file
   - using a .nu file as a module
3. from a directory
   - directory must contain `mod.nu` file (can be empty)

In Nushell, creating a module and importing definitions from a module are two different actions. The former is done using the `module` keyword. The latter using the `use` keyword. You can think of `module` as "wrapping definitions into a bag" and `use` as "opening a bag and taking definitions from it". In most cases, calling `use` will create the module implicitly, so you typically don't need to use `module` that much.

You can define the following things inside a module:

- Commands (`def`, `def-env`)
- Aliases (`alias`)
- Known externals (`extern`)
- Submodules (`module`)
- Imported symbols from other modules (`use`)
- Environment setup (`export-env`)

Only definitions marked with `export` are possible to access from outside of the module ("take out of the bag"). Definitions not marked with `export` are allowed but are visible only inside the module (you could call them private). (_`export-env` is special and does not require `export`._)

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

First, we create a module (put `hello` and `hi` commands into a "bag" called `greetings`), then we import the `hello` command from the module (find a "bag" called `greetings` and take `hello` command from it) with `use`.

## Modules from files

A .nu file can be a module. Just take the contents of the module block from the example above and save it to a file `greetings.nu`. The module name is automatically inferred as the stem of the file ("greetings").

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

Note that the `use greetings.nu hello` call here first implicitly creates the `greetings` module, then takes `hello` from it. You could also write it as `module greetings.nu`, `use greetings hello`. Using `module` can be useful if you're not interested in any definitions from the module but want to, e.g., re-export the module (`export module greetings.nu`).

## Modules from directories

Finally, a directory can be imported as a module. The only condition is that it needs to contain a `mod.nu` file (even emoty). The `mod.nu` file defines the root module. All .nu files inside the module directory are added as submodules (more about submodules later). We could write our `greetings` module like this:

_In the following examples, `/` is used at the end to denote that we're importing a directory but it is not required._

```nushell
# greetings/mod.nu

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

use greetings/ hello

hello
```

The name of the module follows the same rule as module created from a file: Stem of the directory name, i.e., the directory name, is used as the module name. Again, you could do this as a two-step action using `module` and `use` separately, as explained in the previous section.

## Import Pattern

Anything after the [`use`](/commands/docs/use.md) keyword forms an **import pattern** which controls how the definitions are imported.
The import pattern has the following structure `use head members...` where `head` defines the module (name of an existing module, file, or directory). The members are optional and specify what exactly should be imported from th emodule.

Using our `greetings` example:

`use greetings`

Imports all symbols with prefixed with the `greetings` namespace (can call `greetings hello` and `greetings hi`).

`use greetings hello`

The `hello` command will be imported directly without any prefix.

`use greetings [ hello, hi ]`

Imports multiple definitions<> directly without any prefix.

`use greetings *`

You can also use the module name and the `*` glob to import all names directly without any prefix.

## `main`

Exporting a command called `main` from a module defines a command named as the module. Let's extend our `greetings` example:

```nushell
# greetings.nu

export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}

export def main [] {
    "greetings and salutations!"
}
```

then

```
# REPL

> use greetings.nu

> greetings
greetings and salutations!

> greetings hello world
hello world!
```

The `main` is exported only when
a) no import pattern members are used (`use greetings.nu`)
b) glob member is used (`use greetings.nu *`)
Importing definitions selectively (`use greetings.nu hello` or `use greetings.nu [hello hi]`) does not define the `greetings` command. You can, however, selectively import `main` using `use greetings main` (or `[main]`) which defines _only_ the `greetings` command without pulling in `hello` or `hi`.

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

### Local Custom Commands

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

### Re-exporting with `use` (files)

- `export module` vs. `export use`
  ate

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
