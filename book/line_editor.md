# Reedline, Nu's Line Editor

Nushell's line-editor [Reedline](https://github.com/nushell/reedline) is
cross-platform and designed to be modular and flexible. The line-editor is
in charge of controlling the command history, validations, completions, hints,
screen paint, and more.

[[toc]]

## Multi-line Editing

Reedline allows Nushell commandlines to extend across multiple lines. This can be accomplished using several methods:

1. Pressing <kbd>Enter</kbd> when a bracketed expression is open.

   For example:

   ```nu
   def my-command [] {
   ```

   Pressing <kbd>Enter </kbd> after the open-bracket will insert a newline. This will also occur with opening (and valid) `(` and `[` expressions.

   This is commonly used to create blocks and closures (as above), but also list, record, and table literals:

   ```nu
   let file = {
     name: 'repos.sqlite'
     hash: 'b939a3fa4ca011ca1aa3548420e78cee'
     version: '1.4.2'
   }
   ```

   It can even be used to continue a single command across multiple lines:

   ::: details Example

   ```nu
   (
     tar
     -cvz
     -f archive.tgz
     --exclude='*.temp'
     --directory=../project/
     ./
   )
   ```

   :::

2. Pressing <kbd>Enter</kbd> at the end of a line with a trailing pipe-symbol (`|`).

   ```nu
   ls                     |
   where name =~ '^[0-9]' | # Comments after a trailing pipe are okay
   get name               |
   mv ...$in ./backups/
   ```

3. Manually insert a newline using <kbd>Alt</kbd>+<kbd>Enter</kbd> or <kbd>Shift</kbd>+<kbd>Enter</kbd>.

   This can be used to create a somewhat more readable version of the previous commandline:

   ```nu
   ls
   | where name =~ '^[0-9]'  # Files starting with a digit
   | get name
   | mv ...$in ./backups/
   ```

   ::: tip
   It's possible that one or both of these keybindings may be intercepted by the terminal application or window-manager. For instance, Windows Terminal (and most other terminal applications on Windows) assign <kbd>Alt</kbd>+<kbd>Enter</kbd> to expand the terminal to full-screen. If neither of the above keybindings work in your terminal, you can assign a different keybinding to:

   ```nu
   event: { edit: insertnewline }
   ```

   See [Keybindings](#keybindings) below for more details.

   :::

4. Pressing <kbd>Ctrl</kbd>+<kbd>O</kbd> opens the current commandline in your editor. Saving the resulting file and exiting the editor will update the commandline with the results.

## Setting the Editing Mode

Reedline allows you to edit text using two modes — Vi and Emacs. If not
specified, the default mode is Emacs. To change the mode, use the
`edit_mode` setting.

```nu
$env.config.edit_mode = 'vi'
```

This can be changed at the commandline or persisted in `config.nu`.

::: note
Vi is a "modal" editor with "normal" mode and an "insert" mode. We recommend
becoming familiar with these modes through the use of the Vim or Neovim editors
before using Vi mode in Nushell. Each has a built-in tutorial covering the basics
(and more) of modal editing.
:::

## Default Keybindings

Each edit mode comes with common keybindings for Vi and Emacs text editing.

### Emacs and Vi-insert Keybindings

These keybinding events apply to both Emacs and Vi-insert mode:

| Key                                        | Event                               |
| ------------------------------------------ | ----------------------------------- |
| <kbd>Shift</kbd>+<kbd>Enter</kbd>          | Insert newline                      |
| <kbd>Alt</kbd>+<kbd>Enter</kbd>            | Insert newline                      |
| <kbd>Backspace</kbd>                       | Backspace                           |
| <kbd>End</kbd>                             | Move to end of line                 |
| <kbd>End</kbd>                             | Complete history hint               |
| <kbd>Home</kbd>                            | Move to line start                  |
| <kbd>Ctrl</kbd>+<kbd>C</kbd>               | Cancel current line                 |
| <kbd>Ctrl</kbd>+<kbd>L</kbd>               | Clear screen                        |
| <kbd>Ctrl</kbd>+<kbd>R</kbd>               | Search history                      |
| <kbd>Ctrl</kbd>+<kbd>→</kbd> (Right Arrow) | Complete history word               |
| <kbd>Ctrl</kbd>+<kbd>→</kbd> (Right Arrow) | Move word right                     |
| <kbd>Ctrl</kbd>+<kbd>←</kbd> (Left Arrow)  | Move word left                      |
| <kbd>↑</kbd> (Up Arrow)                    | Move up                             |
| <kbd>↓</kbd> (Down Arrow)                  | Move down                           |
| <kbd>←</kbd> (Left Arrow)                  | Move left                           |
| <kbd>→</kbd> (Right Arrow)                 | Move right                          |
| <kbd>Ctrl</kbd>+<kbd>P</kbd>               | Move up                             |
| <kbd>Ctrl</kbd>+<kbd>N</kbd>               | Move down                           |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>               | Move left                           |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>               | Move right                          |
| <kbd>→</kbd> (Right Arrow)                 | History-hint complete               |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>               | History-hint complete               |
| <kbd>Alt</kbd>+<kbd>F</kbd>                | History-hint complete one word      |
| <kbd>Alt</kbd>+<kbd>←</kbd> (Left Arrow)   | History-hint complete one word less |

### Vi-insert Keybindings

These keybinding events apply only to Vi-insert mode:

| Key            | Event                    |
| -------------- | ------------------------ |
| <kbd>Esc</kbd> | Switch to Vi-normal mode |

### Vi-normal Keybindings

These keybinding events apply only to Vi-normal mode:

| Key                                         | Event               |
| ------------------------------------------- | ------------------- |
| <kbd>Ctrl</kbd>+<kbd>C</kbd>                | Cancel current line |
| <kbd>Ctrl</kbd>+<kbd>L</kbd>                | Clear screen        |
| <kbd>↑</kbd> (Up Arrow)                     | Move up             |
| <kbd>↓</kbd> (Down Arrow)                   | Move down           |
| <kbd>←</kbd> (Left Arrow)                   | Move left           |
| <kbd>→</kbd> (Right Arrow)                  | Move right          |
| <kbd>Ctrl></kbd>+<kbd>→</kbd> (Right Arrow) | Move right one word |
| <kbd>Ctrl></kbd>+<kbd>←</kbd> (Left Arrow)  | Move left one word  |

### Vi-normal Motions

As with Vi, many motions and actions can be combined with an optional count in normal-mode. For example, <kbd>3</kbd><kbd>d</kbd><kbd>w</kbd> deletes the next three words.

| Key                                    | Motion                                        |
| -------------------------------------- | --------------------------------------------- |
| <kbd>w</kbd>                           | Move to beginning of next word                |
| <kbd>e</kbd>                           | Move to end of current or next word           |
| <kbd>b</kbd>                           | Move to beginning of current or previous word |
| <kbd>0</kbd>                           | Move to start of line                         |
| <kbd>$</kbd>                           | Move to end of line                           |
| <kbd>h</kbd>                           | Move left                                     |
| <kbd>l</kbd>                           | Move right                                    |
| <kbd>j</kbd>                           | Move down                                     |
| <kbd>k</kbd>                           | Move up                                       |
| <kbd>f</kbd>+\<char\>                  | Move right to \<char\>                        |
| <kbd>t</kbd>+\<char\>                  | Move right to before \<char\>                 |
| <kbd>Shift</kbd>+<kbd>F</kbd>+\<char\> | Move left to \<char\>                         |
| <kbd>Shift</kbd>+<kbd>T</kbd>+\<char\> | Move left to after \<char\>                   |

### Vi-normal Actions

These actions can be combined with many of the [motions above](#vi-normal-motions).

| Key                           | Action                                             |
| ----------------------------- | -------------------------------------------------- |
| <kbd>d</kbd>                  | Delete                                             |
| <kbd>Shift</kbd>+<kbd>D</kbd> | Delete to end of line                              |
| <kbd>p</kbd>                  | Paste after current character                      |
| <kbd>Shift</kbd>+<kbd>P</kbd> | Paste before current character                     |
| <kbd>i</kbd>                  | Enter Vi insert-mode (append) at current character |
| <kbd>Shift</kbd>+<kbd>I</kbd> | Enter insert-mode at beginning of line             |
| <kbd>a</kbd>                  | Append after current character                     |
| <kbd>Shift</kbd>+<kbd>A</kbd> | Append to end of line                              |
| <kbd>0</kbd>                  | Move to start of line                              |
| <kbd>^</kbd>                  | Move to start of line                              |
| <kbd>$</kbd>                  | Move to end of line                                |
| <kbd>c</kbd>                  | Change                                             |
| <kbd>r</kbd>                  | Replace                                            |
| <kbd>s</kbd>                  | Substitute character(s)                            |
| <kbd>x</kbd>                  | Delete character                                   |
| <kbd>u</kbd>                  | Undo                                               |

## Command History

As mentioned before, Reedline manages and stores all the commands that are
edited and sent to Nushell. To configure the max number of records that
Reedline should store you will need to adjust this value in your config file:

```nu
  $env.config = {
    ...
    history: {
      ...
      max_size: 1000
      ...
    }
    ...
  }
```

## Customizing the Prompt

The Reedline prompt is configured using a number of environment variables. See [Prompt Configuration](./configuration.md#prompt-configuration) for details.

## Keybindings

Reedline keybindings are powerful constructs that let you build chains of
events that can be triggered with a specific combination of keys.

For example, let's say that you would like to map the completion menu to the
`Ctrl + t` keybinding (default is `tab`). You can add the next entry to your
config file.

```nu
  $env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: emacs
        event: { send: menu name: completion_menu }
      }
    ]

    ...
  }
```

After loading this new `config.nu`, your new keybinding (`Ctrl + t`) will open
the completion command.

Each keybinding requires the next elements:

- name: Unique name for your keybinding for easy reference in `$config.keybindings`
- modifier: A key modifier for the keybinding. The options are:
  - none
  - control
  - alt
  - shift
  - shift_alt
  - alt_shift
  - control_alt
  - alt_control
  - control_shift
  - shift_control
  - control_alt_shift
  - control_shift_alt
- keycode: This represent the key to be pressed
- mode: emacs, vi_insert, vi_normal (a single string or a list. e.g.
  [`vi_insert` `vi_normal`])
- event: The type of event that is going to be sent by the keybinding. The
  options are:
  - send
  - edit
  - until

::: tip
All of the available modifiers, keycodes and events can be found with
the command [`keybindings list`](/commands/docs/keybindings_list.md)
:::

::: tip
The keybindings added to `vi_insert` mode will be available when the
line editor is in insert mode (when you can write text), and the keybindings
marked with `vi_normal` mode will be available when in normal (when the cursor
moves using h, j, k or l)
:::

The event section of the keybinding entry is where the actions to be performed
are defined. In this field you can use either a record or a list of records.
Something like this

```nu
  ...
  event: { send: Enter }
  ...
```

or

```nu
  ...
  event: [
    { edit: Clear }
    { send: Enter }
  ]
  ...
```

The first keybinding example shown in this page follows the first case; a
single event is sent to the engine.

The next keybinding is an example of a series of events sent to the engine. It
first clears the prompt, inserts a string and then enters that value

```nu
  $env.config = {
    ...

    keybindings: [
    {
      name: change_dir_with_fzf
      modifier: CONTROL
      keycode: Char_t
      mode: emacs
      event:[
          { edit: Clear }
          { edit: InsertString,
            value: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"

          }
          { send: Enter }
        ]
    }

    ...
  }
```

One disadvantage of the previous keybinding is the fact that the inserted text
will be processed by the validator and saved in the history, making the
keybinding a bit slow and populating the command history with the same command.
For that reason there is the `executehostcommand` type of event. The next
example does the same as the previous one in a simpler way, sending a single
event to the engine

```nu
  $env.config = {
    ...

    keybindings: [
    {
      name: change_dir_with_fzf
      modifier: CONTROL
      keycode: Char_y
      mode: emacs
      event: {
        send: executehostcommand,
        cmd: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
      }
    }
  ]

    ...
  }
```

Before we continue you must have noticed that the syntax changes for edits and
sends, and for that reason it is important to explain them a bit more. A `send`
is all the `Reedline` events that can be processed by the engine and an `edit`
are all the `EditCommands` that can be processed by the engine.

### Send Type

To find all the available options for `send` you can use

```nu
keybindings list | where type == events
```

And the syntax for `send` events is the next one

```nu
    ...
      event: { send: <NAME OF EVENT FROM LIST> }
    ...
```

::: tip
You can write the name of the events with capital letters. The
keybinding parser is case insensitive
:::

There are two exceptions to this rule: the `Menu` and `ExecuteHostCommand`.
Those two events require an extra field to be complete. The `Menu` needs the
name of the menu to be activated (completion_menu or history_menu)

```nu
    ...
      event: {
        send: menu
        name: completion_menu
      }
    ...
```

and the `ExecuteHostCommand` requires a valid command that will be sent to the
engine

```nu
    ...
      event: {
        send: executehostcommand
        cmd: "cd ~"
      }
    ...
```

It is worth mentioning that in the events list you will also see `Edit([])`,
`Multiple([])` and `UntilFound([])`. These options are not available for the
parser since they are constructed based on the keybinding definition. For
example, a `Multiple([])` event is built for you when defining a list of
records in the keybinding's event. An `Edit([])` event is the same as the
`edit` type that was mentioned. And the `UntilFound([])` event is the same as
the `until` type mentioned later.

### Edit Type

The `edit` type is the simplification of the `Edit([])` event. The `event` type
simplifies defining complex editing events for the keybindings. To list the
available options you can use the next command

```nu
keybindings list | where type == edits
```

The usual syntax for an `edit` is the next one

```nu
    ...
      event: { edit: <NAME OF EDIT FROM LIST> }
    ...
```

The syntax for the edits in the list that have a `()` changes a little bit.
Since those edits require an extra value to be fully defined. For example, if
we would like to insert a string where the prompt is located, then you will
have to use

```nu
    ...
      event: {
        edit: insertstring
        value: "MY NEW STRING"
      }
    ...
```

or say you want to move right until the first `S`

```nu
    ...
      event: {
        edit: moverightuntil
        value: "S"
      }
    ...
```

As you can see, these two types will allow you to construct any type of
keybinding that you require

### Until Type

To complete this keybinding tour we need to discuss the `until` type for event.
As you have seen so far, you can send a single event or a list of events. And
as we have seen, when a list of events is sent, each and every one of them is
processed.

However, there may be cases when you want to assign different events to the
same keybinding. This is especially useful with Nushell menus. For example, say
you still want to activate your completion menu with `Ctrl + t` but you also
want to move to the next element in the menu once it is activated using the
same keybinding.

For these cases, we have the `until` keyword. The events listed inside the
until event will be processed one by one with the difference that as soon as
one is successful, the event processing is stopped.

The next keybinding represents this case.

```nu
  $env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: emacs
        event: {
          until: [
            { send: menu name: completion_menu }
            { send: menunext }
          ]
        }
      }
    ]

    ...
  }
```

The previous keybinding will first try to open a completion menu. If the menu
is not active, it will activate it and send a success signal. If the keybinding
is pressed again, since there is an active menu, then the next event it will
send is MenuNext, which means that it will move the selector to the next
element in the menu.

As you can see the `until` keyword allows us to define two events for the same
keybinding. At the moment of this writing, only the Menu events allow this type
of layering. The other non menu event types will always return a success value,
meaning that the `until` event will stop as soon as it reaches the command.

For example, the next keybinding will always send a `down` because that event
is always successful

```nu
  $env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: emacs
        event: {
          until: [
            { send: down }
            { send: menu name: completion_menu }
            { send: menunext }
          ]
        }
      }
    ]

    ...
  }
```

### Removing a Default Keybinding

If you want to remove a certain default keybinding without replacing it with a different action, you can set `event: null`.

e.g. to disable screen clearing with `Ctrl + l` for all edit modes

```nu
  $env.config = {
    ...

    keybindings: [
      {
        modifier: control
        keycode: char_l
        mode: [emacs, vi_normal, vi_insert]
        event: null
      }
    ]

    ...
  }
```

### Troubleshooting Keybinding Problems

Your terminal environment may not always propagate your key combinations on to Nushell the way you expect it to. You can use the command [`keybindings listen`](/commands/docs/keybindings_listen.md) to determine if certain keypresses are actually received by Nushell, and how.

## Menus

Thanks to Reedline, Nushell has menus that can help you with your day to day
shell scripting. Next we present the default menus that are always available
when using Nushell

### Menu Keybindings

When a menu is active, some keybindings change based on the keybinding [`until` specifier](#until-type) discussed above. Common keybindings for menus are:

| Key                             | Event                |
| ------------------------------- | -------------------- |
| <kbd>Tab</kbd>                  | Select next item     |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | Select previous item |
| <kbd>Enter</kbd>                | Accept selection     |
| <kbd>↑</kbd> (Up Arrow)         | Move menu up         |
| <kbd>↓</kbd> (Down Arrow)       | Move menu down       |
| <kbd>←</kbd> (Left Arrow)       | Move menu left       |
| <kbd>→</kbd> (Right Arrow)      | Move menu right      |
| <kbd>Ctrl</kbd>+<kbd>P</kbd>    | Move menu up         |
| <kbd>Ctrl</kbd>+<kbd>N</kbd>    | Move menu down       |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>    | Move menu left       |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>    | Move menu right      |

::: note
Menu direction behavior varies based on the menu type (see below). For example,
in a `description` menu, "Up" and "Down" apply to the "Extra" list, but in a
`list` menu the directions apply to the selection.
:::

### Help Menu

The help menu is there to ease your transition into Nushell. Say you are
putting together an amazing pipeline and then you forgot the internal command
that would reverse a string for you. Instead of deleting your pipe, you can
activate the help menu with `F1`. Once active just type keywords for the
command you are looking for and the menu will show you commands that match your
input. The matching is done on the name of the commands or the commands
description.

To navigate the menu you can select the next element by using `tab`, you can
scroll the description by pressing left or right and you can even paste into
the line the available command examples.

The help menu can be configured by modifying the next parameters

```nu
  $env.config = {
    ...

    menus = [
      ...
      {
        name: help_menu
        only_buffer_difference: true # Search is done on the text written after activating the menu
        marker: "? "                 # Indicator that appears with the menu is active
        type: {
            layout: description      # Type of menu
            columns: 4               # Number of columns where the options are displayed
            col_width: 20            # Optional value. If missing all the screen width is used to calculate column width
            col_padding: 2           # Padding between columns
            selection_rows: 4        # Number of rows allowed to display found options
            description_rows: 10     # Number of rows allowed to display command description
        }
        style: {
            text: green                   # Text style
            selected_text: green_reverse  # Text style for selected option
            description_text: yellow      # Text style for description
        }
      }
      ...
    ]
    ...
```

### Completion Menu

The completion menu is a context sensitive menu that will present suggestions
based on the status of the prompt. These suggestions can range from path
suggestions to command alternatives. While writing a command, you can activate
the menu to see available flags for an internal command. Also, if you have
defined your custom completions for external commands, these will appear in the
menu as well.

The completion menu by default is accessed by pressing `tab` and it can be configured by
modifying these values from the config object:

```nu
  $env.config = {
    ...

    menus: [
      ...
      {
        name: completion_menu
        only_buffer_difference: false # Search is done on the text written after activating the menu
        marker: "| "                  # Indicator that appears with the menu is active
        type: {
            layout: columnar          # Type of menu
            columns: 4                # Number of columns where the options are displayed
            col_width: 20             # Optional value. If missing all the screen width is used to calculate column width
            col_padding: 2            # Padding between columns
        }
        style: {
            text: green                   # Text style
            selected_text: green_reverse  # Text style for selected option
            description_text: yellow      # Text style for description
        }
      }
      ...
    ]
    ...
```

By modifying these parameters you can customize the layout of your menu to your
liking.

### History Menu

The history menu is a handy way to access the editor history. When activating
the menu (default `Ctrl+r`) the command history is presented in reverse
chronological order, making it extremely easy to select a previous command.

The history menu can be configured by modifying these values from the config object:

```nu
  $env.config = {
    ...

    menus = [
      ...
      {
        name: history_menu
        only_buffer_difference: true # Search is done on the text written after activating the menu
        marker: "? "                 # Indicator that appears with the menu is active
        type: {
            layout: list             # Type of menu
            page_size: 10            # Number of entries that will presented when activating the menu
        }
        style: {
            text: green                   # Text style
            selected_text: green_reverse  # Text style for selected option
            description_text: yellow      # Text style for description
        }
      }
      ...
    ]
    ...
```

When the history menu is activated, it pulls `page_size` records from the
history and presents them in the menu. If there is space in the terminal, when
you press `Ctrl+x` again the menu will pull the same number of records and
append them to the current page. If it isn't possible to present all the pulled
records, the menu will create a new page. The pages can be navigated by
pressing `Ctrl+z` to go to previous page or `Ctrl+x` to go to next page.

#### Searching the History

To search in your history you can start typing key words for the command you
are looking for. Once the menu is activated, anything that you type will be
replaced by the selected command from your history. for example, say that you
have already typed this

```nu
let a = ()
```

you can place the cursor inside the `()` and activate the menu. You can filter
the history by typing key words and as soon as you select an entry, the typed
words will be replaced

```nu
let a = (ls | where size > 10MiB)
```

#### Menu Quick Selection

Another nice feature of the menu is the ability to quick select something from
it. Say you have activated your menu and it looks like this

```nu
>
0: ls | where size > 10MiB
1: ls | where size > 20MiB
2: ls | where size > 30MiB
3: ls | where size > 40MiB
```

Instead of pressing down to select the fourth entry, you can type `!3` and
press enter. This will insert the selected text in the prompt position, saving
you time scrolling down the menu.

History search and quick selection can be used together. You can activate the
menu, do a quick search, and then quick select using the quick selection
character.

### User Defined Menus

In case you find that the default menus are not enough for you and you have
the need to create your own menu, Nushell can help you with that.

In order to add a new menu that fulfills your needs, you can use one of the default
layouts as a template. The templates available in nushell are columnar, list or
description.

The columnar menu will show you data in a columnar fashion adjusting the column
number based on the size of the text displayed in your columns.

The list type of menu will always display suggestions as a list, giving you the
option to select values using `!` plus number combination.

The description type will give you more space to display a description for some
values, together with extra information that could be inserted into the buffer.

Let's say we want to create a menu that displays all the variables created
during your session, we are going to call it `vars_menu`. This menu will use a
list layout (layout: list). To search for values, we want to use only the things
that are written after the menu has been activated (only_buffer_difference:
true).

With that in mind, the desired menu would look like this

```nu
  $env.config = {
    ...

    menus = [
      ...
      {
        name: vars_menu
        only_buffer_difference: true
        marker: "# "
        type: {
            layout: list
            page_size: 10
        }
        style: {
            text: green
            selected_text: green_reverse
            description_text: yellow
        }
        source: { |buffer, position|
            scope variables
            | where name =~ $buffer
            | sort-by name
            | each { |row| {value: $row.name description: $row.type} }
        }
      }
      ...
    ]
    ...
```

As you can see, the new menu is identical to the `history_menu` previously
described. The only huge difference is the new field called [`source`](/commands/docs/source.md). The
[`source`](/commands/docs/source.md) field is a nushell definition of the values you want to display in the
menu. For this menu we are extracting the data from `scope variables` and we
are using it to create records that will be used to populate the menu.

The required structure for the record is the next one

```nu
{
  value:       # The value that will be inserted in the buffer
  description: # Optional. Description that will be display with the selected value
  span: {      # Optional. Span indicating what section of the string will be replaced by the value
    start:
    end:
  }
  extra: [string] # Optional. A list of strings that will be displayed with the selected value. Only works with a description menu
}
```

For the menu to display something, at least the `value` field has to be present
in the resulting record.

In order to make the menu interactive, these two variables are available in
the block: `$buffer` and `$position`. The `$buffer` contains the value captured
by the menu, when the option `only_buffer_difference` is true, `$buffer` is the
text written after the menu was activated. If `only_buffer_difference` is
false, `$buffer` is all the string in line. The `$position` variable can be
used to create replacement spans based on the idea you had for your menu. The
value of `$position` changes based on whether `only_buffer_difference` is true
or false. When true, `$position` is the starting position in the string where
text was inserted after the menu was activated. When the value is false,
`$position` indicates the actual cursor position.

Using this information, you can design your menu to present the information you
require and to replace that value in the location you need it. The only thing
extra that you need to play with your menu is to define a keybinding that will
activate your brand new menu.

### Menu Keybindings

In case you want to change the default way both menus are activated, you can
change that by defining new keybindings. For example, the next two keybindings
assign the completion and history menu to `Ctrl+t` and `Ctrl+y` respectively

```nu
  $env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: [vi_insert vi_normal]
        event: {
          until: [
            { send: menu name: completion_menu }
            { send: menupagenext }
          ]
        }
      }
      {
        name: history_menu
        modifier: control
        keycode: char_y
        mode: [vi_insert vi_normal]
        event: {
          until: [
            { send: menu name: history_menu }
            { send: menupagenext }
          ]
        }
      }
    ]

    ...
  }
```
