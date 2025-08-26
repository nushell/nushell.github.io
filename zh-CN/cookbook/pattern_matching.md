---
title: 模式匹配
---

# 模式匹配

## 使用 `match` 关键字

像许多其他语言一样，nu 提供了一个 [`match`](https://www.nushell.sh/commands/docs/match.html#frontmatter-title-for-core) 关键字。通常这被用作 `if-else` 语句的一个稍微更符合人体工程学的版本，如果你有很多分支的话。

```nu
[black red yellow green purple blue indigo] | each {|c|
  match $c {
    "black" => "classy"
    "red" | "green" | "blue" => "fundamental"
    "yellow" | "purple" => "vibrant"
    _ => "innovative"
  }
}
# => ───┬────────────
# =>  0 │ classy
# =>  1 │ funamental
# =>  2 │ vibrant
# =>  3 │ funamental
# =>  4 │ vibrant
# =>  5 │ funamental
# =>  6 │ innovative
# => ───┴────────────
```

在 `if-else` 语句中等效的写法是：

```nu
[black red yellow green purple blue] | each {|c|
  if ($c == "black") {
   "classy"
  } else if ($c in ["red", "green", "blue"]) {
    "fundamental"
  } else if ($c in ['yellow', "purple"]) {
    "vibrant"
  } else {
    "innovative"
  }
}
```

如你所见，你也可以在 match 语句中使用命令表达式（在这种情况下与 `|` 一起使用）。还要注意末尾的 `_` 情况，这被称为默认分支，在其他模式都不匹配时使用。还要注意，如果情况重叠，将使用第一个匹配的模式（就像 `if-else` 语句一样）：

```nu
[yellow green] | each {|c|
  match $c {
    "green" => "fundamental"
    "yellow" | "green" => "vibrant"
  }
}
# => ───┬────────────
# =>  0 │ vibrant
# =>  1 │ funamental
# => ───┴────────────
```

## 类型上的模式匹配

你可以使用 [`describe`](https://www.nushell.sh/commands/docs/describe.html) 命令获取有关值类型的更多信息。例如：

```nu
{one: 1 two: 2} | describe
# => record<one: int, two: int>
```

```nu
[{a: 1 b: 2} {a: 2 b:3 }] | describe
# => table<a: int, b: int>
```

结合 `match` 和一些巧妙的 regex 使用，你可以进行相当强大的类型匹配。例如，假设我们想要实现一个 `str append` 函数，该函数可以同时在字符串和列表上工作。在字符串上，它应该按预期工作，在字符串列表上，它应该将相同的字符串附加到列表的每个元素。使用 `match`，可以这样做：

```nu
def "str append" [tail: string]: [string -> string, list<string> -> list<string>] {
    let input = $in
    match ($input | describe | str replace --regex '<.*' '') {
        "string" => { $input ++ $tail },
        "list" => { $input | each {|el| $el ++ $tail} },
        _ => $input
    }
}
```

`$input | describe` 将输出例如 `string`（如果输入是字符串），以及例如 `list<any>`（对于包含多个不同类型的列表）。regex 删除了第一个 `<` 之后的所有内容，只给我们留下 `list`。

然后使用 `match` 语句，我们可以分别处理不同的类型。最后在默认情况下，我们只返回未更改的输入，以便其他类型可以简单地通过此过滤器而不会出现问题。
还要注意，我们必须在函数的第一条语句中捕获 `$in` 变量，以便在每个 `match` 分支中仍然可以访问它。

使用这个实现，我们可以检查命令是否按预期工作：

```nu
use std/assert
assert equal ("foo" | str append "/") "foo/"
assert equal (["foo", "bar", "baz"] | str append "/") ["foo/", "bar/", "baz/"]
```
