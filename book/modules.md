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

- Commands\* (`def`, `def-env`)
- Aliases (`alias`)
- Known externals\* (`extern`)
- Submodules (`module`)
- Imported symbols from other modules (`use`)
- Environment setup (`export-env`)

Only definitions marked with `export` are possible to access from outside of the module ("take out of the bag"). Definitions not marked with `export` are allowed but are visible only inside the module (you could call them private). (_`export-env` is special and does not require `export`._)

_\*These definitions can also be defined as `main` (see below)._

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
> use greetings.nu hello

> hello
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
> use greetings/ hello

> hello
```

The name of the module follows the same rule as module created from a file: Stem of the directory name, i.e., the directory name, is used as the module name. Again, you could do this as a two-step action using `module` and `use` separately, as explained in the previous section.

:::tip You can define `main` command inside `mod.nu` to create a command named after the module directory. :::

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
> use greetings.nu

> greetings
greetings and salutations!

> greetings hello world
hello world!
```

The `main` is exported only when

- no import pattern members are used (`use greetings.nu`)
- glob member is used (`use greetings.nu *`)

Importing definitions selectively (`use greetings.nu hello` or `use greetings.nu [hello hi]`) does not define the `greetings` command from `main`. You can, however, selectively import `main` using `use greetings main` (or `[main]`) which defines _only_ the `greetings` command without pulling in `hello` or `hi`.

Apart from commands (`def`, `def-env`), known externals (`extern`) can also be named `main`.

## Submodules and subcommands

Submodules are modules inside modules. They are automatically created when you call `use` on a directory: Any .nu files inside the directory are implicitly added as submodules of the main module. There are two more ways to add a submodule to a module:

1. Using `export module`
2. Using `export use`

The difference is that `export module some-module` _only_ adds the module as a submodule, while `export use some-module` _also_ re-exports the submodule's definitions. Since definitions of submodules are available when importing from a module, `export use some-module` is typically redundant, unless you want to re-export its definitions without the namespace prefix.

_Note: `module` without `export` defines only a local module, it does not export a submodule._

Let's illustrate this with an example. Assume three files:

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

```nushell
# animals.nu

export def dog [] {
    "haf"
}

export def cat [] {
    "meow"
}
```

```nushell
# voice.nu

export use greetings.nu *

export module animals.nu

```

Then:

```
> use voice.nu

> voice animals dog
haf

> voice animals cat
meow

> voice hello world
hello world

> voice hi there
hi there!

> voice greetings
greetings and salutations!

```

As you can see, defining the submodule structure also shapes the command line API. In Nushell, namespaces directly folds into subcommands. This is true for all definitions: aliases, commands, known externals, modules.

## Environment Variables

Modules can also define an environment using [`export-env`](/commands/docs/export-env.md):

```
# greetings.nu

export-env {
    let-env MYNAME = "Arthur, King of the Britons"
}

export def hello [] {
    $"hello ($env.MYNAME)"
}
```

When [`use`](/commands/docs/use.md) is evaluated, it will run the code inside the [`export-env`](/commands/docs/export-env.md) block and merge its environment into the current scope:

```
> use greetings.nu

> $env.MYNAME
Arthur, King of the Britons

> greetings hello
hello Arthur, King of the Britons!
```

::: tip
You can put a complex code defining your environment without polluting the namespace of the module, for example:

```nushell
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

## Caveats

Like any programming language, Nushell is also a product of a tradeoff and there are limitations to our module system.

### `export-env` runs only when the `use` call is _evaluated_

If you also want to keep your variables in separate modules and export their environment, you could try to [`export use`](/commands/docs/export_use.md) it:

```nushell
# purpose.nu
export-env {
    let-env MYPURPOSE = "to build an empire."
}

export def greeting_purpose [] {
    $"Hello ($env.MYNAME). My purpose is ($env.MYPURPOSE)"
}
```

and then use it

```nushell
> use purpose.nu

> purpose greeeting_purpose
```

However, this won't work, because the code inside the module is not _evaluated_, only _parsed_ (only the `export-env` block is evaluated when you call `use purpose.nu`). To export the environment of `greetings.nu`, you need to add it to the `export-env` module:

```nushell
# purpose.nu
export-env {
    use greetings.nu
    let-env MYPURPOSE = "to build an empire."
}

export def greeting_purpose [] {
    $"Hello ($env.MYNAME). My purpose is ($env.MYPURPOSE)"
}
```

then

```
> use purpose.nu

> purpose greeting_purpose
Hello Arthur, King of the Britons. My purpose is to build an empire.
```

Calling `use purpose.nu` ran the `export-env` block inside `purpose.nu` which in run ran `use greetings.nu` which in turn ran the `export-env` block inside `greetings.nu`, preserving the environment changes.

### Module file / command cannot be named after parent module

- Module directory cannot contain .nu file named after the directory (`spam/spam.nu`)
  - Consider a `spam` directory containing both `spam.nu` and `mod.nu`, calling `use spam *` would create an ambiguous situation where the `spam` module would be defined twice.
- Module cannot contain file named after the module
  - Same case as above: Module `spam` containg both `main` and `spam` commands would create an ambiguous situation when exported as `use spam *`.

## Examples

This section describes some useful patterns using modules.

### Local Definitions

Anything defined in a module without the [`export`](/commands/docs/export.md) keyword will work only in the module's scope.

```nushell
# greetings.nu

use tools/utils.nu generate-prefix  # visible only locally (we assume the file exists)

export def hello [name: string] {
    greetings-helper "hello" "world"
}

export def hi [where: string] {
    greetings-helper "hi" "there"
}

def greetings-helper [greeting: string, subject: string] {
    $"(generate-prefix)($greeting) ($subject)!"
}
```

then

```nushell
> use greetings.nu *


> hello "world"
hello world!

> hi "there"
hi there!

> greetings-helper "foo" "bar"  # fails because 'greetings-helper' is not exported

> generate-prefix  # fails because the command is imported only locally inside the module
```

### Directory structure as subcommad tree

Since directories can be imported as submodules and submodules can naturally form subcommands it is easy to build even complex command line applications with a simple file structure.

_WIP_

### Dumping files into directory

A common pattern in traditional shells is dumping and auto-sourcing files from a directory (for example, loading custom completions). In Nushell, similar effect can be achieved via module directories.

1. Create a directory (e.g., `mkdir ($nu.default-config-dir | path join completions)`) and create empty `mod.nu` inside
2. Add the directory to your NU_LIB_DIRS inside `env.nu`
3. Put `use completions *` into your `config.nu`

Now you've set up a directory where you can put your completion files. For example:

```
# git.nu

export extern main [
    --version(-v)
    -C: string
    # ... etc.
]

export extern add [
    --verbose(-v)
    --dry-run(-n)
    # ... etc.
]

export extern checkout [
    branch: string@complete-git-branch
]

def complete-git-branch [] {
    # ... code to list git branches
}
```

If you put this file into the `completions` directory and reload config/Nushell, you should see the `git`, `git add` and `git checkout` commands highlighted with flag completions working.

### Setting environment + aliases (conda style)

`def-env` commands, `export-env` block and aliases can be used to dynamically manipulate "virtual environments" (a concept well known from Python).

We use it in our official virtualenv integration https://github.com/pypa/virtualenv/blob/main/src/virtualenv/activation/nushell/activate.nu

Another example could be our unofficial Conda module: https://github.com/nushell/nu_scripts/blob/f86a060c10f132407694e9ba0f536bfe3ee51efc/modules/virtual_environments/conda.nu

_WIP_

## Hiding

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

_Note: `hide` is not a supported keyword at the root of the module (unlike `def` etc.)_
