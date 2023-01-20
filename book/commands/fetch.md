---
title: fetch
categories: |
  lazyframe
  network
version: 0.74.0
lazyframe: |
  collects the lazyframe to the selected rows
network: |
  Fetch the contents from a URL.
usage: |
  collects the lazyframe to the selected rows
  Fetch the contents from a URL.
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> fetch ```

## Examples

Fetch a rows from the dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | fetch 2
```

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> fetch (URL) --user --password --timeout --headers --raw```

## Parameters

 -  `URL`: the URL to fetch the contents from
 -  `--user {any}`: the username when authenticating
 -  `--password {any}`: the password when authenticating
 -  `--timeout {int}`: timeout period in seconds
 -  `--headers {any}`: custom headers you want to add
 -  `--raw`: fetch contents as text rather than a table

## Notes
Performs HTTP GET operation.
## Examples

Fetch content from example.com
```shell
> fetch https://www.example.com
```

Fetch content from example.com, with username and password
```shell
> fetch -u myuser -p mypass https://www.example.com
```

Fetch content from example.com, with custom header
```shell
> fetch -H [my-header-key my-header-value] https://www.example.com
```
