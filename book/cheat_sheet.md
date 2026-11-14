---
next:
  text: Nu Fundamentals
  link: /book/nu_fundamentals.md
---
# Nushell Cheat Sheet

## Data Types

convert string to integer:

```nu
"12" | into int
```

update a record's language and if none is specified insert provided value:

```nu
{'name': 'nu', 'stars': 5, 'language': 'Python'} | upsert language 'Rust'
```

convert list of strings to yaml:

```nu
[one two three] | to yaml
```

print table data:

```nu
[[framework, language]; [Django, Python] [Laravel, PHP]]
```

select two named columns from the table and print their values:

```nu
[{name: 'Robert' age: 34 position: 'Designer'}
 {name: 'Margaret' age: 30 position: 'Software Developer'}
 {name: 'Natalie' age: 50 position: 'Accountant'}
] | select name position
```

## Strings

interpolate text:

```nu
let name = "Alice"
$"greetings, ($name)!"
# => greetings, Alice!
```

split text on comma delimiter and save the list to `string_list` variable:

```nu
let string_list = "one,two,three" | split row ","
$string_list
# => ╭───┬───────╮
# => │ 0 │ one   │
# => │ 1 │ two   │
# => │ 2 │ three │
# => ╰───┴───────╯
```

check if a string contains a substring:

```nu
"Hello, world!" | str contains "o, w"
# => true
```

join multiple strings with delimiter:

```nu
let str_list = [zero one two]
$str_list | str join ','
# => zero,one,two
```

slice text by indices:

```nu
'Hello World!' | str substring 4..8
# => o Wor
```

parse string into named columns:

```nu
'Nushell 0.80' | parse '{shell} {version}'
# => ╭───┬─────────┬─────────╮
# => │ # │  shell  │ version │
# => ├───┼─────────┼─────────┤
# => │ 0 │ Nushell │ 0.80    │
# => ╰───┴─────────┴─────────╯
```

parse comma separated values (csv):

```nu
"acronym,long\nAPL,A Programming Language" | from csv
# => ╭───┬─────────┬────────────────────────╮
# => │ # │ acronym │          long          │
# => ├───┼─────────┼────────────────────────┤
# => │ 0 │ APL     │ A Programming Language │
# => ╰───┴─────────┴────────────────────────╯
```

color text in command-line terminal:

```nu
$'(ansi purple_bold)This text is a bold purple!(ansi reset)'
# => This text is a bold purple!
```

## Lists

insert list value at index:

```nu
[foo bar baz] | insert 1 'beeze'
# => ╭───┬───────╮
# => │ 0 │ foo   │
# => │ 1 │ beeze │
# => │ 2 │ bar   │
# => │ 3 │ baz   │
# => ╰───┴───────╯
```

update list value by index:

```nu
[1, 2, 3, 4] | update 1 10
# => ╭───┬────╮
# => │ 0 │  1 │
# => │ 1 │ 10 │
# => │ 2 │  3 │
# => │ 3 │  4 │
# => ╰───┴────╯
```

prepend list value:

```nu
let numbers = [1, 2, 3]
$numbers | prepend 0
# => ╭───┬───╮
# => │ 0 │ 0 │
# => │ 1 │ 1 │
# => │ 2 │ 2 │
# => │ 3 │ 3 │
# => ╰───┴───╯
```

append list value:

```nu
let numbers = [1, 2, 3]
$numbers | append 4
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => ╰───┴───╯
```

slice first list values:

```nu
[cammomile marigold rose forget-me-not] | first 2
# => ╭───┬───────────╮
# => │ 0 │ cammomile │
# => │ 1 │ marigold  │
# => ╰───┴───────────╯
```

iterate over a list; `elt` is current list value:

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets | each { |elt| $"($elt) is a planet of the solar system" }
# => ╭───┬─────────────────────────────────────────╮
# => │ 0 │ Mercury is a planet of the solar system │
# => │ 1 │ Venus is a planet of the solar system   │
# => │ 2 │ Earth is a planet of the solar system   │
# => │ 3 │ Mars is a planet of the solar system    │
# => │ 4 │ Jupiter is a planet of the solar system │
# => │ 5 │ Saturn is a planet of the solar system  │
# => │ 6 │ Uranus is a planet of the solar system  │
# => │ 7 │ Neptune is a planet of the solar system │
# => ╰───┴─────────────────────────────────────────╯
```

iterate over a list with an index and value:

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets | enumerate | each { |elt| $"($elt.index + 1) - ($elt.item)" }
# => ╭───┬─────────────╮
# => │ 0 │ 1 - Mercury │
# => │ 1 │ 2 - Venus   │
# => │ 2 │ 3 - Earth   │
# => │ 3 │ 4 - Mars    │
# => │ 4 │ 5 - Jupiter │
# => │ 5 │ 6 - Saturn  │
# => │ 6 │ 7 - Uranus  │
# => │ 7 │ 8 - Neptune │
# => ╰───┴─────────────╯
```

reduce the list to a single value; `reduce` gives access to accumulator that is applied to each element in the list:

```nu
let scores = [3 8 4]
$"total = ($scores | reduce { |elt, acc| $acc + $elt })"
# => total = 15
```

reduce with an initial value (`--fold`):

```nu
let scores = [3 8 4]
$"total = ($scores | reduce --fold 1 { |elt, acc| $acc * $elt })"
# => total = 96
```

give access to the 3rd item in the list:

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets.2
# => Earth
```

check if any string in the list starts with `E`:

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets | any {|elt| $elt | str starts-with "E" }
# => true
```

slice items that satisfy provided condition:

```nu
let cond = {|x| $x < 0 }; [-1 -2 9 1] | take while $cond
# => ╭───┬────╮
# => │ 0 │ -1 │
# => │ 1 │ -2 │
# => ╰───┴────╯
```

## Tables

sort table:

```nu
ls | sort-by size
```

sort table, get first rows:

```nu
ls | sort-by size | first 5
```

concatenate two tables with same columns:

```nu
let $a = [[first_column second_column third_column]; [foo bar snooze]]
let $b = [[first_column second_column third_column]; [hex seeze feeze]]
$a | append $b
# => ╭───┬──────────────┬───────────────┬──────────────╮
# => │ # │ first_column │ second_column │ third_column │
# => ├───┼──────────────┼───────────────┼──────────────┤
# => │ 0 │ foo          │ bar           │ snooze       │
# => │ 1 │ hex          │ seeze         │ feeze        │
# => ╰───┴──────────────┴───────────────┴──────────────╯
```

remove the last column of a table:

```nu
let teams_scores = [[team score plays]; ['Boston Celtics' 311 3] ['Golden State Warriors', 245 2]]
$teams_scores | drop column
# => ╭───┬───────────────────────┬───────╮
# => │ # │         team          │ score │
# => ├───┼───────────────────────┼───────┤
# => │ 0 │ Boston Celtics        │   311 │
# => │ 1 │ Golden State Warriors │   245 │
# => ╰───┴───────────────────────┴───────╯
```

remove the last two columns of a table:

```nu
$teams_scores | drop column 2
# => ╭───┬───────────────────────╮
# => │ # │         team          │
# => ├───┼───────────────────────┤
# => │ 0 │ Boston Celtics        │
# => │ 1 │ Golden State Warriors │
# => ╰───┴───────────────────────╯
```

remove the first column of a table instead of the last:

```nu
$teams_scores | drop column --left
# => ╭───┬───────┬───────╮
# => │ # │ score │ plays │
# => ├───┼───────┼───────┤
# => │ 0 │   311 │     3 │
# => │ 1 │   245 │     2 │
# => ╰───┴───────┴───────╯
```

remove the last field of a record (use `reject` to remove columns or fields by name):

```nu
{name: nu, stars: 5, language: Rust} | drop column
# => ╭───────┬────╮
# => │ name  │ nu │
# => │ stars │ 5  │
# => ╰───────┴────╯
```

## Numbers

convert a string to a float (`into float` reads a comma as a decimal point, so remove thousands separators first):

```nu
"1.5" | into float
# => 1.5
```

find the largest value in each column of a table:

```nu
[[a b]; [1 5] [3 2]] | math max
# => ╭───┬───╮
# => │ a │ 3 │
# => │ b │ 5 │
# => ╰───┴───╯
```

get the median and the standard deviation of a list (`--sample` divides by N - 1):

```nu
[2 4 4 4 5 5 7 9] | math median
# => 4.5
[2 4 4 4 5 5 7 9] | math stddev
# => 2.0
```

apply a function to each number in a list:

```nu
[1 10 100] | math log 10
# => ╭───┬──────╮
# => │ 0 │ 0.00 │
# => │ 1 │ 1.00 │
# => │ 2 │ 2.00 │
# => ╰───┴──────╯
```

roll a six-sided die ten times (`..` includes the end of the range, `..<` leaves it out):

```nu
1..10 | each { random int 1..6 }
```

generate a UUID (`-v 7` makes one that sorts by creation time):

```nu
random uuid
```

read a clock time as a duration and show it in minutes:

```nu
"1:30:00" | into duration | format duration min
# => 90 min
```

read a size written as text (units are case-insensitive, and `KiB`, `MiB` and so on count in 1024s):

```nu
"1.5 GiB" | into filesize
# => 1.6 GB
```

## Dates

get the current date and time:

```nu
date now
```

convert present date to provided time zone:

```nu
date now | date to-timezone "Europe/London"
```

list the time zone names that `date to-timezone` accepts (case doesn't matter, and any other name is an `invalid time zone` error):

```nu
date list-timezone | where timezone =~ "Kolkata"
# => ╭───┬──────────────┬────────╮
# => │ # │   timezone   │ offset │
# => ├───┼──────────────┼────────┤
# => │ 0 │ Asia/Kolkata │ +05:30 │
# => ╰───┴──────────────┴────────╯
```

convert a date to a fixed UTC offset (`+0530` and `+05` work too, and `local` converts to your own time zone):

```nu
2024-06-01T12:00:00Z | date to-timezone "+05:30" | format date "%F %T %z"
# => 2024-06-01 17:30:00 +0530
```

convert date strings, or a list of them, to a time zone:

```nu
["2024-06-01 12:00:00 +00:00" "2024-12-01 12:00:00 +00:00"] | date to-timezone "America/New_York" | format date "%F %T %z"
# => ╭───┬───────────────────────────╮
# => │ 0 │ 2024-06-01 08:00:00 -0400 │
# => │ 1 │ 2024-12-01 07:00:00 -0500 │
# => ╰───┴───────────────────────────╯
```

describe a date relative to now, such as "2 years ago":

```nu
2024-06-01T12:00:00Z | date humanize
```

parse a date written in words:

```nu
"next friday" | date from-human
```

## Files and Filesystem

open a text file with the default text editor:

```nu
start file.txt
```

save a string to text file:

```nu
'lorem ipsum ' | save file.txt
```

append a string to the end of a text file:

```nu
'dolor sit amet' | save --append file.txt
```

save a record to file.json:

```nu
{ a: 1, b: 2 } | save file.json
```

recursively search for files by file name:

```nu
glob **/*.{rs,toml} --depth 2
```

watch a file, run command whenever it changes:

```nu
for _ in (watch . --glob=**/*.rs) { cargo test }
```

## Custom Commands

custom command with parameter type set to string:

```nu
def greet [name: string] {
    $"hello ($name)"
}
```

custom command with default parameter set to nushell:

```nu
def greet [name = "nushell"] {
    $"hello ($name)"
}
```

passing named parameter by defining flag for custom commands:

```nu
def greet [
    name: string
    --age: int
] {
    [$name $age]
}

greet world --age 10
```

using flag as a switch with a shorthand flag (-a) for the age:

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
greet -a 10 --twice hello
```

custom command which takes any number of positional arguments using rest params:

```nu
def greet [...name: string] {
    print "hello all:"
    for $n in $name {
        print $n
    }
}
greet earth mars jupiter venus
# => hello all:
# => earth
# => mars
# => jupiter
# => venus
```

## Variables

an immutable variable cannot change its value after declaration:

```nu
let val = 42
print $val
# => 42
```

shadowing variable (declaring variable with the same name in a different scope):

```nu
let val = 42
do { let val = 101;  $val }
# => 101
$val
# => 42
```

declaring a mutable variable with mut key word:

```nu
mut val = 42
$val += 27
$val
# => 69
```

closures and nested defs cannot capture mutable variables from their environment (errors):

```nu
mut x = 0
[1 2 3] | each { $x += 1 }
# => Error: nu::parser::expected_keyword
# =>
# =>   × Capture of mutable variable.
# =>    ╭─[repl_entry #83:2:18]
# =>  1 │ mut x = 0
# =>  2 │ [1 2 3] | each { $x += 1 }
# =>    ·                  ─┬
# =>    ·                   ╰── capture of mutable variable
# =>    ╰────
```

a constant variable is immutable and is fully evaluated at parse-time, so it can be used where a value is needed while parsing, such as the file name passed to `source`:

```nu
'print "hello from file.nu"' | save --force file.nu
```

```nu
const file = 'file.nu'
source $file
# => hello from file.nu
```

use question mark operator `?` to return null instead of error if provided path is incorrect:

```nu
let files = (ls)
$files.name?.0?
```

assign the result of a pipeline to a variable:

```nu
let big_files = (ls | where size > 10kb)
$big_files
```

## Modules

use an inline module:

```nu
module greetings {
    export def hello [name: string] {
        $"hello ($name)!"
    }

    export def hi [where: string] {
        $"hi ($where)!"
    }
}
use greetings hello
hello "world"
# => hello world!
```

import module from file and use its environment in current scope:

```nu
# greetings.nu
export-env {
    $env.MYNAME = "Arthur, King of the Britons"
}
export def hello [] {
    $"hello ($env.MYNAME)"
}
```

```nu
use greetings.nu
$env.MYNAME
# => Arthur, King of the Britons
greetings hello
# => hello Arthur, King of the Britons
```

use main command in module:

```nu
# salutations.nu
export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}

export def main [] {
    "greetings and salutations!"
}
```

```nu
use salutations.nu
salutations
# => greetings and salutations!
salutations hello world
# => hello world!
```
