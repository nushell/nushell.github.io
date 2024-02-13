# Regular expressions

Regular expressions in Nushell's commands are mostly handled by the [`fancy-regex` crate](https://crates.io/crates/fancy-regex), which builds upon the [`rust-lang/regex` crate](https://github.com/rust-lang/regex). If you want to know more, check the documentation of both crates, in particular their "Syntax" sections.

There are a couple of exceptions, where only [`rust-lang/regex`](https://github.com/rust-lang/regex) is used. These are currently:

* `split column`
* `split list`
* `split row`
