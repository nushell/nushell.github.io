---
title: 自定义补全器
---

# 自定义补全器

## Zoxide 路径补全

[Zoxide](https://github.com/ajeetdsouza/zoxide) 允许在系统中轻松跳转到访问过的文件夹。可以使用此补全器自动补全匹配的文件夹：

```nu
def "nu-complete zoxide path" [context: string] {
    let parts = $context | split row " " | skip 1
    {
      options: {
        sort: false,
        completion_algorithm: substring,
        case_sensitive: false,
      },
      completions: (^zoxide query --list --exclude $env.PWD -- ...$parts | lines),
    }
  }

def --env --wrapped z [...rest: string@"nu-complete zoxide path"] {
  __zoxide_z ...$rest
}
```

请注意，上述补全器可能不适用于多个关键字，因为每个补全建议都是一个完整路径。类似 `z nu <TAB>` 可能会提供 `/home/user/nushell` 作为建议，如果你选择此建议，你的命令行将被替换为 `z nu /home/user/nushell` 而不是 `z /home/user/nushell`。运行 `z nu /home/user/nushell` 现在会失败。

下面是一个更复杂的补全器，它提供看起来奇怪的建议，但确实适用于多个关键字。

```nu
def "nu-complete zoxide path" [context: string] {
    let parts = $context | str trim --left | split row " " | skip 1 | each { str downcase }
    let completions = (
        ^zoxide query --list --exclude $env.PWD -- ...$parts
            | lines
            | each { |dir|
                if ($parts | length) <= 1 {
                    $dir
                } else {
                    let dir_lower = $dir | str downcase
                    let rem_start = $parts | drop 1 | reduce --fold 0 { |part, rem_start|
                        ($dir_lower | str index-of --range $rem_start.. $part) + ($part | str length)
                    }
                    {
                        value: ($dir | str substring $rem_start..),
                        description: $dir
                    }
                }
            })
    {
        options: {
            sort: false,
            completion_algorithm: substring,
            case_sensitive: false,
        },
        completions: $completions,
    }
}
```
