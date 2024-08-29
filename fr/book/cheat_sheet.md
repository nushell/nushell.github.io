# Cheat Sheet Nushell

## Types de donnée

convertir une string en un integer :

```nu
"12" | into int
```

convertir la date actuelle en un fuseau horaire donné :

```nu
date now | date to-timezone "Europe/London"
```

mettre à jour le language d'un record et si none est spécifié, insérer le language donné :

```nu
{'name': 'nu', 'stars': 5, 'language': 'Python'} | upsert language 'Rust'
```

convertir une liste de strings en yaml :

```nu
[one two three] | to yaml
```

afficher un tableau de données :

```nu
[[framework, language]; [Django, Python] [Laravel, PHP]]
```

sélectionner deux colonnes nommées du tableau et afficher leurs valeurs :

```nu
[{name: 'Robert' age: 34 position: 'Designer'}
 {name: 'Margaret' age: 30 position: 'Software Developer'}
 {name: 'Natalie' age: 50 position: 'Accountant'}
] | select name position
```

## Strings

interpoler du texte :

```nu
> let name = "Alice"
> $"greetings, ($name)!"
greetings, Alice!
```

découper le texte à chaque virgule et stocker la liste dans la variable `string_list` :

```nu
> let string_list = "one,two,three" | split row ","
> $string_list
╭───┬───────╮
│ 0 │ one   │
│ 1 │ two   │
│ 2 │ three │
╰───┴───────╯
```

vérifier si une string contient une sous-string :

```nu
> "Hello, world!" | str contains "o, w"
true
```

concaténer plusieurs strings avec un délimiteur :

```nu
> let str_list = [zero one two]
> $str_list | str join ','
zero,one,two
```

découper le texte selon des indices :

```nu
> 'Hello World!' | str substring 4..8
o Wor
```

parser une string en des colonnes nommées :

```nu
> 'Nushell 0.80' | parse '{shell} {version}'
╭───┬─────────┬─────────╮
│ # │  shell  │ version │
├───┼─────────┼─────────┤
│ 0 │ Nushell │ 0.80    │
╰───┴─────────┴─────────╯
```

parser des valeurs au format csv :

```nu
> "acronym,long\nAPL,A Programming Language" | from csv
╭───┬─────────┬────────────────────────╮
│ # │ acronym │          long          │
├───┼─────────┼────────────────────────┤
│ 0 │ APL     │ A Programming Language │
╰───┴─────────┴────────────────────────╯
```

appliquer une couleur à un texte dans un terminal de commande :

```nu
> $'(ansi purple_bold)This text is a bold purple!(ansi reset)'
This text is a bold purple!
```

## Listes

insérer une valeur à un index dans une list :

```nu
> [foo bar baz] | insert 1 'beeze'
╭───┬───────╮
│ 0 │ foo   │
│ 1 │ beeze │
│ 2 │ bar   │
│ 3 │ baz   │
╰───┴───────╯
```

mettre à jour une liste par index :

```nu
> [1, 2, 3, 4] | update 1 10
╭───┬────╮
│ 0 │  1 │
│ 1 │ 10 │
│ 2 │  3 │
│ 3 │  4 │
╰───┴────╯
```

ajouter une valeur au début d'une liste :

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

ajouter une valeur à la fin d'une liste :

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

découper les premières valeurs d'une liste :

```nu
> [cammomile marigold rose forget-me-not] | first 2
╭───┬───────────╮
│ 0 │ cammomile │
│ 1 │ marigold  │
╰───┴───────────╯
```

itérer sur une liste ; `elt` est la valeur actuelle de la liste :

```nu
> let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
> $planets | each { |elt| $"($elt) is a planet of the solar system" }
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

itérer sur une liste avec un index et une valeur :

```nu
> $planets | enumerate | each { |elt| $"($elt.index + 1) - ($elt.item)" }
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

réduire la liste à une unique valeur ; `reduce` donne accès à un accumulateur qui est appliqué à chaque élément de la liste :

```nu
> let scores = [3 8 4]
> $"total = ($scores | reduce { |elt, acc| $acc + $elt })"
total = 15
```

réduire avec une valeur initiale (`--fold`) :

```nu
> let scores = [3 8 4]
> $"total = ($scores | reduce --fold 1 { |elt, acc| $acc * $elt })"
total = 96
```

donner accès au 3ème élément de la liste :

```nu
> let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
> $planets.2
Earth
```

vérifier si une string dans la liste commence par `E` :

```nu
> let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
> $planets | any {|elt| $elt | str starts-with "E" }
true
```

découper les éléments qui satisfont la condition donnée :

```nu
> let cond = {|x| $x < 0 }; [-1 -2 9 1] | take while $cond
╭───┬────╮
│ 0 │ -1 │
│ 1 │ -2 │
╰───┴────╯
```

## Tablaux

trier un tableau :

```nu
ls | sort-by size
```

trier un tableau, obtenir les premières lignes :

```nu
ls | sort-by size | first 5
```

concaténer deux tableaux avec les mêmes colonnes :

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

retirer la dernière colonne d'un tableau :

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

## Fichiers et système de fichier

ouvrir un fichier texte avec l'éditeur par défaut :

```nu
start file.txt
```

sauvegarder une string dans un fichier texte :

```nu
'lorem ipsum ' | save file.txt
```

ajouter une string à la fin d'un fichier texte :

```nu
'dolor sit amet' | save --append file.txt
```

sauvegarder un record dans file.json :

```nu
{ a: 1, b: 2 } | save file.json
```

rechercher des fichiers par nom de fichier de manière récursive :

```nu
glob **/*.{rs,toml} --depth 2
```

observer un fichier, exécuter une commande lorsqu'il change :

```nu
watch . --glob=**/*.rs {|| cargo test }
```

## Commandes personnalisées

commande personnalisée avec un paramètre de type string :

```nu
> def greet [name: string] {
    $"hello ($name)"
}
```

commande personnalisée avec un paramètre par défaut fixé à nushell :

```nu
> def greet [name = "nushell"] {
    $"hello ($name)"
}
```

passer un paramètre nommé en définissant un flag pour une commande personnalisée :

```nu
> def greet [
    name: string
    --age: int
] {
    [$name $age]
}

> greet world --age 10
```

utiliser le flag comme un switch avec un racourcis (-a) pour l'âge :

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

commande personnalisée qui prend un nombre quelconque d'arguments positionnels en utilisant des paramètres restants :

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

## Variables

une variable immuable ne peut pas changer de valeur après déclaration :

```nu
> let val = 42
> print $val
42
```

le shadowing d'une variable (déclaration d'une variable avec le même nom dans un autre scope) :

```nu
> let val = 42
> do { let val = 101;  $val }
101
> $val
42
```

déclarer une variable mutable avec le mot-clé mut :

```nu
> mut val = 42
> $val += 27
> $val
69
```

les closures et définitions imbriquées ne peuvent pas capturer des variables mutables de leur environnement (erreurs) :

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

une variable constante est immuable et est entièrement évaluée au moment du parsing :

```nu
> const file = 'path/to/file.nu'
> source $file
```

utiliser l'opérateur point d'interrogation `?` pour retourner null au lieu d'une erreur si le chemin fourni est incorrect :

```nu
> let files = (ls)
> $files.name?.0?
```

assigner le résultat d'un pipeline à une variable :

```nu
> let big_files = (ls | where size > 10kb)
> $big_files
```

## Modules

utiliser un module inline :

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

importer un module depuis un fichier et utiliser son environnement dans le scope actuel :

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

utiliser la commande main dans un module :

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
