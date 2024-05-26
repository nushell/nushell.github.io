# Closure

What it is: A closure is an anonymous function which is also often called a lambda function.

Annotation: `closure`

Closures are used in Nu extensively as parameters to iteration style commands like `each`, `filter`, and `reduce`, to name but a few. A closure acts like a custom command that can be invoked either explicitly or by other commands. Closures can take parameters, return values and be passed to commands, either builtin or custom. You cannot pass a closure to an external command, they are reserved only for Nu usage You can also assign a closure to a variable, be included as elements in a list or as a value in a record.

Closures can also consume input from a pipeline, as well as pass data further to the next item in a pipeline.

As closures are closely related to functions or commands, they can also have parameters that are typed. The special variable $in (the value of
the input from the pipeline) is also available to a closure. You can also pass closures themselves into a pipe line assuming the next command knows how to consume it. Closures can be returned from a custom command and can also be returned from another closure.

## Declaring a closure

```nu
let cl = {|i: int, j: int| $i + $j }
```

The above example assigns a closure that takes 2 parameters, both int types, and assignns it to the immutable variable `$cl`. The type signatures `: int` are optional.

```nu
# A closure that checks if its parameter is even
#returns a bool either true or false
let evens = {|it| ($it mod 2) == 0 }
```

## Invoking a closure

```nu
# Assuming $cl is the closure declared above
do $cl 34 8
# => 42
```

Using `$cl` from the previous example, we invoke it with the `do` keyword and pass it integers, 34 and 8. When it runs, it computes the sum and returns 42.

## Using a closure as a parameter to an iteration command

Let's say we have a list of ints and want to only have a list of even ints.
We can use our `$evens` closure to filter our list.

```nu
# assuming $evens has been declared as above
1..10 | filter $evens
# => [2, 4, 6, 8, 10]
```

## Capturing values from an outer scope

Closures can also remember values declared in some outer scope and then use them for processing when invoked. If it must be done explicitly. There are some restrictions on the kind of external values that can be closed over. Only immutable variables like those created with the `let` keyword or parameters to a custom command can be captured in a closure. Mutable variables created with the `mut` keyword cannot be captured in a closure. However, you can mutate an `$env` variable if used by the `--env` flag passed to the `do` keyword.

```nu
def "create lambda" [x: int] {
  {|it| $it * $x }
}
let doubler = (create lambda 2)
# Now invoke it with 7
do $doubler 7
# => 14

let tripler = (create lambda 3)
do $tripler 7
# => 21
```

If we try to create a closure that attempts to capture a mutable variable we get a compile error:

```nu
if true {
  mut x = 9
  do {|it| $it + $x }
}
# => Error: Capture of mutable variable.
```

## Sample of commands using closure

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
