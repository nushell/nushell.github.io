---
title: Community
---

# Nu map from imperative languages

The idea behind this table is to help you understand how Nu built-ins and plugins relate to imperative languages. We've tried to produce a map of programming-relevant Nu commands and what their equivalents are in other languages. Contributions are welcome.

Note: this table assumes Nu 0.43 or later.

| Nushell      | Python                             | Kotlin (Java)                                       | C++                     | Rust                                                |
| ------------ | ---------------------------------- | --------------------------------------------------- | ----------------------- | --------------------------------------------------- |
| append       | list.append, set.add               | add                                                 | push_back, emplace_back | push, push_back                                     |
| math avg     | statistics.mean                    |                                                     |                         |                                                     |
| calc, = math | math operators                     | math operators                                      | math operators          | math operators                                      |
| count        | len                                | size, length                                        | length                  | len                                                 |
| cp           | shutil.copy                        |                                                     |                         | fs::copy                                            |
| date         | datetime.date.today                | java.time.LocalDate.now                             |                         |                                                     |
| drop         | list[:-3]                          |                                                     |                         |                                                     |
| du           | shutil.disk_usage                  |                                                     |                         |                                                     |
| each         | for                                | for                                                 | for                     | for                                                 |
| exit         | exit                               | System.exit, kotlin.system.exitProcess              | exit                    | exit                                                |
| http get     | urllib.request.urlopen             |                                                     |                         |                                                     |
| first        | list[:x]                           | List[0], peek                                       | vector[0], top          | Vec[0]                                              |
| format       | format                             | format                                              | format                  | format!                                             |
| from         | csv, json, sqlite3                 |                                                     |                         |                                                     |
| get          | dict[\"key\"]                      | Map[\"key\"]                                        | map[\"key\"]            | HashMap["key"], get, entry                          |
| group-by     | itertools.groupby                  | groupBy                                             |                         | group_by                                            |
| headers      | keys                               |                                                     |                         |                                                     |
| help         | help                               |                                                     |                         |                                                     |
| insert       | dict[\"key\"] = val                |                                                     | map.insert({ 20, 130 }) | map.insert(\"key\", val)                            |
| is-empty     | is None, is []                     | isEmpty                                             | empty                   | is_empty                                            |
| take         | list[:x]                           |                                                     |                         | &Vec[..x]                                           |
| take until   | itertools.takewhile                |                                                     |                         |                                                     |
| take while   | itertools.takewhile                |                                                     |                         |                                                     |
| kill         | os.kill                            |                                                     |                         |                                                     |
| last         | list[-x:]                          |                                                     |                         | &Vec[Vec.len()-1]                                   |
| lines        | split, splitlines                  | split                                               | views::split            | split, split_whitespace, rsplit, lines              |
| ls           | os.listdir                         |                                                     |                         | fs::read_dir                                        |
| match        | match                              | when                                                |                         | match                                               |
| merge        | dict.append                        |                                                     |                         | map.extend                                          |
| mkdir        | os.mkdir                           |                                                     |                         | fs::create_dir                                      |
| mv           | shutil.move                        |                                                     |                         | fs::rename                                          |
| get          | list[x]                            | List[x]                                             | vector[x]               | Vec[x]                                              |
| open         | open                               |                                                     |                         |                                                     |
| transpose    | zip(\*matrix)                      |                                                     |                         |                                                     |
| http post    | urllib.request.urlopen             |                                                     |                         |                                                     |
| prepend      | deque.appendleft                   |                                                     |                         |                                                     |
| print        | print                              | println                                             | printf                  | println!                                            |
| ps           | os.listdir('/proc')                |                                                     |                         |                                                     |
| pwd          | os.getcwd                          |                                                     |                         | env::current_dir                                    |
| range        | range                              | .., until, downTo, step                             | iota                    | ..                                                  |
| reduce       | functools.reduce                   | reduce                                              | reduce                  | fold, rfold, scan                                   |
| reject       | del                                |                                                     |                         |                                                     |
| rename       | dict[\"key2\"] = dict.pop(\"key\") |                                                     |                         | map.insert(\"key2\", map.remove(\"key\").unwrap()); |
| reverse      | reversed, list.reverse             | reverse, reversed, asReversed                       | reverse                 | rev                                                 |
| rm           | os.remove                          |                                                     |                         |                                                     |
| save         | io.TextIOWrapper.write             |                                                     |                         |                                                     |
| select       | {k:dict[k] for k in keys}          |                                                     |                         |                                                     |
| shuffle      | random.shuffle                     |                                                     |                         |                                                     |
| size         | len                                |                                                     |                         | len                                                 |
| skip         | list[x:]                           |                                                     |                         | &Vec[x..],skip                                      |
| skip until   | itertools.dropwhile                |                                                     |                         |                                                     |
| skip while   | itertools.dropwhile                |                                                     |                         | skip_while                                          |
| sort-by      | sorted, list.sort                  | sortedBy, sortedWith, Arrays.sort, Collections.sort | sort                    | sort                                                |
| split row    | str.split{,lines}, re.split        | split                                               | views::split            | split                                               |
| str          | str functions                      | String functions                                    | string functions        | &str, String functions                              |
| str join     | str.join                           | joinToString                                        |                         | join                                                |
| str trim     | strip, rstrip, lstrip              | trim, trimStart, trimEnd                            | regex                   | trim, trim*{start,end}, strip*{suffix,prefix}       |
| sum          | sum                                | sum                                                 | reduce                  | sum                                                 |
| sys          | sys                                |                                                     |                         |                                                     |
| to           | import csv, json, sqlite3          |                                                     |                         |                                                     |
| touch        | open(path, 'a').close()            |                                                     |                         |                                                     |
| uniq         | set                                | Set                                                 | set                     | HashSet                                             |
| upsert       | dict[\"key\"] = val                |                                                     |                         |                                                     |
| version      | sys.version, sys.version_info      |                                                     |                         |                                                     |
| with-env     | os.environ                         |                                                     |                         |                                                     |
| where        | filter                             | filter                                              | filter                  | filter                                              |
| which        | shutil.which                       |                                                     |                         |                                                     |
| wrap         | { "key" : val }                    |                                                     |                         |                                                     |
