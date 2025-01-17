# Loop

In this example, we use for loops and while loops to iterate over an array.

## For Loop Expression

The for loop is analogous to a C-style for loop:

```
for init; condition; increment {
    // loop body
}
```

The loop initializes the variables in the `init` part before it starts. When the loop starts, it tests the `condition` and executes the loop body if the `condition` is true. After that, it runs the `increment` expression and repeats the process until the condition is false.

In MoonBit, the for loop is more expressive than the C-style for loop. We will
explain it in the following chapters.

## While Loop Expression

The while loop is also similar to the C-style while loop.

It tests the condition before executing the loop body. If the condition is true,
it executes the loop body and repeats the process until the condition is false.

MoonBit also supports both `continue` and `break` statements within the loop.
