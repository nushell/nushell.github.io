---
title: 处理文件
---

# 处理文件

### 编辑文件并保存更改

这里我们正在编辑 `Cargo.toml`。我们使用 `inc` 增加 crate 的补丁版本，然后将其保存回文件。
使用 `help inc` 获取更多信息。

读取文件的初始内容

```nu
open Cargo.toml | get package.version
```

输出

`0.59.0`

对版本号进行编辑并保存。

_注意：运行此命令应该可以工作，但它会按部分按字母顺序重新排序 toml 文件。_

```nu
open Cargo.toml | upsert package.version { |p| $p | get package.version | inc --patch } | save -f Cargo.toml
```

注意：`inc` 可通过插件 `nu_plugin_inc` 使用。

输出
_无_

查看我们对文件所做的更改。

```nu
open Cargo.toml | get package.version
```

输出

`0.59.1`

---

### 解析非标准格式的文件

假设您有一个以下格式的文件。

```text
band:album:year
Fugazi:Steady Diet of Nothing:1991
Fugazi:The Argument:2001
Fugazi:7 Songs:1988
Fugazi:Repeater:1990
Fugazi:In On The Kill Taker:1993
```

您可以将其解析为表格。

```nu
open bands.txt | lines | split column ":" Band Album Year | skip 1 | sort-by Year
# => ━━━┯━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━
# =>  # │ Band   │ Album                  │ Year
# => ───┼────────┼────────────────────────┼──────
# =>  0 │ Fugazi │ 7 Songs                │ 1988
# =>  1 │ Fugazi │ Repeater               │ 1990
# =>  2 │ Fugazi │ Steady Diet of Nothing │ 1991
# =>  3 │ Fugazi │ In On The Kill Taker   │ 1993
# =>  4 │ Fugazi │ The Argument           │ 2001
# => ━━━┷━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━
```

您也可以使用 `parse` 来实现这一点。

```nu
open bands.txt | lines | parse "{Band}:{Album}:{Year}" | skip 1 | sort-by Year
```

或者，您可以使用 `headers` 命令将第一行用作标题行。唯一的区别是标题将与文本文件的大小写匹配。因此，在这种情况下，标题将为小写。

```nu
open bands.txt | lines | split column ":" | headers | sort-by year
```

---

### 使用 Ripgrep 进行单词出现次数统计

假设您想要检查字符串 "Value" 在 nushell 项目中每个文件出现的行数，然后按行数最多的文件排序。

```nu
rg -c Value | lines | split column ":" file line_count | into int line_count | sort-by line_count | reverse
# => ───┬──────────────────────────────────────┬────────────
# =>  # │ file                                 │ line_count
# => ───┼──────────────────────────────────────┼────────────
# =>  0 │ crates/nu-source/src/meta.rs         │         27
# =>  1 │ crates/nu-protocol/src/value/dict.rs │         10
# =>  2 │ src/commands/config.rs               │         10
# =>  3 │ crates/nu_plugin_sys/src/sys.rs      │         10
# =>  4 │ src/commands/from_bson.rs            │          9
# =>  5 │ src/utils/data_processing.rs         │          9
# =>  6 │ src/deserializer.rs                  │          8
# =>  7 │ src/commands/histogram.rs            │          7
# =>  8 │ src/commands/split_column.rs         │          6
# =>  9 │ src/data/dict.rs                     │          6
# => ───┴──────────────────────────────────────┴────────────
# => ... 示例输出因输出过大而受限
```
