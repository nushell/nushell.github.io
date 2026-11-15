# Externs

Using external commands (a.k.a. binaries or applications) is a fundamental feature of any shell. Nushell allows custom commands to take advantage of many of its features, such as:

- Parse-time type checking
- Completions
- Syntax highlighting

Support for these features is provided using the `extern` keyword, which allows a full signature to be defined for external commands.

Here's a short example for the `ssh` command:

```nu
module "ssh extern" {
  def complete_none [] { [] }

  def complete_ssh_identity [] {
    ls ~/.ssh/id_*
    | where {|f|
        ($f.name | path parse | get extension) != "pub"
      }
    | get name
  }

  export extern ssh [
    destination?: string@complete_none  # Destination Host
    -p: int                             # Destination Port
    -i: string@complete_ssh_identity    # Identity File
  ]
}
use "ssh extern" ssh
```

Notice that the syntax here is similar to that of the `def` keyword when defining a custom command. You can describe flags, positional parameters, types, completers, and more.

You don't have to write every extern by hand. [`generate completions`](/commands/docs/generate_completions.md) builds externs from a command's `--help` output, its man page, or existing fish, zsh or carapace completions. See [Generating completions for an external command](/cookbook/system.md#generating-completions-for-an-external-command).

This implementation:

- Will provide `-p` and `-i` (with descriptions) as possible completions for `ssh -`.
- Will perform parse-time type checking. Attempting to use a non-`int` for the port number will result in an error (and error-condition syntax highlighting).
- Will offer parse-time syntax highlighting based on the shapes of the arguments.
- Will offer any private key files in `~/.ssh` as completion values for the `-i` (identity) option
- Will not offer completions for the destination host. Without a completer that returns an empty list, Nushell would attempt to use the default "File" completer.

  See the [Nu_scripts Repository](https://github.com/nushell/nu_scripts/blob/main/custom-completions/ssh/ssh-completions.nu) for an implementation that retrieves hosts from the SSH config files.

::: tip Note
A Nushell comment that continues on the same line for argument documentation purposes requires a space before the ` #` pound sign.
:::

## Format Specifiers

Positional parameters can be made optional with a `?` (as seen above). The remaining (`rest`) parameters can be matched with `...` before the parameter name. For example:

```nu
export extern "git add" [
  ...pathspecs: path
  # …
]
```

A name with a space, such as `"git add"`, needs quotes in the declaration. A call written as `git add` then uses this signature, and the command still receives `add` as its first argument.

An extern without a rest parameter gets one anyway, so arguments and flags that the signature doesn't declare still reach the command. A signature only needs to list the parts you want completions and type checks for.

## How arguments reach the command

Nushell passes the arguments of an extern call on to the command, with a few changes to the declared flags:

```nu
extern printf [format: string, --verbose(-v), -x, --width: int]
printf '[%s]\n' -v -x -x --width=10 --depth=3 extra
# => [--verbose]
# => [-x]
# => [-x]
# => [--width]
# => [10]
# => [--depth=3]
# => [extra]
```

- A declared flag that has a long name arrives in its long form, even when you typed the short one, so `-v` became `--verbose`. When a command only accepts the short form, declare the flag without a long name, the way the `ssh` example above declares `-p` and `-i`.
- A declared flag given a value with `=` arrives as two arguments, `--width` and `10`. An undeclared flag, such as `--depth=3`, arrives as you typed it.
- A flag you repeat is passed each time, which suits options like `ssh -v -v`.

The parameters of an extern don't become variables, the way the parameters of a `def` do, so the signature may repeat a name that `def` would reject as a duplicate.

### Rejecting unknown flags with `--strict`

By default, a flag that the signature doesn't declare goes through to the command. With `extern --strict` (or `export extern --strict`), it's a parse error, the same as for a custom command. The flag can also come after the name, as in `extern printf --strict [...]`:

```nu
extern --strict printf [format: string, --verbose(-v)]
printf '[%s]\n' --depth=3
# => Error: nu::parser::unknown_flag
# =>
# =>   × The `printf` command doesn't have flag `depth`.
# =>    ╭─[repl_entry #2:1:17]
# =>  1 │ printf '[%s]\n' --depth=3
# =>    ·                 ────┬────
# =>    ·                     ╰── unknown flag
# =>    ╰────
# =>   help: Use `--help` to see available flags
```

The check happens while Nushell parses the call, so it only covers flags written out in the code. These still reach the command unchecked:

- a negative number such as `-10`, which counts as a value
- a flag built while the code runs, such as `--($name)`
- the items of a spread list, such as `...[--color]`
- anything after `--`
- `--help`, so the command can still show its own help (`-h` is checked like any other flag)

Positional arguments are never rejected, since the extern still has its rest parameter.

## Structured Output

Many external commands print machine-readable output when you pass a certain flag, such as `git status --porcelain` or `pip list --format=json`. Getting data from them means remembering that flag and the command that parses its output, every time. The [`@structured`](/commands/docs/attr_structured.md) attribute puts both in the `extern` declaration, so you write them once:

```nu
@structured [--porcelain] { lines | parse --regex '^(?<status>..) (?<file>.+)$' }
extern "git status" []
```

`@structured` takes two arguments:

- A list of arguments that make the command print machine-readable output. Each item in the list is one argument, so `[--porcelain]` adds one argument and `[-o json]` adds two, `-o` and `json`. Quote an item that contains spaces or `|`. Otherwise Nushell splits it into several items.
- A block that turns that output into data. The block receives the command's output as `$in`.

With this declaration, `git status` still prints git's usual text when you run it by itself:

```nu
git status
# => On branch main
# => Changes to be committed:
# =>   (use "git restore --staged <file>..." to unstage)
# =>         new file:   INSTALL.md
# =>
# => Changes not staged for commit:
# =>   (use "git add <file>..." to update what will be committed)
# =>   (use "git restore <file>..." to discard changes in working directory)
# =>         modified:   README.md
# =>
# => Untracked files:
# =>   (use "git add <file>..." to include in what will be committed)
# =>         notes.txt
```

Pipe it into a Nushell command, and Nushell runs `git status --porcelain` instead and passes the output through the block. You get a table:

```nu
git status | where status =~ M
# => ╭───┬────────┬───────────╮
# => │ # │ status │   file    │
# => ├───┼────────┼───────────┤
# => │ 0 │  M     │ README.md │
# => ╰───┴────────┴───────────╯
```

You don't need a filter to get the table. When you want all of the data, pipe the command into [`collect`](/commands/docs/collect.md). It's an internal command, so the output gets decoded, and it passes its input through unchanged:

```nu
git status | collect
# => ╭───┬────────┬────────────╮
# => │ # │ status │    file    │
# => ├───┼────────┼────────────┤
# => │ 0 │ A      │ INSTALL.md │
# => │ 1 │  M     │ README.md  │
# => │ 2 │ ??     │ notes.txt  │
# => ╰───┴────────┴────────────╯
```

Saving the output in a variable decodes it too:

```nu
let changes = git status
$changes | get file
# => ╭───┬────────────╮
# => │ 0 │ INSTALL.md │
# => │ 1 │ README.md  │
# => │ 2 │ notes.txt  │
# => ╰───┴────────────╯
```

When a command can print JSON, the block only needs [`from json`](/commands/docs/from_json.md):

```nu
@structured [--format=json] { from json }
extern "pip list" []

pip list | first 3
# => ╭───┬───────────┬─────────╮
# => │ # │   name    │ version │
# => ├───┼───────────┼─────────┤
# => │ 0 │ contourpy │ 1.4.0   │
# => │ 1 │ cycler    │ 0.12.1  │
# => │ 2 │ fonttools │ 4.66.1  │
# => ╰───┴───────────┴─────────╯
```

### When Nushell Decodes the Output

Nushell decides by looking at where the output of the extern goes. It adds the `@structured` arguments and runs the block when Nushell itself uses the output:

- Piped into an internal command: `git status | where status =~ M`, or `git status | collect` to get all of the data
- Saved in a variable: `let changes = git status`
- Used in a subexpression: `(git status).file`

In every other case, the command runs exactly as you typed it. That includes output that goes:

- To the terminal: `git status`
- Through `print`: `git status | print`
- To a file: `git status o> status.txt` or `git status | save status.txt`
- Into `complete`, `tee`, or `ignore`: `git status | complete`
- Into another external command or `run-external`: `git status | ^less`
- Into the same pipe as stderr: `git status o+e>| str trim`

The same rules apply when the extern is the last command of a custom command or a `do` block. After `def gs [] { git status }`, running `gs` prints git's text, and `gs | length` returns `3`, the number of changed files.

::: tip
Every internal command counts, including commands that work on text. `git status | lines` sends the decoded table to `lines`, not git's text. To get the text, call the command with the caret sigil, which always runs it as written:

```nu
^git status | lines | first 1
# => ╭───┬────────────────╮
# => │ 0 │ On branch main │
# => ╰───┴────────────────╯
```

:::

### Adding Your Own Arguments

Nushell puts the `@structured` arguments right after the command name, before any arguments you type. This extern gives `git log` an output format that is easy to split into columns:

```nu
@structured ["--format=%h|%an|%s"] { lines | split column "|" hash author subject }
extern "git log" []

git log | where author == "Ana Silva"
# => ╭───┬─────────┬───────────┬──────────────────╮
# => │ # │  hash   │  author   │     subject      │
# => ├───┼─────────┼───────────┼──────────────────┤
# => │ 0 │ 73e9a8f │ Ana Silva │ Print a greeting │
# => │ 1 │ 83c0a31 │ Ana Silva │ Initial commit   │
# => ╰───┴─────────┴───────────┴──────────────────╯
```

`git log -n 2 | where author == "Ana Silva"` runs `git log --format=%h|%an|%s -n 2`.

Because your arguments come last, a flag that changes the output format replaces the one from `@structured`. The block then gets output it wasn't written for. Here `--oneline` wins, so each whole line lands in the `hash` column:

```nu
git log --oneline -n 1 | first
# => ╭──────┬──────────────────────────╮
# => │ hash │ 73e9a8f Print a greeting │
# => ╰──────┴──────────────────────────╯
```

To use a different format, call the command with the caret sigil, such as `^git log --oneline`.

### More About `@structured`

- The block can read `$env`, constants, and `let` variables defined before the `extern`, just like the body of a `def`. It can't use `mut` variables.
- `@structured` only works on `extern`. Putting it on a `def` is a parse error.
- If an `extern` has more than one `@structured`, Nushell uses the last one.
- When the command fails, its error message is printed. What happens next depends on the block. A block that reads all of the output, such as `from json`, stops the pipeline with a non-zero exit code error that points at the call. A block that streams the output, such as `lines`, passes on whatever the command printed and doesn't raise an error.

`@structured` also works with `export extern`, so a module can share these declarations:

```nu
module git-data {
  @structured [--porcelain] { lines | parse --regex '^(?<status>..) (?<file>.+)$' }
  export extern "git status" []
}
use git-data "git status"
```

## Limitations

There are a few limitations to the current `extern` syntax. In Nushell, flags and positional arguments are very flexible—flags can precede positional arguments, flags can be mixed into positional arguments, and flags can follow positional arguments. Many external commands are not this flexible. There is not yet a way to require a particular ordering of flags and positional arguments to the style required by the external.

The second limitation is that some externals require flags to be passed using `=` to separate the flag and the value. In Nushell, the `=` is a convenient optional syntax and there's currently no way to require its use. A declared flag written with `=` even reaches the command as two arguments (see [How arguments reach the command](#how-arguments-reach-the-command)), so leave such a flag out of the signature to pass `--flag=value` as one argument.

In addition, externals called via the caret sigil (e.g., `^ssh`) are not recognized by `extern`.

Finally, some external commands support `-long` arguments using a single leading hyphen. Nushell `extern` syntax can not yet represent these arguments.
