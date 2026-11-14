# `record` commands

The `record` subcommands take a record and return a record, so you don't need to `transpose` it into a table and back. [Transforming Records](/book/working_with_records.md#transforming-records) in the Book introduces them. This page gives the exact rules.

Given a list of records (a table), each of the four handles every record on its own and streams the results. `record` by itself only prints its help text with the list of subcommands.

## `record where`

[`record where`](/commands/docs/record_where.md) keeps the fields for which a condition is `true`. The kept fields stay in their original order.

A row condition sees each field as a `{key, value}` record, the same rows `where` would see after `transpose key value`. A closure gets the key and the value as two arguments, and its `$in` is empty:

```nu
{c: 3, a: 1, b: 2} | record where value > 1
# => ╭───┬───╮
# => │ c │ 3 │
# => │ b │ 2 │
# => ╰───┴───╯
{size: 10, name: x} | record where {|key, value| ($value | describe) == int }
# => ╭──────┬────╮
# => │ size │ 10 │
# => ╰──────┴────╯
```

With `--keys` (`-k`) or `--values` (`-v`), the condition gets only the key or only the value. A row condition gets it as `$it`, a closure as its argument, and both get it as `$in`, so the closure needs no parameters:

```nu
{a: 1, b: 2, c: 3} | record where --keys $it != b
# => ╭───┬───╮
# => │ a │ 1 │
# => │ c │ 3 │
# => ╰───┴───╯
{a: 1, b: 2, c: 3} | record where --values { $in >= 2 }
# => ╭───┬───╮
# => │ b │ 2 │
# => │ c │ 3 │
# => ╰───┴───╯
```

Put `--keys` and `--values` before the condition, because a row condition takes everything after it.

## `record each`

[`record each`](/commands/docs/record_each.md) runs a closure on every field, with the key and the value as arguments and an empty `$in`, and builds a new record from what the closure returns. The closure can return:

- a record such as `{newkey: newvalue}`. Every field of it is added, so one field can become several.
- a two-element list `[newkey, newvalue]`.
- `null`, which drops the field.

Anything else is a type error (`expected a record, a two-element list, or null`).

```nu
{a: 1, b: 2} | record each {|key, value| [($key + _x) ($value * 2)] }
# => ╭─────┬───╮
# => │ a_x │ 2 │
# => │ b_x │ 4 │
# => ╰─────┴───╯
{a: 1, b: 2, c: 3} | record each {|key, value| if $value == 2 { null } else { {$key: $value} } }
# => ╭───┬───╮
# => │ a │ 1 │
# => │ c │ 3 │
# => ╰───┴───╯
{name: "Ada Lovelace"} | record each {|key, value| $value | split row " " | {first: $in.0, last: $in.1} }
# => ╭───────┬──────────╮
# => │ first │ Ada      │
# => │ last  │ Lovelace │
# => ╰───────┴──────────╯
```

The new fields are added in order. When two of them share a key, the later value replaces the earlier one but keeps the earlier position, as with [`into record`](/commands/docs/into_record.md):

```nu
{a: 1, b: 2, c: 3} | record each {|key, value| if $key == c { {a: 99} } else { {$key: $value} } }
# => ╭───┬────╮
# => │ a │ 99 │
# => │ b │ 2  │
# => ╰───┴────╯
```

## `record walk`

[`record walk`](/commands/docs/record_walk.md) visits every value nested anywhere in the record and puts the closure's result back in the same place. The closure gets the value and the cell path that leads to it from the top of the record. The value is also passed as `$in`:

```nu
{a: 1, b: [2 3]} | record walk { $in * 3 } | to nuon
# => {a: 3, b: [6, 9]}
```

Records and lists are walked into. Every other value is a leaf and goes to the closure. An empty record or list has no leaves, so it is kept as it is:

```nu
{a: {}, b: [], c: 1} | record walk {|value, path| $value * 10 } | to nuon
# => {a: {}, b: [], c: 10}
```

`--no-lists` treats each list as a leaf and passes it to the closure whole.

With `--containers` (`-c`), the closure also gets each nested record and list, after everything inside it has been walked, so it sees the updated container. The input record itself is never passed to the closure:

```nu
{a: {b: 1, c: [2 3]}} | record walk --containers {|value, path| print ($path | to nuon); $value } | ignore
# => $.a.b
# => $.a.c.0
# => $.a.c.1
# => $.a.c
# => $.a
```

For a list of records, each record is walked separately, and the paths start at that record:

```nu
[{a: {b: 1}} {a: {b: 2}}] | record walk {|value, path| $path | to nuon } | to nuon
# => [[a]; [{b: "$.a.b"}], [{b: "$.a.b"}]]
```

## `record apply`

[`record apply`](/commands/docs/record_apply.md) takes a record of closures. Each closure runs on the input field with the same key, gets the value as its argument and as `$in`, and its result replaces the value. A nested record of closures works the same way on a nested record field:

```nu
{port: "8080", tls: {enabled: "true", cert: x}} | record apply {port: {into int}, tls: {enabled: {into bool}}} | to nuon
# => {port: 8080, tls: {enabled: true, cert: x}}
```

Fields without a closure pass through unchanged. A closure for a field that the input doesn't have is skipped, unless `--strict` is given, which makes it a `column_not_found` error.

Every entry of the closures record has to be a closure or a nested record of closures. `record apply` checks that before it runs any closure, so a mistake fails without partly converting the record:

```nu
{a: 1, b: 2} | record apply {a: {|v| print ran; $v + 1}, b: 5}
# => Error: nu::shell::type_mismatch
# =>
# =>   × Type mismatch.
# =>    ╭─[repl_entry #1:1:61]
# =>  1 │ {a: 1, b: 2} | record apply {a: {|v| print ran; $v + 1}, b: 5}
# =>    ·                                                             ┬
# =>    ·                                                             ╰── expected a closure or a record of closures, found int
# =>    ╰────
```
