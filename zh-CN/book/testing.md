# 测试你的 Nushell 代码

## 断言命令

Nushell 在标准库中提供了一组“断言”命令。
你可以使用 `==`、`<=` 等内置的相等或大小比较运算符，或更复杂的命令来检查条件，并在预期条件不满足时手动抛出错误；不过，使用标准库提供的断言命令通常更方便！

下文假设 `std/assert` 模块已在当前作用域中导入：

```nu
use std/assert
```

所有断言都以 `assert` 命令为基础。如果条件不为真，它就会报错。

```nu
assert (1 == 2)
# => Error: nu::shell::error
# =>
# =>   × Assertion failed.
# =>    ╭─[repl_entry #13:1:9]
# =>  1 │ assert (1 == 2)
# =>    ·         ───┬──
# =>    ·            ╰── It is not true.
# =>    ╰────
```

可以选择设置一条消息来显示断言命令的意图、出了什么问题或预期是什么：

```nu
let a = 0
assert ($a == 19) $"The lockout code is wrong, received: ($a)"
# => Error: nu::shell::error
# =>
# =>   × The lockout code is wrong, received: 0
# =>    ╭─[repl_entry #25:2:9]
# =>  1 │ let a = 0
# =>  2 │ assert ($a == 19) $"The lockout code is wrong, received: ($a)"
# =>    ·         ────┬───
# =>    ·             ╰── It is not true.
# =>    ╰────
```

有许多断言命令，它们的行为与基本命令完全相同，只是使用了适当的运算符。它们的附加价值是能够提供更好的错误消息。

例如，如果没有附加消息，这不是很有帮助：

```nu
let a = "foo"
let b = "bar"
assert ($b | str contains $a)
# => Error: nu::shell::error
# =>
# =>   × Assertion failed.
# =>    ╭─[repl_entry #5:3:14]
# =>  2 │ let b = "bar"
# =>  3 │ assert ($b | str contains $a)
# =>    ·              ──────┬─────
# =>    ·                    ╰── It is not true.
# =>    ╰────
```

而使用 `assert str contains`：

```nu
let a = "a needle"
let b = "haystack"
assert str contains $b $a
# => Error: nu::shell::error
# =>
# =>   × `$left` does not have the correct length
# =>    ╭─[repl_entry #7:3:21]
# =>  2 │ let b = "haystack"
# =>  3 │ assert str contains $b $a
# =>    ·                     ─┬ ─┬
# =>    ·                      │  ╰── expected: a needle
# =>    ·                      ╰── value: "haystack"
# =>    ╰────
```

一般来说，对于基本的 `assert` 命令，建议始终提供附加消息来显示出了什么问题。如果你不能使用任何内置的断言命令，你可以通过为 [`error make`](/commands/docs/error_make.md) 传递标签来为 `assert` 命令创建一个自定义的：

```nu
def "assert even" [number: int] {
    assert ($number mod 2 == 0) --error-label {
        text: $"($number) is not an even number",
        span: (metadata $number).span,
    }
}
```

然后你就有了详细的自定义错误消息：

```nu
let $a = 13
assert even $a
# => Error: nu::shell::error
# =>
# =>   × Assertion failed.
# =>    ╭─[repl_entry #37:2:13]
# =>  1 │ let $a = 13
# =>  2 │ assert even $a
# =>    ·             ─┬
# =>    ·              ╰── 13 is not an even number
# =>    ╰────
```

## 运行测试

现在我们已经能够通过调用 `std/assert` 中的命令来编写测试，接下来就可以运行它们：有问题时测试失败，一切正确时测试通过 :)

### Nupm 包

在第一种情况下，我们将假设你要测试的代码是 [Nupm] 包的一部分。

在这种情况下，只需按照以下步骤操作：

- 在包的 `nupm.nuon` 包文件旁边创建一个 `tests/` 目录
- 通过向其中添加 `mod.nu` 文件使 `tests/` 目录成为有效模块
- 在 `tests/` 中编写命令
- 调用 `nupm test`

约定是，从 `tests` 模块完全导出的任何命令都将作为测试运行，例如：

- `tests/mod.nu` 中的 `export def some-test` 将运行
- `tests/mod.nu` 中的 `def just-an-internal-cmd` 将不会运行
- 当且仅当 `tests/mod.nu` 中有类似 `export use spam.nu *` 的内容时，`tests/spam.nu` 中的 `export def another-test` 才会运行

### 独立测试

如果你的 Nushell 脚本或模块不是 [Nupm] 包的一部分，最简单的方法是在独立脚本中编写测试，然后从 `Makefile` 或 CI 中调用它们：

假设我们有一个简单的 `math.nu` 模块，其中包含一个简单的斐波那契命令：

```nu
# `fib n` 是第 n 个斐波那契数
export def fib [n: int]: nothing -> int {
    if $n == 0 {
        return 0
    } else if $n == 1 {
        return 1
    }

    (fib ($n - 1)) + (fib ($n - 2))
}
```

然后一个名为 `tests.nu` 的测试脚本可能如下所示

```nu
use math.nu fib
use std/assert

for t in [
    [input, expected];
    [0, 0],
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 5],
    [6, 8],
    [7, 13],
] {
    assert equal (fib $t.input) $t.expected
}
```

并通过 `nu tests.nu` 调用

### 基本测试框架

也可以将测试定义为具有描述性名称的函数，并在不需要 [Nupm] 包的情况下动态发现它们。以下使用 `scope commands` 和第二个 Nushell 实例来运行生成的测试列表。

```nu
use std/assert

source fib.nu

def main [] {
    print "Running tests..."

    let test_commands = (
        scope commands
            | where ($it.type == "custom")
                and ($it.name | str starts-with "test ")
                and not ($it.description | str starts-with "ignore")
            | get name
            | each { |test| [$"print 'Running test: ($test)'", $test] } | flatten
            | str join "; "
    )

    nu --commands $"source ($env.CURRENT_FILE); ($test_commands)"
    print "Tests completed successfully"
}

def "test fib" [] {
    for t in [
        [input, expected];
        [0, 0],
        [1, 1],
        [2, 1],
        [3, 2],
        [4, 3],
        [5, 5],
        [6, 8],
        [7, 13]
    ] {
        assert equal (fib $t.input) $t.expected
    }
}

# ignore
def "test show-ignored-test" [] {
    print "This test will not be executed"
}
```

这是一个简单的示例，但可以扩展出测试框架中常见的许多功能，包括测试前的初始化、测试后的清理，以及跨文件发现测试。

[Nupm]: https://github.com/nushell/nupm
