---
title: dfr to-avro
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Saves dataframe to avro file.
usage: |
  Saves dataframe to avro file.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr to-avro (file) --compression```

## Parameters

 -  `file`: file path to save dataframe
 -  `--compression {string}`: use compression, supports deflate or snappy


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Saves dataframe to avro file
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr to-avro test.avro

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag