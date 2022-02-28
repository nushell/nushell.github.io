---
title: path type
layout: command
nu_version: 0.32
---
Get the type of the object a path refers to (e.g., file, dir, symlink)

## Usage
```shell
> path type ...args {flags} 
 ```

## Parameters
* ...args: Optionally operate by column path

## Flags
* -h, --help: Display this help message

## Examples
  Show type of a filepath
```shell
> echo '.' | path type
 ```

