---
title: 命令形言語から Nu への対応表
---

このテーブルは Nu の組込みコマンドやプラグインと他の命令型言語との対応関係を理解することを助けるためのものです。ここでは全ての Nu コマンドとそのコマンドが他の言語でどう使われているかをマッピングしています。コントリビューション歓迎です。

注: Nu が 0.14.1 以降であることを想定しています。

| Nushell           | Python                        | Kotlin (Java)                                       | C++                     | Rust                                          |
| ----------------- | ----------------------------- | --------------------------------------------------- | ----------------------- | --------------------------------------------- |
| alias             |                               |                                                     |                         |                                               |
| append            | list.append, set.add          | add                                                 | push_back, emplace_back | push, push_back                               |
| args              |                               |                                                     |                         |                                               |
| autoview          |                               |                                                     |                         |                                               |
| average(`*`)      | statistics.mean               |                                                     |                         |                                               |
| binaryview(`*`)   | \"{:x}\".format               | Integer.toHexString                                 |                         |                                               |
| calc, = math      | math operators                | math operators                                      | math operators          | math operators                                |
| cd                |                               |                                                     |                         |                                               |
| clear             |                               |                                                     |                         |                                               |
| clip              |                               |                                                     |                         |                                               |
| compact           |                               |                                                     |                         |                                               |
| config            |                               |                                                     |                         |                                               |
| count             | len                           | size, length                                        | length                  | len                                           |
| cp                | shutil.copy                   |                                                     |                         |                                               |
| date              | datetime.date.today           | java.time.LocalDate.now                             |                         |                                               |
| debug             |                               |                                                     |                         |                                               |
| default           |                               |                                                     |                         |                                               |
| drop              |                               |                                                     |                         |                                               |
| du                | shutil.disk_usage             |                                                     |                         |                                               |
| each              | for                           | for                                                 | for                     | for                                           |
| echo              | print                         | println                                             | printf                  | println!                                      |
| enter             |                               |                                                     |                         |                                               |
| evaluate_by       |                               |                                                     |                         |                                               |
| exit              | exit                          | System.exit, kotlin.system.exitProcess              | exit                    | exit                                          |
| first             | list[0]                       | List[0], peek                                       | vector[0], top          | Vec[0]                                        |
| format            | format                        | format                                              | format                  | format!                                       |
| from              | csv, json, sqlite3            |                                                     |                         |                                               |
| get               | dict[\"key\"]                 | Map[\"key\"]                                        | map[\"key\"]            | HashMap["key"], get, entry                    |
| group_by          | itertools.groupby             | groupBy                                             |                         | group_by                                      |
| headers           |                               |                                                     |                         |                                               |
| help              | help                          |                                                     |                         |                                               |
| histogram         |                               |                                                     |                         |                                               |
| history           |                               |                                                     |                         |                                               |
| http(`*`)         | urllib.request.urlopen        |                                                     |                         |                                               |
| inc(`*`)          | x += 1                        | x++                                                 | x++                     | x += 1                                        |
| insert            | list.insert                   |                                                     |                         |                                               |
| is_empty          | is None                       | isEmpty                                             | empty                   | is_empty                                      |
| keep              | list[:x]                      |                                                     |                         | &Vec[..x]                                     |
| keep_until        |                               |                                                     |                         |                                               |
| keep_while        | itertools.takewhile           |                                                     |                         |                                               |
| kill              | os.kill                       |                                                     |                         |                                               |
| last              | list[-1]                      |                                                     |                         | &Vec[Vec.len()-1]                             |
| lines             | split, splitlines             | split                                               | views::split            | split, split_whitespace, rsplit, lines        |
| ls                | os.listdir                    |                                                     |                         |                                               |
| map_max_by        |                               |                                                     |                         |                                               |
| match(`*`)        | re.findall                    | Regex.matches                                       | regex_match             |                                               |
| merge             |                               |                                                     |                         |                                               |
| mkdir             | os.mkdir                      |                                                     |                         |                                               |
| mv                | shutil.move                   |                                                     |                         |                                               |
| next              |                               |                                                     |                         |                                               |
| nth               | list[x]                       | List[x]                                             | vector[x]               | Vec[x]                                        |
| open              | open                          |                                                     |                         |                                               |
| parse             |                               |                                                     |                         |                                               |
| pivot, =transpose | zip(\*matrix)                 |                                                     |                         |                                               |
| post(`*`)         | urllib.request.urlopen        |                                                     |                         |                                               |
| prepend           | deque.appendleft              |                                                     |                         |                                               |
| prev              |                               |                                                     |                         |                                               |
| ps(`*`)           | os.listdir('/proc')           |                                                     |                         |                                               |
| pwd               | os.getcwd                     |                                                     |                         |                                               |
| range             | range                         | .., until, downTo, step                             | iota                    | ..                                            |
| reduce_by         | functools.reduce              | reduce                                              | reduce                  | fold, rfold, scan                             |
| reject            |                               |                                                     |                         |                                               |
| rename            | shutil.move                   |                                                     |                         |                                               |
| reverse           | reversed, list.reverse        | reverse, reversed, asReversed                       | reverse                 | rev                                           |
| rm                | os.remove                     |                                                     |                         |                                               |
| save              | io.TextIOWrapper.write        |                                                     |                         |                                               |
| select(`***`)     | {k:dict[k] for k in keylist}  |                                                     |                         |                                               |
| shells            |                               |                                                     |                         |                                               |
| shuffle           | random.shuffle                |                                                     |                         |                                               |
| size              | len                           |                                                     |                         |                                               |
| skip              | list[x:]                      |                                                     |                         | &Vec[x..]                                     |
| skip_until        |                               |                                                     |                         |                                               |
| skip_while        | itertools.dropwhile           |                                                     |                         |                                               |
| sort-by           | sorted, list.sort             | sortedBy, sortedWith, Arrays.sort, Collections.sort | sort                    | sort                                          |
| split_by          | str.split{,lines}, re.split   | split                                               | views::split            | split                                         |
| split_column      |                               |                                                     |                         |                                               |
| split_row         |                               |                                                     |                         |                                               |
| str(`*`)          | str functions                 | String functions                                    | string functions        | &str, String functions                        |
| sum               | sum                           | sum                                                 | reduce                  | sum                                           |
| sys(`*`)          | sys                           |                                                     |                         |                                               |
| table             |                               |                                                     |                         |                                               |
| tags              |                               |                                                     |                         |                                               |
| textview(`*`)     |                               |                                                     |                         |                                               |
| tree(`*`)         |                               |                                                     |                         |                                               |
| to                | csv, json, sqlite3            |                                                     |                         |                                               |
| touch             | open(path, 'a').close()       |                                                     |                         |                                               |
| trim              | strip, rstrip, lstrip         | trim, trimStart, trimEnd                            | regex                   | trim, trim*{start,end}, strip*{suffix,prefix} |
| uniq              | set                           | Set                                                 | set                     | HashSet                                       |
| update(`**`)      |                               |                                                     |                         |                                               |
| version           | sys.version, sys.version_info |                                                     |                         |                                               |
| with_env          | os.environ                    |                                                     |                         |                                               |
| what              |                               |                                                     |                         |                                               |
| where             | filter                        | filter                                              | filter                  | filter                                        |
| which             | shutil.which                  |                                                     |                         |                                               |
| wrap              |                               |                                                     |                         |                                               |

- `*` - these commands are part of the standard plugins
- `**` - renamed from `edit` to `update` in 0.13.1
- `***` - renamed from `pick` to `select` in 0.13.1
