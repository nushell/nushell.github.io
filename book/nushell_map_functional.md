# Nu Map from Functional Languages

The idea behind this table is to help you understand how Nu builtins and plugins relate to functional languages. We've tried to produce a map of relevant Nu commands and what their equivalents are in other languages. Contributions are welcome.

Note: this table assumes Nu 0.43 or later.

| Nushell      | Clojure                      | Tablecloth (Ocaml / Elm)        | Haskell                  | Nix                            |
| ------------ | ---------------------------- | ------------------------------- | ------------------------ | ------------------------------ |
| append       | conj, into, concat           | append, (++), concat, concatMap | (++)                     |  `builtins.concatLists`        |
| into binary  | Integer/toHexString          |                                 | showHex                  |  `toString (toHex value)`      |
| count        | count                        | length, size                    | length, size             |  `builtins.length`             |
| date         | java.time.LocalDate/now      |                                 |                          |  `builtins.time`               |
| each         | map, mapv, iterate           | map, forEach                    | map, mapM                |  `map`                         |
| exit         | System/exit                  |                                 |                          |  `throw`                       |
| first        | first                        | head                            | head                     |  `builtins.head`               |
| format       | format                       |                                 | Text.Printf.printf       |  `builtins.toString`           |
| group-by     | group-by                     |                                 | group, groupBy           |  Custom function with `map`    |
| help         | doc                          |                                 |                          |  N/A (Check Nix docs)          |
| is-empty     | empty?                       | isEmpty                         |                          |  `length == 0`                 |
| last         | last, peek, take-last        | last                            | last                     |  `builtins.last`               |
| lines        |                              |                                 | lines, words, split-with |  `splitString ""`              |
| match        |                              | match (Ocaml), case (Elm)       | case                     |  N/A (Custom logic)            |
| nth          | nth                          | Array.get                       | lookup                   |  `list[<index>]`               |
| open         | with-open                    |                                 |                          |  N/A (Declarative paradigm)    |
| transpose    | (apply mapv vector matrix)   |                                 | transpose                |  Custom function               |
| prepend      | cons                         | cons, ::                        | ::                       |  `[value] ++ list`             |
| print        | println                      |                                 | putStrLn, print          |  `builtins.trace`              |
| range, 1..10 | range                        | range                           | 1..10, 'a'..'f'          |  `builtins.genList`            |
| reduce       | reduce, reduce-kv            | foldr                           | foldr                    |  Custom function with `fold`   |
| reverse      | reverse, rseq                | reverse, reverseInPlace         | reverse                  |  `builtins.reverse`            |
| select       | select-keys                  |                                 |                          |  Custom function with `attr`   |
| shuffle      | shuffle                      |                                 |                          |  N/A (Write custom logic)      |
| size         | count                        |                                 | size, length             |  `builtins.length`             |
| skip         | rest                         | tail                            | tail                     |  `builtins.tail`               |
| skip until   | drop-while                   |                                 |                          |  Custom function with `filter` |
| skip while   | drop-while                   | dropWhile                       | dropWhile, dropWhileEnd  |  Custom function with `filter` |
| sort-by      | sort, sort-by, sorted-set-by | sort, sortBy, sortWith          | sort, sortBy             |  Custom sort logic             |
| split row    | split, split-{at,with,lines} | split, words, lines             | split, words, lines      |  `lib.splitString`             |
| str          | clojure.string functions     | String functions                |                          |  `builtins.toString`           |
| str join     | join                         | concat                          | intercalate              |  `builtins.concatStringsSep`   |
| str trim     | trim, triml, trimr           | trim, trimLeft, trimRight       | strip                    |  Custom function               |
| sum          | apply +                      | sum                             | sum                      |  Custom fold logic             |
| take         | take, drop-last, pop         | take, init                      | take, init               |  `builtins.slice`              |
| take until   | take-while                   | takeWhile                       | takeWhile                |  Custom function               |
| take while   | take-while                   | takeWhile                       | takeWhile                |  Custom function               |
| uniq         | set                          | Set.empty                       | Data.Set                 |  `lib.unique`                  |
| where        | filter, filterv, select      | filter, filterMap               | filter                   |  `filter`                      |

