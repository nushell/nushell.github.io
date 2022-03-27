---
title: Metadata
---

# Metadata

All values that flow into and out of commands in Nu are tagged with metadata. You'll see this commonly around the codebase as `Tagged<Value>`.

Though the metadata that is tracked is still in its early days, we expect to expand this as Nu matures.

Currently, there are two pieces of metadata tracked on each value:

## Anchor

Anchor represents the location that the value came from originally. If the value was loaded from a file, it will be the filename. If it was loaded from a URL, it will be the URL, and so on.

## Span

A span holds the starting and ending locations of a value that was created or referenced on the commandline. These are most commonly used in the underline beneath an error message.

While spans from programming languages traditionally also carry the file the span came from, here we assume the span always spans a value referenced on the commandline rather than in a source file. As Nu gets the ability to run its own source files, this will likely need to be revisited.
