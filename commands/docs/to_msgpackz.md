---
title: to msgpackz
categories: |
  formats
version: 0.106.0
formats: |
  Convert Nu values into brotli-compressed MessagePack.
usage: |
  Convert Nu values into brotli-compressed MessagePack.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `to msgpackz` for [formats](/commands/categories/formats.md)

<div class='command-title'>Convert Nu values into brotli-compressed MessagePack.</div>

## Signature

```> to msgpackz {flags} ```

## Flags

 -  `--quality, -q {int}`: Quality of brotli compression (default 3)
 -  `--window-size, -w {int}`: Window size for brotli compression (default 20)
 -  `--serialize, -s`: serialize nushell types that cannot be deserialized


## Input/output types:

| input | output |
| ----- | ------ |
| any   | binary |
## Notes
This is the format used by the plugin registry file ($nu.plugin-path).