# Regular Expressions

Regular expressions in Nushell's commands and operators (such as `=~`, `str replace --regex`, `parse --regex`, and `split row --regex`) are handled by the [`fancy-regex`](https://docs.rs/fancy-regex) crate. It supports the syntax of Rust's [`regex`](https://docs.rs/regex/latest/regex/#syntax) crate, and adds features such as look-around and backreferences. If you want to know more, check the crate documentation.
