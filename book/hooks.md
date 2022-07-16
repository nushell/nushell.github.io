# Hooks

Hooks allow you to run a piece of Nushell code at some predefined situations.
Hooks are only available in the interactive mode, they do not work if you run a Nushell on a script (`nu script.nu`) or commands (`nu -c "echo foo"`).

Currently, we support these hooks:

- `pre_prompt` hook: Triggered before the prompt is drawn
- `pre_execution` hook: Triggered before a command starts executing
- `env_change` hook: Triggered when an environment variable changes

More specifically, one Nushell REPL cycle looks like this:

1. Check for `pre_prompt` hooks and run them
1. Check for `env_change` hooks and run them
1. Display prompt and wait for user input
1. After user typed something and pressed "Enter": Check for `pre_execution` hooks and run them
1. Parse and evaluate user input
1. Return to 1
