# Prompt Rewriting Exercise — 5 Vague Instructions

**Task**: Rewrite each vague instruction below into a well-structured prompt using the CCEO framework (Context, Constraints, Examples, Output format).

---

### 1. "Make a login page"

Your CCEO rewrite:
```
CONTEXT:
It's a Next.js 14 App Router app, TypeScript, styled with Tailwind.
Auth is handled by NextAuth credentials provider, users stored in MongoDB
with email + hashed password. This is a professional SaaS tool — think
project management, not a consumer app. The login page goes at
/app/(auth)/login/page.tsx.

CONSTRAINTS:
Email and password only — no Google, no GitHub, no social stuff.
Don't pull in shadcn or MUI, just raw Tailwind classes. It needs to
work well on mobile (375px up). Validation should be client-side and
inline — not a toast, not an alert() — just a small red message under
the field that says exactly what went wrong ("Email is required",
"That doesn't look like a valid email", "Wrong password, try again").
Show a loading spinner while the form is submitting. Keep the component
clean — if it starts ballooning past 120 lines, split it up.

EXAMPLES:
Visually, aim for something like Notion's login — centered card, lots
of breathing room, nothing decorative. The form UX should feel like
Linear's — big comfortable inputs, clear hierarchy, errors feel calm
not alarming. For the button, think Vercel — solid, flat, no gradient.
For copy: heading is "Welcome back", subheading is "Sign in to continue".
Avoid the split-screen layout trend, no gradient backgrounds, no icons
in the input fields unless it genuinely helps.

OUTPUT:
Two files — LoginForm.tsx (the actual form as a client component, with
TypeScript interfaces for form + error state, and a handleSubmit that
calls NextAuth's signIn()) and page.tsx (just a wrapper that imports
and renders it). Leave comments where the real API logic would plug in.
Skip the DB layer, NextAuth config, middleware — just the UI and form
logic.
```

---

### 2. "Fix the bugs in this code"

Your CCEO rewrite:
```
CONTEXT:
This is a Next.js 14 App Router project, TypeScript, using MongoDB with
Mongoose. The function below is an API route handler that's supposed to
fetch a user's dashboard data — their profile, recent activity, and
subscription status — and return it as a single JSON response. It's
sitting at /app/api/dashboard/route.ts.

[PASTE YOUR CODE HERE]

CONSTRAINTS:
Don't refactor or restructure anything — I just want the bugs fixed,
not a rewrite. Keep the same logic flow, same variable names, same file
structure. If something is genuinely broken in a way that requires a
small restructure, flag it separately and explain why before touching it.
Don't upgrade any packages or swap libraries. TypeScript errors count as
bugs too — fix those as well. If you spot something that's not breaking
anything right now but will blow up in production, call it out in a
comment but don't auto-fix it.

EXAMPLES:
The specific symptoms I'm seeing —
- The API returns 200 but the response body is empty sometimes
- Occasionally throws: "Cannot read properties of undefined (reading 'id')"
  on line 24 ish
- The subscription status always comes back as null even when the DB
  has valid data
Not sure if these are three separate bugs or the same root cause.

OUTPUT:
Give me the corrected file in full so I can drop it straight in — no
partial diffs. After the code, add a short "What I fixed" section,
bullet points, plain English — what was wrong, where it was, and why
it was breaking. If there's anything risky or worth double-checking
after the fix, mention it at the end.
```

---

### 3. "Write tests for the user module"

Your CCEO rewrite:
```
CONTEXT:
Next.js 14 App Router, TypeScript project. The user module handles
everything user-related — registration, login, profile update, and
account deletion. It's split across two files:
- /lib/user.service.ts — the business logic (pure functions, no HTTP)
- /app/api/user/route.ts — the API route handlers that call those functions

MongoDB is the database, accessed via Mongoose. For testing, the project
already has Jest + ts-jest set up. There's no testing infrastructure
beyond that — no mocks folder, no test utilities file yet.

[PASTE YOUR USER MODULE CODE HERE]

CONSTRAINTS:
Unit tests only for user.service.ts — test the logic in isolation,
mock out all Mongoose calls with jest.fn(). For route.ts, write
integration-style tests using jest + node-mocks-http, no need to spin
up a real server. Don't test implementation details — test behavior and
outcomes. Each test should have one clear reason to fail. No snapshots.
Keep test descriptions readable — someone should understand what broke
just by reading the test name, without opening the file.

EXAMPLES:
Test naming style I like:
  ✓ "should return 404 when user does not exist"
  ✓ "should hash the password before saving to DB"
  ✗ "test1" or "works correctly"

For mocking Mongoose, mock at the model level like this:
  jest.spyOn(User, 'findOne').mockResolvedValue(mockUser)
  — not jest.mock('mongoose') globally

Edge cases I definitely want covered:
  - What happens when userId is missing or malformed
  - Duplicate email on registration
  - Trying to delete an account that doesn't exist
  - Profile update with an empty body
  - What if MongoDB throws mid-operation

OUTPUT:
Two test files —
  user.service.test.ts and user.route.test.ts
Each test file should have a describe block per function/endpoint.
At the top of each file, add a one-line comment explaining what
that file is testing and what's being mocked. No need to explain
every single test inline — just the non-obvious ones. Give me
the full files, ready to drop into a __tests__ folder and run
with "npx jest".
```

---

### 4. "Set up a database"

Your CCEO rewrite:
```
CONTEXT:
Next.js 14 App Router project, TypeScript. I'm building a SaaS platform
where users can sign up, create workspaces, invite team members, and
manage projects inside those workspaces. Deploying to Vercel. Database
is MongoDB Atlas — free tier for now, will scale later. Using Mongoose
as the ODM. No existing DB setup yet — starting from scratch. The
connection logic should live at /lib/db.ts and all models in /models/.

CONSTRAINTS:
Use a singleton pattern for the Mongoose connection — this is a
serverless environment on Vercel so I can't just call mongoose.connect()
at the top of every file, it'll open a new connection on every cold
start. Use the cached connection pattern (global.__mongoose trick).
Don't use any ORM other than Mongoose. Environment variable for the
URI should be MONGODB_URI pulled from .env.local. Models should use
TypeScript interfaces — define a separate interface for the document
type and use it in the schema. No any types anywhere. Keep each model
in its own file. Add indexes where they actually make sense — don't
over-index, only where queries will hit regularly.

EXAMPLES:
The data I need modelled:
  User      — name, email (unique), password (hashed), avatar, role
              (admin | member), createdAt
  Workspace — name, slug (unique), ownerId (ref: User), members
              (array of { userId, role, joinedAt }), createdAt
  Project   — title, description, workspaceId (ref: Workspace),
              createdBy (ref: User), status (active | archived),
              createdAt, updatedAt

Relationship rules:
  - A user can own multiple workspaces
  - A workspace has one owner but many members
  - A project always belongs to exactly one workspace

Connection pattern I want (roughly):
  let cached = global.mongoose
  if cached.conn exists → return it
  otherwise → connect, cache, return

For indexes, at minimum:
  User.email, Workspace.slug, Project.workspaceId
  — these will be queried constantly

OUTPUT:
Give me these files, all ready to drop in:
  /lib/db.ts              — the singleton connection logic
  /models/User.ts         — User schema + interface + model export
  /models/Workspace.ts    — Workspace schema + interface + model export
  /models/Project.ts      — Project schema + interface + model export
  /types/mongoose.d.ts    — global type declaration for the
                            cached mongoose connection

After the files, add a short usage example showing how to call
connectDB() inside an API route before running a query. No need
for a full API route — just 5-6 lines showing the pattern.
```

---

### 5. "Make the app faster"

Your CCEO rewrite:
```
CONTEXT:
Next.js 14 App Router, TypeScript, deployed on Vercel. Backend is
MongoDB Atlas via Mongoose, media files stored on Cloudinary. The app
is a project management SaaS — users land on a dashboard that loads
their workspaces, recent projects, and activity feed. Right now the
dashboard feels noticeably sluggish — takes about 4-5 seconds to become
interactive on a decent connection. No performance work has been done
yet, everything is basically default out of the box.

Current setup worth knowing:
  - Dashboard fetches workspaces, projects, and activity in three
    separate API calls fired one after another (not parallel)
  - All dashboard components are client components with useEffect fetching
  - Images from Cloudinary have no size constraints, loading full-res
    everywhere including thumbnails
  - No caching anywhere — every page visit hits MongoDB fresh
  - Fonts loaded via a plain <link> tag in layout.tsx, no preconnect
  - No loading states — the whole dashboard just blank-screens until
    everything resolves

CONSTRAINTS:
Stay within Next.js 14 App Router patterns — no custom server, no
Express layer. Don't switch out Mongoose or Cloudinary, just optimize
how they're used. Fixes should be incremental and safe — I need to
ship these without breaking existing functionality, so no big rewrites.
Prioritize changes with the highest visible impact first. If something
requires a significant refactor, flag it as a "phase 2" item rather
than doing it right now. All fixes must keep TypeScript happy — no
casting to any to dodge type errors.

EXAMPLES:
The exact symptoms users are reporting:
  - Dashboard blank for 4-5 seconds on first load
  - Switching between workspaces feels laggy
  - Profile avatars and project thumbnails load slowly, cause layout shift
  - On slow connections, the activity feed sometimes never loads
    because one failing fetch blocks the others

Things I've already tried:
  - Moving some fetches to server components (helped a little but
    didn't solve it)
  - Adding a loading spinner (it's there but the data still takes forever)

Rough priority I have in mind:
  1. Fix the waterfall API calls first — that's probably the biggest win
  2. Sort out the image situation
  3. Then caching, fonts, whatever else makes sense

OUTPUT:
Don't give me a generic "Next.js performance tips" article. Give me
specific, actionable changes for this exact setup, in priority order.
For each fix:
  - What the problem is in one sentence
  - The actual code change (before vs after where it helps)
  - Rough expected impact (e.g. "should cut dashboard load by ~1-2s")

Where relevant, show me the code change in context — not just
a snippet floating in space. End with a quick summary table:
Fix | Effort | Expected Impact
so I can decide what to tackle first with my team.
```

---

## Comparison Questions

After rewriting all 5, discuss with your partner:

1. Which instruction improved the most with CCEO?

2. Which element (C/C/E/O) was most impactful?
Ans - Constraints

3. What's the minimum you need to include for a "good enough" prompt?
Ans - Context, Constraints
