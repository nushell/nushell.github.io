# Working with SQLite

Nushell has SQLite built in. You can open a SQLite database file and run SQL against it, or keep tables in an in-memory database that the `stor` commands manage. The [`query db`](/commands/docs/query_db.md) and [`schema`](/commands/docs/schema.md) commands work on both.

## Database files and the in-memory database

Most tasks look the same for both kinds of database. The difference is how you get the database value and how you write to it:

| Task                         | Database file                                      | In-memory database                                 |
| ---------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| Get the database             | `open app.db`                                      | `stor open`                                        |
| Run SQL                      | `open app.db \| query db "..."`                    | `stor open \| query db "..."`                      |
| Read a table                 | `open app.db \| get users`                         | `stor open \| get users`                           |
| Create a table               | `into sqlite`, or a `create table` with `query db` | `stor create`, or a `create table` with `query db` |
| Add rows                     | `into sqlite`, or an `insert` with `query db`      | `stor insert`                                      |
| Change or delete rows        | An `update` or `delete` with `query db`            | `stor update`, `stor delete`                       |
| List tables and columns      | `schema`                                           | `schema`                                           |
| Keep the data after Nu exits | It's already a file                                | `stor export`, and `stor import` to load it        |

[Loading data](./loading_data.md#sqlite) shows how to open a file, run queries with parameters, and write tables with [`into sqlite`](/commands/docs/into_sqlite.md), including the SQLite column type `into sqlite` picks for each Nushell type. When you `get` a table, some filters such as `select` and `first` become part of the SQL query, for the in-memory database too, as [Tables from a SQLite file](/lang-guide/chapters/filters/selecting_data.md#tables-from-a-sqlite-file) explains.

Both kinds of database are the same kind of value, which `describe` shows as `SQLiteDatabase`. `query db`, `schema`, `get`, and `columns` take either one. `query db` and `schema` fail with a `Can't convert to database` error on any other input.

## The in-memory database

The `stor` commands work on a single SQLite database that lives in memory. Reach for it when you're collecting data during a session and want SQL over it, such as a join or a `group by`, without making a file. Each `stor` command returns the whole database, so in the REPL every one of them prints all of its tables. Add `| ignore` when you don't want that.

```nu
stor create --table-name people --columns {name: str, age: int, admin: bool}
# => ╭────────┬────────────────╮
# => │ people │ [list 0 items] │
# => ╰────────┴────────────────╯
stor insert --table-name people --data-record {name: Alice, age: 30, admin: true} | ignore
[[name age]; [Bob 25] [Carol 41]] | stor insert --table-name people | ignore
stor open | query db "select * from people where age > ?" --params [26]
# => ╭───┬───────┬─────┬───────╮
# => │ # │ name  │ age │ admin │
# => ├───┼───────┼─────┼───────┤
# => │ 0 │ Alice │  30 │     1 │
# => │ 1 │ Carol │  41 │       │
# => ╰───┴───────┴─────┴───────╯
```

### How long it lasts

Nushell creates the database when it starts, before it reads the [configuration files](./configuration.md), so `config.nu` can already use `stor`. The database lasts until that Nushell process exits. Nothing saves it for you, so use [`stor export`](#saving-and-loading) if you want to keep it.

Everything that runs in one Nushell process shares the database: each line you type in the REPL, scripts you `source`, custom commands, and closures, including closures that `par-each` runs on other threads and background jobs started with `job spawn`:

```nu
stor create --table-name hits --columns {n: int} | ignore
1..5 | par-each {|n| stor insert --table-name hits --data-record {n: $n} } | ignore
stor open | query db "select count(*) as rows from hits"
# => ╭───┬──────╮
# => │ # │ rows │
# => ├───┼──────┤
# => │ 0 │    5 │
# => ╰───┴──────╯
```

Another Nushell process has its own database, which starts out empty. That includes a script you run as `nu script.nu` and a command you run with `nu -c`.

### Creating tables

[`stor create`](/commands/docs/stor_create.md) makes a table from `--table-name` and a `--columns` record that maps each column name to a type name. The type names aren't Nushell types. Each one becomes a SQLite column type:

| Type name  | SQLite column type | Notes                                                                     |
| ---------- | ------------------ | ------------------------------------------------------------------------- |
| `int`      | `INTEGER`          |                                                                           |
| `float`    | `REAL`             |                                                                           |
| `str`      | `VARCHAR(255)`     | SQLite doesn't enforce the 255, so a longer string is stored in full      |
| `bool`     | `BOOLEAN`          | Stored as `1` or `0`                                                      |
| `datetime` | `DATETIME`         | A row inserted without this column gets the current time in UTC           |
| `json`     | `JSON`             | Lists and records are stored as JSON text and read back as Nushell values |
| `jsonb`    | `JSONB`            | Same as `json`                                                            |

Type names are case-insensitive. Any other name fails with `Unsupported column data type. Please use: int, float, str, bool, datetime, json, jsonb`. [`schema`](#looking-at-a-database-with-schema) shows what was created, including the default that a `datetime` column gets:

```nu
stor create --table-name events --columns {id: int, score: float, title: str, done: bool, at: datetime, meta: json, tags: jsonb} | ignore
stor open | schema | get tables.events.columns | select name type default
# => ╭───┬───────┬──────────────┬──────────────────────────────────────╮
# => │ # │ name  │     type     │               default                │
# => ├───┼───────┼──────────────┼──────────────────────────────────────┤
# => │ 0 │ id    │ INTEGER      │                                      │
# => │ 1 │ score │ REAL         │                                      │
# => │ 2 │ title │ VARCHAR(255) │                                      │
# => │ 3 │ done  │ BOOLEAN      │                                      │
# => │ 4 │ at    │ DATETIME     │ STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') │
# => │ 5 │ meta  │ JSON         │                                      │
# => │ 6 │ tags  │ JSONB        │                                      │
# => ╰───┴───────┴──────────────┴──────────────────────────────────────╯
```

The table and column names go into the SQL statement as they are, without quotes. A name with a space in it, or a name that's an SQL keyword such as `order` or `group`, fails with a syntax error. Creating a table that already exists fails with `table people already exists`.

`stor create` can't declare a primary key, a `NOT NULL` or `UNIQUE` column, a foreign key, or an index. For those, send your own `CREATE TABLE` statement with `query db`. The `stor` commands work on the result like any other table:

```nu
stor open | query db "create table owners (name text primary key)" | ignore
stor open | query db "create table pets (id integer primary key, name text not null unique, owner text references owners(name))" | ignore
stor open | query db "create index pets_owner on pets (owner)" | ignore
```

SQLite checks foreign keys in the in-memory database. A row that points at a missing parent row, as in `stor insert --table-name pets --data-record {name: Rex, owner: Nobody}`, fails with `FOREIGN KEY constraint failed`.

### Adding rows

[`stor insert`](/commands/docs/stor_insert.md) adds one row from a record, given with `--data-record` or as input, or one row for each record in a list or table on the input. The record's keys pick the columns, so they can come in any order and a record can leave columns out. A column that's left out is `NULL`, except a `datetime` column, which gets the current time.

When you give both, `--data-record` wins and the input is ignored. This matters inside a closure, where the first command gets the closure's input without you passing it. `$rows | each {|row| stor insert --table-name people --data-record $row }` inserts `$row` once for each row.

Each row is a separate `INSERT` statement. When one row fails, the rows before it stay in the table, and the rows after it aren't inserted. Here `Eve` fails with `table people has no column named email`, so `Dan` goes in and `Fay` doesn't:

```nu
[{name: Dan, age: 31} {name: Eve, email: eve@example.com} {name: Fay, age: 27}] | stor insert --table-name people
stor open | query db "select name, age from people"
# => ╭───┬───────┬─────╮
# => │ # │ name  │ age │
# => ├───┼───────┼─────┤
# => │ 0 │ Alice │  30 │
# => │ 1 │ Bob   │  25 │
# => │ 2 │ Carol │  41 │
# => │ 3 │ Dan   │  31 │
# => ╰───┴───────┴─────╯
```

To make a batch all or nothing, wrap it in a transaction. Run `stor open | query db "begin"` before it, and `"commit"` or `"rollback"` after it.

The other errors you're likely to see are `no such table` when the table doesn't exist, `only record input data is supported` when the input holds something other than records, and `requires a table or a record` when there's neither input nor `--data-record`.

### How values are stored

`stor insert` and `stor update` convert values the way `into sqlite` does, as the table in [Loading data](./loading_data.md#sqlite) shows. A range, which `into sqlite` can't make a column for, is stored as JSON text such as `"1..3"`. A closure is an error.

SQLite then applies the column's type. A string of digits put in an `INTEGER` column is stored as an integer, and an integer put in a `str` column is stored as text. A string that isn't a number stays text, even in an `INTEGER` column, and SQLite doesn't reject it.

`query db` returns what's stored: integers, floats, strings, binary, and `null`. Columns declared as `JSON` or `JSONB` come back as Nushell lists and records. Nothing else is converted back, so a `bool` column reads as `1` or `0` and a `datetime` column reads as a string. Use [`into bool`](/commands/docs/into_bool.md) and [`into datetime`](/commands/docs/into_datetime.md) when you need the Nushell types:

```nu
stor insert --table-name events --data-record {id: "7", title: Launch, done: true, tags: [beta web]} | ignore
stor open | query db "select id, title, done, tags from events"
# => ╭───┬────┬────────┬──────┬──────────────╮
# => │ # │ id │ title  │ done │     tags     │
# => ├───┼────┼────────┼──────┼──────────────┤
# => │ 0 │  7 │ Launch │    1 │ ╭───┬──────╮ │
# => │   │    │        │      │ │ 0 │ beta │ │
# => │   │    │        │      │ │ 1 │ web  │ │
# => │   │    │        │      │ ╰───┴──────╯ │
# => ╰───┴────┴────────┴──────┴──────────────╯
```

The time a `datetime` column fills in by default, such as `2026-11-14 23:30:42.144`, is in UTC but has no offset, so `into datetime` reads it as local time. Add a `Z` before converting it: `$row.at + "Z" | into datetime`.

### Reading the database

[`stor open`](/commands/docs/stor_open.md) returns the database. Pipe it to `query db` to run SQL, `get` a table to read it, or [`schema`](#looking-at-a-database-with-schema) to see its structure. `stor open` on its own shows every table, and `stor open | columns` lists their names. `query db` runs any SQL statement on it, such as `create view`, `alter table`, or `begin`.

### Changing and deleting rows

[`stor update`](/commands/docs/stor_update.md) sets the columns in a record, given with `--update-record` or as input, on every row that matches `--where-clause`. It takes a single record, and a table on the input fails with `only record input data is supported`. [`stor delete`](/commands/docs/stor_delete.md) deletes the rows that match `--where-clause`.

The where clause is a string of SQL without the `WHERE` keyword, and it goes into the statement as it is. Put single quotes around strings inside it. The values in the update record are sent to SQLite as parameters, so they don't need quoting:

```nu
stor update --table-name people --update-record {age: 26} --where-clause "name = 'Bob'" | ignore
stor delete --table-name people --where-clause "age > 40" | ignore
stor open | query db "select * from people"
# => ╭───┬───────┬─────┬───────╮
# => │ # │ name  │ age │ admin │
# => ├───┼───────┼─────┼───────┤
# => │ 0 │ Alice │  30 │     1 │
# => │ 1 │ Bob   │  26 │       │
# => │ 2 │ Dan   │  31 │       │
# => ╰───┴───────┴─────┴───────╯
```

::: warning
Leave out `--where-clause` and both commands act on everything. `stor update` changes every row, and `stor delete` drops the whole table, columns and all.

```nu
{admin: true} | stor update --table-name people | ignore
stor open | query db "select name, admin from people"
# => ╭───┬───────┬───────╮
# => │ # │ name  │ admin │
# => ├───┼───────┼───────┤
# => │ 0 │ Alice │     1 │
# => │ 1 │ Bob   │     1 │
# => │ 2 │ Dan   │     1 │
# => ╰───┴───────┴───────╯
```

:::

A where clause that names a missing column fails with `no such column`. `stor delete` fails with `no such table` when the table doesn't exist, and with `FOREIGN KEY constraint failed` when you drop a table while rows in another table still point at it.

[`stor reset`](/commands/docs/stor_reset.md) drops every table. It turns foreign key checks off while it does that, so tables that point at each other don't stop it.

### Saving and loading

[`stor export`](/commands/docs/stor_export.md) writes the whole database to a new SQLite file, which you can read later with `open`. It never overwrites a file. When the file exists, it fails with `output file already exists`.

[`stor import`](/commands/docs/stor_import.md) replaces the in-memory database with a copy of a SQLite file. Tables that aren't in the file are gone afterwards. A path that doesn't exist fails with `File not found`, and a file that isn't a SQLite database fails with `file is not a database`. In both cases the in-memory database doesn't change.

Give both commands an absolute path, which [`path expand`](/commands/docs/path_expand.md) builds from a relative one:

```nu
stor export --file-name ('backup.db' | path expand) | ignore
stor create --table-name notes --columns {text: str} | ignore
stor import --file-name ('backup.db' | path expand) | columns
# => ╭───┬────────╮
# => │ 0 │ people │
# => │ 1 │ hits   │
# => │ 2 │ events │
# => │ 3 │ owners │
# => │ 4 │ pets   │
# => ╰───┴────────╯
```

The `notes` table, made after the export, is gone. To copy one table from a file and keep what you have, attach the file with SQL instead:

```nu
[[sku price]; [A1 9.5] [B2 12.0]] | into sqlite prices.db --table-name prices
stor open | query db "attach database ? as saved" --params [('prices.db' | path expand)] | ignore
stor open | query db "create table prices as select * from saved.prices" | ignore
stor open | query db "detach database saved" | ignore
stor open | get prices
# => ╭───┬─────┬───────╮
# => │ # │ sku │ price │
# => ├───┼─────┼───────┤
# => │ 0 │ A1  │  9.50 │
# => │ 1 │ B2  │ 12.00 │
# => ╰───┴─────┴───────╯
```

To carry the database from one session to the next, export it before you quit and import it in `config.nu`:

```nu
# in config.nu
let saved = $nu.data-dir | path join stor.db
if ($saved | path exists) { stor import --file-name $saved | ignore }
```

Since `stor export` won't overwrite, delete the old file first: `rm --force $saved; stor export --file-name $saved`.

## Looking at a database with `schema`

[`schema`](/commands/docs/schema.md) describes the tables in a database file or in the in-memory database. It returns a record with a `tables` record inside, which has an entry for each table. Each entry holds four lists:

- `columns`: each column's position (`cid`), `name`, declared `type`, whether it's `notnull`, its `default`, and its place in the primary key (`pk`, `0` when it isn't part of it)
- `constraints`: the indexes SQLite made for `UNIQUE` constraints (`origin` is `u`) and for primary keys that aren't an `integer primary key` (`origin` is `pk`)
- `foreign_keys`: each `column_name` that points at another table, with the `ref_table` and `ref_column` it points at
- `indexes`: every index on the table, whether a constraint or `create index` made it, with one row for each indexed column

For the `pets` table [created above](#creating-tables):

```nu
stor open | schema | get tables.pets
# => ╭──────────────┬────────────────────────────────────────────────────────╮
# => │              │ ╭───┬─────┬───────┬─────────┬─────────┬─────────┬────╮ │
# => │ columns      │ │ # │ cid │ name  │  type   │ notnull │ default │ pk │ │
# => │              │ ├───┼─────┼───────┼─────────┼─────────┼─────────┼────┤ │
# => │              │ │ 0 │ 0   │ id    │ INTEGER │ 0       │         │ 1  │ │
# => │              │ │ 1 │ 1   │ name  │ TEXT    │ 1       │         │ 0  │ │
# => │              │ │ 2 │ 2   │ owner │ TEXT    │ 0       │         │ 0  │ │
# => │              │ ╰───┴─────┴───────┴─────────┴─────────┴─────────┴────╯ │
# => │              │ ╭───┬─────────────────────────┬─────────────┬────────╮ │
# => │ constraints  │ │ # │          name           │ column_name │ origin │ │
# => │              │ ├───┼─────────────────────────┼─────────────┼────────┤ │
# => │              │ │ 0 │ sqlite_autoindex_pets_1 │ name        │ u      │ │
# => │              │ ╰───┴─────────────────────────┴─────────────┴────────╯ │
# => │              │ ╭───┬─────────────┬───────────┬────────────╮           │
# => │ foreign_keys │ │ # │ column_name │ ref_table │ ref_column │           │
# => │              │ ├───┼─────────────┼───────────┼────────────┤           │
# => │              │ │ 0 │ owner       │ owners    │ name       │           │
# => │              │ ╰───┴─────────────┴───────────┴────────────╯           │
# => │              │ ╭───┬─────────────────────────┬─────────────┬───────╮  │
# => │ indexes      │ │ # │          name           │ column_name │ seqno │  │
# => │              │ ├───┼─────────────────────────┼─────────────┼───────┤  │
# => │              │ │ 0 │ sqlite_autoindex_pets_1 │ name        │ 0     │  │
# => │              │ │ 1 │ pets_owner              │ owner       │ 0     │  │
# => │              │ ╰───┴─────────────────────────┴─────────────┴───────╯  │
# => ╰──────────────┴────────────────────────────────────────────────────────╯
```

Every value in these lists is a string, numbers included, so compare `pk` with `"1"` rather than `1`. Views and triggers aren't listed. A file works the same way:

```nu
[[name age]; [Alice 30] [Bob 25]] | into sqlite people.db --table-name people
open people.db | schema | get tables.people.columns | select name type pk
# => ╭───┬──────┬─────────┬────╮
# => │ # │ name │  type   │ pk │
# => ├───┼──────┼─────────┼────┤
# => │ 0 │ name │ TEXT    │ 0  │
# => │ 1 │ age  │ INTEGER │ 0  │
# => ╰───┴──────┴─────────┴────╯
```
