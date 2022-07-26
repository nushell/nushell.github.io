# Nu Fundamentals

This chapter explains some of the fundamentals of the Nushell programming language.
After going through it, you should hopefully get an idea how to make simple Nushell programs.

Nushell has a rich type system.
You will find typical data types such as strings or integers and less typical data types, such as cell paths.
Furthermore, one of the defining features of Nushell is the notion of _structured data_ which means that you can organize types into collections: lists, records, or tables.
Contrary to the traditional Unix approach where commands communicate via plain text, Nushell commands communicate via all the different data types.
All of the above is explained in [Types of Data](types_of_data.md).

[Loading Data](loading_data.md) explains how to read common data formats, such as JSON, into _structured data_. This includes our own "NUON" data format.

Just like Unix shells, Nushell commands can be composed into [pipelines](pipelines.md) to pass and modify a stream of data.

Some data types have many interesting features that deserve their own sections: [strings](working_with_strings.md), [lists](working_with_lists.md), and [tables](working_with_tables.md).
Apart from explaining the features, the linked sections also show how to do some common operations, such as composing strings or updating values in a list.

Finally, [Command Reference](command_reference.md) shows a list of all the built-in commands with their brief descriptions.
Note that you can access this info also from within Nushell using the `help` command.
