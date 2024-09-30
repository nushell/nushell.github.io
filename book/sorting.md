# Sorting

Nushell offers many ways of sorting data, and which method you reach for will depend on the problem and what kind of data you're working with. Let's take a look at some of the ways you might wish to sort data.

## Basic sorting

Sorting a basic list works exactly how you might expect:

```nu
> [9 3 8 1 4 6] | sort
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 3 │
│ 2 │ 4 │
│ 3 │ 6 │
│ 4 │ 8 │
│ 5 │ 9 │
╰───┴───╯
```

However, things get a bit more complex when you start combining types. For example, let's see what happens when we have a list with numbers _and_ strings:

```nu
> ["foobar" 4 9 2 1 "hello" 8 6] | sort
╭───┬────────╮
│ 0 │      1 │
│ 1 │      2 │
│ 2 │      4 │
│ 3 │      6 │
│ 4 │      8 │
│ 5 │      9 │
│ 6 │ foobar │
│ 7 │ hello  │
╰───┴────────╯
```

We can see that the numbers are sorted in order, and the strings are sorted to the end of the list, also in order. If you are coming from other programming languages, this may not be quite what you expect. In Nushell, as a general rule, **data can always be sorted without erroring**.

::: tip
If you _do_ want a sort containing differing types to error, see [strict sort](#strict-sort).
:::

## Custom sorts

### Strict sort
