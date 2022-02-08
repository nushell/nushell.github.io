# Configuration

## Nushell Configuration with `config.nu`

Nushell uses a configuration system that loads a toml file at launch time. That configuration file is called the Nushell `config.nu` file. The path to the configuration file can be found by calling `echo $nu.config-path`. It's a source file that runs, each step adding definitions, environment variables, and more to the global namespace. 

An example of the nushell `config.nu` can be found in our repo [here](https://github.com/nushell/engine-q/issues/459).

### Configuring `$config`

Nushell's main settings are kept in the global `$config` variable as a record. This record can be created using:

```
let $config = { 
  ...
}
```

You can also shadow `$config` and update it:

```
let $config = ($config | update <field name> <field value>)
```

Here's an example `$config` being configured with all known defaults:

```
let $config = {
  filesize_metric: $true
  table_mode: rounded # basic, compact, compact_double, light, thin, with_love, rounded, reinforced, heavy, none, other
  use_ls_colors: $true
  color_config: {
    separator: yd
    leading_trailing_space_bg: white
    header: cb
    date: pu
    filesize: ub
    row_index: yb
    hints: dark_gray

    # most of these are red just so they jump out when we see them and then allow us to change the color.
    bool: red
    int: green
    duration: red
    range: red
    float: red
    string: red
    nothing: red
    binary: red
    cellpath: red
  }
  use_grid_icons: $true
  footer_mode: always #always, never, number_of_rows, auto
  animate_prompt: $false
  float_precision: 2
  use_ansi_coloring: $true
  filesize_format: "b" # b, kb, kib, mb, mib, gb, gib, tb, tib, pb, pib, eb, eib, zb, zib, auto
  env_conversions: {
    "PATH": {
        from_string: { |s| $s | split row (char esep) }
        to_string: { |v| $v | str collect (char esep) }
    }
  }
  edit_mode: emacs # emacs, vi
  max_history_size: 10000
  log_level: error  # warn, error,  info, debug, trace
  menu_config: {
    columns: 4
    col_width: 20   # Optional value. If missing all the screen width is used to calculate column width
    col_padding: 2
    text_style: red
    selected_text_style: green_reverse
    marker: "| "
  }
  history_config: {
   page_size: 10
   selector: ":"                                                                                                                          
   text_style: green
   selected_text_style: green_reverse
   marker: "? "
  }
  keybindings: [
  {
    name: completion
    modifier: control
    keycode: char_t
    mode: vi_insert # emacs vi_normal vi_insert
    event: { send: menu name: context_menu }
  }
  {
    name: trigger-history
    modifier: control
    keycode: char_x
    mode: emacs
    event: [
      { send: menu name: history_menu }
      { send: menupagenext }
    ]
  }
  {
    name: trigger-history-previous
    modifier: control | shift
    keycode: char_x
    mode: emacs
    event: [
      { send: menu name: history_menu }
      { send: menupageprevious }
    ]
  }
  {
    name: prev_shell
    modifier: control
    keycode: char_y
    mode: vi_insert
    event: [
      { edit: { cmd: clear } }
      { edit: { cmd: insertchar value: p } }
      { send: enter }
    ]
  }
  {
    name: next_shell
    modifier: control
    keycode: char_u
    mode: vi_insert
    event: [
      { edit: { cmd: clear } }
      { edit: { cmd: insertchar value: n } }
      { send: enter }
    ]
  }
  {
    name: fzf
    modifier: control
    keycode: char_y
    mode: vi_insert
    event: [
      { edit: { cmd: clear } }
      { edit: { cmd: insertString value: 'cd (ls | where type == dir | each {$it.name} | str collect (char nl) | fzf | decode utf-8 | str trim)' } }
      { send: enter }
    ]
  }
  {
    name: "until found event" 
    modifier: control
    keycode: char_r
    mode: vi_insert # emacs vi_normal vi_insert
    event:[ 
      # When a list of lists is used, an UntilFound event is created. This means that the first event to be 
      # successful will be the only event to happen from the list of events for this keybinding.
      # In this example, when pressing ctr-r the Completion event takes precedence over ContextMenu and 
      # ContextMenu takes precedence over moving to the next element in the menu
      [{ send: historyhintcomplete }]
      [{ send: menu name: context_menu }]
      [{ send: menunext }]
    ]
  }
  ]
}
```

### Environment

You can update the environment using `let-env` calls inside of the `config.nu` file. There are some important ones to look at which doing Nushell-specific settings:

- `LS_COLORS`: Sets up colors per file type in ls
- `PROMPT_COMMAND`: Code to execute for setting up the prompt (block or string)
- `PROMPT_COMMAND_RIGHT`: Code to execute for setting up the right prompt (block)
- `PROMPT_INDICATOR = "〉"`: The indicator printed after the prompt (by default ">"-like Unicode symbol)
- `PROMPT_INDICATOR_VI_INSERT = ": "`
- `PROMPT_INDICATOR_VI_NORMAL = "〉 "`
- `PROMPT_MULTILINE_INDICATOR = "::: "`

### Color Config section

You can learn more about setting up colors and theming in the [associated chapter](https://github.com/nushell/engine-q/blob/main/docs/How_To_Coloring_and_Theming.md).

## Configuring Nu as a login shell

To use Nu as a login shell, you'll need to configure the `$env` variable. With this, you'll have enough support to run external commands as a login shell.

You can build the full set of environment variables by running Nu inside of another shell, like Bash. Once you're in Nu, you can run a command like this:

```
> env | each { echo $"let-env ($it.name) = '($it.raw)'" } | str collect (char nl)
```

This will print out a `let-env` lines, one for each environment variable along with its setting. 

Next, on some distros you'll also need to ensure Nu is in the /etc/shells list:

```
> cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/dash
/bin/bash
/bin/rbash
/usr/bin/screen
/usr/bin/fish
/home/jonathan/.cargo/bin/nu
```

With this, you should be able to `chsh` and set Nu to be your login shell. After a logout, on your next login you should be greeted with a shiny Nu prompt.

### macOS: Keeping `/usr/bin/open` as `open`

Some tools (e.g. Emacs) rely on an `open` command to open files on Mac.
As nushell has its own `open` command which has different semantics and shadows `/usr/bin/open`, these tools will error out when trying to use it.
One way to work around this is to define `alias`es in your `startup` config like this:

```
cat (config path)

startup = [
  "alias nuopen = open",
  "alias open = ^open",
]
```

Or using a one-liner:
```
config set startup (config get startup | append "alias nuopen = open" | append "alias open = ^open")
```

## Prompt configuration

Prompt configuration is handled by setting the value of `prompt`.

For example, to use [Starship](https://starship.rs), download it and enter the following command (0.18.2 and later):

```
let-env PROMPT_COMMAND = "starship prompt"
```

Now restart Nu.

```
nushell on 📙 main is 📦 v0.43.0 via 🦀 v1.58.0 
❯
```

If your prompt looks a bit garbled like this:

```
%{%}~%{%}
%{%}❯%{%}
```

you may want to configure `STARSHIP_SHELL` environment variable when setting the prompt.

```
config set prompt "STARSHIP_SHELL=nushell starship prompt"
```
