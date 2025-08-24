---
title: Direnv
---

# Direnv

许多人使用 [direnv](https://direnv.net) 在进入目录时加载环境，并在退出目录时卸载环境。
配置 direnv 与 nushell 配合工作需要 nushell 版本 0.66 或更高版本。

---

### 配置 direnv

为了使 direnv 与 nushell 的工作方式与其他 shell 相同，我们可以使用 "hooks" 功能：

```nu
$env.config = {
  hooks: {
    pre_prompt: [{ ||
      if (which direnv | is-empty) {
        return
      }

      direnv export json | from json | default {} | load-env
      if 'ENV_CONVERSIONS' in $env and 'PATH' in $env.ENV_CONVERSIONS {
        $env.PATH = do $env.ENV_CONVERSIONS.PATH.from_string $env.PATH
      }
    }]
  }
}
```

::: tip 注意
您可以关注 Nushell 的 [`nu_scripts`](https://github.com/nushell/nu_scripts/blob/main/nu-hooks/nu-hooks/direnv/config.nu)
获取上述钩子的最新版本
:::

配置完成后，direnv 现在应该可以与 nushell 配合工作了。
