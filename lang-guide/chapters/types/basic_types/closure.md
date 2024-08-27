# Closure

|                       |                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | An anonymous function, often called a lambda function, which accepts parameters and _closes over_ (i.e., uses) variables from outside its scope |
| **_Annotation:_**     | `closure`                                                                                                                                       |
| **_Literal Syntax:_** | `{\|args\| expressions }` where `\|args\|` is optional.                                                                                         |
| **_Casts:_**          | N/A                                                                                                                                             |
| **_See also:_**       | [Types of Data - Closures](/book/types_of_data.md#closures)                                                                                     |

Closures are used in Nu extensively as parameters to iteration style commands like `each`, `filter`, and `reduce`, to name but a few. A closure acts like a custom command that can be invoked either explicitly or by other commands. Closures can take parameters, return values and be passed to commands, either builtin or custom.

## Language Notes:

1. A closure can be directly invoked using the [`do`](/commands/docs/do.md) command.

   ```nu
   > do {|a,b| $a + $b } 34 8
   42
   ```

1. The `|args|` list can also contain 0 arguments (`||`) or more than one argument `|arg1,arg2|`
1. When there are 0 arguments, the `||` is optional as long as the closure cannot be mistaken for a record (which also uses the curly-brace style).

   - An empty (no-op) closure can be represented as `{||}`

1. As in other languages with closures, an important feature is their ability to "close over" variables from the parent scope and use their values even after the parent's scope has ended.

   In the following example:

   - `create_greeter` is a custom command that returns a closure
   - It accepts a `$greeting` argument
   - When the `create_greeter` command's block ends, the `$greeting` variable is out of scope
   - However, the closure that is returned has "captured" the value represented by `$greeting` and can still access it later when the closure itself is called.

   ```nu
   > def create_greeter [ greeting: string ]: nothing -> closure {
       {|name| $"($greeting), ($name)" }
     }

   > let greet = create_greeter "Hello"
   # Invoke the closure with `do`
   > do $greet Dalija
   Hello, Dalija
   > do $greet Ryan
   Hello, Ryan

   # Redefine greet with a new greeting
   > let greet = create_greeter "Aloha"
   > do $greet Kai
   Aloha, Kai
   ```

   Note that the `create_greeter` only needs to be defined once.

1. There are some restrictions on the kind of external values that can be closed over. Only immutable variables like those created with the `let` keyword or parameters to a custom command can be captured in a closure. Mutable variables created with the `mut` keyword cannot be captured in a closure. However, you can mutate an `$env` variable if used by the `--env` flag passed to the `do` keyword.

   If we try to create a closure that attempts to capture a mutable variable we get a compile error:

   ```nu
   if true {
     mut x = 9
     do {|p| $p + $x }
   }
   # => Error: Capture of mutable variable.
   ```

1. You cannot pass a closure to an external command; they are reserved only for Nu usage.
1. As with other types, you can also assign a closure to a variable, and closures can be included as values in a list or record.

1. You can also use [pipeline input as `$in`](pipelines.html#pipeline-input-and-the-special-in-variable) in most closures instead of providing an explicit parameter. For example:

   ```nu
   1..10 | each { print $in }
   ```

1. You can also pass closures themselves into a pipeline assuming the next command knows how to consume it. For example, the `do` example can be rewritten as:

   ```nu
   > {|a,b| $a + $b} | do $in 34 8
   43
   ```

1. As seen above, closures can be returned from a custom command. They can also be returned from another closure.

1. As closures are closely related to functions or commands, their parameters can be typed.

## Common commands that can be used with a `closure`

- `all`
- `any`
- `collect`
- `do`
- `each`
- `explain`
- `filter`
- `group-by`
- `interleave`
- `items`
- `par-each`
- `reduce`
- `skip until`
- `skip while`
- `take until`
- `tee`
- `update`
- `upsert`
- `zip`
