# Nu Map from Functional Languages

The idea behind this table is to help you understand how Nu builtins and plugins relate to functional languages. We've tried to produce a map of relevant Nu commands and what their equivalents are in other languages. Contributions are welcome.

Note: this table assumes Nu 0.43 or later.

| Nushell                                    | Clojure                      | Tablecloth (Ocaml / Elm)        | Haskell                  |
|--------------------------------------------|------------------------------|---------------------------------|--------------------------|
| [append](../commands/docs/append.md)       | conj, into, concat           | append, (++), concat, concatMap | (++)                     |
| into binary                                | Integer/toHexString          |                                 | showHex                  |
| count                                      | count                        | length, size                    | length, size             |
| [date](../commands/docs/date.md)           | java.time.LocalDate/now      |                                 |                          |
| [each](../commands/docs/each.md)           | map, mapv, iterate           | map, forEach                    | map, mapM                |
| [exit](../commands/docs/each.md)           | System/exit                  |                                 |                          |
| [first](../commands/docs/first.md)         | first                        | head                            | head                     |
| [format](../commands/docs/format.md)       | format                       |                                 | Text.Printf.printf       |
| [group-by](../commands/docs/group-by.md)   | group-by                     |                                 | group, groupBy           |
| help                                       | doc                          |                                 |                          |
| [is-empty](../commands/docs/is-empty.md)   | empty?                       | isEmpty                         |                          |
| [last](../commands/docs/last.md)           | last, peek, take-last        | last                            | last                     |
| [lines](../commands/docs/lines.md)         |                              |                                 | lines, words, split-with |
| [match](../commands/docs/match.md)         |                              | match (Ocaml), case (Elm)       | case                     |
| nth                                        | nth                          | Array.get                       | lookup                   |
| [open](../commands/docs/open.md)           | with-open                    |                                 |                          |
| [transpose](../commands/docs/transpose.md) | (apply mapv vector matrix)   |                                 | transpose                |
| [prepend](../commands/docs/prepend.md)     | cons                         | cons, ::                        | ::                       |
| [print](../commands/docs/print.md)         | println                      |                                 | putStrLn, print          |
| range, 1..10                               | range                        | range                           | 1..10, 'a'..'f'          |
| [reduce](../commands/docs/reduce.md)       | reduce, reduce-kv            | foldr                           | foldr                    |
| [reverse](../commands/docs/reverse.md)     | reverse, rseq                | reverse, reverseInPlace         | reverse                  |
| [select](../commands/docs/select.md)       | select-keys                  |                                 |                          |
| [shuffle](../commands/docs/shuffle.md)     | shuffle                      |                                 |                          |
| size                                       | count                        |                                 | size, length             |
| [skip](../commands/docs/skip.md)           | rest                         | tail                            | tail                     |
| skip until                                 | drop-while                   |                                 |                          |
| skip while                                 | drop-while                   | dropWhile                       | dropWhile, dropWhileEnd  |
| [sort-by](../commands/docs/sort-by.md)     | sort, sort-by, sorted-set-by | sort, sortBy, sortWith          | sort, sortBy             |
| split row                                  | split, split-{at,with,lines} | split, words, lines             | split, words, lines      |
| [str](../commands/docs/str.md)             | clojure.string functions     | String functions                |                          |
| str join                                   | join                         | concat                          | intercalate              |
| str trim                                   | trim, triml, trimr           | trim, trimLeft, trimRight       | strip                    |
| sum                                        | apply +                      | sum                             | sum                      |
| [take](../commands/docs/take.md)           | take, drop-last, pop         | take, init                      | take, init               |
| take until                                 | take-while                   | takeWhile                       | takeWhile                |
| take while                                 | take-while                   | takeWhile                       | takeWhile                |
| [uniq](../commands/docs/uniq.md)           | set                          | Set.empty                       | Data.Set                 |
| [where](../commands/docs/where.md)         | filter, filterv, select      | filter, filterMap               | filter                   |
