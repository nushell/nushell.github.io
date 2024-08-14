# Block

|                       |                                                                       |
| --------------------- | --------------------------------------------------------------------- |
| **_Description:_**    | A syntactic form used by some Nushell keywords (e.g., `if` and `for`) |
| **_Annotation:_**     | N/A                                                                   |
| **_Literal Syntax:_** | N/A                                                                   |
| **_Casts:_**          | N/A                                                                   |
| **_See also:_**       | [Types of Data - Blocks](/book/types_of_data.md#blocks)               |

## Additional Language Notes

Unlike closures, blocks:

- Don't close over variables
- Don't have parameters
- Can't be passed as a value
- **Can** access mutable variable in the parent scope.

  Example - Mutate a variable inside the block used in an [`if`](/commands/docs/if.md) call

  ```nu
  mut x = 1
  if true {
      $x += 1000
  }
  print $x
  ```

  Result:

  ```nu
  1001
  ```

## Language Notes

- A block consists of any Nushell code enclosed in curly braces: `{`, `}` **in certain specific Nushell constructs.** In other cases code enclosed between braces is a closure.

- A block is not a data type like a closure and cannot be used to type a variable, custom command parameter, its input type, or its return type. You will get a type error if you try this.

  ```nu
  let b: block = {}
  Error:   × Blocks are not support as first-class values
    ╭─[entry #9:1:8]
  1 │ let p: block = {}
    ·        ──┬──
    ·          ╰── blocks are not supported as values
    ╰────
    help: Use 'closure' instead of 'block'
  ```

- A closure that takes no parameters may look like a block but is actually a closure. For example:

  ```nu
  > { echo foo } | describe
  closure
  # Alternatively
  > {|| echo foo } | describe
  closure
  ```

- A block establishes a new variable scope. Variables defined within the new scope having the same name as a variable in an outer scope will alias (a.k.a. shadow) that name for the lifetime of that block's scope. Example:

  ```nu
  # Outer scope:
  let x: int = 9
  if true {
    # inner scope
    let x: string = '8'
    $x | describe
    # => string
  }
  echo $x
  # => 9
  ```

## Mutable variables in blocks

Unlike closures, mutable variables are exposed within the inner scope of the block and can be modified. Once modified, the mutable variable is changed to the value to which it was set in the scope of the block.

E.g.

```nu
# This won't work
mut x = 9
do { $x += 1 }
# => Error: Capture of mutable variable.
# But this will work:
if true { $x += 1 }
# => 10
```

Note: Aliasing still occurs within the block:

```nu
mut x = 9
if true { mut x = 8; $x += 100; echo $x }
# => 108
echo $x
# => 9
```

::: important
For both the if/else and try expressions, the value of the last expression in the block for whichever clause is executed is returned. This is not true
for any of the looping constructs. If you try to assign the result of calling a for or while loop the type of the result will always be `nothing`.

To capture the result of a loop, you can define a mutable variable before the loop and mutate it inside the body of the loop. However, the more idiomatic Nushell way to do it is with a command like `each` which takes a closure. The last expression evaluated in the closure is returned and available to further items in the pipeline.
:::

## Common commands that use a block

- `if`/`else`
- `loop`
- `while`
- `for`
- `try`
  - But not the body of the catch clause which is always a closure
