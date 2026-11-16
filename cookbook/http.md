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
| from json --objects
| select id url
# => ╭───┬────┬──────────────────────────────╮
# => │ # │ id │             url              │
# => ├───┼────┼──────────────────────────────┤
# => │ 0 │  0 │ https://httpbin.org/stream/3 │
# => │ 1 │  1 │ https://httpbin.org/stream/3 │
# => │ 2 │  2 │ https://httpbin.org/stream/3 │
# => ╰───┴────┴──────────────────────────────╯
```

`--raw` keeps the body as text so that `from json --objects` can read it one line at a time. Without it, `http get` tries to parse the whole JSON Lines body as a single JSON document and fails. The empty `else { }` block passes the response body through unchanged. Only the first pipeline inside the closure receives the stream as its input, so a statement such as `print` before the `if` keeps the stream from reaching `from json --objects`. Referencing `$in` later in the closure works, but it collects the whole body instead of streaming it.

The response body streams through the pipeline while you inspect metadata and process the stream simultaneously. Before `metadata access`, you needed `--full` to get metadata, which consumed the entire body and prevented streaming.

Available metadata:

- `status` - HTTP status code (200, 404, 500, etc.)
- `headers` - `[{name, value}, ...]`
- `urls` - Redirect history

---

The examples in the next sections run against a small test server on `localhost:8765`. Its `/echo` path returns what it received, `/users` returns a JSON list, `/private` needs a password, and `/redirect` redirects to `/users`. For `HEAD` requests, `/report.csv` sends a file's headers and `/login` sets two cookies, and an `OPTIONS` request to any path lists the methods the server allows.

A URL without a scheme gets `http://` in front of it, and one that starts with `:` gets `http://localhost`, so `http get :8765/users` asks the same server for the same path.

### Sending headers and credentials

`--headers` (`-H`) adds request headers. Give it a record, or a list that alternates names and values:

```nu
http get --headers {X-Api-Key: abc123} http://localhost:8765/echo | get x_api_key
# => abc123
http get --headers [X-Api-Key abc123] http://localhost:8765/echo | get x_api_key
# => abc123
```

`--user` (`-u`) and `--password` (`-p`) send HTTP Basic authentication, an `Authorization: Basic ...` header holding the base64-encoded `user:password`. You can give either one alone.

```nu
http get --user alice --password s3cret http://localhost:8765/private
# => ╭──────┬───────╮
# => │ user │ alice │
# => ╰──────┴───────╯
```

Basic authentication only encodes the password and doesn't encrypt it, so use it over `https://`. For token-based APIs, send the token with `--headers {Authorization: $"Bearer ($env.API_TOKEN)"}`.

---

### Handling error responses

A response with a status outside the 200 range is an error. Its message has the status code, the reason, and the URL. The label below shows the status reason again, or the response body when the content type is exactly `application/json`, with no `charset` or other parameter. Many APIs put their own explanation in that body:

```nu
http get http://localhost:8765/status/404/json
# => Error: nu::shell::http_error
# =>
# =>   × HTTP Error 404 (Not Found): http://localhost:8765/status/404/json
# =>    ╭─[repl_entry #1:1:10]
# =>  1 │ http get http://localhost:8765/status/404/json
# =>    ·          ──────────────────┬──────────────────
# =>    ·                            ╰── {"error": "item not found"}
# =>    ╰────
```

With `--allow-errors` (`-e`), `http get` returns the body of an error response like any other body. Check the status in the [response metadata](#accessing-http-response-metadata-while-streaming) or with `--full`:

```nu
http get --allow-errors http://localhost:8765/status/404 | metadata | get http_response.status
# => 404
```

---

### Getting the full response

`--full` (`-f`) returns a record instead of just the body. It has the `urls` that were requested, including every redirect, the request and response `headers`, the `body`, and the `status`. Each set of headers is a list of `{name, value}` records, and the request headers are only those you added with flags such as `--headers` or `--user`.

```nu
http get --full http://localhost:8765/redirect | reject headers
# => ╭────────┬────────────────────────────────────────╮
# => │        │ ╭───┬────────────────────────────────╮ │
# => │ urls   │ │ 0 │ http://localhost:8765/redirect │ │
# => │        │ │ 1 │ http://localhost:8765/users    │ │
# => │        │ ╰───┴────────────────────────────────╯ │
# => │        │ ╭───┬────┬───────╮                     │
# => │ body   │ │ # │ id │ name  │                     │
# => │        │ ├───┼────┼───────┤                     │
# => │        │ │ 0 │  1 │ Alice │                     │
# => │        │ │ 1 │  2 │ Bob   │                     │
# => │        │ ╰───┴────┴───────╯                     │
# => │ status │ 200                                    │
# => ╰────────┴────────────────────────────────────────╯
```

`--full` reads the whole body before it returns. For a large or streaming response, use the metadata instead.

---

### Redirects and timeouts

The HTTP commands follow redirects by default. `--redirect-mode` (`-R`) changes that:

- `manual` (or `m`) returns the redirect response itself, without an error. Its `location` header says where it points.
- `error` (or `e`) fails with a `Redirect encountered when redirect handling mode was 'error'` error.

```nu
let response = http get --redirect-mode manual --full http://localhost:8765/redirect
$response.status
# => 302
$response.headers.response | where name == location | get value.0
# => /users
```

`--max-time` (`-m`) limits how long the whole request may take, including reading the body. When the time runs out, the command fails with a `Timed out` error. The duration has to be greater than zero.

```nu
http get --max-time 10sec http://localhost:8765/users
```

---

### How `http post` sends its body

[`http post`](/commands/docs/http_post.md) takes the body as its second argument, or from the pipeline. The content type comes from `--content-type` (`-t`). Without the flag, a body piped in from a command that sets one, such as `to json`, keeps that content type. A body given as an argument has none, so `{a: 1} | to json | http post $url` sends `application/json`, but `http post $url ({a: 1} | to json)` sends no content type at all.

The content type decides how the body is encoded:

- `application/json`: a record, list, or number is sent as JSON. A string that holds valid JSON is sent as that JSON, and any other string as a JSON string.
- `application/x-www-form-urlencoded`: a record is sent as URL-encoded `name=value` pairs, the way an HTML form submits them. Each value has to be convertible to a string, so a nested list or record is an error. A list that alternates names and values does the same and can repeat a name.
- `multipart/form-data`: a record is sent as form fields, and binary values are sent as files. See [Uploading files](#uploading-files).
- Any other content type, or none: only a string or binary body is accepted, and it's sent as it is. A record fails with an `Accepted types: [binary, string]` error.

```nu
http post --content-type application/x-www-form-urlencoded http://localhost:8765/login {user: "alice smith", tags: "a&b", n: 3} | get body
# => user=alice+smith&tags=a%26b&n=3
```

The other `http post` flags (`--headers`, `--user`, `--password`, `--max-time`, `--full`, `--raw`, `--allow-errors`, `--redirect-mode`, `--insecure`, `--pool`, and `--unix-socket`) work the same way as for `http get`. A body is required, and `http post` with neither an argument nor input fails with `Data must be provided either through pipeline or positional argument`.

### `http put`, `http patch`, and `http delete`

[`http put`](/commands/docs/http_put.md) and [`http patch`](/commands/docs/http_patch.md) take the same arguments and flags as `http post` and only send a different HTTP method. The body is required, and it's encoded by the same rules:

```nu
{name: Bob} | to json | http put http://localhost:8765/users/2 | get method
# => PUT
http patch --content-type application/json http://localhost:8765/users/2 {name: Robert} | get method
# => PATCH
```

[`http delete`](/commands/docs/http_delete.md) has the same flags, but its body is optional. Pass one with `--data` (`-d`) or through the input, and it's encoded the same way. Without one, the request has no body:

```nu
http delete http://localhost:8765/users/2 | select method body
# => ╭────────┬────────╮
# => │ method │ DELETE │
# => │ body   │        │
# => ╰────────┴────────╯
http delete --content-type application/json --data {reason: duplicate} http://localhost:8765/users/2 | get body
# => {
# =>   "reason": "duplicate"
# => }
```

As with `http post`, a record given with `--data` and no `--content-type` fails with `Accepted types: [binary, string]`.

### `http` without a subcommand

[`http`](/commands/docs/http.md) on its own picks the method from its arguments. With just a URL it sends a `GET`, and with a URL and a body it sends a `POST`. With no arguments it prints its help.

```nu
http http://localhost:8765/users | length
# => 2
http http://localhost:8765/echo "hello" | select method body
# => ╭────────┬───────╮
# => │ method │ POST  │
# => │ body   │ hello │
# => ╰────────┴───────╯
```

The body has to be the second argument. `http` doesn't take pipeline input, so `"hello" | http $url` fails with `command doesn't support string input`; pipe into `http post` instead. Its flags work the way they do for `http get` and `http post`, but it lacks the `--pool` and `--unix-socket` flags that the subcommands have.

A method name in the URL position is an error, so storing the method in a variable doesn't work:

```nu
let method = "post"
http $method http://localhost:8765/echo
# => Error: nu::shell::error
# =>
# =>   × Invalid command construction
# =>    ╭─[repl_entry #2:1:6]
# =>  1 │ http $method http://localhost:8765/echo
# =>    ·      ───┬───
# =>    ·         ╰── Using "post" dynamically is bad command construction. You are providing it to the `url` positional argument of `http`
# =>    ╰────
# =>   help: Prefer to use `http post` directly
```

To choose the method at run time, use `match` with one `http` subcommand in each arm.

### Reading headers with `http head` and `http options`

[`http head`](/commands/docs/http_head.md) sends a `HEAD` request, which asks for a resource's headers without its body. Use it to check a file's size, type, or `etag` before you download it, or to see whether a URL exists. It returns the response headers as a table of `name` and `value` columns. The names are in lowercase, and the rows come in no fixed order, so filter or sort them instead of relying on their position:

```nu
http head http://localhost:8765/report.csv | where name in [content-type content-length etag] | sort-by name
# => ╭───┬────────────────┬──────────╮
# => │ # │      name      │  value   │
# => ├───┼────────────────┼──────────┤
# => │ 0 │ content-length │ 52817    │
# => │ 1 │ content-type   │ text/csv │
# => │ 2 │ etag           │ "r42"    │
# => ╰───┴────────────────┴──────────╯
```

Every value is a string. To look headers up by name, turn the table into a record with [`transpose`](/commands/docs/transpose.md):

```nu
let headers = http head http://localhost:8765/report.csv | transpose --header-row --as-record
$headers.content-length | into filesize
# => 52.8 kB
```

A header that appears more than once, such as `set-cookie`, gets one row for each value. The record keeps only the first of them, so read those from the table:

```nu
http head http://localhost:8765/login | where name == set-cookie
# => ╭───┬────────────┬─────────────╮
# => │ # │    name    │    value    │
# => ├───┼────────────┼─────────────┤
# => │ 0 │ set-cookie │ session=abc │
# => │ 1 │ set-cookie │ theme=dark  │
# => ╰───┴────────────┴─────────────╯
```

A status outside the 200 range is an error, as it is for `http get`. With `--allow-errors` you get the error response's headers instead, and `--redirect-mode manual` returns the headers of a redirect response, including where it points:

```nu
http head http://localhost:8765/missing
# => Error: nu::shell::http_error
# =>
# =>   × HTTP Error 404 (Not Found): http://localhost:8765/missing
# =>    ╭─[repl_entry #1:1:11]
# =>  1 │ http head http://localhost:8765/missing
# =>    ·           ──────────────┬──────────────
# =>    ·                         ╰── Not Found
# =>    ╰────
http head --redirect-mode manual http://localhost:8765/redirect | where name == location | get value.0
# => /users
```

`--full` returns the same record as [`http get --full`](#getting-the-full-response), with an empty `body`. That's the way to get the status code, which the headers table doesn't include. `http head` has no `--raw` flag, since there's no body to read. Its other flags, for credentials, headers, timeouts, certificates, the connection pool, and Unix sockets, work the way they do for `http get`.

[`http options`](/commands/docs/http_options.md) sends an `OPTIONS` request and returns the response headers the same way. Many servers answer it with an `allow` header that lists the methods a URL accepts:

```nu
http options http://localhost:8765/api | where name == allow | get value.0
# => GET, HEAD, POST, DELETE, OPTIONS
```

Before a cross-origin request, a browser sends an `OPTIONS` request called a CORS preflight. Send the same headers to check how a server will answer it. In a `--headers` record, quote a value that contains a colon, such as a URL:

```nu
http options --headers {Origin: "https://app.example.com", Access-Control-Request-Method: DELETE} http://localhost:8765/api | where name starts-with access-control | sort-by name
# => ╭───┬──────────────────────────────┬─────────────────────────╮
# => │ # │             name             │          value          │
# => ├───┼──────────────────────────────┼─────────────────────────┤
# => │ 0 │ access-control-allow-headers │ Content-Type            │
# => │ 1 │ access-control-allow-methods │ GET, POST, DELETE       │
# => │ 2 │ access-control-allow-origin  │ https://app.example.com │
# => ╰───┴──────────────────────────────┴─────────────────────────╯
```

`http options` always follows redirects and has no `--redirect-mode` flag. Its other flags are the same as those of `http head`. It reads and discards any body the server sends. `--full` returns the full record instead, which has the status:

```nu
http options --full http://localhost:8765/api | get status
# => 204
```

---

### Certificates, proxies, and connection pooling

`--insecure` (`-k`) turns off TLS certificate checks, so you can reach a server with a self-signed or expired certificate. Anyone between you and the server can then read and change the traffic, so only use it with servers you control.

The HTTP commands send requests through a proxy when one of these environment variables is set: `http_proxy`, `HTTP_PROXY`, `https_proxy`, `HTTPS_PROXY`, or `ALL_PROXY`. They use the first one set, in that order, for every request, whatever the URL's scheme. The value is the proxy's URL, such as `http://proxy.example.com:3128` or `socks5://localhost:1080`, and it can include a `user:password@` part. Hosts listed in `NO_PROXY` (or `no_proxy`), separated by commas, are contacted directly. The commands read these variables from Nushell's own environment, so `with-env` sets a proxy for one request:

```nu
with-env {HTTPS_PROXY: "http://proxy.example.com:3128"} { http get https://www.nushell.sh }
```

Each HTTP command normally opens new connections and closes them when it's done. With `--pool`, it uses one client shared by every HTTP command in the session instead, which keeps connections open for the next request to the same server. Nushell creates the shared client the first time a command uses `--pool`. That client checks certificates, follows redirects, and connects over TCP. It reads the proxy variables once, when it's created, so a later `with-env` doesn't change its proxy.

[`http pool`](/commands/docs/http_pool.md) replaces the shared client with a new one and closes the old client's open connections. Its `--insecure`, `--redirect-mode`, and `--unix-socket` flags set up the new client, and `http pool` with no flags goes back to the defaults. It returns nothing.

```nu
http pool --insecure
http get --pool https://self-signed.example.com/a
http get --pool https://self-signed.example.com/b
```

A `--pool` request uses the shared client's certificate and Unix socket settings and ignores its own `--insecure` and `--unix-socket` flags. Redirects are split between the two. The shared client decides whether a redirect is followed, and when it isn't, the request's own `--redirect-mode` decides what to do with the redirect response. To get that response back, set `manual` on both:

```nu
http pool --redirect-mode manual
http get --pool http://localhost:8765/redirect
# => Error: nu::shell::http_error
# =>
# =>   × HTTP Error 302 (Found): http://localhost:8765/redirect
# =>    ╭─[repl_entry #2:1:17]
# =>  1 │ http get --pool http://localhost:8765/redirect
# =>    ·                 ───────────────┬──────────────
# =>    ·                                ╰── Found
# =>    ╰────
http get --pool --redirect-mode manual --full http://localhost:8765/redirect | get status
# => 302
```

With the default shared client, which follows redirects, a request's `--redirect-mode manual` or `error` has no effect.

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

---

### Finding a free port

[`port`](/commands/docs/port.md) returns the number of a TCP port that nothing is using. Use it to pick a port for a local test server:

```nu
let free = port
job spawn { python3 -m http.server $free --bind 127.0.0.1 } | ignore
sleep 1sec
http get --full $"http://localhost:($free)/" | get status
# => 200
```

With no arguments, the operating system picks the port. With a start and an end, `port` tries the ports in that range from the lowest up and returns the first free one, and with only a start, the range runs to 65535. It doesn't hold the port open, so another program can take it before you use it.

On Linux and macOS, `port` checks a port by binding to it on `127.0.0.1`, and a port it can't bind for any reason counts as taken. On Windows it looks the port up in the system's table of TCP connections instead. When every port in the range is taken, it fails:

```nu
port 8765 8765
# => Error: nu::shell::io::addr_in_use
# =>
# =>   × I/O error
# =>   ╰─▶   × Every port has been tried, but no valid one was found
# =>
# =>    ╭─[repl_entry #1:1:6]
# =>  1 │ port 8765 8765
# =>    ·      ────┬────
# =>    ·          ╰── Address in use
# =>    ╰────
```

A start higher than the end fails with `Invalid range`, a number above 65535 with `Can't convert to u16`, and a negative number with `Negative value passed when positive one is required`.

---

### Working with URLs

The `url` commands take URLs apart, put them back together, and encode and decode their pieces. [`url`](/commands/docs/url.md) on its own prints the list of them. The ones that handle query strings use a table with `key` and `value` columns, so that a key can appear more than once.

#### Taking a URL apart

[`url parse`](/commands/docs/url_parse.md) turns a URL string into a record. On the way, it lowercases the host, resolves `.` and `..` segments, and drops a port that's the default for the scheme. `query` keeps the query string as it was written, and `params` holds it decoded, with one row for each `key=value` pair:

```nu
'https://Example.COM:443/docs/../api/./v1?q=nu%20shell&tag=a&tag=b#top' | url parse
# => ╭──────────┬──────────────────────────╮
# => │ scheme   │ https                    │
# => │ username │                          │
# => │ password │                          │
# => │ host     │ example.com              │
# => │ port     │                          │
# => │ path     │ /api/v1                  │
# => │ query    │ q=nu%20shell&tag=a&tag=b │
# => │ fragment │ top                      │
# => │          │ ╭───┬─────┬──────────╮   │
# => │ params   │ │ # │ key │  value   │   │
# => │          │ ├───┼─────┼──────────┤   │
# => │          │ │ 0 │ q   │ nu shell │   │
# => │          │ │ 1 │ tag │ a        │   │
# => │          │ │ 2 │ tag │ b        │   │
# => │          │ ╰───┴─────┴──────────╯   │
# => ╰──────────┴──────────────────────────╯
```

Every field except `params` is a string, `port` included, and a part the URL doesn't have is an empty string. A string without a scheme, such as `example.com/path`, fails with `Incomplete or incorrect URL. Expected a full URL, e.g., https://www.example.com`.

`--base` (`-b`) resolves a relative URL against a base URL, the way a browser resolves a link on a page. An absolute URL ignores the base. Together with `url join`, that turns the links on a page into full URLs:

```nu
['/about' 'img/logo.png' '../up' 'https://other.org/x'] | each { url parse --base https://example.com/docs/intro | url join }
# => ╭───┬───────────────────────────────────────╮
# => │ 0 │ https://example.com/about             │
# => │ 1 │ https://example.com/docs/img/logo.png │
# => │ 2 │ https://example.com/up                │
# => │ 3 │ https://other.org/x                   │
# => ╰───┴───────────────────────────────────────╯
```

The base has to be a full URL itself. If it isn't, the error says `Incomplete or incorrect base URL`.

`url parse` takes one string at a time. Use `each` for a list and `update` for a column:

```nu
[[site]; ['https://a.com/x?q=1'] ['https://b.org/y']] | update site { url parse } | get site.host
# => ╭───┬───────╮
# => │ 0 │ a.com │
# => │ 1 │ b.org │
# => ╰───┴───────╯
```

#### Building a URL

[`url join`](/commands/docs/url_join.md) builds a URL from a record with the fields that `url parse` returns. `scheme` and `host` are required. `params` takes a record, or a table with `key` and `value` columns, and encodes it into the query string. A list value repeats its key:

```nu
{scheme: https, host: api.example.com, path: "v1/search", params: {q: "rust lang", page: 2}} | url join
# => https://api.example.com/v1/search?q=rust+lang&page=2
```

`url join` adds a `/` in front of `path` and a `#` in front of `fragment` when they don't start with one. It always adds a `?` in front of `query`, so leave the `?` out. `port` can be an int or a string of digits, and it's kept even when it's the scheme's default. Empty fields are left out.

`params` is the only field that gets encoded. `path`, `query`, and `fragment` go into the URL exactly as you give them, so encode them first:

```nu
{scheme: https, host: example.com, path: '/a b'} | url join
# => https://example.com/a b
{scheme: https, host: example.com, path: ('Q3 report.pdf' | url encode --all)} | url join
# => https://example.com/Q3%20report%2Epdf
```

When a record has both `query` and `params`, they have to give the same query string, or `url join` fails with a `Mismatch` error. In a record you build yourself, give only one of the two. To change the query of a URL you parsed, remove `query` and update `params`:

```nu
'https://example.com/search?q=nu&page=1#results' | url parse | reject query | update params {q: 'nu shell', page: 2} | url join
# => https://example.com/search?q=nu+shell&page=2#results
```

A missing `scheme` or `host` fails with `Missing parameter`, an empty one with `Invalid value`, and a `port` that isn't a number with `Port parameter should represent an unsigned int`. A field `url join` doesn't know is reported as an error, but the command goes on without it and still returns the URL:

```nu
{scheme: https, host: example.com, colour: blue} | url join
# => Error: nu::shell::error
# =>
# =>   × 'colour' is not a valid URL field
# =>    ╭─[repl_entry #1:1:44]
# =>  1 │ {scheme: https, host: example.com, colour: blue} | url join
# =>    ·                                            ──┬─
# =>    ·                                              ╰── remove 'colour' col from input record
# =>    ╰────
# =>
# => https://example.com
```

#### Query strings

[`url build-query`](/commands/docs/url_build-query.md) turns a record into a query string, encoded the way an HTML form encodes its fields. A space becomes `+`, and characters such as `&` and `=` are percent-encoded. A list value repeats its key, and numbers and booleans become text. A `null` or a nested record fails with `Expected a record with string or list of string values`.

```nu
{q: "a&b c", tags: [x y], n: 3, ok: true} | url build-query
# => q=a%26b+c&tags=x&tags=y&n=3&ok=true
```

It also takes a table with `key` and `value` columns, which can repeat a key wherever you need it. A table without both of those columns isn't accepted.

```nu
[[key value]; [sort name] [sort age]] | url build-query
# => sort=name&sort=age
```

[`url split-query`](/commands/docs/url_split-query.md) goes the other way. It decodes a query string into a `key` and `value` table, reading `+` as a space, and every value comes back as a string:

```nu
'q=nu+shell&tag=a&tag=b&empty=' | url split-query
# => ╭───┬───────┬──────────╮
# => │ # │  key  │  value   │
# => ├───┼───────┼──────────┤
# => │ 0 │ q     │ nu shell │
# => │ 1 │ tag   │ a        │
# => │ 2 │ tag   │ b        │
# => │ 3 │ empty │          │
# => ╰───┴───────┴──────────╯
```

Leave out the leading `?`. `url split-query` doesn't strip it, so `'?q=1'` gives a key named `?q`. To look values up by key, turn the table into a record with `transpose --header-row --as-record`. As with headers, a key that repeats keeps only its first value:

```nu
'q=1&tag=a&tag=b' | url split-query | transpose --header-row --as-record
# => ╭─────┬───╮
# => │ q   │ 1 │
# => │ tag │ a │
# => ╰─────┴───╯
```

#### Encoding and decoding

[`url encode`](/commands/docs/url_encode.md) percent-encodes a string. It's meant for one piece of a URL, such as a path or a single value. It leaves ASCII letters and digits, `/`, `:`, and `.` alone, and encodes everything else, including `?`, `&`, `=`, `-`, and `_`. Run on a whole URL, it breaks the query string:

```nu
'https://example.com/a file?x=1&y=my-name' | url encode
# => https://example.com/a%20file%3Fx%3D1%26y%3Dmy%2Dname
```

For query strings, use `url build-query`, which encodes each value and keeps the `&` and `=` between them. `--all` (`-a`) also encodes `/`, `:`, and `.`, for a value that has to stay a single path segment:

```nu
'reports/2026 Q3.pdf' | url encode
# => reports/2026%20Q3.pdf
'reports/2026 Q3.pdf' | url encode --all
# => reports%2F2026%20Q3%2Epdf
```

`url encode` also takes binary data, which it encodes byte by byte, for text in an encoding other than UTF-8. Given cell paths, it encodes the strings at those paths in a table or record. A column that holds anything other than strings fails with `only string input data is supported`.

```nu
[[file]; ['Q3 report.pdf'] ['notes.txt']] | url encode file
# => ╭───┬─────────────────╮
# => │ # │      file       │
# => ├───┼─────────────────┤
# => │ 0 │ Q3%20report.pdf │
# => │ 1 │ notes.txt       │
# => ╰───┴─────────────────╯
```

[`url decode`](/commands/docs/url_decode.md) turns `%` sequences back into characters, and takes cell paths the same way. It leaves `+` alone, unlike `url split-query`, and keeps a `%` that isn't followed by two hex digits:

```nu
'nu+shell%21' | url decode
# => nu+shell!
```

When the decoded bytes aren't UTF-8, `url decode` fails with `Input is not UTF-8 encoded`. `--binary` (`-b`) returns the bytes instead, and [`decode`](/commands/docs/decode.md) turns them into text:

```nu
'%A3%20rates' | url decode --binary | decode iso-8859-1
# => £ rates
```
