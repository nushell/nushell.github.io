---
title: config set_into
layout: command
nu_version: 0.32
---
Sets a value in the config

## Usage
```shell
> config set_into <set_into> {flags} 
 ```

## Parameters
* `<set_into>` sets a variable from values in the pipeline

## Flags
* -h, --help: Display this help message

## Examples
  Store the contents of the pipeline as a path
```shell
> echo ['/usr/bin' '/bin'] | config set_into path
 ```

