# Best practices

This page is a working document collecting syntax guidelines and best practices we have discovered so far.
The goal of this document is to eventually land on a canonical Nushell code style, but as for now it is still work in
progress and subject to change. We welcome discussion and contributions.

Keep in mind that these guidelines are not required to be used in external repositories (not ours), you can change them in the
way you want, but please be consistent and follow your rules.

All escape sequences should not be interpreted literally, unless directed to do so. In other words,
treat something like `\n` like the new line character and not a literal slash followed by `n`.

## Formatting

### Defaults

**It's recommended to** assume that by default no spaces or tabs allowed, but the following rules define where they are allowed.

### Basic

- **It's recommended to** put one space before and after pipe `|` symbol, commands, subcommands, their options and arguments.
- **It's recommended to** never put several consecutive spaces unless they are part of string.
- **It's recommended to** omit commas between list items.

Correct:

```nushell
'Hello, Nushell! This is a gradient.' | ansi gradient --fgstart '0x40c9ff' --fgend '0xe81cff'
```

Incorrect:

```nushell
# - two many spaces after "|": 2 instead of 1
'Hello, Nushell! This is a gradient.' |  ansi gradient --fgstart '0x40c9ff' --fgend '0xe81cff'
```

#### One-line format

One-line format is a format for writing all commands in one line.

**It's recommended to** default to this format:

1. unless you are writing scripts
2. in scripts for lists and records unless they either:
   1. more than 80 characters long
   2. contain nested lists or records
3. for pipelines less than 80 characters long not containing items should be formatted with
   a long format

Rules:

1. parameters:
   1. **It's recommended to** put one space after comma `,` after block or closure parameter.
   2. **It's recommended to** put one space after pipe `|` symbol denoting block or closure parameter list end.
2. block and closure bodies:
   1. **It's recommended to** put one space before closing block or closure curly brace `}`.
3. records:
   1. **It's recommended to** put one space after `:` after record key.
   2. **It's recommended to** put one space after comma `,` after key value.
4. lists:
   1. **It's recommended to** put one space after comma `,` after list value.
5. surrounding constructs:
   1. **It's recommended to** put one space before opening square `[`, curly brace `{`, or parenthesis `(` if preceding symbol is not the same.
   2. **It's recommended to** put one space after closing square `]`, curly brace `}`, or parenthesis `)` if following symbol is not the same.

Correct:

```nushell
[[status]; [UP] [UP]] | all {|el| $el.status == UP }
[1 2 3 4] | reduce {|it, acc| $it + $acc }
[1 2 3 4] | reduce {|it acc| $it + $acc }
{x: 1, y: 2}
{x: 1 y: 2}
[1 2] | zip [3 4]
[]
(1 + 2) * 3
```

Incorrect:

```nushell
# too many spaces before "|el|": no space is allowed
[[status]; [UP] [UP]] | all { |el| $el.status == UP }

# too many spaces before ",": no space is allowed
[1 2 3 4] | reduce {|it , acc| $it + $acc }

# too many spaces before "x": no space is allowed
{ x: 1, y: 2}

# too many spaces before "[3": one space is required
[1 2] | zip  [3 4]

# too many spaces before "]": no space is allowed
[ ]

# too many spaces before ")": no space is allowed
(1 + 2 ) * 3
```

#### Multi-line format

Multi-line format is a format for writing all commands in several lines. It inherits all rules from one-line format
and modifies them slightly.

**It's recommended to** default to this format:

1. while you are writing scripts
2. in scripts for lists and records while they either:
   1. more than 80 characters long
   2. contain nested lists or records
3. for pipelines more 80 characters long

Rules:

1. general:
   1. **It's required to omit** trailing spaces.
2. block and closure bodies:
   1. **It's recommended to** put each body pipeline on a separate line.
3. records:
   1. **It's recommended to** put each record key-value pair on separate line.
4. lists:
   1. **It's recommended to** put each list item on separate line.
5. surrounding constructs:
   1. **It's recommended to** put one `\n` before opening square `[`, curly brace `{`, or parenthesis `(` if preceding symbol (one out of these: `[`, `{`, `(`, `]`, `}`, `)`) is not the same.
   2. **It's recommended to** put one `\n` after closing square `]`, curly brace `}`, or parenthesis `)` if following symbol (one out of these: `[`, `{`, `(`, `]`, `}`, `)`) is not the same.

Correct:

```nushell
[[status]; [UP] [UP]] | all {|el|
    $el.status == UP
}

[1 2 3 4] | reduce {|it, acc|
    $it + $acc
}

{x: 1, y: 2}

[
  {name: "Teresa", age: 24},
  {name: "Thomas", age: 26}
]

let selectedProfile = (for it in ($credentials | transpose name credentials) {
    echo $it.name
})
```

Incorrect:

```nushell
# too many spaces before "|el|": no space is allowed (like in one-line format) 
[[status]; [UP] [UP]] | all { |el|
    # too few "\n" before "}": one "\n" is required
    $el.status == UP}

# too many spaces before "2": one space is required (like in one-line format)
[1  2 3 4] | reduce {|it, acc|
    $it + $acc
}

{
   # too many "\n" before "x": one-line format required as no nested lists or record exist
   x: 1, 
   y: 2
}

# too few "\n" before "{": multi-line format required as there are two nested records
[{name: "Teresa", age: 24},
  {name: "Thomas", age: 26}]

let selectedProfile = (
    # too many "\n" before "foo": no "\n" is allowed
    for it in ($credentials | transpose name credentials) {
        echo $it.name
})
```

## Options and parameters of custom commands

- **It's recommended to** keep count of all positional parameters less than or equal to 2, for remaining inputs use options. Assume that command can expect source and destination parameter, like `mv`: source and target file or directory.
- **It's recommended to** use positional parameters unless they can't be used due to rules listed here or technical restrictions.
  For instance, when there are several kinds of optional parameters (but at least one parameter should be provided)
  use options. Great example of this is `ansi gradient` command where at least foreground or background must be passed.
- **It's recommended to** provide both long and short options.

## Documentation

- **It's recommended to** provide documentation for all exported entities (like custom commands) and their
  inputs (like custom command parameters and options).
