# if/else

The `if` expression evaluates a condition and then chooses to run a block based on the condition.

For example, you can print "yes", based on a true condition:

```nu
if true {
  print yes
} else {
  print no
}
```

Alternately, you can print "no", based on a false condition:

```nu
if false {
  print yes
} else {
  print no
}
```

The `else` part of `if` is optional. If not provided, if a condition is false, the `if` expression returns `null`.

The code that follows the `else` is an expression rather than a block, allowing any number of follow-on `if` expressions as well as other types of expressions. For example, this expression returns 100: `if false { 1 } else 100`.
