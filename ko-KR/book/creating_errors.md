# 오류 메시지 커스터마이징하기

Using the [metadata](metadata.md) information, you can create your own custom error messages. Error messages are built of multiple parts:

- The title of the error
- The label of error message, which includes both the text of the label and the span to underline

You can use the [`error make`](/commands/docs/error_make.md) command to create your own error messages. For example, let's say you had your own command called `my-command` and you wanted to give an error back to the caller about something wrong with a parameter that was passed in.

First, you can take the span of where the argument is coming from:

```nu
let span = (metadata $x).span;
```

Next, you can create an error using the [`error make`](/commands/docs/error_make.md) command. This command takes in a record that describes the error to create:

```nu
error make {msg: "this is fishy", label: {text: "fish right here", span: $span } }
```

Together with your custom command, it might look like this:

```nu
def my-command [x] {
    let span = (metadata $x).span;
    error make {
        msg: "this is fishy",
        label: {
            text: "fish right here",
            span: (metadata $x).span
        }
    }
}
```

When called with a value, we'll now see an error message returned:

```nu
> my-command 100

Error:
  × this is fishy
   ╭─[entry #5:1:1]
 1 │ my-command 100
   ·            ─┬─
   ·             ╰── fish right here
   ╰────
```
