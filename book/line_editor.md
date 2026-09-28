# Reedline, Nu's Line Editor

Nushell's line-editor [Reedline](https://github.com/nushell/reedline) is
cross-platform and designed to be modular and flexible. The line-editor is
in charge of controlling the command history, validations, completions, hints,
screen paint, and more.

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

## Default Keybindings

Each of the three edit modes is built from a few shared sets of keybindings plus its own additions. The tables below follow Reedline's [keybinding reference](https://github.com/nushell/reedline/blob/main/KEYBINDINGS.md) for the Reedline version that ships with Nushell. Run [`keybindings default`](/commands/docs/keybindings_default.md) to list the built-in keybindings of every mode.

Some keys are a _fallback chain_: Reedline tries each step and takes the first one that applies. The tables write those with "otherwise". For example, <kbd>→</kbd> accepts a history hint if one is showing, otherwise moves right in an open menu, otherwise moves the cursor right.

### Keybindings Added by Nushell

Nushell adds the following keybindings on top of Reedline's defaults. They are defined in `$env.config.keybindings`, so you can change or remove them, and they apply in every edit mode:

| Key                                  | Action                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| <kbd>Tab</kbd>                       | Open the completion menu, otherwise select the next item, otherwise complete                      |
| <kbd>Shift</kbd>+<kbd>Tab</kbd>      | Select the previous item in the menu                                                              |
| <kbd>Ctrl</kbd>+<kbd>Space</kbd>     | Open the IDE-style completion menu, otherwise select the next item, otherwise complete            |
| <kbd>Ctrl</kbd>+<kbd>R</kbd>         | Open the history menu (this replaces Reedline's <kbd>Ctrl</kbd>+<kbd>R</kbd> history search)      |
| <kbd>Ctrl</kbd>+<kbd>Q</kbd>         | Search the history                                                                                |
| <kbd>Ctrl</kbd>+<kbd>X</kbd>         | Show the next page of an open menu                                                                |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd>         | Show the previous page of an open menu, otherwise undo                                            |
| <kbd>F1</kbd>                        | Open the help menu                                                                                |

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

| Set                                | Emacs | Vi insert | Vi normal / visual     | Helix insert | Helix normal / select  |
| ---------------------------------- | ----- | --------- | ---------------------- | ------------ | ---------------------- |
| [Control](#control-keybindings)    | yes   | yes       | yes                    | yes          | yes                    |
| [Navigation](#navigation-keybindings) | yes | yes      | yes, rebound in visual | yes          | yes, rebound in select |
| [Editing](#editing-keybindings)    | yes   | yes       | no                     | yes          | no                     |
| [Selection](#selection-keybindings) | yes  | yes       | yes                    | yes          | yes                    |

A mode without the editing set rebinds <kbd>Backspace</kbd> and <kbd>Delete</kbd> itself. Modes may also override single keys within a set; those keys are noted in the mode's own tables.

#### Control Keybindings

| Key                          | Action                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| <kbd>Esc</kbd>               | Close an open menu and clear the selection; in Vi and Helix modes, also switch mode       |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Cancel the current input                                                                  |
| <kbd>Ctrl</kbd>+<kbd>D</kbd> | Delete the character under the cursor, or exit Nushell when the line is empty             |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | Clear the screen, keeping the current input                                               |
| <kbd>Ctrl</kbd>+<kbd>R</kbd> | Search the history (Nushell binds this key to the history menu instead, see above)        |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Open the current input in your editor (see `$env.config.buffer_editor`)                       |

#### Navigation Keybindings

| Key                                                     | Action                                                                                                         |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| <kbd>↑</kbd>, <kbd>Ctrl</kbd>+<kbd>P</kbd>              | Move up in an open menu, otherwise move one line up, walking back through the history from the first line     |
| <kbd>↓</kbd>, <kbd>Ctrl</kbd>+<kbd>N</kbd>              | Move down in an open menu, otherwise move one line down, walking forward through the history from the last line |
| <kbd>←</kbd>                                            | Move left in an open menu, otherwise move one character left                                                   |
| <kbd>→</kbd>                                            | Accept a history hint, otherwise move right in an open menu, otherwise move one character right                |
| <kbd>Ctrl</kbd>+<kbd>←</kbd>                            | Move one word left                                                                                             |
| <kbd>Ctrl</kbd>+<kbd>→</kbd>                            | Accept one word of a history hint, otherwise move one word right                                               |
| <kbd>Home</kbd>, <kbd>Ctrl</kbd>+<kbd>A</kbd>           | Move to the start of the line                                                                                  |
| <kbd>End</kbd>, <kbd>Ctrl</kbd>+<kbd>E</kbd>            | Accept a history hint, otherwise move to the end of the line                                                   |
| <kbd>Ctrl</kbd>+<kbd>Home</kbd>, <kbd>Alt</kbd>+<kbd>&lt;</kbd> | Move to the start of the buffer                                                                        |
| <kbd>Ctrl</kbd>+<kbd>End</kbd>, <kbd>Alt</kbd>+<kbd>&gt;</kbd>  | Move to the end of the buffer                                                                          |

On terminals that use the Kitty keyboard protocol, <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>,</kbd> and <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>.</kbd> also work for <kbd>Alt</kbd>+<kbd>&lt;</kbd> and <kbd>Alt</kbd>+<kbd>&gt;</kbd>.

#### Editing Keybindings

| Key                                                     | Action                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| <kbd>Backspace</kbd>, <kbd>Ctrl</kbd>+<kbd>H</kbd>      | Delete the character to the left                           |
| <kbd>Delete</kbd>                                       | Delete the character under the cursor                      |
| <kbd>Ctrl</kbd>+<kbd>Backspace</kbd>, <kbd>Ctrl</kbd>+<kbd>W</kbd> | Delete the word to the left                     |
| <kbd>Ctrl</kbd>+<kbd>Delete</kbd>                       | Delete the word to the right                               |
| <kbd>Shift</kbd>+<kbd>Enter</kbd>, <kbd>Alt</kbd>+<kbd>Enter</kbd> | Insert a newline without running the input      |
| <kbd>Ctrl</kbd>+<kbd>J</kbd>                            | Run the input, or insert a newline if it is incomplete     |

None of these fill the cut buffer (Emacs mode rebinds <kbd>Ctrl</kbd>+<kbd>W</kbd> to a cut, so there it does). When Nushell is built with the `system-clipboard` feature, this set also has <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> and <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> to cut, copy and paste the selection with the system clipboard.

#### Selection Keybindings

| Key                                                                     | Action                                           |
| ----------------------------------------------------------------------- | ------------------------------------------------ |
| <kbd>Shift</kbd>+<kbd>←</kbd>, <kbd>Shift</kbd>+<kbd>→</kbd>            | Extend the selection by one character            |
| <kbd>Shift</kbd>+<kbd>↑</kbd>, <kbd>Shift</kbd>+<kbd>↓</kbd>            | Extend the selection by one line                 |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>←</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>→</kbd> | Extend the selection by one word |
| <kbd>Shift</kbd>+<kbd>Home</kbd>, <kbd>Shift</kbd>+<kbd>End</kbd>       | Extend the selection to the line start or end    |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Home</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>End</kbd> | Extend the selection to the buffer start or end |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>                           | Select the whole buffer                          |

### Emacs Mode

Emacs mode is the default. It has all four [common sets](#common-keybindings), plus:

| Key                                                       | Action                                                                                          |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>                              | Move left in an open menu, otherwise move one character left                                    |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>                              | Accept a history hint, otherwise move right in an open menu, otherwise move one character right |
| <kbd>Alt</kbd>+<kbd>←</kbd>, <kbd>Alt</kbd>+<kbd>B</kbd>  | Move one word left                                                                              |
| <kbd>Alt</kbd>+<kbd>→</kbd>, <kbd>Alt</kbd>+<kbd>F</kbd>  | Accept one word of a history hint, otherwise move one word right                                |
| <kbd>Enter</kbd>                                          | Run the input, or insert a newline if it is incomplete                                          |
| <kbd>Alt</kbd>+<kbd>Backspace</kbd>, <kbd>Alt</kbd>+<kbd>M</kbd> | Delete the word to the left                                                              |
| <kbd>Alt</kbd>+<kbd>Delete</kbd>                          | Delete the word to the right                                                                    |
| <kbd>Ctrl</kbd>+<kbd>W</kbd>                              | Cut the word to the left                                                                        |
| <kbd>Alt</kbd>+<kbd>D</kbd>                               | Cut the word to the right                                                                       |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>                              | Cut to the end of the line, or join the next line when already at the end                       |
| <kbd>Ctrl</kbd>+<kbd>U</kbd>                              | Cut from the start of the line to the cursor                                                    |
| <kbd>Ctrl</kbd>+<kbd>Y</kbd>                              | Paste the cut buffer before the cursor                                                          |
| <kbd>Ctrl</kbd>+<kbd>T</kbd>                              | Swap the two characters around the cursor                                                       |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd>                              | Undo (Nushell binds this key to "previous menu page, otherwise undo", see above)                |
| <kbd>Ctrl</kbd>+<kbd>G</kbd>                              | Redo                                                                                            |
| <kbd>Alt</kbd>+<kbd>U</kbd>                               | Uppercase the word under the cursor                                                             |
| <kbd>Alt</kbd>+<kbd>L</kbd>                               | Lowercase the word under the cursor                                                             |
| <kbd>Alt</kbd>+<kbd>C</kbd>                               | Capitalize the character under the cursor                                                       |

### Vi Mode

Vi mode starts in insert mode. <kbd>Esc</kbd> switches to normal mode, <kbd>i</kbd> and its siblings return to insert mode, and <kbd>v</kbd> enters visual mode from normal mode. In visual mode, <kbd>Esc</kbd> returns to normal mode; in normal mode it cancels a half-typed command.

An operator waits for a motion, and the motion picks the range the operator acts on: <kbd>d</kbd> then <kbd>w</kbd> cuts a word. A count can prefix a motion or a command, and counts on an operator and its motion multiply: <kbd>2</kbd><kbd>d</kbd><kbd>3</kbd><kbd>w</kbd> cuts six words.

In every Vi mode, an <kbd>Alt</kbd>+\<char\> chord that isn't bound is read as <kbd>Esc</kbd> followed by \<char\> (the "meta" convention of readline and zsh). For example, <kbd>Alt</kbd>+<kbd>k</kbd> in insert mode recalls the previous line. This is also how you can use a terminal that doesn't send <kbd>Alt</kbd>: press <kbd>Esc</kbd> first, then the key.

#### Vi Insert Mode

Insert mode has all four [common sets](#common-keybindings), plus:

| Key              | Action                                                                     |
| ---------------- | -------------------------------------------------------------------------- |
| <kbd>Enter</kbd> | Run the input, or insert a newline if it is incomplete                     |
| <kbd>Esc</kbd>   | Switch to normal mode, moving the cursor back onto the last typed character |

The Emacs cut and case commands (<kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>U</kbd>, <kbd>Ctrl</kbd>+<kbd>Y</kbd>, <kbd>Ctrl</kbd>+<kbd>T</kbd>, <kbd>Alt</kbd>+<kbd>D</kbd>, <kbd>Alt</kbd>+<kbd>U</kbd>, <kbd>Alt</kbd>+<kbd>L</kbd> and <kbd>Alt</kbd>+<kbd>C</kbd>) are not bound in insert mode. Because of the meta convention, <kbd>Alt</kbd>+<kbd>u</kbd> undoes, and <kbd>Alt</kbd>+<kbd>d</kbd> leaves insert mode and starts a <kbd>d</kbd> operator. <kbd>Ctrl</kbd>+<kbd>W</kbd> deletes the word to the left without cutting it.

#### Vi Normal Mode

Normal mode and visual mode have the control, navigation and selection sets, but not the editing set. In its place:

| Key                  | Action                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| <kbd>Backspace</kbd> | Move one character left in normal mode; extend the selection one character left in visual mode            |
| <kbd>Delete</kbd>    | Delete the character under the cursor in normal mode; in visual mode, cut the selection like <kbd>d</kbd> |

These motions move the cursor in normal mode. In visual mode, they extend the selection instead:

| Key                                    | Motion                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| <kbd>h</kbd>, <kbd>l</kbd>             | Move one character left or right                                                |
| <kbd>j</kbd>, <kbd>k</kbd>             | Move one line down or up, walking through the history at the edge of the buffer |
| <kbd>w</kbd>, <kbd>W</kbd>             | Move to the start of the next word or WORD                                      |
| <kbd>e</kbd>, <kbd>E</kbd>             | Move to the end of the next word or WORD                                        |
| <kbd>b</kbd>, <kbd>B</kbd>             | Move to the start of the previous word or WORD                                  |
| <kbd>0</kbd>                           | Move to the start of the line                                                   |
| <kbd>^</kbd>                           | Move to the first non-blank character of the line                               |
| <kbd>$</kbd>                           | Move to the end of the line                                                     |
| <kbd>g</kbd><kbd>g</kbd>, <kbd>G</kbd> | Move to the start or end of the buffer                                          |
| <kbd>f</kbd>\<char\>, <kbd>F</kbd>\<char\> | Move onto the next or previous occurrence of \<char\>                       |
| <kbd>t</kbd>\<char\>, <kbd>T</kbd>\<char\> | Move just before the next or previous occurrence of \<char\>                |
| <kbd>;</kbd>, <kbd>,</kbd>             | Repeat the last <kbd>f</kbd>/<kbd>t</kbd>/<kbd>F</kbd>/<kbd>T</kbd> search, forwards or reversed |

A WORD is delimited only by whitespace; a word is also delimited by punctuation. In normal mode, <kbd>h</kbd>, <kbd>j</kbd>, <kbd>k</kbd> and <kbd>l</kbd> follow the same fallback chain as the arrow keys: an open menu takes the key first, and <kbd>l</kbd> accepts a history hint before it moves.

Normal mode commands:

| Key                        | Action                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------- |
| <kbd>i</kbd>, <kbd>a</kbd> | Insert before or after the cursor                                                   |
| <kbd>I</kbd>, <kbd>A</kbd> | Insert at the start or at the end of the line                                       |
| <kbd>o</kbd>, <kbd>O</kbd> | Open a line below or above, and insert                                              |
| <kbd>v</kbd>               | Enter [visual mode](#vi-visual-mode)                                                |
| <kbd>x</kbd>, <kbd>X</kbd> | Cut the character under or before the cursor                                        |
| <kbd>s</kbd>               | Cut the character under the cursor and insert                                       |
| <kbd>r</kbd>\<char\>       | Replace the character under the cursor with \<char\>                                |
| <kbd>C</kbd>               | Change to the end of the line, without filling the cut buffer                       |
| <kbd>S</kbd>               | Change the whole line                                                               |
| <kbd>D</kbd>               | Cut to the end of the line                                                          |
| <kbd>p</kbd>, <kbd>P</kbd> | Paste the cut buffer after or before the cursor                                     |
| <kbd>u</kbd>               | Undo                                                                                |
| <kbd>~</kbd>               | Switch the case of the character under the cursor                                   |
| <kbd>.</kbd>               | Repeat the last change                                                              |
| <kbd>?</kbd>               | Search the history and switch to insert mode                                        |
| <kbd>Enter</kbd>           | Run the input, or insert a newline and switch to insert mode if it is incomplete    |

#### Vi Operators and Text Objects

<kbd>d</kbd>, <kbd>c</kbd> and <kbd>y</kbd> take any motion, and cut, change or copy the range it covers. Doubling an operator applies it to the whole line: <kbd>d</kbd><kbd>d</kbd>, <kbd>c</kbd><kbd>c</kbd>, <kbd>y</kbd><kbd>y</kbd>.

An operator can also take a text object, with <kbd>i</kbd> for "inside" or <kbd>a</kbd> for "around":

| Object                     | Selects               |
| -------------------------- | --------------------- |
| <kbd>w</kbd>, <kbd>W</kbd> | A word or WORD        |
| <kbd>b</kbd>               | The enclosing brackets |
| <kbd>q</kbd>               | The enclosing quotes  |

A delimiter works as a text object too: `(`, `)`, `[`, `]`, `{`, `}`, `<`, `>`, `"`, `'`, `` ` `` and `$`. Either half of a pair does the same thing, so <kbd>d</kbd><kbd>i</kbd><kbd>(</kbd> is the same as <kbd>d</kbd><kbd>i</kbd><kbd>)</kbd>. All three operators take the inside form; only <kbd>d</kbd> and <kbd>y</kbd> take the around form.

#### Vi Visual Mode

Pressing <kbd>v</kbd> in normal mode starts visual mode, which selects text as you move the cursor with the [motions](#vi-normal-mode). Visual mode rebinds the navigation set so each key extends the selection the way its Vi counterpart does: the arrows follow <kbd>h</kbd>/<kbd>j</kbd>/<kbd>k</kbd>/<kbd>l</kbd>, <kbd>Ctrl</kbd>+<kbd>←</kbd>/<kbd>→</kbd> follow <kbd>b</kbd>/<kbd>w</kbd>, <kbd>Home</kbd>/<kbd>End</kbd> follow <kbd>0</kbd>/<kbd>$</kbd>, and so on. In visual mode, <kbd>↑</kbd> and <kbd>↓</kbd> never walk through the history, and history hints are not accepted.

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

Helix mode starts in insert mode. <kbd>Esc</kbd> switches to normal mode, <kbd>i</kbd> and its siblings return to insert mode, and <kbd>v</kbd> toggles select mode, where a motion extends the selection instead of replacing it. A count can prefix any key except <kbd>g</kbd>.

Insert mode has all four [common sets](#common-keybindings), plus <kbd>Enter</kbd> (run the input, or insert a newline if it is incomplete) and <kbd>Esc</kbd> (switch to normal mode).

Normal mode and select mode have the control, navigation and selection sets, but not the editing set. In its place:

| Key                          | Action                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------- |
| <kbd>Backspace</kbd>         | Move one character left in normal mode; extend one left in select mode       |
| <kbd>Delete</kbd>            | Delete the character under the cursor                                        |
| <kbd>Alt</kbd>+<kbd>D</kbd>  | Delete the selection without yanking it                                      |
| <kbd>Alt</kbd>+<kbd>`</kbd>  | Make the selected text uppercase                                             |

As in Vi visual mode, select mode rebinds the navigation set so each key extends the selection like its Helix counterpart, and <kbd>↑</kbd>/<kbd>↓</kbd> never walk through the history.

Motions:

| Key                                                 | Action                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| <kbd>h</kbd>, <kbd>l</kbd>                          | Move left / right                                                   |
| <kbd>j</kbd>, <kbd>k</kbd>                          | Move down / up (walking through the history at the buffer's edge)   |
| <kbd>w</kbd>, <kbd>b</kbd>, <kbd>e</kbd>            | Move to the next word start / previous word start / next word end   |
| <kbd>W</kbd>, <kbd>B</kbd>, <kbd>E</kbd>            | Move to the next WORD start / previous WORD start / next WORD end   |
| <kbd>f</kbd>\<char\>, <kbd>F</kbd>\<char\>          | Find the next / previous \<char\>                                   |
| <kbd>t</kbd>\<char\>, <kbd>T</kbd>\<char\>          | Find till the next / previous \<char\>                              |
| <kbd>g</kbd><kbd>h</kbd>, <kbd>g</kbd><kbd>l</kbd>  | Go to the start / end of the line                                   |
| <kbd>g</kbd><kbd>s</kbd>                            | Go to the first non-whitespace character of the line                |
| <kbd>g</kbd><kbd>g</kbd>, <kbd>g</kbd><kbd>e</kbd>  | Go to the start / end of the buffer                                 |

<kbd>h</kbd>, <kbd>l</kbd> and the <kbd>g</kbd> motions collapse the selection onto the new position, while <kbd>w</kbd>, <kbd>b</kbd>, <kbd>e</kbd>, <kbd>f</kbd> and <kbd>t</kbd> select the text they move over.

Selection:

| Key            | Action                                                                        |
| -------------- | ----------------------------------------------------------------------------- |
| <kbd>x</kbd>   | Select the current line; if it is already selected, extend to the next line  |
| <kbd>%</kbd>   | Select the whole buffer                                                       |
| <kbd>v</kbd>   | Toggle select mode                                                            |
| <kbd>Esc</kbd> | Collapse the selection in normal mode; leave select mode in select mode       |

Changes:

| Key                        | Action                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------- |
| <kbd>i</kbd>, <kbd>a</kbd> | Insert before / after the selection                                                   |
| <kbd>I</kbd>, <kbd>A</kbd> | Insert at the first non-blank character of the line / at the end of the line         |
| <kbd>o</kbd>, <kbd>O</kbd> | Open a new line below / above the selection                                           |
| <kbd>d</kbd>               | Delete the selection                                                                  |
| <kbd>c</kbd>               | Change the selection (delete it and enter insert mode)                                |
| <kbd>y</kbd>               | Yank (copy) the selection                                                             |
| <kbd>p</kbd>, <kbd>P</kbd> | Paste after / before the selection                                                    |
| <kbd>r</kbd>\<char\>       | Replace the selection with \<char\>                                                   |
| <kbd>~</kbd>               | Switch the case of the selected text                                                  |
| <kbd>`</kbd>               | Make the selected text lowercase                                                      |
| <kbd>u</kbd>, <kbd>U</kbd> | Undo / redo                                                                           |
| <kbd>Enter</kbd>           | Run the input, or insert a newline and switch to insert mode if it is incomplete      |

<kbd>d</kbd>, <kbd>y</kbd> and <kbd>p</kbd> return to normal mode, and <kbd>c</kbd> switches to insert mode. These Helix keys are not available yet: <kbd>;</kbd>, <kbd>,</kbd>, <kbd>J</kbd>, <kbd>G</kbd>, <kbd>X</kbd>, <kbd>&gt;</kbd>, <kbd>&lt;</kbd>, the <kbd>/</kbd>, <kbd>n</kbd> and <kbd>N</kbd> search commands, match mode (<kbd>m</kbd>), and the multi-cursor commands.

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

::: note
The `history.max_size`, `history.file_format`, `history.isolation` and `history.path` settings
must be set in `config.nu`. They can't be changed once the REPL has started. Setting
`$env.config.history.path` to `null` turns off the history file.
:::

## Hints

As you type, Reedline shows a hint in a dimmed color (`$env.config.color_config.hints`) after the
cursor. By default the hint is the most recent matching command from your history. Press
<kbd>→</kbd> or <kbd>End</kbd> to accept the whole hint, or <kbd>Ctrl</kbd>+<kbd>→</kbd> to accept
one word of it. Set `$env.config.show_hints = false` to turn hints off.

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

Each keybinding requires the next elements:

- name: A unique name for your keybinding. Assigning to `$env.config.keybindings` merges
  the new entries into the existing bindings by name: an entry with the same name and key
  as an existing binding replaces it, while an entry that reuses a name for a different key
  is added as another binding and prints a `Multiple keybindings share a name` warning.
  To clear every keybinding, assign an empty list (`$env.config.keybindings = []`).
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
- mode: emacs, vi_insert, vi_normal, vi_visual, helix_insert, helix_normal or
  helix_select (a single string or a list. e.g. [`vi_insert` `vi_normal`])
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
keybindings list | where type == events
```

And the syntax for `send` events is `event: { send: <NAME OF EVENT FROM LIST> }`.

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
keybindings list | where type == edits
```

The usual syntax for an `edit` is `event: { edit: <NAME OF EDIT FROM LIST> }`.
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
nothing to do. The `menu` event does this when a menu is already open, the other
menu events (such as `menunext`) when no menu is open, `up` and `down` when
there is no line or history entry to move to, `left` and `right` at the
ends of the line, the history-hint events when there is no hint to accept, and
`SwitchMode` when it can't switch (see [Send Type](#send-type)). Most other
events always succeed, so the `until` event stops as soon as it reaches them.

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

### Troubleshooting Keybinding Problems

Your terminal environment may not always propagate your key combinations on to Nushell the way you expect it to. You can use the command [`keybindings listen`](/commands/docs/keybindings_listen.md) to determine if certain keypresses are actually received by Nushell, and how.

## Menus

Thanks to Reedline, Nushell has menus that can help you with your day to day
shell scripting. Next we present the default menus that are always available
when using Nushell

Menus are configured in `$env.config.menus`. Assigning to this list merges your
entries into the default menus by `name`, so an entry named `completion_menu`
replaces the default completion menu instead of adding a second one, and
`$env.config.menus = []` does not remove the default menus.

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

By default, erasing text while a menu is open can close the menu. Set
`$env.config.completions.persistent_menus = true` to keep menus open while you edit.
The menu then updates its suggestions instead, and only closes when you accept a
suggestion or press <kbd>Esc</kbd> or <kbd>Ctrl</kbd>+<kbd>C</kbd>.

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
        tab_traversal: "vertical"   # Direction in which pressing <Tab> will cycle through options, "horizontal" or "vertical"
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
}
```

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
    ptop: "ps | sort-by cpu -r | first 15"
}
```

You can see the currently active abbreviations with [`abbr list`](/commands/docs/abbr_list.md):

```nu
abbr list
# => ╭───┬──────┬────────────────────────────────╮
# => │ # │ name │           expansion            │
# => ├───┼──────┼────────────────────────────────┤
# => │ 0 │ gs   │ git status                     │
# => │ 1 │ ll   │ ls -l                          │
# => │ 2 │ ptop │ ps | sort-by cpu -r | first 15 │
# => ╰───┴──────┴────────────────────────────────╯
```
