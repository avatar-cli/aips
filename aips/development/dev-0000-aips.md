# dev-0000: Avatar-CLI Improvement Proposal (AIP) Process

```
Author:   Andres Correa Casablanca <castarco@coderspirit.xyz>
Status:   Draft
Created:  2020-05-31
```

## Abstract

An Avatar-CLI Improvement Proposal (AIP) is a design document providing
information to the Avatar-CLI community, or describing a new feature for
Avatar-CLI or its processes or environment. The AIP should provide a concise
technical specification of the feature and a rationale for the feature.

We intend AIPs to be the primary mechanisms for proposing new features, for
collecting community input on an issue, and for documenting the design decisions
that have gone into Avatar-CLI. The AIP author is responsible for building
consensus within the community and documenting dissenting opinions.

Because the AIPs are maintained as text files in a versioned repository, their
revision history is the historical record of the feature proposal.

This document defines the process for creating, discussing, and approving AIPs.


## Motivation

There needs to be a process and format to have design discussions and decisions
about Avatar-CLI features and architecture. These designs affect implementations
so they need a structured process which supports an effective discussion and
clearly communicates results.


## Specification

### Document format

The document MUST be saved in Markdown and MUST use a naming convention as:
`[dev|feat|arch]-xxxx-short-title.md`, where `xxxx` is the number of the AIP
left-padded with zeroes.

Requirements MUST be indicated as described in
[RFC2119](https://www.ietf.org/rfc/rfc2119.txt).

You can use the template [dev-0000-aips.md](dev-0000-aips.md) as a starting
point which already is formatted in the correct way.

#### Sections

Every AIP document MUST contain the following sections.

##### Title

A concise title of the AIP. The title should contain the AIP number.
Example: `# dev-0000: Avatar-CLI Improvement Proposal (AIP) Process`.

##### Preamble

Headers containing metadata about the AIP. The header block MUST be enclosed in
triple backticks to mark it up as code block. You can use this AIP as an
example.

The preamble has the following fields:

* `Author`: Name and email address of author of the AIP in the format `Jane
  Smith <jsmith@example.com>`
* `Co-Author`: Name and email address of additional authors of the UIP in the
  same format as in `Author` (field can occur multiple times)
* `Status:` One of [`Draft`, `Deferred`, `Withdrawn`, `Proposed`, `Rejected`,
  `Final`, `Replaced`, or `Obsolete`] (definition of the status values is
  defined in section [AIP Life Cycle](#aip-life-cycle))
* `Created:` Creation date in the format YYYY-mm-dd
* `Superseded:` When the AIP was considered to be replaced by another AIP, in
  the format YYYY-mm-dd
* `Superseded-by:` Number of the AIP which supersedes this AIP
* `Supersedes:` Any other AIPs this AIP supersedes

`Author`, `Status` and `Created` MUST be present in all AIPs.

`Co-Author` fields MAY be added to attribute the content of an AIP to multiple
authors. The author from the `Author` field is the prime responsible person in
terms of the AIP process, though.

`Superseded` and `Superseded-by` MUST be added when AIP has status `Replaced`.
`Supersedes` MUST be added if the AIP invalidates any other AIPs.

##### Abstract

A short (~200 word) description of the technical issue being addressed.

##### Motivation

The motivation is critical for AIPs that want to change the Avatar-CLI
interface. It should clearly explain why the existing interface is inadequate to
address the problem that the AIP solves.

##### Specification

The technical specification should describe the syntax and semantics of any new
feature. The specification should be detailed enough to allow competing,
interoperable implementations of Avatar-CLI alternatives.

##### Rationale

The rationale fleshes out the specification by describing what motivated the
design and why particular design decisions were made. It should describe
alternate designs that were considered and related work. The rationale should
provide evidence of consensus within the community and discuss important
objections or concerns raised during discussion.

##### Backwards compatibility

All AIPs that introduce backwards incompatibilities MUST include a section
describing these incompatibilities and their severity. The AIP MUST explain how
the author proposes to deal with these incompatibilities.

##### Reference implementation

A proposal MUST have a reference implementation before it can move from
`Draft` to `Proposed`. The terms "reference implementation" and
"proof-of-concept" can be used interchangeably here. The point is that the idea
has gone through a phase of implementation so that it is a tested idea, and
issues which only can be found when actually trying to implement it have been
found and addressed.

It is better to finish the specification and rationale first and reach consensus
on it before writing code, though.

To go from `Proposed` to `Final` there MUST be a full, released implementation.
That's the prerequisite for getting real-world adoption. The final
implementation MUST include test code and documentation.

##### Copyright

All AIPs MUST be dual-licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and
[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

#### Optional sections

If the AIP is updated through a pull request in a non-trivial way all changes in
comparison to the original version SHOULD be kept in a `Changelog` section.

Other sections MAY be added to provide additional context or clarity.

#### Auxiliary files

AIPs MAY include auxiliary files such as diagrams. Auxiliary files should be
included in a subdirectory for that AIP which MUST be named `files/aip-XXXX`
where "XXXX" is the AIP number.

### Process

We MUST host all the AIPs documents on Gitlab and use the pull request feature
to add new documents, this will allow to add comments and keep track of them.

For each new AIP create then a new branch with the UIP reference number and
create a pull request with master. The pull request is then the place to comment
before accepting the AIP as `Draft`.

The AIP document is updated through subsequent pull requests. This includes in
particular changes to the status of the AIP. The `Status` field in the preamble
of the document MUST reflect those changes. Discussion about acceptance of
status changes happens in the pull requests. The definition of the status and
its transitions is defined in the [AIP life cycle](#aip-life-cycle) section.

In the case of a new AIP superseding a document, the pull request for the new
AIP MUST also take care of changing the status of the document to be superseded.

#### AIP life cycle

The author is responsible for driving the AIP and establishing [rough
consensus](https://tools.ietf.org/html/rfc7282) about the proposal. The status
of the AIP reflects the different states the proposal goes through during this
process. The status MUST be recorded in the `Status` field of the preamble of
the document.

The typical paths of the status of AIPs are as follows:

![process](files/aip-0000/process.png)

New AIPs are submitted as `Draft`. This is the state where the discussion about
acceptance of the proposal is happening and the proposal might be changed to
incorporate feedback from the discussion.

Authors of a AIP may decide on their own to change the status from `Draft` to
`Withdrawn` if they retract their proposal and won't pursue it further.

Authors of a AIP may decide on their own to change the status from `Draft` to
`Deferred` if they postpone the proposal but intend to pick it up at a later
point in time.

A AIP may only change status from `Draft` to `Proposed`, when the author deems
it is complete, has a working implementation (where applicable), and has
community plans to progress it to the `Final` status.

AIPs in the `Proposed` status serve as design specification for implementations.
Implementations SHOULD note which AIPs they support.

AIPs should be changed from `Draft` or `Proposed` status to `Rejected` status,
upon request by any person, if they have not made progress in three years. Such
a AIP may be changed to `Draft` status if the author provides revisions that
meaningfully address public criticism of the proposal, or to `Proposed` status
if it meets the criteria required as described in the previous paragraphs.

A `Proposed` AIP may progress to `Final` only when specific criteria reflecting
real-world adoption have occurred. This is different for each AIP depending on
the nature of its proposed changes. Evaluation of this status change should be
objectively verifiable, and/or be discussed by the community. The AIP SHOULD
include a definition of the criteria.

When a `Final` AIP is no longer relevant, its status may be changed to
`Replaced` or `Obsolete`. If it is replaced by another AIP the status should be
changed to `Replaced` and the AIPs which supersede it MUST be noted in the
preamble. If the AIP does not apply anymore and there is no successor AIP the
state should be changed to `Obsolete`. These changes must also be objectively
verifiable and/or discussed.


## Rationale

The AIP process is an evolution of the ADR process used for recording decisions
by the Avatar-CLI community. While the ADR is adequate for decisions on the code
or process level and is providing an immutable record of decisions for later
reference, the AIP process addresses design decisions on the architecture and
feature-space level. They also serve as a specification and are mutable
documents reflecting the evolution of a design.

The process is inspired by the
[UIP process](https://github.com/dtr-org/uips/blob/master/UIP-0001.md), which is
inspired by the
[BIP process](https://github.com/bitcoin/bips/blob/master/bip-0002.mediawiki),
which is based on the [PEP process](https://www.python.org/dev/peps/pep-0001/).
Other similar processes are the
[EIP process](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1.md) and
the [Rust RFC process](https://github.com/rust-lang/rfcs). They all are inspired
by the [IETF RFC process](https://www.ietf.org/standards/process/).

Following a similar process as other communities should make it easier to
understand and follow the process. It also builds on the insight others have
gathered over time.


## Reference implementation

AIP dev-0000 can be seen as the reference implementation for the process.

We will use this as criteria for moving the status from AIP dev-0000 from
`Draft` to `Proposed`. Once we have moved the existing design documents and have
exercised the process by writing a new AIP and we have incorporated necessary
changes we will consider the reference implementation to be done and move to the
`Proposed` status.


## Adoption considerations

As for all other design documents we consider real-world adoption as criteria
when to move the status of AIP dev-0000 from `Proposed` to `Final`. If at least
one AIP submitted from outside of the initial core team has moved to `Proposed`
and at least one AIP has moved to `Final` we will consider the process to be
adopted and change the status of AIP dev-0000 to `Final`.


## Copyright

This document and all its auxiliary files are dual-licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and
[GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).
