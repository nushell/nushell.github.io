---
title: str contains
version: 0.63.0
usage: |
  Checks if string contains pattern
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> str contains (pattern) ...rest --insensitive --not```

## Parameters

 -  `pattern`: the pattern to find
 -  `...rest`: optionally check if string contains pattern by column paths
 -  `--insensitive`: search is case insensitive
 -  `--not`: does not contain

## Examples

Check if string contains pattern
```shell
> 'my_library.rb' | str contains '.rb'
```

Check if string contains pattern case insensitive
```shell
> 'my_library.rb' | str contains -i '.RB'
```

Check if string contains pattern in a table
```shell
>  [[ColA ColB]; [test 100]] | str contains 'e' ColA
```

Check if string contains pattern in a table
```shell
>  [[ColA ColB]; [test 100]] | str contains -i 'E' ColA
```

Check if string contains pattern in a table
```shell
>  [[ColA ColB]; [test hello]] | str contains 'e' ColA ColB
```

Check if string contains pattern
```shell
> 'hello' | str contains 'banana'
```

Check if list contains pattern
```shell
> [one two three] | str contains o
```

Check if list does not contain pattern
```shell
> [one two three] | str contains -n o
```
