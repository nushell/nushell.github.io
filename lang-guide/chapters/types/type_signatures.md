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
def my-filter []: nothing -> list { [] }

# Multiple Input/Return type signatures on a custom command
def my-other-filter []: [
  nothing -> list
  range -> list
] { [] }
```

The body of a command with an output type must produce a value of that type. An empty body (`{ }`) outputs its input, so `def my-filter []: nothing -> list { }` is rejected with `nu::parser::output_type_mismatch`.

For a further discussion on custom command signatures please refer to: [Custom Commands](/book/custom_commands.html)
And also: [Pipeline Input-Output Signature](/book/custom_commands.html#pipeline-input-output-signature)

## Kinds of type signatures

There are 3 forms of valid type signatures in Nu:

- Basic: E.g. `int`, `bool`, `string`, etc.
- Compound:
  - `list<string>`,
    `record<type: int, bar: string>`,
    `table<name: string, size: filesize>`
- Union: `oneof<int, string>` matches a value of any of the listed types.

  When a literal argument is passed to a `oneof` parameter, it is parsed as the first listed type it matches, except that the text-like types (`string`, `path`, `directory`, `glob`, `cell-path`, `external_arg` and `any`) are always tried last. The order in which the types are written doesn't matter:

  ```nu
  def show [x: oneof<string, list<string>>] { $x | describe }
  show [foo bar]
  # => list<string>
  show foo
  # => string
  ```

  A literal that looks like one of the other types gets that type, so with `oneof<string, int>`, `007` arrives as the int `7`. Quote it (`"007"`) to pass the text. A parameter declared as plain `string` is unaffected.

Any of these can be given a name with a [type alias](#type-aliases).

## Which values a type accepts

An annotation accepts values of its own type and of its subtypes. These are the subtype rules:

- `any` accepts every value.
- `number` accepts `int` and `float` values.
- `glob` accepts a `string`, but `string` doesn't accept a `glob`. Convert it with `into string` first.
- `cell-path` accepts a `string` or an `int`, which is why `get $key` works with a plain string or int variable.
- `list<T>` accepts any list whose item type `T` accepts, so a `list<int>` can be passed where a `list<number>` is expected. A plain `list` accepts every list.
- `record<a: T>` accepts any record with a field `a` that `T` accepts. The record may have other fields too. A plain `record` accepts every record.
- `table<a: T>` follows the same rule for columns. A table is also accepted as a `list<record<...>>` with the same columns, and the other way around.
- `oneof<A, B>` accepts whatever `A` or `B` accepts.

For example, a command that needs a `name` field takes any record that has one:

```nu
def name-of [r: record<name: string>] { $r.name }
name-of {name: "nu", stars: 30}
# => nu
```

A record without that field is rejected when the call is parsed:

```nu
def name-of [r: record<name: string>] { $r.name }; name-of {title: "nu"}
# => Error: nu::parser::type_mismatch
# =>
# =>   × Type mismatch.
# =>    ╭─[repl_entry #1:1:60]
# =>  1 │ def name-of [r: record<name: string>] { $r.name }; name-of {title: "nu"}
# =>    ·                                                            ──────┬──────
# =>    ·                                                                  ╰── expected record<name: string>, found record<title: string>
# =>    ╰────
```

The parser can only reject a value whose type it knows can't fit. When the known type is wider than the annotation, as with a variable declared `any` or `number`, the parser lets it through and the value itself is checked when the command runs. A `number` that holds `2` can be passed to an `int` parameter, but one that holds `1.5` fails:

```nu
def double [x: int] { $x * 2 }; let y: number = 1.5; double $y
# => Error: nu::shell::cant_convert
# =>
# =>   × Can't convert to int.
# =>    ╭─[repl_entry #1:1:61]
# =>  1 │ def double [x: int] { $x * 2 }; let y: number = 1.5; double $y
# =>    ·                                                             ─┬
# =>    ·                                                              ╰── can't convert float to int
# =>    ╰────
```

`glob` to `string` is different. A `glob` is never a `string`, so passing a `glob` variable to a `string` parameter is a parse error ("expected string, found glob").

Custom values, such as a `semver` from `into semver` or a value from a plugin, also pass the parser when the parameter is a `list`, `record` or `table`, and are checked when the command runs. A `semver` doesn't fit any of these, so `def f [r: record] { $r }; f ('1.2.3' | into semver)` fails at runtime with "can't convert semver to record".

## Type aliases

`type Name = <type>` gives a type signature a name. The name can then be used wherever a type signature can: parameters, flags, rest parameters, closure parameters, input/output types, `let`/`mut`/`const` annotations, inside other types, and on the right-hand side of another `type`:

```nu
type Point = record<x: float, y: float>
type Polygon = list<Point>

def first-x [poly: Polygon]: nothing -> float { $poly.0.x }
first-x [{x: 1.0, y: 2.0} {x: 3.0, y: 4.0}]
# => 1.0
```

An alias is not a new type. The parser replaces the name with its type at every use, so a value never "has" the alias as its type, and `describe`, `help`, `scope commands` and error messages show the expanded type:

```nu
type Point = record<x: float, y: float>
let p: Point = {x: 1.0, y: 2.0}
$p | describe
# => record<x: float, y: float>
```

An alias can't refer to itself:

```nu
type Tree = list<Tree>
# => Error: nu::parser::type_alias_self_reference
# =>
# =>   × Type alias `Tree` refers to itself.
# =>    ╭─[repl_entry #1:1:18]
# =>  1 │ type Tree = list<Tree>
# =>    ·                  ──┬─
# =>    ·                    ╰── refers to itself
# =>    ╰────
# =>   help: type aliases can't be recursive
```

A [custom completer](/book/custom_completions.md) is part of a parameter, not of its type, so it goes on the parameter that uses the alias, as in `def paint [color: Color@[red green blue]] { $color }`. Attaching one to the alias is an error:

```nu
type Color = string@[red green blue]
# => Error: nu::parser::error
# =>
# =>   × Unexpected custom completer in type spec
# =>    ╭─[repl_entry #1:1:14]
# =>  1 │ type Color = string@[red green blue]
# =>    ·              ───────────┬───────────
# =>    ·                         ╰── Type specifications do not support custom completers
# =>    ╰────
```

Where a type alias is visible, and how modules export and import one, is covered under [`type`](../declarations.md#type) in Declarations.

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
as the existence or not of the occurrence of the flag.

A typed flag that is not passed has the value `null`:

```nu
def f [--count: int, --verbose] { {count: $count, verbose: $verbose} }
f | to nuon
# => {count: null, verbose: false}
f --count 3 --verbose | to nuon
# => {count: 3, verbose: true}
```
