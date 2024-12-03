---
title: Upcoming Configuration Enhancements
author: The Nu Authors
author_site: https://twitter.com/nu_shell
author_image: https://www.nushell.sh/blog/images/nu_logo.png
excerpt: In the recent 0.100 release, we made some significant improvements to the way startup configuration is handled. We'll be building on that with some new features in the upcoming 0.101 release as well. Users who have been running nightly releases or building from source have been trialing these changes for about two weeks now.
---

# Upcoming Configuration Enhancements

In the recent 0.100 release, we made some significant improvements to the way startup configuration is handled. We'll be building on that with additional configuration changes in the upcoming 0.101 release as well. Users who have been running nightly releases or building from source have been trialing these changes for about two weeks now.

Today, we're releasing two documentation items related to these changes:

- A guide to upgrading your configuration to take advantage of the enhancements (below). This will also be linked from the 0.101 Release Notes when it becomes available.

- A [preview of the new Configuration chapter](/book/configuration_preview.md) of the Book. This chapter has been rewritten to match the new functionality, as well as add some previously missing documentation on features like autoload dirs (and more). Once 0.101 releases, this will replace the previous configuration chapter. We welcome reviews of the updates, and any corrections or enhancements can be submitted to [the doc repository](https://github.com/nushell/nushell.github.io) if needed.

---

**_Table of Contents_**

[[toc]]

---

## Upgrading Configuration to Nushell version 0.101.0 or later

::: tip In a hurry?
See [Setting Values in the New Config](#setting-values-in-the-new-config) below, then come back and read the rest if needed.
:::

### Overview

In previous Nushell releases, the recommended practice was to include the **entire** `$env.config` record in `config.nu` and change values within it. Any `$env.config` keys that were not present in this record would use internal defaults, but these settings weren't introspectable in Nushell.

With changes in releases 0.100 and 0.101, (most, but not all) missing values in `$env.config` are automatically populated in the record itself using the default, internal values. With this in place, it's no longer necessary to create a monolithic configuration record.

If you have an existing `config.nu` with a complete `$env.config` record, you could continue to use it, but you should consider streamlining it based on these new features. This has the following advantages:

- Startup will typically be slightly faster.
- It's easier to see exactly which values are overridden, as those should be the only settings changed in `config.nu`.
- Configurations are more easily modularized.
- If a key name or default value changes in the future, it will only be a breaking change if it was a value that had been overridden. All other values will update seamlessly when you install new Nushell releases.

  ::: note
  This may be an advantage or disadvantage in some situations. For instance, at some point, we plan to switch the default history format to SQLite. When that change occurs in Nushell, it will automatically be changed for all users who hadn't overridden the value. That's a positive change for most users, as they'll automatically be switched to the more advanced format when they upgrade to that (as yet unknown) release, but that change may not be desirable for some users.

  Of course, these users can always simply override that value when and if the default changes.
  :::

Note that not _all_ default values are introspectable. The following Nushell internals are no longer set (by default) in `config.nu` and will not be automatically populated:

- `keybindings`
- `menus`

However, the functionality behind them has always been handled internally by Nushell and Reedline. Only user-defined keybindings and menus should (as best-practice) be specified in the `$env.config`.

### Identifying Overridden Values

To identify which values your current configuration has changed from the defaults, run the following in the current build (or 0.101 when available):

```nu
let defaults = nu -n -c "$env.config = {}; $env.config | reject color_config keybindings menus | to nuon" | from nuon | transpose key default
let current = $env.config | reject color_config keybindings menus | transpose key current
$current | merge $defaults | where $it.current != $it.default
```

These are the values that you should migrate to your updated `config.nu`.

::: note
In the above example, `nu` (without a path) needs to point to a 0.101 or higher release in order for this to work. This should be the normal result, but users who are temporarily running from a compiled build (e.g. `./target/release/nu`) may need to adjust the command.
:::

Also examine:

- Any theme/styling in `$env.config.color_config` and add those settings if desired.
- Your personalized keybindings in `$env.config.keybindings`. Note that many of the keybindings in the older default configuration files were simply examples that replicated built-in capabilities and did not change any Nushell functionality.
- Any personalized menus in `$env.config.menus`. As with keybindings, you do not need to copy over examples.

### Setting Values in the New Config

Rather than defining a monolithic `$env.config = { ... all values }` as in the past, just create one entry for each setting you wish to **_override_**. For example:

```nu
$env.config.show_banner = false
$env.config.buffer_editor = "code"

$env.history.file_format = "sqlite"
$env.history.max_size: 1_000_000
$env.history.isolation = true

$env.keybindings ++= [{
  name: "insert_last_token"
  modifier: "alt"
  keycode: "char_."
  event: [
    {
      edit: "InsertString"
      value: "!$"
    },
    {
      "send": "Enter"
    }
  ]
  mode: [ emacs, vi_normal, vi_insert ]
}]
```

### Other Config Changes in 0.101

- The commented, sample `default_env.nu` and `default_config.nu` in older releases was useful for learning about configuration options. Since these (long) files are no longer copied to the filesystem, you can access an enhanced version of this documentation using:

  ```nu
  config env --sample | nu-highlight | less -R
  config nu --sample | nu-highlight | less -R
  ```

- Skeleton config files (`env.nu` and `config.nu`) are automatically created when the default config directory is created. Usually this will be the first time Nushell is started. The user will no longer be asked whether or not to create the files.

- These files that are created have no configuration in them; just comments. This is because, "out-of-the-box", no values are overridden in the user config files.

- An internal `default_env.nu` is loaded immediately before the user's `env.nu`. You can inspect its contents using `config env --default | nu-highlight | less -R`.

  This means that, as with `config.nu`, you can also use your `env.nu` to just override the default environment variables if desired.

- Likewise, a `default_config.nu` is loaded immediately before the user's `config.nu`. View
  this file using `config nu --default | nu-highlight | less -R`.

- **_(Breaking Change)_** `ENV_CONVERSIONS` are run several times so that the converted values may be used in `config.nu` and later files. Note that this currently means that `from_string` may be called even when the value is not a string. The `from_string` closure should check the type and only convert a string.

- The previous `$light_theme` and `$dark_theme` variables have been replaced by new standard library commands:

  ```nu
  use std/config *
  $env.config.color_config = (dark-theme)
  ```
