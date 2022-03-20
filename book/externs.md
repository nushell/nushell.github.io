# Externs

Calling external commands is a fundamental part of using Nushell as a shell (and often using Nushell as a language). There's a problem, though, commands outside of Nushell means that Nushell can't help with finding errors in the call, or completions, or syntax highlighting.

This is where `extern` comes in. The `extern` keyword allows you to write a full signature for the command that lives outside of Nushell so that you get all the benefits above. If you take a look at the default config, you'll notice that there are a few extern calls in there. Here's one of them:

```
  export extern "git push" [
    remote?: string@"nu-complete git remotes", # the name of the remote
    refspec?: string@"nu-complete git branches"# the branch / refspec
    --verbose(-v)                              # be more verbose
    --quiet(-q)                                # be more quiet
    --repo: string                             # repository
    --all                                      # push all refs
    --mirror                                   # mirror all refs
    --delete(-d)                               # delete refs
    --tags                                     # push tags (can't be used with --all or --mirror)
    --dry-run(-n)                              # dry run
    --porcelain                                # machine-readable output
    --force(-f)                                # force updates
    --force-with-lease: string                 # require old value of ref to be at this value
    --recurse-submodules: string               # control recursive pushing of submodules
    --thin                                     # use thin pack
    --receive-pack: string                     # receive pack program
    --exec: string                             # receive pack program
    --set-upstream(-u)                         # set upstream for git pull/status
    --progress                                 # force progress reporting
    --prune                                    # prune locally removed refs
    --no-verify                                # bypass pre-push hook
    --follow-tags                              # push missing but relevant tags
    --signed: string                           # GPG sign the push
    --atomic                                   # request atomic transaction on remote side
    --push-option(-o): string                  # option to transmit
    --ipv4(-4)                                 # use IPv4 addresses only
    --ipv6(-6)                                 # use IPv6 addresses only
  ]
```

You'll notice this gives you all the same descriptive syntax that internal commands do, letting you describe flags, short flags, positional parameters, types, and more.

## Types and custom completions

In the above example, you'll notice some types are followed by `@` followed by the name of a command. We talk more about [custom completions](custom_completions.md) in their own section.

Both the type (or shape) of the argument and the custom completion tell Nushell about how to complete values for that flag or position. For example, setting a shape to `path` allows Nushell to complete the value to a filepath for you. Using the `@` with a custom completion overrides this default behavior, letting the custom completion give you full completion list.

## Limitations

There are a few limitations to the current `extern` syntax. In Nushell, flags and positional arguments are very flexible: flags can precede positional arguments, flags can be mixed into positional arguments, and flags can follow positional arguments. Many external commands are not this flexible. There is not yet a way to require a particular ordering of flags and positional arguments to the style required by the external.

The second limitation is that some externals require flags to be passed using `=` to separate the flag and the value. In Nushell, the `=` is a convenient optional syntax and there's currently no way to required its use.
