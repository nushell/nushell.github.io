# Creating Modules

[[toc]]

::: important
When working through the examples below, it is recommended that you start a new shell before importing an updated version of each module or command. This will help reduce any confusion caused by definitions from previous imports.
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

In the [Basic Example](#basic-module-example) above, we had a module named `inc` with a command named `increment`. However, if we rename that file to `increment.nu`, it will fail to import.

```nu
mv inc.nu increment.nu
use increment.nu *

# => Error: nu::parser::named_as_module
# => ...
# => help: Module increment can't export command named
# => the same as the module. Either change the module
# => name, or export `main` command.
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
2024 | inc
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

````nu
use <module> <other_definition>
# or
use <module> [ <other_definitions> ]
:::

::: note
Additionally, `main` has special behavior if used in a script file, regardless of whether it is exported or not. See the [Scripts](scripts.html#parameterizing-scripts) chapter for more details.
:::

## Module Files

As mentioned briefly in the Overview above, modules can be created either as:

* `<module_name>.nu`: Useful for simple modules
* `<module_name>/mod.nu`: Useful for organizing larger module projects where submodules can easily map to subdirectories of the main module

The `increment.nu` example above is clearly an example of the former. Let's convert it to the directory form:

```nu
mkdir increment
mv increment.nu increment/mod.nu

use increment *
41 | increment
# => 42
````

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

To demonstrate the difference, let's add to our `increment` example by:

- Adding a new `range-into-list` module and command
- Creating a new parent module `my-utils` with `increment` and `range-into-list` as its submodules

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

2. We now have a module `my-init` with the two submodules. Try it out:

   ```nu
   # Go to the parent directory of my-utils
   cd ..
   use my-utils *
   5 | increment by 4
   # => 9

   let file_indices = 0..2..<10 | range-into-list
   ls | select ...$file_indices
   # => Returns the 1st, 3rd, 5th, 7th, and 9th file in the directory
   ```

Before proceeding to the next section, run `scope modules` and look for the `my-utils` module. Notice that it has no commands of its own; just the two submodules.

### Example: Submodule with `export use`

Alternatively, we can (re)export the _definitions_ from other modules. This is slightly different from the first form, in that the commands (and other definitions, if they were present) from `increment` and `range-into-list` become _members_ of the `my-utils` module itself. We'll be able to see the difference in the output of the `scope modules` command.

Let's change `my-utils/mod.nu` to:

```nu
export use ./increment.nu
export use ./range-into-list.nu
```

Try it out using the same commands as above:

```nu
# Go to the parent directory of my-utils
cd ..
use my-utils *
5 | increment by 4
# => 9

let file_indices = 0..2..<10 | range-into-list
ls / | sort-by modified | select ...$file_indices
# => Returns the 1st, 3rd, 5th, 7th, and 9th file in the directory, oldest-to-newest
```

Run `scope modules` again and notice that all of the commands from the submodules are re-exported into the `my-utils` module.

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

Now examine the help:

```nu
use my-utils *
help my-utils

# => A collection of helpful utility functions
```

Also notice that, because the commands from `increment` and `range-into-list` are re-exported with `export use ...`, those commands show up in the help for the main module as well.

## Environment Variables

Modules can define an environment using [`export-env`](/commands/docs/export-env.md). Let's extend our `my-utils` module with an environment variable export for a common directory where we'll place our modules in the future. This directory is (by default) in the `$env.NU_LIB_DIRS` search path discussed in [Using Modules - Module Path](./using_modules.md#module-path).

```nu
# A collection of helpful utility functions

export use ./increment.nu
export use ./range-into-list.nu

export-env {
    $env.NU_MODULES_DIR = ($nu.default-config-dir | path join "scripts")
}
```

When this module is imported with `use`, the code inside the [`export-env`](/commands/docs/export-env.md) block is run and the its environment merged into the current scope:

```nu
use my-utils
$env.NU_MODULES_DIR
# => Returns the directory name
cd $env.NU_MODULES_DIR
```

::: tip
As with any command defined without `--env`, commands and other definitions in the module use their own scope for environment. This allows changes to be made internal to the module without them bleeding into the user's scope. Add the following to the bottom of `my-utils/mod.nu`:

```nu
export def examine-module [] {
    # Changes the PWD environment variable
    cd $env.CURRENT_FILE
    ls
}
```

Running this command changes the directory _locally_ in the module, but the changes are not propagated to the parent scope.

:::

## Caveats

### `export-env` runs only when the `use` call is _evaluated_

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

And then import it:

```nu
use go.nu
go home
# => Works
go modules
# => Error: $env.NU_MODULES_DIR is not found
```

This doesn't work because `my-utils` isn't _evaluated_ in this case; it is only _parsed_ when the `go.nu` module is imported. While this brings all of the other exports into scope, it does not _run_ the `export-env` block.

::: important
As mentioned at the start of this chapter, trying this while `my-utils` (and its `$env.NU_MODULES_DIR`) is still in scope from a previous import will _not_ fail as expected. Test in a new shell session to see the "normal" failure.
:::

To bring `my-utils` exported environment into scope for the `go.nu` module, there are two options:

1. Import the module in each command where it is needed

   By placing `use my-utils` in the `go home` command itself, its `export-env` will be _evaludated_ when the command is. For example:

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

Note that the first method keeps `my-utils` environment inside the `go.nu` module's scope. The second, on the other hand, re-exports `my-utils` environment into the user scope.

### Module files and commands cannot be named after parent module

A `.nu` file cannot have the same name as its module directory (e.g., `spam/spam.nu`) as this would create an ambiguous condition with the name being defined twice. This is similar to the situation described above where a command cannot have the same name as its parent.

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
'Some punctutation?!' | str is-alphanumeric
# => false
'a' in (alpha-num-range)
# => Error:
# => help: `alpha-num-range` is neither a Nushell built-in or a known external command
```
