---
title: HTTP
---

# HTTP

### Fetching JSON from a url

```nu
http get https://jsonplaceholder.typicode.com/posts | first 5
# => ╭──────────┬───────────────┬───────────┬───────────────────────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────╮
# => │        # │    userId     │    id     │                                       title                                       │                                   body                                    │
# => ├──────────┼───────────────┼───────────┼───────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
# => │        0 │             1 │         1 │ sunt aut facere repellat provident occaecati excepturi optio reprehenderit        │ quia et suscipit                                                          │
# => │          │               │           │                                                                                   │ suscipit recusandae consequuntur expedita et cum                          │
# => │          │               │           │                                                                                   │ reprehenderit molestiae ut ut quas totam                                  │
# => │          │               │           │                                                                                   │ nostrum rerum est autem sunt rem eveniet architecto                       │
# => │        1 │             1 │         2 │ qui est esse                                                                      │ est rerum tempore vitae                                                   │
# => │          │               │           │                                                                                   │ sequi sint nihil reprehenderit dolor beatae ea dolores neque              │
# => │          │               │           │                                                                                   │ fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis       │
# => │          │               │           │                                                                                   │ qui aperiam non debitis possimus qui neque nisi nulla                     │
# => │        2 │             1 │         3 │ ea molestias quasi exercitationem repellat qui ipsa sit aut                       │ et iusto sed quo iure                                                     │
# => │          │               │           │                                                                                   │ voluptatem occaecati omnis eligendi aut ad                                │
# => │          │               │           │                                                                                   │ voluptatem doloribus vel accusantium quis pariatur                        │
# => │          │               │           │                                                                                   │ molestiae porro eius odio et labore et velit aut                          │
# => │        3 │             1 │         4 │ eum et est occaecati                                                              │ ullam et saepe reiciendis voluptatem adipisci                             │
# => │          │               │           │                                                                                   │ sit amet autem assumenda provident rerum culpa                            │
# => │          │               │           │                                                                                   │ quis hic commodi nesciunt rem tenetur doloremque ipsam iure               │
# => │          │               │           │                                                                                   │ quis sunt voluptatem rerum illo velit                                     │
# => │        4 │             1 │         5 │ nesciunt quas odio                                                                │ repudiandae veniam quaerat sunt sed                                       │
# => │          │               │           │                                                                                   │ alias aut fugiat sit autem sed est                                        │
# => │          │               │           │                                                                                   │ voluptatem omnis possimus esse voluptatibus quis                          │
# => │          │               │           │                                                                                   │ est aut tenetur dolor neque                                               │
# => ╰──────────┴───────────────┴───────────┴───────────────────────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────╯
```

---

### Fetch from multiple urls

Suppose you are querying several endpoints,
perhaps with different query parameters and you want to view all the responses as a single dataset.

An example JSON file, `urls.json`, with the following contents:

```json
[
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3"
]
```

```nu
open urls.json | each { |u| http get $u }
# => ╭──────────┬───────────────┬───────────┬───────────────────────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────╮
# => │        # │    userId     │    id     │                                       title                                       │                                   body                                    │
# => ├──────────┼───────────────┼───────────┼───────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
# => │        0 │             1 │         1 │ sunt aut facere repellat provident occaecati excepturi optio reprehenderit        │ quia et suscipit                                                          │
# => │          │               │           │                                                                                   │ suscipit recusandae consequuntur expedita et cum                          │
# => │          │               │           │                                                                                   │ reprehenderit molestiae ut ut quas totam                                  │
# => │          │               │           │                                                                                   │ nostrum rerum est autem sunt rem eveniet architecto                       │
# => │        1 │             1 │         2 │ qui est esse                                                                      │ est rerum tempore vitae                                                   │
# => │          │               │           │                                                                                   │ sequi sint nihil reprehenderit dolor beatae ea dolores neque              │
# => │          │               │           │                                                                                   │ fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis       │
# => │          │               │           │                                                                                   │ qui aperiam non debitis possimus qui neque nisi nulla                     │
# => │        2 │             1 │         3 │ ea molestias quasi exercitationem repellat qui ipsa sit aut                       │ et iusto sed quo iure                                                     │
# => │          │               │           │                                                                                   │ voluptatem occaecati omnis eligendi aut ad                                │
# => │          │               │           │                                                                                   │ voluptatem doloribus vel accusantium quis pariatur                        │
# => │          │               │           │                                                                                   │ molestiae porro eius odio et labore et velit aut                          │
# => ╰──────────┴───────────────┴───────────┴───────────────────────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────╯
```

---

If you specify the `--raw` flag, you'll see 3 separate json objects, one in each row.

```nu
open urls.json | each { |u| http get $u -r }
# => ╭──────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │        0 │ {                                                                                                                                                                                         │
# => │          │   "userId": 1,                                                                                                                                                                            │
# => │          │   "id": 1,                                                                                                                                                                                │
# => │          │   "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",                                                                                                  │
# => │          │   "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"             │
# => │          │ }                                                                                                                                                                                         │
# => │        1 │ {                                                                                                                                                                                         │
# => │          │   "userId": 1,                                                                                                                                                                            │
# => │          │   "id": 2,                                                                                                                                                                                │
# => │          │   "title": "qui est esse",                                                                                                                                                                │
# => │          │   "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel                                                   │
# => │          │ nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"                                                                                                     │
# => │          │ }                                                                                                                                                                                         │
# => │        2 │ {                                                                                                                                                                                         │
# => │          │   "userId": 1,                                                                                                                                                                            │
# => │          │   "id": 3,                                                                                                                                                                                │
# => │          │   "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",                                                                                                                 │
# => │          │   "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"       │
# => │          │ }                                                                                                                                                                                         │
# => ╰──────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

---

To combine these responses together into a valid JSON array, you can turn the table into json.

```nu
open urls.json | each { |u| http get $u } | to json
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

Making a `post` request to an endpoint with a JSON payload. To make long requests easier, you can organize your json payloads inside a file, such as this `payload.json`:

```json
{
  "title": "foo",
  "body": "bar",
  "userId": 1
}
```

```nu
open payload.json | to json | http post https://jsonplaceholder.typicode.com/posts $in
# => ╭────┬─────╮
# => │ id │ 101 │
# => ╰────┴─────╯
```

---

We can put this all together into a pipeline where we read data, manipulate it, and then send it back to the API. Let's `http get` a post, increment its `id`, and `http post` it back to the endpoint. In this particular example, the test endpoint gives back an arbitrary response which we can't actually mutate. (The [`inc`](/commands/docs/inc.md) command comes from the `inc` [plugin](/book/plugins.md); without it, use `$item.id + 1` instead.)

```nu
open urls.json | first | http get $in | upsert id {|item| $item.id | inc} | to json | http post https://jsonplaceholder.typicode.com/posts $in
# => ╭────┬─────╮
# => │ id │ 101 │
# => ╰────┴─────╯
```

### Uploading files

To upload a form with a file (think a common file upload form in a browser, where you have to select a file and provide some additional data), you need to:

1. Specify the content type as `multipart/form-data`
2. Provide the record as the POST body
3. Provide the file data in one of the record fields as _binary_ data.

```nu
http post https://httpbin.org/post --content-type "multipart/form-data" {
  icon: (open -r ~/Downloads/favicon-32x32.png),
  description: "Small icon"
}
# => ╭─────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │ args    │ {record 0 fields}                                                                                                                                                                          │
# => │ data    │                                                                                                                                                                                            │
# => │         │ ╭──────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
# => │ files   │ │ icon │ data:application/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMElEQVR42u3OsQ0AMAjAMKaex4E8S09gYGplS9kTATDIOr3JgAEDBgwYMPD+APC9CwmJ7RDQZNpkAAAAAElFTkSuQm │ │
# => │         │ │      │ CC                                                                                                                                                                              │ │
# => │         │ ╰──────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
# => │         │ ╭─────────────┬────────────╮                                                                                                                                                               │
# => │ form    │ │ description │ Small icon │                                                                                                                                                               │
# => │         │ ╰─────────────┴────────────╯                                                                                                                                                               │
# => │         │ ╭─────────────────┬────────────────────────────────────────────────────────────────────╮                                                                                                   │
# => │ headers │ │ Accept          │ */*                                                                │                                                                                                   │
# => │         │ │ Accept-Encoding │ gzip                                                               │                                                                                                   │
# => │         │ │ Content-Length  │ 455                                                                │                                                                                                   │
# => │         │ │ Content-Type    │ multipart/form-data; boundary=638eb995-733d-4323-af24-1ecc9f063bf9 │                                                                                                   │
# => │         │ │ Host            │ httpbin.org                                                        │                                                                                                   │
# => │         │ │ User-Agent      │ nushell                                                            │                                                                                                   │
# => │         │ │ X-Amzn-Trace-Id │ Root=1-6aba8441-7f9483cf1e785f43333f0183                           │                                                                                                   │
# => │         │ ╰─────────────────┴────────────────────────────────────────────────────────────────────╯                                                                                                   │
# => │ json    │                                                                                                                                                                                            │
# => │ url     │ https://httpbin.org/post                                                                                                                                                                   │
# => ╰─────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

If the file happens to be a text file, you may need to additionally convert it to binary data before sending it. This can be done using the `into binary` command.

```nu
http post https://httpbin.org/post --content-type "multipart/form-data" {
  doc: (open -r ~/Downloads/README.txt | into binary),
  description: "Documentation file"
}
# => ╭─────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │ args    │ {record 0 fields}                                                                                         │
# => │ data    │                                                                                                           │
# => │         │ ╭─────┬─────────────────────────────────────────────────────────────────────────────────────────────────╮ │
# => │ files   │ │ doc │ To use Nu plugins, use the plugin add command to tell Nu where to find the plugin. For example: │ │
# => │         │ │     │                                                                                                 │ │
# => │         │ │     │ > plugin add ./nu_plugin_query                                                                  │ │
# => │         │ │     │                                                                                                 │ │
# => │         │ ╰─────┴─────────────────────────────────────────────────────────────────────────────────────────────────╯ │
# => │         │ ╭─────────────┬────────────────────╮                                                                      │
# => │ form    │ │ description │ Documentation file │                                                                      │
# => │         │ ╰─────────────┴────────────────────╯                                                                      │
# => │         │ ╭─────────────────┬────────────────────────────────────────────────────────────────────╮                  │
# => │ headers │ │ Accept          │ */*                                                                │                  │
# => │         │ │ Accept-Encoding │ gzip                                                               │                  │
# => │         │ │ Content-Length  │ 484                                                                │                  │
# => │         │ │ Content-Type    │ multipart/form-data; boundary=c0877359-a5f8-49a2-833d-06f18b23bf84 │                  │
# => │         │ │ Host            │ httpbin.org                                                        │                  │
# => │         │ │ User-Agent      │ nushell                                                            │                  │
# => │         │ │ X-Amzn-Trace-Id │ Root=1-6aba8441-50a90b4e49e34c860f7ab42c                           │                  │
# => │         │ ╰─────────────────┴────────────────────────────────────────────────────────────────────╯                  │
# => │ json    │                                                                                                           │
# => │ url     │ https://httpbin.org/post                                                                                  │
# => ╰─────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

---

### Accessing HTTP Response Metadata While Streaming

All HTTP commands attach response metadata. To access it after the response completes:

```nu
http get https://jsonplaceholder.typicode.com/posts/1 | metadata | get http_response.status
# => 200
```

To work with metadata while streaming the response body, use `metadata access`:

```nu
# Check the status, then process a JSON Lines response as it streams in
http get --raw --allow-errors https://httpbin.org/stream/3
| metadata access {|meta|
    if $meta.http_response.status != 200 {
        error make {msg: $"Failed with status ($meta.http_response.status)"}
    } else { }
  }
| lines
| each { from json | select id url }
# => ╭───┬────┬──────────────────────────────╮
# => │ # │ id │             url              │
# => ├───┼────┼──────────────────────────────┤
# => │ 0 │  0 │ https://httpbin.org/stream/3 │
# => │ 1 │  1 │ https://httpbin.org/stream/3 │
# => │ 2 │  2 │ https://httpbin.org/stream/3 │
# => ╰───┴────┴──────────────────────────────╯
```

`--raw` keeps the body as text so that `lines` can split it. Without it, `http get` tries to parse the whole JSON Lines body as a single JSON document and fails. The empty `else { }` block passes the response body through unchanged. Only the first pipeline inside the closure receives the stream as its input, so don't put other statements (such as `print`) before the `if`: the stream would not reach `lines`. (Referencing `$in` later in the closure works, but it collects the whole body instead of streaming it.)

The response body streams through the pipeline while you inspect metadata and process the stream simultaneously. Before `metadata access`, you needed `--full` to get metadata, which consumed the entire body and prevented streaming.

Available metadata:

- `status` - HTTP status code (200, 404, 500, etc.)
- `headers` - `[{name, value}, ...]`
- `urls` - Redirect history

---

### Connecting via Unix Domain Sockets

You can connect to HTTP servers over Unix domain sockets using the `--unix-socket` flag. This works on Unix/Linux systems and Windows 10+ (build 17063 and later). This is commonly used for local services like the Docker daemon, systemd, or other IPC services.

```nu
# Query Docker daemon via Unix socket
http get --unix-socket /var/run/docker.sock http://localhost/containers/json

# The hostname in the URL populates the HTTP Host header
http post --unix-socket ./my-service.sock --content-type application/json http://localhost/endpoint {data: "value"}
```

The socket path specifies where to connect, while the URL's hostname is used for the HTTP Host header. The hostname must still resolve (`localhost` always does), even though the request goes over the socket; a name that doesn't resolve fails with an I/O error. As with any `http post`, a record body needs a `--content-type` such as `application/json`.
