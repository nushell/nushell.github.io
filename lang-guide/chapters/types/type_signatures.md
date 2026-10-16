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
