# Date

What it is: A value representing a specific point in time using international standard date time descriptors.

Annotation: `datetime`

Dates and times are held together in the Date value type. Date values used by the system are timezone-aware, and by default use the UTC timezone.

Dates are in three forms, based on the RFC 3339 standard:

- A date:
  - `2022-02-02`
- A date and time (in GMT):
  - `2022-02-02T14:30:00`
- A date and time with timezone:
  - `2022-02-02T14:30:00+05:00`

## Casts

The command `into datetime` can be used to convert many other data types
into dates. See: `help into datetime` for a full list of inputs.

## Commands that use datetime

Many of Nushell's builtin commands are datetime aware and output or use datetimes
for fields and expressions. For example:

- `ls`
- `where`
- `ps`
- `sys`
