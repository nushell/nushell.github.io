# Mapa nushell de lenguajes imperativos

La idea detrás de esta tabla is ayudarte a entender como los comandos internos y plugins en Nu se relacionan con lenguajes imperativos. Hemos intentado producir un mapa de los comandos internos y sus equivalentes en otros lenguajes. Contribuciones son bienvenidas.

Nota: esta tabla asume Nu 0.14.1 o posterior.


| Nushell                | Python                        | Kotlin (Java)                                        | C++                                        | Rust                                            |
| ---------------------- | ----------------------------- | ---------------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| alias                  |                               |                                                      |                                            |                                                 |
| append                 | list.append, set.add          | add                                                  | push_back, emplace_back                    | push, push_back                                 |
| args                   |                               |                                                      |                                            |                                                 |
| autoview               |                               |                                                      |                                            |                                                 |
| average(`*`)           | statistics.mean               |                                                      |                                            |                                                 |
| binaryview(`*`)        | \"{:x}\".format               | Integer.toHexString                                  |                                            |                                                 |
| calc, = math           | math operators                | math operators                                       | math operators                             | math operators                                  |
| cd                     |                               |                                                      |                                            |                                                 |
| clear                  |                               |                                                      |                                            |                                                 |
| clip                   |                               |                                                      |                                            |                                                 |
| compact                |                               |                                                      |                                            |                                                 |
| config                 |                               |                                                      |                                            |                                                 |
| count                  | len                           | size, length                                         | length                                     | len                                             |
| cp                     | shutil.copy                   |                                                      |                                            |                                                 |
| date                   | datetime.date.today           | java.time.LocalDate.now                              |                                            |                                                 |
| debug                  |                               |                                                      |                                            |                                                 |
| default                |                               |                                                      |                                            |                                                 |
| drop                   |                               |                                                      |                                            |                                                 |
| du                     | shutil.disk_usage             |                                                      |                                            |                                                 |
| each                   | for                           | for                                                  | for                                        | for                                             |
| echo                   | print                         | println                                              | printf                                     | println!                                        |
| enter                  |                               |                                                      |                                            |                                                 |
| evaluate_by            |                               |                                                      |                                            |                                                 |
| exit                   | exit                          | System.exit, kotlin.system.exitProcess               | exit                                       | exit                                            |
| fetch(`*`)             | urllib.request.urlopen        |                                                      |                                            |                                                 |
| first                  | list[0]                       | List[0], peek                                        | vector[0], top                             | vec[0]                                          |
| format                 | format                        |                                                      |                                            |                                                 |
| from bson              |                               |                                                      |                                            |                                                 |
| from csv               | csv                           |                                                      |                                            |                                                 |
| from eml               |                               |                                                      |                                            |                                                 |
| from ics               |                               |                                                      |                                            |                                                 |
| from ini               |                               |                                                      |                                            |                                                 |
| from json              | json                          |                                                      |                                            |                                                 |
| from ods               |                               |                                                      |                                            |                                                 |
| from sqlite            | sqlite3                       |                                                      |                                            |                                                 |
| from ssv               |                               |                                                      |                                            |                                                 |
| from toml              |                               |                                                      |                                            |                                                 |
| from tsv               |                               |                                                      |                                            |                                                 |
| from url               |                               |                                                      |                                            |                                                 |
| from vcf               |                               |                                                      |                                            |                                                 |
| from xlsx              |                               |                                                      |                                            |                                                 |
| from xml               |                               |                                                      |                                            |                                                 |
| from yaml              |                               |                                                      |                                            |                                                 |
| get                    | dict[\"key\"]                 | Map[\"key\"]                                         | map[\"key\"]                               |                                                 |
| group_by               | itertools.groupby             |                                                      |                                            |                                                 |
| headers                |                               |                                                      |                                            |                                                 |
| help                   | help                          |                                                      |                                            |                                                 |
| histogram              |                               |                                                      |                                            |                                                 |
| history                |                               |                                                      |                                            |                                                 |
| inc(`*`)               | x += 1                        | x++                                                  | x++                                        | += 1                                            |
| insert                 | list.insert                   |                                                      |                                            |                                                 |
| is_empty               | is None                       | isEmpty                                              | empty                                      |                                                 |
| keep                   | list[:x]                      |                                                      |                                            |                                                 |
| keep_until             |                               |                                                      |                                            |                                                 |
| keep_while             | itertools.takewhile           |                                                      |                                            |                                                 |
| kill                   | os.kill                       |                                                      |                                            |                                                 |
| last                   | list[-1]                      |                                                      |                                            |                                                 |
| lines                  | split, splitlines             | split                                                | views::split                               |                                                 |
| ls                     | os.listdir                    |                                                      |                                            |                                                 |
| map_max_by             |                               |                                                      |                                            |                                                 |
| match(`*`)             | re                            |                                                      |                                            |                                                 |
| merge                  |                               |                                                      |                                            |                                                 |
| mkdir                  | os.mkdir                      |                                                      |                                            |                                                 |
| mv                     | shutil.move                   |                                                      |                                            |                                                 |
| next                   |                               |                                                      |                                            |                                                 |
| nth                    | list[x]                       |                                                      |                                            |                                                 |
| open                   | open                          |                                                      |                                            |                                                 |
| parse                  |                               |                                                      |                                            |                                                 |
| pivot                  | zip(*matrix)                  |                                                      |                                            |                                                 |
| post(`*`)              | urllib.request.urlopen        |                                                      |                                            |                                                 |
| prepend                | deque.appendleft              |                                                      |                                            |                                                 |
| prev                   |                               |                                                      |                                            |                                                 |
| ps(`*`)                | os.listdir('/proc')           |                                                      |                                            |                                                 |
| pwd                    | os.getcwd                     |                                                      |                                            |                                                 |
| range                  | range                         |                                                      |                                            |                                                 |
| reduce_by              | functools.reduce              |                                                      |                                            |                                                 |
| reject                 |                               |                                                      |                                            |                                                 |
| rename                 | shutil.move                   |                                                      |                                            |                                                 |
| reverse                | reversed, list.reverse        |                                                      |                                            |                                                 |
| rm                     | os.remove                     |                                                      |                                            |                                                 |
| save                   | io.TextIOWrapper.write        |                                                      |                                            |                                                 |
| select(`***`)          | {k:dict[k] for k in keylist}  |                                                      |                                            |                                                 |
| shells                 |                               |                                                      |                                            |                                                 |
| shuffle                | random.shuffle                |                                                      |                                            |                                                 |
| size                   | len                           |                                                      |                                            |                                                 |
| skip                   | list[x:]                      |                                                      |                                            |                                                 |
| skip_until             |                               |                                                      |                                            |                                                 |
| skip_while             | itertools.dropwhile           |                                                      |                                            |                                                 |
| sort-by                | sorted, list.sort             |                                                      |                                            |                                                 |
| split_by               | re.split                      |                                                      |                                            |                                                 |
| split_column           |                               |                                                      |                                            |                                                 |
| split_row              |                               |                                                      |                                            |                                                 |
| str(`*`)               | str functions                 |                                                      |                                            |                                                 |
| sum                    | sum                           |                                                      |                                            |                                                 |
| sys(`*`)               | sys                           |                                                      |                                            |                                                 |
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
| touch                  | open(path, 'a').close()       |                                                      |                                            |                                                 |
| trim                   | strip, rstrip, lstrip         |                                                      |                                            |                                                 |
| uniq                   | set                           |                                                      |                                            |                                                 |
| update(`**`)           |                               |                                                      |                                            |                                                 |
| version                | sys.version, sys.version_info |                                                      |                                            |                                                 |
| with_env               | os.environ                    |                                                      |                                            |                                                 |
| what                   |                               |                                                      |                                            |                                                 |
| where                  | filter                        | filter                                               | filter                                     | filter                                          |
| which                  | shutil.which                  |                                                      |                                            |                                                 |
| wrap                   |                               |                                                      |                                            |                                                 |

* `*` - Pertenecen de los plugins standard
* `**` - renombrada de `edit` a `update` en 0.13.1
* `***` - renombrada de `pick` a `select` en 0.13.1
