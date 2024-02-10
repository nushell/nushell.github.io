---
title: Community
---

# (Not So) Advanced

While the "Advanced" title might sound daunting and you might be tempted to skip this chapter, in fact, some of the most interesting and powerful features can be found here.

Besides the built-in commands, Nushell has a [standard library](standard_library.md).

Nushell operates on _structured data_.
You could say that Nushell is a "data-first" shell and a programming language.
To further explore the data-centric direction, Nushell includes a full-featured dataframe processing engine using [Polars](https://github.com/pola-rs/polars) as the backend.
Make sure to check the [Dataframes documentation](dataframes.md) if you want to process large data efficiently directly in your shell.

Values in Nushell contain some extra [metadata](metadata.md).
This metadata can be used, for example, to [create custom errors](creating_errors.md).

Thanks to Nushell's strict scoping rules, it is very easy to [iterate over collections in parallel](parallelism.md) which can help you speed up long-running scripts by just typing a few characters.

You can [interactively explore data](explore.md) with the [`explore`](/commands/docs/explore.md) command.

Finally, you can extend Nushell's functionality with [plugins](plugins.md).
Almost anything can be a plugin as long as it communicates with Nushell in a protocol that Nushell understands.
