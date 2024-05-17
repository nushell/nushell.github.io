---
next: ./if-else.md
---

# Flow Control

Nushell includes a number of flow control statements and expressions similar to other languages.

However, keep in mind that many Nushell operations will be performed using structured data as input and/or output. While structured data can be created using flow control statements in conjunction with mutable variables, a better solution in these cases is to use Filters.

See:

```nu
help commands | where category == filter
```
