# Spread operator

Nushell has a spread operator (`...`) for unpacking lists and records. You may be familiar with it
if you've used JavaScript before. Some languages use `*` for their spread/splat operator. It can
expand lists or records in places where multiple values or key-value pairs are expected.

There are three places you can use the spread operator:

- [In list literals](#in-list-literals)
- [In record literals](#in-record-literals)
- [In command calls](#in-command-calls)

## In list literals

Suppose you have multiple lists you want to concatenate together, but you also want to intersperse
some individual values. This can be done with `append` and `prepend`, but the spread
operator lets you do it more easily.

```nushell
> let dogs = [Spot, Teddy, Tommy]
> let cats = ["Mr. Humphrey Montgomery", Kitten]
> [
    ...$dogs
    Polly
    ...($cats | each { |it| $"($it) \(cat\)" })
    ...[Porky Bessie]
    ...Nemo
  ]
╭───┬───────────────────────────────╮
│ 0 │ Spot                          │
│ 1 │ Teddy                         │
│ 2 │ Tommy                         │
│ 3 │ Polly                         │
│ 4 │ Mr. Humphrey Montgomery (cat) │
│ 5 │ Kitten (cat)                  │
│ 6 │ Porky                         │
│ 7 │ Bessie                        │
│ 8 │ ...Nemo                       │
╰───┴───────────────────────────────╯
```

The below code is an equivalent version using `append`:
```nushell
> $dogs |
    append Polly |
    append ($cats | each { |it| $"($it) \(cat\)" }) |
    append [Porky Bessie] |
    append ...Nemo
```

You may have noticed that the last item of the list above is `"...Nemo"`. This is because inside
list literals, it can only be used to spread lists, not strings. As such, inside list literals, it can
only be used before variables (`...$foo`), subexpressions (`...(foo)`), and list literals (`...[foo]`).

The `...` also won't be recognized as the spread operator if there's any whitespace between it and
the next expression:

```nushell
> [ ... [] ]
╭───┬────────────────╮
│ 0 │ ...            │
│ 1 │ [list 0 items] │
╰───┴────────────────╯
```

This is mainly so that `...` won't be confused for the spread operator in commands such as `mv ... $dir`.

## In record literals

Similarly, you can use the spread operator to merge multiple records together. For example:

Inside list literals, it can only be used before variables (`...$foo`), subexpressions (`...(foo)`), and record literals (`...{foo:bar}`).

## In command calls

TODO: do this when behavior for command calls is finalized
