# Block Notes — Requirements & Feature Roadmap

Implementation order reflects dependencies: each phase unlocks the next.

---

## ✅ Phase 0 — Skeleton (done)

- Two-panel layout: page sidebar + block editor
- Block types: paragraph, heading 1/2/3, bullet, numbered, to-do, code, quote, divider
- Blocks persisted to SQLite via EF Core
- Enter key → create same-type block directly after current one
- ↑ / ↓ reorder buttons per block
- Create / rename / delete pages
- Theme switcher (zinc / arctic / stone / contrast) + dark mode toggle

---

## Phase 1 — Inline Rich Text Formatting

> Prerequisite for Q blocks (answers need formatting).

**Inline marks:** bold, italic, underline, strikethrough, inline code

**UX:**
- Select text → floating mini-toolbar appears (like Notion)
- Keyboard shortcuts: `Ctrl+B` bold · `Ctrl+I` italic · `Ctrl+U` underline · `Ctrl+Shift+S` strikethrough · `` Ctrl+` `` inline code
- Applies to: paragraph, bullet, numbered, todo, quote, heading blocks
- Code block and divider are exempt (plain text / no content)

**Storage:** content stored as HTML string (e.g. `Hello <strong>world</strong>`) — block `Content` column unchanged, just stores richer HTML.

---

## Phase 2 — Block Nesting (1 level deep)

> Prerequisite for Q blocks — answers are children of the Q block.

**Data model change:**
```
Block { ..., ParentId int? }
```
- Only top-level blocks (`ParentId = null`) can be parents
- Children cannot have their own children (1 level max)
- Children inherit `PageId`, have their own `Order` (scoped within parent)

**UX:**
- `Tab` on a block → indent it (make it a child of the block above)
- `Shift+Tab` → outdent (promote to top level)
- Children are rendered indented (pl-8) directly below their parent
- Reorder (↑/↓) scoped within the same parent
- Deleting a parent deletes its children too (cascade in API)
- Enter at end of an empty child block → outdents it (Notion behaviour)

**API changes:**
- `POST /api/pages/{id}/blocks` — add `parentId?` to request
- `GET /api/pages/{id}/blocks` — returns flat list; UI nests by `parentId`
- `DELETE /api/blocks/{id}` — cascade-deletes children

---

## Phase 3 — Q Block Type + Spaced Repetition Review

> Depends on: Phase 2 (children as answers), Phase 1 (formatted answers).

### 3a — Q Block in the Editor

**New block type:** `question`

- Rendered in the editor like a styled card:
  ```
  ❓ What is the difference between TCP and UDP?
     └─ TCP is connection-oriented; UDP is connectionless.
     └─ TCP guarantees delivery; UDP does not.
  ```
- Its child blocks (any type: paragraph, bullet, etc.) are the **answer**
- Children are hidden by default in the editor behind a "show answer" toggle
- A "Q" badge in the left gutter distinguishes it from normal blocks

### 3b — SM-2 Scheduling

**Data model additions on Block:**
```
Block {
  ...,
  // SM-2 fields (null on non-Q blocks)
  NextReviewAt   DateTime?
  Interval       int?        // days until next review
  Repetitions    int?        // consecutive correct answers
  EaseFactor     float?      // starts at 2.5
}
```

**SM-2 algorithm** (after each review):
- Rating 1 = "Again" → interval reset to 1 day, ease decreases
- Rating 2 = "Hard"  → interval × 1.2, ease decreases slightly
- Rating 3 = "Good"  → interval × ease
- Rating 4 = "Easy"  → interval × ease × 1.3, ease increases

**API additions:**
- `GET /api/review/queue` — returns Q blocks where `NextReviewAt <= now`, ordered by due date
- `POST /api/blocks/{id}/review` — body `{ rating: 1|2|3|4 }`, applies SM-2, returns updated block

### 3c — Review Session UI

**Dedicated "Review" section** in the sidebar nav (below pages).

**Session flow:**
1. Shows count of cards due: *"14 cards due"*
2. Click "Start review" → enters review mode (full-screen overlay)
3. Each card:
   - Shows the **question** (Q block content + its page breadcrumb)
   - "Show answer" button → reveals children
   - Four rating buttons: **Again** · **Hard** · **Good** · **Easy**
   - SM-2 applied immediately, card moves to end of queue or exits
4. Session ends when queue is empty → summary shown (cards reviewed, % good+easy)
5. Esc or "Finish" exits review mode at any time

---

## Phase 4 — Nested Pages (Tree Structure)

> Depends on: Phase 0 (flat pages working correctly).

**Data model change:**
```
Page { ..., ParentPageId int? }
```

**Sidebar:**
- Tree view: parent pages show a `▶` toggle, click to expand/collapse children
- Indent children visually (pl-4 per level)
- "New subpage" option in the page context menu (pencil/trash row)
- Breadcrumb in the main header: `Parent › Child`

**Constraints:**
- Max 3 levels deep (prevent runaway nesting)
- Deleting a page with children: prompt — *"Also delete X subpages?"*

**API changes:**
- `GET /api/pages` — returns all pages (flat); UI builds tree by `parentPageId`
- `POST /api/pages` — add `parentPageId?` to request
- `DELETE /api/pages/{id}` — include `cascade=true` query param to delete subtree

---

## Phase 5 — Full-Text Search

> Depends on: Phase 0 (pages + blocks in DB).

**Scope:** search across page titles AND block content.

**UX:**
- Search box at the top of the sidebar
- Results appear inline (replaces the page list while searching):
  - Group: page title match
  - Group: block content match — shows excerpt + page name
- Click a result → navigate to that page (and highlight/scroll to the block if it's a block match)
- Esc clears search, returns to normal page list

**Implementation:** SQLite `LIKE` query on `Pages.Title` and `Blocks.Content` — no FTS5 extension needed at this scale.

**API:**
- `GET /api/search?q={term}` → `{ pages: [...], blocks: [...] }`

---

## Phase 6 — Page Tags

> Depends on: Phase 4 (pages stable).

**Data model:**
```
PageTag { PageId, Tag string }
```
(No separate Tag table — tags are plain strings, normalised to lowercase.)

**UX:**
- Tag editor in a page's header area (below the title)
- Inline chips: click `+` → type tag → Enter to confirm; click chip × to remove
- Sidebar: "Tags" section below pages — lists all unique tags; click to filter page list

**API:**
- `GET /api/pages/{id}/tags`
- `PUT /api/pages/{id}/tags` — replaces tags (body: `{ tags: ["history", "cs"] }`)
- `GET /api/tags` — returns `[{ name, count }]` for sidebar listing
- `GET /api/pages?tag={name}` — filter pages by tag

---

## Phase 7 — Markdown Export

> Depends on: Phase 1 (rich text), Phase 2 (nesting).

**Scope:** export single page to `.md` file (browser download).

**Block → Markdown mapping:**

| Block type | Markdown output |
|---|---|
| `heading1` | `# content` |
| `heading2` | `## content` |
| `heading3` | `### content` |
| `paragraph` | `content` |
| `bullet` | `- content` |
| `numbered` | `1. content` |
| `todo` | `- [ ] content` / `- [x] content` |
| `code` | ` ```\ncontent\n``` ` |
| `quote` | `> content` |
| `divider` | `---` |
| `question` | `> ❓ content` + children as blockquote |
| Children | `  - content` (2-space indent) |

**Rich text → Markdown:** strip HTML tags to Markdown equivalents (`<strong>` → `**`, `<em>` → `*`, etc.)

**UX:** "Export as Markdown" button in the page header (download icon, top-right of editor).

**Implementation:** client-side generation — no new API endpoint needed.

---

## Deferred / Out of Scope

- Image blocks (file upload or URL embed)
- Table blocks
- Drag-and-drop block reordering
- Slash command (`/`) block picker
- Collaboration / multi-user
- PDF export
- Mobile layout
