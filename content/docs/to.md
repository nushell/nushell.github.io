---
title: to
layout: command
nu_version: 0.14
---

Converts table data into a string or binary. The target format is specified as a subcommand, like `to csv` or `to json`.

## Available Subcommands

* to bson
* [to csv](/docs/to-csv)
* to html
* [to json](/docs/to-json)
* to md
* to sqlite
* [to toml](/docs/to-toml)
* [to tsv](/docs/to-tsv)
* [to url](/docs/to-url)
* [to yaml](/docs/to-yaml)

*Subcommands without links are currently missing their documentation.*

## Example

```shell
> shells
━━━┯━━━┯━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━
 # │   │ name       │ path
───┼───┼────────────┼────────────────────────
 0 │ X │ filesystem │ /home/shaurya
 1 │   │ filesystem │ /home/shaurya/Pictures
 2 │   │ filesystem │ /home/shaurya/Desktop
━━━┷━━━┷━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━
> shells | to csv
 ,name,path
X,filesystem,/home/shaurya
 ,filesystem,/home/shaurya/Pictures
 ,filesystem,/home/shaurya/Desktop
```

```shell
> open sample.url
━━━━━━━━━━┯━━━━━━━━┯━━━━━━┯━━━━━━━━
 bread    │ cheese │ meat │ fat
──────────┼────────┼──────┼────────
 baguette │ comté  │ ham  │ butter
━━━━━━━━━━┷━━━━━━━━┷━━━━━━┷━━━━━━━━
> open sample.url  | to url
bread=baguette&cheese=comt%C3%A9&meat=ham&fat=butter
```
