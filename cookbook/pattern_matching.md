---
title: Pattern Matching
---

# Pattern Matching

## Using the `match` keyword

Like many other languages, nu offers a [`match`](https://www.nushell.sh/commands/docs/match.html) keyword. Usually this is used as a slightly more ergonomic version of `if-else` statements if you have many branches

```nu
[black red yellow green purple blue indigo] | each {|c|
  match $c {
    "black" => "classy"
    "red" | "green" | "blue" => "fundamental"
    "yellow" | "purple" => "vibrant"
    _ => "innovative"
  }
}
# => ╭───┬─────────────╮
# => │ 0 │ classy      │
# => │ 1 │ fundamental │
# => │ 2 │ vibrant     │
# => │ 3 │ fundamental │
# => │ 4 │ vibrant     │
# => │ 5 │ fundamental │
# => │ 6 │ innovative  │
# => ╰───┴─────────────╯
```

The equivalent in `if-else` statements would be:

```nu
[black red yellow green purple blue indigo] | each {|c|
  if ($c == "black") {
   "classy"
  } else if ($c in ["red", "green", "blue"]) {
    "fundamental"
  } else if ($c in ['yellow', "purple"]) {
    "vibrant"
  } else {
    "innovative"
  }
}
```

As you can see you can also match several alternatives in one arm by separating them with `|`. Also notice the `_` case at the end, this is called the default arm and is used in case none of the other patterns match. Note also that in the case that cases overlap the first matching pattern will be used (just like with `if-else` statements):

```nu
[yellow green] | each {|c|
  match $c {
    "green" => "fundamental"
    "yellow" | "green" => "vibrant"
  }
}
# => ╭───┬─────────────╮
# => │ 0 │ vibrant     │
# => │ 1 │ fundamental │
# => ╰───┴─────────────╯
```

## Pattern matching on types

You can use the [`describe`](https://www.nushell.sh/commands/docs/describe.html) command to get more info about the types of values. For example:

```nu
{one: 1 two: 2} | describe
# => record<one: int, two: int>
```

```nu
[{a: 1 b: 2} {a: 2 b:3 }] | describe
# => table<a: int, b: int>
```

Together with `match` and some clever regex use you can do quite powerful type matching. For example, let's say we wanted to implement a `str append` function that would work on both strings and lists. On strings it would work as expected, on lists of strings, it should append the same string to each element of the list. Using `match` one might do that like so:

```nu
def "str append" [tail: string]: [string -> string, list<string> -> list<string>] {
    let value = $in
    match ($value | describe | str replace --regex '<.*' '') {
        "string" => { $value ++ $tail },
        "list" => { $value | each {|el| $el ++ $tail} },
        _ => $value
    }
}
```

The `$value | describe` would output for example `string` if the input was a string, and for example `list<any>` for a list containing multiple different types. The regex, removes everything after the first `<` leaving us just with `list`.

Then with the `match` statement we can handle the different types separately. Finally in the default case we just return the input unaltered so that other types can simply pass through this filter without issue.
Also note that we have to capture the `$in` variable on the first statement of the function to still have access to it in each `match` arm.

With this implementation we can check that the command works as expected:

```nu
use std/assert
assert equal ("foo" | str append "/") "foo/"
assert equal (["foo", "bar", "baz"] | str append "/") ["foo/", "bar/", "baz/"]
```
