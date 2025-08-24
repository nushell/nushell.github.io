---
title: 外部 Shell 脚本
---

# 使用外部 Shell 脚本

nu 的一个常见问题是，其他应用程序将环境变量或功能导出为 shell 脚本，这些脚本期望由你的 shell 运行。

但许多应用程序只考虑最常用的 shell，如 `bash` 或 `zsh`。不幸的是，nu 与这些 shell 的语法完全不兼容，因此无法直接运行或 `source` 这些脚本。

通常，通过调用 `zsh` 本身（如果已安装）来运行 `zsh` 脚本没有任何障碍。但不幸的是，这将不允许 nu 访问导出的环境变量：

```nu
# 这可以工作，使用 zsh 打印 "Hello"
'echo Hello' | zsh -c $in

# 这会退出并报错，因为 $env.VAR 未定义
'export VAR="Hello"' | zsh -c $in
print $env.VAR
```

本章介绍了两种解决此问题的方法，以及涉及的缺点。

---

## 将脚本作为字符串解析

提取环境变量声明的一个简单解决方法是读取外部脚本作为字符串，并解析任何看起来像变量声明的内容，以便可以加载到 nushell 的环境中。

```nu
let bash_greeting = '
export GREETING="Hello";
export FROM="from bash";
'

load-env (
  $bash_greeting
  | str trim
  | lines
  | parse 'export {name}="{value}";'
  | transpose --header-row --as-record
)

print $"($env.GREETING) ($env.FROM)" # "Hello from bash"
```

对于你确定脚本的确切格式并且可以预测解析边缘情况的情况，这完全可以。

但这很快就会变得棘手，例如当脚本声明一个引用其先前值的 `PATH` 变量时（`export PATH="$PATH:/extra/path";`）。

也有方法实现某种形式的扩展，但在某些时候，将其解析留给它原本为之设计的 shell 可能更有意义。

## Bash Env 插件

有一个第三方 Nu 插件 [bash-env](https://github.com/tesujimath/nu_plugin_bash_env)，用于从 Bash 格式的文件和管道导入环境变量。
该插件使用 Bash 本身来解析环境定义，因此可以处理任意复杂的 Bash 源。

::: warning
请注意，`bash-env` 插件不受核心 Nushell 团队支持。
所有问题和支持请求应直接发送到其自己的 [问题跟踪器](https://github.com/tesujimath/nu_plugin_bash_env/issues)。
:::

## 从外部 shell 脚本捕获环境

更复杂的方法是在为其编写的 shell 中运行脚本，然后进行一些黑客操作来捕获脚本的变量。

注意：所示的命令假设类 Unix 操作系统，也可能为 Windows 实现一个可以从 PowerShell 脚本捕获变量的版本。

```nu
# 返回运行非 nushell 脚本内容（通过 stdin 传递）后更改的环境变量记录，例如你想要 "source" 的 bash 脚本
def capture-foreign-env [
    --shell (-s): string = /bin/sh
    # 运行脚本的 shell
    #（必须支持 '-c' 参数和 POSIX 'env'、'echo'、'eval' 命令）
    --arguments (-a): list<string> = []
    # 传递给外部 shell 的额外命令行参数
] {
    let script_contents = $in;
    let env_out = with-env { SCRIPT_TO_SOURCE: $script_contents } {
        ^$shell ...$arguments -c `
        env
        echo '<ENV_CAPTURE_EVAL_FENCE>'
        eval "$SCRIPT_TO_SOURCE"
        echo '<ENV_CAPTURE_EVAL_FENCE>'
        env -0 -u _ -u _AST_FEATURES -u SHLVL` # 过滤掉已知的更改变量
    }
    | split row '<ENV_CAPTURE_EVAL_FENCE>'
    | {
        before: ($in | first | str trim | lines)
        after: ($in | last | str trim | split row (char --integer 0))
    }

    # 不幸的假设：
    # 没有更改的环境变量包含换行符（无法干净解析）
    $env_out.after
    | where { |line| $line not-in $env_out.before } # 只获取更改的行
    | parse "{key}={value}"
    | transpose --header-row --as-record
    | if $in == [] { {} } else { $in }
}
```

用法，例如在 `env.nu` 中：

```nu
# 默认用法，使用 `/bin/sh` 运行脚本
load-env (open script.sh | capture-foreign-env)

# 运行不同 shell 的脚本
# fish 可能在你系统的其他地方，如果在 PATH 中，`fish` 就足够了
load-env (open script.fish | capture-foreign-env --shell /usr/local/bin/fish)
```

该命令运行外部 shell 脚本并捕获运行脚本后更改的环境变量。这是通过解析类 Unix 系统上可用的 `env` 命令的输出完成的。要执行的 shell 可以使用 `--shell` 和 `--arguments` 参数指定和配置，该命令已使用 sh（-> bash）、bash、zsh、fish、ksh 和 dash 进行测试。

::: warning
这种方法的一个注意事项是要求所有更改的环境变量不包含换行符，因为 UNIX `env` 输出在这种情况下无法干净解析。

还要注意，直接将 `capture-foreign-env` 的输出传递给 `load-env` 可能导致更改的变量（如 `PATH`）再次变为字符串，即使它们之前已被转换为列表。
:::

### `capture-foreign-env` 的详细说明

首先让我们看一下命令的签名：

```nu
def capture-foreign-env [
    --shell (-s): string = /bin/sh
    # 运行脚本的 shell
    #（必须支持 '-c' 参数和 POSIX 'env'、'echo'、'eval' 命令）
    --arguments (-a): list<string> = []
    # 传递给外部 shell 的额外命令行参数
] {
    let script_contents = $in;
    # ...
}
```

我们声明一个自定义命令，它接受两个可选标志：

- `--shell` 指定运行脚本的 shell，（例如 `bash`）
- `--arguments` 解析传递给该 shell 的进一步命令行参数。

实际的脚本没有在这里提到，因为它是使用特殊的 `$in` 变量读取的，该变量表示传递给标准输入（`stdin`）的任何内容，例如通过管道。

shell 默认为 `/bin/sh`，因为这通常被认为是类 UNIX 系统（例如 macOS 或 Linux）的"默认" POSIX 兼容 shell。它通常不运行原始的 Bourne shell（`sh`），而是链接到不同的 shell，如 `bash`，并打开一些兼容性标志。

因此，许多要源的"通用" shell 脚本与系统的 `/bin/sh` 兼容。

现在，让我们看看 shell 实际运行的地方：

```nu
let env_out = with-env { SCRIPT_TO_SOURCE: $script_contents } {
    ^$shell ...$arguments -c ` ... `
}
```

本质上，这调用指定的 shell（使用 `^` 将值作为命令运行）和任何指定的参数。它还传递 `-c` 和一个内联脚本给 shell，这是在大多数 shell 中立即执行传递的脚本并退出的语法。

`with-env { SCRIPT_TO_SOURCE: $script_contents }` 块定义了一个额外的环境变量，其中包含我们想要运行的实际脚本。这用于以未转义的字符串形式传递脚本，其中执行 shell 完全负责解析它。替代方案将是：

- 通过 `-c $script` 传递脚本，但这样我们就无法（安全地）添加我们自己的命令来在脚本运行后记录环境变量。
- 使用字符串插值，但这样我们将负责完全转义脚本，以便 `eval "($script)"` 行不会因为引号而中断。通过外部 shell 中的变量扩展，该 shell 不需要转义值；就像 nu 通常能够将具有任何内容的字符串作为单个字符串参数传递给命令一样。
- 使用包含脚本的（临时或现有）文件 - 这也可以工作，但似乎不必要且可能更慢。

然后外部 shell 执行我们传递的脚本：

```bash
env
echo '<ENV_CAPTURE_EVAL_FENCE>'
eval "$SCRIPT_TO_SOURCE"
echo '<ENV_CAPTURE_EVAL_FENCE>'
env -u _ -u _AST_FEATURES -u SHLVL
```

这些 POSIX-shell 兼容的命令，在类 UNIX 操作系统中可用，执行以下操作：

1. 在脚本开始时记录所有环境变量。这些可能与 nushell 中的不同，因为 shell 可能在启动时定义了变量，并且所有传入的变量都已由 nushell 序列化为字符串。
2. 将 `<ENV_CAPTURE_EVAL_FENCE>` 记录到 stdout，这样我们以后就知道第一个 `env` 输出停止的位置。此内容任意，但它是冗长的，以减少任何环境变量包含此字符串内容的风险。
3. 使用 `eval` 在当前上下文中运行实际的 shell 脚本。变量周围的双引号对于正确解释换行符是必要的。
4. 再次记录"fence"到 stdout，这样我们知道"after"变量列表开始的位置。
5. 在脚本运行后记录所有环境变量。我们在这里排除了一些变量，这些变量通常由一些与运行的特定脚本无关的 shell 更改。

然后我们获取脚本输出，并使用 `<ENV_CAPTURE_EVAL_FENCE>` 日志保存运行传递的脚本之前和之后的所有 `env` 输出行。

```nu
# <shell invocation>
| split row '<ENV_CAPTURE_EVAL_FENCE>'
| {
    before: ($in | first | str trim | lines)
    after: ($in | last | str trim | lines)
}
```

最后，剩下要做的就是获取"after"输出中之前不存在的所有 env-output 行，并将它们解析为记录：

```nu
$env_out.after
    | where { |line| $line not-in $env_out.before } # 只获取更改的行
    | parse "{key}={value}"
    | transpose --header-row --as-record
```
