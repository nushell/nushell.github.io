# Reedline, Nu's Line Editor

Nushell's line-editor [Reedline](https://github.com/nushell/reedline) is
cross-platform and designed to be modular and flexible. The line-editor is
in charge of controlling the command history, validations, completions, hints,
the status line, screen paint, and more.

[[toc]]

## Multi-line Editing

Reedline allows Nushell commandlines to extend across multiple lines. This can be accomplished using several methods:

1. Pressing <kbd>Enter</kbd> when a bracketed expression is open.

   For example, you can type this command over three lines:

   ```nu
   def my-command [] {
     print "Hello from my-command"
   }
   ```

   Pressing <kbd>Enter</kbd> after the open-bracket will insert a newline instead of running the command. This will also occur with opening (and valid) `(` and `[` expressions.

   An unclosed string continues the same way. A line that ends inside a `"`, `'`, backtick or raw string gets a newline, and the newline becomes part of the string. Nushell parses the line, and when the first error it finds is that something is still open, <kbd>Enter</kbd> inserts a newline. Any other first error runs the line so that you see the error. That includes an extra closing bracket, as in `echo (1 + 2))`.

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
   It's possible that one or both of these keybindings may be intercepted by the terminal application or window-manager. For instance, Windows Terminal (and most other terminal applications on Windows) assign <kbd>Alt</kbd>+<kbd>Enter</kbd> to expand the terminal to full-screen. If neither of the above keybindings work in your terminal, you can assign a different keybinding to the `insertnewline` edit (`event: { edit: insertnewline }`).

   See [Edit Type](#edit-type) below for an example, and [Keybindings](#keybindings) for more details.

   :::

4. Pressing <kbd>Ctrl</kbd>+<kbd>O</kbd> opens the current commandline in your editor. Saving the resulting file and exiting the editor will update the commandline with the results.

   The editor is `$env.config.buffer_editor` if it's set, otherwise `$env.VISUAL`, otherwise `$env.EDITOR` (see [Configuration](./configuration.md)). When none of them is set, or the program it names isn't found, <kbd>Ctrl</kbd>+<kbd>O</kbd> does nothing.

   To open the editor with the cursor where you left it, use the `{file}`, `{line}` and `{col}` placeholders described under [`buffer_editor`](./config_reference.md#buffer-editor):

   ```nu
   $env.config.buffer_editor = ["hx", "{file}:{line}:{col}"]
   $env.config.buffer_editor = ["vim", "+{line}"]   # cursor on line 2: vim +2 <temp file>
   ```

## Setting the Editing Mode

Reedline allows you to edit text using three modes — Emacs, Vi and Helix. If not
specified, the default mode is Emacs. To change the mode, use the
`edit_mode` setting, which accepts `emacs`, `vi` or `helix`.

```nu
$env.config.edit_mode = 'vi'
```

This can be changed at the commandline or persisted in `config.nu`.

::: note
Vi is a "modal" editor with a "normal" mode, an "insert" mode and a "visual" mode. We recommend
becoming familiar with these modes through the use of the Vim or Neovim editors
before using Vi mode in Nushell. Each has a built-in tutorial covering the basics
(and more) of modal editing.

Helix mode follows the [Helix editor](https://helix-editor.com/), which is also modal but
"selection-first": you first select text with a motion, and then act on the selection.
See [Helix Mode](#helix-mode) below.
:::

The cursor shape can be set separately for each mode with `$env.config.cursor_shape`, which has the
keys `emacs`, `vi_insert`, `vi_normal`, `vi_visual`, `helix_normal`, `helix_select` and `helix_insert`.
Each accepts `block`, `underscore`, `line`, `blink_block`, `blink_underscore`, `blink_line` or
`inherit` (keep the terminal's cursor shape):

```nu
$env.config.cursor_shape.vi_insert = 'line'
$env.config.cursor_shape.vi_normal = 'block'
```

Every key defaults to `inherit`, which means Nushell doesn't change the cursor in that mode.
`vi_visual` is the exception. When it's `inherit`, visual mode uses the `vi_normal` shape, so the
example above also gives visual mode a block cursor.

## Default Keybindings

Each of the three edit modes is built from a few shared sets of keybindings plus its own additions. The tables below follow Reedline's [keybinding reference](https://github.com/nushell/reedline/blob/main/KEYBINDINGS.md) for the Reedline version that ships with Nushell. Run [`keybindings default`](/commands/docs/keybindings_default.md) to list Reedline's built-in key table for the `emacs`, `vi_normal`, `vi_insert`, `helix_normal` and `helix_insert` modes. It has no rows for `vi_visual` or `helix_select`, and it leaves out the plain-key Vi and Helix commands such as <kbd>w</kbd> and <kbd>d</kbd>, which Reedline handles outside that table.

`keybindings default` prints Reedline's own names for keys and events, which differ from the ones you write in `$env.config.keybindings`. `KeyModifiers(0x0)` is no modifier, `Char('k')` is `char_k`, `UntilFound([...])` is an [`until`](#until-type) list, and `Edit([...])` is an [`edit`](#edit-type) event:

```nu
keybindings default | where mode == emacs and code in [Down "Char('k')"] | first 2
# => ╭───┬───────┬───────────────────────┬───────────┬──────────────────────────────╮
# => │ # │ mode  │       modifier        │   code    │            event             │
# => ├───┼───────┼───────────────────────┼───────────┼──────────────────────────────┤
# => │ 0 │ emacs │ KeyModifiers(0x0)     │ Down      │ UntilFound([MenuDown, Down]) │
# => │ 1 │ emacs │ KeyModifiers(CONTROL) │ Char('k') │ Edit([KillLine])             │
# => ╰───┴───────┴───────────────────────┴───────────┴──────────────────────────────╯
```

It doesn't include the bindings that Nushell adds or the ones in your configuration. Those are in `$env.config.keybindings`, shown below.

Some keys are a _fallback chain_: Reedline tries each step and takes the first one that applies. The tables write those with "otherwise". For example, <kbd>→</kbd> accepts a history hint if one is showing, otherwise moves right in an open menu, otherwise moves the cursor right.

### Keybindings Added by Nushell

Nushell adds the following keybindings on top of Reedline's defaults. They are defined in `$env.config.keybindings`, so you can change or remove them, and they apply in every edit mode:

| Key                              | Action                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| <kbd>Tab</kbd>                   | Open the completion menu, otherwise select the next item, otherwise complete                 |
| <kbd>Shift</kbd>+<kbd>Tab</kbd>  | Select the previous item in the menu                                                         |
| <kbd>Ctrl</kbd>+<kbd>Space</kbd> | Open the IDE-style completion menu, otherwise select the next item, otherwise complete       |
| <kbd>Ctrl</kbd>+<kbd>R</kbd>     | Open the history menu (this replaces Reedline's <kbd>Ctrl</kbd>+<kbd>R</kbd> history search) |
| <kbd>Ctrl</kbd>+<kbd>Q</kbd>     | Search the history                                                                           |
| <kbd>Ctrl</kbd>+<kbd>X</kbd>     | Show the next page of an open menu                                                           |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd>     | Show the previous page of an open menu, otherwise undo                                       |
| <kbd>F1</kbd>                    | Open the help menu                                                                           |

```nu
$env.config.keybindings | select name modifier keycode
# => ╭───┬────────────────────────────┬──────────┬─────────╮
# => │ # │            name            │ modifier │ keycode │
# => ├───┼────────────────────────────┼──────────┼─────────┤
# => │ 0 │ completion_menu            │ none     │ tab     │
# => │ 1 │ ide_completion_menu        │ control  │ space   │
# => │ 2 │ completion_previous        │ shift    │ backtab │
# => │ 3 │ history_menu               │ control  │ char_r  │
# => │ 4 │ next_page_menu             │ control  │ char_x  │
# => │ 5 │ undo_or_previous_page_menu │ control  │ char_z  │
# => │ 6 │ help_menu                  │ none     │ f1      │
# => │ 7 │ search_history             │ control  │ char_q  │
# => ╰───┴────────────────────────────┴──────────┴─────────╯
```

### Common Keybindings

Four sets of keybindings are shared between the edit modes:

| Set                                   | Emacs | Vi insert | Vi normal / visual     | Helix insert | Helix normal / select  |
| ------------------------------------- | ----- | --------- | ---------------------- | ------------ | ---------------------- |
| [Control](#control-keybindings)       | yes   | yes       | yes                    | yes          | yes                    |
| [Navigation](#navigation-keybindings) | yes   | yes       | yes, rebound in visual | yes          | yes, rebound in select |
| [Editing](#editing-keybindings)       | yes   | yes       | no                     | yes          | no                     |
| [Selection](#selection-keybindings)   | yes   | yes       | yes                    | yes          | yes                    |

A mode without the editing set rebinds <kbd>Backspace</kbd> and <kbd>Delete</kbd> itself. Modes may also override single keys within a set; those keys are noted in the mode's own tables.

#### Control Keybindings

| Key                          | Action                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| <kbd>Esc</kbd>               | Close an open menu and clear the selection; in Vi and Helix modes, also switch mode |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Cancel the current input                                                            |
| <kbd>Ctrl</kbd>+<kbd>D</kbd> | Delete the character under the cursor, or exit Nushell when the line is empty       |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | Clear the screen, keeping the current input                                         |
| <kbd>Ctrl</kbd>+<kbd>R</kbd> | Search the history (Nushell binds this key to the history menu instead, see above)  |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Open the current input in your editor (see `$env.config.buffer_editor`)             |

When [background jobs](./background_jobs.md) not spawned with `--auto-kill` are running, <kbd>Ctrl</kbd>+<kbd>D</kbd> on an empty line doesn't exit right away. Like [`exit`](/commands/docs/exit.md), it prints a `background_jobs_running` warning and returns to the prompt. Pressing <kbd>Ctrl</kbd>+<kbd>D</kbd> again kills the jobs and exits, unless you run another command first.

#### Navigation Keybindings

| Key                                                             | Action                                                                                                          |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| <kbd>↑</kbd>, <kbd>Ctrl</kbd>+<kbd>P</kbd>                      | Move up in an open menu, otherwise move one line up, walking back through the history from the first line       |
| <kbd>↓</kbd>, <kbd>Ctrl</kbd>+<kbd>N</kbd>                      | Move down in an open menu, otherwise move one line down, walking forward through the history from the last line |
| <kbd>PageUp</kbd>                                               | Move one page up in an open menu, otherwise jump to the oldest history entry                                    |
| <kbd>PageDown</kbd>                                             | Move one page down in an open menu, otherwise leave the history for the line you were typing                    |
| <kbd>←</kbd>                                                    | Move left in an open menu, otherwise move one character left                                                    |
| <kbd>→</kbd>                                                    | Accept a history hint, otherwise move right in an open menu, otherwise move one character right                 |
| <kbd>Ctrl</kbd>+<kbd>←</kbd>                                    | Move one word left                                                                                              |
| <kbd>Ctrl</kbd>+<kbd>→</kbd>                                    | Accept one word of a history hint, otherwise move one word right                                                |
| <kbd>Home</kbd>, <kbd>Ctrl</kbd>+<kbd>A</kbd>                   | Move to the start of the line                                                                                   |
| <kbd>End</kbd>, <kbd>Ctrl</kbd>+<kbd>E</kbd>                    | Accept a history hint, otherwise move to the end of the line                                                    |
| <kbd>Ctrl</kbd>+<kbd>Home</kbd>, <kbd>Alt</kbd>+<kbd>&lt;</kbd> | Move to the start of the buffer                                                                                 |
| <kbd>Ctrl</kbd>+<kbd>End</kbd>, <kbd>Alt</kbd>+<kbd>&gt;</kbd>  | Move to the end of the buffer                                                                                   |

On terminals that use the Kitty keyboard protocol, <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>,</kbd> and <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>.</kbd> also work for <kbd>Alt</kbd>+<kbd>&lt;</kbd> and <kbd>Alt</kbd>+<kbd>&gt;</kbd>.

When the line already has text and the cursor is at its end, <kbd>↑</kbd> and <kbd>↓</kbd> only show history entries that start with that text, and <kbd>PageUp</kbd> jumps to the oldest of them. See [Prefix search with the arrow keys](#prefix-search-with-the-arrow-keys).

#### Editing Keybindings

| Key                                                                | Action                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------ |
| <kbd>Backspace</kbd>, <kbd>Ctrl</kbd>+<kbd>H</kbd>                 | Delete the character to the left                       |
| <kbd>Delete</kbd>                                                  | Delete the character under the cursor                  |
| <kbd>Ctrl</kbd>+<kbd>Backspace</kbd>, <kbd>Ctrl</kbd>+<kbd>W</kbd> | Delete the word to the left                            |
| <kbd>Ctrl</kbd>+<kbd>Delete</kbd>                                  | Delete the word to the right                           |
| <kbd>Shift</kbd>+<kbd>Enter</kbd>, <kbd>Alt</kbd>+<kbd>Enter</kbd> | Insert a newline without running the input             |
| <kbd>Ctrl</kbd>+<kbd>J</kbd>                                       | Run the input, or insert a newline if it is incomplete |

None of these fill the [cut buffer](#the-cut-buffer), except <kbd>Ctrl</kbd>+<kbd>W</kbd> in Emacs mode, which rebinds it to a cut. When Nushell is built with the `system-clipboard` feature, this set also has <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> and <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> to cut, copy and paste the selection with the system clipboard.

#### Selection Keybindings

| Key                                                                                               | Action                                          |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| <kbd>Shift</kbd>+<kbd>←</kbd>, <kbd>Shift</kbd>+<kbd>→</kbd>                                      | Extend the selection by one character           |
| <kbd>Shift</kbd>+<kbd>↑</kbd>, <kbd>Shift</kbd>+<kbd>↓</kbd>                                      | Extend the selection by one line                |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>←</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>→</kbd>      | Extend the selection by one word                |
| <kbd>Shift</kbd>+<kbd>Home</kbd>, <kbd>Shift</kbd>+<kbd>End</kbd>                                 | Extend the selection to the line start or end   |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Home</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>End</kbd> | Extend the selection to the buffer start or end |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>                                                     | Select the whole buffer                         |

### The cut buffer

Reedline keeps one cut buffer for all edit modes. Every command that cuts or copies replaces what's
in it, such as <kbd>Ctrl</kbd>+<kbd>K</kbd> in Emacs mode or <kbd>d</kbd> and <kbd>y</kbd> in Vi and
Helix mode, and every paste inserts it, such as <kbd>Ctrl</kbd>+<kbd>Y</kbd> or <kbd>p</kbd>. It
stays filled after you run a command, so you can cut text from one command line and paste it into
the next. There are no named registers. In Vi normal mode, <kbd>"</kbd><kbd>a</kbd> ignores the
<kbd>"</kbd> and starts appending.

Commands that delete, as opposed to cut, leave the cut buffer alone. Among the keys, those are
<kbd>Backspace</kbd>, <kbd>Delete</kbd> and the [editing keybindings](#editing-keybindings) above,
Vi's <kbd>C</kbd> and Helix's <kbd>Alt</kbd>+<kbd>D</kbd>. Among the [edit commands](#edit-commands), the ones named after
"backspace", "delete", "clear" or "erase" leave it alone, and the ones named after "cut" or "copy"
fill it. The system clipboard is separate, see [The system clipboard](#the-system-clipboard).

### Emacs Mode

Emacs mode is the default. It has all four [common sets](#common-keybindings), plus:

| Key                                                              | Action                                                                                          |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>                                     | Move left in an open menu, otherwise move one character left                                    |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>                                     | Accept a history hint, otherwise move right in an open menu, otherwise move one character right |
| <kbd>Alt</kbd>+<kbd>←</kbd>, <kbd>Alt</kbd>+<kbd>B</kbd>         | Move one word left                                                                              |
| <kbd>Alt</kbd>+<kbd>→</kbd>, <kbd>Alt</kbd>+<kbd>F</kbd>         | Accept one word of a history hint, otherwise move one word right                                |
| <kbd>Enter</kbd>                                                 | Run the input, or insert a newline if it is incomplete                                          |
| <kbd>Alt</kbd>+<kbd>Backspace</kbd>, <kbd>Alt</kbd>+<kbd>M</kbd> | Delete the word to the left                                                                     |
| <kbd>Alt</kbd>+<kbd>Delete</kbd>                                 | Delete the word to the right                                                                    |
| <kbd>Ctrl</kbd>+<kbd>W</kbd>                                     | Cut the word to the left                                                                        |
| <kbd>Alt</kbd>+<kbd>D</kbd>                                      | Cut the word to the right                                                                       |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>                                     | Cut to the end of the line, or join the next line when already at the end                       |
| <kbd>Ctrl</kbd>+<kbd>U</kbd>                                     | Cut from the start of the line to the cursor                                                    |
| <kbd>Ctrl</kbd>+<kbd>Y</kbd>                                     | Paste the cut buffer before the cursor                                                          |
| <kbd>Ctrl</kbd>+<kbd>T</kbd>                                     | Swap the two characters around the cursor                                                       |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd>                                     | Undo (Nushell binds this key to "previous menu page, otherwise undo", see above)                |
| <kbd>Ctrl</kbd>+<kbd>G</kbd>                                     | Redo                                                                                            |
| <kbd>Alt</kbd>+<kbd>U</kbd>                                      | Uppercase the word under the cursor                                                             |
| <kbd>Alt</kbd>+<kbd>L</kbd>                                      | Lowercase the word under the cursor                                                             |
| <kbd>Alt</kbd>+<kbd>C</kbd>                                      | Uppercase the first letter of the word under the cursor and lowercase the rest                  |

<kbd>Alt</kbd>+<kbd>U</kbd>, <kbd>Alt</kbd>+<kbd>L</kbd> and <kbd>Alt</kbd>+<kbd>C</kbd> change the whole word, even with the cursor in the middle of it. With the cursor just before the `r` of `world`, <kbd>Alt</kbd>+<kbd>U</kbd> gives `WORLD`. Bash and other readline-based shells change only the part from the cursor on, giving `woRLD`.

### Vi Mode

Vi mode starts in insert mode. <kbd>Esc</kbd> switches to normal mode, <kbd>i</kbd> and its siblings return to insert mode, and <kbd>v</kbd> enters visual mode from normal mode. In visual mode, <kbd>Esc</kbd> returns to normal mode; in normal mode it cancels a half-typed command.

An operator waits for a motion, and the motion picks the range the operator acts on: <kbd>d</kbd> then <kbd>w</kbd> cuts a word. A count can prefix a motion or a command, and counts on an operator and its motion multiply: <kbd>2</kbd><kbd>d</kbd><kbd>3</kbd><kbd>w</kbd> cuts six words.

In every Vi mode, an <kbd>Alt</kbd>+\<char\> chord that isn't bound is read as <kbd>Esc</kbd> followed by \<char\> (the "meta" convention of readline and zsh). For example, <kbd>Alt</kbd>+<kbd>k</kbd> in insert mode recalls the previous line. This is also how you can use a terminal that doesn't send <kbd>Alt</kbd>: press <kbd>Esc</kbd> first, then the key.

#### Vi Insert Mode

Insert mode has all four [common sets](#common-keybindings), plus:

| Key              | Action                                                                      |
| ---------------- | --------------------------------------------------------------------------- |
| <kbd>Enter</kbd> | Run the input, or insert a newline if it is incomplete                      |
| <kbd>Esc</kbd>   | Switch to normal mode, moving the cursor back onto the last typed character |

The Emacs cut and case commands (<kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>U</kbd>, <kbd>Ctrl</kbd>+<kbd>Y</kbd>, <kbd>Ctrl</kbd>+<kbd>T</kbd>, <kbd>Alt</kbd>+<kbd>D</kbd>, <kbd>Alt</kbd>+<kbd>U</kbd>, <kbd>Alt</kbd>+<kbd>L</kbd> and <kbd>Alt</kbd>+<kbd>C</kbd>) are not bound in insert mode. Because of the meta convention, <kbd>Alt</kbd>+<kbd>u</kbd> undoes, and <kbd>Alt</kbd>+<kbd>d</kbd> leaves insert mode and starts a <kbd>d</kbd> operator. <kbd>Ctrl</kbd>+<kbd>W</kbd> deletes the word to the left without cutting it.

#### Vi Normal Mode

Normal mode and visual mode have the control, navigation and selection sets, but not the editing set. In its place:

| Key                  | Action                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| <kbd>Backspace</kbd> | Move one character left in normal mode; extend the selection one character left in visual mode            |
| <kbd>Delete</kbd>    | Delete the character under the cursor in normal mode; in visual mode, cut the selection like <kbd>d</kbd> |

These motions move the cursor in normal mode. In visual mode, they extend the selection instead:

| Key                                        | Motion                                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| <kbd>h</kbd>, <kbd>l</kbd>                 | Move one character left or right                                                                 |
| <kbd>j</kbd>, <kbd>k</kbd>                 | Move one line down or up, walking through the history at the edge of the buffer                  |
| <kbd>w</kbd>, <kbd>W</kbd>                 | Move to the start of the next word or WORD                                                       |
| <kbd>e</kbd>, <kbd>E</kbd>                 | Move to the end of the next word or WORD                                                         |
| <kbd>b</kbd>, <kbd>B</kbd>                 | Move to the start of the previous word or WORD                                                   |
| <kbd>0</kbd>                               | Move to the start of the line                                                                    |
| <kbd>^</kbd>                               | Move to the first non-blank character of the line                                                |
| <kbd>$</kbd>                               | Move to the end of the line                                                                      |
| <kbd>g</kbd><kbd>g</kbd>, <kbd>G</kbd>     | Move to the start or end of the buffer                                                           |
| <kbd>f</kbd>\<char\>, <kbd>F</kbd>\<char\> | Move onto the next or previous occurrence of \<char\>                                            |
| <kbd>t</kbd>\<char\>, <kbd>T</kbd>\<char\> | Move just before the next or previous occurrence of \<char\>                                     |
| <kbd>;</kbd>, <kbd>,</kbd>                 | Repeat the last <kbd>f</kbd>/<kbd>t</kbd>/<kbd>F</kbd>/<kbd>T</kbd> search, forwards or reversed |

A WORD is delimited only by whitespace; a word is also delimited by punctuation. In normal mode, <kbd>h</kbd>, <kbd>j</kbd>, <kbd>k</kbd> and <kbd>l</kbd> follow the same fallback chain as the arrow keys: an open menu takes the key first, and <kbd>l</kbd> accepts a history hint before it moves.

Normal mode commands:

| Key                        | Action                                                                           |
| -------------------------- | -------------------------------------------------------------------------------- |
| <kbd>i</kbd>, <kbd>a</kbd> | Insert before or after the cursor                                                |
| <kbd>I</kbd>, <kbd>A</kbd> | Insert at the start or at the end of the line                                    |
| <kbd>o</kbd>, <kbd>O</kbd> | Open a line below or above, and insert                                           |
| <kbd>v</kbd>               | Enter [visual mode](#vi-visual-mode)                                             |
| <kbd>x</kbd>, <kbd>X</kbd> | Cut the character under or before the cursor                                     |
| <kbd>s</kbd>               | Cut the character under the cursor and insert                                    |
| <kbd>r</kbd>\<char\>       | Replace the character under the cursor with \<char\>                             |
| <kbd>C</kbd>               | Change to the end of the line, without filling the cut buffer                    |
| <kbd>S</kbd>               | Change the whole line                                                            |
| <kbd>D</kbd>               | Cut to the end of the line                                                       |
| <kbd>p</kbd>, <kbd>P</kbd> | Paste the cut buffer after or before the cursor                                  |
| <kbd>u</kbd>               | Undo                                                                             |
| <kbd>~</kbd>               | Switch the case of the character under the cursor                                |
| <kbd>.</kbd>               | Repeat the last change                                                           |
| <kbd>?</kbd>               | Search the history and switch to insert mode                                     |
| <kbd>Enter</kbd>           | Run the input, or insert a newline and switch to insert mode if it is incomplete |

A half-typed command, such as <kbd>f</kbd>, <kbd>r</kbd>, an operator or a count, takes the next character before any keybinding sees it. So <kbd>r</kbd><kbd>v</kbd> replaces the character under the cursor with `v`, and <kbd>f</kbd><kbd>v</kbd> moves to the next `v`. A `vi_normal` binding on a letter can't fire as the argument of <kbd>f</kbd>, even one with <kbd>Ctrl</kbd> held, so after <kbd>f</kbd> a bound <kbd>Ctrl</kbd>+<kbd>X</kbd> searches for `x`. A count waits for more keys too, which is why <kbd>2</kbd><kbd>v</kbd> doesn't enter visual mode. With nothing half-typed, a `vi_normal` binding on a plain letter takes the place of the built-in command for that letter. A bound key that isn't a character, such as an arrow or <kbd>F5</kbd>, fires at any time and drops whatever was half-typed.

#### Vi Operators and Text Objects

<kbd>d</kbd>, <kbd>c</kbd> and <kbd>y</kbd> take any motion, and cut, change or copy the range it covers. Doubling an operator applies it to the whole line: <kbd>d</kbd><kbd>d</kbd>, <kbd>c</kbd><kbd>c</kbd>, <kbd>y</kbd><kbd>y</kbd>.

An operator can also take a text object, with <kbd>i</kbd> for "inside" or <kbd>a</kbd> for "around":

| Object                     | Selects                |
| -------------------------- | ---------------------- |
| <kbd>w</kbd>, <kbd>W</kbd> | A word or WORD         |
| <kbd>b</kbd>               | The enclosing brackets |
| <kbd>q</kbd>               | The enclosing quotes   |

A delimiter works as a text object too: `(`, `)`, `[`, `]`, `{`, `}`, `<`, `>`, `"`, `'`, `` ` `` and `$`. Either half of a pair does the same thing, so <kbd>d</kbd><kbd>i</kbd><kbd>(</kbd> is the same as <kbd>d</kbd><kbd>i</kbd><kbd>)</kbd>. All three operators take the inside form; only <kbd>d</kbd> and <kbd>y</kbd> take the around form.

#### Vi Visual Mode

Pressing <kbd>v</kbd> in normal mode starts visual mode, which selects text as you move the cursor with the [motions](#vi-normal-mode). Visual mode rebinds the navigation set so each key extends the selection the way its Vi counterpart does:

- <kbd>←</kbd>, <kbd>→</kbd> and <kbd>Backspace</kbd> follow <kbd>h</kbd> and <kbd>l</kbd>.
- <kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>Ctrl</kbd>+<kbd>P</kbd> and <kbd>Ctrl</kbd>+<kbd>N</kbd> follow <kbd>k</kbd> and <kbd>j</kbd>.
- <kbd>Ctrl</kbd>+<kbd>←</kbd> and <kbd>Ctrl</kbd>+<kbd>→</kbd> follow <kbd>b</kbd> and <kbd>w</kbd>.
- <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>Ctrl</kbd>+<kbd>A</kbd> and <kbd>Ctrl</kbd>+<kbd>E</kbd> follow <kbd>0</kbd> and <kbd>$</kbd>.
- <kbd>Ctrl</kbd>+<kbd>Home</kbd>, <kbd>Ctrl</kbd>+<kbd>End</kbd>, <kbd>Alt</kbd>+<kbd>&lt;</kbd> and <kbd>Alt</kbd>+<kbd>&gt;</kbd> follow <kbd>g</kbd><kbd>g</kbd> and <kbd>G</kbd>.

In visual mode, <kbd>↑</kbd> and <kbd>↓</kbd> never walk through the history, and history hints are not accepted.

The normal mode commands apply in visual mode too, except for these keys, which act on the selection:

| Key                        | Action                                                                     |
| -------------------------- | -------------------------------------------------------------------------- |
| <kbd>d</kbd>, <kbd>x</kbd> | Cut the selection and return to normal mode                                |
| <kbd>X</kbd>               | Cut the selected lines, staying in visual mode                             |
| <kbd>c</kbd>, <kbd>s</kbd> | Change the selection and switch to insert mode                             |
| <kbd>y</kbd>               | Copy the selection and return to normal mode                               |
| <kbd>p</kbd>, <kbd>P</kbd> | Replace the selection with the cut buffer, staying in visual mode          |
| <kbd>u</kbd>, <kbd>U</kbd> | Make the selection lowercase or uppercase, then return to normal mode      |
| <kbd>~</kbd>               | Switch the case of the selection, then return to normal mode               |
| <kbd>o</kbd>, <kbd>O</kbd> | Move the cursor to the other end of the selection                          |
| <kbd>r</kbd>\<char\>       | Replace every selected character with \<char\>, then return to normal mode |
| <kbd>Esc</kbd>             | Drop the selection and return to normal mode                               |

Normal mode and visual mode have separate keybinding tables. Keybindings for visual mode use the `vi_visual` mode name, and bindings for `vi_normal` don't apply in visual mode.

### Helix Mode

With `$env.config.edit_mode = 'helix'`, the line editor follows the [Helix editor](https://docs.helix-editor.com/keymap.html). A motion carries a selection with it, and a command acts on what is selected. There is no operator-pending state: <kbd>w</kbd> selects a word, and <kbd>d</kbd> then deletes it.

Helix mode starts in insert mode. <kbd>Esc</kbd> switches to normal mode, <kbd>i</kbd> and its siblings return to insert mode, and <kbd>v</kbd> toggles select mode, where a motion extends the selection instead of replacing it. A count can prefix any key except <kbd>g</kbd>. A count typed before <kbd>g</kbd> is dropped along with the <kbd>g</kbd>, so <kbd>3</kbd><kbd>g</kbd><kbd>h</kbd> acts like <kbd>h</kbd> alone. A key you bound yourself, such as <kbd>Ctrl</kbd>+<kbd>X</kbd>, runs once after a count and drops it.

Insert mode has all four [common sets](#common-keybindings), plus <kbd>Enter</kbd> (run the input, or insert a newline if it is incomplete) and <kbd>Esc</kbd> (switch to normal mode).

Normal mode and select mode have the control, navigation and selection sets, but not the editing set. In its place:

| Key                         | Action                                                                 |
| --------------------------- | ---------------------------------------------------------------------- |
| <kbd>Backspace</kbd>        | Move one character left in normal mode; extend one left in select mode |
| <kbd>Delete</kbd>           | Delete the character under the cursor                                  |
| <kbd>Alt</kbd>+<kbd>D</kbd> | Delete the selection without yanking it                                |
| <kbd>Alt</kbd>+<kbd>`</kbd> | Make the selected text uppercase                                       |

As in [Vi visual mode](#vi-visual-mode), select mode rebinds the navigation set so each key extends the selection like its Helix counterpart, and <kbd>↑</kbd>/<kbd>↓</kbd> never walk through the history. The arrows, <kbd>Backspace</kbd>, <kbd>Ctrl</kbd>+<kbd>P</kbd> and <kbd>Ctrl</kbd>+<kbd>N</kbd> follow <kbd>h</kbd>, <kbd>j</kbd>, <kbd>k</kbd> and <kbd>l</kbd>, and <kbd>Ctrl</kbd>+<kbd>←</kbd> and <kbd>Ctrl</kbd>+<kbd>→</kbd> follow <kbd>b</kbd> and <kbd>w</kbd>. <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>Ctrl</kbd>+<kbd>A</kbd> and <kbd>Ctrl</kbd>+<kbd>E</kbd> follow <kbd>g</kbd><kbd>h</kbd> and <kbd>g</kbd><kbd>l</kbd>. <kbd>Ctrl</kbd>+<kbd>Home</kbd>, <kbd>Ctrl</kbd>+<kbd>End</kbd>, <kbd>Alt</kbd>+<kbd>&lt;</kbd> and <kbd>Alt</kbd>+<kbd>&gt;</kbd> follow <kbd>g</kbd><kbd>g</kbd> and <kbd>g</kbd><kbd>e</kbd>.

Motions:

| Key                                                | Action                                                            |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| <kbd>h</kbd>, <kbd>l</kbd>                         | Move left / right                                                 |
| <kbd>j</kbd>, <kbd>k</kbd>                         | Move down / up (walking through the history at the buffer's edge) |
| <kbd>w</kbd>, <kbd>b</kbd>, <kbd>e</kbd>           | Move to the next word start / previous word start / next word end |
| <kbd>W</kbd>, <kbd>B</kbd>, <kbd>E</kbd>           | Move to the next WORD start / previous WORD start / next WORD end |
| <kbd>f</kbd>\<char\>, <kbd>F</kbd>\<char\>         | Find the next / previous \<char\>                                 |
| <kbd>t</kbd>\<char\>, <kbd>T</kbd>\<char\>         | Find till the next / previous \<char\>                            |
| <kbd>g</kbd><kbd>h</kbd>, <kbd>g</kbd><kbd>l</kbd> | Go to the start / end of the line                                 |
| <kbd>g</kbd><kbd>s</kbd>                           | Go to the first non-whitespace character of the line              |
| <kbd>g</kbd><kbd>g</kbd>, <kbd>g</kbd><kbd>e</kbd> | Go to the start / end of the buffer                               |

<kbd>h</kbd>, <kbd>l</kbd> and the <kbd>g</kbd> motions collapse the selection onto the new position, while <kbd>w</kbd>, <kbd>b</kbd>, <kbd>e</kbd>, <kbd>f</kbd> and <kbd>t</kbd> select the text they move over.

Selection:

| Key            | Action                                                                      |
| -------------- | --------------------------------------------------------------------------- |
| <kbd>x</kbd>   | Select the current line; if it is already selected, extend to the next line |
| <kbd>%</kbd>   | Select the whole buffer                                                     |
| <kbd>v</kbd>   | Toggle select mode                                                          |
| <kbd>Esc</kbd> | Collapse the selection in normal mode; leave select mode in select mode     |

In the Helix editor, <kbd>Esc</kbd> in normal mode keeps the selection, and <kbd>;</kbd> collapses it. Nushell's Helix mode has no <kbd>;</kbd>, so <kbd>Esc</kbd> does that job.

Changes:

| Key                        | Action                                                                           |
| -------------------------- | -------------------------------------------------------------------------------- |
| <kbd>i</kbd>, <kbd>a</kbd> | Insert before / after the selection                                              |
| <kbd>I</kbd>, <kbd>A</kbd> | Insert at the first non-blank character of the line / at the end of the line     |
| <kbd>o</kbd>, <kbd>O</kbd> | Open a new line below / above the selection                                      |
| <kbd>d</kbd>               | Delete the selection                                                             |
| <kbd>c</kbd>               | Change the selection (delete it and enter insert mode)                           |
| <kbd>y</kbd>               | Yank (copy) the selection                                                        |
| <kbd>p</kbd>, <kbd>P</kbd> | Paste after / before the selection                                               |
| <kbd>r</kbd>\<char\>       | Replace the selection with \<char\>                                              |
| <kbd>~</kbd>               | Switch the case of the selected text                                             |
| <kbd>`</kbd>               | Make the selected text lowercase                                                 |
| <kbd>u</kbd>, <kbd>U</kbd> | Undo / redo                                                                      |
| <kbd>Enter</kbd>           | Run the input, or insert a newline and switch to insert mode if it is incomplete |

<kbd>d</kbd>, <kbd>y</kbd> and <kbd>p</kbd> return to normal mode, and <kbd>c</kbd> switches to insert mode.

Match mode starts with <kbd>m</kbd>:

| Key                                    | Action                                                   |
| -------------------------------------- | -------------------------------------------------------- |
| <kbd>m</kbd><kbd>i</kbd>\<char\>       | Select inside the pair or word that \<char\> names       |
| <kbd>m</kbd><kbd>a</kbd>\<char\>       | Select around it, delimiters included                    |
| <kbd>m</kbd><kbd>s</kbd>\<char\>       | Surround the selection with the pair                     |
| <kbd>m</kbd><kbd>d</kbd>\<char\>       | Delete the pair around the cursor, keeping what's inside |
| <kbd>m</kbd><kbd>r</kbd>\<old\>\<new\> | Replace the pair around the cursor with another pair     |

\<char\> is <kbd>w</kbd> or <kbd>W</kbd> for a word or WORD (with <kbd>i</kbd> and <kbd>a</kbd> only), either half of `()`, `[]`, `{}` or `<>`, or a quote. Any other printable ASCII character pairs with itself, so <kbd>m</kbd><kbd>i</kbd><kbd>|</kbd> selects the text between two `|`. On `echo (abc def)` with the cursor inside the parentheses, <kbd>m</kbd><kbd>i</kbd><kbd>(</kbd> and then <kbd>d</kbd> leave `echo ()`.

These Helix keys aren't available: <kbd>;</kbd>, <kbd>,</kbd>, <kbd>J</kbd>, <kbd>G</kbd>, <kbd>X</kbd>, <kbd>&gt;</kbd>, <kbd>&lt;</kbd>, the <kbd>/</kbd>, <kbd>n</kbd> and <kbd>N</kbd> search commands, <kbd>m</kbd><kbd>m</kbd> (go to the matching bracket), and the multi-cursor commands.

Keybindings for Helix mode use the `helix_normal`, `helix_select` and `helix_insert` mode names. The prompt uses `PROMPT_INDICATOR_VI_INSERT` in Helix insert mode, and `PROMPT_INDICATOR_VI_NORMAL` in normal and select mode.

::: tip
The selection in Vi visual mode and Helix mode is styled with `$env.config.color_config.selection` (reverse video by default). `$env.config.color_config.selection_cursor` styles the character under the cursor inside a selection:

```nu
$env.config.color_config.selection = { bg: '#44475a' }
```

:::

## Command History

As mentioned before, Reedline manages and stores all the commands that are
edited and sent to Nushell. To configure the max number of records that
Reedline should store you will need to adjust this value in your config file:

```nu
# in config.nu
$env.config.history.max_size = 1000
```

The default is `100_000`, and SQLite history ignores the limit. [History](./config_reference.md#history)
in the configuration reference describes every history setting.

::: note
The `history.max_size`, `history.file_format`, `history.isolation` and `history.path` settings
must be set in `config.nu`. They can't be changed once the REPL has started. Setting
`$env.config.history.path` to `null` turns off the history file.
:::

### The `history` commands

[`history`](/commands/docs/history.md) returns the saved history as a table, oldest command
first. With the default plain-text history it has two columns, `command` and `index`, the
entry's position in the file. The table shows `index` in its `#` column:

```nu
history
# => ╭───┬─────────╮
# => │ # │ command │
# => ├───┼─────────┤
# => │ 0 │ ls      │
# => │ 1 │ echo hi │
# => │ 2 │ cd /tmp │
# => ╰───┴─────────╯
```

With SQLite history, the columns are `start_timestamp`, `command`, `cwd`, `duration` and
`exit_status`, so you can ask questions such as
`history | where exit_status != 0 and cwd == $env.PWD`. `--long` (`-l`) adds `item_id`,
`session_id`, `hostname` and `idx`, the row's position in the database. Plain-text history
stores only the command lines, and `--long` changes nothing there. SQLite history is read from the
database only when a later command needs the rows, so `describe` calls the result
`SQLiteQueryBuilder`. Most commands treat it as a table, but a few, such as `to nuon`, reject it
with `custom values are currently not nuon-compatible`. Pipe it through
[`into value`](/commands/docs/into_value.md) first to get a plain table.

`history` reads the history file, so it shows what has been written to it:

- Plain-text history writes the new commands to the file just before the next prompt, with the
  default `history.sync_on_enter`. The line that runs `history` isn't in the file yet, so
  `history | last` is the command before it. With `sync_on_enter: false`, the file is written
  only when Nushell exits, and `history` doesn't show this session's commands at all.
- SQLite history saves each command when you press <kbd>Enter</kbd>, so `history | last` is the
  line that runs `history`.

Started with `nu --no-history`, `history` returns nothing.

`history --clear` (`-c`) deletes the history without asking. It removes the plain-text file, or
every row of the SQLite database. With plain-text history and the default `sync_on_enter`, the
session's own list is emptied at the next prompt too, so <kbd>↑</kbd> then finds only the
`history --clear` line.

[`history session`](/commands/docs/history_session.md) returns the ID of the current session.
With SQLite history and `history.isolation` turned on, each command is saved with this ID in its
`session_id` column, so this lists the commands you have run in this session:

```nu
history --long | where session_id == (history session) | get command
```

With `history.isolation` off, `history session` returns `0`, and `session_id` stays empty.
Plain-text history can't store the ID, but with `isolation` on, `history session` still returns
one. The ID is the time the session started, in nanoseconds since 1970, so
`history session | into datetime` shows when that was.

[`history import`](/commands/docs/history_import.md) adds commands to the history file in use.
With no input, it copies every entry from the file of the other format, `history.sqlite3` when
you use plain text or `history.txt` when you use SQLite, which keeps your history when you change
`history.file_format`. It looks for that file in the configuration directory, even when
`history.path` points elsewhere. If there's no such file, it creates an empty one and imports
nothing. Like `history`, it does nothing in a `nu --no-history` session.

Piped input can be:

- A string or a list of strings, one command each. This suits another shell's history file:
  `open ~/.bash_history | lines | history import`.
- A table with a `command` column and any of `start_timestamp` (a date), `hostname`, `cwd`,
  `duration` (a duration) and `exit_status` (an int).

Plain-text history keeps only the command, and it skips a command that is the same as the one
before it. A missing `command` column is an error, and so is any other column, which means the
output of `history` can't go straight back in. `history | history import` fails with
`unsupported column names: index`.

Before it writes anything, `history import` copies the current history file to `<file>.bak`, or
to `<file>.bak.1`, `<file>.bak.2` and so on when that name is taken, and prints
`Backed history to` and the path. It does this even when the import then fails. After 99 numbered
backups it fails with `Too many backup files` until you delete some.

### Prefix search with the arrow keys

On an empty line, <kbd>↑</kbd> (or <kbd>Ctrl</kbd>+<kbd>P</kbd>) steps back through the whole
history, newest entry first. Once you have typed something and the cursor is at the end of the
line, <kbd>↑</kbd> searches instead. It jumps to the newest entry that starts with the text you
typed, and each further press goes to the next older match. Say your history holds, from oldest
to newest:

```nu
echo apple
echo banana
echo apricot
echo apricot
ls
```

Typing `echo ap` and pressing <kbd>↑</kbd> gives `echo apricot`. Pressing it again gives
`echo apple`, because the search passes over `echo banana` and `ls`, and it also skips the
second `echo apricot` since that's the entry already on the line. At the oldest match,
<kbd>↑</kbd> does nothing. <kbd>↓</kbd> walks back toward newer matches, and past the newest
one it gives you back `echo ap`. If nothing in the history starts with your text, the line
stays as you typed it.

Some details:

- The search text is the line as it was at the first press of <kbd>↑</kbd>, and it stays fixed
  while you step through the matches. Editing the recalled line ends the search. The next
  <kbd>↑</kbd> starts a new one, with the edited line as the search text.
- An entry matches only if it starts with the search text, letter case included. `echo ap`
  doesn't find `ECHO apple` or `print (echo ap)`.
- With the cursor anywhere but at the end of the line, <kbd>↑</kbd> ignores the text and steps
  through the whole history, as on an empty line. Press <kbd>End</kbd> first to search.
- A multi-line command never searches. <kbd>↑</kbd> and <kbd>↓</kbd> move between its lines,
  and from the first line <kbd>↑</kbd> steps through the whole history.
- In Vi and Helix normal mode, <kbd>k</kbd> and <kbd>j</kbd> search the same way. After
  <kbd>Esc</kbd> the cursor rests on the last character, which counts as the end of the line.
- With `history.isolation` turned on, the search sees what plain <kbd>↑</kbd> sees, which is
  this session's commands and the ones saved before the session started.

To find a command by text in the middle of the line, use <kbd>Ctrl</kbd>+<kbd>Q</kbd> or the
[history menu](#history-menu) instead.

### Reverse history search

<kbd>Ctrl</kbd>+<kbd>Q</kbd> (the `SearchHistory` event) starts an incremental search backwards
through the history. The prompt changes to `(reverse-search: )`, and as you type, the search text
appears after the colon and the newest command that contains it appears after the closing
parenthesis:

```text
(reverse-search: ba)echo bat
```

The text can match anywhere in the command, and the search starts empty, whatever was on the line
before. In the search:

- <kbd>↑</kbd> goes to the next older match, and <kbd>↓</kbd> back to a newer one.
- <kbd>Backspace</kbd> removes the last character of the search text.
- <kbd>Enter</kbd> puts the match on the line without running it, so you can edit it first.
- <kbd>Esc</kbd> ends the search and gives you back the line you were typing.
- <kbd>Ctrl</kbd>+<kbd>C</kbd> ends the search and abandons the line you were typing, so the next
  prompt starts empty.

When nothing matches, the prompt says so, as in `(failing reverse-search: echqq)`.

## Hints

As you type, Reedline shows a hint in a dimmed color (`$env.config.color_config.hints`) after the
cursor. By default the hint is the most recent matching command from your history. Press
<kbd>→</kbd> or <kbd>End</kbd> to accept the whole hint, or <kbd>Ctrl</kbd>+<kbd>→</kbd> to accept
one word of it. Set `$env.config.show_hints = false` to turn hints off.

The hint is a command from the history that starts with everything typed so far, letter case
included. With the `sqlite` history format, Nushell prefers the most recent such command that you
ran in the current directory, and falls back to the most recent one from anywhere. The `plaintext`
format doesn't record directories, so there the hint is always the most recent match.

`show_hints` defaults to `true`, but hints also need color. While
`$env.config.use_ansi_coloring` is `false`, or `auto` decides against color, no hint shows, whatever
`show_hints` says.

To compute hints yourself, set `$env.config.hinter.closure` to a closure. It receives a record with
the current `line`, the cursor position `pos` and the working directory `cwd`, and returns the text
to show after the cursor, or `null` for no hint. It can also return a record
`{hint: string, next_token: string}`, where `next_token` is the part that
<kbd>Ctrl</kbd>+<kbd>→</kbd> accepts. The closure runs on every keystroke, so keep it fast.

```nu
let snippets = ["git status", "git switch -c", "cargo build --release"]
$env.config.hinter.closure = {|ctx|
    let match = $snippets | where $it starts-with $ctx.line | first
    if ($ctx.line | is-empty) or $match == null {
        null
    } else {
        $match | str substring ($ctx.line | str length)..
    }
}
```

Set `$env.config.hinter.closure = null` to go back to the built-in history hints.

When the closure fails, or returns anything other than a string, a record with a `hint` string, or
`null`, no hint shows and nothing is printed. To see why, log the errors to a file, as in
`nu --log-level error --log-target file --log-file hints.log`. A closure that returns `42` logs
`external_hinter: unsupported closure return type int` there on every keystroke.

## Status Line

Below the line you're editing, Nushell draws a status line, one row that tells you what the parser
makes of the line so far. Nushell already parses the line on every keystroke to highlight it, and
the status line reuses that parse. Running the line erases the status line, and it stays hidden
while you search the history.

```text
~> "a,b" | split row ","
  split row {flags} <separator>   → list<string>   = [a, b]
```

The status line has up to three parts, left to right:

- **Signature.** The signature of the command under the cursor, with the parameter you're typing
  in bold and underlined. Required parameters are in `<angle brackets>`, optional ones in
  `(parentheses)`, and a rest parameter starts with `...`. `{flags}` stands for all of the
  command's flags, and it's the part underlined while the cursor is on a flag or its value.
- **Type.** `→` and the type that the pipeline at the cursor outputs, as far as the parser can
  tell. Inside a closure, block or subexpression, it's the type of the pipeline inside it. The
  status line leaves out `any` and `nothing`.
- **Preview.** `=` and the value of the line, when every command in it is a
  [const command](./how_nushell_code_gets_run.md#parse-time-constant-evaluation). A line such as
  `ls | length` gets no preview, because `ls` can't run at parse time. If a preview takes longer
  than 25 milliseconds, Nushell stops computing it and leaves it out.

| Line, with the cursor at the end             | Status line                                      |
| -------------------------------------------- | ------------------------------------------------ |
| `"hello" \| str length`                      | `str length {flags} ...(rest)   → int   = 5`     |
| `[1 2 3] \| math sum`                        | `math sum {flags} ...(columns)   → number   = 6` |
| `ls \| update name {\|r\| [1 2] \| math sum` | `math sum {flags} ...(columns)   → number`       |
| `ls \| `                                     | `→ table`                                        |
| `1 + 2`                                      | `→ int   = 3`                                    |

In `str substring 1..2`, the cursor is on the range, so the status line underlines `<range>` in
`str substring {flags} <range> ...(rest)`.

The status line never takes more than one row. When it's wider than the terminal, it's cut off with
`…`. A preview drops any ANSI escapes the value contains, so `(ansi red) + "hi"` previews as a plain
`hi`. Line breaks and tabs show as `\n`, `\r` and `\t`, and other control characters as escapes
such as `\u{7f}`. `"a\tb" + "c"` previews as `a\tbc`.

When the line has a parse or type error, the status line shows the first one instead, in red:

```text
~> let x: int = "a"
  ✗ Type mismatch: expected int, found string
```

An error shows up only once it's no longer about the text you're still typing:

- `let x: int = "a"` shows no error until you type a space after `"a"`.
- `str substring ` doesn't report its missing range while the cursor waits for it. Move on to
  `str substring | str length` and the status line shows
  `✗ Missing required positional argument: missing range`.
- An unfinished line, such as one with an open `{`, shows no error.
- A line that `use`s a module that isn't loaded yet shows no error and no preview. The parse behind
  the highlighting doesn't load the module, so the names it imports would look unknown.

Each part can be turned off on its own. All of these default to `true`, and a change takes effect
at the next prompt:

```nu
$env.config.status_line.enable = true    # false hides the status line entirely
$env.config.status_line.errors = true    # the first parse or type error
$env.config.status_line.signature = true # the signature of the command under the cursor
$env.config.status_line.type = true      # the type the pipeline outputs
$env.config.status_line.preview = true   # the value of a line of const commands
```

The status line is drawn in `$env.config.color_config.status_line`, or in the `hints` style when
that key isn't set. Errors use `$env.config.color_config.status_line_error`, which is `red` by
default. With `$env.config.use_ansi_coloring = false`, the status line is plain text. See
[Coloring and Theming](./coloring_and_theming.md) for the style syntax.

```nu
$env.config.color_config.status_line = 'cyan'
$env.config.color_config.status_line_error = { fg: 'yellow' attr: b }
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
$env.config.keybindings ++= [{
    name: completion_menu_ctrl_t
    modifier: control
    keycode: char_t
    mode: emacs
    event: { send: menu name: completion_menu }
}]
```

After loading this new `config.nu`, your new keybinding (`Ctrl + t`) will open
the completion command.

Each keybinding has the next elements:

- name: A label for your keybinding. It is optional, and Nushell doesn't use it to match
  entries.
- modifier: `none`, or one or more of `control`, `shift`, `alt`, `super`, `hyper` and `meta`
  joined with `_`, such as `control_alt`. The names can come in any order and any letter case,
  so `Shift_Control` works too, and so does a set of three or more, such as
  `control_alt_super`.
- keycode: The key without its modifiers. It is one of `backspace`, `enter`, `space`, `tab`,
  `backtab` (<kbd>Shift</kbd>+<kbd>Tab</kbd>), `esc` (or `escape`), `up`, `down`, `left`,
  `right`, `home`, `end`, `pageup`, `pagedown`, `delete`, `insert`, `null`, `f1` to `f35`,
  `char_` followed by one character, such as `char_t` or `char_|`, or `char_u` followed by a
  hexadecimal Unicode code point, such as `char_u00e9` for `é`. Nushell lowercases the keycode
  before reading it, so `char_A` binds the <kbd>a</kbd> key. To bind a capital letter, use
  `modifier: shift` with `keycode: char_a`.
- mode: emacs, vi_insert, vi_normal, vi_visual, helix_insert, helix_normal or
  helix_select (a single string or a list. e.g. [`vi_insert` `vi_normal`]). Lists can be
  nested, which helps when you build the list from variables. The names can also be written
  as `ViNormal`, `HelixSelect` and so on, in any letter case. An entry with an empty list binds
  nothing, and Nushell doesn't read its event.
- event: The type of event that is going to be sent by the keybinding. The
  options are:
  - send
  - edit
  - until

Assigning a list to `$env.config.keybindings` replaces the whole list, including the default
bindings that open the menus (such as <kbd>Tab</kbd> for the completion menu), so add your
bindings with `++=` as in the example above. When two entries bind the same mode, modifier and
keycode, the later one wins. `$env.config.keybindings = []` removes every binding in the list, but
Reedline's built-in bindings for moving and editing stay.

Nushell checks every entry's mode, modifier and keycode when you assign the list. If one of them
is wrong, such as `modifier: ctrl`, Nushell reports the error
(`expected 'control', 'shift', 'alt', 'super', 'hyper', 'meta', or 'none', but got 'ctrl'`) and
rejects the whole list, so the previous one stays in effect. The `event` is read later, when the
next prompt is built. A bad event, such as `{ send: clearscren }`, is stored with the list, and
Nushell prints its error before every prompt and keeps the keybindings it had until you fix it.

::: tip
All of the available modifiers, keycodes and events can be found with
the command [`keybindings list`](/commands/docs/keybindings_list.md). Its flags list one kind at a
time: `--modifiers` (`-m`), `--keycodes` (`-k`), `--modes` (`-o`), `--events` (`-e`) and
`--edits` (`-d`). Without flags it lists them all, as a table with a `type` column (`modifiers`,
`keycodes`, `modes`, `events` or `edits`) and a `name` column. The modifier list shows only the
common combinations, and the keycode list writes `Char_<letter>` and `F<number>` for whole ranges.

[`keybindings`](/commands/docs/keybindings.md) on its own only prints its help, which lists its
three subcommands: `keybindings default`, `keybindings list` and
[`keybindings listen`](#troubleshooting-keybinding-problems).
:::

::: tip
The keybindings added to `vi_insert` mode will be available when the
line editor is in insert mode (when you can write text), and the keybindings
marked with `vi_normal` mode will be available when in normal (when the cursor
moves using h, j, k or l)
:::

The event section of the keybinding entry is where the actions to be performed
are defined. In this field you can use either a record or a list of records.
For example, this keybinding sends a single event, which opens the current
command line in your editor when you press <kbd>Alt</kbd>+<kbd>E</kbd>

```nu
$env.config.keybindings ++= [{
    name: open_editor_alt_e
    modifier: alt
    keycode: char_e
    mode: emacs
    event: { send: OpenEditor }
}]
```

and this one sends a list of events, which moves the cursor to the start of the
line and inserts `sudo ` there when you press <kbd>Alt</kbd>+<kbd>S</kbd>

```nu
$env.config.keybindings ++= [{
    name: prepend_sudo_alt_s
    modifier: alt
    keycode: char_s
    mode: emacs
    event: [
        { edit: MoveToLineStart }
        { edit: InsertString, value: "sudo " }
    ]
}]
```

The first keybinding example shown in this page follows the first case; a
single event is sent to the engine.

The next keybinding is an example of a series of events sent to the engine. It
first clears the prompt, inserts a string and then enters that value

```nu
$env.config.keybindings ++= [{
    name: change_dir_with_fzf
    modifier: CONTROL
    keycode: Char_t
    mode: emacs
    event: [
        { edit: Clear }
        {
          edit: InsertString,
          value: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
        }
        { send: Enter }
    ]
}]
```

One disadvantage of the previous keybinding is the fact that the inserted text
will be processed by the validator and saved in the history, making the
keybinding a bit slow and populating the command history with the same command.
For that reason there is the `executehostcommand` type of event. The next
example does the same as the previous one in a simpler way, sending a single
event to the engine

```nu
$env.config.keybindings ++= [{
    name: change_dir_with_fzf_host_command
    modifier: CONTROL
    keycode: Char_y
    mode: emacs
    event: {
        send: executehostcommand,
        cmd: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
    }
}]
```

Before we continue you must have noticed that the syntax changes for edits and
sends, and for that reason it is important to explain them a bit more. A `send`
is all the `Reedline` events that can be processed by the engine and an `edit`
are all the `EditCommands` that can be processed by the engine.

### Send Type

To find all the available options for `send` you can use

```nu
keybindings list --events
```

And the syntax for `send` events is `event: { send: <NAME OF EVENT FROM LIST> }`.
[Events](#events) at the end of this page says what each one does.

::: tip
You can write the name of the events with capital letters. The
keybinding parser is case insensitive
:::

There are three exceptions to this rule: `Menu`, `ExecuteHostCommand` and `SwitchMode`.
Those events require an extra field to be complete. The `Menu` needs the
name of the menu to be activated (such as completion_menu or history_menu)

```nu
$env.config.keybindings ++= [{
    name: history_menu_alt_h
    modifier: alt
    keycode: char_h
    mode: emacs
    event: {
        send: menu
        name: history_menu
    }
}]
```

and the `ExecuteHostCommand` requires a valid command that will be sent to the
engine

```nu
$env.config.keybindings ++= [{
    name: go_home_alt_g
    modifier: alt
    keycode: char_g
    mode: emacs
    event: {
        send: executehostcommand
        cmd: "cd ~"
    }
}]
```

The command runs without touching the line you were typing, and the line is still there
afterwards. The command isn't saved in the history. It can read and change the line with
[`commandline`](/commands/docs/commandline.md) and its subcommands, which
[Changing the line from Nushell code](#changing-the-line-from-nushell-code) explains.

and the `SwitchMode` event needs the `mode` to switch to. It accepts the same
mode names as the keybinding's `mode` field (such as `vi_normal` or `helix_normal`).
This keybinding leaves Vi insert mode with <kbd>Ctrl</kbd>+<kbd>G</kbd>:

```nu
$env.config.keybindings ++= [{
    name: vi_normal_ctrl_g
    modifier: control
    keycode: char_g
    mode: vi_insert
    event: {
        send: switchmode
        mode: vi_normal
    }
}]
```

A `SwitchMode` event can only switch between the modes of the current
`edit_mode`, so a switch to `vi_normal` does nothing in Helix mode. A switch to
the mode that is already active also does nothing. The older `ViChangeMode`
(with `mode: normal`, `insert` or `visual`) and `HelixChangeMode` (with
`mode: normal`, `insert` or `select`) events are still accepted and work like
`SwitchMode`.

It is worth mentioning that the events list also shows `event: { edit: <edit> }`,
`event: { send: list<event> }` and `event: { until: list<event> }`. These are not
events that you send by name. They show the other forms that the `event` field
can take: an `edit` record (the `edit` type that was mentioned), a list of events
that are all sent one after another, and the `until` type mentioned later.

### Edit Type

The `edit` type sends one of Reedline's edit commands, which change the text
of the command line or move the cursor. To list the available options you can
use the next command

```nu
keybindings list --edits
```

The usual syntax for an `edit` is `event: { edit: <NAME OF EDIT FROM LIST> }`.
[Edit commands](#edit-commands) at the end of this page describes each one and its fields.
For example, this keybinding inserts a newline when you press <kbd>Alt</kbd>+<kbd>N</kbd>,
which is useful if your terminal intercepts <kbd>Alt</kbd>+<kbd>Enter</kbd> and
<kbd>Shift</kbd>+<kbd>Enter</kbd>

```nu
$env.config.keybindings ++= [{
    name: insert_newline_alt_n
    modifier: alt
    keycode: char_n
    mode: [emacs vi_insert helix_insert]
    event: { edit: insertnewline }
}]
```

Some edits in the list are followed by extra fields, such as
`InsertString value: <string>`. Those edits need the extra fields to be fully
defined. For example, if we would like to insert a string at the cursor, then
you will have to use

```nu
$env.config.keybindings ++= [{
    name: insert_to_json_alt_j
    modifier: alt
    keycode: char_j
    mode: emacs
    event: {
        edit: insertstring
        value: " | to json"
    }
}]
```

or say you want to move right until the next `|`

```nu
$env.config.keybindings ++= [{
    name: move_to_pipe_alt_p
    modifier: alt
    keycode: char_p
    mode: emacs
    event: {
        edit: moverightuntil
        value: "|"
    }
}]
```

As you can see, these two types will allow you to construct any type of
keybinding that you require

Configurations written for older versions of Nushell may use the pair edits
`CutInsidePair`, `CopyInsidePair`, `CutAroundPair` and `CopyAroundPair`. Each
takes a `left` and a `right` field of one character. Reedline no longer has these
edits and `keybindings list` doesn't show them, but Nushell still accepts them
and turns each one into a text object edit on the pair you give. `CutInsidePair`
and `CutAroundPair` become `CutTextObject`, the two copy edits become
`CopyTextObject`, and `Inside` and `Around` become `scope: inner` and
`scope: around`. These two events do the same thing. Each cuts the text between
the parentheses around the cursor, or inside the next pair of parentheses when
the cursor isn't between any:

```nu
event: { edit: CutInsidePair, left: "(", right: ")" }
event: { edit: CutTextObject, scope: inner, object_type: { left: "(", right: ")" } }
```

A missing `left` or `right`, or a value longer than one character, makes a bad
event, which Nushell handles as described under [Keybindings](#keybindings).

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
$env.config.keybindings ++= [{
    name: completion_menu_ctrl_t
    modifier: control
    keycode: char_t
    mode: emacs
    event: {
        until: [
          { send: menu name: completion_menu }
          { send: menunext }
        ]
    }
}]
```

The previous keybinding will first try to open a completion menu. If the menu
is not active, it will activate it and send a success signal. If the keybinding
is pressed again, since there is an active menu, then the next event it will
send is MenuNext, which means that it will move the selector to the next
element in the menu.

As you can see the `until` keyword allows us to define two events for the same
keybinding. An event only lets `until` move on to the next one when it had
nothing to do. The `menu` event has nothing to do when a menu is already open,
`menunext` when no menu is open, and `{ edit: moveleft }` when the cursor is at
the start of the line. Most other events always succeed, so the `until` event
stops as soon as it reaches them. The [reference](#event-and-edit-reference) at
the end of this page lists when each event and edit has nothing to do.

For example, the next keybinding sends a `down` whenever there is a line or a
newer history entry to move to, and only opens the completion menu when there
isn't

```nu
$env.config.keybindings ++= [{
    name: completion_menu_ctrl_t
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
}]
```

The `SwitchMode` event makes one keybinding work in more than one edit mode. The
next keybinding uses <kbd>Ctrl</kbd>+<kbd>G</kbd> to leave insert mode in both Vi
and Helix mode: in Vi mode the first event switches to `vi_normal`, and in Helix
mode the first event has nothing to do, so the second one switches to `helix_normal`

```nu
$env.config.keybindings ++= [{
    name: leave_insert_mode
    modifier: control
    keycode: char_g
    mode: [vi_insert helix_insert]
    event: {
        until: [
            { send: SwitchMode, mode: vi_normal }
            { send: SwitchMode, mode: helix_normal }
        ]
    }
}]
```

### Changing the line from Nushell code

[`commandline`](/commands/docs/commandline.md) returns the text in the line editor's buffer as a
string. Three subcommands read or change the buffer and the cursor:

- [`commandline get-cursor`](/commands/docs/commandline_get-cursor.md) returns the cursor
  position, `0` before the first character and the length of the line when the cursor is at the
  end. It counts characters as you see them, the way `str length --grapheme-clusters` does, so
  `é` or an emoji counts as one.
- [`commandline set-cursor`](/commands/docs/commandline_set-cursor.md) moves the cursor to a
  position counted the same way. `0` or a negative position goes to the start, and a position
  past the end goes to the end. `--end` (`-e`) also goes to the end. Given both a position and
  `--end`, it uses the position, and given neither, it fails with
  `Required a positional argument or a flag`.
- [`commandline edit`](/commands/docs/commandline_edit.md) changes the text. `--replace` (`-r`),
  the default, replaces the whole line and puts the cursor at its end. `--insert` (`-i`) inserts
  the text at the cursor and moves the cursor past it. `--append` (`-a`) adds the text at the end
  and leaves the cursor where it was. Only one of the three applies. `--append` beats `--insert`,
  which beats `--replace`. `--accept` (`-A`) works with any of them and runs the line as soon as
  the change is made, as if you had pressed <kbd>Enter</kbd>.

These commands are mostly used from a keybinding with
[`executehostcommand`](#send-type). This one types `()` at the cursor and puts the cursor between
the parentheses, ready for a subexpression:

```nu
$env.config.keybindings ++= [{
    name: insert_parens
    modifier: alt
    keycode: char_p
    mode: [emacs vi_insert]
    event: {
        send: executehostcommand
        cmd: 'commandline edit --insert "()"; commandline set-cursor ((commandline get-cursor) - 1)'
    }
}]
```

Where the command runs decides which line it sees and when its changes show up:

- In an `executehostcommand` keybinding, `commandline` returns the line you are editing, and the
  changes apply to that line when the command finishes.
- Typed at the prompt, the command runs after its own line was submitted, so `commandline`
  returns an empty string. `commandline edit` fills in the line of the next prompt instead.
  `commandline edit 'git status'` leaves `git status` there to edit, and with `--accept` it runs
  right away.
- In a `pre_prompt` or `env_change` [hook](./hooks.md), `commandline edit` fills in the line of
  the prompt that is about to appear.
- In a `pre_execution` hook, `commandline` returns the line about to run, but a change made with
  `commandline edit` is thrown away. The line has already been read.
- In a script or with `nu -c`, there is no line editor. `commandline` returns an empty string
  until `commandline edit` stores some text, and nothing ever runs it.

### Removing a Default Keybinding

If you want to remove a certain default keybinding without replacing it with a different action, you can set `event: null`.

e.g. to disable screen clearing with `Ctrl + l` for all edit modes

```nu
$env.config.keybindings ++= [{
    modifier: control
    keycode: char_l
    mode: [emacs, vi_normal, vi_insert, vi_visual, helix_normal, helix_select, helix_insert]
    event: null
}]
```

`event: null` takes the key out of the keybinding table, and the key then does whatever the edit
mode does with a key that has no binding. A plain character is typed into the line, and in Vi or
Helix normal mode a letter goes back to its built-in command. To make a key do nothing at all,
bind it to the `None` event instead. Vi's <kbd>x</kbd> isn't in the table, so `event: null` can't
turn it off, but this can:

```nu
$env.config.keybindings ++= [{
    modifier: none
    keycode: char_x
    mode: vi_normal
    event: { send: none }
}]
```

### Troubleshooting Keybinding Problems

Your terminal environment may not always propagate your key combinations on to Nushell the way you expect it to. You can use the command [`keybindings listen`](/commands/docs/keybindings_listen.md) to determine if certain keypresses are actually received by Nushell, and how.

After you run it, each key you press prints one line describing what Nushell received, until you
press <kbd>Esc</kbd>:

```text
> keybindings listen
Type any key combination to see key details. Press ESC to abort.
char: r, code: 0x000072, modifier: KeyModifiers(CONTROL), flags: 0b000010, kind: Press, state: KeyEventState(0x0)
code: Up, modifier: KeyModifiers(0x0), flags: 0b000000, kind: Press, state: KeyEventState(0x0)
```

A character key shows the `char` and its `code` point. Other keys show the `code` name, such as
`Up` or `F(5)`. `modifier` and `flags` show the modifiers held down. `kind` and `state` add detail
that most terminals leave at `Press` and `KeyEventState(0x0)`. Input that isn't a key, such as a
terminal resize, prints as an `event: ...` line instead.
With `$env.config.use_kitty_protocol` on, it first prints a warning if the terminal doesn't support
the protocol. The command's own help calls it a debugging tool and suggests
[`input listen --types [key]`](/commands/docs/input_listen.md) instead, which returns a record you
can work with; see [Acting on keypresses using `input listen`](/cookbook/input_listen_keys.md).

## Menus

Thanks to Reedline, Nushell has menus that can help you with your day to day
shell scripting. Next we present the default menus that are available
when using Nushell

Menus are configured in `$env.config.menus`. Assigning a list to it replaces every
menu, including the defaults, so `$env.config.menus = []` removes them all and
<kbd>Tab</kbd> no longer opens a completion menu. To add a menu or change a default
one, append it with `++=`. When two menus share a `name`, the later one replaces the
earlier one, so an appended `completion_menu` takes the place of the default
completion menu.

Every menu needs a `name`, a `marker` (the text shown in place of the prompt
indicator while the menu is open), a `type` record with a `layout`, a `style`
record (`{}` is enough), and either `input_mode` or the older
`only_buffer_difference`, both described below. `output_mode` and `source` are
optional. Nushell checks each menu's `layout`, `input_mode` and `output_mode` when
you assign the list. If one of them is wrong, or a required field is missing,
Nushell reports it and rejects the whole list, keeping the previous menus. The
`layout` has to be in lowercase. The other fields of `type`, such as `columns`,
are read when the next prompt is built. A wrong one there, such as
`columns: "four"`, prints its error before every prompt until you fix it.

Each menu sets `input_mode`, which controls the text that the menu searches:

- `diff` - only the text typed after the menu was activated
- `cursor_prefix` - the line from its start up to the cursor
- `full_buffer` - the whole line, including any text after the cursor

It can also set `output_mode`, which controls what an accepted suggestion replaces:

- `suggested_span` - the part of the line that the suggestion names (the default)
- `full_buffer` - the whole line
- `extend_to_end` - from the start of the suggestion's span to the end of the line

Older configurations use `only_buffer_difference` instead of `input_mode`. It still
works: `true` is the same as `input_mode: diff`, and `false` is the same as
`input_mode: cursor_prefix`.

By default, erasing text while a menu is open can close the menu. With
`$env.config.completions.persistent_menus` at its default, `false`:

- <kbd>Backspace</kbd>, <kbd>Ctrl</kbd>+<kbd>Backspace</kbd> and <kbd>Home</kbd> close
  a menu with the `columnar` or `ide` layout, such as the completion menu, as long as
  `$env.config.completions.quick` is on (the default). With `quick` off, the menu stays
  open and updates its suggestions.
- Any edit that empties the line closes any menu, including the history and help menus.

Set `$env.config.completions.persistent_menus = true` to keep menus open while you edit.
The menu then updates its suggestions instead, and only closes when you accept a
suggestion or press <kbd>Esc</kbd> or <kbd>Ctrl</kbd>+<kbd>C</kbd>.

Typing past the last match doesn't close an open completion menu. It shows
`NO RECORDS FOUND` and fills again as soon as the text matches something.

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
$env.config.menus ++= [{
    name: help_menu
    input_mode: diff             # Search is done on the text written after activating the menu
    marker: "? "                 # Indicator that appears with the menu is active
    type: {
        layout: description      # Type of menu
        columns: 4               # Number of columns where the options are displayed
        col_width: 20            # Optional value. If missing all the screen width is used to calculate column width
        col_padding: 2           # Padding between columns
        selection_rows: 4        # Number of rows allowed to display found options
        description_rows: 20     # Number of rows allowed to display command description
    }
    style: {
        text: green                   # Text style
        selected_text: green_reverse  # Text style for selected option
        description_text: yellow      # Text style for description
    }
}]
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
$env.config.menus ++= [{
    name: completion_menu
    input_mode: cursor_prefix       # Search is done on the text from the start of the line up to the cursor
    marker: "| "                    # Indicator that appears with the menu is active
    type: {
        layout: columnar            # Type of menu
        columns: 4                  # Number of columns where the options are displayed
        col_width: 20               # Optional value. If missing all the screen width is used to calculate column width
        col_padding: 2              # Padding between columns
        tab_traversal: "horizontal" # Direction in which pressing <Tab> will cycle through options, "horizontal" (the default) or "vertical"
    }
    style: {
        text: green                   # Text style
        selected_text: green_reverse  # Text style for selected option
        description_text: yellow      # Text style for description
        match_text: { attr: u }       # Matched style
        selected_match_text: { attr: ur }    } # Selected matched style
}]
```

By modifying these parameters you can customize the layout of your menu to your
liking.

The suggestions depend on what is under the cursor. At the start of a command the menu offers
command names, after a `-` the command's flags, after a `$` the variables in scope, and for most
arguments the names of files and directories. A [custom completer](./custom_completions.md) can
replace the suggestions for a command's arguments. For an external command,
[`generate completions`](/commands/docs/generate_completions.md) writes `extern` definitions that
give its flags and their values to the menu, built from the command's fish, zsh or carapace
completions, its man page, or its `--help` text (see
[Generating completions for an external command](/cookbook/system.md#generating-completions-for-an-external-command)).
The IDE completion menu below shows the same
suggestions in a different layout. The sections that follow cover built-in completions that are
easy to miss.

To see what <kbd>Tab</kbd> would offer for a line, pipe the line to
[`commandline complete`](/commands/docs/commandline_complete.md), as the examples below do.

#### Command names, `^` and `%`

Command name completion lists Nushell's own commands together with the executables in your
`PATH`. When an executable has the same name as a Nushell command, the menu lists it with a `^`
in front, and lists the Nushell command a second time with a `%` in front, so you can pick the
one you mean. On a system with a `sort` executable, typing `sort` at the prompt offers:

```nu
"sort" | commandline complete
# => ╭───┬─────────╮
# => │ 0 │ sort    │
# => │ 1 │ sort-by │
# => │ 2 │ %sort   │
# => │ 3 │ ^sort   │
# => ╰───┴─────────╯
```

Type the sigil yourself to narrow the list. After `^`, the menu offers only executables from
`PATH`, even when `$env.config.completions.external.enable` is `false`. After `%`, it offers only
built-in commands. That includes a built-in hidden by a custom command or alias of the same name,
or by [`hide`](/commands/docs/hide.md), and leaves out custom commands, aliases and externs:

```nu
"%sort" | commandline complete
# => ╭───┬─────────╮
# => │ 0 │ sort    │
# => │ 1 │ sort-by │
# => ╰───┴─────────╯
```

Accepting a suggestion keeps the sigil and replaces only the name after it, and with the cursor
in front of the sigil, <kbd>Tab</kbd> offers nothing. See
[Running System (External) Commands](./running_externals.md) for what `^` and `%` do when the
command runs.

The word right after `sudo` or `doas`, written with or without `^`, completes from the list of
command names, since it names the command to run. Pick the plain name of an executable there,
because `sudo` can't run Nushell commands. Only that first word is special. With options in between, as in `sudo -u root sor`, and for the
arguments of the command that follows, you get the usual completion for an external command,
which is your [external completer](./custom_completions.md#external-completions) if you have one
and file names otherwise. The same happens when no command name matches, and when `sudo` or `doas`
is a custom command that you defined. An alias that only names the program, such as
`alias sudo = ^sudo`, keeps the command name completion. One that adds options, such as
`alias doas = ^doas -n`, loses it, because the options fill the first-word slot.

Without a sigil, the executables are left out when `$env.config.completions.external.enable` is
`false`, and `$env.config.completions.external.max_results` (100 by default) caps how many of them
the menu adds. A command whose name has several words completes one word at a time, so after
`str ` the menu lists the subcommands of `str`:

```nu
"str c" | commandline complete
# => ╭───┬────────────────╮
# => │ 0 │ str camel-case │
# => │ 1 │ str capitalize │
# => │ 2 │ str contains   │
# => ╰───┴────────────────╯
```

#### Flags

After a `-` in a command's arguments, the menu lists the command's flags, the long form and the
short form of each, with each flag's description:

```nu
"ls -" | commandline complete | str join " "
# => --all --directory --du --full-paths --help --long --mime-type --short-names --threads -a -D -d -f -h -l -m -s -t
```

When the command has a [command-wide completer](./custom_completions.md#command-wide-completers),
its suggestions are added to the flags, so an external completer can offer flags that a wrapper
command doesn't declare. A suggestion that repeats a declared flag appears once.

#### Cell paths

After a variable and a dot, the menu lists the keys of a record or the columns of a table, with
the type of each value as the description:

```nu
let user = {name: "Ada", "home dir": "/home/ada", langs: [nu rust], v2: true}
"$user." | commandline complete --detailed | select value description
# => ╭───┬────────────┬──────────────╮
# => │ # │   value    │ description  │
# => ├───┼────────────┼──────────────┤
# => │ 0 │ "home dir" │ string       │
# => │ 1 │ langs      │ list<string> │
# => │ 2 │ name       │ string       │
# => │ 3 │ "v2"       │ bool         │
# => ╰───┴────────────┴──────────────╯
```

The menu wraps a key in double quotes when it contains anything other than ASCII letters, `_`
and `-`, which is why `"v2"` is quoted along with `"home dir"`. Each further dot goes a level
deeper, so `$env.config.history.` lists the history settings and `$table.0.` lists the columns
of a table's first row. For a list of records, the menu offers every column that appears in any of
them. A version from [`into semver`](/commands/docs/into_semver.md) completes to `major`,
`minor`, `patch`, `pre`, `build` and `prefix`, and a matrix from
[`into matrix`](/commands/docs/into_matrix.md) to `shape`, `ndim` and `size`.

The menu reads the actual value when it has one: a variable set by an earlier command, a
constant, `$env`, `$nu`, or a literal such as `{a: 1, b: 2}.`. Otherwise it falls back on the
declared type. Inside a command body, a parameter typed `record<name: string, age: int>`
completes to `age` and `name`, and `(sys host).` completes the fields that
[`sys host`](/commands/docs/sys_host.md) declares for its output. Completion never runs the
command, so `(ls).` offers nothing, because `ls` only declares that it returns a table.

#### Operators

After a value and a space, the menu offers the operators that work with the value's type, each
with a short description. An integer gets the arithmetic, comparison and bitwise operators, and a
float gets the same without the bitwise ones. A string gets the comparisons, the regex operators
`=~` and `!~`, which also appear as `like` and `not-like`, then `starts-with`, `ends-with`, `has`
and their `not-` forms, and `++`. A date gets only comparisons, among them `older-than` and
`newer-than`:

```nu
"(date now) " | commandline complete
# => ╭───┬────────────╮
# => │ 0 │ !=         │
# => │ 1 │ <          │
# => │ 2 │ <=         │
# => │ 3 │ ==         │
# => │ 4 │ >          │
# => │ 5 │ >=         │
# => │ 6 │ in         │
# => │ 7 │ newer-than │
# => │ 8 │ not-in     │
# => │ 9 │ older-than │
# => ╰───┴────────────╯
```

A list gets `==`, `!=`, `in`, `not-in`, `has`, `not-has` and `++`, a record or a range gets the
same without `++`, and a boolean gets `and`, `or` and `xor` plus `==`, `!=`, `in` and `not-in`.
When the type isn't known, as for a column inside [`where`](/commands/docs/where.md)
(`ls | where size `), the menu offers every operator except `like` and `not-like`. Typing the start of an operator narrows the
list, so `1 b` offers the five `bit-` operators.

A mutable variable, or a variable under `$env`, also gets the assignment operators that fit its
type: `=`, `+=`, `-=`, `*=` and `/=` for a number, `=` and `++=` for a string or a list, and
only `=` for a boolean, date, record or range.

#### Attributes

Typing `@` at the start of a line and pressing <kbd>Tab</kbd> lists the attributes you can put
above a definition:

```nu
"@" | commandline complete
# => ╭───┬───────────────────╮
# => │ 0 │ category          │
# => │ 1 │ complete          │
# => │ 2 │ complete external │
# => │ 3 │ deprecated        │
# => │ 4 │ example           │
# => │ 5 │ interactive       │
# => │ 6 │ search-terms      │
# => │ 7 │ structured        │
# => ╰───┴───────────────────╯
```

These are all the commands in scope whose names start with `attr `, shown without that prefix
and with their descriptions. Attributes you import show up too, such as `@test` and
`@before-each` after `use std/testing *`, and so do ones you define yourself with
`alias "attr my-tag" = echo` (see [Defining your own attributes](./custom_commands.md#defining-your-own-attributes)). After the attributes, the menu offers the definitions an
attribute can be attached to, which are `def`, `export def`, `extern` and `export extern`.

#### Modules and their exports

The module argument of [`use`](/commands/docs/use.md), [`export use`](/commands/docs/export_use.md)
and [`overlay use`](/commands/docs/overlay_use.md) completes from three places:

- the names of modules already loaded in this session, such as one created with `module` on an
  earlier line
- `std` and `std-rfc`, and after `std/` or `std-rfc/` the submodules that are built into Nushell
- `.nu` files and directories in the current directory and in the directories listed in
  [`$NU_LIB_DIRS`](./configuration.md#nu-lib-dirs-constant) and `$env.NU_LIB_DIRS`. Other files
  are left out.

```nu
"use std/i" | commandline complete
# => ╭───┬───────────╮
# => │ 0 │ std/input │
# => │ 1 │ std/iter  │
# => ╰───┴───────────╯
```

After the module, `use` and `export use` complete what it exports: commands, aliases, submodules
and constants, with names that contain spaces wrapped in quotes. This works for a module file
that isn't loaded yet, and inside a bracketed import list:

```nu
"use std/log [log-" | commandline complete
# => ╭───┬──────────────────╮
# => │ 0 │ log-ansi         │
# => │ 1 │ log-level        │
# => │ 2 │ log-prefix       │
# => │ 3 │ log-short-prefix │
# => ╰───┴──────────────────╯
```

`overlay use` doesn't complete a module's members. [`source-env`](/commands/docs/source-env.md)
offers loaded modules, `.nu` files and directories like `use` does, but not `std`, `std-rfc` or
their submodules, and
[`source`](/commands/docs/source.md) offers every file, as for any other path argument.

### Ide Completion Menu

The ide_completion_menu works much like the completion_menu but has an ide look and feel about it.

```nu
{
  name: ide_completion_menu
  input_mode: cursor_prefix
  marker: "| "
  type: {
    layout: ide
    min_completion_width: 0,
    max_completion_width: 50,
    max_completion_height: 10, # will be limited by the available lines in the terminal
    padding: 0,
    border: true,
    cursor_offset: 0,
    description_mode: "prefer_right"
    min_description_width: 15
    max_description_width: 50
    max_description_height: 10
    description_offset: 1
    # If true, the cursor pos will be corrected, so the suggestions match up with the typed text
    #
    # C:\> str
    #      str join
    #      str trim
    #      str split
    correct_cursor_pos: false
  }
  style: {
    text: green
    selected_text: { attr: r }
    description_text: yellow
    match_text: { attr: u }
    selected_match_text: { attr: ur }
  }
}
```

The IDE layout draws the suggestions in a box under the cursor, and the selected suggestion's
description in a second box beside it. Widths and heights are in terminal columns and rows and
include the border:

- `min_completion_width` and `max_completion_width` limit the width of the suggestion box.
  Suggestions longer than the maximum are cut off.
- `max_completion_height` limits its height, and the rows left in the terminal limit it further.
  It's 10 when not set.
- `padding` is the number of spaces on each side of a suggestion.
- `border` is `true` for a rounded border (the default), `false` for none, or a record of six
  characters, `{ top_left: "+", top_right: "+", bottom_left: "+", bottom_right: "+", horizontal: "-", vertical: "|" }`.
- `cursor_offset` moves the box left (negative) or right (positive) of the cursor. With `0`, its
  left edge lines up with the cursor.
- `description_mode` puts the description box on the `left` or on the `right` of the suggestion
  box. `prefer_right` puts it on the right when there is room, and on the left otherwise.
- `min_description_width`, `max_description_width` and `max_description_height` limit the
  description box. The minimum width applies when the suggestion box leaves it little room.
- `description_offset` is the gap between the two boxes.

### History Menu

The history menu is a handy way to access the editor history. When activating
the menu (default `Ctrl+r`) the command history is presented in reverse
chronological order, making it extremely easy to select a previous command.

The history menu can be configured by modifying these values from the config object:

```nu
$env.config.menus ++= [{
    name: history_menu
    input_mode: diff             # Search is done on the text written after activating the menu
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
}]
```

When the history menu is activated, it pulls `page_size` records from the
history and presents them in the menu. If there is space in the terminal, when
you press `Ctrl+x` again the menu will pull the same number of records and
append them to the current page. If it isn't possible to present all the pulled
records, the menu will create a new page. The pages can be navigated by
pressing `Ctrl+z` to go to previous page or `Ctrl+x` to go to next page.

A `list` layout can also set `description_position`, for a menu whose suggestions have
descriptions (see [User Defined Menus](#user-defined-menus)). With `before`, the default, a row
shows the description in parentheses ahead of the value, `(red or green) apple`. With `after`, it
shows `apple red or green`.

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

```text
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
layouts as a template. The templates available in nushell are columnar, list, ide or
description.

The columnar menu will show you data in a columnar fashion adjusting the column
number based on the size of the text displayed in your columns.

The list type of menu will always display suggestions as a list. In the history
menu you can also select values using `!` plus number combination, see
[Menu Quick Selection](#menu-quick-selection).

The ide type shows the suggestions in a box under the cursor, with the description
of the selected one beside it, like the [IDE completion menu](#ide-completion-menu).

The description type will give you more space to display a description for some
values, together with extra information that could be inserted into the buffer.

A menu's suggestions come from its `source` closure, described below, which works
with any of the four layouts. Without a `source`, the layout decides: `columnar`
and `ide` menus show Nushell's normal completions, a `list` menu shows the history,
and a `description` menu shows commands and their help, like the
[help menu](#help-menu).

Let's say we want to create a menu that displays all the variables created
during your session, we are going to call it `vars_menu`. This menu will use a
list layout (`layout: list`). To search for values, we want to use only the things
that are written after the menu has been activated
(`input_mode: diff`).

With that in mind, the desired menu would look like this

```nu
$env.config.menus ++= [{
    name: vars_menu
    input_mode: diff
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
    source: { |token|
        scope variables
        | where ($it.name | str contains $token.text)
        | sort-by name
        | each { |row| {value: $row.name description: $row.type} }
    }
}]
```

As you can see, the new menu is identical to the `history_menu` previously
described. The only huge difference is the new field called `source`. The
`source` field is a closure that returns the values you want to display in the
menu. For this menu we are extracting the data from `scope variables` and we
are using it to create records that will be used to populate the menu.

The required structure for the record is the next one

```nu
{
  value: "$foo"                 # The value that will be inserted in the buffer
  description: "int"            # Optional. Description that will be displayed with the selected value
  display_override: "foo (int)" # Optional. Text shown in the menu in place of the value
  style: green                  # Optional. Color of the value in the menu
  span: { start: 5, end: 7 }    # Optional. Byte range of the line that the value replaces
  extra: ["first", "second"]    # Optional. A list of strings that will be displayed with the selected value. Only works with a description menu
  append_whitespace: true       # Optional. Adds a space after the value when it's accepted
  match_indices: [1, 2]         # Optional. Positions, from 0, of the characters to draw in the match_text style
  kind: "variable"              # Optional. Accepted as in a custom completer, but a menu ignores it
}
```

Without `match_indices`, the menu highlights the typed text wherever it finds it in the value.

For the menu to display something, at least the `value` field has to be present
in the resulting record. The source can also return a plain list of strings, or
`null` to show nothing. It can return the same values as a
[custom completer](custom_completions.md), except that the `options` of a
`{completions, options}` record are ignored.

In order to make the menu interactive, the `source` closure receives the same
inputs as a [custom completer](custom_completions.md#context-aware-custom-completions).
It asks for them by naming its parameters:

- `token` - the token under the cursor, as `{text, kind, span}`. The `vars_menu`
  above filters on `$token.text`, so typing `foo` after activating the menu shows
  `$foo` and `$food`.
- `place` - what is being completed. `$place.cursor` is the cursor position, and
  `$place.target` is the part of the line that a suggestion replaces by default.
- `buffer` - the whole line up to the cursor, whatever the menu's `input_mode` is.

::: warning
Before Nushell 0.116, a menu source was written as `{|buffer, position| ... }`, and
with `only_buffer_difference: true`, `$buffer` held only the text typed after the
menu was activated. A source that declares `buffer` now always receives the whole
line up to the cursor, and a source that declares `position` still receives the
cursor position but prints a deprecation warning. Use `$token.text` for the text
being completed, and `$place.cursor` for the cursor position.
:::

Using this information, you can design your menu to present the information you
require and to replace that value in the location you need it. The only thing
extra that you need to play with your menu is to define a keybinding that will
activate your brand new menu. For example, to open it with <kbd>Alt</kbd>+<kbd>O</kbd>:

```nu
$env.config.keybindings ++= [{
    name: vars_menu
    modifier: alt
    keycode: char_o
    mode: [emacs, vi_normal, vi_insert]
    event: { send: menu name: vars_menu }
}]
```

### Menu Keybindings

In case you want to change the default way both menus are activated, you can
change that by defining new keybindings. For example, the next two keybindings
assign the completion and history menu to `Ctrl+t` and `Ctrl+y` respectively

```nu
$env.config.keybindings ++= [
    {
        name: completion_menu_ctrl_t_vi
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
        name: history_menu_ctrl_y_vi
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
```

## Abbreviations

Reedline abbreviations are a convenient way to expand a command into a
different command that is often longer and/or more complex. This is similar to
an `alias` with two main exceptions: (1) the expanded command is what gets
stored to history, (2) the expanded command can be edited before being used.

Abbreviations are expanded on `space` or `enter` and you can add them to your config
like this

```nu
$env.config.abbreviations = {
    ll: "ls -l"
    gs: "git status"
    ptop: "ps | compact cpu | sort-by cpu -r | first 15"
}
```

The word before the cursor has to match the abbreviation exactly, and a word ends only at
whitespace, so `(ll` isn't expanded while `( ll` is. Nushell also looks at how the word parses. It
doesn't expand a word that is text: a string, a raw string, a string interpolation, a bare word
passed where a command expects a string, as in `echo ll`, or an argument of an external command, as
in `git ll`. A word in command position expands, at the start of the line or after `|`, `;` or
`let x =`. So does a path argument, as in `ls ll`, which isn't text to the parser.

You can see the currently active abbreviations with [`abbr list`](/commands/docs/abbr_list.md):

```nu
abbr list
# => ╭───┬──────┬──────────────────────────────────────────────╮
# => │ # │ name │                  expansion                   │
# => ├───┼──────┼──────────────────────────────────────────────┤
# => │ 0 │ gs   │ git status                                   │
# => │ 1 │ ll   │ ls -l                                        │
# => │ 2 │ ptop │ ps | compact cpu | sort-by cpu -r | first 15 │
# => ╰───┴──────┴──────────────────────────────────────────────╯
```

`abbr list` is the only subcommand of [`abbr`](/commands/docs/abbr.md), and `abbr` on its own
only prints its help. To add or remove abbreviations, change `$env.config.abbreviations`.

## Terminal integration

Nushell sends escape sequences that tell the terminal where the prompt is, which directory you're
in and what is running. Terminals that understand them use them for things like jumping between
prompts or opening a new tab in the same directory, and ignore the ones they don't know. If a
terminal shows stray characters or misbehaves, turn the matching setting off. Each one is a `bool`
under `$env.config.shell_integration`:

| Setting                  | Default                     | What it does                                                                                                                                                                                                                                          |
| ------------------------ | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `osc2`                   | `true`                      | Sets the window or tab title to the current directory, with your home directory shortened to `~`. While a command runs, the title also shows the command's first word, as in `~/src> cargo`.                                                          |
| `osc7`                   | `true` (`false` on Windows) | Reports the current directory to the terminal as a `file://` URL, so it can open a new tab or window in the same directory.                                                                                                                           |
| `osc8`                   | `true`                      | Writes the file names in [`ls`](/commands/docs/ls.md) output as links that the terminal can open. Over SSH the links are left out, see [`$env.SSH_CLIENT`](./special_variables.md#env-ssh-client).                                                    |
| `osc9_9`                 | `false` (`true` on Windows) | Reports the current directory the way ConEmu and Windows Terminal read it, which Windows Terminal uses to duplicate a tab in the same directory.                                                                                                      |
| `osc133`                 | `true`                      | Marks where the prompt, the command line and each command's output start, and reports each command's exit status. Terminals use the marks to jump between prompts or select a command's output. It also turns on clicking to move the cursor (below). |
| `osc633`                 | `true`                      | In the Visual Studio Code terminal, sends VS Code's own marks in place of the OSC 133 ones, see [`$env.TERM_PROGRAM`](./special_variables.md#env-term-program).                                                                                       |
| `reset_application_mode` | `true`                      | Sends `ESC[?1l` after each command. A program, or a remote host over SSH, can leave the cursor keys in "application mode", where they send different codes. This switches them back.                                                                  |

Nushell sends the directory and title sequences once at startup and again after each command.

With `osc133` on, the prompt marks also ask the terminal to report mouse clicks on the command line.
In a terminal that supports this, clicking in the line moves the cursor to that spot, and clicking an
item in an open menu selects it. Other terminals ignore the request.

Two more settings control how the terminal sends input:

- `$env.config.bracketed_paste` (default `true`) asks the terminal to mark pasted text. Nushell then
  inserts a multi-line paste into the line as one piece, and nothing runs until you press
  <kbd>Enter</kbd>. With it set to `false`, a pasted newline acts like <kbd>Enter</kbd>, so each
  pasted line runs as it arrives. Windows doesn't support bracketed paste, and there the setting does
  nothing.
- `$env.config.use_kitty_protocol` (default `false`) turns on the
  [kitty keyboard protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/) in terminals that
  support it. The protocol reports keys that otherwise send the same code, so you can bind
  <kbd>Ctrl</kbd>+<kbd>I</kbd> apart from <kbd>Tab</kbd>. When the terminal doesn't support the
  protocol, the setting has no effect. Nushell checks once at startup, and only writes
  `Terminal doesn't support use_kitty_protocol config` to its log, which you see when you start it
  with `--log-level warn`. [`keybindings listen`](/commands/docs/keybindings_listen.md) and
  [`input listen`](/commands/docs/input_listen.md) print a warning on the screen instead.

## Event and edit reference

This section lists every event and edit command that a keybinding can name. Names are not
case-sensitive. [`keybindings list --events`](/commands/docs/keybindings_list.md) and
`keybindings list --edits` print the same names, with their fields.

Inside an [`until`](#until-type) list, an event that has nothing to do hands the key to the next
event. The tables say when that happens.

### Events

Use these with `send`, as in `event: { send: ClearScrollback }`. The default key is given where
there is one.

| Event                                         | What it does                                                                                                                                                                                                                                                                        |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `None`                                        | Nothing. A key bound to `None` is swallowed, while `event: null` removes the key's binding (see [Removing a Default Keybinding](#removing-a-default-keybinding)). Always counts as having nothing to do.                                                                            |
| `CtrlC`                                       | Abandons the line without running it, closes an open menu and clears the undo history. In a [reverse history search](#reverse-history-search), it ends the search first. <kbd>Ctrl</kbd>+<kbd>C</kbd>.                                                                              |
| `CtrlD`                                       | Exits Nushell when the line is empty, otherwise deletes the character under the cursor. <kbd>Ctrl</kbd>+<kbd>D</kbd>.                                                                                                                                                               |
| `ClearScreen`                                 | Clears the screen and redraws the prompt at the top, keeping the line. Closes an open menu. <kbd>Ctrl</kbd>+<kbd>L</kbd>.                                                                                                                                                           |
| `ClearScrollback`                             | Like `ClearScreen`, and also clears the terminal's scrollback. Not bound by default.                                                                                                                                                                                                |
| `Repaint`                                     | Redraws the prompt and the line.                                                                                                                                                                                                                                                    |
| `Enter`                                       | With a menu open, puts the selected suggestion into the line and stops. Otherwise it expands a history reference such as `!!` and an abbreviation before the cursor, then runs the line, or inserts a newline when the line is [unfinished](#multi-line-editing). <kbd>Enter</kbd>. |
| `Submit`                                      | Like `Enter`, but runs the line even when it's unfinished, so `echo (` runs and reports the unclosed `(`.                                                                                                                                                                           |
| `SubmitOrNewline`                             | Inserts a newline when the cursor is before the end of the line. Otherwise works like `Enter`.                                                                                                                                                                                      |
| `Esc`, `Escape`                               | Closes an open menu and clears the selection. Has nothing to do when there is neither. It doesn't change Vi or Helix modes. Those modes handle the <kbd>Esc</kbd> key themselves, and a binding uses `SwitchMode` instead.                                                          |
| `Up`                                          | Moves the cursor up a line. On the first line it steps back through the history, searching by [prefix](#prefix-search-with-the-arrow-keys) like <kbd>↑</kbd>. Has nothing to do when there is no line or entry to move to.                                                          |
| `Down`                                        | Moves the cursor down a line. On the last line it steps forward through the history, and past the newest entry it returns to the line you were typing. Has nothing to do when there is nothing to move to.                                                                          |
| `PreviousHistory`                             | Steps back through the history right away, without first moving through the lines of a multi-line buffer. Like `Up`, it searches by prefix when the line has text and the cursor is at its end.                                                                                     |
| `NextHistory`                                 | Steps forward through the history, without first moving through the lines of the buffer.                                                                                                                                                                                            |
| `FirstHistory`                                | Jumps to the oldest history entry, or during a prefix search to the oldest entry that starts with the typed text. Has nothing to do when it's already there or nothing matches. <kbd>PageUp</kbd>.                                                                                  |
| `LeaveHistory`                                | Returns from the history to the line you were typing. Has nothing to do when you aren't stepping through the history. <kbd>PageDown</kbd>.                                                                                                                                          |
| `Left`, `Right`                               | Move the cursor one character. Have nothing to do at the start or end of the line. They don't touch menus or hints. The default <kbd>←</kbd> and <kbd>→</kbd> keys get that from an `until` list that tries `MenuLeft`, `MenuRight` and `HistoryHintComplete` first.                |
| `ToStart`, `ToEnd`                            | Move to the start or end of the buffer. Unlike the `MoveToStart` and `MoveToEnd` edits, they don't end history browsing or add an undo step. Have nothing to do when the cursor is already there. <kbd>Alt</kbd>+<kbd>&lt;</kbd>, <kbd>Alt</kbd>+<kbd>&gt;</kbd>.                   |
| `HistoryHintComplete`                         | Accepts the whole [history hint](#hints). Has nothing to do when no hint is showing or a menu is open.                                                                                                                                                                              |
| `HistoryHintWordComplete`                     | Accepts the next word of the hint, under the same conditions.                                                                                                                                                                                                                       |
| `SearchHistory`                               | Starts a [reverse history search](#reverse-history-search). <kbd>Ctrl</kbd>+<kbd>Q</kbd>.                                                                                                                                                                                           |
| `OpenEditor`                                  | Opens the line in your editor. <kbd>Ctrl</kbd>+<kbd>O</kbd>.                                                                                                                                                                                                                        |
| `Menu` `name: <string>`                       | Opens the named menu. Has nothing to do when a menu is already open.                                                                                                                                                                                                                |
| `MenuAccept`                                  | Puts the selected suggestion into the line and closes the menu, without running the line. Has nothing to do when the menu has no suggestions.                                                                                                                                       |
| `MenuNext`, `MenuPrevious`                    | Select the next or previous item. When a `columnar` or `ide` menu has a single suggestion, `MenuNext` accepts it, whatever `completions.quick` says. With `completions.partial` on, it first fills in the text that all suggestions share.                                          |
| `MenuUp`, `MenuDown`, `MenuLeft`, `MenuRight` | Move the selection in that direction. What each direction does depends on the menu's layout.                                                                                                                                                                                        |
| `MenuPageNext`, `MenuPagePrevious`            | Show the next or previous page of the menu.                                                                                                                                                                                                                                         |
| `ExecuteHostCommand` `cmd: <string>`          | Runs `cmd` as a Nushell command and keeps the line, see [Send Type](#send-type).                                                                                                                                                                                                    |
| `SwitchMode` `mode: <string>`                 | Switches to another mode of the current edit mode, see [Send Type](#send-type). Has nothing to do when it can't switch.                                                                                                                                                             |

Every `Menu...` event other than `Menu` itself has nothing to do when no menu is open.

### Edit commands

Use these with `edit`, as in `event: { edit: MoveToLineEnd }`. Fields go in the same record, as in
`{ edit: InsertString, value: " | to json" }`. A `<char>` field takes a string of exactly one
character.

An edit that moves the cursor has nothing to do when the cursor stays where it is, and
`CopySelection` has nothing to do when nothing is selected. Every other edit counts as done, even
one that changes nothing, such as `Clear` on an empty line.

#### Moving the cursor

Each of these takes an optional `select: true`, which extends the selection to where the cursor
lands instead of dropping it.

| Edit                                                | Moves the cursor to                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `MoveLeft`, `MoveRight`                             | The previous or next character                                                        |
| `MoveWordLeft`, `MoveBigWordLeft`                   | The start of the previous word or WORD                                                |
| `MoveWordRight`                                     | The end of the next word                                                              |
| `MoveWordRightStart`, `MoveBigWordRightStart`       | The start of the next word or WORD                                                    |
| `MoveBigWordRightEnd`                               | The end of the next WORD                                                              |
| `MoveWordRightEnd`                                  | The same place as `MoveWordRight`. Deprecated, use `MoveWordRight`                    |
| `MoveToLineStart`, `MoveToLineEnd`                  | The start or end of the line                                                          |
| `MoveToLineNonBlankStart`                           | The first character of the line that isn't a space or tab                             |
| `MoveToStart`, `MoveToEnd`                          | The start or end of the buffer                                                        |
| `MoveLineUp`, `MoveLineDown`                        | The line above or below, without stepping into the history                            |
| `MoveToPosition` `value: <int>`                     | A byte offset from the start of the buffer                                            |
| `MoveRightUntil`, `MoveLeftUntil` `value: <char>`   | The next or previous `value` character, like Vi <kbd>f</kbd> and <kbd>F</kbd>         |
| `MoveRightBefore`, `MoveLeftBefore` `value: <char>` | Next to the next or previous `value` character, like Vi <kbd>t</kbd> and <kbd>T</kbd> |

A WORD ends only at whitespace. The edits with `Word` in their name follow Unicode word rules,
the way Emacs mode moves, so `foo.bar` and `can't` are one word each while `foo-bar` and
`foo|bar` are two. Vi's <kbd>w</kbd> and the `word` [motion](#motions) stop at any punctuation, so
`foo.bar` is three words there.

#### Inserting and replacing text

| Edit                                       | What it does                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| `InsertChar` `value: <char>`               | Inserts one character, replacing the selection                                       |
| `InsertString` `value: <string>`           | Inserts the text, replacing the selection                                            |
| `InsertNewline`                            | Inserts a newline, replacing the selection                                           |
| `InsertNewlineAbove`, `InsertNewlineBelow` | Opens an empty line above or below the current one and moves the cursor there        |
| `InsertPair` `open: <char>, close: <char>` | Inserts both characters with the cursor between them, or wraps the selection in them |
| `ReplaceChar` `value: <char>`              | Replaces the character under the cursor, or each selected character                  |

#### Deleting

These delete text without putting it in the [cut buffer](#the-cut-buffer).

| Edit                                          | Deletes                                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `Backspace`, `Delete`                         | The character before or under the cursor                                                                  |
| `BackspaceWord`, `DeleteWord`                 | The word before or after the cursor                                                                       |
| `BackspacePair` `open: <char>, close: <char>` | Both characters, when the cursor sits between an empty `open` and `close` pair. Otherwise it does nothing |
| `Clear`                                       | The whole buffer                                                                                          |
| `ClearToLineEnd`                              | From the cursor to the end of the line                                                                    |
| `EraseSelection`                              | The selection                                                                                             |

#### Cutting

These remove text and put it in the [cut buffer](#the-cut-buffer).

| Edit                                                           | Cuts                                                                                                                                                                   |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CutChar`, `CutCharLeft`                                       | The character under or before the cursor                                                                                                                               |
| `CutWordLeft`, `CutBigWordLeft`                                | The word or WORD before the cursor                                                                                                                                     |
| `CutWordRight`, `CutBigWordRight`                              | The word or WORD after the cursor                                                                                                                                      |
| `CutWordRightToNext`, `CutBigWordRightToNext`                  | The word or WORD after the cursor and the whitespace that follows it                                                                                                   |
| `CutFromStart`, `CutToEnd`                                     | From the start of the buffer to the cursor, or from the cursor to the end of the buffer                                                                                |
| `CutFromLineStart`, `CutToLineEnd`                             | From the start of the line to the cursor, or from the cursor to the end of the line                                                                                    |
| `CutFromLineNonBlankStart`                                     | From the first character of the line that isn't a space or tab, to the cursor                                                                                          |
| `KillLine`                                                     | From the cursor to the end of the line, or the line break when the cursor is already at the end (Emacs <kbd>Ctrl</kbd>+<kbd>K</kbd>)                                   |
| `CutCurrentLine`                                               | The whole line, as whole lines                                                                                                                                         |
| `CutFromStartLinewise`, `CutToEndLinewise` `keep_line: <bool>` | Whole lines, from the first line to the cursor's line, or from the cursor's line to the last. `keep_line` is required. With `true`, an empty line stays in their place |
| `CutLeftUntil`, `CutRightUntil` `value: <char>`                | From the cursor through the previous or next `value` character                                                                                                         |
| `CutLeftBefore`, `CutRightBefore` `value: <char>`              | From the cursor up to the previous or next `value` character, leaving that character                                                                                   |
| `CutSelection` `granularity?: <string>`                        | The selection. With `granularity: linewise`, the whole lines the selection touches                                                                                     |

#### Copying

The copy edits put text in the [cut buffer](#the-cut-buffer) and leave the line as it is. Each one
copies the same text that the cut edit with the matching name would cut: `CopyWordLeft`,
`CopyBigWordLeft`, `CopyWordRight`, `CopyBigWordRight`, `CopyWordRightToNext`,
`CopyBigWordRightToNext`, `CopyFromStart`, `CopyToEnd`, `CopyFromLineStart`, `CopyToLineEnd`,
`CopyFromLineNonBlankStart`, `CopyCurrentLine`, `CopyLeftUntil`, `CopyRightUntil`,
`CopyLeftBefore`, `CopyRightBefore` (these four take `value: <char>`) and `CopySelection`. The
line-wise `CopyFromStartLinewise` and `CopyToEndLinewise` take no `keep_line` field. `CopyLeft` and
`CopyRight` copy the character before or under the cursor.

#### Pasting

| Edit                                                        | What it does                                                                                                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PasteCutBufferBefore`, `Paste`                             | Pastes the cut buffer before the cursor (Emacs <kbd>Ctrl</kbd>+<kbd>Y</kbd>, Vi <kbd>P</kbd>). The two names do the same thing                                     |
| `PasteCutBufferAfter`                                       | Pastes the cut buffer after the cursor (Vi <kbd>p</kbd>)                                                                                                           |
| `PasteAtSelectionEdge` `direction: <string>, count?: <int>` | Pastes the cut buffer `count` times (default 1) after the selection (`forward`) or before it (`backward`), and selects what it pasted. Line-wise text isn't pasted |

#### The system clipboard

`CutSelectionSystem`, `CopySelectionSystem` and `PasteSystem` work like `CutSelection`,
`CopySelection` and `PasteCutBufferBefore`, but with the system clipboard instead of the cut buffer.
They exist only when Nushell is built with the `system-clipboard` feature, which
`version | get features` lists. In a build without it, a keybinding that names one of them is an
error, like any unknown edit.

#### Changing case and swapping

| Edit                                                              | What it does                                                                           |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `UppercaseWord`, `LowercaseWord`                                  | Changes the case of the whole word under the cursor                                    |
| `CapitalizeWord`                                                  | Uppercases the first letter of the word under the cursor and lowercases the rest       |
| `CapitalizeChar`                                                  | Uppercases the character under the cursor                                              |
| `SwitchcaseChar`                                                  | Switches the case of the character under the cursor                                    |
| `UppercaseSelection`, `LowercaseSelection`, `SwitchcaseSelection` | Changes the case of the selection                                                      |
| `SwapGraphemes`                                                   | Swaps the characters on either side of the cursor (Emacs <kbd>Ctrl</kbd>+<kbd>T</kbd>) |
| `SwapWords`                                                       | Swaps the word under the cursor with the next word                                     |

#### Undo, completion and selection

| Edit                                      | What it does                                                                                                                                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Undo`, `Redo`                            | Undoes the last change, or redoes an undone one                                                                                                                                                                           |
| `Complete`                                | With a completion menu open and `completions.quick` on, accepts the suggestion if it's the only one. Otherwise, with `completions.partial` on, fills in the text the suggestions share. Without a menu it changes nothing |
| `SelectAll`                               | Selects the whole buffer                                                                                                                                                                                                  |
| `SelectLine`                              | Extends the selection to the whole lines it touches, or by one more line when it already covers whole lines (Helix <kbd>x</kbd>)                                                                                          |
| `SwapCursorAndAnchor`                     | Moves the cursor to the other end of the selection (Vi visual <kbd>o</kbd>)                                                                                                                                               |
| `CollapseSelection` `direction: <string>` | Drops the selection, leaving the cursor at its start (`backward`) or its end (`forward`)                                                                                                                                  |

Nushell's <kbd>Tab</kbd> binding tries `Complete` after the menu events, which is how a second
<kbd>Tab</kbd> can fill in a shared prefix.

#### Motions

Seven edits act on a motion, which says where the cursor goes. They're the general form behind
many of the edits above:

| Edit     | What it does with the motion                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------- |
| `Move`   | Moves the cursor                                                                                        |
| `Extend` | Moves the cursor and keeps the other end of the selection where it is, so the selection grows           |
| `Select` | Selects from the cursor to where the motion lands                                                       |
| `Cut`    | Cuts from the cursor to where the motion lands                                                          |
| `Copy`   | Copies the same text                                                                                    |
| `Change` | Cuts like `Cut`. With `granularity: linewise` it leaves an empty line, like Vi <kbd>c</kbd><kbd>c</kbd> |
| `Erase`  | Deletes the same text without the cut buffer                                                            |

The `motion` field picks the motion, and the other fields describe it. `direction` is `forward` or
`backward`.

| `motion`     | Other fields                                                               | Goes to                                                                                                    |
| ------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `grapheme`   | `direction`                                                                | The next or previous character                                                                             |
| `word`       | `word_kind` (`word` or `longword`), `edge` (`start` or `end`), `direction` | The start or end of a word, or of a WORD with `longword`, like Vi <kbd>w</kbd>, <kbd>b</kbd>, <kbd>e</kbd> |
| `lineedge`   | `direction`                                                                | The start (`backward`) or end (`forward`) of the line                                                      |
| `bufferedge` | `direction`                                                                | The start or end of the buffer                                                                             |
| `line`       | `direction`                                                                | The line above (`backward`) or below (`forward`)                                                           |
| `find`       | `char`, `direction`, `stop` (`on` or `before`)                             | The next or previous `char`, or next to it with `stop: before`, like Vi <kbd>f</kbd> and <kbd>t</kbd>      |

With `motion: word`, a `word` ends at whitespace and at punctuation, as for Vi's <kbd>w</kbd>, and
a `longword` only at whitespace.

`Cut`, `Copy` and `Change` also take `granularity`, which is `charwise` (the default) or `linewise`
for whole lines. This binding cuts from the cursor to the end of the WORD, like Vi
<kbd>d</kbd><kbd>E</kbd>:

```nu
$env.config.keybindings ++= [{
    name: cut_to_word_end
    modifier: alt
    keycode: char_x
    mode: emacs
    event: { edit: Cut, motion: word, word_kind: longword, edge: end, direction: forward }
}]
```

#### Text objects

`CutTextObject`, `CopyTextObject` and `SelectTextObject` act on the text object around the cursor,
like Vi's <kbd>d</kbd><kbd>i</kbd><kbd>(</kbd>. They take these fields:

- `scope`: `inner` for the text inside the object, `around` to include the delimiters.
- `object_type`: `word`, `bigword`, `brackets` (whichever of `()`, `[]`, `{}` or `<>` is
  closest), `quotes` (whichever of `"`, `'` or `` ` `` is closest), or one pair:
  `parentheses`, `square_brackets`, `curly_brackets`, `angle_brackets`, `single_quotes`,
  `double_quotes` or `backticks`. The singular spellings, such as `parenthesis`, work too. Any other
  pair is a record of two characters, `{ left: "|", right: "|" }`.
- `check_next` (default `true`): when the cursor isn't inside a matching object, act on the next
  one in the line. With `false`, the edit then does nothing.

Three more edits change the delimiters themselves. `AddTextObject` wraps the selection in a pair,
`RemoveTextObject` removes the closest pair around the cursor, and `ReplaceTextObject` swaps the
closest `old` pair around the cursor for a `new` one. Their `object_type`, `old` and `new` fields
must name a single pair, so `word`, `bigword`, `brackets` and `quotes` are errors there. These two
bindings select the text inside the next pair of quotes, then wrap it in brackets:

```nu
$env.config.keybindings ++= [
    {
        name: select_in_quotes
        modifier: alt
        keycode: char_q
        mode: emacs
        event: { edit: SelectTextObject, scope: inner, object_type: quotes }
    }
    {
        name: wrap_in_brackets
        modifier: alt
        keycode: char_b
        mode: emacs
        event: { edit: AddTextObject, object_type: square_brackets }
    }
]
```

On the line `echo "foo bar"`, <kbd>Alt</kbd>+<kbd>Q</kbd> and then <kbd>Alt</kbd>+<kbd>B</kbd>
give `echo "[foo bar]"`.

The older pair edits, such as `CutInsidePair`, still work and become text object edits, see
[Edit Type](#edit-type).
