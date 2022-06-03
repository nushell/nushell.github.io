---
title: str starts-with
version: 0.63.0
usage: |
  Check if string starts with a pattern
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> str starts-with (pattern) ...rest```

## Parameters

 -  `pattern`: the pattern to match
 -  `...rest`: optionally matches prefix of text by column paths

## Examples

Checks if string starts with 'my' pattern
```shell
> 'my_library.rb' | str starts-with 'my'
```

Checks if string starts with 'my' pattern
```shell
> 'Cargo.toml' | str starts-with 'Car'
```

Checks if string starts with 'my' pattern
```shell
> 'Cargo.toml' | str starts-with '.toml'
```
