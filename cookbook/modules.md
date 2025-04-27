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

## Setting environment + aliases (conda style)

`def --env` commands, `export-env` block and aliases can be used to dynamically manipulate "virtual environments" (a concept well known from Python).

We use it in our [official virtualenv integration](https://github.com/pypa/virtualenv/blob/main/src/virtualenv/activation/nushell/activate.nu). Another example is our [unofficial Conda module](https://github.com/nushell/nu_scripts/blob/main/modules/virtual_environments/conda.nu).

::: warning
Work in progress
:::
