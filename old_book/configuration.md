# Configuration

## Nushell Configuration with `config.toml`

Nushell uses a configuration system that loads a toml file at launch time. That configuration file is called the Nushell `config.toml` file. The path to the configuration file can be found by calling `config path`. It contains the configuration points that nushell will use as default settings. Each setting follows a key value pattern. A value can be a number, a string, or an array. Below is a description of each setting.

An example of the nushell `config.toml` can be found in our repo [here](https://github.com/nushell/nushell/tree/main/docs/sample_config).

### Root level configuration settings.

These are at the root level, not because they're more important, but because they are not in a toml section.

| Name                  | Purpose                                                                                                              | Value Type | Options                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| complete_from_path    | Whether or not to complete names of binaries on PATH                                                                 | boolean    | true or false                                                                                   |
| ctrlc_exit            | Enables/Disables nushell to exit when the key combination of Ctrl+C is hit multiple times.                           | boolean    | true or false                                                                                   |
| disable_table_indexes | Enables/Disables the index (#) column on tables.                                                                     | boolean    | true or false                                                                                   |
| filesize_format       | Set the file size units format returned from the ls command.                                                         | string     | b, kb, kib, mb, mib, gb, gib, etc                                                               |
| filesize_metric       | Set the file size metric (power of 1000 / power of 1024). `true` for KB,MB,GB; `false` for KiB,MiB,GiB               | boolean    | true of false                                                                                   |
| nonzero_exit_errors   | Enables/Disables the reporting of non-zeros exit errors.                                                             | boolean    | true or false                                                                                   |
| pivot_mode            | Tells nushell how to pivot single row tables.                                                                        | string     | auto, always, never                                                                             |
| plugin_dirs           | Tells nushell to look in these folders for optional nushell plugins.                                                 | array      | quoted string of folders delimited by commas between brackets `[ ]`                             |
| prompt                | Instructs nushell to run this command pipeline for every prompt.                                                     | string     | quote command pipeline or custom command.                                                       |
| rm_always_trash       | Enables/Disables nushell to always delete files to the recycle bin/trash can.                                        | boolean    | true or false                                                                                   |
| skip_welcome_message  | Enables/Disables the nushell welcome message.                                                                        | boolean    | true or false                                                                                   |
| startup               | Load and run command at startup. These commands can take the form of aliases, custom commands, or external commands. | array      | quoted string of commands delimited by commas between brackets `[ ]`                            |
| table_mode            | Defines which "theme" that table drawing should use in nushell.                                                      | string     | basic, compact, compact_double, light, thin, with_love, rounded, reinforced, heavy, none, other |

### Color Config section

The `[color_config]` section of the `config.toml` file enables you to change the color and formatting of datatypes in nushell. This is most apparent in tables like the output of the `ls` command.

For each of the options in the color_config section, you are able to set
the color alone or with one of the following attributes.

| color  | abbreviation |
| ------ | ------------ |
| green  | g            |
| red    | r            |
| blue   | u            |
| black  | b            |
| yellow | y            |
| purple | p            |
| cyan   | c            |
| white  | w            |

| attribute | abbreviation |
| --------- | ------------ |
| bold      | b            |
| underline | u            |
| italic    | i            |
| dimmed    | d            |
| reverse   | r            |

#### Abbreviated Examples:

- `gb` means green bold
- `ru` means red underline
- `ud` means blue dimmed

#### Verbose Examples:

- green_bold
- red_underline
- blue_dimmed

| Name                      | Purpose                                     | Value Type | Options        |
| ------------------------- | ------------------------------------------- | ---------- | -------------- |
| [color_config]            | This is the section name                    | string     | Outlined above |
| header_align              | Apply an alignment to the header            | string     | Outlined above |
| header_color              | Apply a color to the header                 | string     | Outlined above |
| index_color               | Apply a style of the Index (#)              | string     | Outlined above |
| leading_trailing_space_bg | Apply a style to leading and trailing space | string     | Outlined above |
| primitive_binary          | Apply a style to Primitive::Binary          | string     | Outlined above |
| primitive_boolean         | Apply a style to Primitive::Boolean         | string     | Outlined above |
| primitive_columnpath      | Apply a style to Primitive::ColumnPath      | string     | Outlined above |
| primitive_date            | Apply a style to Primitive::Date            | string     | Outlined above |
| primitive_decimal         | Apply a style to Primitive::Decimal         | string     | Outlined above |
| primitive_duration        | Apply a style to Primitive::Duration        | string     | Outlined above |
| primitive_filesize        | Apply a style to Primitive::Filesize        | string     | Outlined above |
| primitive_int             | Apply a style to Primitive::Int             | string     | Outlined above |
| primitive_line            | Apply a style to Primitive::Line            | string     | Outlined above |
| primitive_path            | Apply a style to Primitive::Path            | string     | Outlined above |
| primitive_pattern         | Apply a style to Primitive::Pattern         | string     | Outlined above |
| primitive_range           | Apply a style to Primitive::Range           | string     | Outlined above |
| primitive_string          | Apply a style to Primitive::String          | string     | Outlined above |
| separator_color           | Apply a style to the table lines            | string     | Outlined above |

### Line Editor section

The `[line_editor]` section of the `config.toml` controls how our line editor, `rustyline` behaves. These configuration settings are specific to the `rustyline` crate we use.

| Name                    | Purpose                                                                                  | Value Type | Options                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| [line_editor]           | This is the section name                                                                 |            |                                                                          |
| auto_add_history        | Enable/Disable automatically add each non-blank line to history                          | boolean    | true or false                                                            |
| bell_style              | The bell style for the line editor                                                       | string     | audible, none, visible                                                   |
| color_mode              | The color mode for the line editor                                                       | string     | enabled, forced, disabled                                                |
| completion_prompt_limit | When listing completion alternatives, only display one screen of possibilities at a time | number     |                                                                          |
| completion_type         | Method used to iterate history items                                                     | string     | circular, list, fuzzy - note fuzzy is not currently supported by nushell |
| edit_mode               | The mode for the line editor                                                             | string     | vi or emacs                                                              |
| history_duplicates      | Rule to apply regarding the adding of duplicates to the history                          | string     | alwaysadd, ignoreconsecutive                                             |
| history_ignore_space    | Enable/Disable the history to ignore space                                               | boolean    | true or false                                                            |
| keyseq_timeout_ms       | Duration rustyline will wait for a character when reading an ambiguous key sequence      | string     | duration in milliseconds                                                 |
| max_history_size        | The maximum history size                                                                 | number     |                                                                          |
| tab_stop                | The number of characters for indented/outdented commands                                 | number     |
| completion_match_method | Sets case-sensitivity of autocompletion                                                  | string     | case-insensitive, case-sensitive                                         |

### Textview section

The `[textview]` section of the `config.toml` file is a section with settings for our textviewer which is currently [bat](https://github.com/sharkdp/bat). So, all these settings apply to the `bat` configuration built into nushell. It won't use settings you may currently have on your system if you use `bat`.

| Name                     | Purpose                                                                                                           | Value Type | Options                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [textview]               | This is the section name                                                                                          |            |                                |
| colored_output           | Enable/Disable whether or not the output should be colorized                                                      | boolean    | true or false                  |
| grid                     | Enable/Disable a grid                                                                                             | boolean    | true or false                  |
| header                   | Enable/Disable a header                                                                                           | boolean    | true or false                  |
| line_numbers             | Enable/Disable line numbers                                                                                       | boolean    | true or false                  |
| pager                    | Set the pager to use                                                                                              | string     | less, more, etc                |
| paging_mode              | Set the paging mode                                                                                               | string     | always, quitifonescreen, never |
| snip                     | Enable/Disable snip                                                                                               | boolean    | true or false                  |
| tab_width                | The width of tab characters. Currently, a value of 0 will cause tabs to be passed through without expanding them. | number     |                                |
| term_width               | The character width of the terminal                                                                               | string     |                                |
| theme                    | Set the bat color theme to use                                                                                    | string     |                                |
| true_color               | Enable/Disable whether the output terminal supports true color                                                    | boolean    | true or false                  |
| use_italics              | Enable/Disable italic type                                                                                        | boolean    | true or false                  |
| vcs_modification_markers | Enable/Disable version control system modification markers                                                        | boolean    | true or false                  |
| wrapping_mode            | Set if and how text should be wrapped                                                                             | string     | character, nowrapping          |

### Path section

The `[path]` section in the `config.toml` is used to store folders that are generally where executable programs are located. The path section is an array type field so it requires quoted string directory paths delmited by commas.

You can use this command to initially populate the `[path]` section of your `config.toml` file.

`config set path $nu.path`

To view the `[path]` section of your `config.toml` you can type the following.

`echo $nu.path`

### Environment variables section

The `[env]` section of the `config.toml` is used to store permanent environment variables that nushell can use.

You can use this command to initially populate the `[env]` section of your `config.toml` file.

`config set env $nu.env`

To view the `[env]` section of your `config.toml` you can type the following command.

`echo $nu.env`

### Example `config.toml` below closely matches the file found in our repo [here](https://github.com/nushell/nushell/tree/main/docs/sample_config).

```toml
filesize_format = "B" # can be b, kb, kib, mb, mib, gb, gib, etc
skip_welcome_message = true
disable_table_indexes = false
nonzero_exit_errors = true
startup = [
    "alias la = ls --long",
    "def nudown [] {fetch https://api.github.com/repos/nushell/nushell/releases | get assets | select name download_count}",
    "def nuver [] {version | pivot key value}",
    ]
table_mode = "other" # basic, compact, compact_double, light, thin, with_love, rounded, reinforced, heavy, none, other
plugin_dirs = ["D:\\Src\\GitHub\\nu-plugin-lib\\samples\\Nu.Plugin.Len\\bin\\Debug\\netcoreapp3.1"]
pivot_mode = "auto" # auto, always, never
ctrlc_exit = false
complete_from_path = true
rm_always_trash = true
prompt = "echo $(ansi gb) $(pwd) $(ansi reset) \"(\" $(ansi cb) $(do -i { git rev-parse --abbrev-ref HEAD | str trim }) $(ansi reset) \")\" $(char newline) $(ansi yb) $(date --format \"%m/%d/%Y %I:%M:%S%.3f %p\" --raw) $(ansi reset) \"> \" | str collect"

[color_config]
primitive_int = "green"
primitive_decimal = "red"
primitive_filesize = "ur"
primitive_string = "pb"
primitive_line = "yellow"
primitive_columnpath = "cyan"
primitive_pattern = "white"
primitive_boolean = "green"
primitive_date = "ru"
primitive_duration = "blue"
primitive_range = "purple"
primitive_path = "yellow"
primitive_binary = "cyan"
separator_color = "purple"
header_align = "l" # left|l, right|r, center|c
header_color = "c" # green|g, red|r, blue|u, black|b, yellow|y, purple|p, cyan|c, white|w
header_bold = true
index_color = "rd"
leading_trailing_space_bg = "white"

[line_editor]
max_history_size = 100000
history_duplicates = "ignoreconsecutive" # alwaysadd,ignoreconsecutive
history_ignore_space = false
completion_type = "circular" # circular, list, fuzzy
completion_prompt_limit = 100
keyseq_timeout_ms = 500 # ms
edit_mode = "emacs" # vi, emacs
auto_add_history = true
bell_style = "audible" # audible, none, visible
color_mode = "enabled" # enabled, forced, disabled
tab_stop = 4

[textview]
term_width = "default" # "default" or a number
tab_width = 4
colored_output = true
true_color = true
header = true
line_numbers = true
grid = false
vcs_modification_markers = true
snip = true
wrapping_mode = "NoWrapping" # Character, NoWrapping
use_italics = true
paging_mode = "QuitIfOneScreen" # Always, QuitIfOneScreen, Never
pager = "less"
theme = "TwoDark"

# These are from a Windows system, Mac and Linux will look slightly different
path = [
    "C:\\WINDOWS\\system32",
    "C:\\WINDOWS",
    "C:\\WINDOWS\\System32\\OpenSSH\\",
]

# Some environment variables removed to protect the innocent
# These are from a Windows environment, Mac and Linux will look slightly different
[env]
ALLUSERSPROFILE = "C:\\ProgramData"
CommonProgramFiles = "C:\\Program Files\\Common Files"
"CommonProgramFiles(x86)" = "C:\\Program Files (x86)\\Common Files"
CommonProgramW6432 = "C:\\Program Files\\Common Files"
ComSpec = "C:\\WINDOWS\\system32\\cmd.exe"
DriverData = "C:\\Windows\\System32\\Drivers\\DriverData"
HOMEDRIVE = "C:"
NUMBER_OF_PROCESSORS = "16"
NVIDIAWHITELISTED = "0x01"
OS = "Windows_NT"
PATHEXT = ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC"
POWERSHELL_DISTRIBUTION_CHANNEL = "MSI:Windows 10 Pro"
PROCESSOR_ARCHITECTURE = "AMD64"
PROCESSOR_IDENTIFIER = "Intel64 Family 6 Model 158 Stepping 13, GenuineIntel"
PROCESSOR_LEVEL = "6"
PROCESSOR_REVISION = "9e0d"
ProgramData = "C:\\ProgramData"
ProgramFiles = "C:\\Program Files"
"ProgramFiles(x86)" = "C:\\Program Files (x86)"
ProgramW6432 = "C:\\Program Files"
PSModulePath = "C:\\Program Files\\WindowsPowerShell\\Modules;C:\\WINDOWS\\system32\\WindowsPowerShell\\v1.0\\Modules"
PUBLIC = "C:\\Users\\Public"
SHIM_MCCOMPAT = "0x810000001"
SystemDrive = "C:"
SystemRoot = "C:\\WINDOWS"
windir = "C:\\WINDOWS"
WSLENV = "WT_SESSION::WT_PROFILE_ID"
```

## Startup commands

To run commands at start, Nushell offers a special part of the configuration that contains a list of strings which will be treated as commands you haved typed in as Nushell starts up.

Let's add a single line to print "hello" as Nushell starts up:

```
config set startup ["echo 'hello'"]
```

The startup section lets you do the configuration steps that should happen before your Nushell session begins, including adding aliases or custom commands.

## Using the `config` command

### Setting variables

To set one of these variables, you can use `config set`. For example:

```
> config set line_editor.edit_mode "vi"
```

### Setting a variable from the pipeline

There's an additional way to set a variable, and that is to use the contents of the pipeline as the value you want to use for the variable. For this, use the `set_into` flag:

```
> echo "bar" | config set_into foo
```

This is helpful when working with the `env` and `path` variables.

### Listing all variables

Running the `config` command without any arguments will show a table of the current configuration settings:

```
> config
─────────────────┬──────────────────
 completion_type │ circular
 env             │ [row 51 columns]
 path            │ [table 9 rows]
 startup         │ [table 1 rows]
─────────────────┴──────────────────
```

Note: if you haven't set any configuration variables, yet, this may be empty.

### Getting a variable

Using the `get` flag, you can retrieve the value for a given variable:

```
> config get line_editor.edit_mode
```

### Removing a variable

To remove a variable from the configuration, use the `remove` flag:

```
> config remove line_editor.edit_mode
```

### Clearing the whole configuration

If you want to clear the whole configuration and start fresh, you can use the `clear` flag. Of course, be careful with this as once you run it, the configuration file is also cleared.

```
> config clear
```

### Finding where the configuration is stored

The configuration file is loaded from a default location. To find what this location is on your system, you can ask for it using the `path` flag:

```
> config path
/home/jonathant/.config/nu/config.toml
```

## Configuring Nu as a login shell

To use Nu as a login shell, you'll need to configure the `path` and `env` configuration variables. With these, you'll have enough support to run external commands as a login shell.

Before switching, run Nu inside of another shell, like Bash. Then, take the environment and PATH from that shell with the following commands:

```
> config set path $nu.path
> config set env  $nu.env
```

The `$nu.path` and `$nu.env` values are set to the current PATH and environment variables, respectively. More information about these two config sections is available in the `config.toml` description. Once you set these into the configuration, they'll be available later when using Nu as a login shell.

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
config set prompt "starship prompt"
```

Now restart Nu.

```
nushell on 📙 master [$] is 📦 v0.18.2 via 🦀 v1.48.0-nightly
❯
```

If your prompt looks a bit garbled like this:

```
%{%}~%{%}
%{%}❯%{%}
```

you may want to unset the `STARSHIP_SHELL` environment variable when setting the prompt.

```
config set prompt "STARSHIP_SHELL= starship prompt"
```
