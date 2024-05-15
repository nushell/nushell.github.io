# Filters

A primary goal of Nushell is the ability to easily handle structured data in the pipeline. Nushell contains an extensive set of commands known as "filters" designed to meet these needs.

A sample of filter commands is listed in this Guide below. For the current list of commands categorized as filters, you can run:

```nu
help commands | where category == filters
```

## Filters vs. Flow Control Statements

While it's certainly possible to modify structured data using "traditional" flow control statements like `for` or `while`, filters are usually more convenient and (often far) more performant.

For example:

- Using a `for` statement to create a list of 50,000 random numbers:

  ```nu
  timeit {
    mut randoms = []
    for _ in 1..50_000 {
      $randoms = ($randoms | append (random int))
    }
  }
  ```

  Result: 1min 4sec 191ms 135µs 90ns

- Using `each` to do the same:

  ```nu
  timeit {
    let randoms = (1..50_000 | each {random int})
  }
  ```

  Result: 19ms 314µs 205ns

- Using `each` with 10,000,000 iterations:

  ```nu
  timeit {
    let randoms = (1..10_000_000 | each {random int})
  }
  ```

  Result: 4sec 233ms 865µs 238ns

  As with many filters, the `each` statement also streams its results, meaning the next stage of the pipeline can continue processing without waiting for the results to be collected into a variable.

  For tasks which can be optimized by parallelization, `par-each` can have even more drastic performance gains.
