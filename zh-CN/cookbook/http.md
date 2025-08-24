---
title: HTTP
---

# HTTP

### 从 URL 获取 JSON

```nu
http get https://jsonplaceholder.typicode.com/posts | first 5
# => ━━━┯━━━━━━━━┯━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# =>  # │ userId │ id │ title                                                   │ body
# => ───┼────────┼────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────
# =>  0 │      1 │  1 │ sunt aut facere repellat provident occaecati excepturi  │ quia et suscipit
# =>    │        │    │ optio reprehenderit                                     │ suscipit recusandae consequuntur expedita et cum
# =>    │        │    │                                                         │ reprehenderit molestiae ut ut quas totam
# =>    │        │    │                                                         │ nostrum rerum est autem sunt rem eveniet architecto
# =>  1 │      1 │  2 │ qui est esse                                            │ est rerum tempore vitae
# =>    │        │    │                                                         │ sequi sint nihil reprehenderit dolor beatae ea dolores
# =>    │        │    │                                                         │ neque
# =>    │        │    │                                                         │ fugiat blanditiis voluptate porro vel nihil molestiae ut
# =>    │        │    │                                                         │ reiciendis
# =>    │        │    │                                                         │ qui aperiam non debitis possimus qui neque nisi nulla
# =>  2 │      1 │  3 │ ea molestias quasi exercitationem repellat qui ipsa sit │ et iusto sed quo iure
# =>    │        │    │ aut                                                     │ voluptatem occaecati omnis eligendi aut ad
# =>    │        │    │                                                         │ voluptatem doloribus vel accusantium quis pariatur
# =>    │        │    │                                                         │ molestiae porro eius odio et labore et velit aut
# =>  3 │      1 │  4 │ eum et est occaecati                                    │ ullam et saepe reiciendis voluptatem adipisci
# =>    │        │    │                                                         │ sit amet autem assumenda provident rerum culpa
# =>    │        │    │                                                         │ quis hic commodi nesciunt rem tenetur doloremque ipsam
# =>    │        │    │                                                         │ iure
# =>    │        │    │                                                         │ quis sunt voluptatem rerum illo velit
# =>  4 │      1 │  5 │ nesciunt quas odio                                      │ repudiandae veniam quaerat sunt sed
# =>    │        │    │                                                         │ alias aut fugiat sit autem sed est
# =>    │        │    │                                                         │ voluptatem omnis possimus esse voluptatibus quis
# =>    │        │    │                                                         │ est aut tenetur dolor neque
# => ━━━┷━━━━━━━━┷━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 从多个 URL 获取

假设您正在查询多个端点，
可能使用不同的查询参数，并且希望将所有响应视为单个数据集。

一个示例 JSON 文件 `urls.json`，内容如下：

```json
{
  "urls": [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/posts/2",
    "https://jsonplaceholder.typicode.com/posts/3"
  ]
}
```

```nu
open urls.json | get urls | each { |u| http get $u }
# => ━━━┯━━━━━━━━┯━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# =>  # │ userId │ id │ title                                                   │ body
# => ───┼────────┼────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────
# =>  0 │      1 │  1 │ sunt aut facere repellat provident occaecati excepturi  │ quia et suscipit
# =>    │        │    │ optio reprehenderit                                     │ suscipit recusandae consequuntur expedita et cum
# =>    │        │    │                                                         │ reprehenderit molestiae ut ut quas totam
# =>    │        │    │                                                         │ nostrum rerum est autem sunt rem eveniet architecto
# =>  1 │      1 │  2 │ qui est esse                                            │ est rerum tempore vitae
# =>    │        │    │                                                         │ sequi sint nihil reprehenderit dolor beatae ea dolores
# =>    │        │    │                                                         │ neque
# =>    │        │    │                                                         │ fugiat blanditiis voluptate porro vel nihil molestiae ut
# =>    │        │    │                                                         │ reiciendis
# =>    │        │    │                                                         │ qui aperiam non debitis possimus qui neque nisi nulla
# =>  2 │      1 │  3 │ ea molestias quasi exercitationem repellat qui ipsa sit │ et iusto sed quo iure
# =>    │        │    │ aut                                                     │ voluptatem occaecati omnis eligendi aut ad
# =>    │        │    │                                                         │ voluptatem doloribus vel accusantium quis pariatur
# =>    │        │    │                                                         │ molestiae porro eius odio et labore et velit aut
# => ━━━┷━━━━━━━━┷━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

如果您指定 `--raw` 标志，您将看到 3 个独立的 json 对象，每行一个。

```nu
open urls.json | get urls | each { |u| http get $u -r }
# => ━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# =>  # │ <value>
# => ───┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
# =>  0 │ {
# =>    │   "userId": 1,
# =>    │   "id": 1,
# =>    │   "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
# =>    │   "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum
# =>    │ rerum est autem sunt rem eveniet architecto"
# =>    │ }
# =>  1 │ {
# =>    │   "userId": 1,
# =>    │   "id": 2,
# =>    │   "title": "qui est esse",
# =>    │   "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro
# =>    │ vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
# =>    │ }
# =>  2 │ {
# =>    │   "userId": 1,
# =>    │   "id": 3,
# =>    │   "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
# =>    │   "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis
# =>    │ pariatur\nmolestiae porro eius odio et labore et velit aut"
# =>    │ }
# => ━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

要将这些响应组合成一个有效的 JSON 数组，您可以将表格转换为 json。

```nu
open urls.json | get urls | each { |u| http get $u } | to json
```

输出

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  {
    "userId": 1,
    "id": 3,
    "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
  }
]
```

---

向端点发出带有 JSON 负载的 `post` 请求。为了使长请求更容易，您可以在文件内组织 json 负载。

```json
{
  "my_payload": {
    "title": "foo",
    "body": "bar",
    "userId": 1
  }
}
```

```nu
open payload.json | get my_payload | to json | http post https://jsonplaceholder.typicode.com/posts $in
# => ━━━━━
# =>  id
# => ─────
# =>  101
# => ━━━━━
```

---

我们可以将所有内容整合到一个管道中，在其中读取数据、操作数据，然后将其发送回 API。让我们 `fetch` 一个帖子，`increment` id，然后 `post` 回端点。在这个特定的示例中，测试端点返回一个我们无法实际变异的任意响应。

```nu
open urls.json | get urls | first | http get $in | upsert id {|item| $item.id | inc} | to json | http post https://jsonplaceholder.typicode.com/posts $in
# => ━━━━━
# =>  id
# => ─────
# =>  101
# => ━━━━━
```

### 上传文件

要上传带有文件的表单（想想浏览器中常见的文件上传表单，您必须选择文件并提供一些额外数据），您需要：

1. 将内容类型指定为 `multipart/form-data`
2. 将记录作为 POST 主体提供
3. 在记录字段之一中以*二进制*数据形式提供文件数据。

```nu
http post https://httpbin.org/post --content-type "multipart/form-data" {
  icon: (open -r ~/Downloads/favicon-32x32.png),
  description: "Small icon"
}
# => ╭─────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │ args    │ {record 0 fields}                                                                                     │
# => │ data    │                                                                                                       │
# => │         │ ╭──────┬────────────────────────────────────────────────────────────────────────────────────────────╮ │
# => │ files   │ │ icon │ data:application/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIW │ │
# => │         │ │      │ XMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG5SURBVHgBrZeBUcMwDEU/XYBuUG8 │ │
# => │         │ │      │ AG2A26AZ0A7pBu0FhgmaDskHKBA0TJExAmSBYd/bFBNmWfLw73fUukvXlWI4KpLHOTs56Z6OzL2ets03C3zg7MP47/ │ │
# => │         │ │      │ 0zM0geOGeuZRW3BfwsBBlMFJaMK74UCghVFHIXJ48qWCgHjTPSf6scK2ysFtHHSRfRb9I4YHqDDYtq1XwLuUIeFHgt │ │
# => │         │ │      │ GgEE9K+hgd+CKer6h48oJ+EAdA/TiBzACGtRxho7BWZd6SC2iaUG6jIyPtcKYDTIYv6hUQNy6VuD/AgF0U/UoVz6/N │ │
# => │         │ │      │ 2whpoEC4wN6JnELvmVNQniLzF1xgzK0I9S3dNIHlE988If3H3LOC5QJCZeQMUQx1XcLJduBP5BHpF9BC/4VbKBAcgj │ │
# => │         │ │      │ nHUDYgv8BAgx0bfikECASIal83hXagWQdJ4wP4Rr6LyIl184Rz6kHR+iqD9b7eKuIWYWk8Q4kZ7UCBvIWDTxyArSLx │ │
# => │         │ │      │ Nyikv8aSD6hgx1I3lFHBz0dJ+ANdbxCxxmZ7wP9F6zpAMIKY7KHnQ7iRbhQPA1JBewhgEQ0KFduZnG2IFb9x4duxhO │ │
# => │         │ │      │ mb0MYRrYF4ZeZ0D0yN+wPKKVmaKtbyvUAAAAASUVORK5CYII=                                          │ │
# => │         │ ╰──────┴────────────────────────────────────────────────────────────────────────────────────────────╯ │
# => │         │ ╭─────────────┬────────────╮                                                                          │
# => │ form    │ │ description │ Small icon │                                                                          │
# => │         │ ╰─────────────┴────────────╯                                                                          │
# => │         │ ╭────────────────────────┬──────────────────────────────────────────────────────────────────────────╮ │
# => │ headers │ │ Accept                 │ */*                                                                      │ │
# => │         │ │ Accept-Encoding        │ gzip                                                                     │ │
# => │         │ │ Content-Length         │ 893                                                                      │ │
# => │         │ │ Content-Type           │ multipart/form-data; boundary=cddfac9d-e5e0-4aa3-a3df-6f9f6e570bc9       │ │
# => │         │ │ Host                   │ httpbin.org                                                              │ │
# => │         │ │ User-Agent             │ nushell                                                                  │ │
# => │         │ │ X-Amzn-Trace-Id        │ Root=1-66b28d98-549045021ddb79ab3d0eda79                                 │ │
# => │         │ ╰────────────────────────┴──────────────────────────────────────────────────────────────────────────╯ │
# => │ json    │                                                                                                       │
# => │ url     │ https://httpbin.org/post                                                                              │
# => ╰─────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

如果文件恰好是文本文件，您可能需要在发送之前将其转换为二进制数据。这可以使用 `into binary` 命令完成。

```nu
http post https://httpbin.org/post --content-type "multipart/form-data" {
  doc: (open -r ~/Downloads/README.txt | into binary),
  description: "Documentation file"
}
# => ╭─────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │ args    │ {record 0 fields}                                                                                        │
# => │ data    │                                                                                                          │
# => │         │ ╭──────┬───────────────────────────────────────────────────────────────────────────────────────────────╮ │
# => │ files   │ │ doc  │ To use Nu plugins, use the register command to tell Nu where to find the plugin. For example: │ │
# => │         │ │      │                                                                                               │ │
# => │         │ │      │ > register ./nu_plugin_query                                                                  │ │
# => │         │ ╰──────┴───────────────────────────────────────────────────────────────────────────────────────────────╯ │
# => │         │ ╭─────────────┬────────────────────╮                                                                     │
# => │ form    │ │ description │ Documentation file │                                                                     │
# => │         │ ╰─────────────┴────────────────────╯                                                                     │
# => │         │ ╭─────────────────┬────────────────────────────────────────────────────────────────────╮                 │
# => │ headers │ │ Accept          │ */*                                                                │                 │
# => │         │ │ Accept-Encoding │ gzip                                                               │                 │
# => │         │ │ Content-Length  │ 476                                                                │                 │
# => │         │ │ Content-Type    │ multipart/form-data; boundary=f872d6c3-7937-426d-b266-de562b777e1d │                 │
# => │         │ │ Host            │ httpbin.org                                                        │                 │
# => │         │ │ User-Agent      │ nushell                                                            │                 │
# => │         │ │ X-Amzn-Trace-Id │ Root=1-66b28eef-4998c6ab0ef5becb19ca7f6f                           │                 │
# => │         │ ╰─────────────────┴────────────────────────────────────────────────────────────────────╯                 │
# => │ json    │                                                                                                          │
# => │ url     │ https://httpbin.org/post                                                                                 │
# => ╰─────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```
