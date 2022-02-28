---
title: autoenv trust
layout: command
nu_version: 0.32
---
Trust a .nu-env file in the current or given directory

## Usage
```shell
> autoenv trust (dir) {flags} 
 ```

## Parameters
* `(dir)` Directory to allow

## Flags
* -h, --help: Display this help message

## Examples
  Allow .nu-env file in current directory
```shell
> autoenv trust
 ```

  Allow .nu-env file in directory foo
```shell
> autoenv trust foo
 ```

