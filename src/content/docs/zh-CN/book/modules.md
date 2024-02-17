---
title: 模块
---

与其他许多编程语言类似，Nushell 也有模块，可以让你将自定义的命令导入到当前作用域中。
然而，由于 Nushell 也是一个 Shell，模块还允许你导入环境变量，可以用来方便地激活/停用各种环境配置。

_注意! 目前对模块的实现是相当基本的，并将在未来进一步扩展。例如，目前还不能从一个模块中导入另一个模块。_

## 基础知识

一个简单的模块可以像这样定义：

```nu
> module greetings {
     export def hello [name: string] {
         $"hello ($name)!"
     }

     export def hi [where: string] {
         $"hi ($where)!"
     }
}
```

或者在一个与你要创建的模块名相同的文件中：

```nu
# greetings.nu

export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}
```

我们在 `greetings` 模块中定义了 `hello` 和 `hi` 两个自定义命令。`export`关键字使得以后可以从模块中导入该命令。

与[`def`](/commands/docs/def.md)类似，也可以用`export`关键字标记[`def --env`](/commands/docs/def.md)（你可以在[环境](environment.md)章节中了解更多关于[`def --env`](/commands/docs/def.md)的信息）。

## 使用模块

模块本身并不做任何事情，要使用模块导出的定义，我们需要[`use`](/commands/docs/use.md)它：

```nu
> use greetings

> greetings hello "world"
hello world!

> greetings hi "there"
hi there!
```

`hello`和`hi`命令现在可以通过`greetings`前缀被调用。

## 导入符号

一般来说，[`use`](/commands/docs/use.md)关键词后面的任何内容都会形成一个**导入模式**，它控制着符号的导入方式。
导入模式可以是以下的一种：

`use greetings`

导入所有以模块名称为前缀的符号（我们在前面的例子中看到了这个）。

`use greetings hello`

`hello`符号将被直接导入，没有任何前缀。

`use greetings [ hello, hi ] `

直接导入多个符号，没有任何前缀。

`use greetings *`

你也可以使用模块名称和`*` glob 来直接导入所有的名称，且不需要任何前缀。

## 模块文件

Nushell 让你隐含地把一个源文件当作一个模块。
让我们先把模块定义的主体保存到一个文件中：

```nu
# greetings.nu

export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}
```

现在，你可以直接在文件上调用[`use`](/commands/docs/use.md)：

```nu
> use greetings.nu

> greetings hello "world"
hello world!

> greetings hi "there"
hi there!
```

Nushell 会自动从文件名（"greetings"，没有".nu"扩展名）推断出模块的名称。所以你可以通过文件名而不是模块名配合使用上述任何导入模式来完成导入。

## 本地自定义命令

任何在模块中定义的自定义命令，如果没有`export`关键字，将只在该模块的作用域内工作：

```nu
# greetings.nu

export def hello [name: string] {
    greetings-helper "hello" "world"
}

export def hi [where: string] {
    greetings-helper "hi" "there"
}

def greetings-helper [greeting: string, subject: string] {
    $"($greeting) ($subject)!"
}
```

然后，在 Nushell 里我们可以从 "greetings.nu" 中导入所有定义：

```nu
> use greetings.nu *

> hello "world"
hello world!

> hi "there"
hi there!

> greetings-helper "foo" "bar"  # fails because 'greetings-helper' is not exported
```

## 环境变量

到目前为止，我们只是用模块来导入自定义命令，用同样的方法导出环境变量也是可能的。
其语法与你可能习惯的直接修改 `$env` 或 [`load-env`](/commands/docs/load-env.md)等命令略有不同：

```nu
# greetings.nu

export env MYNAME { "Arthur, King of the Britons" }

export def hello [name: string] {
    $"hello ($name)"
}
```

`use` 的工作方式与自定义命令相同：

```nu
> use greetings.nu

> $env."greetings MYNAME"
Arthur, King of the Britons

> greetings hello $env."greetings MYNAME"
hello Arthur, King of the Britons!
```

你可能注意到我们没有直接给`MYNAME`赋值，相反，我们给了它一个代码块（`{ ...}`），它在我们每次调用[`use`](/commands/docs/use.md)时都会被执行。例如，我们可以用[`random`](/commands/docs/random.md)命令来演示这一点：

```nu
> module roll { export env ROLL { random dice | into string } }

> use roll ROLL

> $env.ROLL
4

> $env.ROLL
4

> use roll ROLL

> $env.ROLL
6

> $env.ROLL
6
```

## 导出符号

如上所述，你可以从模块中导出定义和环境变量。这可以让你更容易地将相关的定义分组，并导出你想公开的定义。

你还可以导出别名和外部声明(extern)，并在需要时才使用这些功能。导出外部声明也让你有能力隐藏模块中的自定义自动补全命令，这样它们就不必成为全局命名空间的一部分。

下面是所有你可以导出的列表：

- `export def` - 导出一个自定义命令
- `export def --env` - 导出一个自定义环境命令
- `export env` - 导出一个环境变量
- `export alias` - 导出一个别名
- `export extern` - 导出一个已知外部命令的定义

## 隐藏

任何自定义命令、别名或环境变量, 无论是否从模块中导入, 都可以被 "隐藏", 以恢复之前的定义。
(注意，现在还不能从模块中导出别名，但它们仍然可以被隐藏。)
我们用[`hide`](/commands/docs/hide.md)命令来实现隐藏：

```nu
> def foo [] { "foo" }

> foo
foo

> hide foo

> foo  # error! command not found!
```

[`hide`](/commands/docs/hide.md)命令也接受导入模式，就像[`use`](/commands/docs/use.md)那样。不过，导入模式的解释略有不同。它可以是下面中的一种：

`hide foo` 或者 `hide greetings`

- 如果该名称是一个自定义的命令或环境变量，则直接隐藏它。否则：
- 如果名字是一个模块的名称，则隐藏所有以模块名称为前缀的导出。

`hide greetings hello`

- 隐藏带前缀的命令或环境变量

`hide greetings [hello, hi]`

- 隐藏带前缀的若干个命令或环境变量

`hide greetings *`

- 隐藏模块的所有的导出，不含前缀

让我们看几个例子。前面已经看到了直接隐藏一个自定义命令的例子，现在让我们试试环境变量：

```nu
> $env.FOO = "FOO"

> $env.FOO
FOO

> hide FOO

> $env.FOO  # error! environment variable not found!
```

第一种情况也适用于从一个模块导入的命令/环境变量（使用上面定义的 "greetings.nu" 文件）：

```nu
> use greetings.nu *

> $env.MYNAME
Arthur, King of the Britons

> hello "world"
hello world!

> hide MYNAME

> $env.MYNAME  # error! environment variable not found!

> hide hello

> hello "world" # error! command not found!
```

最后，当名称为模块名时（假设是之前的`greetings`模块）：

```nu
> use greetings.nu

> $env."greetings MYNAME"
Arthur, King of the Britons

> greetings hello "world"
hello world!

> hide greetings

> $env."greetings MYNAME"  # error! environment variable not found!

> greetings hello "world" # error! command not found!
```
