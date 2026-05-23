# Placement OS — Sheet-Based Data Architecture

## Overview

All curriculum data (DSA, aptitude, companies, mocks, revision rules) lives in **`/sheets`**.  
The Next.js app **never hardcodes question lists** at runtime — it loads via `/api/data`.

User progress (solved status, XP, streaks) stays in **Zustand + localStorage** (hybrid: sheets = content, client = progress).

---

## Folder structure

```
sheets/
  dsa/
    topics.csv              # Topic metadata
    questions.csv           # Master question bank
    mock-tests.csv          # Mock test definitions
    arrays.xlsx             # (optional) per-topic overrides
    strings.xlsx            # merged into bank, dedupe by question_id
  aptitude/
    topics.csv
    config.csv
  companies/
    profiles.csv
    questions.csv           # (optional) company-tagged questions
  revision/
    cycles.csv
  analytics/
    weekly-plan.csv
```

### Naming conventions
- **Lowercase**, hyphenated: `binary-search`, `linked-list`
- **IDs**: `arr-l1-3`, `str-l3-1` (topic-prefix + level + index)
- **Lists in cells**: pipe-separated `Amazon|Google|TCS`
- **Per-topic files**: `sheets/dsa/{topic}.xlsx` merged with `questions.csv`

---

## Data pipeline

```
/sheets/*.csv|xlsx
    → parser.ts (xlsx library)
    → validators.ts
    → transformers.ts → DSAQuestion[], DSATopicMeta[], ...
    → loader.ts (unstable_cache 60s)
    → GET /api/data
    → useDataStore (client cache 60s)
    → UI components
```

### Hot reload (no redeploy)
1. Edit CSV in `/sheets`
2. Open **Admin** → **Reload sheets**, or `POST /api/data/revalidate`
3. Client calls `fetchData(true)`

### Initial seed from legacy (dev only)
```bash
npm run sheets:sync
```
Reads `src/data/*` once and writes CSV — **app does not import those files**.

---

## Sheet specifications

### 1. DSA Questions (`sheets/dsa/questions.csv`)

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| question_id | string | ✓ | Unique ID |
| title | string | ✓ | Display name |
| url | string | ✓ | LeetCode/GFG link |
| platform | string | ✓ | LeetCode, GFG, etc. |
| difficulty | enum | ✓ | Easy, Medium, Hard |
| topic | string | ✓ | Topic slug |
| subtopic | string | | Pattern sub-area |
| pattern | string | ✓ | two-pointer, kadane, … |
| companies | string | | Pipe-separated |
| frequency | enum | | very-high, high, medium, low |
| estimated_time | number | | Minutes |
| revision_priority | enum | | critical, high, medium, low |
| explanation_url | string | | Optional write-up |
| video_url | string | | Optional video |
| neetcode_ref | string | | NeetCode slug |
| striver_ref | string | | Striver article slug |
| tags | string | | Pipe-separated |
| xp_reward | number | | Default 50 |
| unlock_level | 1-4 | | Level gate |
| prerequisites | string | | Pipe-separated question IDs |
| level | 1-4 | ✓ | Path level |
| category | enum | ✓ | beginner, easy, medium, interview, revision, mock |
| alt_url | string | | GFG mirror |

### 2. Topic Metadata (`sheets/dsa/topics.csv`)
`id`, `name`, `slug`, `difficulty`, `importance_score`, `interview_frequency`, `estimated_hours`, `tier`, `overview`, `patterns`, `unlock_after_topic_id`

### 3. Mock Tests (`sheets/dsa/mock-tests.csv`)
`id`, `title`, `duration_min`, `question_ids` (pipe-separated), `company_tags`

### 4. Revision (`sheets/revision/cycles.csv`)
`cycle`, `action`

### 5. Companies (`sheets/companies/profiles.csv`)
`slug`, `name`, `type`, `oa_pattern`, `coding_difficulty`, `aptitude_weightage`, `rounds`, `communication`, `resume`, `projects`, `hr_questions`, `priority`, `strategy`

### 6. Aptitude (`sheets/aptitude/topics.csv`)
`id`, `category`, `name`, `priority`, `difficulty`, `strategy`, `shortcuts`, `revision`

### 7–14. User data (not in sheets — client/DB)
- User progress → `placement-os-progress-v2` localStorage
- Future: `sheets/export/user-progress.json` or Supabase tables per `src/types/index.ts` DB_SCHEMA

---

## Example question rows

```csv
question_id,title,url,platform,difficulty,topic,subtopic,pattern,companies,frequency,estimated_time,revision_priority,level,category,xp_reward
arr-l1-3,Two Sum,https://leetcode.com/problems/two-sum/,LeetCode,Easy,arrays,hashmap,hashmap,Amazon|Google,very-high,25,critical,1,easy,50
str-l2-2,Longest Substring Without Repeating Characters,https://leetcode.com/problems/longest-substring-without-repeating-characters/,LeetCode,Medium,strings,sliding-window,sliding-window,Amazon|Uber,very-high,40,critical,2,medium,50
sw-l2-2,Minimum Size Subarray Sum,https://leetcode.com/problems/minimum-size-subarray-sum/,LeetCode,Medium,sliding-window,variable-window,variable-window,Goldman,high,35,high,2,medium,50
ll-l1-1,Reverse Linked List,https://leetcode.com/problems/reverse-linked-list/,LeetCode,Easy,linked-list,iteration,iteration,All MNCs,very-high,20,critical,1,easy,50
tr-l2-3,Binary Tree Level Order Traversal,https://leetcode.com/problems/binary-tree-level-order-traversal/,LeetCode,Medium,trees,BFS,BFS,Meta,very-high,30,critical,2,medium,50
```

---

## Frontend architecture

| Layer | File |
|-------|------|
| API | `src/app/api/data/route.ts` |
| Loader | `src/lib/sheets/loader.ts` |
| Client cache | `src/store/data-store.ts` |
| Hook | `src/hooks/use-sheet-data.ts` |
| Provider | `src/components/providers/data-provider.tsx` |
| Progress | `src/lib/progress-store.ts` |
| Stats | `src/hooks/use-dsa.ts` + `src/lib/dsa-engine.ts` |

### Filtering / search
`filterQuestions()` in loader — topic, difficulty, company, pattern, status, revision due, bookmarks, fuzzy search on title/pattern/tags.

---

## Hybrid: sheets vs database

| Use sheets | Use DB (Supabase) |
|------------|-------------------|
| Questions, topics, companies | User accounts |
| Mock definitions | question_progress per user |
| Roadmap metadata | streaks, XP (sync) |
| Aptitude curriculum | application tracker |

**Offline**: sheet data cached in memory + client store; progress in localStorage. Export JSON in Settings.

---

## Deployment

- Commit `/sheets` to Git → Vercel includes files → API reads via `process.cwd()/sheets`
- **Google Sheets sync (v2)**: cron job exports Sheet → CSV → commit or S3
- Set `REVALIDATE_SECRET` for protected `POST /api/data/revalidate`

---

## Admin

`/admin` — manifest, validation, reload button.

---

## Performance

- Server cache: 60s `unstable_cache`
- Client cache: 60s in `useDataStore`
- Pagination (v2): virtualized list for 1000+ questions
- Dedupe by `question_id` when merging multiple dsa/*.xlsx files
