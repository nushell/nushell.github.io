# Date

<!-- prettier-ignore -->
|     |     |
| --- | --- |
| **_Description:_**    | Represents a specific point in time using international standard date time descriptors 
| **_Annotation:_**     | `date`                                                                                 
| **_Literal syntax:_** | RFC 3339                                                                               
|                       | Date-only: `2022-02-02`                                                                
|                       | Date and time (GMT): `2022-02-02T14:30:00`                                             
|                       | Date and time including timezone offset: `2022-02-02T14:30:00+05:00`                   
| **_Casts:_**          | [`into datetime`](/commands/docs/into_datetime.md)                                     
| **_See also:_**       | [Types of Data - Dates](/book/types_of_data.md#dates)

## Additional language notes

- Dates and times are held together in the `date` type. Date values used by the system are timezone-aware. By default, dates use the UTC timezone.

## Common commands that can be used with `date`

Many of Nushell's builtin commands are datetime aware and output or use `date` values
for fields and expressions. For example:

- `ls`
- `where`
- `ps`
- `sys`
