# [Polemic Labels](https://sambacha.github.io/polemic-labels/)


> [!IMPORTANT]
> A Systematized Taxonomic Framework for Issue Categorization
>  WCAG 2.0 Accessibility Standards Implementation


<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Polemic Labels](#polemic-labels)
   * [Abstract](#abstract)
   * [Color Theory[^1]](#color-theory1)
      + [Issue Category ](#issue-category)
      + [Issue Status](#issue-status)
      + [Issue Priority  ](#issue-priority)
   * [Overview](#overview)
   * [Color Sets](#color-sets)
   * [Prefix Labels](#prefix-labels)
   * [Reserved Labels](#reserved-labels)
   * [Examples](#examples)
   * [Tests](#tests)
      + [Quickcheck ](#quickcheck)
   * [Citations](#citations)

<!-- TOC end -->

## Abstract

Polemic Labels is a comprehensive and methodologically rigorous classification schema for Linear and GitHub (and any other 'task'/'bug' tracker) issue management, incorporating empirically-validated contrast ratio recommendations. It is color blind safe, coherant, and can be applied to your GitHub repo using the `gh` command line tool. It also takes into consideration `bot` accounts, so that these labels can be utilized by automated accounts for specific purposes. These labels do not impose any sort of triage or issue tracking metholodgy, they are only taxonomic and abstracted.


> [!CAUTION]
> **TLDR: Emojis are distracting**

## Color Theory[^1]

- Sequential Scheme[^2]
  Applied to issue statuses, showing clear progression from light blue (backlog) to dark blue (done), making it easy to visualize how far along issues are in the workflow.
  
- Diverging Scheme[^2]
  Used for priority levels, with a neutral midpoint (medium priority) and contrasting colors for the extremes (blues for low priorities, reds for high priorities).
  
- Qualitative Scheme[^3]
   Applied to issue categories, using distinctive hues to differentiate between types without implying any hierarchy or magnitude relationship.

### Issue Category 

Qualitative color scheme - uses distinct hues to differentiate categories without implying any hierarchy or magnitude relationship

> [!TIP]
>  Distinct hues (for categorical data)

---

### Issue Status

Sequential color scheme - represents workflow progression from start to completion. Colors transition from light to dark blue as the issue advances
Issue Status: Following a sequential scheme: light → dark represents progress

> [!TIP]
>  Progression from light to dark (for ordered data)


---


### Issue Priority  

Diverging color scheme - emphasizes critical middle values with neutral color and uses contrasting colors (blue vs red) for opposite extremes
> [!TIP]   
>  Emphasizes middle values and extremes (for data with critical midpoint)


<br />
<br />

## Overview

<details><summary>TypeScript Reference</summary>
<p>


```typescript
/**
 * GitHub Issue Schema with Color Scheme Implementation
 * 
 * This module defines a type system for GitHub issues that incorporates
 * three distinct color scheme approaches for different issue attributes:
 * - Sequential: For status (progression through workflow)
 * - Diverging: For priority (emphasizing critical values)
 * - Qualitative: For categories (distinct types without implied hierarchy)
 */

/**
 * Core issue data structure representing a GitHub issue with all its properties
 */
interface IssueSchema {
  id: string;                  // Unique identifier for the issue
  title: string;               // Issue title displayed in lists and headers
  description: string;         // Detailed explanation of the issue
  status: IssueStatus;         // Current workflow position (sequential scheme)
  priority: IssuePriority;     // Importance level (diverging scheme)
  category: IssueCategory;     // Issue type classification (qualitative scheme)
  createdAt: Date;             // Timestamp when issue was created
  updatedAt: Date;             // Timestamp of last modification
  assignee?: string;           // Optional username of assigned developer
  labels: string[];            // Additional custom categorization tags
  colorScheme: ColorSchemeType; // Visual representation strategy used
}

/**
 * Sequential color scheme - represents workflow progression from start to completion. Colors transition from light to dark blue as the issue advances
 * Colors transition from light to dark blue as the issue advances
 */
enum IssueStatus {
  BACKLOG = "backlog",         // Initial planning state (#E3F2FD - very light blue)
  TODO = "todo",               // Ready to be worked on (#BBDEFB - light blue)
  IN_PROGRESS = "in_progress", // Currently being implemented (#64B5F6 - medium blue)
  REVIEW = "review",           // Under peer evaluation (#2196F3 - blue)
  DONE = "done"                // Completed and verified (#0D47A1 - dark blue)
}

/**
 * Diverging color scheme - emphasizes critical middle values with neutral color and uses contrasting colors (blue vs red) for opposite extremes
 * and uses contrasting colors (blue vs red) for opposite extremes
 */
enum IssuePriority {
  LOWEST = "lowest",           // Minimal urgency (#1A237E - dark blue)
  LOW = "low",                 // Below average urgency (#7986CB - medium blue)
  MEDIUM = "medium",           // Standard priority (#F5F5F5 - neutral light gray)
  HIGH = "high",               // Above average urgency (#EF9A9A - medium red)
  HIGHEST = "highest"          // Critical urgency (#B71C1C - dark red)
}

/**
 * Qualitative color scheme - uses distinct hues to differentiate categories without implying any hierarchy or magnitude relationship
 * without implying any hierarchy or magnitude relationship
 */
enum IssueCategory {
  BUG = "bug",                 // Code defect (#F44336 - red)
  FEATURE = "feature",         // New functionality (#4CAF50 - green)
  DOCUMENTATION = "documentation", // Content improvements (#FF9800 - orange)
  REFACTOR = "refactor",       // Code restructuring (#9C27B0 - purple)
  ENHANCEMENT = "enhancement", // Existing feature improvement (#009688 - teal)
  SECURITY = "security",       // Safety vulnerability (#C2185B - pink)
  PERFORMANCE = "performance"  // Speed optimization (#FFC107 - amber)
}

/**
 * Available color scheme approaches for different visualization needs
 */
enum ColorSchemeType {
  SEQUENTIAL = "sequential",   // Progression from light to dark (for ordered data)
  DIVERGING = "diverging",     // Emphasizes middle values and extremes (for data with critical midpoint)
  QUALITATIVE = "qualitative"  // Distinct hues (for categorical data)
}

/**
 * Retrieves the appropriate hex color code for an issue status
 * Following a sequential scheme: light → dark represents progress
 */
function getStatusColor(status: IssueStatus): string {
  const statusColors = {
    [IssueStatus.BACKLOG]: "#E3F2FD",
    [IssueStatus.TODO]: "#BBDEFB",
    [IssueStatus.IN_PROGRESS]: "#64B5F6",
    [IssueStatus.REVIEW]: "#2196F3", 
    [IssueStatus.DONE]: "#0D47A1"
  };
  
  return statusColors[status];
}

/**
 * Retrieves the appropriate hex color code for an issue priority
 * Following a diverging scheme: contrasting hues for extremes with neutral midpoint
 */
function getPriorityColor(priority: IssuePriority): string {
  const priorityColors = {
    [IssuePriority.LOWEST]: "#1A237E",
    [IssuePriority.LOW]: "#7986CB",
    [IssuePriority.MEDIUM]: "#F5F5F5",
    [IssuePriority.HIGH]: "#EF9A9A",
    [IssuePriority.HIGHEST]: "#B71C1C"
  };
  
  return priorityColors[priority];
}

/**
 * Retrieves the appropriate hex color code for an issue category
 * Following a qualitative scheme: distinct hues for unrelated categories
 */
function getCategoryColor(category: IssueCategory): string {
  const categoryColors = {
    [IssueCategory.BUG]: "#F44336",
    [IssueCategory.FEATURE]: "#4CAF50",
    [IssueCategory.DOCUMENTATION]: "#FF9800",
    [IssueCategory.REFACTOR]: "#9C27B0",
    [IssueCategory.ENHANCEMENT]: "#009688",
    [IssueCategory.SECURITY]: "#C2185B",
    [IssueCategory.PERFORMANCE]: "#FFC107"
  };
  
  return categoryColors[category];
}
```

</p>
</details> 


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


## Prefix Labels

| Prefix   | Description               | Values                                                        |
| -------- | ------------------------- | ------------------------------------------------------------- |
| Effort   | Fibonacci scale of effort | 1, 2, 3, 5, 8, 13                                             |
| Priority | Task urgency              | now, 2day, soon                                               |
| State    | Decision status           | approved, blocked, inactive, pending                          |
| Type     | Category of task          | bug, chore, discussion, docs, feature, fix, security, testing |
| Work     | Nature of work complexity | chaotic, complex, complicated, obvious                        |


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


## Tests

> [!NOTE]
> Tests:  5 failed, 55 passed, 60 total


```
    Base Schema Validation
      ✓ all labels should validate against base schema (17 ms)
      ✓ prefix labels should validate against base schema
      ✓ reserved labels should validate against base schema
    Prefix Labels
      ✓ should validate against prefix schema (1 ms)
      ✓ should have unique names
      ✓ should have valid prefixes (2 ms)
      ✓ should contain all required Effort values
      ✓ should contain all required Priority values
      ✓ should contain all required State values (1 ms)
      ✓ should contain all required Type values
      ✓ should contain all required Work values (1 ms)
      ✓ should have valid hex colors (1 ms)
      ✓ should have non-empty descriptions
    Reserved Labels
      ✓ should validate against reserved schema (2 ms)
      ✓ should have unique names
      ✓ should include all required reserved labels
      ✓ should have key-value pair notation in descriptions (1 ms)
      ✓ should have valid hex colors
      ✓ should have non-empty descriptions
    Integration Tests
      ✓ should have no name collisions between prefix and reserved labels
      ✓ should maintain consistent color semantics (1 ms)
      ✓ effort labels should use a grayscale progression
    File Integrity
      ✓ JSON files should be parseable
      ✓ schema files should be valid JSON Schema
    GitHub API Compatibility
      ✓ label names should not exceed GitHub length limits (1 ms)
      ✓ color values should not include # prefix (1 ms)
      ✓ label descriptions should not exceed GitHub limits (1 ms)
```


### Quickcheck 

```
  GitHub Labels QuickCheck Tests
    ✕ All valid labels should conform to the base schema (73 ms)
    ✕ All valid prefix labels should conform to the prefix schema (577 ms)
    ✕ All valid reserved labels should conform to the reserved schema (1818 ms)
    ✕ Labels should have unique names in any valid array (2590 ms)
    ✓ Prefix labels should start with valid prefixes (12401 ms)
    ✓ Label colors should be 6-character hex strings without # prefix (13323 ms)
    ✓ Reserved labels should have key-value pairs in their descriptions (9960 ms)
    ✓ Valid label colors should be permissible in our color system (10419 ms)
    ✕ Effort labels should have valid Fibonacci values (712 ms)
    ✓ No name collisions should exist between prefix and reserved labels (19954 ms)

```



## Citations

[^1]: Harrower, Mark, and Cynthia A. Brewer. 2003. "ColorBrewer: An Online Tool for Selecting Color Schemes for Maps." The Cartographic Journal 40 (1): 27-37.

<br />

[^2]: Slocum, Terry A., Robert B. McMaster, Fritz C. Kessler, and Hugh H. Howard. 2008. Thematic Cartography and Visualization. Upper Saddle River, NJ: Prentice Hall.

<br />

[^3]: Brewer, Cynthia A. 1994. "Color Use Guidelines for Mapping and Visualization." In Visualization in Modern Cartography, edited by Alan M. MacEachren and D. R. Fraser Taylor, 123-147. Oxford: Pergamon.

<br />

### Note

> [!WARNING]
> These labels are not in use in this repository, take that as you will.

> [!NOTE]
> T.B.D
