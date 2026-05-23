# Placement OS — Complete Product Blueprint

> Implementation-ready spec for a creative/product-oriented CSE student (7th semester).  
> Runnable MVP: `npm run dev` in this repo.

---

## PART 1 — Product Architecture

### App purpose
**Placement OS** is a personal operating system that unifies placement prep (DSA, aptitude, companies), project/portfolio execution, and anti-burnout productivity—optimized for builders who learn by shipping, not theory grinding.

### User journey
1. **Land** → value prop (product engineer path)
2. **Onboard** → semester, target (service/product/startup), energy baseline, project list import
3. **Dashboard** → daily quests, readiness score, weakest area nudge
4. **Learn** → pattern-first DSA + visual notes + AI mentor (guided)
5. **Revise** → spaced repetition queue from “shaky” marks
6. **Analytics** → weekly/monthly course correction
7. **Season** → company hub + countdown + mock interviews

### Onboarding flow (3 screens)
| Step | Content |
|------|---------|
| 1 | Google/email auth · name |
| 2 | Path: Product FE / Full-stack / Mass hiring |
| 3 | Import projects (Anony Talk, HireLens, JARVIS) · placement month target · daily time budget (1.5–3h) |

### Core flows
- **Dashboard flow**: Open → see 3 quests → lowest readiness area → start focus/pomodoro
- **Learning flow**: Roadmap topic → pattern card → 1 curated problem → mark solved → +XP
- **Revision flow**: Sunday review → auto-queue shaky problems → no new topics in recovery week
- **Analytics flow**: Category bars → adjust next week plan
- **Motivation**: Streak + XP + achievements; never punish rest days (planned recovery)

### Gamification structure
- XP from execution (solve, quest, habit, review)
- Levels every 500 XP
- Streak with “minimum viable day” (15 min)
- Placement Readiness = weighted(DSA 30%, Aptitude 25%, Projects 30%, CS 10%, Communication 5%)

### Data structure (logical)
```
User → Profile, Settings, EnergyMode
  → DSAProgress[topicId], QuestionAttempts[]
  → AptitudeProgress[category]
  → Projects[], ResumeVersions[]
  → CompanyTargets[], ApplicationLog[]
  → Habits[], Streaks, XP, Achievements[]
  → Notes[], DailyPlans[], WeeklyReviews[]
  → AnalyticsSnapshots[]
```

### Scalability
- Next.js App Router + Supabase RLS per user
- Static curriculum in JSON/MDX; user state in DB
- Edge-friendly reads; write batching for analytics
- Feature flags for college-specific company packs

### Feature hierarchy
```
P0: Auth, Dashboard, DSA tracker/roadmap/practice, Daily planner, Streak/XP
P1: Aptitude, Companies, Projects, Resume, Analytics, Pomodoro
P2: AI mentor integration, Mock interview, Burnout/low-energy, Supabase sync
P3: Community, leaderboards, college admin — optional
```

### Navigation hierarchy
See `src/lib/navigation.ts` — Core → Preparation → Build → Execution → Wellness → Motivation → System

### Route structure
| Route | Page |
|-------|------|
| `/` | Landing |
| `/auth/login`, `/auth/signup` | Auth |
| `/dashboard` | Main dashboard |
| `/dsa`, `/dsa/roadmap`, `/dsa/practice` | DSA |
| `/revision` | Revision |
| `/aptitude` | Aptitude |
| `/subjects` | CS subjects |
| `/projects` | Projects |
| `/resume` | Resume |
| `/companies`, `/companies/[slug]` | Companies |
| `/mock-interview` | Mocks |
| `/planner/daily`, `/planner/weekly` | Planner |
| `/analytics` | Analytics |
| `/streaks`, `/xp`, `/achievements` | Gamification |
| `/ai-mentor` | AI |
| `/burnout`, `/low-energy` | Wellness |
| `/notes`, `/countdown`, `/habits`, `/focus`, `/pomodoro` | Tools |
| `/social-tracker`, `/settings` | Profile |

### Component hierarchy
```
AppShell → Sidebar + Header
  → PageHeader
  → GlassCard / StatCard / ProgressRing
  → Feature widgets (charts, quest list, topic cards)
lib/store (Zustand), data/* (curriculum)
```

### Modular architecture
- `data/` = curriculum (versioned)
- `lib/` = store, nav, utils
- `components/ui` = design system
- `components/layout` = shell
- `app/` = routes only compose features

---

## PART 2 — Page Specifications (summary)

Each page in the MVP implements: **glass cards**, **motion entrance**, **progress bars**, **mobile drawer nav** (see `AppShell`), **focus-visible** rings, **reduced-motion** respect.

| Page | Purpose | Key widgets |
|------|---------|-------------|
| Landing | Convert + launch | Hero, feature grid, CTA |
| Auth | Identity | Email/Google, semester select |
| Dashboard | Command center | Readiness ring, quests, weekly chart |
| DSA Tracker | Progress by topic | Topic cards with % |
| DSA Roadmap | Tiered curriculum | Must/Important/Optional sections |
| Practice | Curated problems | Filter chips, mark solved +XP |
| Revision | Spaced repetition | Cycle rules + shaky queue |
| Aptitude | OA prep | Topic cards, mock schedule |
| CS Subjects | Theory minimum | DBMS/OS/CN/OOP progress |
| Projects | Portfolio | Anony Talk, HireLens, JARVIS |
| Resume | ATS | HireLens checklist |
| Companies | Strategy hub | Grid → detail |
| Mock Interview | Practice rounds | DSA/HR/Project/FE cards |
| Daily Planner | Time blocks | 2.5h realistic schedule |
| Weekly Review | Retrospective | 6-week DSA plan |
| Analytics | Bars | Area scores |
| Streaks / XP / Achievements | Motivation | Counters, badges |
| AI Mentor | Prompts | Do/Avoid lists |
| Burnout / Low-energy | Recovery | Protocol buttons |
| Notes | Pattern cards | Textarea (v2: MDX) |
| Countdown | Urgency | Days to season |
| Habits | Max 5 habits | Checkboxes |
| Focus | Full-screen | Timer + single task |
| Pomodoro | 25/5 | Start/pause |
| Social | GitHub/LinkedIn | Pin projects |
| Settings | Profile | Path select |

**Animations**: Framer `opacity/y` on cards; hover lift; chart draw; page transitions via layout (v2).

**Accessibility**: Semantic headings, aria on menu toggle, keyboard nav sidebar, contrast cyan on zinc-950, chart text alternatives in tables (v2).

---

## PART 3 — DSA System (Placement-focused)

Full topic objects in `src/data/dsa-roadmap.ts`.

### Tier summary

| Tier | Topics |
|------|--------|
| **MUST MASTER** | Arrays, Strings, HashMaps, Sorting, Searching, Binary Search, Sliding Window, Two Pointer, Stack, Linked List, Trees, BFS/DFS, Recursion |
| **IMPORTANT** | Prefix Sum, Queue, BST, Heap basics, Greedy basics, Graph basics |
| **OPTIONAL** | DP basics (after 60% must-tier) |
| **IGNORE FOR NOW** | Advanced graph (Dijkstra), Hard DP, Segment trees, Heavy math CP |

### Placement relevance principle
- Service OA: easy–medium, patterns > proofs
- Product: medium + strong project narrative
- Your edge: **frontend/system thinking** + **good-enough DSA**

---

## PART 4 — DSA Question List & Schedule

See `src/data/dsa-questions.ts` — 20+ curated problems with company tags.

### Day-wise progression (6 weeks, ~1.5h/day)
- **Week 1**: Arrays + HashMap (Two Sum → Max Subarray)
- **Week 2**: Two pointer + Sliding window
- **Week 3**: Linked list + Stack
- **Week 4**: Trees + BFS
- **Week 5**: Binary search + Prefix
- **Week 6**: Consolidation + mocks

### Revision cycles
- Daily: 10 min easy warm-up + 1 problem
- Weekly: 3 shaky redos
- Bi-weekly: Timed 60-min mock (2E + 1M)
- Monthly: Analytics-driven weak topic week

### Mock checkpoints
- End week 4: 5 problems / 90 min
- End week 6: Full weak-area mock

---

## PART 5 — Company Preparation

Full profiles in `src/data/companies.ts` — TCS, Infosys, Wipro, Cognizant, Accenture, Capgemini, Deloitte, Tech Mahindra, Product, Startups.

### Strategic positioning for YOU
| Target | Lead with | DSA depth |
|--------|-----------|-----------|
| TCS Digital / Cognizant GenC | Projects + aptitude | 40–50 mediums |
| Product FE | HireLens + Anony Talk demos | 60–80 mediums |
| Startups | Ship velocity + take-home | Practical coding |

---

## PART 6 — Aptitude System

See `src/data/aptitude.ts`.

| Category | Critical topics |
|----------|-----------------|
| Quant | %, ratio, time-work, speed |
| Logical | Series, coding-decoding, syllogism, puzzles |
| Verbal | RC, grammar |
| DI | Charts/tables |

**Mock**: 1×/week timed 60 min; log accuracy by category in app.

---

## PART 7 — Productivity System

### Root causes (your profile)
| Problem | Mechanism | OS counter |
|---------|-----------|------------|
| Procrastination | Dopamine mismatch (short videos) | Quests + 25-min pomodoro |
| Tutorial fatigue | Passive learning loop | Pattern cards + 1 problem |
| Burnout | Over-scoped CP comparison | Recovery + low-energy modes |
| Overwhelm | No single system | One dashboard |
| Perfectionism | Never shipping resume | HireLens checklist quests |

### Anti-procrastination workflow
1. Open Placement OS (ritual)
2. Pick **one** quest (not full roadmap)
3. Focus mode 35 min
4. Mark done → XP → close laptop

### Focus activation ritual
- Phone outside room · water · single tab · “Build mode” playlist optional

### Distraction control
- **YouTube**: allowed only from “visual pattern” bookmark list (max 15 min)
- **Phone**: grayscale after 9pm; app block during pomodoro

### Consistency system
- Minimum viable day = 15 min (streak preserved)
- Weekly review non-negotiable (Sunday 30 min)

### Comeback protocol
Missed 2 days → low-energy mode 3 days → no guilt XP penalty

---

## PART 8 — AI-Assisted Learning

### Use correctly
1. **Attempt 15 min solo** before AI
2. Ask for **pattern hint**, not full solution
3. Paste **your code** for debug
4. Request **complexity** + **edge cases** after solve

### Avoid dependency
- Never paste unseen problem → copy solution
- Do verbal explanation without AI once per problem

### Manual forever
- Writing logic from scratch on whiteboard
- Aptitude speed arithmetic
- Communication / STAR stories

### AI-augmented engineer workflow
```
Idea → AI brainstorm → You architect → AI scaffold → You implement UI/UX → AI test ideas → You verify
```

### Prompt templates (in app `/ai-mentor`)
- Explain pattern with tiny example
- Debug my approach
- Mock HR question
- Resume bullet improvement (metrics)

---

## PART 9 — Gamification

| System | Logic |
|--------|-------|
| XP | Problem +50, quest +20–50, habit +10, weekly review +100 |
| Level | floor(XP/500)+1 |
| Streak | Any quest completed; freeze 1×/month (v2) |
| Achievements | Pattern master, shipper, OA ready |
| Placement Readiness | Weighted formula (dashboard) |
| Confidence | Self-report + mock interview outcomes |
| Productivity | Planned blocks completed % |

**Psychology**: reward **completion** and **comeback**, not hours studied.

---

## PART 10 — UI/UX Design System

### Visual direction
Inspirations: Linear app clarity + Duolingo progression + futuristic glass OS (your Anony Talk aesthetic).

### Tokens
| Token | Value |
|-------|-------|
| Background | `#030712` + mesh gradients |
| Accent | Cyan `#22d3ee` → Violet `#a78bfa` |
| Glass | `bg-white/5` + `backdrop-blur-xl` + border `white/10` |
| Typography | Geist Sans; mono for timers |
| Spacing | 4px grid; cards `p-5`, sections `gap-4` |
| Radius | `rounded-2xl` cards, `rounded-xl` buttons |

### Motion
- Card entrance: 400ms ease, staggered delay
- Hover: translateY -4 (disabled in reduced-motion)
- Progress bars: 500ms width transition

### Components
`.btn-primary`, `.btn-ghost`, `.glass-card`, `.progress-bar`, `.gradient-text`, `.mesh-bg`

---

## PART 11 — Tech Stack & Implementation

### Stack
| Layer | Choice |
|-------|--------|
| Frontend | Next.js 16, React 19, Tailwind 4 |
| Motion | Framer Motion |
| UI | Custom glass system (shadcn-compatible v2) |
| State | Zustand + persist |
| Charts | Recharts |
| Backend v2 | Supabase (auth, postgres, RLS) |
| Deploy | Vercel |

### Folder structure
```
src/
  app/          # routes
  components/   # ui + layout
  data/         # curriculum
  lib/          # store, nav, utils
```

### API structure (v2)
- `POST /api/progress/question`
- `GET /api/analytics/weekly`
- `POST /api/planner/day`

---

## PART 12 — Database Design (Supabase)

### users
`id, email, name, semester, path, target_date, daily_budget_min, created_at`

### dsa_progress
`user_id, topic_id, progress_pct, shaky, last_practiced_at`

### question_attempts
`user_id, question_id, solved, time_min, notes, solved_at`

### streaks
`user_id, current, longest, last_active_date, freeze_used`

### analytics_snapshots
`user_id, week, readiness, confidence, productivity, category_json`

### company_prep
`user_id, company_slug, status, notes, oa_date`

### revision_queue
`user_id, question_id, priority, due_date`

### projects
`user_id, name, stack, status, readiness, url`

### achievements
`user_id, achievement_id, unlocked_at`

---

## PART 13 — Development Roadmap

### MVP (built — weeks 1–2)
- [x] All routes + navigation
- [x] DSA/aptitude/company data
- [x] XP/streak store
- [x] Dashboard charts

### v2 (weeks 3–5)
- Supabase auth + sync
- Question attempt logging
- AI mentor chat (API route + rate limit)
- Weekly review generator

### v3 (weeks 6–8)
- HireLens API integration
- Mock interview timer + rubric
- Push notifications
- Mobile PWA

### Weekly build plan
| Week | Build |
|------|-------|
| 1 | MVP polish, deploy Vercel |
| 2 | Supabase schema + auth |
| 3 | Progress persistence |
| 4 | AI mentor + notes |
| 5 | Analytics backend |
| 6 | Beta with 5 friends |

---

## PART 14 — Daily Execution System

### Weekday (~2.5h placement work)
| Time | Block |
|------|-------|
| Morning | 5 min plan in app |
| Evening 45m | 1 DSA problem |
| Evening 20m | Aptitude |
| Evening 30m | Project/resume |
| Night | No guilt wind-down |

### Weekend (+1h)
- Saturday: project deep work OR mock
- Sunday: weekly review + revision queue

### Placement season emergency (4 weeks)
- Aptitude 2×/week mocks
- DSA: only high-frequency patterns
- Resume + LinkedIn daily 15 min

### Exam week
- Maintenance: 1 easy + habits only

### Low motivation day
- Low-energy mode tasks only

### Burnout recovery week
- See `/burnout` protocol

---

## PART 15 — Career Strategy

### Realistic DSA expectations (for you)
- **60–80 quality mediums** > 300 random easies
- Explain brute → optimal → complexity
- Trees + arrays + strings = 70% of campus OAs

### Service vs product
- **Service**: aptitude + communication + basic DSA
- **Product/startup**: projects + thinking + medium DSA
- Don't compare yourself to CP grinders—you're on a **product engineer** track

### AI-era reality
Engineers who **direct AI**, **ship products**, and **own UX** are more valuable than pure algorithm machines for most roles.

### Why projects matter
Anony Talk → empathy + UI + scale story  
HireLens → AI + privacy + real user problem  
JARVIS → systems + local AI  

### Winning formula
**Good-enough DSA + strong projects + clear communication** beats toxic grind culture.

---

## Next steps for you

1. `cd placement-os && npm run dev`
2. Complete today's 3 quests on dashboard
3. Week 1 DSA: Two Sum → Max Subarray path
4. Polish HireLens live link for resume page
5. Deploy to Vercel when ready (v2 auth)

*Placement OS — built for builders.*
