---
title: HTTP
---

# HTTP

### Fetching JSON from a url

```nu
> http get https://jsonplaceholder.typicode.com/posts | first 5
```

Output

```
━━━┯━━━━━━━━┯━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 # │ userId │ id │ title                                                   │ body
───┼────────┼────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────
 0 │      1 │  1 │ sunt aut facere repellat provident occaecati excepturi  │ quia et suscipit
   │        │    │ optio reprehenderit                                     │ suscipit recusandae consequuntur expedita et cum
   │        │    │                                                         │ reprehenderit molestiae ut ut quas totam
   │        │    │                                                         │ nostrum rerum est autem sunt rem eveniet architecto
 1 │      1 │  2 │ qui est esse                                            │ est rerum tempore vitae
   │        │    │                                                         │ sequi sint nihil reprehenderit dolor beatae ea dolores
   │        │    │                                                         │ neque
   │        │    │                                                         │ fugiat blanditiis voluptate porro vel nihil molestiae ut
   │        │    │                                                         │ reiciendis
   │        │    │                                                         │ qui aperiam non debitis possimus qui neque nisi nulla
 2 │      1 │  3 │ ea molestias quasi exercitationem repellat qui ipsa sit │ et iusto sed quo iure
   │        │    │ aut                                                     │ voluptatem occaecati omnis eligendi aut ad
   │        │    │                                                         │ voluptatem doloribus vel accusantium quis pariatur
   │        │    │                                                         │ molestiae porro eius odio et labore et velit aut
 3 │      1 │  4 │ eum et est occaecati                                    │ ullam et saepe reiciendis voluptatem adipisci
   │        │    │                                                         │ sit amet autem assumenda provident rerum culpa
   │        │    │                                                         │ quis hic commodi nesciunt rem tenetur doloremque ipsam
   │        │    │                                                         │ iure
   │        │    │                                                         │ quis sunt voluptatem rerum illo velit
 4 │      1 │  5 │ nesciunt quas odio                                      │ repudiandae veniam quaerat sunt sed
   │        │    │                                                         │ alias aut fugiat sit autem sed est
   │        │    │                                                         │ voluptatem omnis possimus esse voluptatibus quis
   │        │    │                                                         │ est aut tenetur dolor neque
━━━┷━━━━━━━━┷━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Fetch from multiple urls

Suppose you are querying several endpoints,
perhaps with different query parameters and you want to view all the responses as a single dataset.
You can make use of `$it` to run nu commands on every row of data.

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
> open urls.json | get urls | each { |u| http get $u }
```

Output

```
━━━┯━━━━━━━━┯━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 # │ userId │ id │ title                                                   │ body
───┼────────┼────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────
 0 │      1 │  1 │ sunt aut facere repellat provident occaecati excepturi  │ quia et suscipit
   │        │    │ optio reprehenderit                                     │ suscipit recusandae consequuntur expedita et cum
   │        │    │                                                         │ reprehenderit molestiae ut ut quas totam
   │        │    │                                                         │ nostrum rerum est autem sunt rem eveniet architecto
 1 │      1 │  2 │ qui est esse                                            │ est rerum tempore vitae
   │        │    │                                                         │ sequi sint nihil reprehenderit dolor beatae ea dolores
   │        │    │                                                         │ neque
   │        │    │                                                         │ fugiat blanditiis voluptate porro vel nihil molestiae ut
   │        │    │                                                         │ reiciendis
   │        │    │                                                         │ qui aperiam non debitis possimus qui neque nisi nulla
 2 │      1 │  3 │ ea molestias quasi exercitationem repellat qui ipsa sit │ et iusto sed quo iure
   │        │    │ aut                                                     │ voluptatem occaecati omnis eligendi aut ad
   │        │    │                                                         │ voluptatem doloribus vel accusantium quis pariatur
   │        │    │                                                         │ molestiae porro eius odio et labore et velit aut
━━━┷━━━━━━━━┷━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

If you specify the `--raw` flag, you'll see 3 separate json objects, one in each row.

```nu
> open urls.json | get urls | each { |u| http get $u -r }
```

Output

```
━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 # │ <value>
───┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 0 │ {
   │   "userId": 1,
   │   "id": 1,
   │   "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
   │   "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum
   │ rerum est autem sunt rem eveniet architecto"
   │ }
 1 │ {
   │   "userId": 1,
   │   "id": 2,
   │   "title": "qui est esse",
   │   "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro
   │ vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
   │ }
 2 │ {
   │   "userId": 1,
   │   "id": 3,
   │   "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
   │   "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis
   │ pariatur\nmolestiae porro eius odio et labore et velit aut"
   │ }
━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

To combine these responses together into a valid JSON array, you can turn the table into json.

```nu
> open urls.json | get urls | each { |u| http get $u } | to json
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
> open payload.json | get my_payload | to json | post https://jsonplaceholder.typicode.com/posts $in
```

Output

```
━━━━━
 id
─────
 101
━━━━━
```

---

We can put this all together into a pipeline where we read data, manipulate it, and then send it back to the API. Lets `fetch` a post, `increment` the id, and `post` it back to the endpoint. In this particular example, the test endpoint gives back an arbitrary response which we can't actually mutate.

```nu
> open urls.json | get urls | first | http get $in | upsert id {|item| $item.id | inc} | to json | post https://jsonplaceholder.typicode.com/posts $in
```

```
━━━━━
 id
─────
 101
━━━━━
```
