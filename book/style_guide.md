# Best practices

This page is a working document collecting syntax guidelines and best practices we have discovered so far.
The goal of this document is to eventually land on a canonical Nushell code style, but as for now it is still work in
progress and subject to change. We welcome discussion and contributions.

Keep in mind that they are not required to be used in external repositories (not ours), you can change them in the
way you want, but please be consistent and follow your rules.

## Formatting

### Defaults

**It's recommended to** assume that by default no spaces or tabs allowed, but the following rules define where they are allowed.

### Basic

- **It's recommended to** put one space before and after pipe `|` symbol, commands, subcommands, their options and arguments.
- **It's recommended to** omit commas between list items.

Correct:

```nushell
'Hello, Nushell! This is a gradient.' | ansi gradient --fgstart '0x40c9ff' --fgend '0xe81cff'
```

Incorrect:

```nushell
'Hello, Nushell! This is a gradient.' |  ansi gradient --fgstart '0x40c9ff' --fgend '0xe81cff' # two many spaces after "|": 2 instead of 1
```

#### One-line format

One-line format is a format for writing all commands in one line.

1. parameters:
   1. **It's recommended to** put no spaces before and after pipe `|` symbol denoting block or closure parameter list beginning.
   2. **It's recommended to** put one space after comma `,` after block or closure parameter parameter.
   3. **It's recommended to** put no space before and one space after pipe `|` symbol denoting block or closure parameter list end.
2. block and closure bodies:
   1. **It's recommended to** put one space before closing block or closure curly brace `}`.
3. records:
   1. **It's recommended to** put one space before first record key and after last record key value.
   2. **It's recommended to** put one space after `:` after record key.
   3. **It's recommended to** put one space after comma `,` after key value.
4. lists:
   1. **It's recommended to** put no spaces before first list value and after last list value.
   2. **It's recommended to** put one space after comma `,` after list value.
5. surrounding constructs:
   1. **It's recommended to** put one space before opening square `[` or curly brace `{` if preceding symbol is not the same.
   2. **It's recommended to** put one space after closing square `]` or curly brace `}` if following symbol is not the same.
   3. **It's recommended to** put no spaces between square `[]` or curly brackets `{}` with nothing between them.

Correct:

```nushell
[[status]; [UP] [UP]] | all {|el| $el.status == UP }
[1 2 3 4] | reduce {|it, acc| $it + $acc }
{ x: 1, y: 2 }
[1 2] | zip [3 4]
[]
```

Incorrect:

```nushell
[[status]; [UP] [UP]] | all { |el| $el.status == UP } # two many spaces before "|el|": 2 instead of 0
[1 2 3 4] | reduce {|it , acc | $it + $acc } # two many spaces after "it": 1 instead of 0
                                             # two many spaces before "| $it + $acc": 1 instead of 0
{x: 1, y : 2 } # two few spaces before "x: 1": 0 instead of 1
               # two many spaces before ": 2": 1 instead of 0
[1 2] | zip  [3 4] # two many spaces before "[3 4]": 2 instead of 1
[ ] # two many spaces before "]": 1 instead of 0
```

#### Multi-line format

Multi-line format is a format for writing all commands in several lines. It inherits all rules from one-line format
and modifies them slightly.

1. general:
   1. **It's recommended to omit** trailing spaces.
2. block and closure bodies:
   1. **It's recommended to** put each body pipeline on a separate line.
3. records:
   1. **It's recommended to** put each record key-value pair on separate line.
4. lists:
   1. **It's recommended to** put each list item on separate line.
5. surrounding constructs:
   1. **It's recommended to** put one `\n` before opening square `[` or curly brace `{` if preceding symbol is not the same.
   2. **It's recommended to** put one `\n` after closing square `]` or curly brace `}` if following symbol is not the same.

Correct:

```nushell
[[status]; [UP] [UP]] | all {|el|
    $el.status == UP
}

[
    1
    2
    3
    4
] | reduce {|it, acc|
    $it + $acc
}

{
    x: 1,
    y: 2
}

[
  {
    name: "Teresa",
    age: 24
  },
  {
    name: "Thomas",
    age: 26
  }
]
```

Incorrect:

```nushell
[[status]; [UP] [UP]] | all {|el|
    $el.status == UP } # two many spaces before "}": 1 instead of "\n"

[ 1 # two many spaces before "1": 1 instead of "\n"
    2
    3
    4
] | reduce {|it, acc|
    $it + $acc
}

{ x: 1, # two many spaces before "x: 1": 1 instead of "\n"
    y: 2
}

[{ # two few "\n" before "{": 0 instead of 1
    name: "Teresa",
    age: 24
  } , # two many spaces before ",": 1 instead of 0
  {
    name: "Thomas",
    age: 26
  }
]
```

### Spreading long lines

- **It's recommended to** default to short format unless you are writing scripts.
- **It's recommended to** default to short format in scripts for lists and records unless they more than 80 characters long
  or contain nested lists or records.
- **It's recommended to** use long format for pipelines more than 80 characters long.

Correct (in scripts):

```nushell
[1, 2, 3, 4] | reduce {|it, acc|
    $it + $acc
}

[1 2 3 4] | reduce {|it acc|
    $it + $acc
}

[
  { name: "Teresa", age: 24 },
  { name: "Thomas", age: 26 }
]
```

Incorrect (in scripts):

```nushell
[
   1,
   2,
   3,
   4
] | reduce {|it, acc|
    $it + $acc
}

[
   1
   2
   3
   4
] | reduce {|it acc|
    $it + $acc
}

[
  {
    name: "Teresa",
    age: 24
  },
  {
    name: "Thomas",
    age: 26
  }
]
```

## Options and parameters of custom commands

- **It's recommended to** keep count of all positional parameters less than or equal to 4, for remaining inputs use options.
- **It's recommended to** use positional parameters unless they can't be used due to rules listed here or technical restrictions.
  For instance, when there are several kinds of optional parameters (but at least one parameter should be provided)
  use options. Great example of this is `ansi gradient` command where at least foreground or background must be passed.
- **It's recommended to** provide both long and short options.

## Documentation

- **It's recommended to** provide documentation for all exported entities (like custom commands) and their
  inputs (like custom command parameters and options).
