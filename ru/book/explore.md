# `explore`

Explore is a table pager, just like `less` but for table structured data.

## Signature

`> explore --head --index --reverse --peek`

### Parameters

- `--head {boolean}`: turn off column headers
- `--index`: show row indexes (by default it's not showed)
- `--reverse`: start from the last row
- `--peek`: returns a last used value, so it can be used in next pipelines

## Get Started

```nu
ls | explore -i
```

![explore-ls-png](https://user-images.githubusercontent.com/20165848/207849604-421312e3-537f-4b2e-b83e-f1f83f2a79d5.png)

So the main point of [`explore`](/commands/docs/explore.md) is `:table` (Which you see on the above screenshot).

You can interact with it via `<Left>`, `<Right>`, `<Up>`, `<Down>` _arrow keys_.

You can inspect a underlying values by entering into cursor mode. You can press either `<i>` or `<Enter>` to do so.
Then using _arrow keys_ you can choose a necessary cell.
And you'll be able to see it's underlying structure.

You can obtain more information about the various aspects of it by `:help`.

## Commands

[`explore`](/commands/docs/explore.md) has a list of built in commands you can use. Commands are run through pressing `<:>` and then a command name.

To find out the comprehensive list of commands you can type `:help`.

## Config

You can configure many things (including styles and colors), via config.
You can find an example configuration in [`default-config.nu`](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/sample_config/default_config.nu).

## Examples

### Peeking a value

```nu
$nu | explore --peek
```

![explore-peek-gif](https://user-images.githubusercontent.com/20165848/207854897-35cb7b1d-7f7d-4ae2-9ec8-df19ac04ac99.gif)

### `:try` command

There's an interactive environment which you can use to navigate through data using `nu`.

![explore-try-gif](https://user-images.githubusercontent.com/20165848/208159049-0954c327-9cdf-4cb3-a6e9-e3ba86fde55c.gif)

#### Keeping the chosen value by `$nu`

Remember you can combine it with `--peek`.

![explore-try-nu-gif](https://user-images.githubusercontent.com/20165848/208161203-96b51209-726d-449a-959a-48b205c6f55a.gif)
