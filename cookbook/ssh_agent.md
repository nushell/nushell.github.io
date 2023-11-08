---
title: ssh-agent
---

# Manage SSH passphrases

`eval` is not available in nushell, so run:

```nushell
^ssh-agent -c
    | lines
    | first 2
    | parse "setenv {name} {value};"
    | transpose -r
    | into record
    | load-env
```

::: warning
Adding this to your `env.nu` will however start a new ssh-agent process every time you start a new terminal.
See the workarounds.
:::

## Workarounds

You can work around this behavior by checking if a ssh-agent is already running on your user, and start one if none is:

```nushell
# exemple for env.nu
let sshAgentFilePath = $"/tmp/ssh-agent-($env.USER).nuon"

if ($sshAgentFilePath | path exists) and ($"/proc/((open $sshAgentFilePath).SSH_AGENT_PID)" | path exists) {
    # loading it
    load-env (open $sshAgentFilePath)
} else {
    # creating it
    ^ssh-agent -c
        | lines
        | first 2
        | parse "setenv {name} {value};"
        | transpose -r
        | into record
        | save --force $sshAgentFilePath
    load-env (open $sshAgentFilePath)
}
```

## Non-nushell workarounds

However, the commonly recommended approach involves running an ssh-agent so it establishes an user-wide socket for processes to connect to.

Here are two common ways to achieve this.

### DE/WM config

You can incorporate it into your Desktop Environment (DE) or Compositor's configuration using the following command:

```sh
ssh-agent -D -a /run/user/1000/ssh-agent.socket
# You can also set this socket path as an environment variable using the same config file
```

This a good option for you if you're using a Windows Manager or a Compositor since you're likely to know its syntax.

### As a service

Alternatively, you can enable it as an **user service**. OpenSSH typically includes a systemd service and the [ArchLinux wiki systemd/User](https://wiki.archlinux.org/title/Systemd/User) page covers how to enable services per user with systemd.

However, if you're using a different service manager, please refer its own documentation to create a user service that utilizes the aforementioned command.

To enable Nushell to access this socket, you need to add its path as `$env.SSH_AUTH_SOCK` like so:

```nushell
$env.SSH_AUTH_SOCK = $"($env.XDG_RUNTIME_DIR)/ssh-agent.socket"
```
