# 从函数式语言到 Nu

这个表格的目的是帮助你了解 Nu 的内置和插件所提供命令与函数式语言的关系。我们试图制作一张所有 Nu 命令和它们在其他语言中的映射关系的表。欢迎大家参与贡献。

注意：此表针对 Nu 0.43 或更高版本。

| Nushell      | Clojure                      | Tablecloth (Ocaml / Elm)        | Haskell                  |
| ------------ | ---------------------------- | ------------------------------- | ------------------------ |
| append       | conj, into, concat           | append, (++), concat, concatMap | (++)                     |
| into binary  | Integer/toHexString          |                                 | showHex                  |
| count        | count                        | length, size                    | length, size             |
| date         | java.time.LocalDate/now      |                                 |                          |
| each         | map, mapv, iterate           | map, forEach                    | map, mapM                |
| exit         | System/exit                  |                                 |                          |
| first        | first                        | head                            | head                     |
| format       | format                       |                                 | Text.Printf.printf       |
| group-by     | group-by                     |                                 | group, groupBy           |
| help         | doc                          |                                 |                          |
| is-empty     | empty?                       | isEmpty                         |                          |
| last         | last, peek, take-last        | last                            | last                     |
| lines        |                              |                                 | lines, words, split-with |
| match        |                              | match (Ocaml), case (Elm)       | case                     |
| nth          | nth                          | Array.get                       | lookup                   |
| open         | with-open                    |                                 |                          |
| transpose    | (apply mapv vector matrix)   |                                 | transpose                |
| prepend      | cons                         | cons, ::                        | ::                       |
| print        | println                      |                                 | putStrLn, print          |
| range, 1..10 | range                        | range                           | 1..10, 'a'..'f'          |
| reduce       | reduce, reduce-kv            | foldr                           | foldr                    |
| reverse      | reverse, rseq                | reverse, reverseInPlace         | reverse                  |
| select       | select-keys                  |                                 |                          |
| shuffle      | shuffle                      |                                 |                          |
| size         | count                        |                                 | size, length             |
| skip         | rest                         | tail                            | tail                     |
| skip until   | drop-while                   |                                 |                          |
| skip while   | drop-while                   | dropWhile                       | dropWhile, dropWhileEnd  |
| sort-by      | sort, sort-by, sorted-set-by | sort, sortBy, sortWith          | sort, sortBy             |
| split row    | split, split-{at,with,lines} | split, words, lines             | split, words, lines      |
| str          | clojure.string functions     | String functions                |                          |
| str join     | join                         | concat                          | intercalate              |
| str trim     | trim, triml, trimr           | trim, trimLeft, trimRight       | strip                    |
| sum          | apply +                      | sum                             | sum                      |
| take         | take, drop-last, pop         | take, init                      | take, init               |
| take until   | take-while                   | takeWhile                       | takeWhile                |
| take while   | take-while                   | takeWhile                       | takeWhile                |
| uniq         | set                          | Set.empty                       | Data.Set                 |
| where        | filter, filterv, select      | filter, filterMap               | filter                   |
