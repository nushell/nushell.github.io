# Any

What it is: The `any` type is an universal type that matches anything.

What are possible values: There is no literal version of an `any` type. Any literal value can be assigned to an `any` type.

In other words, the `any` type is a superset of all other types.

Annotation: `any`

## Example 1

Declaring an mutable variable that can accept any type.

```nu
let q = false
mut x: any = 12

if $q {
  $x = 'true'
} else {
  $x = 'false'
}
$x
# =>'false' a string
```

## Example 2

Create a custom command that takes `any` type and returns `any` type.

```nu
def takes-anything [v: any] -> any {
  $v | describe
}

takes-anything 42
# => int
takes-anything foo
# => string
```
