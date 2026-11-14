# Any

|                       |                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| **_Description:_**    | When used in a type annotation or signature, matches any type. In other words, a "superset" of other types. |
| **_Annotation:_**     | `any`                                                                                                       |
| **_Literal syntax:_** | N/A - Any literal value can be assigned to an `any` type                                                    |
| **_Casts:_**          | N/A                                                                                                         |

## Additional Language Notes

1. A variable defined as `any` takes on the type of its currently assigned value. In other words, `describe` will never return the `any` type itself. See the examples below.

2. `any` is commonly used to:

   - Annotate a variable that can accept any type

     Example - Declare a mutable variable that can accept any type

     ```nu
     let q = false

     # Start by assigning a null (nothing type) to x
     # to indicate that it hasn't been processed
     mut x: any = null

     if $q {
       $x = 'Yes'
     } else {
       $x = 'No'
     }

     $x
     # => No
     $x | describe
     # => string
     ```

   - Annotate a command parameter that can accept any type

   ```nu
   def takes-anything [v: any]: nothing -> string {
     $v | describe
   }

   takes-anything 42
   # => int
   takes-anything foo
   # => string
   ```

   - Annotate a type signature for a command that can accept any type as input or might output any type

   ```nu
   def passthrough []: any -> any { $in }
   "Virat Kohli" | passthrough | describe
   # => string

   {||} | passthrough | describe
   # => closure
   ```

3. Annotate a `list` to indicate that it can hold any type

   As with other `any` values, `describe` reports the types of the values the list actually holds. A list with mixed element types is shown as a `oneof<...>` of those types. Only an empty list reports `list<any>`:

   ```nu
   let various: list<any> = [ true false 42 'Nushell' ]
   $various | describe
   # => list<oneof<bool, int, string>>
   [] | describe
   # => list<any>
   ```

   Two mixes don't become a `oneof`. Ints mixed with floats widen to `number`. Records widen to a `table` that keeps only the columns every record has, so records with no key in common give a `table` with no columns. A column whose values differ in type becomes a `oneof` inside the table:

   ```nu
   [1 2.0] | describe
   # => list<number>
   [{a: 1} {a: 2, b: 3}] | describe
   # => table<a: int>
   [{a: 1} {b: 2}] | describe
   # => table
   [{a: 1} {a: "x"}] | describe
   # => table<a: oneof<int, string>>
   ```
