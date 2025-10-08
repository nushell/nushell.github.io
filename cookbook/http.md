---
title: HTTP
---

# HTTP

### Fetching JSON from a url

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

### Fetch from multiple urls

Suppose you are querying several endpoints,
perhaps with different query parameters and you want to view all the responses as a single dataset.

An example JSON file, `urls.json`, with the following contents:

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

If you specify the `--raw` flag, you'll see 3 separate json objects, one in each row.

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

To combine these responses together into a valid JSON array, you can turn the table into json.

```nu
open urls.json | get urls | each { |u| http get $u } | to json
```

Output

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

Making a `post` request to an endpoint with a JSON payload. To make long requests easier, you can organize your json payloads inside a file.

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

We can put this all together into a pipeline where we read data, manipulate it, and then send it back to the API. Lets `fetch` a post, `increment` the id, and `post` it back to the endpoint. In this particular example, the test endpoint gives back an arbitrary response which we can't actually mutate.

```nu
open urls.json | get urls | first | http get $in | upsert id {|item| $item.id | inc} | to json | http post https://jsonplaceholder.typicode.com/posts $in
# => ━━━━━
# =>  id
# => ─────
# =>  101
# => ━━━━━
```

### Uploading files

To upload a form with a file (think a common file upload form in a browser, where you have to select a file and provide some additional data), you need to:

1. Specify the content type as `multipart/form-data`
2. Provide the record as the POST body
3. Provide the file data in one of the record fields as *binary* data.

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

If the file happens to be a text file, you may need to additionally convert it to binary data before sending it. This can be done using the `into binary` command.

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

---

### Accessing HTTP Response Metadata While Streaming

All HTTP commands attach response metadata. To access it after the response completes:

```nu
http get https://api.example.com/data.json | metadata | get http_response.status
# => 200
```

To work with metadata while streaming the response body, use `metadata access`:

```nu
# Log status and headers while streaming a large JSONL file
http get https://api.example.com/events.jsonl
| metadata access {|meta|
    print $"Status: ($meta.http_response.status)"
    print $"Content-Type: ($meta.http_response.headers | where name == content-type | get value.0)"

    if $meta.http_response.status != 200 {
        error make {msg: $"Failed with status ($meta.http_response.status)"}
    } else { }
  }
| lines
| each { from json }
| where event_type == "error"
```

The response body streams through the pipeline—you can inspect metadata and process the stream simultaneously. Before `metadata access`, you needed `--full` to get metadata, which consumed the entire body and prevented streaming.

Available metadata:
- `status` - HTTP status code (200, 404, 500, etc.)
- `headers` - `[{name, value}, ...]`
- `urls` - Redirect history
