# Srishtipadam — System Architecture

A bilingual (Malayalam default / English) book & magazine showcase and ordering
platform. React frontend, Node/Express backend, MongoDB, Cloudinary for all
media. Light "nature/white + light-green" theme with a dark mode, smooth
animations, and accessibility built in from the start.

---

## 1. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React (Vite) | Fast dev server, easy env config |
| Styling | Tailwind CSS | `dark:` variants for dark mode, custom green palette |
| Animation | Framer Motion | Page transitions, scroll reveals, hover/tap micro-interactions |
| i18n | react-i18next | `ml` (default) + `en`, persisted in localStorage |
| Routing | React Router v6 | |
| State/data | React Query (TanStack Query) | Caching, loading/error states for all API calls |
| Forms | React Hook Form + Zod | Validation for order/join/admin forms |
| PDF viewing | `react-pdf` (pdf.js) | Streams Cloudinary-hosted PDF, in-browser reader |
| Backend | Node.js + Express | REST API |
| DB | MongoDB + Mongoose | |
| Auth (admin only) | JWT (httpOnly cookie) + bcrypt | No user accounts needed — public site has no login |
| File storage | Cloudinary | Images, event videos, magazine PDFs, cover images |
| Uploads | Multer (memory storage) → Cloudinary SDK | Backend proxies upload, never expose Cloudinary secret to frontend |
| Deployment | Frontend: Vercel/Netlify. Backend: Render/Railway. DB: MongoDB Atlas | |

No user login is required for the public side — "ordering" and "joining" are
both just forms that create a record (and, for Join, also open a prefilled
WhatsApp chat). This matches the brief and keeps scope tight.

---

## 2. Folder Structure

```
srishtipadam/
├── client/                          # React app
│   ├── public/
│   │   └── locales/
│   │       ├── ml/translation.json
│   │       └── en/translation.json
│   ├── src/
│   │   ├── api/                     # axios instance + endpoint functions
│   │   │   ├── axiosClient.js
│   │   │   ├── books.js
│   │   │   ├── orders.js
│   │   │   ├── events.js
│   │   │   ├── magazines.js
│   │   │   ├── committee.js
│   │   │   ├── join.js
│   │   │   └── admin/ (auth.js, uploads.js)
│   │   ├── components/
│   │   │   ├── layout/ (Navbar, Footer, LanguageSwitch, ThemeToggle)
│   │   │   ├── books/ (BookCard, BookGrid, BookDetailModal, OrderForm)
│   │   │   ├── events/ (EventCard, EventGallery, VideoPlayer)
│   │   │   ├── magazines/ (MagazineCard, PdfReader)
│   │   │   ├── committee/ (MemberCard)
│   │   │   ├── join/ (JoinForm, BenefitsSection)
│   │   │   ├── common/ (Button, Modal, Loader, EmptyState, Toast, SectionHeading)
│   │   │   └── admin/ (Sidebar, DataTable, ImageUploader, MultiUploader, StatCard)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Books.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Magazines.jsx
│   │   │   ├── Committee.jsx
│   │   │   ├── Join.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminBooks.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       ├── AdminEvents.jsx
│   │   │       ├── AdminMagazines.jsx
│   │   │       └── AdminCommittee.jsx
│   │   ├── context/ (ThemeContext.jsx, AdminAuthContext.jsx)
│   │   ├── hooks/ (useTheme, useLanguage, useDebounce)
│   │   ├── i18n.js
│   │   ├── App.jsx
│   │   ├── router.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Express API
│   ├── src/
│   │   ├── config/ (db.js, cloudinary.js, env.js)
│   │   ├── models/
│   │   │   ├── Book.js
│   │   │   ├── Order.js
│   │   │   ├── Event.js
│   │   │   ├── Magazine.js
│   │   │   ├── CommitteeMember.js
│   │   │   ├── JoinRequest.js
│   │   │   └── Admin.js
│   │   ├── controllers/ (books, orders, events, magazines, committee, join, auth)
│   │   ├── routes/ (books, orders, events, magazines, committee, join, auth, upload)
│   │   ├── middleware/ (auth.js — verifyAdmin, errorHandler.js, upload.js — multer config, validate.js)
│   │   ├── utils/ (cloudinaryUpload.js, asyncHandler.js, apiResponse.js)
│   │   └── app.js
│   ├── server.js
│   └── .env.example
│
└── README.md
```

---

## 3. Data Models (Mongoose Schemas)

### Book
```
name          String, required
writer        String, required
price         Number, required
pages         Number
description   { ml: String, en: String }
coverImage    { url, publicId }        // Cloudinary
category      String (optional, e.g. "novel", "poetry")
inStock       Boolean, default true
featured      Boolean, default false   // show on homepage
createdAt / updatedAt
```

### Order  (created when a user submits the "order book" form)
```
book          ObjectId → Book
bookNameSnapshot  String   // in case book is later deleted
fullName      String, required
mobile        String, required
address       String, required
notes         String
status        enum: "pending" | "contacted" | "fulfilled" | "cancelled", default "pending"
createdAt
```

### Event
```
name          { ml, en }
place         { ml, en }
date          Date, required
time          String
description   { ml, en }
images        [{ url, publicId }]
videos        [{ url, publicId }]
isUpcoming    Boolean  (derived from date, but stored for admin override/pinning)
createdAt
```

### Magazine
```
title         { ml, en }
description   { ml, en }
coverImage    { url, publicId }
pdf           { url, publicId }
issueNumber   String
publishedDate Date
createdAt
```

### CommitteeMember
```
name          String
role          { ml, en }   // e.g. President, Secretary
phone         String
photo         { url, publicId }
description   { ml, en }
order         Number   // for manual sort/display order
createdAt
```

### JoinRequest  (logged before redirecting to WhatsApp, for admin records)
```
name          String, required
district      String, required
mobile        String, required
reason        String, required   // "why do you want to join"
createdAt
```

### Admin
```
username      String, unique
passwordHash  String
createdAt
```
(Single or few admin accounts — seeded manually via script, no public registration.)

---

## 4. API Endpoints

### Public
```
GET    /api/books                 list (supports ?category, ?search, ?featured)
GET    /api/books/:id             single book detail
POST   /api/orders                create order  { bookId, fullName, mobile, address, notes }

GET    /api/events?type=upcoming|past

GET    /api/magazines             list
GET    /api/magazines/:id         single (for PDF reader page)

GET    /api/committee             list, sorted by `order`

POST   /api/join                  create join request → returns success;
                                   frontend then opens wa.me link with prefilled text
```

### Admin (all require `Authorization` cookie/JWT, verified by `verifyAdmin` middleware)
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

POST   /api/books          | PUT /api/books/:id | DELETE /api/books/:id
GET    /api/orders         | PUT /api/orders/:id   (update status)

POST   /api/events         | PUT /api/events/:id | DELETE /api/events/:id
POST   /api/magazines      | PUT /api/magazines/:id | DELETE /api/magazines/:id
POST   /api/committee      | PUT /api/committee/:id | DELETE /api/committee/:id

POST   /api/upload/image        generic single-image upload → returns {url, publicId}
POST   /api/upload/multiple     multi-image/video upload for events
POST   /api/upload/pdf          magazine PDF upload
```

All admin write routes accept `multipart/form-data` where files are involved;
Multer buffers the file in memory, then `cloudinaryUpload.js` streams it to
Cloudinary and the resulting `{url, publicId}` is saved on the document.
Deleting a document also deletes its Cloudinary assets (via `publicId`).

---

## 5. WhatsApp "Join Now" Flow

No paid WhatsApp Business API needed for v1:
1. User fills Join form (name, district, mobile, reason, why join).
2. Frontend POSTs to `/api/join` (so admin has a record even if the user
   backs out of WhatsApp).
3. On success, frontend builds a prefilled message and opens:
   `https://wa.me/<SRISHTIPADAM_WHATSAPP_NUMBER>?text=<url-encoded message>`
4. This opens WhatsApp (mobile app or web) with the message ready to send —
   user taps send.

The org's WhatsApp number is an env var on the frontend
(`VITE_WHATSAPP_NUMBER`). If a paid automated flow is wanted later
(auto-reply, no manual "send" tap), that needs the WhatsApp Business Cloud
API — flagged as a future enhancement, not v1.

---

## 6. Internationalization (ml default / en)

- `react-i18next` with `public/locales/ml/translation.json` and `en/translation.json`
  for all **static UI strings** (nav labels, buttons, headings, benefits list,
  about page copy).
- **Dynamic admin-entered content** (book description, event description,
  committee bios, magazine description) is stored as `{ ml: "", en: "" }` in
  the DB itself, with both fields required in the admin forms. Frontend reads
  `content[currentLang]`, falling back to `ml` if `en` is empty (or vice versa).
- Language toggle lives in the Navbar, persists choice to `localStorage`,
  defaults to `ml` on first visit.
- `<html lang="ml">` / `lang="en"` updated dynamically for accessibility/SEO.

---

## 7. Theming (Light nature / Dark mode)

Tailwind custom palette, e.g.:
```
primary:   #4C9A6A   (leafy green)
primary-light: #E8F5EC
background: #FFFFFF / dark: #10231A
surface:   #F4FAF6 / dark: #16281F
text:      #1E2A22 / dark: #E7F3EC
accent:    #A3D9B1
```
- `dark` mode via Tailwind's `class` strategy, toggle stored in
  `localStorage` + respects `prefers-color-scheme` on first load.
- Subtle nature motifs: soft leaf/organic-blob SVG shapes in hero/section
  backgrounds, rounded corners, soft shadows — kept minimal, not busy.

---

## 8. Animation Plan (Framer Motion)

- Page transitions: fade + slight slide on route change.
- Scroll-reveal for cards (books, events, committee) using `whileInView`.
- Navbar shrink/blur on scroll.
- Buttons: scale on hover/tap (respect `prefers-reduced-motion`).
- Skeleton loaders (not spinners only) while data fetches, for a polished feel.
- Modal/form open-close with spring transitions.

---

## 9. Accessibility Checklist

- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<button>` not `<div onClick>`).
- All images have meaningful `alt` (admin form requires alt text or falls
  back to book/event name).
- Color contrast checked in both themes (WCAG AA minimum).
- Focus-visible states styled clearly; full keyboard navigation (tab order,
  Esc closes modals, Enter/Space activates custom buttons).
- Forms: labelled inputs, inline error messages tied via `aria-describedby`.
- Respect `prefers-reduced-motion` — disable non-essential animation.
- Language toggle and theme toggle both keyboard-operable with visible state.

---

## 10. Security Notes

- Admin routes protected by JWT in httpOnly, secure cookie (not localStorage).
- Passwords hashed with bcrypt; no plaintext ever stored/logged.
- Rate-limit `/api/orders` and `/api/join` (e.g. `express-rate-limit`) to
  prevent spam submissions.
- Validate & sanitize all inputs server-side (Zod or Joi) even though
  client also validates.
- Cloudinary uploads restricted by file type/size server-side before upload
  (images: jpg/png/webp ≤5MB; PDFs ≤25MB; videos ≤50MB, or use Cloudinary's
  video transformation limits).
- CORS locked to the deployed frontend origin only.

---

## 11. Environment Variables

**server/.env**
```
PORT=5000
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_ORIGIN=http://localhost:5173
```

**client/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
```
