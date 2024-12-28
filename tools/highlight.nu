const DELIMITER = "BEGIN EXAMPLE"

def main [] {
  let source = $in
  let highlighted = $source | nu-highlight
  if $DELIMITER in $source {
    $highlighted
    | lines
    | skip while {|line| "BEGIN EXAMPLE" not-in $line}
    | skip 1 # skip example line itself
    | to text
  } else {
    $highlighted
  }
}
