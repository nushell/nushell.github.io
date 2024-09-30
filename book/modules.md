# Modules

Similar to many other programming languages, Nushell also has modules to organize your code. Each module is a "bag" containing a bunch of definitions (typically commands) that you can export (take out of the bag) and use in your current scope. Since Nushell is also a shell, modules allow you to modify environment variables when importing them.

## Quick Overview

There are three ways to define a module in Nushell:

1. "inline"
   - `module spam { ... }`
2. from a file
   - using a .nu file as a module
3. from a directory
   - directory must contain a `mod.nu` file

In Nushell, creating a module and importing definitions from a module are two different actions. The former is done using the `module` keyword. The latter using the `use` keyword. You can think of `module` as "wrapping definitions into a bag" and `use` as "opening a bag and taking definitions from it". In most cases, calling `use` will create the module implicitly, so you typically don't need to use `module` that much.

You can define the following things inside a module:

- Commands\* (`def`)
- Aliases (`alias`)
- Known externals\* (`extern`)
- Submodules (`module`)
- Imported symbols from other modules (`use`)
- Environment setup (`export-env`)

Only definitions marked with `export` are possible to access from outside the module ("take out of the bag"). Definitions not marked with `export` are allowed but are visible only inside the module (you could call them private). (_`export-env` is special and does not require `export`._)

_\*These definitions can also be named `main` (see below)._

## "Inline" Modules

The simplest (and probably least useful) way to define a module is an "inline" module can be defined like this:

```nu
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

## Modules from Files

A .nu file can be a module. Just take the contents of the module block from the example above and save it to a file `greetings.nu`. The module name is automatically inferred as the stem of the file ("greetings").

```nu
# greetings.nu

export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}
```

then

```nu
> use greetings.nu hello

> hello
```

The result should be similar as in the previous section.

::: tip Note
Note that the `use greetings.nu hello` call here first implicitly creates the `greetings` module,
then takes `hello` from it. You could also write it as `module greetings.nu`, `use greetings hello`.
Using `module` can be useful if you're not interested in any definitions from the module but want to,
e.g., re-export the module (`export module greetings.nu`).
:::

## Modules from Directories

Finally, a directory can be imported as a module. The only condition is that it needs to contain a `mod.nu` file (even empty, which is not particularly useful, however). The `mod.nu` file defines the root module. Any submodules (`export module`) or re-exports (`export use`) must be declared inside the `mod.nu` file. We could write our `greetings` module like this:

_In the following examples, `/` is used at the end to denote that we're importing a directory but it is not required._

```nu
# greetings/mod.nu

export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}
```

then

```nu
> use greetings/ hello

> hello
```

The name of the module follows the same rule as module created from a file: Stem of the directory name, i.e., the directory name, is used as the module name. Again, you could do this as a two-step action using `module` and `use` separately, as explained in the previous section.

::: tip Note
You can define `main` command inside `mod.nu` to create a command named after the module directory.
:::

## Import Pattern

Anything after the [`use`](/commands/docs/use.md) keyword forms an **import pattern** which controls how the definitions are imported.
The import pattern has the following structure `use head members...` where `head` defines the module (name of an existing module, file, or directory). The members are optional and specify what exactly should be imported from the module.

Using our `greetings` example:

```nu
use greetings
```

imports all symbols prefixed with the `greetings` namespace (can call `greetings hello` and `greetings hi`).

```nu
use greetings hello
```

will import the `hello` command directly without any prefix.

```nu
use greetings [hello, hi]
```

imports multiple definitions<> directly without any prefix.

```nu
use greetings *
```

will import all names directly without any prefix.

## `main`

Exporting a command called `main` from a module defines a command named as the module. Let's extend our `greetings` example:

```nu
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

```nu
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

Additionally, `main` has special behavior if used in a script file, regardless of whether it is exported or not. See the [section on scripts](scripts.html#parameterizing-scripts) for more details.

Apart from commands (`def`, `def --env`), known externals (`extern`) can also be named `main`.

## Submodules and Subcommands

Submodules are modules inside modules. They are automatically created when you call `use` on a directory: Any .nu files inside the directory are implicitly added as submodules of the main module. There are two more ways to add a submodule to a module:

1. Using `export module`
2. Using `export use`

The difference is that `export module some-module` _only_ adds the module as a submodule, while `export use some-module` _also_ re-exports the submodule's definitions. Since definitions of submodules are available when importing from a module, `export use some-module` is typically redundant, unless you want to re-export its definitions without the namespace prefix.

::: tip Note
`module` without `export` defines only a local module, it does not export a submodule.
:::

Let's illustrate this with an example. Assume three files:

```nu
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

```nu
# animals.nu

export def dog [] {
    "haf"
}

export def cat [] {
    "meow"
}
```

```nu
# voice.nu

export use greetings.nu *

export module animals.nu

```

Then:

```nu
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

Modules can define an environment using [`export-env`](/commands/docs/export-env.md):

```nu
# greetings.nu

export-env {
    $env.MYNAME = "Arthur, King of the Britons"
}

export def hello [] {
    $"hello ($env.MYNAME)"
}
```

When [`use`](/commands/docs/use.md) is evaluated, it will run the code inside the [`export-env`](/commands/docs/export-env.md) block and merge its environment into the current scope:

```nu
> use greetings.nu

> $env.MYNAME
Arthur, King of the Britons

> greetings hello
hello Arthur, King of the Britons!
```

::: tip
The module implementation can use its own scoped environment variables without them bleeding into users scope. For example:

```nu
# greetings-local.nu

export def hello [] {
    $env.MYNAMELOCAL = "Arthur, King of the Britons"
    $"hello ($env.MYNAMELOCAL)"
}
```

```nu
> use greetings-local.nu

> $env.MYNAMELOCAL
Error: nu::shell::column_not_found
[…]

> greetings-local hello
hello Arthur, King of the Britons!
```

:::

## Caveats

Like any programming language, Nushell is also a product of a tradeoff and there are limitations to our module system.

### `export-env` runs only when the `use` call is _evaluated_

If you also want to keep your variables in separate modules and export their environment, you could try to [`export use`](/commands/docs/export_use.md) it:

```nu
# purpose.nu
export-env {
    $env.MYPURPOSE = "to build an empire."
}

export def greeting_purpose [] {
    $"Hello ($env.MYNAME). My purpose is ($env.MYPURPOSE)"
}
```

and then use it

```nu
> use purpose.nu

> purpose greeting_purpose
```

However, this won't work, because the code inside the module is not _evaluated_, only _parsed_ (only the `export-env` block is evaluated when you call `use purpose.nu`). To export the environment of `greetings.nu`, you need to add it to the `export-env` module:

```nu
# purpose.nu
export-env {
    use greetings.nu
    $env.MYPURPOSE = "to build an empire."
}

export def greeting_purpose [] {
    $"Hello ($env.MYNAME). My purpose is ($env.MYPURPOSE)"
}
```

then

```nu
> use purpose.nu

> purpose greeting_purpose
Hello Arthur, King of the Britons. My purpose is to build an empire.
```

Calling `use purpose.nu` ran the `export-env` block inside `purpose.nu` which in turn ran `use greetings.nu` which in turn ran the `export-env` block inside `greetings.nu`, preserving the environment changes.

### Module file / command cannot be named after parent module

- Module directory cannot contain .nu file named after the directory (`spam/spam.nu`)
  - Consider a `spam` directory containing both `spam.nu` and `mod.nu`, calling `use spam *` would create an ambiguous situation where the `spam` module would be defined twice.
- Module cannot contain file named after the module
  - Same case as above: Module `spam` containing both `main` and `spam` commands would create an ambiguous situation when exported as `use spam *`.

## Examples

This section describes some useful patterns using modules.

### Local Definitions

Anything defined in a module without the [`export`](/commands/docs/export.md) keyword will work only in the module's scope.

```nu
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

```nu
> use greetings.nu *


> hello "world"
hello world!

> hi "there"
hi there!

> greetings-helper "foo" "bar"  # fails because 'greetings-helper' is not exported

> generate-prefix  # fails because the command is imported only locally inside the module
```

### Dumping Files into Directory

A common pattern in traditional shells is dumping and auto-sourcing files from a directory (for example, loading custom completions). In Nushell, doing this directly is currently not possible, but directory modules can still be used.

Here we'll create a simple completion module with a submodule dedicated to some Git completions:

1. Create the completion directory

   `mkdir ($nu.default-config-dir | path join completions)`

2. Create an empty `mod.nu` for it

   `touch ($nu.default-config-dir | path join completions mod.nu)`

3. Put the following snippet in `git.nu` under the `completions` directory

   ```nu
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

4. Add `export module git.nu` to `mod.nu`
5. Add the parent of the `completions` directory to your NU_LIB_DIRS inside `env.nu`

   ```nu
   $env.NU_LIB_DIRS = [
       ...
       $nu.default-config-dir
   ]
   ```

6. Import the completions to Nushell in your `config.nu`:

   `use completions *`

Now you've set up a directory where you can put your completion files, and you should have some Git completions the next time you start Nushell.

::: tip Note
This will use the file name (in our example `git` from `git.nu`) as the module name. This means some completions might not work if the definition has the base command in its name.
For example, if you defined our known externals in our `git.nu` as `export extern 'git push' []`, etc. and followed the rest of the steps, you would get subcommands like `git git push`, etc.
You would need to call `use completions git *` to get the desired subcommands. For this reason, using `main` as outlined in the step above is the preferred way to define subcommands.
:::

### Setting environment + aliases (conda style)

`def --env` commands, `export-env` block and aliases can be used to dynamically manipulate "virtual environments" (a concept well known from Python).

We use it in our [official virtualenv integration](https://github.com/pypa/virtualenv/blob/main/src/virtualenv/activation/nushell/activate.nu). Another example is our [unofficial Conda module](https://github.com/nushell/nu_scripts/blob/main/modules/virtual_environments/conda.nu).

::: warning
Work in progress
:::

## Hiding

Any custom command or alias, imported from a module or not, can be "hidden", restoring the previous definition.
We do this with the [`hide`](/commands/docs/hide.md) command:

```nu
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

- Hides all the module's exports, without the prefix

:::tip Note
`hide` is not a supported keyword at the root of a module (unlike `def` etc.)
:::
