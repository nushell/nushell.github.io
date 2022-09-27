# 从命令式语言到 Nu

这个表格的目的是帮助你了解 Nu 的内置和插件所提供的命令与命令式语言的关系。我们试图制作一张所有 Nu 命令和它们在其他语言中的对应关系的表。欢迎大家参与贡献。

注意：此表假设 Nu 0.43 或更高版本。

| Nushell      | Python                        | Kotlin (Java)                                       | C++                     | Rust                                          |
| ------------ | ----------------------------- | --------------------------------------------------- | ----------------------- | --------------------------------------------- |
| alias        |                               |                                                     |                         |                                               |
| append       | list.append, set.add          | add                                                 | push_back, emplace_back | push, push_back                               |
| args         |                               |                                                     |                         |                                               |
| autoview     |                               |                                                     |                         |                                               |
| math avg     | statistics.mean               |                                                     |                         |                                               |
| calc, = math | math operators                | math operators                                      | math operators          | math operators                                |
| cd           |                               |                                                     |                         |                                               |
| clear        |                               |                                                     |                         |                                               |
| clip         |                               |                                                     |                         |                                               |
| compact      |                               |                                                     |                         |                                               |
| config       |                               |                                                     |                         |                                               |
| count        | len                           | size, length                                        | length                  | len                                           |
| cp           | shutil.copy                   |                                                     |                         |                                               |
| date         | datetime.date.today           | java.time.LocalDate.now                             |                         |                                               |
| debug        |                               |                                                     |                         |                                               |
| default      |                               |                                                     |                         |                                               |
| drop         |                               |                                                     |                         |                                               |
| du           | shutil.disk_usage             |                                                     |                         |                                               |
| each         | for                           | for                                                 | for                     | for                                           |
| echo         | print                         | println                                             | printf                  | println!                                      |
| enter        |                               |                                                     |                         |                                               |
| exit         | exit                          | System.exit, kotlin.system.exitProcess              | exit                    | exit                                          |
| fetch        | urllib.request.urlopen        |                                                     |                         |                                               |
| first        | list[0]                       | List[0], peek                                       | vector[0], top          | Vec[0]                                        |
| format       | format                        | format                                              | format                  | format!                                       |
| from         | csv, json, sqlite3            |                                                     |                         |                                               |
| get          | dict[\"key\"]                 | Map[\"key\"]                                        | map[\"key\"]            | HashMap["key"], get, entry                    |
| group-by     | itertools.groupby             | groupBy                                             |                         | group_by                                      |
| headers      |                               |                                                     |                         |                                               |
| help         | help                          |                                                     |                         |                                               |
| histogram    |                               |                                                     |                         |                                               |
| history      |                               |                                                     |                         |                                               |
| inc(`*`)     | x += 1                        | x++                                                 | x++                     | x += 1                                        |
| insert       | list.insert                   |                                                     |                         |                                               |
| is-empty     | is None                       | isEmpty                                             | empty                   | is_empty                                      |
| keep         | list[:x]                      |                                                     |                         | &Vec[..x]                                     |
| keep until   |                               |                                                     |                         |                                               |
| keep while   | itertools.takewhile           |                                                     |                         |                                               |
| kill         | os.kill                       |                                                     |                         |                                               |
| last         | list[-1]                      |                                                     |                         | &Vec[Vec.len()-1]                             |
| lines        | split, splitlines             | split                                               | views::split            | split, split_whitespace, rsplit, lines        |
| ls           | os.listdir                    |                                                     |                         |                                               |
| match(`*`)   | re.findall                    | Regex.matches                                       | regex_match             |                                               |
| merge        |                               |                                                     |                         |                                               |
| mkdir        | os.mkdir                      |                                                     |                         |                                               |
| mv           | shutil.move                   |                                                     |                         |                                               |
| next         |                               |                                                     |                         |                                               |
| nth          | list[x]                       | List[x]                                             | vector[x]               | Vec[x]                                        |
| open         | open                          |                                                     |                         |                                               |
| parse        |                               |                                                     |                         |                                               |
| transpose    | zip(\*matrix)                 |                                                     |                         |                                               |
| post(`*`)    | urllib.request.urlopen        |                                                     |                         |                                               |
| prepend      | deque.appendleft              |                                                     |                         |                                               |
| prev         |                               |                                                     |                         |                                               |
| ps(`*`)      | os.listdir('/proc')           |                                                     |                         |                                               |
| pwd          | os.getcwd                     |                                                     |                         |                                               |
| range        | range                         | .., until, downTo, step                             | iota                    | ..                                            |
| reduce       | functools.reduce              | reduce                                              | reduce                  | fold, rfold, scan                             |
| reject       |                               |                                                     |                         |                                               |
| rename       | shutil.move                   |                                                     |                         |                                               |
| reverse      | reversed, list.reverse        | reverse, reversed, asReversed                       | reverse                 | rev                                           |
| rm           | os.remove                     |                                                     |                         |                                               |
| save         | io.TextIOWrapper.write        |                                                     |                         |                                               |
| select       | {k:dict[k] for k in keylist}  |                                                     |                         |                                               |
| shells       |                               |                                                     |                         |                                               |
| shuffle      | random.shuffle                |                                                     |                         |                                               |
| size         | len                           |                                                     |                         |                                               |
| skip         | list[x:]                      |                                                     |                         | &Vec[x..],skip                                |
| skip until   |                               |                                                     |                         |                                               |
| skip while   | itertools.dropwhile           |                                                     |                         | skip_while                                    |
| sort-by      | sorted, list.sort             | sortedBy, sortedWith, Arrays.sort, Collections.sort | sort                    | sort                                          |
| split-by     | str.split{,lines}, re.split   | split                                               | views::split            | split                                         |
| split column |                               |                                                     |                         |                                               |
| split row    |                               |                                                     |                         |                                               |
| str(`*`)     | str functions                 | String functions                                    | string functions        | &str, String functions                        |
| str join  | str.join                      | joinToString                                        |                         | join                                          |
| str trim     | strip, rstrip, lstrip         | trim, trimStart, trimEnd                            | regex                   | trim, trim*{start,end}, strip*{suffix,prefix} |
| sum          | sum                           | sum                                                 | reduce                  | sum                                           |
| sys(`*`)     | sys                           |                                                     |                         |                                               |
| table        |                               |                                                     |                         |                                               |
| tags         |                               |                                                     |                         |                                               |
| tree(`*`)    |                               |                                                     |                         |                                               |
| to           | csv, json, sqlite3            |                                                     |                         |                                               |
| touch        | open(path, 'a').close()       |                                                     |                         |                                               |
| uniq         | set                           | Set                                                 | set                     | HashSet                                       |
| upsert       |                               |                                                     |                         |                                               |
| version      | sys.version, sys.version_info |                                                     |                         |                                               |
| with-env     | os.environ                    |                                                     |                         |                                               |
| where        | filter                        | filter                                              | filter                  | filter                                        |
| which        | shutil.which                  |                                                     |                         |                                               |
| wrap         |                               |                                                     |                         |                                               |

- `*` - 这些命令是标准插件的一部分
