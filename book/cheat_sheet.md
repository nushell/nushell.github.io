# Nushell cheat sheet

## Data types

```nu
    > "12" | into int
```

> **converts string to integer**

---

```nu
    > date now | date to-timezone "Europe/London"
```

> **converts present date to provided time zone**

---

```nu
    > {'name': 'nu', 'stars': 5, 'language': 'Python'} | upsert language 'Rust'
```

> **updates a record's language and if none is specified inserts provided value**

---

```nu
    > [one two three] | to yaml
```

> **converts list of strings to yaml**

---

```nu
    > [[framework, language]; [Django, Python] [Lavarel, PHP]]
```

> **prints the table**

---

```nu
    > [{name: 'Robert' age: 34 position: 'Designer'}
     {name: 'Margaret' age: 30 position: 'Software Developer'}
     {name: 'Natalie' age: 50 position: 'Accountant'}
    ] | select name position
```

> **selects two columns from the table and prints their values**

## Strings

```nu
    > let name = "Alice"
    > $"greetings, ($name)!"
```

> **prints `greetings, Alice!`**

---

```nu
    > let string_list = "one,two,three" | split row ","
    $string_list

    ╭───┬───────╮
    │ 0 │ one   │
    │ 1 │ two   │
    │ 2 │ three │
    ╰───┴───────╯
```

> **splits the string with specified delimiter and saves the list to `string_list` variable**

---

```nu
    "Hello, world!" | str contains "o, w"
```

> **checks if a string contains a substring and returns `boolean`**

---

```nu
    let str_list = [zero one two]
    $str_list | str join ','
```

> **joins the list of strings using provided delimiter**

---

```nu
    > 'Hello World!' | str substring 4..8
```

> **created a slice from a given string with start (4) and end (8) indices**

---

```nu
    > 'Nushell 0.80' | parse '{shell} {version}'

    ╭───┬─────────┬─────────╮
    │ # │  shell  │ version │
    ├───┼─────────┼─────────┤
    │ 0 │ Nushell │ 0.80    │
    ╰───┴─────────┴─────────╯
```

> **parses the string to columns**

```nu
    > "acronym,long\nAPL,A Programming Language" | from csv
```

> **parses comma separated values (csv)**

```nu
    > $'(ansi purple_bold)This text is a bold purple!(ansi reset)'
```

> **ansi command colors the text (alsways end with `ansi reset` to reset color to default)**

## Lists

```nu
    > [foo bar baz] | insert 1 'beeze'

    ╭───┬───────╮
    │ 0 │ foo   │
    │ 1 │ beeze │
    │ 2 │ bar   │
    │ 3 │ baz   │
    ╰───┴───────╯
```

> **inserts `beeze` value at the 2nd index of the list**

---

```nu
    > [1, 2, 3, 4] | update 1 10
```

> **updates 2nd value to 10**

---

```nu
    > let numbers = [1, 2, 3, 4, 5]
    > $numbers | prepend 0
```

> **adds value at the beginning of the list**

---

```nu
    > let numbers = [1, 2, 3, 4, 5]
    > $numbers | append 6
```

> **adds value at the end of the list**

---

```nu
    > let flowers = [cammomile marigold rose forget-me-not]
    > let flowers = ($flowers | first 2)
    > $flowers
```

> **creates slice of first two values from `flowers` list**

---

```nu
    > let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
    > $planets | each { |it| $"($it) is a planet of the solar system" }
```

> **iterates over a list; `it` is current list value**

---

```nu
    > $planets | enumerate | each { |it| $"($it.index + 1) - ($it.item)" }
```

> **iterates over a list and provides index and value in `it`**

---

```nu
    > let scores = [3 8 4]
    > $"total = ($scores | reduce { |it, acc| $acc + $it })"
```

> **reduces the list to a single value, `reduce` gives access to accumulator that is applied
> to each element in the list**

---

```nu
    > $"total = ($scores | reduce --fold 1 { |it, acc| $acc * $it })"
```

> **initial value for accumulator value can be set with `--fold`**

---

```nu
    > let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
    > $planets.2
    > Earth
```

> **gives access to the 3rd item in the list**

---

```nu
    > let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
    > $planets | any {|it| $it | str starts-with "E" }
    > true
```

> **checks if any string in the list starts with `E`**

---

```nu
    > let cond = {|x| $x < 0 }; [-1 -2 9 1] | take while $cond
    ╭───┬────╮
    │ 0 │ -1 │
    │ 1 │ -2 │
    ╰───┴────╯
```

> **creates slice of items that satisfy provided condition**

## Tables

```nu
    > ls | sort-by size
```

> **sorting table by size of files**

---

```nu
    > ls | sort-by size | first 5
```

> **sorting table by size of files and show first 5 entries**

---

```nu
    > let $a = [[first_column second_column third_column]; [foo bar snooze]]
    > let $b = [[first_column second_column third_column]; [hex seeze feeze]]
    > $a | append $b

    ╭───┬──────────────┬───────────────┬──────────────╮
    │ # │ first_column │ second_column │ third_column │
    ├───┼──────────────┼───────────────┼──────────────┤
    │ 0 │ foo          │ bar           │ snooze       │
    │ 1 │ hex          │ seeze         │ feeze        │
    ╰───┴──────────────┴───────────────┴──────────────╯
```

> **concatenate two tables with same columns**

---

```nu
    > let teams_scores = [[team score plays]; ['Boston Celtics' 311 3] ['Golden State Warriors', 245 2]]
    > $teams_scores | drop column

    ╭───┬───────────────────────┬───────╮
    │ # │         team          │ score │
    ├───┼───────────────────────┼───────┤
    │ 0 │ Boston Celtics        │   311 │
    │ 1 │ Golden State Warriors │   245 │
    ╰───┴───────────────────────┴───────╯
```

> **remove the last column of a table**

## Files & Filesystem

```nu
    > start file.txt
```

> **opens a text file with the default text editor**

---

```nu
    > 'lorem ipsum ' | save file.txt
```

> **saves a string to text file**

---

```nu
    > 'dolor sit amet' | save --append file.txt
```

> **appends a string to the end of file.txt**

---

```nu
    > { a: 1, b: 2 } | save file.json
```

> **saves a record to file.json**

---

```nu
    > glob **/*.{rs,toml} --depth 2
```

> **searches for `.rs` and `.toml` files recursively up to 2 folders deep**

---

```nu
    > watch . --glob=**/*.rs {|| cargo test }
```

> **runs cargo test whenever a Rust file changes**

---

## Custom Commands

```nu
    def greet [name: string] {
        $"hello ($name­)"
    }
```

> **custom command with parameter type set to string**

---

```nu
    def greet [name = "nushell"] {
        $"hello ($name­)"
    }
```

> **custom command with default parameter set to nushell**

---

```nu
    def greet [
        name: string
        --age: int
    ] {
        [$name $age]
    }

    > greet world --age 10
```

> **passing named parameter by defining flag for custom commands**

---

```nu
    def greet [
        name: string
        --age (-a): int
        --twice
    ] {
        if $twice {
            [$name $age $name $age]
        } else {
            [$name $age]
        }
    }
    > greet -a 10 --twice hello
```

> **using flag as a switch with a shorthand flag (-a) for the age**

---

```nu
    def greet [...name: string] {
        print "­hello all:"
        for $n in $name {
            print $n
        }
    }

    > greet earth mars jupiter venus
```

> **custom command which takes any number of positional arguments using rest params**

## Variables & Subexpressions

```nu
    > let val = 42
    > print $val
    42
```

> **an immutable variable cannot change its value after declaration**

---

```nu
    > let val = 42
    > do { let val = 101;  $val }
    101
    > $val
    42
```

> **shadowing variable (declaring variable with the same name in a different scope)**

---

```nu
    > mut val = 42
    > $val += 27
    > $val
    69
```

> **declaring a mutable variable with mut key word**

---

```nu
    > mut x = 0
    > [1 2 3] | each { $x += 1 }
```

> **closures and nested defs cannot capture mutable variables from their enviro­nment.
> This expression results in error.**

```nu
    > const plugin = 'path/­to/­plugin'
    > register $plugin
```

> **a constant variable is immutable value which is fully evaluated at parse-time**

---

```nu
    > let files = (ls)
    > $files.na­me?.0?
```

> **using question mark operator to return null instead of error if provided path is incorrect**

---

```nu
    > let big_files = (ls | where size > 10kb)
    >  $big_files
```

> **using subexp­ression by wrapping the expression with parent­heses ()**

---

## Modules

```nu
    > module greetings {
        export def hello [name: string] {
            $"hello ($name­)!"
        }

        export def hi [where: string] {
            $"hi ($where)!­"
        }
    }

    > use greetings hello
    > hello "­wor­ld"
```

> **using inline module**

---

```nu
    # greeti­ngs.nu
    export-env {
        $env.M­YNAME = "­Arthur, King of the Briton­s"
    }
    export def hello [] {
        $"hello ($env.M­YN­AME­)"
    }

    > use greeti­ngs.nu
    > $env.M­YNAME
    Arthur, King of the Britons
    > greetings hello
    hello Arthur, King of the Britons!
```

> **importing module from file and using its enviro­nment in current scope**

---

```nu
    # greeti­ngs.nu
    export def hello [name: string] {
        $"hello ($name­)!"
    }

    export def hi [where: string] {
        $"hi ($where)!­"
    }

    export def main [] {
        "­gre­etings and salutations!"
    }

    > use greeti­ngs.nu
    > greetings
    greetings and saluta­tions!
    > greetings hello world
    hello world!
```

> **using main command in module**

---
