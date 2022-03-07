# Math

Sometimes, you just need to add a few numbers when you're working on a task.  Nu offers a set of basic math operations that you can use. Math expressions are available wherever you can call a command.

## Add, Subtract, Multiply, Divide

```
> 1 + 3
4
```

In Nu, you can do the usual add, subtract, multiply and divide with the operators `+`, `-`, `*`, and `/` respectively.  Operator precedence is respected, so `1 + 2 * 3` will be treated as `1 + (2 * 3)`.  Which leads us to another concept: parentheses.

## Parentheses

You can use parentheses to group math expression in math mode. This allows you to write `(1 + 2) * 3` if you want the addition to have higher precedence.

## `in` and `not-in`

You can check if a value is in a set of values or not using the `in` and `not-in` operators.

```
> 1 in [1 2 3]
true
```

```
> 1 not-in [1 2 3]
false
```

## =~ and !~

You can check to see if a string is inside of another string, or not inside of another string, using `=~` and `!~`.

```
> "foobar" =~ "foo"
true
```

```
> "foobar" !~ "baz"
true
```

## Comparisons

The following comparisons are also available:

* `<` - less than
* `<=` - less than or equal to
* `>` - greater than
* `>=` - greater than or equal to
* `==` - equal to
* `!=` - not equal to

## Compound operators

Nushell also supports `&&` and `||` to join two operations that return boolean values, using 'and' and 'or' respectively.  For example: `ls | where name in ["one" "two" "three"] && size > 10kb`

## Order of operations

Math operations are evaluated in the follow order (from highest precedence to lowest):

* Parentheses (`()`)
* Multiply (`*`) and Divide (`/`) and Power (`**`)
* Add (`+`) and Subtract (`-`)

```
> 3 * (1 + 2)
9
```
