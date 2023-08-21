---
title: from
categories: |
  formats
version: 0.83.2
formats: |
  Parse a string or binary data into structured data.
usage: |
  Parse a string or binary data into structured data.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from ```

## Notes
You must use one of the following subcommands. Using this command as-is will only produce this help message.

## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |


## Subcommands:

| name                                       | usage                                                                                                                      |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| [`from csv`](/commands/docs/from_csv.md)   | Parse text as .csv and create table.                                                                                       |
| [`from eml`](/commands/docs/from_eml.md)   | Parse text as .eml and create record.                                                                                      |
| [`from ics`](/commands/docs/from_ics.md)   | Parse text as .ics and create table.                                                                                       |
| [`from ini`](/commands/docs/from_ini.md)   | Parse text as .ini and create table.                                                                                       |
| [`from json`](/commands/docs/from_json.md) | Convert from json to structured data.                                                                                      |
| [`from nuon`](/commands/docs/from_nuon.md) | Convert from nuon to structured data.                                                                                      |
| [`from ods`](/commands/docs/from_ods.md)   | Parse OpenDocument Spreadsheet(.ods) data and create table.                                                                |
| [`from ssv`](/commands/docs/from_ssv.md)   | Parse text as space-separated values and create a table. The default minimum number of spaces counted as a separator is 2. |
| [`from toml`](/commands/docs/from_toml.md) | Parse text as .toml and create record.                                                                                     |
| [`from tsv`](/commands/docs/from_tsv.md)   | Parse text as .tsv and create table.                                                                                       |
| [`from url`](/commands/docs/from_url.md)   | Parse url-encoded string as a record.                                                                                      |
| [`from vcf`](/commands/docs/from_vcf.md)   | Parse text as .vcf and create table.                                                                                       |
| [`from xlsx`](/commands/docs/from_xlsx.md) | Parse binary Excel(.xlsx) data and create table.                                                                           |
| [`from xml`](/commands/docs/from_xml.md)   | Parse text as .xml and create record.                                                                                      |
| [`from yaml`](/commands/docs/from_yaml.md) | Parse text as .yaml/.yml and create table.                                                                                 |
| [`from yml`](/commands/docs/from_yml.md)   | Parse text as .yaml/.yml and create table.                                                                                 |