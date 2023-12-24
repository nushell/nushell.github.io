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

Let's say you have a record with some configuration information and you want to add more fields to
this record:

```nushell
> let config = { path: /tmp, limit: 5 }
```

You can make a new record with all the fields of `$config` and some new additions using the spread
operator. You can use the spread multiple records inside a single record literal.

```nushell
> {
    ...$config,
    users: [alice bob],
    ...{ url: example.com },
    ...(sys | get mem)
  }
╭────────────┬───────────────╮
│ path       │ /tmp          │
│ limit      │ 5             │
│            │ ╭───┬───────╮ │
│ users      │ │ 0 │ alice │ │
│            │ │ 1 │ bob   │ │
│            │ ╰───┴───────╯ │
│ url        │ example.com   │
│ total      │ 8.3 GB        │
│ free       │ 2.6 GB        │
│ used       │ 5.7 GB        │
│ available  │ 2.6 GB        │
│ swap total │ 2.1 GB        │
│ swap free  │ 18.0 MB       │
│ swap used  │ 2.1 GB        │
╰────────────┴───────────────╯
```

Similarly to lists, inside record literals, the spread operator can only be used before variables (`...$foo`),
subexpressions (`...(foo)`), and record literals (`...{foo:bar}`). Here too, there needs to be no
whitespace between the `...` and the next expression for it to be recognized as the spread operator.

## In command calls

TODO: do this when behavior for command calls is finalized
