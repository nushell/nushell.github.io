---
title: ls
version: 0.63.0
usage: |
  List the files in a directory.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> ls (pattern) --all --long --short-names --full-paths --du```

## Parameters

 -  `pattern`: the glob pattern to use
 -  `--all`: Show hidden files
 -  `--long`: List all available columns for each entry
 -  `--short-names`: Only print the file names and not the path
 -  `--full-paths`: display paths as absolute paths
 -  `--du`: Display the apparent directory size in place of the directory metadata size

## Examples

List all files in the current directory
```shell
> ls
```

List all files in a subdirectory
```shell
> ls subdir
```

List all files with full path in the parent directory
```shell
> ls -f ..
```

List all rust files
```shell
> ls *.rs
```

List all files and directories whose name do not contain 'bar'
```shell
> ls -s | where name !~ bar
```

List all dirs in your home directory
```shell
> ls ~ | where type == dir
```

List all dirs in your home directory which have not been modified in 7 days
```shell
> ls -s ~ | where type == dir && modified < ((date now) - 7day)
```
