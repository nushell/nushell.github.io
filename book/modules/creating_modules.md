# Creating Modules

[[toc]]

::: important
When working through the examples below, start a new shell before importing an updated version of each module or command. This will help reduce any confusion caused by definitions from previous imports. It is also required for modules in a directory (a `mod.nu` file): within one shell session, Nushell keeps using the version of such a module that it imported first, even after you change its files.
:::

## Overview

Modules (and Submodules, to be covered below) are created in one of two ways:

- Most commonly, by creating a file with a series of `export` statements of definitions to be exported from the module.
- For submodules inside a module, using the `module` command

::: tip
While it's possible to use the `module` command to create a module directly at the commandline, it's far more useful and common to store the module definitions in a file for reusability.
:::

The module file can be either:

- A file named `mod.nu`, in which case its _directory_ becomes the module name
- Any other `<module_name>.nu` file, in which case the filename becomes the module name

### Simple Module Example

Create a file named `inc.nu` with the following:

```nu
export def increment []: int -> int  {
    $in + 1
}
```

This is a module! We can now import it and use the `increment` command:

```nu
use inc.nu *
5 | increment
# => 6
```

Of course, you can easily distribute a file like this so that others can make use of the module as well.

## Exports

We covered the types of definitions that are available in modules briefly in the main Modules Overview above. While this might be enough explanation for an end-user, module authors will need to know _how_ to create the export definitions for:

- Commands ([`export def`](/commands/docs/export_def.md))
- Aliases ([`export alias`](/commands/docs/export_alias.md))
- Constants ([`export const`](/commands/docs/export_const.md))
- Known externals ([`export extern`](/commands/docs/export_extern.md))
- Submodules ([`export module`](/commands/docs/export_module.md))
- Imported symbols from other modules ([`export use`](/commands/docs/export_use.md))
- Environment setup ([`export-env`](/commands/docs/export-env.md))

::: tip
Only definitions marked with `export` (or `export-env` for environment variables) are accessible when the module is imported. Definitions not marked with `export` are only visible from inside the module. In some languages, these would be called "private" or "local" definitions. An example can be found below in [Additional Examples](#local-definitions).
:::

### `main` Exports

::: important
An export cannot have the same name as that of the module itself.
:::

In the [Basic Example](#simple-module-example) above, we had a module named `inc` with a command named `increment`. However, if we rename that file to `increment.nu`, it will fail to import.

```nu
mv inc.nu increment.nu
```

```nu
use increment.nu *
# => Error: nu::parser::named_as_module
# =>
# =>   × Can't export command named same as the module.
# =>    ╭─[/home/me/modules/increment.nu:1:12]
# =>  1 │ export def increment []: int -> int  {
# =>    ·            ────┬────
# =>    ·                ╰── can't export from module increment
# =>  2 │     $in + 1
# =>    ╰────
# =>   help: Module increment can't export command named the same as the module. Either change the module name, or export `main` command.
```

As helpfully mentioned in the error message, you can simply rename the export `main`, in which case it will take on the name of the module when imported. Edit the `increment.nu` file:

```nu
export def main []: int -> int {
    $in + 1
}
```

Now it works as expected:

```nu
use ./increment.nu
2024 | increment
# => 2025
```

::: note
`main` can be used for both `export def` and `export extern` definitions.
:::

::: tip
`main` definitions are imported in the following cases:

- The entire module is imported with `use <module>` or `use <module.nu>`
- The `*` glob is used to import all of the modules definitions (e.g., `use <module> *`, etc.)
- The `main` definition is explicitly imported with `use <module> main`, `use <module> [main]`, etc.)

Conversely, the following forms do _not_ import the `main` definition:

```nu
use <module> <other_definition>
# or
use <module> [ <other_definitions> ]
```

:::

::: note
Additionally, `main` has special behavior if used in a script file, regardless of whether it is exported or not. See the [Scripts](../scripts.html#parameterizing-scripts) chapter for more details.
:::

## Module Files

As mentioned briefly in the Overview above, modules can be created either as:

1. `<module_name>.nu`: "File-form" - Useful for simple modules
2. `<module_name>/mod.nu`: "Directory-form" - Useful for organizing larger module projects where submodules can easily map to subdirectories of the main module

The `increment.nu` example above is clearly an example of (1) the file-form. Let's try converting it to the directory-form:

```nu
mkdir increment
mv increment.nu increment/mod.nu
```

```nu
use increment *
41 | increment
# => 42
```

Notice that the behavior of the module once imported is identical regardless of whether the file-form or directory-form is used; only its path changes.

::: note
Technically, you can import this either using the directory form above or explicitly with `use increment/mod.nu *`, but the directory shorthand is preferred when using a `mod.nu`.
:::

## Subcommands

As covered in [Custom Commands](../custom_commands.md), subcommands allow us to group commands logically. Using modules, this can be done in one of two ways:

1. As with any custom command, the command can be defined as `"<command> <subcommand>"`, using a space inside quotes. Let's add an `increment by` subcommand to the `increment` module we defined above:

```nu
export def main []: int -> int {
    $in + 1
}

export def "increment by" [amount: int]: int -> int {
    $in + $amount
}
```

It can then be imported with `use increment *` to load both the `increment` command and `increment by` subcommand.

2. Alternatively, we can define the subcommand simply using the name `by`, since importing the entire `increment` module will result in the same commands:

```nu
export def main []: int -> int {
    $in + 1
}

export def by [amount: int]: int -> int {
    $in + $amount
}
```

This module is imported using `use increment` (without the glob `*`) and results in the same `increment` command and `increment by` subcommand.

::: note
We'll continue to use this version for further examples below, so notice that the import pattern has changed to `use increment` (rather than `use increment *`) below.
:::

## Submodules

Submodules are modules that are exported from another module. There are two ways to add a submodule to a module:

1. With `export module`: Exports (a) the submodule and (b) its definitions as members of the submodule
2. With `export use`: Exports (a) the submodule and (b) its definitions as members of the parent module

::: important
The difference matters when a user imports the entire module with `use <module>` (without `*`). That form imports only the members of the module itself, so it includes definitions added with `export use`, but _not_ the commands of a submodule added with `export module`. (Before Nushell 0.114, `use <module>` imported those as well.) Users get them by importing the submodule explicitly, with `use <module> *`, `use <module> <submodule>`, or `use <module> [<submodule> ...]`. See [Using Modules - Submodules](./using_modules.md#submodules).
:::

To demonstrate the difference, let's create a new `my-utils` module, with our `increment` example as a submodule. Additionally, we'll create a new `range-into-list` command in its own submodule.

1. Create a directory for the new `my-utils` and move the `increment.nu` into it

   ```nu
   mkdir my-utils
   # Adjust the following as needed
   mv increment/mod.nu my-utils/increment.nu
   rm increment
   cd my-utils
   ```

2. In the `my-utils` directory, create a `range-into-list.nu` file with the following:

   ```nu
   export def main []: range -> list {
       # It looks odd, yes, but the following is just
       # a simple way to convert ranges to lists
       each {||}
   }
   ```

3. Test it:

   ```nu
   use range-into-list.nu
   1..5 | range-into-list | describe
   # => list<int> (stream)
   ```

4. We should now have a `my-utils` directory with the:

   - `increment.nu` module
   - `range-into-list.nu` module

The following examples show how to create a module with submodules.

### Example: Submodule with `export module`

The most common form for a submodule definition is with `export module`.

1. Create a new module named `my-utils`. Since we're in the `my-utils` directory, we will create a `mod.nu` to define it. This version of `my-utils/mod.nu` will contain:

   ```nu
   export module ./increment.nu
   export module ./range-into-list.nu
   ```

2. We now have a module `my-utils` with the two submodules. Go to the parent directory of `my-utils`:

   ```nu
   cd ..
   ```

   Then try it out:

   ```nu
   use my-utils *
   5 | increment by 4
   # => 9

   let file_indices = 0..2..<10 | range-into-list
   ls | select ...$file_indices
   # Returns the 1st, 3rd, 5th, 7th, and 9th file in the directory
   ```

   Note the `*`. Without it, `use my-utils` would import nothing at all, since everything in `my-utils` is in one of its two submodules. `use my-utils increment` would import just the `increment` submodule (`increment` and `increment by`).

Before proceeding to the next section, run `scope modules` and look for the `my-utils` module. Notice that it has no commands of its own; just the two submodules.

### Example: Submodule with `export use`

Alternatively, we can (re)export the _definitions_ from other modules. This is slightly different from the first form, in that the commands (and other definitions, if they were present) from `increment` and `range-into-list` become _members_ of the `my-utils` module itself. We'll be able to see the difference in the output of the `scope modules` command.

Let's change `my-utils/mod.nu` to:

```nu
export use ./increment.nu
export use ./range-into-list.nu
```

Start a new shell in the parent directory of `my-utils` (see the note at the start of this chapter) and try it out using the same commands as above:

```nu
use my-utils *
5 | increment by 4
# => 9

let file_indices = 0..2..<10 | range-into-list
ls / | sort-by modified | select ...$file_indices
# Returns the 1st, 3rd, 5th, 7th, and 9th file in the root directory, oldest-to-newest
```

Run `scope modules` again and notice that all of the commands from the submodules are re-exported into the `my-utils` module.

Because the commands are now members of `my-utils` itself, importing the module without `*` also works. The commands then become subcommands of `my-utils`:

```nu
use my-utils
5 | my-utils increment by 4
# => 9
```

::: tip
While `export module` is the recommended and most common form, there is one module-design scenario in which `export use` is required -- `export use` can be used to _selectively export_ definitions from the submodule, something `export module` cannot do. See [Additional Examples - Selective Export](#selective-export-from-a-submodule) for an example.
:::

::: note
`module` without `export` defines only a local module; it does not export a submodule.
:::

## Documenting Modules

As with [custom commands](../custom_commands.md#documenting-your-command), modules can include documentation that can be viewed with `help <module_name>`. The documentation is simply a series of commented lines at the beginning of the module file. Let's document the `my-utils` module:

```nu
# A collection of helpful utility functions

export use ./increment.nu
export use ./range-into-list.nu
```

Now, in a new shell, examine the help:

```nu
use my-utils *
help my-utils
# => A collection of helpful utility functions
# =>
# => Module: my-utils
# =>
# => Exported commands:
# =>   increment, increment by, range-into-list
# =>
# => Exported aliases:
# =>
# =>
# => This module does not export environment.
```

Also notice that, because the commands from `increment` and `range-into-list` are re-exported with `export use ...`, those commands show up in the help for the main module as well.

## Environment Variables

Modules can define an environment using [`export-env`](/commands/docs/export-env.md). Let's extend our `my-utils` module with an environment variable export for a common directory where we'll place our modules in the future. This directory is (by default) in the `$NU_LIB_DIRS` search path discussed in [Using Modules - Module Path](./using_modules.md#module-path).

```nu
# A collection of helpful utility functions

export use ./increment.nu
export use ./range-into-list.nu

export-env {
    $env.NU_MODULES_DIR = ($nu.default-config-dir | path join "scripts")
}
```

When this module is imported with `use` (again in a new shell), the code inside the [`export-env`](/commands/docs/export-env.md) block is run and the its environment merged into the current scope:

```nu
use my-utils
$env.NU_MODULES_DIR
# => /home/me/.config/nushell/scripts
```

::: tip
As with any command defined without `--env`, commands and other definitions in the module use their own scope for environment. This allows changes to be made internal to the module without them bleeding into the user's scope. Add the following to the bottom of `my-utils/mod.nu`:

```nu
export def examine-config-dir [] {
    # Changes the PWD environment variable
    cd $nu.default-config-dir
    ls
}
```

Running this command changes the directory _locally_ in the module, but the changes are not propagated to the parent scope.

:::

## Caveats

### `export-env` runs only when the `use` call is _evaluated_

::: note
This scenario is commonly encountered when creating a module that uses `std/log`.
:::

Attempting to import a module's environment within another environment may not work as expected. Let's create a new module `go.nu` that creates "shortcuts" to common directories. One of these will be the `$env.NU_MODULES_DIR` defined above in `my-utils`.

We might try:

```nu
# go.nu, in the parent directory of my-utils
use my-utils

export def --env home [] {
    cd ~
}

export def --env modules [] {
    cd $env.NU_MODULES_DIR
}
```

And then import it. (The first line removes `$env.NU_MODULES_DIR` in case it is still set from the example above.)

```nu
hide-env -i NU_MODULES_DIR
use go.nu
go home  # works: changes to your home directory
cd -     # go back
go modules
# => Error: nu::shell::column_not_found
# =>
# =>   × Cannot find column 'NU_MODULES_DIR'
# =>     ╭─[/home/me/modules/go.nu:9:8]
# =>   8 │ export def --env modules [] {
# =>   9 │     cd $env.NU_MODULES_DIR
# =>     ·        ─────────┬─────────┬
# =>     ·                 │         ╰── value originates here
# =>     ·                 ╰── column 'NU_MODULES_DIR' is missing in one or more values
# =>  10 │ }
# =>     ╰────
# =>   help: If some rows have this column, try using 'NU_MODULES_DIR?' for optional access, or pre-fill using the `default` command
```

This doesn't work because `my-utils` isn't _evaluated_ in this case; it is only _parsed_ when the `go.nu` module is imported. While this brings all of the other exports into scope, it does not _run_ the `export-env` block.

::: important
As mentioned at the start of this chapter, trying this while `my-utils` (and its `$env.NU_MODULES_DIR`) is still in scope from a previous import will _not_ fail as expected. That's why the example above starts with `hide-env`. Alternatively, test in a new shell session to see the "normal" failure.
:::

To bring `my-utils` exported environment into scope for the `go.nu` module, there are two options:

1. Import the module in each command where it is needed

   By placing `use my-utils` in the `go modules` command itself, its `export-env` will be _evaluated_ when the command is. For example:

   ```nu
   # go.nu
   export def --env home [] {
       cd ~
   }

   export def --env modules [] {
       use my-utils
       cd $env.NU_MODULES_DIR
   }
   ```

2. Import the `my-utils` environment inside an `export-env` block in the `go.nu` module

   ```nu
   use my-utils
   export-env {
       use my-utils []
   }

   export def --env home [] {
       cd ~
   }

   export def --env modules [] {
       cd $env.NU_MODULES_DIR
   }
   ```

   In the example above, `go.nu` imports `my-utils` twice:

   1. The first `use my-utils` imports the module and its definitions (except for the environment) into the module scope.
   2. The second `use my-utils []` imports nothing _but_ the environment into `go.nu`'s exported environment block. Because the `export-env` of `go.nu` is executed when the module is first imported, the `use my-utils []` is also evaluated.

Note that the first method only loads the `my-utils` environment when `go modules` runs. (Because `go modules` is defined with `--env`, the environment it sets, including `$env.NU_MODULES_DIR`, is then kept in the caller's scope.) The second, on the other hand, re-exports `my-utils` environment into the user scope as soon as `go.nu` is imported.

### Exports cannot be named after their module

A module cannot export a command, alias, or known external defined inside it that has the same name as the module itself. For commands and known externals, name the definition `main` instead, as covered in [`main` Exports](#main-exports) above. The same restriction applies to a submodule declared by name, so `export module spam` inside a module named `spam` is rejected:

```nu
module spam { export module spam { } }
# => Error: nu::parser::named_as_module
# =>
# =>   × Can't export module named same as the module.
# =>    ╭─[repl_entry #1:1:29]
# =>  1 │ module spam { export module spam { } }
# =>    ·                             ──┬─
# =>    ·                               ╰── can't export from module spam
# =>    ╰────
# =>   help: Module spam can't export module named the same as the module. Either change the module name, or export `mod` module.
```

::: note
A `.nu` file _may_ have the same name as its module directory (e.g., `spam/spam.nu`), and Nushell will import it. Still, prefer a different name: if the parent module and the same-named submodule both export a `main`, the two definitions resolve to the same command name and the parent's `main` silently wins.
:::

### Parser keywords cannot be used as names

Parser keywords such as `if`, `match`, `source`, or `use` can't be used as the name of a command or alias, whether it's exported from a module or not. Such a definition fails with `nu::parser::name_is_keyword`. You can list the keywords with `help commands | where command_type == keyword`.

The same applies to a module named after a keyword: it can't export a `main` command, because the parser would always handle the name as the keyword instead:

```nu
module match { export def main [] { "matched" } }
use match
# => Error: nu::parser::keyword_shadow_module_main
# =>
# =>   × Module `match` has a `main` command but `match` is a built-in parser keyword.
# =>    ╭─[repl_entry #1:2:5]
# =>  1 │ module match { export def main [] { "matched" } }
# =>  2 │ use match
# =>    ·     ──┬──
# =>    ·       ╰── `match` is a parser keyword
# =>    ╰────
# =>   help: The `main` command cannot be invoked because `match` is intercepted by the parser. Either rename the module file, or remove `export def main` and use `use match.nu *` to import other
# =>         commands.
```

## Windows Path Syntax

::: important
Nushell on Windows supports both forward-slashes and back-slashes as the path separator. However, to ensure that they work on all platforms, using only the forward-slash `/` in your modules is highly recommended.
:::

## Additional Examples

### Local Definitions

As mentioned above, definitions in a module without the [`export`](/commands/docs/export.md) keyword are only accessible in the module's scope.

To demonstrate, create a new module `is-alphanumeric.nu`. Inside this module, we'll create a `str is-alphanumeric` command. If any of the characters in the string are not alpha-numeric, it returns `false`:

```nu
# is-alphanumeric.nu
def alpha-num-range [] {
    [
        ...(seq char 'a' 'z')
        ...(seq char 'A' 'Z')
        ...(seq 0 9 | each { into string })
    ]
}

export def "str is-alphanumeric" []: string -> bool {
    if ($in == '') {
        false
    } else {
        let chars = (split chars)
        $chars | all {|char| $char in (alpha-num-range)}
    }
}
```

Notice that we have two definitions in this module -- `alpha-num-range` and `str is-alphanumeric`, but only the second is exported.

```nu
use is-alphanumeric.nu *
'Word' | str is-alphanumeric
# => true
'Some punctuation?!' | str is-alphanumeric
# => false
'a' in (alpha-num-range)
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #4:1:9]
# =>  1 │ 'a' in (alpha-num-range)
# =>    ·         ───────┬───────
# =>    ·                ╰── Command `alpha-num-range` not found
# =>    ╰────
# =>   help: `alpha-num-range` is neither a Nushell built-in or a known external command
```

### Selective Export from a Submodule

::: note
While the following is a rare use-case, this technique is used by the Standard Library to
make the `dirs` commands and its aliases available separately.
:::

As mentioned in the [Submodules](#submodules) section above, only `export use` can selectively export definitions from a submodule.

To demonstrate, let's add a modified form of the `go.nu` module example [above](#caveats) to `my-utils`:

```nu
# go.nu, in the my-utils directory
export def --env home [] {
    cd ~
}

export def --env modules [] {
    cd ($nu.default-config-dir | path join "scripts")
}

export alias h = home
export alias m = modules
```

This `go.nu` includes the following changes from the original:

- It doesn't rely on the `my-utils` mod since it will now be a submodule of `my-utils` instead
- It adds "shortcut" aliases:
  `h`: Goes to the home directory (alias of `go home`)
  `m`: Goes to the modules directory (alias of `go modules`)

A user could import _just_ the aliases with:

```nu
use my-utils/go.nu [h, m]
```

However, let's say we want to have `go.nu` be a submodule of `my-utils`. When a user imports `my-utils`, they should _only_ get the commands, but not the aliases. Edit `my-utils/mod.nu` and add:

```nu
export use ./go.nu [home, modules]
```

That _almost_ works -- It selectively exports `home` and `modules`, but not the aliases. However, it does so without the `go` prefix. To see this, start a new shell in the parent directory of `my-utils`, then:

```nu
use my-utils *
home  # works: changes to your home directory
cd -  # go back
go home
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #1:4:1]
# =>  3 │ cd -  # go back
# =>  4 │ go home
# =>    · ─┬
# =>    ·  ╰── Command `go` not found
# =>    ╰────
# =>   help: Did you mean `do`?
```

To export them as `go home` and `go modules`, make the following change to `my-utils/mod.nu`:

```nu
# Replace the `export use ./go.nu [home, modules]` line with ...
export module go {
    export use ./go.nu [home, modules]
}
```

This creates a new, exported submodule `go` in `my-utils` with the selectively (re)exported definitions for `go home` and `go modules`. In a new shell in the parent directory of `my-utils`, it works as expected:

```nu
use my-utils *
go home  # works: changes to your home directory
cd -     # go back
home
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #1:4:1]
# =>  3 │ cd -     # go back
# =>  4 │ home
# =>    · ──┬─
# =>    ·   ╰── Command `home` not found
# =>    ╰────
# =>   help: Did you mean `go home`?
```
