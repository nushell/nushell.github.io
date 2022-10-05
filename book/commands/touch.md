---
title: touch
version: 0.69.1
filesystem: |
  Creates one or more files.
usage: |
  Creates one or more files.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filesystem }}</div>

## Signature

```> touch (filename) ...rest --reference --modified --access --no-create```

## Parameters

 -  `filename`: the path of the file you want to create
 -  `...rest`: additional files to create
 -  `--reference {string}`: change the file or directory time to the time of the reference file/directory
 -  `--modified`: change the modification time of the file or directory. If no timestamp, date or reference file/directory is given, the current time is used
 -  `--access`: change the access time of the file or directory. If no timestamp, date or reference file/directory is given, the current time is used
 -  `--no-create`: do not create the file if it does not exist

## Examples

Creates "fixture.json"
```shell
> touch fixture.json
```

Creates files a, b and c
```shell
> touch a b c
```

Changes the last modified time of "fixture.json" to today's date
```shell
> touch -m fixture.json
```

Changes the last modified time of files a, b and c to a date
```shell
> touch -m -d "yesterday" a b c
```

Changes the last modified time of file d and e to "fixture.json"'s last modified time
```shell
> touch -m -r fixture.json d e
```

Changes the last accessed time of "fixture.json" to a date
```shell
> touch -a -d "August 24, 2019; 12:30:30" fixture.json
```
