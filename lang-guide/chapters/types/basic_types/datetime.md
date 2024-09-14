# Datetime

<!-- prettier-ignore -->
|     |     |
| --- | --- |
| **_Description:_**    | Represents a specific point in time using international standard date time descriptors 
| **_Annotation:_**     | `datetime`                                                                                 
| **_Literal syntax:_** | RFC 3339                                                                               
|                       | Date-only: `2022-02-02`                                                                
|                       | Date and time (GMT): `2022-02-02T14:30:00`                                             
|                       | Date and time including timezone offset: `2022-02-02T14:30:00+05:00`                   
| **_Casts:_**          | [`into datetime`](/commands/docs/into_datetime.md)                                     
| **_See also:_**       | [Types of Data - Dates](/book/types_of_data.md#dates)

## Additional language notes

- Dates and times are held together in the `datetime` type. Date values used by the system are timezone-aware. By default, dates use the UTC timezone.

## Common commands that can be used with `datetime`

Many of Nushell's builtin commands are datetime aware and output or use `datetime` values
for fields and expressions. For example:

- `date` and its subcommands
- `format date`
- `ls`
- `ps`
- `sys`
