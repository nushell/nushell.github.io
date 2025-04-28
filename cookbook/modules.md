# Module Scenarios

## Dumping Files into Directory

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
5. Add the parent of the `completions` directory to your `NU_LIB_DIRS` inside `env.nu`

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

## Overlay and "Virtual Environments"

[Overlays](/book/overlays.md) are layers of definitions. We can make use of them to establish a temporary virtual environment, with custom environment variables, which we discard at the end.

Our goals in this example are:

* Activate a set of environment variables from a file called `env.json`
* Work in this context
* Discard the environment - restoring the original environment

First, let's prepare an `env.json` for testing:

```nu
{ A: 1 B: 2 } | save env.json

$env.A = 'zzz'

print $"('A' in $env) ('B' in $env)"
# => true false
```

Now let's create a module `env` with a `load` command that loads the environment from `env.json`, and use it as an overlay:

```nu
'export def --env load [] { open env.json | load-env }' | save env.nu

overlay use ./env.nu

overlay list
# => ╭───┬──────╮
# => │ 0 │ zero │
# => │ 1 │ env  │
# => ╰───┴──────╯
```

Now we load the `env.json` file:

```nu
load

print $"($env.A) ($env.B)"
# => 1 2
```

To hide the overlay:

```nu
overlay hide env

print $"('A' in $env) ('B' in $env)"
# => true false
```

Note that - as documented in [Overlays](/book/overlays.md) - reactivating the overlay will recover the loaded environment variables,
not create a new context for as long as the Nushell session remains active, despite `overlay list` no longer listing the overlay.

More related information and specifically about environment variables and their modification can be found in [Environment](/book/environment.md), [Modules](/book/modules.md), [Overlay](/book/overlays.md),
and the respective command documentation of [`def --env`](/commands/docs/def.md), [`export def --env`](/commands/docs/export_def.md), [`load-env`](/commands/docs/load-env.md), and [`export-env`](/commands/docs/export-env.md).

### Elaborate Virtual Environments

This kind of overlaying environments can be used to scope more elaborate virtual environments, including changing the `PATH` environment variable, or other tool settings defined in environment variables or files.

Tools like conda or Python virtualenv manage and isolate sets of environment variables.
The [official virtualenv integration](https://github.com/pypa/virtualenv/blob/main/src/virtualenv/activation/nushell/activate.nu) makes use of these concepts.
And our nu_scripts repository has a an [unofficial Conda module](https://github.com/nushell/nu_scripts/tree/main/modules/virtual_environments).
