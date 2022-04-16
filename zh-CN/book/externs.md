# 外部命令

调用外部命令是将 Nushell 作为一个 Shell 使用的基本部分（通常也将 Nushell 作为一种语言使用）。但是有一个问题，对于 Nushell 之外的命令而言，Nushell 不能帮助寻找调用中的错误，或者自动补全，或者语法高亮。

这就是 `extern` 的作用。`extern`关键字允许你为 Nushell 之外的命令写一个完整的签名，这样你就能得到上述所有的好处。如果你看一下默认配置，你会发现其中有一些`extern`调用。下面是其中之一：

```bash
  export extern "git push" [
    remote?: string@"nu-complete git remotes",   # the name of the remote
    refspec?: string@"nu-complete git branches"  # the branch / refspec
    --verbose(-v)                                # be more verbose
    --quiet(-q)                                  # be more quiet
    --repo: string                               # repository
    --all                                        # push all refs
    --mirror                                     # mirror all refs
    --delete(-d)                                 # delete refs
    --tags                                       # push tags (can't be used with --all or --mirror)
    --dry-run(-n)                                # dry run
    --porcelain                                  # machine-readable output
    --force(-f)                                  # force updates
    --force-with-lease: string                   # require old value of ref to be at this value
    --recurse-submodules: string                 # control recursive pushing of submodules
    --thin                                       # use thin pack
    --receive-pack: string                       # receive pack program
    --exec: string                               # receive pack program
    --set-upstream(-u)                           # set upstream for git pull/status
    --progress                                   # force progress reporting
    --prune                                      # prune locally removed refs
    --no-verify                                  # bypass pre-push hook
    --follow-tags                                # push missing but relevant tags
    --signed: string                             # GPG sign the push
    --atomic                                     # request atomic transaction on remote side
    --push-option(-o): string                    # option to transmit
    --ipv4(-4)                                   # use IPv4 addresses only
    --ipv6(-6)                                   # use IPv6 addresses only
  ]
```

你会注意到这给了你所有与内部命令相同的描述性语法，让你描述标志(flags)、短标志(short flags)、位置参数、类型等等。

## 类型和自定义补全

在上面的例子中，你会注意到有些类型后面有`@`，接着后面是命令的名称。我们有独立的章节进一步谈论[自定义补全](custom_completions.md)。

参数的类型（或形状）和自定义补全都告诉 Nushell 如何完成对该标志或位置值的补全。例如，将类型设置为`path`允许 Nushell 为你将值补全为一个文件路径。使用`@`和一个自定义的补全方式覆盖了这个默认行为，让该自定义补全方式返回给你完整的补全列表。

## 局限性

目前的`extern`语法有一些限制。在 Nushell 中，标志和位置参数是非常灵活的：标志可以在位置参数之前, 也可以与位置参数混合, 还可以跟随位置参数。许多外部命令没有这种灵活性。目前还没有一种方法来确保标志和位置参数的特定顺序与外部命令所要求的风格保持一致。

第二个限制是，有些外部命令要求使用`=`来传递标志和值。在 Nushell 中，`=`是一种方便的可选默认参数语法，目前还没有办法按要求使用它。
