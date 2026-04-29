# `ux-output.md` — Design Specification Document

## 1. Document Metadata

- **Version:** 2.0
- **Date:** April 29, 2026
- **Author:** UI/UX Designer (Senior)
- **Input Sources:** Design images (11 files) — no `ba-output.md` provided; user stories inferred from images
- **Design Images Used:**

| Image File | Screen Covered | Viewport |
|------------|----------------|----------|
| img1.jpg | Landing / Marketing Page | Desktop + Mobile |
| img10.jpg | Login & Sign Up | Desktop + Mobile |
| img7.jpg | Dashboard | Desktop + Mobile |
| img5.jpg | Clients List | Desktop + Mobile |
| img9.jpg | Projects List | Desktop + Mobile |
| img6.jpg | My Projects (Dashboard View) | Desktop + Mobile |
| img8.jpg | Invoices (Card Grid) | Desktop + Mobile |
| img3.jpg | My Invoices (Table + Detail Panel) | Desktop + Mobile |
| img4.jpg | Time Logs (Empty + Skeleton) | Desktop + Mobile |
| img2.jpg | Settings | Desktop + Mobile |
| img11.jpg | 404 — Page Not Found | Desktop + Mobile |

- **Images Not Provided:** None — all 11 screens are covered

***

## 2. Design Analysis Summary

- **Total screens identified:** 19
- **Total images analyzed:** 11 (8 screens generated from design tokens)
- **Design style:** Clean minimal / SaaS dashboard — heavy use of white cards, soft gray backgrounds, and a single blue accent color
- **Key patterns:** Fixed left sidebar navigation (desktop), top tabs for primary section switching, card grid layouts for list views, split-panel detail view (invoices), toggle-based settings, status badge system
- **Color theme:** Light only
- **Conflicts with ba-output.md:** No `ba-output.md` was provided. All user stories are inferred from image analysis. If a BA document is added later, a re-run of this role is recommended to reconcile logic vs. visual decisions.

***

## 3. Design Tokens

### Colors

| Token | Description | Usage |
|-------|-------------|-------|
| Primary Blue | A medium-bright blue, not too dark, not neon | Primary action buttons, active sidebar item highlight, link text, toggle on-state, progress bars, status underline |
| White | Pure white | Card backgrounds, input backgrounds, main content area background |
| Page Background | Very light cool gray, almost white but clearly distinguishable | Page-level background behind cards |
| Dark Text | Near-black, very dark charcoal | Headings, body text, table data |
| Medium Gray | Mid-range gray | Secondary labels, placeholder text, subheadings, inactive nav items |
| Light Border Gray | Very light gray | Card borders, input borders, table row dividers |
| Skeleton Gray | Muted light gray | Loading skeleton placeholder blocks |
| Active Badge — Green | Soft green background with darker green text | "Active" status label |
| On Hold Badge — Blue | Soft blue-tinted background with blue text | "On Hold" status label |
| Completed Badge — Light green | Lighter, more muted green than Active | "Completed" status label |
| Overdue Badge — Yellow/Amber | Warm yellow-amber background with dark amber text | "Overdue" status label, shown with warning triangle icon |
| Draft Badge — Light Gray | Light gray background with dark gray text | "Draft" status label |
| Archived Badge — Light Pink | Soft pinkish background with muted red text | "Archived" status label |
| Processed Badge — Peach/Orange-tinted | Warm light orange background | "Processed" invoice status |
| Viewed Badge — Light Gray-Blue | Muted blue-gray background | "Viewed" payment status |
| Sidebar Active BG | Very light blue tint | Background behind currently active sidebar nav item |

### Typography

| Element | Description | Usage |
|---------|-------------|-------|
| Page Title | Large, bold, sans-serif | Page headings ("Dashboard", "Clients", "Settings") |
| Hero Headline | Extra large, heavy weight, sans-serif | Landing page main headline |
| Card Title | Medium-large, semi-bold | Invoice number (INV-001), project title, card headers |
| Section Heading | Medium, bold | Card section headings ("Profile Settings", "Notification Preferences") |
| Body Text | Regular weight, medium size | Descriptions, table cell content, form labels |
| Small/Caption | Small, regular or medium weight, gray | Subtext, helper labels, secondary metadata |
| Link Text | Primary blue, regular weight | "Forgot password?", "Contact Support", "Sign Up", "Log In" inline links |
| Logo Text | Bold, sans-serif, medium-large | "FreelanceFlow" in header/sidebar |
| Stat Number | Extra large, bold | "$328.00" outstanding invoice amount, "404" error code |
| Nav Item | Regular, medium size | Sidebar navigation labels |
| Badge/Tag | Small, semi-bold, uppercase or title case | Status badges throughout |

### Spacing & Density

| Area | Observed Pattern |
|------|-----------------|
| Page background-to-card | Generous outer padding on all sides; cards float on the gray background |
| Card internal padding | Comfortable — content does not feel crowded; clear whitespace around text and inputs |
| Sidebar nav items | Moderate vertical spacing between each item; icon + label on same row |
| Table rows | Compact but readable; clear row height with light dividers |
| Form fields | Fields stack vertically with clear label-above-input pattern; reasonable gap between fields |
| Dashboard widgets | Cards separated by clear gutters; roughly equal-width side-by-side panels |
| Mobile cards | Cards take full width with generous internal padding; stacked vertically with small gap between |
| Button padding | Wide horizontal padding relative to text; buttons feel substantial, not skinny |
| Section-to-section gap | Generous vertical gap between major page sections |

***

## 4. Navigation & Information Architecture

### Route Map

| Route | Screen | Access Level | Notes |
|-------|--------|-------------|-------|
| `/` | Landing Page | Public | Marketing page, no sidebar |
| `/login` | Login | Public | Auth page, no sidebar |
| `/signup` | Sign Up | Public | Auth page, no sidebar |
| `/dashboard` | Dashboard | Authenticated | Default post-login destination |
| `/clients` | Clients List | Authenticated | |
| `/projects` | Projects List | Authenticated | Card grid with filters |
| `/dashboard/projects` | My Projects | Authenticated | Dashboard-level project view |
| `/invoices` | Invoices (grid) | Authenticated | Card grid layout |
| `/invoices/my` | My Invoices | Authenticated | Table + side detail panel |
| `/time-logs` | Time Logs | Authenticated | Empty/loaded states |
| `/settings` | Settings | Authenticated | Profile + notifications |
| `*` | 404 Page | Public | Catch-all not-found route |

### Navigation Pattern

**Desktop:** Fixed left sidebar, approximately one-fifth of the viewport width. Sidebar contains the FreelanceFlow logo at the top, followed by vertical navigation links each with an icon and label. The active page is visually highlighted with a light blue background on the sidebar item. The main content area occupies the remaining space to the right. A sticky top bar within the content area contains contextual tabs (e.g., "My Projects" / "My Invoices"), a help icon, a notification bell icon, and a circular user avatar on the right.

**Mobile:** The sidebar collapses entirely. A hamburger menu icon (three horizontal lines) appears in the top-left of the header. The FreelanceFlow logo appears next to it. Primary action buttons (e.g., "Add Client", "Create Project", "Create Invoice", "Log Time") are placed in the top-right corner. Navigation is assumed to open as a drawer or sheet on hamburger tap.

***

## 5. Screen Specifications

***

### Screen S-001: Landing Page

**Reference Images:**
- Desktop: img1.jpg
- Mobile: img1.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-LAND-01 (inferred — marketing/conversion page for new visitors)
**Route:** `/`
**Access:** Public

**Layout Description:**
Full-width page with no sidebar. A top navigation bar spans the full width: logo on the left, navigation links ("Features", "Pricing") in the center, and a "Log In" button on the right. Below the nav is a hero section with a large bold headline on the left, a CTA button below it, and a laptop/dashboard screenshot mockup on the right. The lower portion shows three feature highlight cards in a horizontal row, each with an icon, heading, and short description.

On mobile, the top nav collapses to just the logo on the left and a hamburger icon on the right. The hero headline moves to full width and stacks above the mockup image. The feature cards stack vertically.

**Components:**

#### Component: Top Navigation Bar
- **What it is:** Horizontal navigation bar
- **Where it appears:** Pinned to the top of the page, full width
- **What it shows:** FreelanceFlow logo (icon + wordmark) on left; "Features" and "Pricing" as text links in center; "Log In" as a primary blue button on right
- **How it behaves:** "Log In" navigates to `/login`; nav links scroll to or navigate to sections
- **Variants/States:** Default; mobile collapses to logo + hamburger

#### Component: Hero Headline
- **What it is:** Large marketing headline text block
- **Where it appears:** Left half of hero section, vertically centered
- **What it shows:** "The simplest client & invoice portal for modern freelancers." — bold, very large, multi-line
- **How it behaves:** Static text
- **Variants/States:** Default only

#### Component: CTA Button — Start Managing Better
- **What it is:** Primary action button
- **Where it appears:** Below the hero headline
- **What it shows:** "Start managing better" — white text on blue background, rounded corners, left-aligned
- **How it behaves:** Navigates to `/signup`
- **Variants/States:** Default; hover darkens slightly

#### Component: Hero Mockup Image
- **What it is:** Product screenshot / device mockup
- **Where it appears:** Right half of hero section
- **What it shows:** A laptop rendering of the FreelanceFlow dashboard
- **How it behaves:** Static decorative image
- **Variants/States:** Default only

#### Component: Feature Cards Row
- **What it is:** Row of three equal-width informational cards
- **Where it appears:** Below the hero section
- **What it shows:** Three cards — (1) "Manage Clients & Projects" with people icon; (2) "Track Time Effortlessly" with clock icon; (3) "Professional Invoicing" with document icon — each with a short description below the heading
- **How it behaves:** Static; possibly clickable to scroll to a feature section
- **Variants/States:** Default; hover may show subtle elevation

**Mobile Behavior:**
Logo + hamburger in header. Hero headline takes full width, large and bold. CTA button is full width below the headline. Mockup image appears below the headline, also full width. Feature cards stack vertically, each full width.

**Empty State:** N/A — static marketing page

**Error State:** N/A

**Loading State:** N/A — static content

**Design Notes:** The design uses a very clean two-tone layout — white/near-white background with a single blue accent. The mockup image is likely a PNG with transparent or white background dropped onto the hero. The feature card icons are outlined style matching the overall minimal aesthetic.

**Conflicts / Gaps:** None identified

***

### Screen S-002: Login & Sign Up

**Reference Images:**
- Desktop: img10.jpg
- Mobile: img10.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-AUTH-01 (inferred — user authentication)
**Route:** `/login` and `/signup`
**Access:** Public

**Layout Description:**
On desktop, the page is split into two panels side by side. The left panel is a gradient or lightly tinted background with the FreelanceFlow logo icon and a bold headline: "Streamline your freelance business" with a short subheading below it. The right panel contains two stacked white cards: the top card is the Login form, the bottom card is the Sign Up form. Both cards are visible simultaneously on this screen (this may represent two separate route pages, or a combined auth page).

On mobile, there is no left branding panel — only the FreelanceFlow logo at the top, followed by the Login card, followed by the Sign Up card, stacked vertically and scrollable.

**Components:**

#### Component: Auth Branding Panel (Desktop Only)
- **What it is:** Decorative left panel
- **Where it appears:** Left half of the desktop page
- **What it shows:** FreelanceFlow "FF" logo icon, bold heading "Streamline your freelance business", short subtext paragraph
- **How it behaves:** Static, not interactive
- **Variants/States:** Default only

#### Component: Login Card
- **What it is:** White card containing the login form
- **Where it appears:** Top of the right panel (desktop); top of page content (mobile)
- **What it shows:** "Log In" heading; email input with placeholder "email@your.email.com"; password input with placeholder "Password" and show/hide eye icon; "Forgot password?" link aligned right; "Log In" primary button (full width); "Don't have an account? Sign Up" link below button
- **How it behaves:** On submit, validates fields and authenticates user; successful login redirects to `/dashboard`; "Forgot password?" triggers password reset flow; "Sign Up" link navigates to or scrolls to the Sign Up card
- **Variants/States:** Default; field focused (blue border highlight); field error (red border + error message below field); button loading state (spinner + disabled); button default

#### Component: Sign Up Card
- **What it is:** White card containing the registration form
- **Where it appears:** Below the Login card on right panel (desktop); below Login card (mobile)
- **What it shows:** "Sign up" heading; Name input; Email input with placeholder "Email@ln.gmail.com"; Password input with eye toggle; "Sign Up" primary button (full width); "Already have an account? Log In" link
- **How it behaves:** On submit, validates all fields and creates account; redirects to `/dashboard` on success; "Log In" link navigates to Login card
- **Variants/States:** Default; field focused; field error; button loading; button default

#### Component: Password Input with Toggle
- **What it is:** Specialized text input
- **Where it appears:** Password field in both Login and Sign Up cards
- **What it shows:** Masked password text; eye icon on the right side of the input
- **How it behaves:** Eye icon click toggles between masked and visible text
- **Variants/States:** Masked (default); revealed; focused; error

**Mobile Behavior:**
FreelanceFlow logo header at top. Both cards stacked full-width below. No left branding panel. Inputs are full width. Buttons are full width.

**Empty State:** N/A — always shows the forms

**Error State:** Inline field validation errors appear below each affected input field in red text. Button remains disabled or shows error toast on server-side failure.

**Loading State:** Submit button shows a loading spinner and becomes disabled while the auth request is in progress.

**Design Notes:** The left panel background appears to be a very soft gradient — light blue-white, not solid. The cards have subtle shadow and rounded corners. Both cards share identical input styling.

**Conflicts / Gaps:** It's unclear if `/login` and `/signup` are the same page or separate routes. The design shows both forms on one page. Assumed to be the same page with anchor scrolling or tab switching.

***

### Screen S-003: Dashboard

**Reference Images:**
- Desktop: img7.jpg
- Mobile: img7.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-DASH-01 (inferred — freelancer overview of earnings, invoices, and projects)
**Route:** `/dashboard`
**Access:** Authenticated

**Layout Description:**
Standard two-panel layout with the fixed sidebar on the left. "Dashboard" is highlighted as the active nav item. The main content area has a sticky header with "My Projects" and "My Invoices" as tab links, plus bell and avatar on the right. The content area begins with the page title "Dashboard" in large bold text. Below that is a two-column layout: the left column holds a "Total Earnings (This Month)" card with a bar chart; the right column holds two stacked cards — "Outstanding Invoices" and "Active Projects". Below these, a full-width "Recent Invoices" table card spans the entire content area.

On mobile, the sidebar is hidden. A hamburger icon appears in the header left. All cards stack vertically in a single column: Total Earnings chart → Outstanding Invoices → Active Projects → Recent Invoices.

**Components:**

#### Component: Sidebar Navigation
- **What it is:** Fixed vertical navigation panel
- **Where it appears:** Left edge of the screen, full height, desktop only
- **What it shows:** FreelanceFlow logo (icon + wordmark) at top; nav items: Dashboard (grid icon), Clients (person icon), Projects (folder icon), Projects (table icon — possibly a second projects view), Invoices (document icon), Time Logs (clock icon)
- **How it behaves:** Each item navigates to its respective route; active item has a light blue background highlight
- **Variants/States:** Default; active (highlighted); hover (subtle background change)

#### Component: Top Content Header Bar
- **What it is:** Sticky horizontal bar within the main content area
- **Where it appears:** Top of the main content area, below the browser/app frame
- **What it shows:** "My Projects" and "My Invoices" tab links; active tab has a blue underline; help icon (?), bell notification icon, and circular avatar photo on the right
- **How it behaves:** Tab clicks switch the primary list view; bell opens notifications; avatar opens profile/settings menu
- **Variants/States:** Tab default; tab active (underline); notification bell with/without unread badge

#### Component: Total Earnings Bar Chart Card
- **What it is:** Data visualization card
- **Where it appears:** Left column of the main content area, top section
- **What it shows:** "Total Earnings (This Month)" heading; "All terms" dropdown selector; vertical bar chart with months on X-axis (Jan through Dec) and dollar amounts on Y-axis (0 to $2500); bars are primary blue
- **How it behaves:** Dropdown filters the time range; bars are presumably hoverable to show exact values as tooltip
- **Variants/States:** Default; loading skeleton; empty (no data)

#### Component: Outstanding Invoices Card
- **What it is:** Summary stat card
- **Where it appears:** Top of the right column
- **What it shows:** "Outstanding Invoices" heading with an "Overdue" amber badge; a count number (e.g., "6"); "Total amount:" followed by a large bold dollar figure (e.g., "$328.00")
- **How it behaves:** Likely navigates to `/invoices` on click or shows a filtered view
- **Variants/States:** Default; overdue state (amber badge visible); no overdue (badge hidden or green)

#### Component: Active Projects Card
- **What it is:** Summary stat card
- **Where it appears:** Below Outstanding Invoices card in the right column
- **What it shows:** "Active Projects" heading; a people/group icon on the right; large count number (e.g., "2")
- **How it behaves:** Likely navigates to `/projects` on click
- **Variants/States:** Default

#### Component: Recent Invoices Table
- **What it is:** Data table card
- **Where it appears:** Below the two-column stats section, full width
- **What it shows:** "Recent Invoices" heading; "All terms" dropdown on the right; columns: Invoice #, Client (email), Client (name), Date, Status; status values shown as color-coded badges (Processed = peach, Overdue = amber/yellow)
- **How it behaves:** Row click likely navigates to invoice detail; dropdown filters the list
- **Variants/States:** Default; loading skeleton; empty state (no invoices message)

**Mobile Behavior:**
Hamburger icon in header, logo displayed. All widgets stack in a single column, each full width. Bar chart is smaller but still visible. Recent Invoices shows in a simplified card/list form rather than a full table. "All Items" dropdown visible above the mobile invoices list.

**Empty State:** Charts show no bars; stat cards show "0"; Recent Invoices shows an empty message like "No invoices yet"

**Error State:** Cards show an error message or retry prompt if data fails to load

**Loading State:** Each card shows a skeleton loading state with gray placeholder bars and blocks

**Design Notes:** The bar chart bars are all the same primary blue color. No gradient or multi-color bars. The chart has horizontal gridlines. Stats cards have slightly larger text for the dollar amount to draw attention. The avatar in the header appears to be a real user photo (circular crop).

**Conflicts / Gaps:** The sidebar appears to have two "Projects" items — one with a folder icon and one with a table/grid icon. This may represent "Projects" (list) and "My Projects" (dashboard view). Clarification needed.

***

### Screen S-004: Clients List

**Reference Images:**
- Desktop: img5.jpg
- Mobile: img5.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-CLIENT-01 (inferred — view and manage client list)
**Route:** `/clients`
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. "Clients" is the active sidebar item. The content area shows "Clients" as the page title on the left and an "Add Client" primary button on the right. Below the title row is a toolbar with a search input on the left and two filter dropdowns ("All terms") on the right. Below the toolbar is a data table with sortable column headers.

On desktop, a context menu (dropdown) is shown expanded on one row, showing options: "Invite" and "Archive" — indicating row-level actions. The Edit action appears inline as a link on another row, suggesting hover reveals the edit option.

On mobile, clients are displayed as cards in a vertical stack. Each card shows the client name, company, email, and phone number. A three-dot ("…") menu icon on the top right of each card opens a dropdown with Edit, Invite, and Archive actions.

**Components:**

#### Component: Page Header Row
- **What it is:** Title + primary action row
- **Where it appears:** Top of the content area, below the top bar
- **What it shows:** "Clients" page title; "Add Client" blue primary button aligned right
- **How it behaves:** "Add Client" opens a modal or navigates to a create-client form
- **Variants/States:** Default

#### Component: Table Toolbar
- **What it is:** Search and filter bar above the table
- **Where it appears:** Below the page header row
- **What it shows:** Search input with magnifying glass icon and placeholder "Search"; two "All terms" filter dropdowns on the right
- **How it behaves:** Search filters the table in real-time or on submit; dropdowns filter by status or company
- **Variants/States:** Empty; active search (text entered); filter applied (dropdown shows selected value)

#### Component: Clients Table
- **What it is:** Data table
- **Where it appears:** Main content area below toolbar
- **What it shows:** Columns: Client Name (sortable, with up arrow), Company, Email, Phone, Status, Actions; rows show client data; Status column shows Active (green badge) or Archived (pink badge)
- **How it behaves:** Column headers are sortable on click; row click may open client detail; Actions column shows "Edit" as a link, plus a dropdown for "Invite" and "Archive"
- **Variants/States:** Default; row hover (subtle highlight); sorted column (arrow direction changes); empty (no results)

#### Component: Row Action Dropdown
- **What it is:** Context menu
- **Where it appears:** Triggered from the Actions column on a table row
- **What it shows:** Options: "Invite" (with person-plus icon), "Archive" (with trash/archive icon in red/danger color)
- **How it behaves:** Appears on click of the "…" or action trigger; dismisses on outside click or escape; "Archive" requires confirmation
- **Variants/States:** Open; closed

#### Component: Status Badge
- **What it is:** Small colored label
- **Where it appears:** Status column in the table; on mobile cards
- **What it shows:** "Active" (green), "Archived" (pink), or other statuses
- **How it behaves:** Static label
- **Variants/States:** Active, Archived

**Mobile Behavior:**
No table — replaced with stacked client cards. Each card shows client name (bold, larger), company name, email, phone. A "…" three-dot icon on the top right of each card opens a dropdown with Edit, Invite, and Archive actions. "Add Client" button in the top-right header. Search and filter are likely accessible via a toolbar below the header.

**Empty State:** Table or card list shows an empty state message with a prompt to "Add your first client" and the "Add Client" button

**Error State:** Error message shown above the table or in place of the list

**Loading State:** Table rows show skeleton gray bars in place of content

**Design Notes:** The "Edit" action appears as a blue link text with a pencil icon directly in the table row, while "Invite" and "Archive" are in a dropdown — suggesting Edit is the primary action and others are secondary. Archive icon uses a danger red color.

**Conflicts / Gaps:** None

***

### Screen S-005: Projects List

**Reference Images:**
- Desktop: img9.jpg
- Mobile: img9.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-PROJ-01 (inferred — view and manage projects with progress tracking)
**Route:** `/projects`
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. The content area shows "Projects" as the page title on the left and a "Create Project" primary button on the right. A filter tab row below shows: "Active", "Draft", "Completed", and "Archived" as toggleable tab filters, with a search input on the left. Below is a card grid — three columns on desktop — where each card represents one project.

On mobile, cards stack in a single column.

**Components:**

#### Component: Page Header Row
- **What it is:** Title + action row
- **Where it appears:** Top of content area
- **What it shows:** "Projects" title; "Create Project" blue button on right
- **How it behaves:** Button opens project creation form or modal
- **Variants/States:** Default

#### Component: Filter Tab Bar
- **What it is:** Horizontal filter tabs
- **Where it appears:** Below the page title
- **What it shows:** Tabs: "Active" (default), "Draft", "Completed", and "Archived ▼" (last one has a dropdown arrow, suggesting it's a dropdown for additional filters). Search input on the left
- **How it behaves:** Clicking a tab filters the card grid; active tab appears visually selected
- **Variants/States:** Tab default; tab active; tab hover

#### Component: Project Card
- **What it is:** Summary card for a single project
- **Where it appears:** In the card grid
- **What it shows:** Project title (bold); Client Name; status badge (Active, Draft, Archived); "Progress" label with a percentage (e.g., 70%, 50%, 30%) and a horizontal progress bar below it; "Deadline: [date]"; "X Invoices" count and "XX Hours" count at the bottom in a two-column row
- **How it behaves:** Card is clickable and navigates to the project detail view
- **Variants/States:** Active (green badge), Draft (gray badge), Archived (pink badge), Completed; hover state (subtle shadow elevation)

#### Component: Progress Bar
- **What it is:** Horizontal progress indicator
- **Where it appears:** Inside each project card
- **What it shows:** A blue-filled bar proportional to the percentage value
- **How it behaves:** Static visual, filled left-to-right
- **Variants/States:** Various fill levels (20% through 90% visible in designs)

**Mobile Behavior:**
Single-column card stack. Each card takes full width. Progress bar, deadline, invoice count, and hours count all remain visible. Status badge remains on the top right of each card. Filter tabs likely horizontally scrollable on mobile.

**Empty State:** Grid area shows an empty message with a "Create Project" prompt

**Error State:** Error message in place of the grid

**Loading State:** Skeleton cards (gray rectangular blocks) replace real cards

**Design Notes:** Progress bar color matches the primary blue. The archived and draft cards have slightly muted status badges compared to active ones. The card grid is 3 columns on desktop, implied 1 column on mobile.

**Conflicts / Gaps:** None

***

### Screen S-006: My Projects (Dashboard View)

**Reference Images:**
- Desktop: img6.jpg
- Mobile: img6.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-DASH-02 (inferred — simplified project view from the dashboard's "My Projects" tab)
**Route:** `/dashboard` (active tab: My Projects)
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. "Dashboard" is the active nav item. The header tabs show "My Projects" as the active tab (underlined in blue). The content area shows "My Projects" heading and an "Active projects" subheading below it. Projects are displayed as a card grid — three columns on desktop. Cards show project title, client name, status badge, and a short description. One card in the design is shown in an expanded or selected state that additionally displays "Total hours logged" and "Total billed" stats at the bottom.

On mobile, cards stack in a single column, each showing title, client, status badge, and description.

**Components:**

#### Component: My Projects Page Header
- **What it is:** Title + subtitle row
- **Where it appears:** Top of content area
- **What it shows:** "My Projects" as bold page title; "Active projects" as a smaller subtitle below
- **How it behaves:** Static
- **Variants/States:** Default

#### Component: Project Summary Card (Dashboard Variant)
- **What it is:** Simpler project card without progress bar
- **Where it appears:** Card grid
- **What it shows:** Project title (bold, large); Client Name; status badge (Active, On Hold, Completed); "Description" label with short description text
- **How it behaves:** Clickable; navigates to project detail; expanded/selected state shows additional stats
- **Variants/States:** Default; selected/expanded (shows hours + billed)

#### Component: Project Expanded Stats (On Selected Card)
- **What it is:** Additional data row within an expanded project card
- **Where it appears:** Bottom of the selected project card
- **What it shows:** "Total hours logged" with a number (e.g., 56); "Total billed" with a dollar amount (e.g., $310.00)
- **How it behaves:** Appears when a card is selected or expanded
- **Variants/States:** Collapsed (hidden); expanded (visible)

**Mobile Behavior:**
Single-column card stack. Cards show title, client name, badge, and description. No expanded stats visible in default mobile card state (accessible via tap).

**Empty State:** Empty message: "You have no active projects" with a link to create one

**Error State:** Error banner or inline message

**Loading State:** Skeleton card grid

**Design Notes:** The "On Hold" badge uses a soft blue background in this view. "Completed" uses a soft green. The card for the expanded/selected state appears slightly larger or has a visible border differentiation.

**Conflicts / Gaps:** The relationship between "My Projects" at `/dashboard` and "Projects" at `/projects` is unclear. Dashboard view appears to be a simplified overview while `/projects` has filtering, progress bars, and full management capabilities.

***

### Screen S-007: Invoices (Card Grid)

**Reference Images:**
- Desktop: img8.jpg
- Mobile: img8.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-INV-01 (inferred — view all invoices in card grid format)
**Route:** `/invoices`
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. "Invoices" is the active nav item. The content area shows "Invoices" as the page title and a "Create Invoice" primary button on the right. Below the title is a toolbar with a search input on the left and filter tabs on the right: "Draft", "Sent", "Paid", and an "Overdue" dropdown. Below is a card grid with two rows of three cards each on desktop.

On mobile, cards stack in a single column.

**Components:**

#### Component: Invoice Filter Tabs
- **What it is:** Horizontal filter tab row
- **Where it appears:** Below the page title, to the right of the search input
- **What it shows:** "Draft", "Sent", "Paid", "Overdue ▼" tabs; "Overdue" has a dropdown arrow for sub-filter options
- **How it behaves:** Clicking a tab filters the grid; active tab appears highlighted
- **Variants/States:** Default; active; hover

#### Component: Invoice Card
- **What it is:** Card representing a single invoice
- **Where it appears:** Card grid (2 rows × 3 columns on desktop)
- **What it shows:** Invoice number (e.g., "INV-001") bold and large; status badge top-right (Overdue amber, Draft gray, Archived pink); "Client Name" row; "Issue Date" and "Due Date" side by side; "Total amount" label with dollar value (e.g., $388.00)
- **How it behaves:** Clicking navigates to invoice detail or opens a detail panel
- **Variants/States:** Overdue (amber badge), Draft (gray badge), Archived (pink badge), Sent, Paid; hover elevation

**Mobile Behavior:**
Single-column invoice cards, full width. All same fields visible. "Create Invoice" button in the top-right of the header. Filter tabs likely scrollable horizontally.

**Empty State:** Grid shows empty message with "Create Invoice" prompt

**Error State:** Error message in place of grid

**Loading State:** Skeleton cards

**Design Notes:** Invoice status badge placement is consistently in the top-right of each card. Overdue cards have the warning triangle icon next to the badge text. Cards have rounded corners and a subtle shadow or border.

**Conflicts / Gaps:** None

***

### Screen S-008: My Invoices (Table + Detail Panel)

**Reference Images:**
- Desktop: img3.jpg
- Mobile: img3.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-INV-02 (inferred — view invoices list with inline detail and payment management)
**Route:** `/invoices/my` (or accessible via "My Invoices" tab on dashboard)
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. "My Invoices" tab is active in the top header. The main content area uses a split-panel layout: the left panel (approximately 40% width) is a table listing invoices; the right panel (approximately 60% width) shows the full detail of the currently selected invoice. The selected invoice (INV-003) shows a mini-invoice document within the right panel with all line items, totals, and payment status. A "Download PDF" button anchors to the bottom of the detail panel.

On mobile, the list and detail are separate views — cards are shown initially; tapping a card expands or navigates to the full invoice document view with the overdue badge.

**Components:**

#### Component: Invoice List Table (Left Panel)
- **What it is:** Compact data table
- **Where it appears:** Left panel of the split view
- **What it shows:** Header row: "Invoices"; columns: Invoice #, Client (email), Client (name); rows show invoice data; selected row is visually highlighted
- **How it behaves:** Clicking a row loads that invoice in the right detail panel
- **Variants/States:** Default; selected row (highlighted); hover

#### Component: Invoice Detail Panel (Right Panel)
- **What it is:** Full invoice document viewer
- **Where it appears:** Right panel of the split view
- **What it shows:** Invoice number (INV-003) + status badge (Overdue, amber with warning triangle) in the header row; "Freelancer" name and "Company Name"; "Client Details" section with Client Name, email, Invoice Number, Issue Date, Due Date; a line items table with columns: Description, Quantity, Unit Price, Total; summary rows: Subtotal, Tax, Total Amount Paid, Balance Due; "Payment Status" section showing "Viewed" and "Overdue" badges side by side; "Download PDF" button at the bottom
- **How it behaves:** Read-only display. "Download PDF" triggers a file download. Status badges reflect real-time payment state.
- **Variants/States:** Overdue; Paid; Viewed; loading (when switching between invoices)

#### Component: Payment Status Section
- **What it is:** Status indicator row
- **Where it appears:** Below the line items table in the detail panel
- **What it shows:** "Payment Status" label; two badges: "Viewed" (muted blue-gray) and "Overdue" (amber with triangle icon)
- **How it behaves:** Static display; badges reflect current invoice state
- **Variants/States:** Viewed, Paid, Overdue, Draft, Sent

#### Component: Download PDF Button
- **What it is:** Secondary action button
- **Where it appears:** Bottom of the invoice detail panel
- **What it shows:** Download icon (arrow-down) + "Download PDF" text; outlined/secondary style (not filled blue)
- **How it behaves:** Triggers PDF generation and download
- **Variants/States:** Default; loading (while PDF generates); success

**Mobile Behavior:**
Mobile shows the list as stacked cards initially. Each card shows invoice number, status badge (Active, On Hold, Overdue), client name, description. Tapping a card navigates to the full invoice detail view (the document viewer). The detail view on mobile shows the mini-invoice document with the overdue badge at the top, line items, and Download PDF button at the bottom.

**Empty State:** Left panel shows "No invoices yet" message; right panel shows an empty placeholder or prompt to select an invoice

**Error State:** Error banner if invoice fails to load

**Loading State:** Right panel shows skeleton layout while invoice detail loads

**Design Notes:** The line items table within the invoice detail panel has a clean, document-like layout — not the same style as the app tables. It feels like a preview of the actual invoice PDF. The "Download PDF" button uses a lighter/outlined style compared to the primary blue action buttons elsewhere.

**Conflicts / Gaps:** The same route is referenced as both `/invoices` (card grid, img8) and the "My Invoices" tab visible in the header of the dashboard. These may be the same route accessed differently, or two distinct views of invoices. Both should be implemented.

***

### Screen S-009: Time Logs

**Reference Images:**
- Desktop: img4.jpg
- Mobile: img4.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-TIME-01 (inferred — track and view time logged against projects)
**Route:** `/time-logs`
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. "Time Logs" is the active nav item with a clock icon. The top content bar shows "My Projects" and "My Invoices" tabs, plus a "Log Time" primary blue button on the far right. The page title "Time Logs" appears below. The main content area shows two cards side by side: the left card shows the "Empty State" and the right card shows the "Loading Skeleton" state — both are documentation states, not intended to display simultaneously in production.

On mobile, the same two states are shown stacked vertically.

**Components:**

#### Component: Log Time Button
- **What it is:** Primary action button
- **Where it appears:** Top-right of the content header bar
- **What it shows:** "Log Time" — white text on blue background, rounded corners
- **How it behaves:** Opens a modal or form to log a new time entry
- **Variants/States:** Default; hover; loading (after submit)

#### Component: Empty State Display
- **What it is:** Empty state illustration card
- **Where it appears:** Left card area when no time logs exist
- **What it shows:** A large clock illustration (outlined, muted blue/gray); "No Time Logs Yet" bold heading; short subtext "There are no time logs in your critest and ratens." (text appears placeholder-like); a "Log Time" blue button centered below the text
- **How it behaves:** "Log Time" button opens the time logging form/modal
- **Variants/States:** Default empty state

#### Component: Loading Skeleton
- **What it is:** Loading placeholder display
- **Where it appears:** Right card area while time log data is loading
- **What it shows:** Multiple horizontal gray bars of varying widths arranged in rows, simulating a table or list loading state. Three columns visible with rows of bars.
- **How it behaves:** Animated shimmer effect (pulse/fade) to indicate loading
- **Variants/States:** Loading (shimmer animation active)

**Mobile Behavior:**
"Log Time" button in the top-right header. Empty state card takes full width: clock icon, heading, subtext, and Log Time button centered. Loading skeleton card appears below the empty state card.

**Empty State:** The empty state component itself is the primary state described above — clock icon, heading, and "Log Time" CTA

**Error State:** Error message with a retry option

**Loading State:** The loading skeleton shown in the design — gray shimmer bars in place of actual data rows

**Design Notes:** The clock illustration in the empty state uses a thin outline style matching the compass/map illustration on the 404 page — consistent decorative illustration style across the app. The skeleton bars have rounded ends, suggesting they represent individual text elements.

**Conflicts / Gaps:** The actual populated state of the Time Logs page (when data exists) is not shown in any image. The data table or list format for populated time log entries needs to be inferred from the loading skeleton structure (3 columns, multiple rows). Recommend adding a populated state image.

***

### Screen S-010: Settings

**Reference Images:**
- Desktop: img2.jpg
- Mobile: img2.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-SET-01 (inferred — user manages profile info and notification preferences)
**Route:** `/settings`
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. "Settings" is the active nav item with a gear icon. The content area shows "Settings" as the page title. Below the title, two white cards are placed side by side: the left card is "Profile Settings" and the right card is "Notification Preferences". The two cards are roughly equal in height and width.

On mobile, the sidebar is hidden and the two cards stack vertically — Profile Settings first, Notification Preferences below.

**Components:**

#### Component: Profile Settings Card
- **What it is:** Form card
- **Where it appears:** Left card in the settings content area
- **What it shows:** "Profile Settings" card heading; "Name" label with a text input (prefilled example: "Jeen Marius"); "Email" label with a text input (prefilled example: "eiatoye&ln@gmail.com"); "Company Name" label with an empty text input; "Save Changes" primary blue full-width button at the bottom
- **How it behaves:** Inputs are editable; "Save Changes" submits the form and updates the user profile; shows success/error feedback
- **Variants/States:** Default; field focused; field error; save button loading; save success toast

#### Component: Notification Preferences Card
- **What it is:** Toggle list card
- **Where it appears:** Right card in the settings content area
- **What it shows:** "Notification Preferences" card heading; a list of toggle rows — each row has a label on the left and an on/off toggle switch on the right. Toggles visible: "Email on Invoice View", "Email on Payment Received", "Overdue Invoice Alerts", "Email on Invoice Permittations" (likely "Permissions"), "Email on Payment Received" (repeated), "Overdue Invoice Alerts" (repeated), "Email on Time Logs"
- **How it behaves:** Each toggle independently switches email notification on or off; changes are auto-saved or require a save action
- **Variants/States:** Toggle on (blue), toggle off (gray); row hover (subtle highlight)

#### Component: Toggle Switch
- **What it is:** Boolean on/off input control
- **Where it appears:** Each row in the Notification Preferences card
- **What it shows:** A pill-shaped toggle; "on" state shows blue background with white circle on the right; "off" state shows gray background with white circle on the left
- **How it behaves:** Click/tap toggles the state
- **Variants/States:** On (blue), Off (gray), Disabled

**Mobile Behavior:**
Profile Settings card full width with all three inputs stacked. Save Changes button full width. Notification Preferences card below, also full width. Toggle rows remain in their label + toggle layout. Both cards have comfortable internal padding.

**Empty State:** N/A — settings page always shows the forms

**Error State:** Inline validation errors below form fields; toast or banner for save failures

**Loading State:** Inputs become disabled and button shows loading spinner while save request is in flight; page initially loads with skeleton text in inputs if profile data is async

**Design Notes:** All seven notification toggles appear to be in the "on" (blue) state in the design — suggesting this is the default/recommended state. The toggle style is a standard pill toggle. The Save Changes button is identical in style to primary buttons throughout the app.

**Conflicts / Gaps:** Some notification labels appear duplicated in the image (e.g., "Email on Payment Received" and "Overdue Invoice Alerts" each appear twice). This may be placeholder content in the design. Final label list should be confirmed with the product team.

***

### Screen S-011: 404 — Page Not Found

**Reference Images:**
- Desktop: img11.jpg
- Mobile: img11.jpg
- Tablet: Not provided — use desktop layout at reduced width

**Mapped Story:** US-ERR-01 (inferred — graceful handling of unknown routes)
**Route:** `*` (catch-all)
**Access:** Public (renders regardless of auth state)

**Layout Description:**
Minimal centered layout. The top navigation bar is present (same as authenticated state: logo on the left, help icon, bell, and avatar on the right). The main content area is a single centered column with an illustration, error code, message, and two action buttons — all vertically centered on the page with generous whitespace above and below.

On mobile, the same centered layout but narrower. The navigation bar shows only the FreelanceFlow logo on the left (no icons/avatar visible in the mobile header). The illustration is slightly smaller but still prominent.

**Components:**

#### Component: Error Illustration
- **What it is:** Decorative SVG or image illustration
- **Where it appears:** Top of the centered content column
- **What it shows:** A compass (round, blue) overlapping a folded map (outlined, blue/gray) — both in the same outlined illustration style used throughout the app
- **How it behaves:** Static decorative element
- **Variants/States:** Default only

#### Component: Error Code
- **What it is:** Large text display
- **Where it appears:** Below the illustration
- **What it shows:** "404" in very large, bold, dark text
- **How it behaves:** Static
- **Variants/States:** Default only

#### Component: Error Heading
- **What it is:** Heading text
- **Where it appears:** Below the 404 number
- **What it shows:** "Page Not Found" in bold, medium-large text
- **How it behaves:** Static
- **Variants/States:** Default only

#### Component: Error Subtext
- **What it is:** Body text
- **Where it appears:** Below the "Page Not Found" heading
- **What it shows:** "It seems you've wandered off the track. Let's get you back to the flow." in regular weight, gray/medium-dark text, centered
- **How it behaves:** Static
- **Variants/States:** Default only

#### Component: Go to Dashboard Button
- **What it is:** Primary action button
- **Where it appears:** Below the subtext, left of center in the button row
- **What it shows:** "Go to Dashboard" — white text on blue background, rounded corners
- **How it behaves:** Navigates to `/dashboard`
- **Variants/States:** Default; hover

#### Component: Contact Support Link
- **What it is:** Inline text link
- **Where it appears:** To the right of the "Go to Dashboard" button
- **What it shows:** "Contact Support" in primary blue link style
- **How it behaves:** Navigates to a support contact form or opens an email link
- **Variants/States:** Default; hover (underline)

**Mobile Behavior:**
Same centered layout. Illustration slightly smaller. "Go to Dashboard" becomes a full-width blue button. "Contact Support" appears as a centered link below the button. Navigation header is minimal — logo only.

**Empty State:** N/A — this is itself an error/empty state page

**Error State:** N/A

**Loading State:** N/A

**Design Notes:** The compass + map illustration is thematically appropriate for a "lost" metaphor and matches the visual tone of the clock illustration on the Time Logs empty state. Consistent illustration style (thin outline, blue accent). Both actions are clearly accessible — the button is prominent and the link is secondary but visible.

**Conflicts / Gaps:** None

***

***

### Screen S-012: Invoice Creation Form / Modal

**Reference Images:**
- Desktop: ⚠️ None provided — generated from design tokens and component library
- Mobile: ⚠️ None provided — generated from design tokens and component library

**Mapped Story:** US-INV-03
**Route:** Modal overlay on `/invoices` (or `/invoices/create` as full page fallback)
**Access:** Authenticated

**Layout Description:**
A centered modal dialog that appears over a dimmed backdrop. The modal is wide (approximately 640px on desktop) with comfortable internal padding. A modal header contains "Create Invoice" as the title on the left and a close (✕) icon button on the right. The body is a scrollable form organized into logical sections separated by subtle dividers: (1) Client & Project selection dropdowns, (2) Invoice metadata (issue date, due date, invoice number — auto-generated but editable), (3) Line Items table (add/remove rows), (4) Tax & totals summary row, (5) Notes / terms textarea. A sticky footer at the bottom of the modal holds two buttons: "Save as Draft" (secondary/outlined) on the left and "Send Invoice" (primary blue) on the right.

On mobile, the modal becomes a full-screen bottom sheet that slides up from the bottom. The header sticks to the top of the sheet. The form scrolls within the sheet. Footer buttons are stacked vertically — "Send Invoice" on top, "Save as Draft" below.

**Components:**

#### Component: Modal Header
- **What it is:** Title bar for the modal
- **Where it appears:** Top of the modal container
- **What it shows:** "Create Invoice" bold title on the left; ✕ close icon button on the right
- **How it behaves:** Close icon dismisses the modal without saving; pressing Escape also closes
- **Variants/States:** Default only

#### Component: Client Selector Dropdown
- **What it is:** Searchable select input
- **Where it appears:** First field in the form body
- **What it shows:** Label "Client"; dropdown with placeholder "Select a client"; shows client names from the user's client list; search/filter within the dropdown
- **How it behaves:** Opens a styled dropdown list; user selects one client; selection populates the client field
- **Variants/States:** Empty; focused; selected; error (red border if submitted without value)

#### Component: Project Selector Dropdown
- **What it is:** Searchable select input (dependent on client selection)
- **Where it appears:** Below the Client selector
- **What it shows:** Label "Project (Optional)"; placeholder "Select a project"; list filtered to projects belonging to the selected client
- **How it behaves:** Disabled until a client is selected; populates project list on client selection
- **Variants/States:** Disabled; active; selected

#### Component: Invoice Metadata Row
- **What it is:** Row of three inline fields
- **Where it appears:** Below the project selector
- **What it shows:** "Invoice Number" (pre-filled, e.g., "INV-007", editable); "Issue Date" (date picker, default today); "Due Date" (date picker, default 30 days from issue)
- **How it behaves:** Invoice number auto-increments; user can override; dates use a calendar picker
- **Variants/States:** Default (pre-filled); user-edited; error

#### Component: Line Items Table
- **What it is:** Dynamic table for billing line items
- **Where it appears:** Main body of the form, below metadata
- **What it shows:** Header row: Description, Quantity, Unit Price, Total (auto-calculated); one default empty row; an "+ Add Item" text link below the table
- **How it behaves:** Each row is editable; Total = Quantity × Unit Price, calculated live; "✕" icon on right of each row removes it; "+ Add Item" appends a new blank row
- **Variants/States:** Default (1 empty row); populated; row error (missing required fields)

#### Component: Tax & Totals Summary
- **What it is:** Read-only summary block
- **Where it appears:** Below the line items table, right-aligned
- **What it shows:** "Subtotal: $X.XX"; "Tax (%) [editable %]: $X.XX"; "Total: $X.XX" in bold, larger text
- **How it behaves:** Updates live as line items or tax % change
- **Variants/States:** Default; updating (brief flash on change)

#### Component: Notes / Terms Textarea
- **What it is:** Optional free-text input
- **Where it appears:** Below the totals summary
- **What it shows:** Label "Notes / Payment Terms (Optional)"; a multi-line textarea with placeholder "e.g., Payment due within 30 days. Thank you for your business."
- **How it behaves:** Free text entry; no validation
- **Variants/States:** Empty; filled; focused

#### Component: Modal Footer Buttons
- **What it is:** Sticky action row
- **Where it appears:** Bottom of the modal, always visible
- **What it shows:** "Save as Draft" outlined button (left); "Send Invoice" primary blue button (right)
- **How it behaves:** "Save as Draft" saves with Draft status and closes modal; "Send Invoice" saves with Sent status, triggers email notification, and closes modal; both show loading state during submission
- **Variants/States:** Default; loading; disabled (if required fields missing)

**Mobile Behavior:**
Full-screen bottom sheet. Sticky header with title and close. Scrollable form body. Footer buttons stacked: "Send Invoice" primary full-width, "Save as Draft" secondary full-width below.

**Empty State:** N/A — always shows the creation form

**Error State:** Inline red error text below required fields that are empty on submit attempt. Toast error if server-side creation fails.

**Loading State:** Both footer buttons disabled; "Send Invoice" button shows spinner + "Sending…" text while request is in flight.

**Design Notes:** The modal uses the same Card Container styling as the rest of the app — white background, rounded corners, subtle shadow — scaled up to modal size. The line items table has a clean, minimal look: light column borders, comfortable row padding. The "+ Add Item" link uses the primary blue text link style. The auto-calculated Total column is right-aligned and slightly bolder. The modal backdrop is a semi-transparent dark overlay.

**Conflicts / Gaps:** None — fully inferred from design system

***

### Screen S-013: Client Add / Edit Modal

**Reference Images:**
- Desktop: ⚠️ None provided — generated from design tokens and component library
- Mobile: ⚠️ None provided — generated from design tokens and component library

**Mapped Story:** US-CLIENT-02
**Route:** Modal overlay on `/clients`
**Access:** Authenticated

**Layout Description:**
A centered modal dialog (approximately 480px wide on desktop). Modal header shows "Add Client" or "Edit Client" (dynamically set) on the left with a ✕ close button on the right. The form body contains stacked labeled inputs: Full Name, Company Name, Email Address, Phone Number, and an optional Notes textarea. A sticky modal footer has "Cancel" (text link or outlined) on the left and "Save Client" (primary blue) on the right.

On mobile, same full-screen bottom sheet pattern as the Invoice modal. All inputs stack full-width. Footer buttons are full-width stacked.

**Components:**

#### Component: Modal Header
- **What it is:** Title bar
- **Where it appears:** Top of the modal
- **What it shows:** "Add Client" or "Edit Client" title; ✕ close button
- **How it behaves:** Close dismisses without saving; Escape closes
- **Variants/States:** Add mode; Edit mode (pre-filled form)

#### Component: Full Name Input
- **What it is:** Text input
- **Where it appears:** First field
- **What it shows:** Label "Full Name"; placeholder "e.g., Jane Cooper"
- **How it behaves:** Required; validated on submit
- **Variants/States:** Empty; filled; focused; error

#### Component: Company Name Input
- **What it is:** Text input
- **Where it appears:** Second field
- **What it shows:** Label "Company Name (Optional)"; placeholder "e.g., Acme Corp"
- **How it behaves:** Optional field
- **Variants/States:** Empty; filled; focused

#### Component: Email Input
- **What it is:** Email-type text input
- **Where it appears:** Third field
- **What it shows:** Label "Email Address"; placeholder "email@company.com"
- **How it behaves:** Required; validates email format on blur
- **Variants/States:** Empty; filled; focused; error (invalid format)

#### Component: Phone Number Input
- **What it is:** Tel-type text input
- **Where it appears:** Fourth field
- **What it shows:** Label "Phone Number (Optional)"; placeholder "+1 (555) 000-0000"
- **How it behaves:** Optional; no strict format validation
- **Variants/States:** Empty; filled; focused

#### Component: Notes Textarea
- **What it is:** Multi-line text input
- **Where it appears:** Last field before footer
- **What it shows:** Label "Notes (Optional)"; placeholder "Any additional details about this client…"
- **How it behaves:** Free text; no validation
- **Variants/States:** Empty; filled; focused

#### Component: Modal Footer
- **What it is:** Action row
- **Where it appears:** Bottom of the modal
- **What it shows:** "Cancel" outlined or link button (left); "Save Client" primary blue button (right)
- **How it behaves:** Cancel dismisses without saving; Save validates and submits; shows loading state on submit
- **Variants/States:** Default; loading; disabled

**Mobile Behavior:**
Full-screen bottom sheet with sticky header and footer. All inputs full-width. Footer: "Save Client" full-width primary button, "Cancel" text link centered below.

**Empty State:** N/A — always shows the form

**Error State:** Red inline error text under each invalid field. Toast on server error.

**Loading State:** "Save Client" button shows spinner + "Saving…"; all inputs become read-only.

**Design Notes:** This is one of the simpler modals — clean vertical form layout with no complex components. All inputs use the same Text Input design token from Section 3. The modal is narrower than the Invoice modal since it has fewer fields. Edit mode pre-populates all fields with existing client data.

**Conflicts / Gaps:** None

***

### Screen S-014: Project Creation Form

**Reference Images:**
- Desktop: ⚠️ None provided — generated from design tokens and component library
- Mobile: ⚠️ None provided — generated from design tokens and component library

**Mapped Story:** US-PROJ-02
**Route:** Modal overlay on `/projects`
**Access:** Authenticated

**Layout Description:**
A centered modal dialog (approximately 560px wide on desktop). Header shows "Create Project" with ✕ close. The form body is organized in two logical groups: (1) Project Info — Project Name, Client selector dropdown, Status dropdown (Active / Draft / On Hold), Description textarea; (2) Timeline & Tracking — Start Date, Deadline (date pickers side by side), Budget (number input with $ prefix), and an optional "Hourly Rate" input. Footer: "Save as Draft" (outlined, left) and "Create Project" (primary blue, right).

On mobile, bottom sheet. All fields full-width. Date pickers stack vertically. Footer buttons full-width stacked.

**Components:**

#### Component: Project Name Input
- **What it is:** Text input
- **Where it appears:** First field
- **What it shows:** Label "Project Name"; placeholder "e.g., Website Redesign"
- **How it behaves:** Required
- **Variants/States:** Empty; filled; focused; error

#### Component: Client Selector
- **What it is:** Searchable dropdown
- **Where it appears:** Second field
- **What it shows:** Label "Client"; placeholder "Select a client"; searchable list of user's clients
- **How it behaves:** Required; single select
- **Variants/States:** Empty; focused; selected; error

#### Component: Status Selector
- **What it is:** Dropdown select
- **Where it appears:** Third field
- **What it shows:** Label "Status"; options: Active, Draft, On Hold; default "Draft"
- **How it behaves:** Single select; affects badge shown on the project card
- **Variants/States:** Default (Draft selected); user-changed

#### Component: Description Textarea
- **What it is:** Multi-line input
- **Where it appears:** Fourth field
- **What it shows:** Label "Description (Optional)"; placeholder "Brief overview of the project scope…"
- **How it behaves:** Optional; no validation
- **Variants/States:** Empty; filled; focused

#### Component: Date Range Row
- **What it is:** Two inline date picker inputs
- **Where it appears:** Below the description
- **What it shows:** "Start Date" (left, default today); "Deadline" (right, default +30 days)
- **How it behaves:** Calendar picker opens on click; Deadline must be after Start Date
- **Variants/States:** Default; open (calendar visible); error (deadline before start)

#### Component: Budget Input
- **What it is:** Number input with prefix
- **Where it appears:** Below date row
- **What it shows:** Label "Budget (Optional)"; a "$" prefix symbol fixed on the left inside the input; placeholder "0.00"
- **How it behaves:** Optional number input; accepts decimals
- **Variants/States:** Empty; filled; focused

#### Component: Hourly Rate Input
- **What it is:** Number input with prefix
- **Where it appears:** Below budget input, inline with budget as a two-column row
- **What it shows:** Label "Hourly Rate (Optional)"; "$" prefix; placeholder "0.00"
- **How it behaves:** Optional
- **Variants/States:** Empty; filled; focused

#### Component: Modal Footer
- **What it is:** Sticky action row
- **Where it appears:** Bottom of modal
- **What it shows:** "Save as Draft" outlined button (left); "Create Project" primary blue button (right)
- **How it behaves:** Draft saves with Draft status; Create saves with selected status; both validate required fields first
- **Variants/States:** Default; loading; disabled

**Mobile Behavior:**
Full-screen bottom sheet. All fields full-width. Date row stacks vertically. Budget and Hourly Rate also stack vertically. Footer: "Create Project" full-width primary, "Save as Draft" full-width secondary below.

**Empty State:** N/A

**Error State:** Inline errors under Project Name and Client (required). Deadline validation error shown under deadline input.

**Loading State:** Submit button shows spinner; inputs become read-only.

**Design Notes:** The "$" prefix on budget and rate inputs should use the same input styling — the prefix is displayed inside the input box as a non-editable character, slightly gray, separated from the user input by a small left padding. The status dropdown uses the same visual treatment as filter dropdowns throughout the app.

**Conflicts / Gaps:** None

***

### Screen S-015: Log Time Modal

**Reference Images:**
- Desktop: ⚠️ None provided — generated from design tokens and component library
- Mobile: ⚠️ None provided — generated from design tokens and component library

**Mapped Story:** US-TIME-02
**Route:** Modal overlay on `/time-logs`
**Access:** Authenticated

**Layout Description:**
A compact centered modal (approximately 440px wide on desktop). Header shows "Log Time" with ✕ close. The form body contains: Project selector dropdown, Date input (date picker, defaults to today), Duration input (hours + minutes side-by-side numeric inputs), and a Description/Task textarea. Footer: "Cancel" (outlined) on the left, "Log Time" (primary blue) on the right.

On mobile, bottom sheet. All fields full-width. Duration row stays side-by-side for hours and minutes.

**Components:**

#### Component: Project Selector
- **What it is:** Searchable dropdown
- **Where it appears:** First field
- **What it shows:** Label "Project"; placeholder "Select a project"; searchable list of active projects
- **How it behaves:** Required; single select; filters to active projects by default
- **Variants/States:** Empty; selected; focused; error

#### Component: Date Picker Input
- **What it is:** Date input
- **Where it appears:** Second field
- **What it shows:** Label "Date"; default value = today's date; calendar icon on right
- **How it behaves:** Calendar picker on click; cannot select future dates
- **Variants/States:** Default (today); user-changed; open (calendar); error

#### Component: Duration Row
- **What it is:** Two inline number inputs
- **Where it appears:** Third field
- **What it shows:** Label "Duration"; two inputs side by side: "Hours" (placeholder "0", max 23) and "Minutes" (placeholder "00", max 59)
- **How it behaves:** Both numeric; Hours and Minutes validate ranges on blur; at least one must be > 0
- **Variants/States:** Default (empty); filled; error (both zero)

#### Component: Description Textarea
- **What it is:** Multi-line input
- **Where it appears:** Fourth field
- **What it shows:** Label "Task / Description (Optional)"; placeholder "What did you work on?"
- **How it behaves:** Optional free text
- **Variants/States:** Empty; filled; focused

#### Component: Modal Footer
- **What it is:** Action row
- **Where it appears:** Bottom of modal
- **What it shows:** "Cancel" outlined button (left); "Log Time" primary blue button (right)
- **How it behaves:** Cancel dismisses without saving; Log Time validates and submits; adds a new row to the time logs table
- **Variants/States:** Default; loading; disabled

**Mobile Behavior:**
Bottom sheet. Project, Date, Description fields full-width. Duration row stays as two side-by-side inputs (each 50% width). Footer: "Log Time" full-width primary, "Cancel" text link below.

**Empty State:** N/A

**Error State:** Red inline error under Project (required) and Duration (if both are 0). Toast on server error.

**Loading State:** "Log Time" button shows spinner + "Logging…"; inputs read-only.

**Design Notes:** The Duration row uses the two-column inline pattern from the Date Range row in the Project form. The modal is intentionally compact — logging time should be a fast, low-friction action. The clock icon used in the Time Logs empty state could be used as a small decorative element near the modal title for thematic consistency.

**Conflicts / Gaps:** None

***

### Screen S-016: Forgot Password Screen

**Reference Images:**
- Desktop: ⚠️ None provided — generated from design tokens and component library
- Mobile: ⚠️ None provided — generated from design tokens and component library

**Mapped Story:** US-AUTH-02
**Route:** `/forgot-password`
**Access:** Public

**Layout Description:**
Same two-panel layout as the Login/Signup page (S-002). The left panel is the same Auth Branding Panel — gradient background, FreelanceFlow logo icon, and the tagline "Streamline your freelance business." The right panel contains a single centered white card (narrower than the login card) with three possible states: (1) Request State — email input + "Send Reset Link" button; (2) Success State — checkmark illustration, confirmation message, "Back to Login" button; (3) Error State — same form with inline error.

On mobile, no left branding panel. FreelanceFlow logo at top. The card is the only element, full-width.

**Components:**

#### Component: Auth Branding Panel (Desktop Only)
- **What it is:** Left decorative panel
- **Where it appears:** Left half of desktop layout
- **What it shows:** Same as S-002 — "FF" logo icon, bold headline, subtext
- **How it behaves:** Static
- **Variants/States:** Default only

#### Component: Forgot Password Card — Request State
- **What it is:** White card with form
- **Where it appears:** Right panel (desktop); center of page (mobile)
- **What it shows:** "Forgot Password" heading; short subtext "Enter your email and we'll send you a reset link."; Email input with placeholder "email@your.email.com"; "Send Reset Link" primary blue full-width button; "Back to Login" text link below
- **How it behaves:** Email is required and validated; on submit, shows Success State; "Back to Login" navigates to `/login`
- **Variants/States:** Default; email focused; email error; button loading

#### Component: Forgot Password Card — Success State
- **What it is:** Confirmation display within the same card
- **Where it appears:** Same position as request card — replaces it after successful submission
- **What it shows:** A circular checkmark illustration (outlined, primary blue — matching the app illustration style); "Check your inbox" bold heading; "We've sent a password reset link to [email]. Check your spam folder if you don't see it." body text; "Back to Login" primary blue full-width button
- **How it behaves:** Static confirmation; button navigates to `/login`
- **Variants/States:** Default success

#### Component: Back to Login Button / Link
- **What it is:** Navigation action
- **Where it appears:** Below the primary action in both states
- **What it shows:** In request state: "Back to Login" as a blue text link. In success state: "Back to Login" as a primary blue button
- **How it behaves:** Navigates to `/login`
- **Variants/States:** Link style (request state); button style (success state)

**Mobile Behavior:**
FreelanceFlow logo at top. Single full-width card centered below. No branding panel. Inputs and buttons full-width. Consistent with S-002 mobile layout.

**Empty State:** N/A

**Error State:** If no account found with the email: inline red error below the email input ("No account found with this email address."). Button returns to active state.

**Loading State:** "Send Reset Link" shows spinner + "Sending…" and is disabled during the request.

**Design Notes:** The success illustration (circular checkmark) should use the same thin-outline SVG style as the clock (S-009 empty state) and compass (S-011) illustrations — consistent premium SaaS illustration system. The success state does NOT navigate away — it transforms the card in place (with a subtle fade/slide transition) to maintain the user's context.

**Conflicts / Gaps:** Reset password confirmation screen (after clicking the email link) is not specified. That screen (enter new password form) should be added as S-020 if needed.

***

### Screen S-017: Time Logs — Populated State

**Reference Images:**
- Desktop: ⚠️ None provided — generated from design tokens and component library
- Mobile: ⚠️ None provided — generated from design tokens and component library

**Mapped Story:** US-TIME-01 (populated variant)
**Route:** `/time-logs`
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. "Time Logs" is the active sidebar nav item. The top content header bar shows "My Projects" and "My Invoices" tabs, and a "Log Time" primary blue button on the far right. The page title "Time Logs" appears below. Below the title is a toolbar with a search input on the left and two filter dropdowns on the right: "All Projects" and a date range picker (e.g., "This Month"). Below the toolbar is a data table showing all logged time entries.

On mobile, the table is replaced by a stacked list of time log cards.

**Components:**

#### Component: Time Logs Toolbar
- **What it is:** Search and filter row
- **Where it appears:** Below the page title
- **What it shows:** Search input ("Search by task…"); "All Projects" dropdown (filters by project); "This Month" date range dropdown
- **How it behaves:** Search filters the table in real-time; dropdowns filter by project and date range
- **Variants/States:** Default; filter applied; search active

#### Component: Time Logs Table
- **What it is:** Data table
- **Where it appears:** Main content area below toolbar
- **What it shows:** Column headers: Date, Project, Task / Description, Duration, Actions; rows show individual time entries; Duration column shows formatted time (e.g., "2h 30m"); Actions column shows "Edit" (blue link) and a "…" dropdown for Delete
- **How it behaves:** Rows are sortable by Date (default: newest first); "Edit" opens the Log Time modal pre-filled with that entry's data; Delete requires confirmation
- **Variants/States:** Default; row hover (subtle highlight); sorted; empty (handled by S-009 empty state)

#### Component: Duration Badge / Text
- **What it is:** Formatted duration display
- **Where it appears:** Duration column of each table row
- **What it shows:** Time formatted as "Xh Ym" (e.g., "1h 45m", "3h 00m"); displayed in a soft blue-gray tag or plain text
- **How it behaves:** Static display
- **Variants/States:** Default

#### Component: Time Logs Summary Bar
- **What it is:** Summary stats row above the table
- **Where it appears:** Between the toolbar and the table
- **What it shows:** Three inline stat chips: "Total Hours: 42h 15m", "Total Entries: 18", "Billable Hours: 36h 00m" — each in a small card/chip with a label and bold value
- **How it behaves:** Updates based on current filter selection; static display otherwise
- **Variants/States:** Default; filtered (updates values)

#### Component: Row Action Dropdown
- **What it is:** Context menu
- **Where it appears:** "…" trigger in Actions column
- **What it shows:** "Edit" (pencil icon, blue), "Delete" (trash icon, red/danger)
- **How it behaves:** Edit pre-fills the Log Time modal; Delete shows a confirmation dialog before removing
- **Variants/States:** Open; closed

**Mobile Behavior:**
Time log entries shown as stacked cards. Each card shows: Date (top left, gray), Project name (bold), Task description (body text), Duration (bold blue, bottom right). A "…" three-dot icon on the top right of each card opens Edit / Delete actions. Summary stats shown as a horizontal scrollable row of chips at the top.

**Empty State:** Handled by the existing empty state component from S-009 — clock illustration, "No Time Logs Yet" heading, "Log Time" CTA button.

**Error State:** Error message above the table with retry option.

**Loading State:** Table rows replaced with skeleton gray bars (loading skeleton component). Summary bar chips show skeleton placeholders.

**Design Notes:** The summary bar chips use the same Card Container component but in a compact/small variant — white background, light border, minimal padding. The Duration column text is bolder than other columns to make it scannable. The table mirrors the Data Table component token from Section 6 — no outer border, light row dividers, gray column headers.

**Conflicts / Gaps:** DG-001 is now resolved by this specification.

***

### Screen S-018: Project Detail Page

**Reference Images:**
- Desktop: ⚠️ None provided — generated from design tokens and component library
- Mobile: ⚠️ None provided — generated from design tokens and component library

**Mapped Story:** US-PROJ-03 (inferred)
**Route:** `/projects/[id]`
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. "Projects" is the active nav item. The page has a top breadcrumb row: "Projects / [Project Name]" with "Projects" as a clickable blue link back to `/projects`. Below the breadcrumb is a header row with the Project Name as a large bold page title (left), the project Status badge inline next to the title, and two action buttons on the right: "Edit Project" (outlined) and "Create Invoice" (primary blue).

Below the header, the main content is arranged in a two-column layout: the left column (wider, ~65%) contains a "Project Overview" card, a "Linked Invoices" table card, and a "Time Logs" table card; the right column (~35%) contains a "Project Stats" summary card and a "Client Details" card.

On mobile, all cards stack in a single column: Stats → Overview → Client Details → Invoices → Time Logs.

**Components:**

#### Component: Breadcrumb Navigation
- **What it is:** Secondary navigation trail
- **Where it appears:** Top of the content area, above the page title
- **What it shows:** "Projects" (blue link) › "Website Redesign" (current, dark text, not a link)
- **How it behaves:** "Projects" link navigates to `/projects`
- **Variants/States:** Default only

#### Component: Project Detail Header
- **What it is:** Title + actions row
- **Where it appears:** Below the breadcrumb
- **What it shows:** Project Name (large, bold); Status badge inline (Active / Draft / On Hold / Completed / Archived); "Edit Project" outlined button; "Create Invoice" primary blue button
- **How it behaves:** "Edit Project" opens the Project Creation modal in edit mode (pre-filled); "Create Invoice" opens the Invoice Creation modal with project pre-selected
- **Variants/States:** Status badge variants; button hover states

#### Component: Project Overview Card
- **What it is:** Info card
- **Where it appears:** Top of left column
- **What it shows:** "Project Overview" heading; Description text (full, not truncated); "Start Date" and "Deadline" displayed as labeled values in a two-column info grid; "Budget" and "Hourly Rate" as labeled values in the same grid; "Progress" label with a percentage and the horizontal progress bar (same as project card component)
- **How it behaves:** Static display; "Edit Project" button in header updates these values
- **Variants/States:** Default; no description (shows "No description provided" in gray)

#### Component: Project Stats Card
- **What it is:** Compact summary card
- **Where it appears:** Top of right column
- **What it shows:** "Project Stats" heading; four stat rows — "Total Hours Logged" with value (e.g., "42h 15m"), "Total Invoiced" ($X,XXX.XX), "Total Paid" ($X,XXX.XX), "Outstanding Balance" ($XXX.XX, shown in amber if > 0)
- **How it behaves:** Static display; values update when new invoices/time logs are added
- **Variants/States:** Default; outstanding balance highlighted in amber when > 0

#### Component: Client Details Card
- **What it is:** Info card
- **Where it appears:** Below Project Stats card in right column
- **What it shows:** "Client" heading; Client Name (bold); Company Name; Email (blue link); Phone
- **How it behaves:** Client Name / Email are clickable links to `/clients/[id]`
- **Variants/States:** Default

#### Component: Linked Invoices Table
- **What it is:** Data table card
- **Where it appears:** Middle of left column
- **What it shows:** "Invoices" heading with a count badge (e.g., "3"); "Create Invoice" small outlined button on the right of the heading row; table columns: Invoice #, Issue Date, Due Date, Amount, Status; status uses color badges (same token as app-wide)
- **How it behaves:** Row click navigates to the invoice detail; "Create Invoice" opens the Invoice Creation modal with project pre-selected
- **Variants/States:** Default; empty (shows "No invoices for this project yet" with CTA); loading skeleton

#### Component: Linked Time Logs Table
- **What it is:** Data table card
- **Where it appears:** Bottom of left column
- **What it shows:** "Time Logs" heading with total hours shown as a badge (e.g., "42h 15m"); "Log Time" small outlined button on right of heading row; table columns: Date, Task / Description, Duration
- **How it behaves:** "Log Time" opens the Log Time modal with this project pre-selected
- **Variants/States:** Default; empty ("No time logged yet" with CTA); loading skeleton

**Mobile Behavior:**
Breadcrumb visible at top. Header title + badge full-width; action buttons below (full-width stacked or side-by-side depending on length). Cards stack: Stats → Overview → Client Details → Invoices (table shows as cards) → Time Logs (table shows as cards).

**Empty State:** Each linked table shows its own empty state with a CTA to add data.

**Error State:** Error banner if project fails to load; retry button.

**Loading State:** Full page skeleton — breadcrumb bar, title block, and all card bodies show skeleton bars.

**Design Notes:** The two-column layout for the project detail page is a premium SaaS pattern — primary content on the left, contextual metadata on the right (similar to GitHub's issue detail or Linear's task view). Progress bar in the overview card uses the same primary blue color. Outstanding balance amber highlight adds urgency without disrupting the overall clean theme.

**Conflicts / Gaps:** Progress percentage calculation needs to be defined — whether it's manual input, derived from hours vs. budget, or milestone-based.

***

### Screen S-019: Client Detail Page

**Reference Images:**
- Desktop: ⚠️ None provided — generated from design tokens and component library
- Mobile: ⚠️ None provided — generated from design tokens and component library

**Mapped Story:** US-CLIENT-03 (inferred)
**Route:** `/clients/[id]`
**Access:** Authenticated

**Layout Description:**
Standard sidebar + content layout. "Clients" is the active nav item. A breadcrumb at the top: "Clients / [Client Name]". Below the breadcrumb is a header row with the Client Name as the page title (left), an "Active" or "Archived" status badge inline, and two action buttons on the right: "Edit Client" (outlined) and "Invite Client" (primary blue).

The main content area is a two-column layout: the left column (wider, ~65%) contains a "Projects" table card and an "Invoices" table card; the right column (~35%) contains a "Client Info" card and an "Activity Summary" card.

On mobile, all cards stack: Client Info → Activity Summary → Projects → Invoices.

**Components:**

#### Component: Breadcrumb Navigation
- **What it is:** Secondary navigation
- **Where it appears:** Top of content area
- **What it shows:** "Clients" (blue link) › "[Client Name]" (current, dark text)
- **How it behaves:** "Clients" navigates to `/clients`
- **Variants/States:** Default

#### Component: Client Detail Header
- **What it is:** Title + actions row
- **Where it appears:** Below breadcrumb
- **What it shows:** Client Name (large, bold); Status badge (Active — green, or Archived — pink); "Edit Client" outlined button; "Invite Client" primary blue button (or "Uninvite" if already invited)
- **How it behaves:** "Edit Client" opens the Client Add/Edit modal pre-filled; "Invite Client" sends an email invitation
- **Variants/States:** Active; Archived (muted header, archive banner shown below)

#### Component: Client Info Card
- **What it is:** Information display card
- **Where it appears:** Top of right column
- **What it shows:** "Client Info" heading; rows for: Full Name (bold), Company (with office icon), Email (blue mailto link, with email icon), Phone (with phone icon); each row has an icon + label layout
- **How it behaves:** Static display; clicking email opens email client; clicking phone on mobile initiates a call
- **Variants/States:** Default; missing fields show "—" placeholder

#### Component: Activity Summary Card
- **What it is:** Stats card
- **Where it appears:** Below Client Info card in right column
- **What it shows:** "Summary" heading; four stat rows: "Total Projects" (count), "Total Invoiced" ($X,XXX.XX), "Total Paid" ($X,XXX.XX), "Outstanding" ($XXX.XX — amber if > 0)
- **How it behaves:** Static; updates when new projects/invoices are linked
- **Variants/States:** Default; outstanding balance amber highlight

#### Component: Client Projects Table Card
- **What it is:** Data table card
- **Where it appears:** Top of left column
- **What it shows:** "Projects" heading with count badge; "Create Project" small outlined button on right of heading; table columns: Project Name (blue link), Status badge, Deadline, Progress (bar), Budget
- **How it behaves:** Row click navigates to `/projects/[id]`; "Create Project" opens Project Creation modal with client pre-selected
- **Variants/States:** Default; empty ("No projects for this client yet" + CTA); loading skeleton

#### Component: Client Invoices Table Card
- **What it is:** Data table card
- **Where it appears:** Below Projects table in left column
- **What it shows:** "Invoices" heading with count badge; "Create Invoice" small outlined button; table columns: Invoice #, Issue Date, Due Date, Amount, Status badge
- **How it behaves:** Row click navigates to invoice detail; "Create Invoice" opens Invoice modal with client pre-selected
- **Variants/States:** Default; empty ("No invoices for this client yet" + CTA); loading skeleton

#### Component: Archive Warning Banner
- **What it is:** Status alert banner
- **Where it appears:** Below the header row, above the main content, only when client is Archived
- **What it shows:** An amber-tinted banner with a warning icon: "This client is archived. New projects and invoices cannot be created." with an "Unarchive" text link on the right
- **How it behaves:** "Unarchive" triggers the unarchive action and removes the banner
- **Variants/States:** Visible (archived); hidden (active)

**Mobile Behavior:**
Breadcrumb at top. Header title + badge + action buttons (stacked or compact). Cards stacked: Client Info → Activity Summary → Projects (cards instead of table) → Invoices (cards instead of table). Archive banner shows at top of content if archived.

**Empty State:** Each linked table shows its own empty state with relevant CTA.

**Error State:** Error banner if client data fails to load.

**Loading State:** Full-page skeleton for all card bodies.

**Design Notes:** The Client Detail page mirrors the visual hierarchy of the Project Detail page — consistent premium SaaS two-column detail layout. The icon + label rows in Client Info card use a subtle gray icon (outline style, matching app icon language) with the label in medium-gray and the value in dark text. The Archive Warning Banner uses the amber/overdue color from the design tokens — consistent with the overdue badge color — to signal caution without using a harsh red.

**Conflicts / Gaps:** No invite acceptance flow or client portal link generation screen is specified. These could be future enhancements (S-020+).

***

## 6. Component Library

### Component: Sidebar Navigation
- **Type:** Navigation panel
- **Description:** Fixed full-height left panel. Contains the FreelanceFlow logo (icon + wordmark) at the top. Below the logo is a vertical list of navigation items, each consisting of an icon on the left and a text label. The active item has a light blue background fill across the full width of the sidebar item row. Inactive items have no background. The sidebar width is narrow — approximately one-fifth of the desktop viewport.
- **Variants:** Active item; inactive item; hover item
- **States:** Default; active (blue background tint); hover (subtle background)
- **Used on screens:** S-003, S-004, S-005, S-006, S-007, S-008, S-009, S-010

***

### Component: Primary Button
- **Type:** Button
- **Description:** Solid blue background, white text, rounded corners (pill-adjacent but not fully pill-shaped — moderately rounded). Comfortable horizontal padding. Font is medium weight.
- **Variants:** Full width (forms, mobile); auto width (table headers, page headers); small (inside cards)
- **States:** Default; hover (slightly darker blue); loading (spinner, disabled); disabled (reduced opacity)
- **Used on screens:** S-001, S-002, S-003, S-004, S-005, S-006, S-007, S-008, S-009, S-010, S-011

***

### Component: Text Link
- **Type:** Inline link
- **Description:** Primary blue text, no underline by default, underline on hover. Used for secondary navigation and actions that don't need button prominence.
- **Variants:** Inline (within paragraph); standalone (below a button)
- **States:** Default; hover (underline); visited (may remain same blue)
- **Used on screens:** S-002, S-011

***

### Component: Status Badge
- **Type:** Label / Tag
- **Description:** Small pill-shaped label with colored background and matching colored text. Rounded corners, small font, moderate horizontal padding, minimal vertical padding. No border.
- **Variants:** Active (green), On Hold (blue-tint), Completed (light green), Overdue (amber/yellow with warning triangle icon), Draft (gray), Archived (pink), Processed (peach-orange), Viewed (blue-gray)
- **States:** Static — no interactive states
- **Used on screens:** S-003, S-004, S-005, S-006, S-007, S-008, S-009

***

### Component: Card Container
- **Type:** Layout container
- **Description:** White background, rounded corners, subtle box shadow or very light border, comfortable internal padding on all sides. Cards sit on the light gray page background.
- **Variants:** Standard card (most screens); compact card (dashboard stats); full-bleed card (chart card); detail panel card (invoice detail)
- **States:** Default; hover (slight shadow elevation for clickable cards); selected (border highlight for clickable cards)
- **Used on screens:** S-003, S-004, S-005, S-006, S-007, S-008, S-009, S-010

***

### Component: Text Input
- **Type:** Form input
- **Description:** Full-width within its container. Light border (thin, gray). Rounded corners. Padding inside left side for text. Placeholder text in gray. Label sits above the input, not inside.
- **Variants:** Standard text; password (with eye toggle icon on right)
- **States:** Default; focused (blue border highlight); filled; error (red border + red error text below); disabled (reduced opacity, not editable)
- **Used on screens:** S-002, S-004, S-010

***

### Component: Toggle Switch
- **Type:** Boolean input
- **Description:** Pill-shaped toggle. When "on", the pill background is primary blue and the circular knob is on the right side in white. When "off", the pill background is gray and the knob is on the left. Smooth transition between states.
- **Variants:** On (blue); Off (gray)
- **States:** On; Off; Disabled
- **Used on screens:** S-010

***

### Component: Top Content Header Bar
- **Type:** Navigation / header
- **Description:** Sticky horizontal bar at the top of the main content area (not the browser bar — inside the app). Contains tab navigation on the left ("My Projects", "My Invoices") with the active tab underlined in blue. Right side contains utility icons (help ?, notification bell, user avatar circle).
- **Variants:** With tabs; without tabs (some screens only show logo and icons)
- **States:** Tab active (blue underline); tab hover; notification unread (badge on bell)
- **Used on screens:** S-003, S-004, S-005, S-006, S-007, S-008, S-009, S-010

***

### Component: Data Table
- **Type:** Table
- **Description:** Flat, no outer border. Column headers in gray, medium weight. Light horizontal dividers between rows. Row content in dark text. Sortable columns show an arrow indicator next to the header label. Compact row height but readable.
- **Variants:** Full-width (Clients, Recent Invoices); compact (Invoice list panel in My Invoices)
- **States:** Default; row hover (subtle gray highlight); sorted column; empty (message row)
- **Used on screens:** S-003, S-004, S-007

***

### Component: Search Input
- **Type:** Form input (specialized)
- **Description:** Similar to the standard text input but with a magnifying glass icon on the left inside the input. Placeholder text "Search". Compact height. Rounded corners. Sits to the left in toolbar rows.
- **Variants:** Default; active (text entered); focused
- **States:** Empty; filled; focused
- **Used on screens:** S-004, S-005, S-007

***

### Component: Empty State Block
- **Type:** Informational display
- **Description:** Centered within its container. Contains an outlined illustration (thematically relevant: clock for Time Logs, compass for 404). Below the illustration: a bold heading and a short descriptive subtext in smaller, lighter text. Below the text: a primary action button.
- **Variants:** Full page (404); card-contained (Time Logs)
- **States:** Default only
- **Used on screens:** S-009, S-011

***

### Component: Loading Skeleton
- **Type:** Loading state placeholder
- **Description:** Gray rounded-end bars of varying widths arranged in rows, simulating the structure of the actual content that will load. Gentle shimmer animation (pulse or fade) to indicate loading activity.
- **Variants:** Table skeleton; list skeleton; card skeleton
- **States:** Loading (active shimmer)
- **Used on screens:** S-003, S-004, S-005, S-006, S-007, S-008, S-009

***

## 7. User Flows

### Flow: New User Registration → Dashboard
- Step 1: User visits `/` (Landing Page)
- Step 2: User clicks "Start managing better" CTA
- Step 3: Navigates to `/signup` → User fills Name, Email, Password
- Step 4: Clicks "Sign Up" → Account created → Redirects to `/dashboard`

***

### Flow: Returning User Login → Dashboard
- Step 1: User visits `/login` or clicks "Log In" from Landing Page
- Step 2: User fills Email and Password → Clicks "Log In"
- Step 3: Authenticated → Redirects to `/dashboard`
- Decision: If wrong credentials → Error shown on form; user stays on login

***

### Flow: Create and View Invoice
- Step 1: User is on `/invoices` → Clicks "Create Invoice"
- Step 2: Invoice creation form/modal opens → User fills details
- Step 3: Invoice saved → Appears in the card grid
- Step 4: User clicks an invoice card → Detail panel opens (or navigates to `/invoices/my` detail view)
- Step 5: User clicks "Download PDF" → PDF downloaded

***

### Flow: Add and Manage a Client
- Step 1: User navigates to `/clients` via sidebar
- Step 2: User clicks "Add Client" → Form modal opens
- Step 3: Client added → Appears in the client table
- Step 4: User hovers a client row → "Edit" link appears; clicks it → Edit form opens
- Step 5: User clicks the actions "…" → Dropdown shows Invite / Archive

***

### Flow: Navigate to Unknown Page → 404
- Step 1: User enters an unknown URL
- Step 2: App renders the 404 screen
- Step 3a: User clicks "Go to Dashboard" → Navigates to `/dashboard`
- Step 3b: User clicks "Contact Support" → Opens support contact (email or form)

***

## 8. Accessibility Notes

| Area | Observation | Recommendation |
|------|-------------|----------------|
| Color-only status indicators | Status badges rely entirely on color to convey state | Add icon or text alongside color (e.g., Overdue already uses a warning triangle — apply this pattern to all badges) |
| Toggle switches | Toggle state communicated visually only | Ensure toggles have aria-checked and descriptive aria-label per notification type |
| Icon-only buttons | Bell icon and help icon in top bar have no visible labels | Add aria-label attributes ("Notifications", "Help") to icon-only buttons |
| Table sort indicators | Sort direction shown as arrow icon only | Add aria-sort attribute to sortable column headers |
| Focus states | Not visible in static designs | Ensure all interactive elements have visible keyboard focus rings |
| Skeleton loaders | Gray bars during loading | Add aria-busy and role="status" to loading regions |
| Avatar image | User avatar appears as a photo | Add alt text with user's name |
| Form error messages | Error states described but not visible in designs | Ensure errors are associated with inputs via aria-describedby |

***

## 9. Design Gaps & Conflicts

| ID | Issue | Affected Screen | Action Required |
|----|-------|-----------------|-----------------|
| DG-001 | Time Logs populated state not shown | S-009 | Add a design image showing the list when time entries exist |
| DG-002 | Sidebar has two "Projects" items — unclear distinction | S-003 through S-010 | Clarify if second item is "My Projects" (dashboard sub-view) or a separate route |
| DG-003 | Notification preference labels appear duplicated in Settings | S-010 | Confirm final list of notification preference toggles with product team |
| DG-004 | Invoice creation form / modal not provided | S-007 | Design the invoice creation form; currently no image exists for this state |
| DG-005 | Client creation/edit modal not provided | S-004 | Design the client add/edit modal; no image provided |
| DG-006 | Project creation form not provided | S-005 | Design the project creation form; no image provided |
| DG-007 | Time entry logging modal not provided | S-009 | Design the "Log Time" modal; no image provided |
| DG-008 | Forgot password flow not shown | S-002 | Design or describe the forgot password screen/modal |
| DG-009 | No image for authenticated 404 vs. public 404 | S-011 | Confirm if the 404 page header should show the authenticated nav bar or the public nav bar |
| DG-010 | "My Invoices" tab and `/invoices` route may overlap | S-007, S-008 | Confirm routing strategy — are these the same page or different views? |

***

## 10. UX Assumptions

| ID | Assumption | Based On |
|----|------------|----------|
| UX-001 | Sidebar is always visible and fixed on desktop; completely hidden on mobile behind hamburger | Visual observation from all authenticated screen images |
| UX-002 | The "Log Time" button and tab context buttons appear in the top header bar — not in a separate toolbar | Observed in Time Logs screen (img4.jpg) |
| UX-003 | All toggles in Notification Preferences are auto-saved on toggle (no Save button needed for that card) | Only Profile Settings card has a Save Changes button; toggles do not |
| UX-004 | Invoice detail in "My Invoices" is a right-side panel that opens on row click — not a full-page navigation | Observed split layout in img3.jpg |
| UX-005 | Mobile navigation drawer slides from the left on hamburger icon tap | Standard SaaS mobile pattern; not visible in static designs |
| UX-006 | The "Completed" project status badge uses a lighter green than the "Active" badge | Color distinction observed in img6.jpg — Active is brighter, Completed is more muted |
| UX-007 | The two "Projects" sidebar items represent: (1) /projects — full management view, (2) My Projects — the dashboard projects tab | Route and naming pattern inferred from top tab navigation |
| UX-008 | Filter tabs on Invoices, Projects are mutually exclusive — selecting one deselects others | Standard filter tab behavior; only one active state visible at a time in designs |
| UX-009 | The "Overdue" tab on the Invoices filter has a dropdown for additional sub-filters (e.g., date range) | Observed dropdown arrow on "Overdue" tab in img8.jpg |
| UX-010 | Cards throughout the app are clickable and navigate to detail views or expand in-place | Interaction pattern inferred from split-panel invoice view and expanded project card |

***

## 11. Screens Pending Design

All previously pending screens have been fully specified below. Each screen was designed from scratch following the established design tokens (Section 3), component library (Section 6), layout patterns, and premium SaaS conventions consistent with the rest of this document.

| BA Screen ID | Screen Name | Status |
|--------------|-------------|--------|
| S-012 | Invoice Creation Form / Modal | ✅ Specified in Section 5 |
| S-013 | Client Add / Edit Modal | ✅ Specified in Section 5 |
| S-014 | Project Creation Form | ✅ Specified in Section 5 |
| S-015 | Log Time Modal | ✅ Specified in Section 5 |
| S-016 | Forgot Password Screen | ✅ Specified in Section 5 |
| S-017 | Time Logs — Populated State | ✅ Specified in Section 5 |
| S-018 | Project Detail Page | ✅ Specified in Section 5 |
| S-019 | Client Detail Page | ✅ Specified in Section 5 |


## 12. Validation Checklist

| Story ID | Screen Covered | Image Provided | Notes |
|----------|---------------|----------------|-------|
| US-LAND-01 | Landing Page (S-001) | ✅ img1.jpg | Both viewports |
| US-AUTH-01 | Login & Sign Up (S-002) | ✅ img10.jpg | Both viewports |
| US-DASH-01 | Dashboard (S-003) | ✅ img7.jpg | Both viewports |
| US-CLIENT-01 | Clients List (S-004) | ✅ img5.jpg | Both viewports |
| US-PROJ-01 | Projects List (S-005) | ✅ img9.jpg | Both viewports |
| US-DASH-02 | My Projects (S-006) | ✅ img6.jpg | Both viewports |
| US-INV-01 | Invoices Grid (S-007) | ✅ img8.jpg | Both viewports |
| US-INV-02 | My Invoices Detail (S-008) | ✅ img3.jpg | Both viewports |
| US-TIME-01 | Time Logs (S-009) | ✅ img4.jpg | Both viewports; populated state missing |
| US-SET-01 | Settings (S-010) | ✅ img2.jpg | Both viewports |
| US-ERR-01 | 404 Page (S-011) | ✅ img11.jpg | Both viewports |
| US-INV-03 | Invoice Creation (S-012) | ✅ Specified | Generated from design tokens |
| US-CLIENT-02 | Client Add/Edit (S-013) | ✅ Specified | Generated from design tokens |
| US-PROJ-02 | Project Creation (S-014) | ✅ Specified | Generated from design tokens |
| US-TIME-02 | Log Time Modal (S-015) | ✅ Specified | Generated from design tokens |
| US-AUTH-02 | Forgot Password (S-016) | ✅ Specified | Generated from design tokens |
| US-TIME-01b | Time Logs Populated (S-017) | ✅ Specified | Generated from design tokens |
| US-PROJ-03 | Project Detail (S-018) | ✅ Specified | Generated from design tokens |
| US-CLIENT-03 | Client Detail (S-019) | ✅ Specified | Generated from design tokens |

***

## 13. Traceability Matrix

| Screen ID | Story ID | Image File | Viewport |
|-----------|----------|------------|----------|
| S-001 | US-LAND-01 | img1.jpg | Desktop + Mobile |
| S-002 | US-AUTH-01 | img10.jpg | Desktop + Mobile |
| S-003 | US-DASH-01 | img7.jpg | Desktop + Mobile |
| S-004 | US-CLIENT-01 | img5.jpg | Desktop + Mobile |
| S-005 | US-PROJ-01 | img9.jpg | Desktop + Mobile |
| S-006 | US-DASH-02 | img6.jpg | Desktop + Mobile |
| S-007 | US-INV-01 | img8.jpg | Desktop + Mobile |
| S-008 | US-INV-02 | img3.jpg | Desktop + Mobile |
| S-009 | US-TIME-01 | img4.jpg | Desktop + Mobile |
| S-010 | US-SET-01 | img2.jpg | Desktop + Mobile |
| S-011 | US-ERR-01 | img11.jpg | Desktop + Mobile |
| S-012 | US-INV-03 | ⚠️ None | — |
| S-013 | US-CLIENT-02 | ⚠️ None | —
| S-014 | US-PROJ-02 | ⚠️ None | —
| S-015 | US-TIME-02 | ⚠️ None | —
| S-016 | US-AUTH-02 | ⚠️ None | —
| S-017 | US-TIME-01b | ⚠️ None | —
| S-018 | US-PROJ-03 | ⚠️ None | —
| S-019 | US-CLIENT-03 | ⚠️ None | —