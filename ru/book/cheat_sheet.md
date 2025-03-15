# Шпаргалка по Nushell

## Типы данных

сконвертировать строку в целое число:

```nu
"12" | into int
```

сконвертировать настоящую дату в указанную временную зону:

```nu
date now | date to-timezone "Europe/London"
```

обновить запись с языком и если он не указан, вставить предоставленное значение:

```nu
{'name': 'nu', 'stars': 5, 'language': 'Python'} | upsert language 'Rust'
```

сконвертировать список строк в yaml:

```nu
[one two three] | to yaml
```

вывести таблицу данных:

```nu
[[framework, language]; [Django, Python] [Laravel, PHP]]
```

выделить два именнованных столбца из таблицы и вывести их значения

```nu
[{name: 'Robert' age: 34 position: 'Designer'}
 {name: 'Margaret' age: 30 position: 'Software Developer'}
 {name: 'Natalie' age: 50 position: 'Accountant'}
] | select name position
```

## Строки

интерполяция текста:

```nu
> let name = "Alice"
> $"greetings, ($name)!"
greetings, Alice!
```

разделить текст на запятую и сохранить список в переменной `string_list`:

```nu
> let string_list = "one,two,three" | split row ","
> $string_list
╭───┬───────╮
│ 0 │ one   │
│ 1 │ two   │
│ 2 │ three │
╰───┴───────╯
```

проверить строку на присутствие подстроки:

```nu
> "Hello, world!" | str contains "o, w"
true
```

создать список строк и объединить его с разделителем:

```nu
> let str_list = [zero one two]
> $str_list | str join ','
zero,one,two
```

получить подстроки с помощью индексов:

```nu
> 'Hello World!' | str substring 4..8
o Wor
```

сконвертировать строку в названные столбцы:

```nu
> 'Nushell 0.80' | parse '{shell} {version}'
╭───┬─────────┬─────────╮
│ # │  shell  │ version │
├───┼─────────┼─────────┤
│ 0 │ Nushell │ 0.80    │
╰───┴─────────┴─────────╯
```

спарсить строку разделенную запятыми в csv:

```nu
> "acronym,long\nAPL,A Programming Language" | from csv
╭───┬─────────┬────────────────────────╮
│ # │ acronym │          long          │
├───┼─────────┼────────────────────────┤
│ 0 │ APL     │ A Programming Language │
╰───┴─────────┴────────────────────────╯
```

цветной текст:

```nu
> $'(ansi purple_bold)This text is a bold purple!(ansi reset)'
This text is a bold purple!
```

## Списки

вставить значение в список по индексу

```nu
> [foo bar baz] | insert 1 'beeze'
╭───┬───────╮
│ 0 │ foo   │
│ 1 │ beeze │
│ 2 │ bar   │
│ 3 │ baz   │
╰───┴───────╯
```

обновить значение в списке по индексу

```nu
> [1, 2, 3, 4] | update 1 10
╭───┬────╮
│ 0 │  1 │
│ 1 │ 10 │
│ 2 │  3 │
│ 3 │  4 │
╰───┴────╯
```

добавить значение в начало списка

```nu
> let numbers = [1, 2, 3]
> $numbers | prepend 0
╭───┬───╮
│ 0 │ 0 │
│ 1 │ 1 │
│ 2 │ 2 │
│ 3 │ 3 │
╰───┴───╯
```

добавить значение в конец списка

```nu
> let numbers = [1, 2, 3]
> $numbers | append 4
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
│ 3 │ 4 │
╰───┴───╯
```

получить первые 2 значения списка

```nu
> [cammomile marigold rose forget-me-not] | first 2
╭───┬───────────╮
│ 0 │ cammomile │
│ 1 │ marigold  │
╰───┴───────────╯
```

итерация по списку; `it` - текущее значение

```nu
> let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
> $planets | each { |it| $"($it) is a planet of the solar system" }
╭───┬─────────────────────────────────────────╮
│ 0 │ Mercury is a planet of the solar system │
│ 1 │ Venus is a planet of the solar system   │
│ 2 │ Earth is a planet of the solar system   │
│ 3 │ Mars is a planet of the solar system    │
│ 4 │ Jupiter is a planet of the solar system │
│ 5 │ Saturn is a planet of the solar system  │
│ 6 │ Uranus is a planet of the solar system  │
│ 7 │ Neptune is a planet of the solar system │
╰───┴─────────────────────────────────────────╯
```

итерация по списку с индексом и значением; `it` - текущее значение

```nu
> $planets | enumerate | each { |it| $"($it.index + 1) - ($it.item)" }
╭───┬─────────────╮
│ 0 │ 1 - Mercury │
│ 1 │ 2 - Venus   │
│ 2 │ 3 - Earth   │
│ 3 │ 4 - Mars    │
│ 4 │ 5 - Jupiter │
│ 5 │ 6 - Saturn  │
│ 6 │ 7 - Uranus  │
│ 7 │ 8 - Neptune │
╰───┴─────────────╯
```

сократить список до одного значения; `reduce` дает доступ к аккумулятору, который применяется к каждому элементу списка:

```nu
> let scores = [3 8 4]
> $"total = ($scores | reduce { |it, acc| $acc + $it })"
total = 15
```

уменьшить с начальным значением (`--fold`):

```nu
> let scores = [3 8 4]
> $"total = ($scores | reduce --fold 1 { |it, acc| $acc * $it })"
total = 96
```

дать доступ к третьему элементу в списке:

```nu
> let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
> $planets.2
Earth
```

Проверьте, начинается ли какая-либо строка в списке с `E`:

```nu
> let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
> $planets | any {|it| $it | str starts-with "E" }
true
```

срез элементов, удовлетворяющих заданному условию:

```nu
> let cond = {|x| $x < 0 }; [-1 -2 9 1] | take while $cond
╭───┬────╮
│ 0 │ -1 │
│ 1 │ -2 │
╰───┴────╯
```

## Таблицы

сортировка таблицы

```nu
ls | sort-by size
```

сортировка таблицы, получить первые 5 строк

```nu
ls | sort-by size | first 5
```

соеденить две таблицы с одинаковыми столбцами

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

удалить последний столбец таблицы

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

## Файлы и файловая система

открыть текстовый файл с помощью текстового редактора по умолчанию:

```nu
start file.txt
```

сохранение строки в текстовый файл:

```nu
'lorem ipsum ' | save file.txt
```

добавить строку в конец текстового файла:

```nu
'dolor sit amet' | save --append file.txt
```

сохранить запись в файле file.json:

```nu
{ a: 1, b: 2 } | save file.json
```

рекурсивный поиск файлов по имени файла:

```nu
glob **/*.{rs,toml} --depth 2
```

следить за файлом, выполнять команду при каждом его изменении:

```nu
watch . --glob=**/*.rs {|| cargo test }
```

## Свои команды

пользовательская команда с типом параметра string:

```nu
> def greet [name: string] {
    $"hello ($name)"
}
```

пользовательская команда с параметром по умолчанию nushell:

```nu
> def greet [name = "nushell"] {
    $"hello ($name)"
}
```

передача именованного параметра путем определения флага для пользовательских команд:

```nu
> def greet [
    name: string
    --age: int
] {
    [$name $age]
}

> greet world --age 10
```

использование флага в качестве переключателя с сокращенным флагом (-a) для возраста:

```nu
> def greet [
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

пользовательская команда, принимающая любое количество позиционных аргументов с помощью rest params:

```nu
> def greet [...name: string] {
    print "hello all:"
    for $n in $name {
        print $n
    }
}
> greet earth mars jupiter venus
hello all:
earth
mars
jupiter
venus
```

## Переменные

Неизменяемая переменная не может изменить свое значение после объявления:

```nu
> let val = 42
> print $val
42
```

теневая переменная (объявление переменной с тем же именем в другой области видимости):

```nu
> let val = 42
> do { let val = 101;  $val }
101
> $val
42
```

объявление изменяемой переменной с ключевым словом mut:

```nu
> mut val = 42
> $val += 27
> $val
69
```

закрытия и вложенные defs не могут захватывать изменяемые переменные из своего окружения (ошибки):

```nu
> mut x = 0
> [1 2 3] | each { $x += 1 }
Error: nu::parser::expected_keyword

  × Capture of mutable variable.
   ╭─[entry #83:1:18]
 1 │ [1 2 3] | each { $x += 1 }
   ·                  ─┬
   ·                   ╰── capture of mutable variable
   ╰────
```

Константная переменная является неизменяемой и полностью оценивается во время разбора:

```nu
> const file = 'path/to/file.nu'
> source $file
```

Используйте оператор вопросительного знака `?` для возврата null вместо ошибки, если указанный путь неверен:

```nu
> let files = (ls)
> $files.name?.0?
```

присвоить результат пайплайна переменной:

```nu
> let big_files = (ls | where size > 10kb)
> $big_files
```

## Модули

используйте встроенный модуль:

```nu
> module greetings {
    export def hello [name: string] {
        $"hello ($name)!"
    }

    export def hi [where: string] {
        $"hi ($where)!"
    }
}
> use greetings hello
> hello "world"
```

импортировать модуль из файла и использовать его окружение в текущей области видимости:

```nu
# greetings.nu
export-env {
    $env.MYNAME = "Arthur, King of the Britons"
}
export def hello [] {
    $"hello ($env.MYNAME)"
}

> use greetings.nu
> $env.MYNAME
Arthur, King of the Britons
> greetings hello
hello Arthur, King of the Britons!
```

используйте главную команду в модуле:

```nu
# greetings.nu
export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}

export def main [] {
    "greetings and salutations!"
}

> use greetings.nu
> greetings
greetings and salutations!
> greetings hello world
hello world!
```
