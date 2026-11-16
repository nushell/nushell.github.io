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

    Durations written with units, including several units in a row, are detected too:

    ```nu
    "1hr 3min" | detect type | describe
    # => duration
    ```

    It tries these types in order and returns the first one that converts:

    | Type       | Text that converts                                                                                                                                                                                            |
    | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `bool`     | `true` or `false`, in any case                                                                                                                                                                                |
    | `float`    | A number with a decimal point or an exponent (`3.14`, `5.`, `6.02e23`), or `inf` or `NaN`                                                                                                                     |
    | `int`      | Digits with an optional sign, also grouped in threes with `,` or `_` (`1,234`, `1_000`)                                                                                                                       |
    | `datetime` | A date written `M/D/YYYY`, `D/M/YYYY`, `YYYY-MM-DD` or `YYYY/MM/DD` (`-` and `/` are interchangeable), optionally with a time after `T` or a space. A year-first date with a time can end in `Z` or an offset |
    | `duration` | One or more numbers with duration units, separated by spaces (`1hr 3min`, `1.5hr`, `-1hr`)                                                                                                                    |

    Anything else comes back unchanged as a string. That includes text that only looks like a value, such as `12,34`, `1kb`, `0x10`, `null`, `nan`, `01:30:00` and an int too large for 64 bits. A string with leading or trailing whitespace is also returned as is, even `" 42"`.

    A date such as `01/02/2025` could be read either way, and `detect type` reads it month first, as January 2. `--prefer-dmy` reads it day first. When only one reading is a real date, as with `13/02/2025`, that one is used without the flag. A date-only string is midnight in the local time zone, unlike a date-only literal, which is midnight UTC.

    `--prefer-filesize` (`-f`) makes an int a file size of that many bytes: `"1024" | detect type -f` is `1.0 kB`.

- `ast`
  - In the branches of abstract syntax tree that describe the type of some element
