---
title: from
layout: command
nu_version: 0.14
---

Converts content (string or binary) into a table. The source format is specified as a subcommand, like `from csv` or `from json`.

Use this when nushell cannot determine the input file extension.

## Available Subcommands

* from bson
* [from csv](/docs/from-csv)
* from eml
* [from ics](/docs/from-ics)
* from ini
* [from json](/docs/from-json)
* [from ods](/docs/from-ods)
* from sqlite
* from ssv
* [from toml](/docs/from-toml)
* [from tsv](/docs/from-tsv)
* from url
* [from vcf](/docs/from-vcf)
* [from xlsx](/docs/from-xlsx)
* from xml
* [from yaml](/docs/from-yaml)

*Subcommands without links are currently missing their documentation.*

## Example for `from csv`

Let's say we have the following file :

```shell
> cat pets.txt
animal, name, age
cat, Tom, 7
dog, Alfred, 10
chameleon, Linda, 1
```

`pets.txt` is actually a .csv file but it has the .txt extension, `open` is not able to convert it into a table :

```shell
> open pets.txt
animal, name, age
cat, Tom, 7
dog, Alfred, 10
chameleon, Linda, 1
```

To get a table from `pets.txt` we need to use the `from csv` command:

```shell
> open pets.txt | from csv
━━━┯━━━━━━━━━━━┯━━━━━━━━━┯━━━━━━
 # │ animal    │  name   │  age
───┼───────────┼─────────┼──────
 0 │ cat       │  Tom    │  7
 1 │ dog       │  Alfred │  10
 2 │ chameleon │  Linda  │  1
━━━┷━━━━━━━━━━━┷━━━━━━━━━┷━━━━━━
```
