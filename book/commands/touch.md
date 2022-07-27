---
title: touch
version: 0.66.1
usage: |
  Creates one or more files.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> touch (filename) ...rest --timestamp --date --reference --modified --access --no-create```

## Parameters

 -  `filename`: the path of the file you want to create
 -  `...rest`: additional files to create
 -  `--timestamp {string}`: change the file or directory time to a timestamp. Format: [[CC]YY]MMDDhhmm[.ss]

      If neither YY or CC is given, the current year will be assumed. If YY is specified, but CC is not, CC will be derived as follows:
      	If YY is between [69, 99], CC is 19
      	If YY is between [00, 68], CC is 20
      Note: It is expected that in a future version of this standard the default century inferred from a 2-digit year will change
 -  `--date {string}`: change the file or directory time to a date
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

Creates files d and e and set its last modified time to a timestamp
```shell
> touch -m -t 201908241230.30 d e
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

Changes both last modified and accessed time of a, b and c to a timestamp only if they exist
```shell
> touch -c -t 201908241230.30 a b c
```
