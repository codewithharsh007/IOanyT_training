# Design Specification Document

## 1. Document Metadata

* Version: 2.0
* Date: 2026-04-28
* Author: UI/UX Designer
* Input Sources: ba-output.md (v1.0), Design Image(s): [QuickNotes Dashboard Mockup]
* Design Tool Reference: N/A

---

## 2. Design Analysis Summary

* Screens Identified:

  * Dashboard (Desktop Light)
  * Dashboard (Desktop Dark)
  * Dashboard (Mobile)
  * Registration UI
  * Login UI
  * Email Verification UI
  * Task Form UI

* Design Style:
  Modern SaaS dashboard, minimal, card-based UI, rounded corners, soft shadows, gradient CTAs

* Key Design Patterns:

  * Sidebar navigation (desktop)
  * Top search + filters
  * Card-based layout
  * Modal-based task creation
  * Mobile bottom navigation
  * Centered auth forms

* Conflicts / Notes:

  * “Notes” vs “Tasks” terminology mismatch
  * Admin panel not designed

---

## 3. Design Tokens

### Colors

| Token            | Value                                          | Usage           |
| ---------------- | ---------------------------------------------- | --------------- |
| Primary          | bg-indigo-600                                  | Primary actions |
| Gradient         | bg-gradient-to-r from-indigo-500 to-purple-600 | CTA             |
| Background Light | bg-gray-50                                     | App background  |
| Background Dark  | bg-gray-900                                    | Dark mode       |
| Card Light       | bg-white                                       | Cards           |
| Card Dark        | bg-gray-800                                    | Cards           |
| Text Primary     | text-gray-900 / text-white                     | Headings        |
| Text Secondary   | text-gray-500                                  | Subtext         |
| Border           | border-gray-200 / border-gray-700              | Dividers        |
| Success          | text-green-500                                 | Low priority    |
| Warning          | text-yellow-500                                | Medium          |
| Danger           | text-red-500                                   | High            |

---

### Typography

| Token   | Classes               | Usage       |
| ------- | --------------------- | ----------- |
| H1      | text-xl font-semibold | Titles      |
| H2      | text-lg font-medium   | Card titles |
| Body    | text-sm               | Content     |
| Caption | text-xs text-gray-400 | Meta        |

---

### Spacing

| Token  | Value                    |
| ------ | ------------------------ |
| Page   | p-6                      |
| Card   | p-4                      |
| Gap    | gap-4                    |
| Radius | rounded-xl / rounded-2xl |

---

## 4. Navigation & IA

### Routes

| Route      | Screen       | Access |
| ---------- | ------------ | ------ |
| /register  | Registration | Public |
| /login     | Login        | Public |
| /verify    | Email Verify | Public |
| /dashboard | Dashboard    | Auth   |
| /task-form | Task Modal   | Auth   |
| /admin     | Admin        | Admin  |

---

## 5. Screen Specifications

---

### S-001: Registration UI

* Mapped Story: US-001

Layout:

* `min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900`
* Card: `max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl`

Components:

* Title → `text-2xl font-semibold mb-2`
* Subtitle → `text-sm text-gray-500 mb-6`
* Input → `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500`
* Button → `w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg`
* Link → `text-indigo-600 text-sm`

States:

* Error → `text-red-500 text-xs`
* Loading → button disabled + spinner

---

### S-003: Login UI

* Mapped Story: US-003

Same layout as Registration

Extra:

* Error Banner → `bg-red-100 text-red-600 p-2 rounded-lg`
* Unverified → `bg-yellow-100 text-yellow-700`

---

### S-002: Email Verification UI

* Mapped Story: US-002

Layout:

* Center card

States:

* Success → `text-green-600`
* Error → `text-red-500`
* Button → `bg-indigo-600 text-white px-4 py-2 rounded-lg`

---

### S-004: Dashboard UI

* Mapped Story: US-012, US-006, US-009

Layout:

* Sidebar: `w-64`
* Main grid
* Right panel

Components:

* Sidebar
* Quick Add Button
* Search bar
* Tabs
* Task cards
* Task list
* Calendar

---

### S-005: Task Form UI (Modal)

* Mapped Story: US-005, US-007, US-009, US-010, US-011

Layout:

* Overlay → `fixed inset-0 bg-black/40 flex items-center justify-center`
* Modal → `max-w-lg w-full bg-white dark:bg-gray-800 p-6 rounded-2xl`

Components:

* Title Input → `border px-4 py-2 rounded-lg`
* Category Select → same
* Tags → flex chips
* Date → input
* Priority → select
* Save → gradient button
* Cancel → text button

Tag Chip:

* `bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs`

States:

* Error → red text
* Loading → disabled
* Success → toast `bg-green-500 text-white`

---

### S-006: Admin Panel

* Status: DESIGN PENDING

---

## 6. Component Library

### Button

* Primary → `bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg`
* Secondary → `bg-gray-100 text-gray-700`
* States → hover, disabled

---

### Input

* `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500`

---

### Card

* `bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg`

---

### Modal

* `bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6`

---

### Sidebar Item

* `px-3 py-2 rounded-lg hover:bg-gray-100 active:bg-indigo-100`

---

## 7. User Flows

### Registration Flow

Register → Email sent → Verify → Login

### Task Flow

Login → Dashboard → Quick Add → Save → View/Edit/Delete

---

## 8. Accessibility

| Area     | Recommendation  |
| -------- | --------------- |
| Contrast | WCAG AA         |
| Inputs   | labels + aria   |
| Buttons  | min height 44px |
| Colors   | not color-only  |

---

## 9. Gaps & Conflicts

| ID | Issue                   |
| -- | ----------------------- |
| G1 | Notes vs Tasks mismatch |
| G2 | Admin undefined         |
| G3 | Category rules unclear  |

---

## 10. Assumptions

| ID | Assumption         |
| -- | ------------------ |
| A1 | Notes = Tasks      |
| A2 | Quick Add = Modal  |
| A3 | Multi-tags allowed |

---

## 11. Pending Screens

| Screen | Status  |
| ------ | ------- |
| Admin  | Pending |

---

## 12. Validation Checklist

| Story  | Covered |
| ------ | ------- |
| US-001 | ✅       |
| US-002 | ✅       |
| US-003 | ✅       |
| US-005 | ✅       |
| US-006 | ✅       |
| US-007 | ✅       |
| US-008 | ⚠️      |
| US-009 | ✅       |
| US-010 | ✅       |
| US-011 | ✅       |
| US-012 | ✅       |
| US-015 | ❌       |

---

## 13. Traceability Matrix

| Screen | Story  |
| ------ | ------ |
| S-001  | US-001 |
| S-002  | US-002 |
| S-003  | US-003 |
| S-004  | US-012 |
| S-005  | US-005 |
| S-006  | US-015 |

