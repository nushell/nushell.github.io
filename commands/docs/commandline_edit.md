---
title: commandline edit
categories: |
  core
version: 0.106.0
core: |
  Modify the current command line input buffer.
usage: |
  Modify the current command line input buffer.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `commandline edit` for [core](/commands/categories/core.md)

<div class='command-title'>Modify the current command line input buffer.</div>

## Signature

```> commandline edit {flags} (str)```

## Flags

 -  `--append, -a`: appends the string to the end of the buffer
 -  `--insert, -i`: inserts the string into the buffer at the cursor position
 -  `--replace, -r`: replaces the current contents of the buffer (default)

## Parameters

 -  `str`: The string to perform the operation with.


## Input/output types:

| input   | output  |
| ------- | ------- |
| nothing | nothing |