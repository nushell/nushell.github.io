---
title: ssh-agent
---

# 管理 SSH 密码短语

`eval` 在 nushell 中不可用，所以运行：

```nu
^ssh-agent -c
    | lines
    | first 2
    | parse "setenv {name} {value};"
    | transpose -r
    | into record
    | load-env
```

::: warning
然而，将此添加到你的 `env.nu` 将在每次启动新终端时启动一个新的 ssh-agent 进程。
请参阅解决方法。
:::

或者，使用第三方 Nu 插件 [bash-env](https://github.com/tesujimath/nu_plugin_bash_env)，如下所示。

```nu
^ssh-agent | bash-env | load-env
```

::: warning
请注意，`bash-env` 插件不受核心 Nushell 团队支持。
所有问题和支持请求应直接发送到他们团队自己的 [问题跟踪器](https://github.com/tesujimath/nu_plugin_bash_env/issues)。
:::

## 解决方法

你可以通过检查是否已经有 ssh-agent 在你的用户上运行来解决此行为，如果没有则启动一个：

```nu
do --env {
    let ssh_agent_file = (
        $nu.temp-path | path join $"ssh-agent-($env.USER? | default $env.USERNAME).nuon"
    )

    if ($ssh_agent_file | path exists) {
        let ssh_agent_env = open ($ssh_agent_file)
        if ($"/proc/($ssh_agent_env.SSH_AGENT_PID)" | path exists) {
            load-env $ssh_agent_env
            return
        } else {
            rm $ssh_agent_file
        }
    }

    let ssh_agent_env = ^ssh-agent -c
        | lines
        | first 2
        | parse "setenv {name} {value};"
        | transpose --header-row
        | into record
    load-env $ssh_agent_env
    $ssh_agent_env | save --force $ssh_agent_file
}
```

### [Keychain](https://www.funtoo.org/Funtoo:Keychain)

```nu
keychain --eval --quiet <你的 ssh 密钥，例如 id_ed25519>
    | lines
    | where not ($it | is-empty)
    | parse "{k}={v}; export {k2};"
    | select k v
    | transpose --header-row
    | into record
    | load-env
```

## 非 nushell 解决方法

然而，通常推荐的方法涉及运行 ssh-agent，以便它为进程建立用户范围的套接字来连接。

以下是两种常见的方法来实现这一点。

### DE/WM 配置

你可以将其合并到你的桌面环境 (DE) 或合成器的配置中，使用以下命令：

```sh
ssh-agent -D -a /run/user/1000/ssh-agent.socket
# 你也可以使用相同的配置文件将此套接字路径设置为环境变量
```

如果你使用窗口管理器或合成器，这是一个不错的选择，因为你可能知道它的语法。

### 作为服务

或者，你可以将其启用为 **用户服务**。OpenSSH 通常包含一个 systemd 服务，[ArchLinux wiki systemd/User](https://wiki.archlinux.org/title/Systemd/User) 页面介绍了如何使用 systemd 为每个用户启用服务。

但是，如果你使用不同的服务管理器，请参考其自己的文档来创建使用上述命令的用户服务。

要使 Nushell 能够访问此套接字，你需要将其路径添加为 `$env.SSH_AUTH_SOCK`，如下所示：

```nu
$env.SSH_AUTH_SOCK = $"($env.XDG_RUNTIME_DIR)/ssh-agent.socket"
```
