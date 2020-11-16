---
title: Streams
---

# Streams

Async streams form the foundation for how information flows from one end of the pipeline to the other. This allows nu to work with internal commands, external commands, and plugins in a way that's relatively seamless. 

There are two fundamental types for streams in Nu: InputStream and OutputStream

## InputStream

Let's look at the InputStream type a little closer:

```rust
BoxStream<'static, Tagged<Value>>
```

That is, it's an async stream which will send `Tagged<Value>` into the command. For more information about tagging, see the chapter on [metadata](metadata.md).

## OutputStream

Similar to InputStream above, an Output stream will return values from a command:

```rust
BoxStream<'static, ReturnValue>
```

Where a ReturnValue is:

```rust
pub type ReturnValue = Result<ReturnSuccess, ShellError>;
```

And a ReturnSuccess is:

```rust
pub enum ReturnSuccess {
    Value(Tagged<Value>),
    Action(CommandAction),
}
```

Why is OutputStream different from InputStream? This comes down to a few differences in needs of the two ends of the stream. By the time data has gotten to the command, it's already been checked for any errors, so it's expected to be a pure data stream.

Output streams, on the other hand, have to be able to return two other types of data in addition to values: errors and actions.

### Errors

Errors that are passed down the stream will be detected as values are copied from one command to another. Once the error is detected, it will halt the streams progress and display an error.

### Actions

An action differs from a value in that where a value is a bit of data that the next command in the pipeline will see, an action is something intended only for the core Nu runtime. Actions will change the state of the shell itself by, for example, changing the current path, changing the current shell, updating internal side tables, and so on.
