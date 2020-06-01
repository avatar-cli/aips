# dev-0001: Conventional Commits & Automated Version Numbering

```
Author:   Andres Correa Casablanca <castarco@coderspirit.xyz>
Status:   Proposed
Created:  2020-06-01
```

## Abstract

This document proposes the introduction of an automated verification process for
commit messages and package version numbers, in combination with a system to
automatically generate version numbers using commit messages as its input data.

Automated assistants would be put in place to help developers to write commit
messages, to avoid loosing time due to rejected commits in the CI/CD pipelines.

## Motivation

The need for "proper" commit messages has been extensively
documented[¹](#conventional_commits)[²](#good_commit_msg), but two of the most
important reasons are to simplify project's history understanding, and to enable
the automatic generation of version numbers (under the model of semantic
versioning[³](#semantic_versioning)).

The need for a verification process for commit messages stems from the fact that
developers tend to disregard this aspect of the development process (even if
they care, they can easily make mistakes), and forcing reviewers to manually
check commit messages could be too time consuming.

Commit messages verification can cause a lot of trouble to some developers, and
make them disguise the whole process as a stopper. Because of that, using
automated assistants to write commits is a requirement, the whole development
process must feel smooth and simple.

The benefits of automatic version numbers generation are:
  - Consistency between git log and version numbers (zero surprises)
  - It makes impossible to make mistakes (except if the commit messages don't
    reflect the reality of the applied changes), or to follow arbitrary reasons
    when deciding which is the next version number.
  - It scales well when the number of developers increases, there's no need to
    manually review all the commits in a release to decide which kind of version
    bump we have to apply.

## Specification

### Commit message rules

The commit messages MUST conform to the "Conventional Commits"
specification[¹](#conventional_commits).

### Commit message hooks

- The `prepare-commit-msg` git hook MUST be used by the "assistant" to generate
  a commit message that follows the Conventional Commits specification.
- The `commit-msg` git hook SHOULD be used to check some commit message
  properties after it's generated (in case the assistant is not smart enough)
- The `post-commit` git hook MUST be used to amend the previous commit bumping
  its version in case it was not done when needed.
- The `pre-commit` git hook SHOULD be used to bump the version of the current
  commit in case it has enough information to infer that it's needed. This git
  hook will rarely be useful, but it's an extra safe-guard.
- The `pre-push` git hook MUST be used to run the same commit messages & version
  verification that will be performed in the CI/CD pipelines.

### Execution flow

Premise: all development will be performed in branches.

When commiting, the git hook scripts will:
1. look for the common ancestor (git commit) between the current branch and
   master.
2. Check the version specified in `package.json` and/or `Cargo.toml` for that
   given commit.
3. Iterate over all the commit messages from that common ancestor until the
   current commit, and compute the "desired" version number
   (`computeVersion(oldVersion, commitMessages) -> newVersion`)
4. Compare the "desired" version number to what we have in our current
   `package.json` and/or `Cargo.toml` files. If they differ, modify those files
   and add the changes to the current commit.

In the CI/CD pipelines, the scripts will repeat the steps 1, 2, 3, and mark the
build as invalid in the fourth step if the specified version differs from the
"desired" one.

### Chosen technologies

The chosen technology stack is NodeJS, Typescript, Husky, Commitizen and
Commitlint.

## Rationale

Many scripting languages were considered to implement the commit messages
verification and the automated version numbering: Bash, Python, Javascript and
Typescript (other languages were discarded upfront: Perl and Ruby, due to syntax
obscurity, how packages are managed, and lack of expertise).

- Bash was discarded for three reasons: static analysis tools for Bash are of
  low quality, there are no libraries for almost anything, and there is no clean
  way to manage those libraries (no package manager, or anything similar).
- Python was discarded because of its terrible package management ecosystem.
  There's no need to elaborate, but in almost 30 years they didn't manage to
  elaborate a good solution for that, and their community still does not
  understand how bad it is compared to other platforms (even the unfairly
  mistreated PHP is better on that).
- Plain Javascript was discarded because how difficult it is to apply static
  analysis on javascript files.

Because of its own nature, it is much easier to check for mistakes in Typescript
code than in Bash or Javascript.

We chose Typescript because it is interoperable with NodeJS, NPM and Javascript,
and of course with Husky, Commitizen and Commitlint (the tools we use to
implement git hooks and verify commit messages respectively).

Respect to Husky, Commitizen and Commitlint, although there are similar tools
out there for other languages, there is nothing at the same level (features,
ease of integration, interoperability between them).

## Reference implementation

The current AIP has been implemented twice:
  - For the `avatar-cli` repository.
  - For the `aips` repository (this one).

## Adoption considerations

As for all other design documents we consider real-world adoption as criteria
when to move the status of AIP dev-0001 from `Proposed` to `Final`. If at least
one merge request has been merged from outside the initial core team, we will
consider the process to be adopted and change the status of AIP dev-0001 to
`Final`.

## Notes:

1. <a name="conventional_commits"></a>[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
2. <a name="good_commit_msg"></a>[How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
3. <a name="semantic_versioning"></a>[Semantic Versioning](https://semver.org/)

## Copyright

This document and all its auxiliary files are dual-licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and
[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).
