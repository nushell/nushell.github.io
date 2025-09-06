# 함수형 언어의 Nu 맵

이 표의 목적은 Nu 내장 기능과 플러그인이 함수형 언어와 어떻게 관련되는지 이해하는 데 도움을 주는 것입니다. 관련 Nu 명령과 다른 언어에서의 해당 명령을 매핑하려고 노력했습니다. 기여를 환영합니다.

참고: 이 표는 Nu 0.43 이상을 가정합니다.

| 누셸      | 클로저                      | 테이블클로스 (오카믈 / 엘름)        | 하스켈                  |
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
| match        |                              | match (오카믈), case (엘름)       | case                     |
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
| str          | clojure.string 함수     | String 함수                |                          |
| str join     | join                         | concat                          | intercalate              |
| str trim     | trim, triml, trimr           | trim, trimLeft, trimRight       | strip                    |
| sum          | apply +                      | sum                             | sum                      |
| take         | take, drop-last, pop         | take, init                      | take, init               |
| take until   | take-while                   | takeWhile                       | takeWhile                |
| take while   | take-while                   | takeWhile                       | takeWhile                |
| uniq         | set                          | Set.empty                       | Data.Set                 |
| where        | filter, filterv, select      | filter, filterMap               | filter                   |
