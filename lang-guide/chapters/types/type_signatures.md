# Type signatures

## The infix type operators

- `:` - Read as `is type of`
- `->` - Read as "becomes type of" or as `to type of` in custom commands in the return type position

## Nushell constructs with type signatures

There are several syntactic forms that can have type signatures:

- Variable declarations
- Parameter declarations in custom commands and closures
- Input type declarations to custom commands
- Return type declarations from custom commands

The following code snippets illustrates these kinds of type signatures:

```nu
# Variable declaration
let x: int = 9

# Parameter declaration in custom commands
def my-command [x: int, y: string] { }

# Parameter declaration in closures
do {|nums : list<int>| $nums | describe} [ 1 2 3 ]
```

For a further discussion on custom command signatures please refer to: [Custom Commands](/book/custom_commands.html)
And also: [Command Signature](/book/command_signature.html)

## Kinds of type signatures

There are 3 forms of valid type signatures in Nu:

- Basic: E.g. `int`, `bool`, `string`, etc.
- Compound:
  - `list<string>`,
    `record<type: int, bar: string>`

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

## Closure parameters

(TODO: Needs update for changes in 0.92)

In Nu, closures have a simpler kind of type annotations for parameters
than custom commands. Basically, closures can have type annotations for their
parameters but not optional or default values.

E.g. An annotated closure:

```nu
let cl = {|x: int, y: string| $"x: ($x), y: ($y)" }
do $cl 88 'hello'
# => x: 88, y: hello
```
