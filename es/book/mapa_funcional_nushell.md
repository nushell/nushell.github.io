# Mapa nushell de lenguajes funcionales

La idea detrás de esta tabla is ayudarte a entender como los comandos internos y plugins en Nu se relacionan con lenguajes funcionales. Hemos intentado producir un mapa de los comandos internos y sus equivalentes en otros lenguajes. Contribuciones son bienvenidas.

Nota: Esta tabla asume Nu 0.14.1 o posterior.


| Nushell                | Clojure                       | Tablecloth (Ocaml / Elm)                             | Haskell                                    |
| ---------------------- | ----------------------------- | ---------------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| alias                  |                               |                                                      |                                            |                                                 |
| append                 | conj                          |                                                      | (++)                                       |                                                 |
| args                   |                               |                                                      |                                            |                                                 |
| autoview               |                               |                                                      |                                            |                                                 |
| average(`*`)           |                               |                                                      |                                            |                                                 |
| binaryview(`*`)        | Integer/toHexString           |                                                      | showHex                                    |                                                 |
| calc, = math           | math operators                |                                                      |                                            |                                                 |
| cd                     |                               |                                                      |                                            |                                                 |
| clear                  |                               |                                                      |                                            |                                                 |
| clip                   |                               |                                                      |                                            |                                                 |
| compact                |                               |                                                      |                                            |                                                 |
| config                 |                               |                                                      |                                            |                                                 |
| count                  | count                         | length                                               | length                                     |                                                 |
| cp                     |                               |                                                      |                                            |                                                 |
| date                   | java.time.LocalDate/now       |                                                      | Get-Date                                   |                                                 |
| debug                  |                               |                                                      |                                            |                                                 |
| default                |                               |                                                      |                                            |                                                 |
| drop                   |                               |                                                      |                                            |                                                 |
| du                     |                               |                                                      |                                            |                                                 |
| each                   | map                           | map                                                  | map                                        |                                                 |
| echo                   | println                       |                                                      | putStrLn, print                            |                                                 |
| enter                  |                               |                                                      |                                            |                                                 |
| evaluate_by            |                               |                                                      |                                            |                                                 |
| exit                   | System/exit                   |                                                      |                                            |                                                 |
| fetch(`*`)             |                               |                                                      |                                            |                                                 |
| first                  | first                         |                                                      | head                                       |                                                 |
| format                 | format                        |                                                      | Text.Printf.printf                         |                                                 |
| from bson              |                               |                                                      |                                            |                                                 |
| from csv               |                               |                                                      |                                            |                                                 |
| from eml               |                               |                                                      |                                            |                                                 |
| from ics               |                               |                                                      |                                            |                                                 |
| from ini               |                               |                                                      |                                            |                                                 |
| from json              |                               |                                                      |                                            |                                                 |
| from ods               |                               |                                                      |                                            |                                                 |
| from sqlite            |                               |                                                      |                                            |                                                 |
| from ssv               |                               |                                                      |                                            |                                                 |
| from toml              |                               |                                                      |                                            |                                                 |
| from tsv               |                               |                                                      |                                            |                                                 |
| from url               |                               |                                                      |                                            |                                                 |
| from vcf               |                               |                                                      |                                            |                                                 |
| from xlsx              |                               |                                                      |                                            |                                                 |
| from xml               |                               |                                                      |                                            |                                                 |
| from yaml              |                               |                                                      |                                            |                                                 |
| get                    |                               |                                                      |                                            |                                                 |
| grep                   | filter                        |                                                      | filter                                     |                                                 |
| group_by               | group-by                      |                                                      |                                            |                                                 |
| headers                |                               |                                                      |                                            |                                                 |
| help                   | doc                           |                                                      |                                            |                                                 |
| histogram              |                               |                                                      |                                            |                                                 |
| history                |                               |                                                      |                                            |                                                 |
| inc(`*`)               | inc                           |                                                      | succ                                       |                                                 |
| insert                 |                               |                                                      |                                            |                                                 |
| is_empty               | empty?                        |                                                      |                                            |                                                 |
| keep                   | take, drop-last, pop          |                                                      | init, take                                 |                                                 |
| keep_until             |                               |                                                      |                                            |                                                 |
| keep_while             |                               |                                                      |                                            |                                                 |
| kill                   |                               |                                                      |                                            |                                                 |
| last                   | last, peek                    |                                                      | last                                       |                                                 |
| lines                  |                               |                                                      | lines, words, split-with                   |                                                 |
| ls                     |                               |                                                      |                                            |                                                 |
| map_max_by             |                               |                                                      |                                            |                                                 |
| match(`*`)             |                               |                                                      |                                            |                                                 |
| merge                  |                               |                                                      |                                            |                                                 |
| mkdir                  |                               |                                                      |                                            |                                                 |
| mv                     |                               |                                                      |                                            |                                                 |
| next                   |                               |                                                      |                                            |                                                 |
| nth                    | nth                           |                                                      |                                            |                                                 |
| open                   |                               |                                                      |                                            |                                                 |
| parse                  |                               |                                                      |                                            |                                                 |
| pivot                  | (apply mapv vector matrix)    |                                                      | transpose                                  |                                                 |
| post(`*`)              |                               |                                                      |                                            |                                                 |
| prepend                | cons                          |                                                      |                                            |                                                 |
| prev                   |                               |                                                      |                                            |                                                 |
| ps(`*`)                |                               |                                                      |                                            |                                                 |
| pwd                    |                               |                                                      |                                            |                                                 |
| range                  |                               |                                                      | 1..10, 'a'..'f'                            |                                                 |
| reduce_by              |                               |                                                      |                                            |                                                 |
| reject                 |                               |                                                      |                                            |                                                 |
| rename                 |                               |                                                      |                                            |                                                 |
| reverse                |                               |                                                      |                                            |                                                 |
| rm                     |                               |                                                      |                                            |                                                 |
| save                   |                               |                                                      |                                            |                                                 |
| select(`***`)          | select-keys                   |                                                      |                                            |                                                 |
| shells                 |                               |                                                      |                                            |                                                 |
| shuffle                | shuffle                       |                                                      |                                            |                                                 |
| size                   | count                         |                                                      |                                            |                                                 |
| skip                   | rest                          |                                                      | tail                                       |                                                 |
| skip_until             |                               |                                                      |                                            |                                                 |
| skip_while             |                               |                                                      |                                            |                                                 |
| sort-by                | sort-by                       |                                                      |                                            |                                                 |
| split_by               |                               |                                                      |                                            |                                                 |
| split_column           |                               |                                                      |                                            |                                                 |
| split_row              |                               |                                                      |                                            |                                                 |
| str(`*`)               | clojure.string functions      |                                                      |                                            |                                                 |
| sum                    |                               |                                                      |                                            |                                                 |
| sys(`*`)               |                               |                                                      |                                            |                                                 |
| table                  |                               |                                                      |                                            |                                                 |
| tags                   |                               |                                                      |                                            |                                                 |
| textview(`*`)          |                               |                                                      |                                            |                                                 |
| tree(`*`)              |                               |                                                      |                                            |                                                 |
| to bson                |                               |                                                      |                                            |                                                 |
| to csv                 |                               |                                                      |                                            |                                                 |
| to html                |                               |                                                      |                                            |                                                 |
| to json                |                               |                                                      |                                            |                                                 |
| to md                  |                               |                                                      |                                            |                                                 |
| to sqlite              |                               |                                                      |                                            |                                                 |
| to toml                |                               |                                                      |                                            |                                                 |
| to tsv                 |                               |                                                      |                                            |                                                 |
| to url                 |                               |                                                      |                                            |                                                 |
| to yaml                |                               |                                                      |                                            |                                                 |
| touch                  |                               |                                                      |                                            |                                                 |
| trim                   |                               |                                                      |                                            |                                                 |
| uniq                   |                               |                                                      |                                            |                                                 |
| update(`**`)           |                               |                                                      |                                            |                                                 |
| version                |                               |                                                      |                                            |                                                 |
| with_env               |                               |                                                      |                                            |                                                 |
| what                   |                               |                                                      |                                            |                                                 |
| where                  | filter                        |                                                      | filter                                     |                                                 |
| which                  |                               |                                                      |                                            |                                                 |
| wrap                   |                               |                                                      |                                            |                                                 |

* `*` - Pertenecen de los plugins standard
* `**` - renombrada de `edit` a `update` en 0.13.1
* `***` - renombrada de `pick` a `select` en 0.13.1
