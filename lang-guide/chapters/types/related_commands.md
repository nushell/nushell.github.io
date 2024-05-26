# Commands that interact with types

The main type inspector in Nu is the `describe` command that
takes any data type on input and reports its type signature.

E.g.

```nu
[foo bar baz] | describe
# => list<string>
```

## Commands

- `describe`
- `inspect`
- `help`
- `into (subcommands)`
  - The into commands are used to cast one type into another.
- `ast`
  - In the branches of abstract syntax tree that describe the type of some element
