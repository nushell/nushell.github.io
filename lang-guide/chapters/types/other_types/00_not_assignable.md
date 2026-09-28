# Types used only in command signatures

The following type annotations are meant for custom command signatures, where they change how an argument is parsed.
A variable can also be annotated with one of them, but there it is the same as `string`: `let p: path = "~/x"` stores the string `~/x` unchanged, and `$p | describe` returns `string`.
