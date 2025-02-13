---
title: Setup
---

# Setup

To get the most out of nu, it is important to setup your path and env for easy access.
There are other ways to view these values and variables, however setting up your nu configuration will make it much easier as these have cross-platform support.

---

### Configure your path and other environment variables

In order to configure your path in nushell you'll need to modify your `PATH` environment variable in your `config.nu` file. Open your `config.nu` file and put an entry in it like `$env.PATH = "path1;path2;path3"` ensuring that you use the proper path separation character, which is different by platform.

Alternately, if you want to append a folder to your `PATH` environment variable you can do that too using the `append` or `prepend` command like this:

```nu
$env.PATH = ($env.PATH | split row (char esep) | append "some/other/path")
```

For more detailed instructions, see the documentation about [environment variables](/book/environment.html#setting-environment-variables) and [PATH configuration](/book/configuration.html#path-configuration).

### How to list your environment variables

```nu
$env
```

Output

```
─────────────────────────────────┬────────────────────────────────────────────
 ALLUSERSPROFILE                 │ C:\ProgramData
 CARGO_PKG_AUTHORS               │ The Nu Project Contributors
 CARGO_PKG_DESCRIPTION           │ A new type of shell
 CARGO_PKG_HOMEPAGE              │ https://www.nushell.sh
 CARGO_PKG_LICENSE               │ MIT
 CARGO_PKG_LICENSE_FILE          │
 CARGO_PKG_NAME                  │ nu
 CARGO_PKG_REPOSITORY            │ https://github.com/nushell/nushell
 CARGO_PKG_VERSION               │ 0.59.0
 CARGO_PKG_VERSION_MAJOR         │ 0
```

Let's practise that and set `$EDITOR` in our `env.nu` file using `vim` (or an editor of your choice)

```
vim $nu.env-path
```

Note: if you've never used `vim` before and you want to leave typing `:q!` will close without saving.

Go to the end of the file and add

```nu
$env.EDITOR = vim
```

or `emacs`, `vscode` or whatever editor you like. Don't forget that the program needs to be accessible on the `PATH`
and to reload your configuration with `exec nu` on linux/mac or restart your nushell on windows.

You should now be able to run `config nu` or `config env` and edit those files easily.

---

### How to get a single environment variable's value

```nu
$env.APPDATA
```
---

### Use hooks to export state via environment variables

Additional tools like starship run with every prompt showing up in nushell.
[`starship`](https://starship.rs) in particular replaces the default prompt with
its own.
To be most compatible, the `starship` binary will run every prompt render and
is absolute stateless.
Nushell, however, is very stateful in a single instance.

[Hooks](https://www.nushell.sh/book/hooks.html#hooks) allow registration of
custom callback functions.
In this case, the `pre_prompt` hook is very useful.
With it, we can export state information as an environment variable, for
example, what [overlays](https://www.nushell.sh/book/overlays.html) are
currently activated.

```nu
# set NU_OVERLAYS with overlay list, useful for starship prompt
$env.config.hooks.pre_prompt = ($env.config.hooks.pre_prompt | append {||
  let overlays = overlay list | range 1..
  if not ($overlays | is-empty) {
    $env.NU_OVERLAYS = $overlays | str join ", "
  } else {
    $env.NU_OVERLAYS = null
  }
})
```

Now in `starship`, we can use this environment variable to display what modules
are active.

```toml
[env_var.NU_OVERLAYS]
symbol = '📌 '
format = 'with [$symbol($env_value )]($style)'
style = 'red'
```
