---
title: query web
categories: |
  network
version: 0.81.0
network: |
  execute selector query on html/web
usage: |
  execute selector query on html/web
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> query web --query --as-html --attribute --as-table --inspect```

## Parameters

 -  `--query {string}`: selector query
 -  `--as-html` `(-m)`: return the query output as html
 -  `--attribute {string}`: downselect based on the given attribute
 -  `--as-table {table}`: find table based on column header list
 -  `--inspect` `(-i)`: run in inspect mode to provide more information for determining column headers

## Examples

Retrieve all `<header>` elements from phoronix.com website
```shell
> http get https://phoronix.com | query web -q 'header'

```

Retrieve a html table from Wikipedia and parse it into a nushell table using table headers as guides
```shell
> http get https://en.wikipedia.org/wiki/List_of_cities_in_India_by_population
    | query web -t [Rank City 'Population(2011)[3]' 'Population(2001)' 'State or union territory']

```

Pass multiple css selectors to extract several elements within single query, group the query results together and rotate them to create a table
```shell
> http get https://www.nushell.sh | query web -q 'h2, h2 + p' | group 2 | each {rotate --ccw tagline description} | flatten

```

Retrieve a specific html attribute instead of the default text
```shell
> http get https://example.org | query web --query a --attribute href

```
