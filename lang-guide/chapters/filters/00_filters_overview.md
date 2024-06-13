# Filters

A primary goal of Nushell is the ability to easily handle structured data in the pipeline. Nushell contains an extensive set of commands known as "filters" designed to meet these needs.

A sample of filter commands is listed in this Guide below. For the current list of commands categorized as filters, you can run:

```nu
help commands | where category == filters
```

## Filters vs. Flow Control Statements

While it's certainly possible to modify structured data using "traditional" flow control statements like `for` or `while`, filters are usually more convenient and (often far) more performant. See the [Variables section of The Book](/book/variables.html#choosing-between-mutable-and-immutable-variables) for more information.
