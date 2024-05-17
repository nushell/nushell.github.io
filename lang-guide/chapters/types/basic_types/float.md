# Float

What it is: Real numeric values using floating point internal arithmetic.

Annotation: `float`

Internally IEEE-754 floats with 64 bit precision.

Literals with a fractional decimal component are evaluated as `Float`: `0.1`, `3.14159`, `-10.4`

TBD: semantics for comparison, NaN/InF. Future hashing.

## Casts

The command `into float` can be used to convert other data types into floats.
See the command: `help into float` fro a complete list of input data types.
