---
title: url host
layout: command
nu_version: 0.32
---
gets the host of a url

## Usage
```shell
> url host ...args {flags} 
 ```

## Parameters
* ...args: optionally operate by column path

## Flags
* -h, --help: Display this help message

## Examples
  Get host of a url
```shell
> echo 'http://www.example.com/foo/bar' | url host
 ```

