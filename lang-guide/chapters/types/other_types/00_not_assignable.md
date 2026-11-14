# Types used only in command signatures

The following type annotations are meant for custom command signatures, where they change how an argument is parsed.
They are [`path`](path.md), `directory` and [`external_arg`](external_arg.md).

A variable can also be annotated with one of them, but the annotation doesn't change how the value is parsed there:

- With `path` or `directory`, it is the same as `string`. `let p: path = "~/x"` stores the string `~/x` unchanged, `$p | describe` returns `string`, and `let p: path = 5` is a type mismatch.
- With `external_arg`, it is the same as `any`. `let e: external_arg = 0001` stores the int `1`.
