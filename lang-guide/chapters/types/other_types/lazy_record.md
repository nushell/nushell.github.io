# Lazy Make

---

## | **Deprecated** |

## | Lazy records have been deprecated in Nushell 0.93 and are planned for removable in 0.94 |

What it is: A type of record that invokes a closure when a field is requested.

Annotation: None.

A lazy record behaves much like a standard record, but whenever its specific columns are requested, a closure is called instead of just returning the field's value. The key is passed to the closure so it can determine what to return when that key is requested, say by the `get` command.

There is only one closure for the entire record.

There is only one way to create a lazy record by using the `lazy make` command.

## Example 1

```nu
  > let lr = lazy make --columns ["haskell", "futures", "nushell"] --get-value { |lazything| $lazything + "!" }
# Get nushell field
$lr.nushell
# => 'nushell!'
```

## How to discriminate between fields in the lazy record

That is up to you as the value of the key is passed to the closure when ever the key is requested. One way to do something different is to use a match expression in the body of the closure:

## Example 2

```nu
# Make a lazy record that performs different actions depending on the value of the key:
let lr = lazy make -c [coke pepsi juice]  -g {|drink|
  match $drink {
    'coke' => "No Coke, Pepsi",
    'pepsi' => "One Pepsi",
    _ => $"Look, we just have Pepsi, no ($drink)"
  }
}
$lr | get coke
# => 'No Coke, Pepsi'
```

## Using lazy records with cell paths

A lazy record will invoke the closure when operated on in a cell path context. The value of the result will be determined by the result of calling the closure and passing the key of the field as a parameter.

Keeping this in mind, if the closure returns some kind of Nu structured data that also participates in cell path contexts, then further parts of the cell path will continue to work.

## Example 3

```nu
# Create a lazy record that returns a different record depending on which field
# is requested:
let lr = lazy record   -c [rec1, rec2] -g {|k|
  if $k == 'rec1' {
    {type: orange, color: orange}
  } else if $k == 'rec2' {
    {type: apple, color: red}
  }
}

# Now inspect it with cell paths
$lr.rec1.type
# => orange
$lr.rec2.color
# => red
```
