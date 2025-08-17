# `explore`

explore是一个表格分页器，类似于`less`，但用于表格结构化数据。

## 签名

`> explore --head --index --reverse --peek`

### 参数

- `--head {bool}`: 显示或隐藏列标题(默认为true)
- `--index, -i`: 查看列表时显示行索引
- `--tail, -t`: 从底部开始滚动视口
- `--peek, -p`: 退出时输出光标所在单元格的值

## 快速开始

```nu
ls | explore -i
```

![explore-ls-png](https://user-images.githubusercontent.com/20165848/207849604-421312e3-537f-4b2e-b83e-f1f83f2a79d5.png)

[`explore`](/zh-CN/commands/docs/explore.md)的主要功能是`:table`(您可以在上面的截图中看到)。

您可以通过`<Left>`、`<Right>`、`<Up>`、`<Down>`方向键与之交互。它还支持Vim风格的`<h>`、`<j>`、`<k>`、`<l>`键绑定，`<Ctrl-f>`和`<Ctrl-b>`，以及Emacs风格的`<Ctrl-v>`、`<Alt-v>`、`<Ctrl-p>`和`<Ctrl-n>`键绑定。

您可以通过进入光标模式来检查底层值。按`<i>`或`<Enter>`进入该模式。
然后使用方向键选择需要的单元格。
您将能够看到它的底层结构。

您可以通过`:help`获取更多相关信息。

## 命令

[`explore`](/zh-CN/commands/docs/explore.md)有一系列内置命令可供使用。通过按`<:>`然后输入命令名称来运行命令。

要查看完整的命令列表，可以输入`:help`。

## 配置

您可以通过配置自定义许多选项(包括样式和颜色)。
您可以在[`default-config.nu`](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/default_files/default_config.nu)中找到示例配置。

## 示例

### 查看值

```nu
$nu | explore --peek
```

![explore-peek-gif](https://user-images.githubusercontent.com/20165848/207854897-35cb7b1d-7f7d-4ae2-9ec8-df19ac04ac99.gif)

### `:try`命令

有一个交互式环境，您可以使用`nu`命令浏览数据。

![explore-try-gif](https://user-images.githubusercontent.com/20165848/208159049-0954c327-9cdf-4cb3-a6e9-e3ba86fde55c.gif)

#### 通过`$nu`保留所选值

记住您可以结合`--peek`参数使用。

![explore-try-nu-gif](https://user-images.githubusercontent.com/20165848/208161203-96b51209-726d-449a-959a-48b205c6f55a.gif)
