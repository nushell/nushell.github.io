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

This implementation:

- Will provide `-p` and `-i` (with descriptions) as possibly completions for `ssh -`.
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

## Limitations

There are a few limitations to the current `extern` syntax. In Nushell, flags and positional arguments are very flexible—flags can precede positional arguments, flags can be mixed into positional arguments, and flags can follow positional arguments. Many external commands are not this flexible. There is not yet a way to require a particular ordering of flags and positional arguments to the style required by the external.

The second limitation is that some externals require flags to be passed using `=` to separate the flag and the value. In Nushell, the `=` is a convenient optional syntax and there's currently no way to require its use.

In addition, externals called via the caret sigil (e.g., `^ssh`) are not recognized by `extern`.

Finally, some external commands support `-long` arguments using a single leading hyphen. Nushell `extern` syntax can not yet represent these arguments.
