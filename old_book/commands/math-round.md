---
title: math round
layout: command
nu_version: 0.32
---
Applies the round function to a list of numbers

## Usage
```shell
> math round {flags} 
 ```

## Flags
* -h, --help: Display this help message
* -p, --precision <number>: digits of precision

## Examples
  Apply the round function to a list of numbers
```shell
> echo [1.5 2.3 -3.1] | math round
 ```

  Apply the round function with precision specified
```shell
> echo [1.555 2.333 -3.111] | math round -p 2
 ```

