# Type signatures

## The infix type operators

- `:` - Read as `is type of`
- `->` - Read as "becomes type of" or as `to type of` in custom commands in the return type position

## Nushell constructs with type signatures

There are several syntactic forms that can have type signatures:

- Variable declarations
- Parameter declarations in custom commands and closures
- Input and Return type declarations for custom commands

The following code snippets illustrates these kinds of type signatures:

```nu
# Variable declaration
let x: int = 9

# Parameter declaration in custom commands
def my-command [x: int, y: string] { }

# Parameter declaration in closures
do {|nums : list<int>| $nums | describe} [ 1 2 3 ]

# Input and Return type declaration on a custom command
def my-filter []: nothing -> list { }

# Multiple Input/Return type signatures on a custom command
def my-filter []: [
  nothing -> list
  range -> list
] { }
```

For a further discussion on custom command signatures please refer to: [Custom Commands](/book/custom_commands.html)
And also: [Command Signature](/book/command_signature.html)

## Kinds of type signatures

There are 3 forms of valid type signatures in Nu:

- Basic: E.g. `int`, `bool`, `string`, etc.
- Compound:
  - `list<string>`,
    `record<type: int, bar: string>`,
    `table<name: string, age: int>`
- Sum types (aka type alternatives): E.g. `oneof<int, string>`

### List types

- `list<something>` - Read as `list of elements of type something`

For example, `list<int>` would specify a list of integers:

```nu
def sum_two []: list<int> -> int { $in.0 + $in.1 }

[1 11 111 1111] | sum_two
# => 12

["abc" "def" "ghi"] | sum_two
# error: command doesn't support list<string> input
```

- `list` - If no element type is specified, this is equivalent to `list<any>`.

```nu
def second []: list -> any { $in.1 }

[1 11 111 1111] | second
# => 11

["abc" "def" "ghi"] | second
# => def
```

### Record types

- `record<key_name: value_type>` - Read as `record containing a key key_name with value of type value_type`

```nu
def greet [person: record<name: string>] {
  $"Hello, ($person.name)!"
}

greet { name: Ellie }
# => Hello, Ellie!

greet "Who"
# error: a string is not a record

greet { given_name: Bob }
# error: the record is missing a "name" key

greet { name: [] }
# error: the record's "name" value can't be coerced to string

# The record may contain more keys besides the specified ones though:
greet { name: Bob, age: 32 }
# => Hello, Bob!
```

We may also specify multiple keys that a record must possess as a comma separated `name: value_type` list. E.g.:

```nu
def greet [person: record<name: string, birthday: datetime, job: string>] {
  print $"Hello, ($person.name) the ($person.job)!"
  if ($person.birthday | format date "%m-%d") == (date now | format date "%m-%d") {
    print "Happy birthday!"
  }
}

greet { name: Bob, job: Builder, birthday: 1998-11-28 }
# => Hello, Bob the Builder!
```

Similar to lists, `record` or `record<>` specifies a record with any keys (or even an empty record):

```nu
def first_key []: record -> string {
  columns | first
}

{ name: Ellie } | first_key
# => name

{ given_name: Bob } | first_key
# => given_name

# this will pass type checking (but produce a runtime error)
{} | first_key
```

### Table types

- `table<column_name: value_type>` - Read as `table containing a column column_name with values of type value_type`

Tables are just lists of records, so table types work very similarly to record types:

```nu
let data: table<date: datetime, temps: list<number>, condition: string> = [
    [date                        temps                                   condition      ];
    [2022-02-01T14:30:00+05:00,  [38.24, 38.50, 37.99, 37.98, 39.10],   'sunny'       ],
    [2022-02-02T14:30:00+05:00,  [35.24, 35.94, 34.91, 35.24, 36.65],   'sunny'       ],
    [2022-02-03T14:30:00+05:00,  [35.17, 36.67, 34.42, 35.76, 36.52],   'cloudy'      ],
    [2022-02-04T14:30:00+05:00,  [39.24, 40.94, 39.21, 38.99, 38.80],   'rain'        ]
]

def temp_avg [] : table<date: datetime, temps: list<number>> -> table<date: datetime, avg_temp: number> {
  insert avg_temp {|record| $record.temps | math avg}
  | reject temps
}

# Note that both the input and output table contain a column "condition", which
# is not mentioned in the type signature of temp_avg. This is fine.
$data | temp_avg
# => ╭───┬─────────────┬───────────┬──────────╮
# => │ # │    date     │ condition │ avg_temp │
# => ├───┼─────────────┼───────────┼──────────┤
# => │ 0 │ 3 years ago │ sunny     │    38.36 │
# => │ 1 │ 3 years ago │ sunny     │    35.60 │
# => │ 2 │ 3 years ago │ cloudy    │    35.71 │
# => │ 3 │ 3 years ago │ rain      │    39.44 │
# => ╰───┴─────────────┴───────────┴──────────╯
```

### Sum types

- `oneof<a, b, c>` - Read: one of `a`, `b` or `c`

Example:

```nu
def foo [
    param: oneof<binary, string>
] {
  if ($param | describe) == "binary" {
    $param | first 3
  } else {
    $param | str substring 0..<3
  }
}
```

## Custom command parameters and flags

This section does not enumerate all of the various ways to create parameters
and flags to custom commands. Here we only discuss the type annotation to both
types of parameters.

### Parameters

If a parameter to a custom command or a closure is type-annotated, then it will
have the `:` operator after the name followed by the type signature
and before any default value.

E.g., a fully articulated parameter with a type annotation:

```nu
def fully [some?: int = 9] { $some }
```

The above command has an optional parameter of type `int` with a default value of 9.

### Type annotations for flags.

If a flag has a type annotation, then it expects an argument matching that type
which can be `any` for all types. If the type is missing, then the flag is assumed
to be either present or not present at the call site.

Thus, within the body of the command, the type of that flag's named variable
binding will be `bool` and its value will be `true` if the flag is present
and `false` if not present.

You cannot use the `bool` type as a flag annotation as that is the same
as the the existence or not of the occurrence of the flag.
