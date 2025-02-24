help commands | where name == each | first | get params
# => ╭───┬──────────────────┬──────────────┬──────────┬───────────────────────────────────────────╮
# => │ # │       name       │     type     │ required │                description                │
# => ├───┼──────────────────┼──────────────┼──────────┼───────────────────────────────────────────┤
# => │ 0 │ closure          │ closure(any) │ true     │ The closure to run.                       │
# => │ 1 │ --help(-h)       │ switch       │ false    │ Display the help message for this command │
# => │ 2 │ --keep-empty(-k) │ switch       │ false    │ keep empty result cells                   │
# => ╰───┴──────────────────┴──────────────┴──────────┴───────────────────────────────────────────╯
