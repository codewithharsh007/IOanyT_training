# SDLC AI Workflow — Master Reference

---

## The Complete Chain

```
requirements.txt
       |
  PHASE 1 — PLANNING
  |
  STEP 1:  requirements.txt  ->  pm-role.md     ->  pm-output.md
                                                         |
  STEP 2:  pm-output.md      ->  ba-role.md     ->  ba-output.md
                                                         |
  STEP 3:  ba-output.md                                  |
           + Design Images   ->  ux-role.md    ->  ux-output.md
           (skip if backend-only)                        |
                                                         |
  STEP 4:  ba-output.md      ->  eng-role.md   ->  eng-output.md         (design doc)
           + ux-output.md                        ->  backend-structure.md  (backend blueprint)
                                                 ->  frontend-structure.md (frontend blueprint)
                                                     [only if ux-output.md provided]
                                                         |
  STEP 5:  ba-output.md      ->  qa-role.md    ->  qa-output.md
           + eng-output.md
           + ux-output.md
                                                         |
  STEP 6:  eng-output.md     ->  devops-role.md -> devops-output.md
           + qa-output.md
```

  REVIEW ALL PLANNING DOCS BEFORE CONTINUING

```
  PHASE 2 — CODE GENERATION
  |
  STEP 7:  backend-structure.md   ->  code-gen-role.md  ->  /[project]/backend/
           frontend-structure.md  ->                    ->  /[project]/frontend/
           + eng-output.md                              ->  docker-compose.yml
           + ba-output.md                               ->  README.md
           + qa-output.md                               ->  codegen-output.md
           + devops-output.md
           + ux-output.md         (frontend behaviour)
           + design images        (optional — visual reference for UI)
```

---

## All Role Files

| # | File | Role | Input | Output |
|---|------|------|-------|--------|
| 1 | pm-role.md | Product Manager | requirements.txt | pm-output.md |
| 2 | ba-role.md | Business Analyst | pm-output.md | ba-output.md |
| 3 | ux-role.md | UI/UX Designer | ba-output.md + design images | ux-output.md |
| 4 | eng-role.md | Engineer / Architect | ba-output.md + ux-output.md | eng-output.md + backend-structure.md + frontend-structure.md |
| 5 | qa-role.md | QA Engineer | ba-output.md + eng-output.md + ux-output.md | qa-output.md |
| 6 | devops-role.md | DevOps Engineer | eng-output.md + qa-output.md | devops-output.md |
| 7 | code-gen-role.md | Code Generator | structure files + all outputs + optional images | /backend /frontend README.md |

---

## Why eng-role Produces THREE Files

| File | Who Reads It | Purpose |
|------|-------------|---------|
| eng-output.md | Everyone | Human-readable design — APIs, schema, NFRs, assumptions |
| backend-structure.md | code-gen only | Backend file tree, function registry, packages, env vars |
| frontend-structure.md | code-gen only | Frontend file tree, component registry, props, hooks, routes |

---

## Project Folder Output

### Full Stack
```
/[project-name]/
  /backend/    ← generated from backend-structure.md
  /frontend/   ← generated from frontend-structure.md
  docker-compose.yml
  README.md
```

### Backend Only
```
/[project-name]/
  /backend/    ← generated from backend-structure.md
  docker-compose.yml
  README.md
```

---

## Mode: Backend Only (No Frontend)

Skip Step 3 (UX). eng-role produces only eng-output.md + backend-structure.md.
Add to requirements.txt:
  Mode: Backend/API Only — No frontend required.

---

## Key Rules

- ENG always produces 3 files for full stack, 2 files for backend only
- backend-structure.md and frontend-structure.md are separate — never merged
- code-gen creates /backend/ and /frontend/ as separate folders
- Design images are optional input to code-gen for visual layout reference
- filepath comment must always start from project root: backend/src/... or frontend/src/...
- On token limit: type "continue" — AI resumes, never restarts
- Never hardcode secrets — always .env.example
