# Using Modules

[[toc]]

## Overview

End-users can add new functionality to Nushell by using ("importing") modules written by others.

To import a module and its definitions, we call the [`use`](/commands/docs/use.md) command:

```nu
use <path/to/module> <members...>
```

For example:

```nu
use std/log
log info "Hello, Modules"
```

::: tip
The example above uses the [Standard Library](../standard_library.md), a collection of modules built-in to Nushell. Because it is readily available to all Nushell users, we'll also use it for several of the examples below.
:::

## Installing Modules

Installing a module is simply a matter of placing its files in a directory. This might be done via `git clone` (or other version control system), a package manager such as `nupm`, or manually. The module's documentation should provide recommendations.

## Importing Modules

Anything after the [`use`](/commands/docs/use.md) keyword forms an **import pattern** which controls how the definitions are imported.

Notice above that `use` has two arguments:

- A path to the module
- (Optional) The definitions to import

The module's documentation will usually tell you the recommended way to import it. However, it can still be useful to understand the options available:

### Module Path

The path to the module can be:

- An absolute path to a directory containing a `mod.nu` file:

  ::: details Example

  ```nu
  use ~/nushell/modules/nupm
  ```

  Note that the module name (i.e., its directory) can end in a `/` (or `\` on Windows), but as with most commands that take paths (e.g., `cd`), this is completely optional.

  :::

- A relative path to a directory containing a `mod.nu` file:

  ::: details Example

  ```nu
  # cd then use the mod.nu in the relative nupm directory
  cd ~/nushell/modules
  use nupm
  # or
  use nupm/
  ```

  Note that the module name (its directory) can end in a `/` (or `\` on Windows), but as with most commands that take a paths (e.g., `cd`), this is completely optional.
  :::

  ::: important Important! Importing modules from `$NU_LIB_DIRS` or `$env.NU_LIB_DIRS`
  When importing a module via a relative path, Nushell first searches from the current directory. If a matching module is not found at that location, Nushell then searches each directory in the constant `$NU_LIB_DIRS` list, and then `$env.NU_LIB_DIRS` (deprecated).

  This allows you to install modules to a location that is easily accessible via a relative path regardless of the current directory.
  :::

- An absolute or relative path to a Nushell module file. As above, Nushell will search the constant `$NU_LIB_DIRS` and then `$env.NU_LIB_DIRS` for a matching relative path.

  ::: details Example

  ```nu
  use ~/nushell/modules/std-rfc/bulk-rename.nu
  # Or
  cd ~/nushell/modules
  use std-rfc/bulk-rename.nu
  ```

  :::

- A virtual directory:

  ::: details Example
  The standard library modules mentioned above are stored in a virtual filesystem with a `std` directory. Consider this an alternate form of the "absolute path" examples above.

  ```nu
  use std/assert
  assert equal 'string1' "string1"
  ```

  :::

- Less commonly, the name of a module already created with the [`module`](/commands/docs/module.md) command. While it is possible to use this command to create a module at the commandline, this isn't common or useful. Instead, this form is primarily used by module authors to define a submodule. See [Creating Modules - Submodules](./creating_modules.md#submodules).

### Module Definitions

The second argument to the `use` command is an optional list of the definitions to import. Again, the module documentation should provide recommendations. For example, the [Standard Library Chapter](../standard_library.md#importing-submodules) covers the recommended imports for each submodule.

Of course, you always have the option to choose a form that works best for your use-case.

- **Import an entire module/submodule as a command with subcommands**

  In an earlier example above, we imported the `std/log` module without specifying the definitions:

  ```nu
  use std/log
  log info "Hello, std/log Module"
  ```

  Notice that this imports the `log` submodule with all of its _subcommands_ (e.g., `log info`, `log error`, etc.) into the current scope.

  Compare the above to the next version, where the command becomes `std log info`:

  ```nu
  use std
  std log info "Hello, std Module"
  ```

- **Import all of the definitions from a module**

  Alternatively, you can import the definitions themselves into the current scope. For example:

  ```nu
  use std/formats *
  ls | to jsonl
  ```

  Notice how the `to jsonl` command is placed directly in the current scope, rather than being a subcommand of `formats`.

- **Import one or more definitions from a module**

  Nushell can also selectively import a subset of the definitions of a module. For example:

  ```nu
  use std/math PI
  let circle = 2 * $PI * $radius
  ```

  Keep in mind that the definitions can be:

  - Commands
  - Aliases
  - Constants
  - Externs
  - Other modules (as submodules)
  - Environment variables (always imported)

  Less commonly, a list of imports can also be used:

  ```nu
  use std/formats [ 'from ndjson' 'to ndjson' ]
  ```

  ::: note Importing submodules
  While you can import a submodule by itself using `use <module> </submodule>` (e.g., `use std help`), the entire parent module and _all_ of its definitions (and thus submodules) will be _parsed_ when using this form. When possible, loading the submodule as a _module_ will result in faster code. For example:

  ```nu
  # Faster
  use std/help
  ```

  :::

## Importing Constants

As seen above with the `std/math` examples, some modules may export constant definitions. When importing the entire module, constants can be accessed through a record with the same name as the module:

```nu
# Importing entire module - Record access
use std/math
$math.PI
# => 3.141592653589793

$math
# => ╭───────┬──────╮
# => │ GAMMA │ 0.58 │
# => │ E     │ 2.72 │
# => │ PI    │ 3.14 │
# => │ TAU   │ 6.28 │
# => │ PHI   │ 1.62 │
# => ╰───────┴──────╯

# Or importing all of the module's members
use std/math *
$PI
# => 3.141592653589793
```

## Hiding

Any custom command or alias, whether imported from a module or not, can be "hidden" to restore the previous definition using
the [`hide`](/commands/docs/hide.md) command.

The `hide` command also accepts import patterns, similar to [`use`](/commands/docs/use.md), but interprets them slightly differently. These patterns can be one of the following:

- If the name is a custom command, the `hide` command hides it directly.
- If the name is a module name, it hides all of its exports prefixed with the module name

For example, using `std/assert`:

```nu
use std/assert
assert equal 1 2
# => Assertion failed
assert true
# => Assertion passes

hide assert
assert equal 1 1
# => Error:
# => help: A command with that name exists in module `assert`. Try importing it with `use`

assert true
# => Error:
# => help: A command with that name exists in module `assert`. Try importing it with `use`
```

Just as you can `use` a subset of the module's definitions, you can also `hide` them selectively as well:

```nu
use std/assert
hide assert main
assert equal 1 1
# => assertion passes

assert true
# => Error:
# => help: A command with that name exists in module `assert`. Try importing it with `use`
```

::: tip
`main` is covered in more detail in [Creating Modules](./creating_modules.md#main-exports), but for end-users, `main` simply means "the command named the same as the module." In this case the `assert` module exports a `main` command that "masquerades" as the `assert` command. Hiding `main` has the effect of hiding the `assert` command, but not its subcommands.
:::

## See Also

- To make a module always be available without having to `use` it in each Nushell session, simply add its import (`use`) to your startup configuration. See the [Configuration](../configuration.md) Chapter to learn how.

- Modules can also be used as part of an [Overlay](../overlays.md).
