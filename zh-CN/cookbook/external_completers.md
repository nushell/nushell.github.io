---
title: 外部命令补全器
---

# 外部命令补全器

## 补全器

### Carapace 补全器

```nu
let carapace_completer = {|spans|
    carapace $spans.0 nushell ...$spans | from json
}
```

### Fish 补全器

此补全器将使用 [fish shell](https://fishshell.com/) 来处理补全。Fish 为许多流行工具和命令提供了开箱即用的补全功能。

```nu
let fish_completer = {|spans|
    fish --command $"complete '--do-complete=($spans | str replace --all "'" "\\'" | str join ' ')'"
    | from tsv --flexible --noheaders --no-infer
    | rename value description
    | update value {|row|
      let value = $row.value
      let need_quote = ['\' ',' '[' ']' '(' ')' ' ' '\t' "'" '"' "`"] | any {$in in $value}
      if ($need_quote and ($value | path exists)) {
        let expanded_path = if ($value starts-with ~) {$value | path expand --no-symlink} else {$value}
        $'"($expanded_path | str replace --all "\"" "\\\"")"'
      } else {$value}
    }
}
```

关于此命令的几点说明：

- Fish 补全器将返回文本行，每行包含用制表符分隔的 `value` 和 `description`。`description` 可能缺失，在这种情况下，`value` 后面不会有制表符。如果发生这种情况，`from tsv` 会失败，因此我们添加 `--flexible` 标志。
- Fish 补全器的输出不包含标题（列名），因此我们添加 `--noheaders` 以防止 `from tsv` 将第一行视为标题，然后使用 `rename` 为列命名。
- `--no-infer` 是可选的。`from tsv` 将推断结果的数据类型，因此像某些 git 哈希这样的数值将被推断为数字。`--no-infer` 将保持所有内容为字符串。在实践中没有区别，但如果单独运行补全器，它将打印更一致的输出。
- 由于 fish 仅支持 POSIX 样式的文件路径转义（`file\ name.txt` 等），由 fish 完成的文件路径在外部命令上不会被正确引用或转义。Nushell 不解析 POSIX 转义，因此我们需要手动进行此转换，例如通过测试项目是否为有效路径，如示例所示。为了最小化路径查找的开销，我们首先检查字符串中常见的转义字符。如果字符串需要转义，并且它是文件系统上的路径，则该值用双引号括起来。在双引号文件路径之前，我们扩展路径开头的任何 ~，以便补全继续工作。这种简单的方法并不完美，但它应该覆盖 99.9% 的使用情况。

### 多重补全器

有时，单个外部补全器不够灵活。幸运的是，可以根据需要将多个补全器组合成一个。以下示例对所有命令使用 `$default_completer`，除了在记录中明确定义的命令：

```nu
let multiple_completers = {|spans|
    match $spans.0 {
        ls => $ls_completer
        git => $git_completer
        _ => $default_completer
    } | do $in $spans
}
```

> **注意**
> 在上面的示例中，`$spans.0` 是当时运行的命令。补全器将匹配所需的补全器，并回退到 `$default_completer`。
>
> - 如果我们尝试自动补全 `git <tab>`，`spans` 将是 `[git ""]`。`match $spans.0 { ... }` 将返回 `$git_completer`。
> - 如果我们尝试自动补全 `other_command <tab>`，`spans` 将是 `[other_command ""]`。匹配将回退到默认情况（`_`）并返回 `$default_completer`。

## 故障排除

### 别名补全

Nushell 目前有一个 [bug，自动补全不适用于别名](https://github.com/nushell/nushell/issues/8483)。可以通过在补全器开头添加以下代码片段来解决此问题：

```nu
# 如果当前命令是别名，获取其扩展
let expanded_alias = (scope aliases | where name == $spans.0 | get -i 0 | get -i expansion)

# 覆盖
let spans = (if $expanded_alias != null  {
    # 将扩展别名的第一个单词放在 span 的开头
    $spans | skip 1 | prepend ($expanded_alias | split row " " | take 1)
} else { $spans })
```

此代码将获取第一个 span，找到匹配的第一个别名，并用别名扩展替换命令的开头。

### 使用 carapace 时出现 `ERR unknown shorthand flag`

当提供不支持的标志时，Carapace 将返回此错误。例如，使用 `cargo -1`：

| value | description                       |
| ----- | --------------------------------- |
| -1ERR | unknown shorthand flag: "1" in -1 |
| -1\_  |                                   |

解决此问题涉及手动检查值以过滤掉它：

```nu
let carapace_completer = {|spans: list<string>|
    carapace $spans.0 nushell ...$spans
    | from json
    | if ($in | default [] | where value == $"($spans | last)ERR" | is-empty) { $in } else { null }
}
```

## 整合所有内容

这是一个外部补全器定义可能看起来的示例：

```nu
let fish_completer = ...

let carapace_completer = {|spans: list<string>|
    carapace $spans.0 nushell ...$spans
    | from json
    | if ($in | default [] | where value =~ '^-.*ERR$' | is-empty) { $in } else { null }
}

# 此补全器默认使用 carapace
let external_completer = {|spans|
    let expanded_alias = scope aliases
    | where name == $spans.0
    | get -o 0.expansion

    let spans = if $expanded_alias != null {
        $spans
        | skip 1
        | prepend ($expanded_alias | split row ' ' | take 1)
    } else {
        $spans
    }

    match $spans.0 {
        # carapace 补全对于 nu 不正确
        nu => $fish_completer
        # fish 以更好的方式补全提交和分支名称
        git => $fish_completer
        # carapace 没有 asdf 的补全
        asdf => $fish_completer
        _ => $carapace_completer
    } | do $in $spans
}

$env.config = {
    # ...
    completions: {
        external: {
            enable: true
            completer: $external_completer
        }
    }
    # ...
}
```
