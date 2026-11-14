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

The examples in the next sections run against a small test server on `localhost:8765`. Its `/echo` path returns what it received, `/users` returns a JSON list, `/private` needs a password, and `/redirect` redirects to `/users`.

### Sending headers and credentials

`--headers` (`-H`) adds request headers. Give it a record, or a list that alternates names and values:

```nu
http get --headers {X-Api-Key: abc123} http://localhost:8765/echo | get x_api_key
# => abc123
http get --headers [X-Api-Key abc123] http://localhost:8765/echo | get x_api_key
# => abc123
```

`--user` (`-u`) and `--password` (`-p`) send HTTP Basic authentication, an `Authorization: Basic ...` header holding the base64-encoded `user:password`. Either one can be given alone.

```nu
http get --user alice --password s3cret http://localhost:8765/private
# => ╭──────┬───────╮
# => │ user │ alice │
# => ╰──────┴───────╯
```

Basic authentication only encodes the password and doesn't encrypt it, so use it over `https://`. For token-based APIs, send the token with `--headers {Authorization: $"Bearer ($env.API_TOKEN)"}`.

---

### Handling error responses

A response with a status outside the 200 range is an error. The message has the status code, the reason, and the URL. Below it, the error shows the status reason again, or the response body when the response's content type is exactly `application/json`, with no `charset` or other parameter. For many APIs that body holds their own explanation:

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

- `manual` (or `m`) returns the redirect response itself, without an error. Its status and `location` header say where it points.
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

The other `http post` flags (`--headers`, `--user`, `--password`, `--max-time`, `--full`, `--allow-errors`, `--redirect-mode`, `--insecure`, `--pool`, and `--unix-socket`) work the same way as for `http get`. A body is required, and `http post` with neither an argument nor input fails with `Data must be provided either through pipeline or positional argument`.

### `http put`, `http patch`, and `http delete`

[`http put`](/commands/docs/http_put.md) and [`http patch`](/commands/docs/http_patch.md) take the same arguments and flags as `http post`, and only send a different HTTP method. The body is the second argument or the input, it's required, and `--content-type` or the input's content type decides how it's encoded:

```nu
{name: Bob} | to json | http put http://localhost:8765/users/2 | get method
# => PUT
http patch --content-type application/json http://localhost:8765/users/2 {name: Robert} | get method
# => PATCH
```

[`http delete`](/commands/docs/http_delete.md) has the same flags, but its body is optional. Pass one with `--data` (`-d`) or through the input, and it's encoded the same way. Without one, the request has no body.

---

### Certificates, proxies, and connection pooling

`--insecure` (`-k`) turns off TLS certificate checks, so you can reach a server with a self-signed or expired certificate. Anyone between you and the server can then read and change the traffic, so only use it with servers you control.

The HTTP commands send requests through a proxy when one of these environment variables is set: `http_proxy`, `HTTP_PROXY`, `https_proxy`, `HTTPS_PROXY`, or `ALL_PROXY`. They use the first one set, in that order, for every request, whatever the URL's scheme. The value is the proxy's URL, such as `http://proxy.example.com:3128` or `socks5://localhost:1080`, and it can include a `user:password@` part. Hosts listed in `NO_PROXY` (or `no_proxy`), separated by commas, are contacted directly. The commands read these variables from Nushell's own environment, so `with-env` sets a proxy for one request:

```nu
with-env {HTTPS_PROXY: "http://proxy.example.com:3128"} { http get https://www.nushell.sh }
```

Each HTTP command normally opens new connections and closes them when it's done. With `--pool`, it uses one client shared by every HTTP command in the session instead, which keeps connections open for the next request to the same server. The shared client checks certificates and follows redirects. A `--pool` call uses the shared client's certificate, redirect, and Unix socket settings, not its own `--insecure`, `--redirect-mode`, and `--unix-socket` flags. To change the shared client's settings, use [`http pool`](/commands/docs/http_pool.md), which takes those three flags and closes the client's open connections:

```nu
http pool --insecure
http get --pool https://self-signed.example.com/a
http get --pool https://self-signed.example.com/b
```

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
