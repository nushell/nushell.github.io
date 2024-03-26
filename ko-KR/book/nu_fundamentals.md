# Nu 기초

This chapter explains some of the fundamentals of the Nushell programming language.
After going through it, you should have an idea how to write simple Nushell programs.

Nushell has a rich type system.
You will find typical data types such as strings or integers and less typical data types, such as cell paths.
Furthermore, one of the defining features of Nushell is the notion of _structured data_ which means that you can organize types into collections: lists, records, or tables.
Contrary to the traditional Unix approach where commands communicate via plain text, Nushell commands communicate via these data types.
All of the above is explained in [Types of Data](types_of_data.md).

[Loading Data](loading_data.md) explains how to read common data formats, such as JSON, into _structured data_. This includes our own "NUON" data format.

Just like Unix shells, Nushell commands can be composed into [pipelines](pipelines.md) to pass and modify a stream of data.

Some data types have interesting features that deserve their own sections: [strings](working_with_strings.md), [lists](working_with_lists.md), and [tables](working_with_tables.md).
Apart from explaining the features, these sections also show how to do some common operations, such as composing strings or updating values in a list.

Finally, [Command Reference](/commands/) lists all the built-in commands with brief descriptions.
Note that you can also access this info from within Nushell using the [`help`](/commands/docs/help.md) command.
