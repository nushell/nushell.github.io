# Accessing ARGV

If you have positional and REST parameters along with a flag, you can access them in your main script file in the `main` function - unlike other scripting languages, Nushell doesn't provide direct access to the ARGV input array, but here is a way to circumvent the issue:

```nu
# supercar.nu

def main [
  manuf: string
  model: string
  --fast (-f)
  ] {
    [$manuf $model $fast] | flatten
}
```

```nu
nu supercar.nu manuf ferrari model F40 -f

╭───┬───────────────╮
│ 0 │ manuf=ferrari │
│ 1 │ model=F40     │
│ 2 │ true          │
╰───┴───────────────╯

nu supercar.nu manuf=citroen model=2cv

╭───┬──────────────────╮
│ 0 │ manuf=citroen    │
│ 1 │ model=2cv        │
│ 2 │ false            │
╰───┴──────────────────╯
```

Once your command line becomes complicated, the parameter list very quickly becomes unwieldy:

```nu
def main [
  manuf: string
  model: string
  --fast (-f)
  --num-cylinders: int,
  --color: string
  ] {
    [$manuf $model $fast $num_cylinders $color] | flatten
}

nu supercar.nu manuf=ferrari model=F40 -f --color=red
╭───┬───────────────╮
│ 0 │ manuf=ferrari │
│ 1 │ model=F40     │
│ 2 │ true          │
│ 3 │               │
│ 4 │ red           │
╰───┴───────────────╯

nu supercar.nu manuf=citroen model=2cv --num-cylinders=2 --color=yellow
╭───┬───────────────╮
│ 0 │ manuf=citroen │
│ 1 │ model=2cv     │
│ 2 │ false         │
│ 3 │             2 │
│ 4 │ yellow        │
╰───┴───────────────╯
```

If your CLI requires subcommands the parameter list becomes very cumbersome. If you _wrap_ your `main` command with the `--wrapped` modifier, Nushell will wrap the additional parameters.

````nu
def --wrapped main [
  manuf: string
  model: string
  --fast (-f)
  ...about: string
  ] {
    [$manuf $model $fast $about] | flatten
}

nu supercar.nu manuf=ferrari model=F40 -f --color=red --description="Rare Italian sportscar"
╭───┬────────────────────────────────────────╮
│ 0 │ manuf=ferrari                          │
│ 1 │ model=F40                              │
│ 2 │ true                                   │
│ 4 │ red                                    │
│ 5 │ --description=`Rare Italian sportscar` │
╰───┴────────────────────────────────────────╯

nu supercar.nu manuf=citroen model=2cv --num-cylinders=2 --color=yellow --description="Delightful but slow to drive"
╭───┬───────────────────╮
│ 0 │ manuf=citroen     │
│ 1 │ model=2cv         │
│ 2 │ false             │
│ 3 │ --num-cylinders=2 │
│ 4 │ --color=yellow    │
╰───┴───────────────────╯```
````

Alternatively, if you don't want to use the equals symbol in your keyword parameters, you can do this:

```nu
nu supercar.nu manuf ferrari model F40 -f --color red --description "Rare Italian sportscar"

╭───┬────────────────────────╮
│ 0 │ manuf                  │
│ 1 │ ferrari                │
│ 2 │ true                   │
│ 3 │ model                  │
│ 4 │ F40                    │
│ 5 │ --color                │
│ 6 │ red                    │
│ 7 │ --description          │
│ 8 │ Rare Italian sportscar │
╰───┴────────────────────────╯

nu supercar.nu manuf citroen model 2cv --num-cylinders 2 --color yellow --description "Delightful but slow to drive"

╭────┬──────────────────────────────╮
│  0 │ manuf                        │
│  1 │ citroen                      │
│  2 │ false                        │
│  3 │ model                        │
│  4 │ 2cv                          │
│  5 │ --num-cylinders              │
│  6 │ 2                            │
│  7 │ --color                      │
│  8 │ yellow                       │
│  9 │ --description                │
│ 10 │ Delightful but slow to drive │
╰────┴──────────────────────────────╯
```
