# arch-0000: Rust as main development language

```
Author:   Andres Correa Casablanca <castarco@coderspirit.xyz>
Status:   Draft
Created:  2020-06-01
```

## Abstract

This document proposes to use Rust as the main language for the Avatar CLI
development.

## Motivation

Using Rust allows to easily generate lightweight statically-linked single
binaries that are very easy to distribute, while ensuring type and memory
safety.

These properties are critical to fullfill the goals of the Avatar CLI project,
as having a minimal set of runtime dependencies enables developers to bootstrap
projects' development in just a couple of steps with Avatar CLI.

## Specification

Avatar CLI MUST be compiled as a single binary using a Rust compiler. The
generated binary must be able to run without relying on any extra dependency,
except for `git` and `docker` (or another OCI runtime, like `podman`).

Given the nature of compiled source, different binaries SHOULD be generated for
different platforms.

## Rationale

Before choosing Rust as the main language for the project, other technologies
were considered:

  - Bash (and POSIX shell):
    - "New" Bash versions are not natively supported by Mac OS X, they must be
      installed through `brew`.
    - Although possible, it is complicated to generate a single binary.
    - It's syntax presents many problems, and it is difficult to verify if the
      code is correct or not through automatic mechanisms.
    - There are not enough good libraries, POSIX shell & Bash developers usually
      externalize a big part of the scripts' logic to external programs.
  - Python:
    - Its package management ecosystem sucks.
    - It is very difficult to generate single binaries, and even after achieving
      that goal, these binaries usually depend on an external interpreter.
    - Depending on an external interpreter has several disadvantages, first, the
      interpreter could not be there, second, the interpreter version could be
      not compatible with the Avatar CLI binary's code.
    - In case the Python interpreter was bundled inside the binary, this would
      imply having a gigantic binary.
    - Given the nature of bundled Python binaries and how their content is
      extracted before being executed, this opens the door for subtle but very
      problematic security issues.
  - Javascript/Typescript:
    - It suffers similar problems to the ones that Python presents (except for
      the package management, which is of acceptable quality).
  - C++:
    - (Compared to Rust) it does not offer enough type safety.
    - Dependencies management is far from trivial (compared to the state of the
      art for many other languages).
    - Tooling is far from being simple.

Rust, compared with the previously mentioned languages, offer some advantages:
  - It is very easy to generate a single binary (per platform).
  - Dependencies management is trivial, and most of them are resolved at compile
    time.
  - Rust tooling is very good, and improving over time at a very good pace.
  - Its type & memory safety guarantees are a very good property for a tool like
    Avatar CLI, that could be used in tasks where security is critical.
  - It interfaces with C pretty nicely, this is a very good property for systems
    programming.

## Reference implementation

The Avatar CLI implementation (not present yet).

## Adoption considerations

Once Avatar CLI is able to perform a minimal set of useful tasks, we will
consider that this AIP has been adopted and move the status of AIP arch-0000
from `Proposed` to `Final`.

## Copyright

This document and all its auxiliary files are dual-licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and
[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).
