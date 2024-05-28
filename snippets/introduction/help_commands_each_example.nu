> help commands | where name == each | first
╭──────────────┬────────────────────────────────────────────────────────────────────────────────────────────────╮
│ name         │ each                                                                                           │
│ category     │ filters                                                                                        │
│ command_type │ built-in                                                                                       │
│ usage        │ Run a closure on each row of the input list, creating a new list with the results.             │
│              │ ╭───┬──────────────────┬──────────────┬──────────┬───────────────────────────────────────────╮ │
│ params       │ │ # │       name       │     type     │ required │                description                │ │
│              │ ├───┼──────────────────┼──────────────┼──────────┼───────────────────────────────────────────┤ │
│              │ │ 0 │ closure          │ closure(any) │ true     │ The closure to run.                       │ │
│              │ │ 1 │ --help(-h)       │ switch       │ false    │ Display the help message for this command │ │
│              │ │ 2 │ --keep-empty(-k) │ switch       │ false    │ keep empty result cells                   │ │
│              │ ╰───┴──────────────────┴──────────────┴──────────┴───────────────────────────────────────────╯ │
│              │ ╭───┬───────────┬───────────╮                                                                  │
│ input_output │ │ # │   input   │  output   │                                                                  │
│              │ ├───┼───────────┼───────────┤                                                                  │
│              │ │ 0 │ list<any> │ list<any> │                                                                  │
│              │ │ 1 │ table     │ list<any> │                                                                  │
│              │ │ 2 │ any       │ any       │                                                                  │
│              │ ╰───┴───────────┴───────────╯                                                                  │
│ search_terms │ for, loop, iterate, map                                                                        │
╰──────────────┴────────────────────────────────────────────────────────────────────────────────────────────────╯
