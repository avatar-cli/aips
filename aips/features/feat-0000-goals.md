# feat-0000: Avatar-CLI Basic Goals

```
Author:   Andres Correa Casablanca <castarco@coderspirit.xyz>
Status:   Draft
Created:  2020-06-12
```

## Abstract

Here we present an initial description of Avatar-CLI, a command line tool
designed to run containerized programs as if they were "native" to the host.

The main goals of Avatar-CLI are:
- Allowing version pinning for arbitrary command line tools, not just libraries
  and language runtimes.
- Isolating the development environment from the host and other development
  environments, making easier to use different tool versions in each project.
- Speeding up the onboarding process of new developers into software projects.
- Taking care of common problems caused by containerized tools:
  - File permissions
  - SSH Credentials
  - Package manager caches
  - Distinguishing between interactive and non-interactive mode
  - Interactions between different containerized applications

The secondary goals (as they serve the main ones) of Avatar-CLI are:
- Being multi-platform.
- Being easy to distribute, install and use.
- Having minimal external dependencies.
- Having low overhead.

## Motivation

The current alternatives to manage tools version pinning are too specialized for
concrete technologies, each one of them works in a different way, and we might
need many of them working at the same time for a given project. Also, not all
these tools are well designed to work on a per-project basis, their scope is
usually the user's environment.

Some of them are:
- [`nvm`](https://github.com/nvm-sh/nvm),
- [`nodenev`](https://ekalinin.github.io/nodeenv/),
- [`pyenv`](https://github.com/pyenv/pyenv),
- [`rbenv`](https://github.com/rbenv/rbenv),
- [`goenv`](https://github.com/syndbg/goenv),


The [`asdf-vm`](https://asdf-vm.com) tool deserves special mention, as it tries
to go one step further and unify the management of several tools at the same
time, but failing to do so on a per-project basis.

Visual Studio Code also provides a feature to
[develop inside a container](https://code.visualstudio.com/docs/remote/containers),
taking care of file permissions issues, but its setup is convoluted, fairly
unflexible and tedious to share among the team.

The tool that (at the time of writing this document) provides a closer
experience to what Avatar-CLI aims to achieve is
[Dojo](https://github.com/kudulab/dojo), although it choses a slightly different
set of trade-offs (like imposing more requirements on the used OCI images).

Overall, there is still a niche to be covered in order to improve developers'
productivity, and Avatar CLI will try to fill it.

## Specification

The name for the Avatar-CLI binary will be `avatar`.

### `avatar` subcommands:

Here there's a simplified list of the subcommands that Avatar-CLI MUST provide,
each one of them will have one or more associated AIP documents.

- `avatar init`:\
  This command transforms the current directory into an "Avatar-CLI" project, by
  generating all the needed boilerplate files and symlinks, that will be placed
  in the `.avatar-cli` subdirectory.

- `avatar install`:\
  For a newly cloned repository, it takes the versioned information stored in
  the `.avatar-cli` subdirectory and takes care of pulling the necessary OCI
  images and generating configuration files that are user-specific.\
  \
  This subcommand won't be necessary, as its behaviour will be implicitly
  triggered when needed by other subcommands. It is exposed just to cover usage
  corner cases.

- `avatar add`:\
  Without extra arguments, it starts in interactive mode, and asks the user for
  a list of details (mainly the OCI image name) in order to add new tools to the
  environment.

- `avatar shell`:\
  When used inside a directory configured as an Avatar-CLI project, it takes
  care of setting certain environment variables and adding to the current
  `$PATH` the tools managed by Avatar-CLI.

- `avatar run [tool_name] [tool_params]`:\
  It will allow to execute any of the managed tools without having to enter into
  an Avatar-CLI shell session. Internally, it will work in a very similar way to
  how the managed tools are exposed to the user through the shell session.

### `.avatar-cli` directory

- All files in `.avatar-cli`, except for the `volatile` directory, MUST be
  tracked by the version control system (probably Git).

- The `volatile` subdirectory will contain symlinks, caches and metadata needed
  for the correct operation of Avatar-CLI.

- The only file that should be manually modified is `avatar-cli.yml`, other
  files will be automatically generated (like `avatar-cli.lock.yml`).

### Expected workflow

- Assuming the project is already configured:
  ```bash
  cd /project/dir

  # The first time this command is executed, it might take some extra time,
  # because it will implicitly trigger `avatar install`.
  avatar shell

  # The tools managed through Avatar-CLI are now available, one example could be
  # NodeJS and NPM:

  # Equivalent to `avatar run npm install` outside the subshell
  npm install
  # Equivalent to `avatar run npm test` outside the subshell
  npm test

  # `avatar shell` creates a subshell, to exit it, just do as you would do wit
  # any other shell:
  exit
  ```

- Preparing the project:
  ```bash
  cd /project/dir
  avatar init

  # This starts an interactive cli wizard asking for the OCI image that will be
  # "installed" in the environment to allow developers to use its packed tools
  # through Avatar-CLI
  avatar add

  # Depending on whether Avatar-CLI has enough information or not on how to
  # manage the passed image name, it will work without or with interacting with
  # the user.
  avatar add node:14-slim

  # Alternatively, the developer can manually modify the file
  # .avatar-cli/avatar-cli.yml
  ```

### The symlink trick

Avatar-CLI will create one or many symlinks for each "installed" OCI image, each
symlink corresponding to a specific cli tool, and all of them pointing to the
same `avatar` binary.

`avatar` will use the symlink name, plus other auto-generated metadata to decide
which OCI image has to be used to run the tool container, and how to configure
such container.

This "trick" has been used extensively in the past, one notable example is
Ubuntu Snap, which inspired the idea for Avatar CLI.

## Rationale

As mentioned in the [motivation](#motivation) section, other tools have been
considered, and deemed insuficient to boost developers' productivity.

The listed subcommands offer a minimal interface to achieve the exposed goals.

The idea behind `avatar shell` has been put in practice many times before by
other projects, one well known example is `pipenv shell`, for Python virtual
environments.

Placing all the Avatar CLI related files into one single directory
(`.avatar-cli`) is a conscious decision to avoid having "overcrowded" project
directories.

## Reference implementation

There is no reference implementation yet.


## Adoption considerations

Once the code that allows `avatar` to execute the subcommands `init`, `install`,
`add`, `shell` and `run` (plus the ability to use the "symlink trick") reaches
the `master` branch, this AIP will transition to the "Proposed" state.

This AIP will transition to the "Final" state once Avatar CLI reaches
version 1.0.

## Copyright

This document and all its auxiliary files are dual-licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and
[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).
