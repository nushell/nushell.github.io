# 从函数式语言到 Nu

这个表格的目的是帮助你了解 Nu 的内置和插件所提供命令与函数式语言的关系。我们试图制作一张所有 Nu 命令和它们在其他语言中的映射关系的表。欢迎大家参与贡献。

注意：此表针对 Nu 0.43 或更高版本。

| Nushell                   | Clojure                      | Tablecloth (Ocaml / Elm)        | Haskell                  |     |
| ------------------------- | ---------------------------- | ------------------------------- | ------------------------ | --- |
| alias                     |                              |                                 |                          |     |
| append                    | conj, into, concat           | append, (++), concat, concatMap | (++)                     |     |
| args                      |                              |                                 |                          |     |
| autoview                  |                              |                                 |                          |     |
| math avg                  |                              |                                 |                          |     |
| into binary               | Integer/toHexString          |                                 | showHex                  |     |
| calc, `<math expression>` | math operators               |                                 |                          |     |
| cd                        |                              |                                 |                          |     |
| clear                     |                              |                                 |                          |     |
| clip                      |                              |                                 |                          |     |
| compact                   |                              |                                 |                          |     |
| config                    |                              |                                 |                          |     |
| count                     | count                        | length, size                    | length, size             |     |
| cp                        |                              |                                 |                          |     |
| date                      | java.time.LocalDate/now      |                                 |                          |     |
| debug                     |                              |                                 |                          |     |
| default                   |                              |                                 |                          |     |
| drop                      |                              |                                 |                          |     |
| du                        |                              |                                 |                          |     |
| each                      | map, mapv, iterate           | map, forEach                    | map                      |     |
| echo                      | println                      |                                 | putStrLn, print          |     |
| enter                     |                              |                                 |                          |     |
| exit                      | System/exit                  |                                 |                          |     |
| fetch(`*`)                |                              |                                 |                          |     |
| first                     | first                        | head                            | head                     |     |
| format                    | format                       |                                 | Text.Printf.printf       |     |
| from                      |                              |                                 |                          |     |
| get                       |                              |                                 |                          |     |
| group-by                  | group-by                     |                                 | group, groupBy           |     |
| headers                   |                              |                                 |                          |     |
| help                      | doc                          |                                 |                          |     |
| histogram                 |                              |                                 |                          |     |
| history                   |                              |                                 |                          |     |
| inc(`*`)                  | inc                          |                                 | succ                     |     |
| insert                    |                              |                                 |                          |     |
| empty?                    | empty?                       | isEmpty                         |                          |     |
| keep                      | take, drop-last, pop         | take, init                      | take, init               |     |
| keep-until                |                              |                                 |                          |     |
| keep-while                | take-while                   | takeWhile                       | takeWhile                |     |
| kill                      |                              |                                 |                          |     |
| last                      | last, peek, take-last        | last                            | last                     |     |
| lines                     |                              |                                 | lines, words, split-with |     |
| ls                        |                              |                                 |                          |     |
| match(`*`)                | re-matches, re-seq, re-find  |                                 |                          |     |
| merge                     |                              |                                 |                          |     |
| mkdir                     |                              |                                 |                          |     |
| mv                        |                              |                                 |                          |     |
| next                      |                              |                                 |                          |     |
| nth                       | nth                          | Array.get                       | lookup                   |     |
| open                      | with-open                    |                                 |                          |     |
| parse                     |                              |                                 |                          |     |
| transpose                 | (apply mapv vector matrix)   |                                 | transpose                |     |
| post(`*`)                 |                              |                                 |                          |     |
| prepend                   | cons                         | cons, ::                        | ::                       |     |
| prev                      |                              |                                 |                          |     |
| ps                        |                              |                                 |                          |     |
| pwd                       |                              |                                 |                          |     |
| range, 1..10              | range                        | range                           | 1..10, 'a'..'f'          |     |
| reduce                    | reduce, reduce-kv            | foldr                           | foldr                    |     |
| reject                    |                              |                                 |                          |     |
| rename                    |                              |                                 |                          |     |
| reverse                   | reverse, rseq                | reverse, reverseInPlace         | reverse                  |     |
| rm                        |                              |                                 |                          |     |
| save                      |                              |                                 |                          |     |
| select                    | select-keys                  |                                 |                          |     |
| shells                    |                              |                                 |                          |     |
| shuffle                   | shuffle                      |                                 |                          |     |
| size                      | count                        |                                 | size, length             |     |
| skip                      | rest                         | tail                            | tail                     |     |
| skip until                |                              |                                 |                          |     |
| skip while                | drop-while                   | dropWhile                       | dropWhile, dropWhileEnd  |     |
| sort-by                   | sort, sort-by, sorted-set-by | sort, sortBy, sortWith          | sort, sortBy             |     |
| split-by                  | split, split-{at,with,lines} | split, words, lines             | split, words, lines      |     |
| split column              |                              |                                 |                          |     |
| split row                 |                              |                                 |                          |     |
| str(`*`)                  | clojure.string functions     | String functions                |                          |     |
| str collect               | join                         | concat                          | intercalate              |     |
| str trim                  | trim, triml, trimr           | trim, trimLeft, trimRight       | strip                    |     |
| sum                       | apply +                      | sum                             | sum                      |     |
| sys                       |                              |                                 |                          |     |
| table                     |                              |                                 |                          |     |
| tags                      |                              |                                 |                          |     |
| tree(`*`)                 |                              |                                 |                          |     |
| to                        |                              |                                 |                          |     |
| touch                     |                              |                                 |                          |     |
| uniq                      | set                          | Set.empty                       | Data.Set                 |     |
| upsert                    |                              |                                 |                          |     |
| version                   |                              |                                 |                          |     |
| with_env                  |                              |                                 |                          |     |
| what                      |                              |                                 |                          |     |
| where                     | filter, filterv, select      | filter, filterMap               | filter                   |     |
| which                     |                              |                                 |                          |     |
| wrap                      |                              |                                 |                          |     |

- `*` - 这些命令是标准插件的一部分
