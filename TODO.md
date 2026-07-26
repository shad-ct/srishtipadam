# Srishtipadam — Build TODO

Companion to `ARCHITECTURE.md`. Organized in phases so an AI coding agent
(or you) can work top-to-bottom without losing context. Check items off as
you go.

---

## Phase 0 — Project Setup

- [x] Create monorepo folders: `client/`, `server/`
- [x] `client`: scaffold Vite + React, install Tailwind, React Router,
      React Query, react-i18next, Framer Motion, React Hook Form, Zod, axios,
      react-pdf
- [x] `server`: `npm init`, install express, mongoose, cloudinary, multer,
      jsonwebtoken, bcrypt, cors, dotenv, express-rate-limit, zod (or joi)
- [x] Set up `.env` files (client + server) per `ARCHITECTURE.md` §11
- [x] Create MongoDB Atlas cluster + get connection string
- [x] Create Cloudinary account, get cloud name/key/secret
- [x] Set up `server/src/config/db.js` (Mongoose connect) and
      `cloudinary.js` (Cloudinary config)
- [x] Basic `app.js` with CORS, JSON body parsing, route mounting,
      global error handler
- [x] Confirm client ↔ server talk via a `GET /api/health` test route

---

## Phase 1 — Backend: Models & Core CRUD

- [x] Build all Mongoose models (`Book`, `Order`, `Event`, `Magazine`,
      `CommitteeMember`, `JoinRequest`, `Admin`) per schema in architecture doc
- [x] `utils/cloudinaryUpload.js` — helper to stream buffer → Cloudinary,
      return `{url, publicId}`; helper to delete by `publicId`
- [x] `middleware/upload.js` — Multer memory storage, file-type/size limits
- [x] Generic upload routes: `/api/upload/image`, `/api/upload/multiple`,
      `/api/upload/pdf` (admin-only)
- [x] Books: full CRUD controllers + routes (public GET, admin
      POST/PUT/DELETE)
- [x] Orders: `POST /api/orders` (public), `GET /api/orders` + status
      update (admin)
- [x] Events: full CRUD, supporting multiple images + videos per event
- [x] Magazines: full CRUD, cover image + PDF upload
- [x] Committee: full CRUD with `order` field for sorting
- [x] Join requests: `POST /api/join` (public, logs to DB), `GET
      /api/join` (admin, view submissions)
- [x] Seed script: create one admin user (`node scripts/seedAdmin.js`)
- [x] Auth: `POST /api/auth/login` (bcrypt compare, sign JWT into httpOnly
      cookie), `POST /api/auth/logout`, `GET /api/auth/me`
- [x] `middleware/auth.js` — `verifyAdmin` guarding all admin routes
- [x] Add `express-rate-limit` to `/api/orders` and `/api/join`
- [x] Server-side validation (Zod/Joi schemas) for every POST/PUT body
- [x] Test every endpoint with Postman/Thunder Client before moving to frontend

---

## Phase 2 — Frontend: Foundation

- [ ] Tailwind config: custom green/nature palette + dark mode (`class`
      strategy) per architecture doc §7
- [ ] `i18n.js` setup, `locales/ml/translation.json` +
      `locales/en/translation.json` with all static strings stubbed
- [ ] `ThemeContext` — light/dark toggle, persisted, respects system
      preference on first load
- [ ] `Navbar` — logo, nav links (Home, Books, Events, Magazines,
      Committee, About), language switch, theme toggle, **Join Now** button
      (styled distinctly), mobile hamburger menu
- [ ] `Footer` — org info, socials, static
- [ ] `router.jsx` — set up all public routes + admin routes (admin under
      `/admin/*`, separate layout with sidebar)
- [ ] Common components: `Button`, `Modal`, `Loader`/`Skeleton`,
      `EmptyState`, `Toast` (for success/error messages), `SectionHeading`
- [ ] `axiosClient.js` — base instance with `withCredentials: true` (for
      admin cookie auth)
- [ ] Global layout wrapper with page-transition animation (Framer Motion)

---

## Phase 3 — Frontend: Public Pages

### Home
- [ ] Hero section (nature-vibe illustration/SVG, tagline, CTA to Books)
- [ ] Featured books preview strip
- [ ] Upcoming event teaser
- [ ] Latest magazine teaser
- [ ] "Why Join" teaser → links to Join page

### Books
- [ ] `BookGrid` fetching from `/api/books` via React Query, with
      loading skeletons
- [ ] Search/filter (by category, name) — optional nice-to-have
- [ ] `BookCard` — cover image, name, writer, price, "Order" button
- [ ] `BookDetailModal` (or dedicated page `/books/:id`) — full
      description, pages, writer, price, "Order This Book" CTA
- [ ] `OrderForm` — React Hook Form + Zod: fields = book name (prefilled,
      read-only), full name, mobile, address, notes; on submit → POST
      `/api/orders` → success toast + form reset

### About
- [ ] Static page, content pulled from i18n JSON (both languages),
      simple animated section reveals

### Events
- [ ] Tabs or sections: "Upcoming Events" / "Past Events Gallery"
- [ ] `EventCard` — name, place, date/time, description
- [ ] Gallery: lightbox for images (e.g. `yet-another-react-lightbox` or
      custom modal), inline video player for event videos
- [ ] Empty state if no upcoming events

### Magazines
- [ ] `MagazineCard` grid — cover image, title, published date
- [ ] Click → `PdfReader` page/modal using `react-pdf`, page navigation
      controls, loading state while PDF streams from Cloudinary
- [ ] Description shown alongside reader

### Committee
- [ ] Grid of `MemberCard` — photo, name, role, short description, phone
      (click-to-call link), sorted by `order` field

### Join Now
- [ ] Static "Benefits of Joining" section (i18n content, icon list,
      animated on scroll)
- [ ] `JoinForm` — name, district, mobile, why-join/description; on
      submit: POST `/api/join`, then build WhatsApp message string and
      `window.open('https://wa.me/...')` per architecture §5
- [ ] Success state after redirect ("Thank you — complete sending the
      message on WhatsApp")

---

## Phase 4 — Frontend: Admin Panel

- [ ] `AdminLogin` page — username/password form, calls `/api/auth/login`
- [ ] Route guard (`AdminAuthContext`) redirecting to login if not
      authenticated; verify via `/api/auth/me` on load
- [ ] `AdminDashboard` — quick stats (total books, pending orders, upcoming
      events, magazines count)
- [ ] `AdminBooks` — table list + add/edit modal form (name, writer,
      price, pages, description ml/en, cover image uploader, in-stock
      toggle, featured toggle), delete with confirm
- [ ] `AdminOrders` — table of orders, filter by status, update status
      dropdown (pending/contacted/fulfilled/cancelled)
- [ ] `AdminEvents` — add/edit form (name ml/en, place ml/en, date, time,
      description ml/en, multi-image uploader, multi-video uploader),
      delete with confirm (also removes Cloudinary assets)
- [ ] `AdminMagazines` — add/edit form (title ml/en, description ml/en,
      cover image uploader, PDF uploader, issue number, published date)
- [ ] `AdminCommittee` — add/edit form (name, role ml/en, phone, photo
      uploader, description ml/en, sort-order input/drag-reorder)
- [ ] `AdminJoinRequests` — read-only table of join submissions (name,
      district, mobile, reason, date)
- [ ] Reusable `ImageUploader` / `MultiUploader` components (drag-drop,
      preview, progress state, calls `/api/upload/*`)
- [ ] Admin sidebar nav + logout button

---

## Phase 5 — Polish: Animation, Theme, i18n, Accessibility

- [ ] Sweep every page for scroll-reveal + hover/tap micro-animations
      (Framer Motion), respecting `prefers-reduced-motion`
- [ ] Verify dark mode across **every** page/component, not just shell
- [ ] Fill in all remaining i18n strings (no hardcoded English/Malayalam
      text left in components)
- [ ] Verify dynamic content fallback logic (`ml` ⇄ `en`) when a field is
      empty in one language
- [ ] Accessibility pass: alt text everywhere, keyboard nav test, focus
      states, color contrast check (both themes), form error announcements
- [ ] Mobile responsiveness pass on all pages (nav, grids, admin tables →
      cards on small screens)
- [ ] Add `robots.txt`, meta tags, favicon, Open Graph tags (bilingual)

---

## Phase 6 — Testing & Deployment

- [ ] Manual QA: full user flow (browse → order), full join flow, full
      admin CRUD flow for all 4 content types
- [ ] Test PDF reader on slow connection / mobile
- [ ] Test WhatsApp deep link on both mobile and desktop
- [ ] Set production env vars on hosting platforms
- [ ] Deploy backend (Render/Railway), confirm MongoDB Atlas IP
      allowlist includes hosting provider
- [ ] Deploy frontend (Vercel/Netlify), set `VITE_API_BASE_URL` to
      production backend URL
- [ ] Set CORS `CLIENT_ORIGIN` on backend to production frontend URL
- [ ] Final smoke test on production URLs, both languages, both themes,
      mobile + desktop

---

## Future Enhancements (not v1)

- [ ] WhatsApp Business Cloud API for fully automated join-message sending
- [ ] Payment gateway integration for direct book purchase (currently
      order-only, manual follow-up)
- [ ] Email notifications to admin on new order/join submission
- [ ] Search/filter improvements (books by writer, price range)
- [ ] Newsletter signup
