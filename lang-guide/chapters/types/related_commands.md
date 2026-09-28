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
  - `describe --detailed` (`-d`) also shows the type of every nested value.
- `inspect`
- `help`
- `into (subcommands)`
  - The into commands are used to cast one type into another.
  - `into value` converts a custom value (for example a `semver` or a `matrix`) into a regular Nushell value.
- `detect type`

  - Infers a type from a string:

    ```nu
    "42" | detect type | describe
    # => int
    ```

- `ast`
  - In the branches of abstract syntax tree that describe the type of some element
