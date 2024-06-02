---
title: Foreign Shell Scripts
---

# Working With Foreign Shell Scripts

A common issue with nu is, that other applications export environment variables
or functionality as shell scripts, that are expected to then be evaluated by
your shell.

But many applications only consider the most commonly used shells like `bash` or
`zsh`. Unfortunately, nu has entirely incompatible syntax with these shells, so
it cannot run or `source` these scripts directly.

Generally nothing stops you from running a `zsh` script by invoking `zsh` itself
(given it is installed). But unfortunately this will not allow nu to access
exported environment variables:

```nu
# This works, using zsh to print "Hello"
'echo Hello' | zsh -c $in

# This exits with an error because $env.VAR is not defined
'export VAR="Hello"' | zsh -c $in
print $env.VAR
```

This chapter presents two workarounds for getting around this issue, and the
involved drawbacks.

---

## Parsing a Script as a String

A naive workaround to extract environment variable declarations is to read the
foreign script as a string and parse anything that looks like a variable
declaration, so it can be loaded into nushell's environment.

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

This is perfectly fine for situations where you are sure of the exact format of
the script and can predict parsing edge cases.

This quickly gets tricky though, for example when the script is declaring a
`PATH` variable that references its previous value
(`export PATH="$PATH:/extra/path";`).

There are ways to implement some form of expansion too, but at some point it
might make more sense to leave the parsing to the shell it was meant for.

## Bash Env Plugin

There is a third-party Nu plugin [bash-env](https://github.com/tesujimath/nu_plugin_bash_env)
for importing environment variables from Bash format files and pipes.
This plugin uses Bash itself to parse the environment definitions,
and can therefore cope with arbitrarily complex Bash sources.

## Capturing the environment from a foreign shell script

A more complex approach is to run the script in the shell it is written for and
then do some hackery to capture the script's variables afterwards.

Note: The shown command assumes a Unix-like operating system, it may also be
possible to implement one for Windows that could capture variables from a
PowerShell script.

```nu
# Returns a record of changed env variables after running a non-nushell script's contents (passed via stdin), e.g. a bash script you want to "source"
def capture-foreign-env [
    --shell (-s): string = /bin/sh
    # The shell to run the script in
    # (has to support '-c' argument and POSIX 'env', 'echo', 'eval' commands)
    --arguments (-a): list<string> = []
    # Additional command line arguments to pass to the foreign shell
] {
    let script_contents = $in;
    let env_out = with-env { SCRIPT_TO_SOURCE: $script_contents } {
        ^$shell ...$arguments -c `
        env
        echo '<ENV_CAPTURE_EVAL_FENCE>'
        eval "$SCRIPT_TO_SOURCE"
        echo '<ENV_CAPTURE_EVAL_FENCE>'
        env -u _ -u _AST_FEATURES -u SHLVL` # Filter out known changing variables
    }
    | split row '<ENV_CAPTURE_EVAL_FENCE>'
    | {
        before: ($in | first | str trim | lines)
        after: ($in | last | str trim | lines)
    }

    # Unfortunate Assumption:
    # No changed env var contains newlines (not cleanly parseable)
    $env_out.after
    | where { |line| $line not-in $env_out.before } # Only get changed lines
    | parse "{key}={value}"
    | transpose --header-row --as-record
}
```

Usage, e.g. in `env.nu`:

```nu
# Default usage, running the script with `/bin/sh`
load-env (open script.sh | capture-foreign-env)

# Running a different shell's script
# fish might be elsewhere on your system, if it's in the PATH, `fish` is enough
load-env (open script.fish | capture-foreign-env --shell /usr/local/bin/fish)
```

The command runs a foreign shell script and captures the changed environment
variables after running the script. This is done by parsing output of the `env`
command available on unix-like systems. The shell to execute can be specified
and configured using the `--shell` and `--arguments` parameters, the command has
been tested using sh (-> bash), bash, zsh, fish, ksh, and dash.

::: warning
A caveat for this approach is that it requires all changed environment variables
not to include newline characters, as the UNIX `env` output is not cleanly
parseable in that case.

Also beware that directly passing the output of `capture-foreign-env` to
`load-env` can result in changed variables like `PATH` to become strings again,
even if they have been converted to a list before.
:::

### Detailed Explanation of `capture-foreign-env`

Let's have a look at the command's signature first:

```nu
def capture-foreign-env [
    --shell (-s): string = /bin/sh
    # The shell to run the script in
    # (has to support '-c' argument and POSIX 'env', 'echo', 'eval' commands)
    --arguments (-a): list<string> = []
    # Additional command line arguments to pass to the foreign shell
] {
    let script_contents = $in;
    # ...
}
```

We're declaring a custom command that takes two optional flags:

- `--shell` to specify a shell to run the script in, (e.g. `bash`)
- `--arguments` to parse further command line arguments to that shell.

The actual script is not mentioned here, because it is read using the special
`$in` variable that represents anything passed to Standard Input (`stdin`), e.g.
via a pipe.

The shell is set to `/bin/sh` by default, because this is often considered the
"default" POSIX-compatible shell of UNIX-like systems, e.g. macOS or Linux. It
is often not running the original Bourne shell (`sh`), but linking to a
different shell, like `bash`, with some compatibility flags turned on.

As such, many "generic" shell scripts to source are compatible with the system'
s `/bin/sh`.

Now, let's have a look at where the shell is actually run:

```nu
let env_out = with-env { SCRIPT_TO_SOURCE: $script_contents } {
    ^$shell ...$arguments -c ` ... `
}
```

Essentially, this calls the specified shell (using `^` to run the value as a
command) with any arguments specified. It also passes `-c` with an inlined
script for the shell, which is the syntax to immediately execute a passed script
and exit in most shells.

The `with-env { SCRIPT_TO_SOURCE: $script_contents }` block defines an
additional environment variable with the actual script we want to run. This is
used to pass the script in an unescaped string form, where the executing shell is entirely responsible for parsing it. The alternatives would have been:

- Passing the script via `-c $script`, but then we couldn't (safely) add our own
  commands to log out the environment variables after the script ran.
- Using string interpolation, but then we would be responsible for fully
  escaping the script, so that the `eval "($script)"` line doesn't break due to
  quotation marks. With the variable expansion in the foreign shell, that shell
  does not need the value to be escaped; just as nu is normally able to pass a
  string with any contents to a command as a single string argument.
- Using a (temporary or existing) file containing the script - This would also
  work, but seems unnecessary and potentially slower.

Then the external shell executes the script we passed:

```bash
env
echo '<ENV_CAPTURE_EVAL_FENCE>'
eval "$SCRIPT_TO_SOURCE"
echo '<ENV_CAPTURE_EVAL_FENCE>'
env -u _ -u _AST_FEATURES -u SHLVL
```

These POSIX-shell compatible commands, available in UNIX-like OSes, do the
following:

1. Log out all environment variables at the start of the script. These may be
   different than the ones in nushell, because the shell might have defined
   variables on startup and all passed-in variables have been serialized to
   strings by nushell.
2. Log `<ENV_CAPTURE_EVAL_FENCE>` to stdout, this is so we later know where the
   first `env` output stopped. The content of this is arbitrary, but it is
   verbose to reduce the risk of any env var having this string in its contents.
3. Run the actual shell script in the current context, using `eval`. The double
   quotes around the variable are necessary to get newlines to be interpreted
   correctly.
4. Log the "fence" again to stdout so we know where the "after" list of
   variables starts.
5. Log all environment variables after the script run. We are excluding a few
   variables here that are commonly changed by a few shells that have nothing to
   do with the particular script that was run.

We then take the script output and save all lines from the `env` output before
and after running the passed script, using the `<ENV_CAPTURE_EVAL_FENCE>` logs.

```nu
# <shell invocation>
| split row '<ENV_CAPTURE_EVAL_FENCE>'
| {
    before: ($in | first | str trim | lines)
    after: ($in | last | str trim | lines)
}
```

Finally, all that is left to do is to take all env-output lines from the "after"
output that were not there before, and parse them into a record:

```nu
$env_out.after
    | where { |line| $line not-in $env_out.before } # Only get changed lines
    | parse "{key}={value}"
    | transpose --header-row --as-record
```
