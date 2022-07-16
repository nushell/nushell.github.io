# Hooks

Hooks allow you to run a piece of Nushell code at some predefined situations.
Hooks are only available in the interactive mode, they do not work if you run a Nushell on a script (`nu script.nu`) or commands (`nu -c "echo foo"`).

Currently, we support these hooks:

- pre-prompt hook: Triggered before the prompt is drawn
- pre-execution hook: Triggered before a command starts executing
- environment-change hook: Triggered when an environment variable changes
