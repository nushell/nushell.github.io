# Scripts

In Nushell, you can write and run scripts in the Nushell language. To run a script, you pass it as an argument to the `nu` commandline application.

```
> nu myscript.nu
```

This will run the script to completion.

Let's look at an example script file:

```
# myscript.nu
def greet [name] {
  echo "hello" $name
}

greet "world"
```

A script file defines the definitions for custom commands as well as the main script itself, which will run after the custom commands are defined.

In the above, first `greet` is defined by the Nushell interpreter. This allows us to later call this definition. We could have written the above as:

```
greet "world"

def greet [name] {
  echo "hello" $name
}
```

There is no requirement that definitions have to come before the parts of the script that call the definitions, allowing you to put them where you feel comfortable.

### How scripts are processed

In a script, definitions run first. This allows us to call the definitions using the calls in the script.

After the definitions run, we start at the top of the script file and run each group of commands one after another.

### Script lines

To better understand how Nushell sees lines of code, let's take a look at an example script:

```
a
b; c | d
```

When this script is run, Nushell will first run the `a` command to completion and view its results. Next, Nushell will run `b; c | d` following the rules in the "Command groups" section.
