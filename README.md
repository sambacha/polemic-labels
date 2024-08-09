<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Polemic Labels](#polemic-labels)
  - [Color Sets](#color-sets)
  - [Prefix Labels](#prefix-labels)
  - [Reserved Labels](#reserved-labels)
  - [Examples](#examples)

<!-- TOC end -->

<!-- TOC --><a name="polemic-labels"></a>

# Polemic Labels

<!-- TOC --><a name="color-sets"></a>

## Color Sets

| **Color Name** | **Shade 1** | **Shade 2** | **Shade 3** | **Shade 4** | **Shade 5** | **Shade 6** |
| -------------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| **Gray**       | #f6f6f6     | #e2e2e2     | #8b8b8b     | #6f6f6f     | #3e3e3e     | #222222     |
| **Rose**       | #fff7f9     | #ffdce5     | #ff3b8d     | #db0072     | #800040     | #4c0023     |
| **Raspberry**  | #fff8f8     | #ffdddf     | #ff426c     | #de0051     | #82002c     | #510018     |
| **Red**        | #fff8f6     | #ffddd8     | #ff4647     | #e0002b     | #830014     | #530003     |
| **Orange**     | #fff8f5     | #ffded1     | #fd4d00     | #cd3c00     | #752100     | #401600     |
| **Cinnamon**   | #fff8f3     | #ffdfc6     | #d57300     | #ac5c00     | #633300     | #371d00     |
| **Amber**      | #fff8ef     | #ffe0b2     | #b98300     | #926700     | #523800     | #302100     |
| **Yellow**     | #fff9e5     | #ffe53e     | #9c8b00     | #7d6f00     | #463d00     | #292300     |
| **Lime**       | #f7ffac     | #d5f200     | #819300     | #677600     | #394100     | #222600     |
| **Chartreuse** | #e5ffc3     | #98fb00     | #5c9b00     | #497c00     | #264500     | #182600     |
| **Green**      | #e0ffd9     | #72ff6c     | #00a21f     | #008217     | #004908     | #062800     |
| **Emerald**    | #dcffe6     | #5dffa2     | #00a05a     | #008147     | #004825     | #002812     |
| **Aquamarine** | #daffef     | #42ffc6     | #009f78     | #007f5f     | #004734     | #00281b     |
| **Teal**       | #d7fff7     | #00ffe4     | #009e8c     | #007c6e     | #00443c     | #002722     |
| **Cyan**       | #c4fffe     | #00fafb     | #00999a     | #007a7b     | #004344     | #002525     |
| **Powder**     | #dafaff     | #8df0ff     | #0098a9     | #007987     | #004048     | #002227     |
| **Sky**        | #e3f7ff     | #aee9ff     | #0094b4     | #007590     | #00404f     | #001f28     |
| **Cerulean**   | #e8f6ff     | #b9e3ff     | #0092c5     | #00749d     | #003c54     | #001d2a     |
| **Azure**      | #e8f2ff     | #c6e0ff     | #008fdb     | #0071af     | #003b5e     | #001c30     |
| **Blue**       | #f0f4ff     | #d4e0ff     | #0089fc     | #006dca     | #00386d     | #001a39     |
| **Indigo**     | #f3f3ff     | #deddff     | #657eff     | #0061fc     | #00328a     | #001649     |
| **Violet**     | #f7f1ff     | #e8daff     | #9b70ff     | #794aff     | #2d0fbf     | #0b0074     |
| **Purple**     | #fdf4ff     | #f7d9ff     | #d150ff     | #b01fe3     | #660087     | #3a004f     |
| **Magenta**    | #fff3fc     | #ffd7f6     | #f911e0     | #ca00b6     | #740068     | #44003c     |
| **Pink**       | #fff7fb     | #ffdcec     | #ff2fb2     | #d2008f     | #790051     | #4b0030     |

<!-- TOC --><a name="prefix-labels"></a>

## Prefix Labels

| Prefix   | Description               | Values                                                        |
| -------- | ------------------------- | ------------------------------------------------------------- |
| Effort   | Fibonacci scale of effort | 1, 2, 3, 5, 8, 13                                             |
| Priority | Task urgency              | now, 2day, soon                                               |
| State    | Decision status           | approved, blocked, inactive, pending                          |
| Type     | Category of task          | bug, chore, discussion, docs, feature, fix, security, testing |
| Work     | Nature of work complexity | chaotic, complex, complicated, obvious                        |

<!-- TOC --><a name="reserved-labels"></a>

## Reserved Labels

| Label Name | Description                             | Reserved | Key:Value Pairings      |
| ---------- | --------------------------------------- | -------- | ----------------------- |
| Assignee   | The person assigned to the task         | Yes      | "user": "username"      |
| Cycle      | The current iteration cycle             | No       | "sprint": "Sprint 1"    |
| Effort     | The amount of work required             | No       | "points": "5"           |
| Estimate   | The estimated time to complete the task | No       | "hours": "3"            |
| Hours      | Actual hours spent on the task          | No       | "logged": "2.5"         |
| Priority   | The task priority level                 | Yes      | "level": "High"         |
| Project    | The project to which the task belongs   | Yes      | "name": "Project Alpha" |
| State      | The current state of the task           | Yes      | "status": "In Progress" |
| Status     | The overall task status                 | Yes      | "state": "Open"         |

<!-- TOC --><a name="examples"></a>

## Examples

| Name              | Color  | Description                                                                             | Aliases                                                                                                                     |
| ----------------- | ------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| breaking          | d73a4a | Introduces a breaking change.                                                           | breaking change, breaking-change, Type: Breaking Change, type: breaking                                                     |
| effort: 1         | 91ca55 |                                                                                         |                                                                                                                             |
| effort: 2         | c2e2a2 |                                                                                         |                                                                                                                             |
| effort: 3         | e9f4dc |                                                                                         |                                                                                                                             |
| effort: 5         | fef6d7 |                                                                                         |                                                                                                                             |
| effort: 8         | fef2c0 |                                                                                         |                                                                                                                             |
| effort: 13        | fbca04 |                                                                                         |                                                                                                                             |
| good first issue  | 7057ff | Good for newcomers.                                                                     | beginner-friendly, beginner, good for beginner, Good for beginners, good-starter-issue, starter, status: good starter issue |
| help              | 0e8a16 |                                                                                         | help wanted, Patch Welcome, status: help wanted, Status: PR Welcome, Status: Ready for PR                                   |
| priority: now     | d73a4a |                                                                                         | priority: critical, Priority: Critical                                                                                      |
| priority: soon    | ffb8c6 |                                                                                         | priority: medium, Priority: Medium                                                                                          |
| priority: 2day    | fbca04 |                                                                                         | priority: high, Priority: High                                                                                              |
| semantic-release  | e6e6e6 |                                                                                         |                                                                                                                             |
| state: approved   | 91ca55 | Approved to proceed.                                                                    | approved                                                                                                                    |
| state: blocked    | d73a4a | Something is blocking action.                                                           | blocked, Status: Blocked, status: blocked                                                                                   |
| state: pending    | fbca04 | Pending requirements, dependencies, data, or more information.                          | in progress, on hold, pending, Status: In Progress, Status: Review Needed, watchlist                                        |
| state: inactive   | e6e6e6 | No action needed or possible. The issue is fixed, addressed elsewhere, or out of scope. | duplicate, invalid, stale, Status: Abandoned, status: duplicate, status: wontfix, wont-fix, wontfix                         |
| type: bug         | d73a4a | Something isn't working.                                                                | bug, Type: Bug                                                                                                              |
| type: chore       | fef2c0 | Converting measurements, reorganizing folder structure, and less impactful tasks.       | chore, dependabot, dependencies, dependency, greenkeeper, legal, maintenance, Type: Maintenance, type: maintenance          |
| type: discussion  | d4c5f9 | Questions, proposals and info that requires discussion.                                 | discussion, feedback, idea, Idea, Proposal, proposal, question, type: design, Type: Question, type: question                |
| type: docs        | fef2c0 | Related to documentation and information.                                               | doc, docs, document, documentation, documents, Type: Documentation, type: documentation                                     |
| type: feature     | 5ebeff | Brand new functionality, features, pages, workflows, endpoints, etc.                    | addition, enhancement, feature, type: enhancement, Type: Feature                                                            |
| type: fix         | 91ca55 | Iterations on existing features or infrastructure.                                      | fix, improvement, optimization, refactor, Type: Fix, Type: Refactoring                                                      |
| type: security    | d73a4a | Something is vulnerable or not secure.                                                  | security                                                                                                                    |
| type: testing     | fbca04 | Related to testing.                                                                     | test, testing                                                                                                               |
| work: chaotic     | fbca04 | The situation is chaotic, novel practices used.                                         | chaotic                                                                                                                     |
| work: complex     | d4c5f9 | The situation is complex, emergent practices used.                                      | complex                                                                                                                     |
| work: complicated | ffb8c6 | The situation is complicated, good practices used.                                      | complicated                                                                                                                 |
| work: obvious     | 91ca55 | The situation is obvious, best practices used.                                          | obvious                                                                                                                     |
