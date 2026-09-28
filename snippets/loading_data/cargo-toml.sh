open Cargo.lock | from toml | get package | select name version | first 3
# => ╭───┬──────────────┬─────────╮
# => │ # │     name     │ version │
# => ├───┼──────────────┼─────────┤
# => │ 0 │ adhoc_derive │ 0.1.2   │
# => │ 1 │ aho-corasick │ 1.1.5   │
# => │ 2 │ demo         │ 0.1.0   │
# => ╰───┴──────────────┴─────────╯
