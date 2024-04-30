# Variables

Nushell values can be assigned to named variables using the `let`, `const`, or `mut` keywords.
After creating a variable, we can refer to it using `$` followed by its name.

## Types of Variables

### Immutable Variables

An immutable variable cannot change its value after declaration. They are declared using the `let` keyword,

```nu
> let val = 42
> print $val
42
```

However, they can be 'shadowed'. Shadowing means that they are redeclared and their initial value cannot be used anymore within the same scope.

```nu
> let val = 42                   # declare a variable
> do { let val = 101;  $val }    # in an inner scope, shadow the variable
101
> $val                           # in the outer scope the variable remains unchanged
42
```

### Mutable Variables

A mutable variable is allowed to change its value by assignment. These are declared using the `mut` keyword.

```nu
> mut val = 42
> $val += 27
> $val
69
```

There are a couple of assignment operators used with mutable variables

| Operator | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| `=`      | Assigns a new value to the variable                                        |
| `+=`     | Adds a value to the variable and makes the sum its new value               |
| `-=`     | Subtracts a value from the variable and makes the difference its new value |
| `*=`     | Multiplies the variable by a value and makes the product its new value     |
| `/=`     | Divides the variable by a value and makes the quotient its new value       |
| `++=`    | Appends a list or a value to a variable                                    |

> **Note**
>
> 1. `+=`, `-=`, `*=` and `/=` are only valid in the contexts where their root operations
>    are expected to work. For example, `+=` uses addition, so it can not be used for contexts
>    where addition would normally fail
> 2. `++=` requires that either the variable **or** the argument is a
>    list.

#### More on Mutability

Closures and nested `def`s cannot capture mutable variables from their environment. For example

```nu
# naive method to count number of elements in a list
mut x = 0

[1 2 3] | each { $x += 1 }   # error: $x is captured in a closure
```

To use mutable variables for such behaviour, you are encouraged to use the loops

### Constant Variables

A constant variable is an immutable variable that can be fully evaluated at parse-time. These are useful with commands that need to know the value of an argument at parse time, like [`source`](/commands/docs/source.md), [`use`](/commands/docs/use.md) and [`plugin use`](/commands/docs/plugin_use.md). See [how nushell code gets run](how_nushell_code_gets_run.md) for a deeper explanation. They are declared using the `const` keyword

```nu
const script_file = 'path/to/script.nu'
source $script_file
```

## Variable Names

Variable names in Nushell come with a few restrictions as to what characters they can contain. In particular, they cannot contain these characters:

```
.  [  (  {  +  -  *  ^  /  =  !  <  >  &  |
```

It is common for some scripts to declare variables that start with `$`. This is allowed, and it is equivalent to the `$` not being there at all.

```nu
> let $var = 42
# identical to `let var = 42`
```
