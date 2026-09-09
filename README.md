# 🌿 Oxygen Nursery — Website (Phase 1 Prototype)

> **Green Begins With Us.**
> Chandshi, Nashik, Maharashtra · 8888453354 / 7972453354 · 24/7 Customer Service

A complete, production-quality frontend for Oxygen Nursery. It runs entirely on your
machine — no domain, hosting, database, payment gateway or backend required — but it is
architected so a real backend can be connected later **without rebuilding the site**.

It now also carries real plant photography and a staff area: sign in to add and edit
plants, manage their photographs, and grant other people access. See
[§7 Imagery](#7-imagery--how-pictures-reach-the-site) and
[§10b Admin](#10b-admin--login-plants-images-people).

---

## 1. Install and run

```bash
cd oxygen-nursery
npm install         # installs dependencies (~70 packages, no heavy UI libraries)
npm run dev         # http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-checks and builds the production bundle into `dist/` |
| `npm run preview` | Serves the built site locally, exactly as it will be deployed |
| `npm run typecheck` | TypeScript check only |

**Requirements:** Node 18 or newer.

### Signing in to the staff area

The project ships with a `.env.local` holding the initial admin's **salt and
password digest** — no password is stored in the project. Sign in at
`/login` (or the "Staff login" link in the footer) with the username and
password you were given.

To change the credential, or to set one up on another machine:

```bash
node scripts/make-admin-hash.mjs   # paste the output into .env.local, then restart
```

`.env.local` is git-ignored. Full detail in [§10b](#10b-admin--login-plants-images-people).

---

## 2. Stack

React 18 · TypeScript (strict) · Vite 5 · React Router 6 · hand-written CSS.

No UI library, no animation library, no icon package — so nothing looks like a template
and the bundle stays small (**~126 KB gzipped** for the first load including CSS, routes
code-split after that — the whole admin area is a separate chunk a visitor never
downloads).

---

## 3. Folder structure

```
oxygen-nursery/
├─ .env.example            ← shape of .env.local (admin seed salt + hash)
├─ scripts/
│  ├─ import_plant_photos.py    ← bulk photo import (§7)
│  ├─ photo-selection.json      ← which frame is primary, and what was rejected
│  └─ make-admin-hash.mjs       ← generates the initial admin credential (§10b)
├─ public/
│  ├─ brand/               ← the official logo (see §5)
│  ├─ photos/plants/<slug>/     ← the photographs, at up to three widths (§7)
│  ├─ favicon-32.png, favicon-64.png, apple-touch-icon.png
├─ src/
│  ├─ config/
│  │  └─ businessConfig.ts ← EVERY business detail lives here
│  ├─ types/index.ts       ← Plant, Service, Project, PlantCareGuide, Review, Appointment…
│  ├─ data/                ← the content (§6)
│  │  ├─ plants.ts  categories.ts  collections.ts
│  │  ├─ services.ts  projects.ts  plantCare.ts  reviews.ts
│  │  ├─ photos.ts                    ← the photo manifest (§7)
│  │  └─ photoManifest.generated.ts   ← written by the import script
│  ├─ services/            ← the seams between UI and everything else (§10)
│  │  ├─ dataProvider.ts        (the interface every backend must satisfy)
│  │  ├─ localProvider.ts       (Phase 1: demo data + localStorage)
│  │  ├─ apiProvider.example.ts (Phase 2 template — copy and fill in)
│  │  ├─ providerRegistry.ts    (the ONE line to change when going live)
│  │  ├─ catalogStore.ts        (shipped plants + the admin's overlay)
│  │  ├─ adminService.ts        (what the admin screens call)
│  │  ├─ auth/                  authProvider, localAuthProvider,
│  │  │                         authRegistry, passwordHash
│  │  ├─ images/                imageStore, localImageStore, imageRegistry
│  │  ├─ plantService.ts        (search, filter, sort, related, recommend)
│  │  ├─ appointmentService.ts  (validation + submit + list + update)
│  │  ├─ contentService.ts  storage.ts
│  ├─ lib/                 ← whatsapp.ts (§8), format.ts, seed.ts
│  ├─ motion/              ← scrollEngine, useParallax, usePointerDepth,
│  │                         useTilt, useScrollDepth  (§7b)
│  ├─ hooks/               ← useAsync, useReveal, useSeo, useBodyScrollLock, useScrollPosition
│  ├─ context/             ← AuthContext (the signed-in session)
│  ├─ components/
│  │  ├─ layout/           Navbar, Footer, FloatingActions, Logo, Layout
│  │  ├─ admin/            AdminLayout, RequireAdmin, PlantImageManager,
│  │  │                    ConfirmDialog
│  │  ├─ ui/               Button styles, SmartImage, PhotoPending, Lightbox,
│  │  │                    BeforeAfter, SectionHead, PageHeader, EmptyState,
│  │  │                    Skeleton, Icon, StarRating, WhatsAppButton, Reveal
│  │  ├─ plants/           PlantCard, PlantGrid, PlantFilters, PlantGallery
│  │  ├─ services/         ServiceCard
│  │  ├─ projects/         ProjectGallery
│  │  └─ home/             the 14 home-page sections + HeroArt
│  ├─ pages/               Home, Plants, PlantDetail, Services, ServiceDetail,
│  │  │                    Projects, PlantCare, CareGuideDetail, About, Contact,
│  │  │                    Book, Login, NotFound
│  │  └─ admin/            Overview, PlantsAdmin, PlantEditor, ImagesAdmin,
│  │                       AppointmentsAdmin, AdminsAdmin
│  ├─ styles/              tokens.css, base.css, utilities.css, components.css,
│  │                       components2.css, sections.css, editorial.css,
│  │                       motion.css, admin.css
│  ├─ App.tsx              routes
│  └─ main.tsx             entry
```

---

## 4. Major components

| Component | What it does |
|---|---|
| **`Layout`** | Skip link, navbar, routed page, footer, floating actions, scroll restoration |
| **Home page order** | Composed as a story — discover → explore plants → find the right plant → explore services → see what is possible → book — with a different visual treatment at each step (editorial split, image tiles, an interactive panel, dark full-bleed bands) rather than one card grid repeated |
| **`Navbar`** | Sticky; transparent over the home hero and solid once you scroll. Active-page indicator, WhatsApp button, "Book Consultation" CTA, full-screen mobile menu. *Rendered as a sibling of the menu — the navbar's `backdrop-filter` would otherwise collapse a fixed-position child to zero height.* |
| **`SmartImage`** | The **only** place the site chooses between a real photo and demo artwork. `image.src` present → the photo is used (lazy, with a shimmer placeholder); absent or failed → generated illustration. Swapping in real photos is a data change only. |
| **`PlantPortrait` / `SceneArt` / `HeroArt`** | The illustration system — see §7 |
| **`PlantCard` / `PlantGrid` / `PlantFilters`** | The catalogue UI. Cards lead with a tall 4:5 plant image and carry only what helps someone choose; everything else is on the detail page. Filter state lives in the URL, so every view is shareable and survives a reload. `PlantGrid rail` turns the grid into a snap-scrolling swipe rail on phones |
| **`PlantGallery`** | The plant gallery. The viewport is a real scroll-snap track, so on a phone it is swiped like any native gallery — thumbnails and dots are derived from scroll position, so they can never disagree |
| **`GreenSolutionsValue`** | Replaces the old placeholder-reviews section. The site shows no invented customer names |
| **`Recommender`** | "Help me choose a plant" — four questions scored against real plant data by `plantService.recommend()` |
| **`ProjectGallery`** | Mosaic grid, category filters, keyboard-accessible lightbox |
| **`BeforeAfter`** | Comparison slider built on a real `<input type="range">`, so it works with mouse, touch **and** arrow keys |
| **`Lightbox`** | Esc to close, ← → to navigate, focus returned to the trigger on close |
| **`WhatsAppButton`** | Every WhatsApp CTA on the site renders through this, so wording and destination stay consistent |
| **`PageHeader` / `SectionHead`** | Consistent page banners and section headings with correct heading levels |
| **`EmptyState` / `Skeleton` / `PageLoader`** | Empty, loading and error states — no blank space anywhere |

---

## 5. The logo

The official Oxygen Nursery logo is used **exactly as supplied** — never redrawn,
recoloured or distorted. Only the white background was made transparent.

```
public/brand/logo-full.png   full lockup (mark + wordmark + tagline)
public/brand/logo-mark.png   ON monogram only, for tight spaces
public/favicon-32.png, favicon-64.png, apple-touch-icon.png   generated from the mark
```

It appears in the **navbar**, **mobile menu**, **footer**, **page loader**, **About page**
and as the **favicon**.

Because the artwork is deep evergreen on a light ground, dark sections place it on a soft
light tile (`.logo__tile`, `.footer__logo-plate`) rather than inverting it.

All paths are referenced from one place — `src/config/businessConfig.ts → BRAND`.
The whole palette in `src/styles/tokens.css` was sampled from this logo.

---

## 6. Where the plant data is stored

**`src/data/plants.ts`** — and nowhere else. No component hardcodes a plant name, image
or care value. Each plant carries:

```ts
id, slug, name, botanicalName, category, images[], description, longDescription,
availability, sunlight, water, soil, careLevel, price?, priceUnit?, tags[],
featured?, newArrival?, placements[], purposes[], matureSize?, careNotes[], collections[]
```

The other content files follow the same pattern:
`categories.ts`, `collections.ts`, `services.ts`, `projects.ts`, `plantCare.ts`, `reviews.ts`.

**On pricing:** every demo plant deliberately has **no price** — real nursery pricing was
not supplied and the site never invents one. Add `price: 350` to any plant and the price,
the price filter and the "Price: Low to High / High to Low" sort options appear
automatically across the site. Remove all prices and they disappear again.

**Availability** uses `available` / `limited` / `unavailable`, rendered as
🟢 Available · 🟡 Limited Stock · 🔴 Currently Unavailable, and is editable per plant.

---

## 7. Imagery — how pictures reach the site

**Plants are photographs or nothing.** A customer looking at a nursery
catalogue is judging what will arrive in their pot, so the site never puts a
drawing where a plant should be. Thirteen species ship with real photographs;
the rest show an explicit "photograph coming soon" panel until one is added.

Illustration is still used for **scenes** — a service, a project, a care guide —
because a drawing of drip irrigation is obviously a diagram of an idea, not a
photograph of a thing being sold.

### The one decision point

`src/components/ui/SmartImage.tsx` decides what every image on the site renders,
in this order:

| Condition | What renders |
|---|---|
| `image.src` set | that photograph, responsive via `srcSet`, lazily loaded |
| `image.plant` set and the plant has photographs | its first photograph |
| `image.plant` set and it has none | the "photograph coming soon" panel |
| `image.scene` set | a `SceneArt` illustration of that kind of work |
| a photograph fails to load | falls back as above, so nothing ever breaks |

Because a bare plant slug resolves through the manifest, category tiles and
collection tiles light up on their own as photographs arrive.

### The photographs that ship with the site

42 photographs across 13 species live in `public/photos/plants/<slug>/`, each
exported at up to three widths. `src/data/photoManifest.generated.ts` records
which widths genuinely exist for each file — **an image is never upscaled**, so
a 736px original advertises `400w, 736w` and the browser stops asking for more.

| | |
|---|---|
| Aloe Vera, Alphonso Mango, Areca Palm, Bougainvillea | 3, 3, 4, 3 photographs |
| Duranta Golden, Echeveria, Ficus Panda, Guava | 2, 4, 3, 3 |
| Gulmohar, Mogra, Monstera Deliciosa, Neem, Snake Plant | 4, 3, 4, 3, 3 |

Two supplied images were deliberately left out and the reasons are recorded in
`scripts/photo-selection.json`: one Duranta frame carried a visible stock-site
watermark, and one "Neem" frame was a photograph of ferns.

### Adding more photographs

**Normally:** the admin **Image Management** screen — upload, reorder, choose the
primary image, adjust the crop. No code, no deploy.

**In bulk**, from a folder of per-species subfolders:

```bash
python3 scripts/import_plant_photos.py "/path/to/plant images"
```

It writes the derivatives, never upscales, keeps each file inside a size budget,
and regenerates the manifest. Which frame becomes primary and in what order the
gallery follows is recorded in `scripts/photo-selection.json`.

**Services and projects** are still added by hand in `src/data/photos.ts` using
the `photo()` / `singlePhoto()` helpers.

### The "photograph coming soon" panel

`src/components/ui/PhotoPending.tsx`. The plant's name over a tiled leaf
watermark in the site's own palette. The watermark is ornament — it never
depicts a species, because the whole point is not to imply anything about a
plant nobody has photographed yet. It disappears by itself the moment a
photograph exists.

### The retired portrait renderer

`src/components/ui/botanical/PlantPortrait.tsx` and `profiles.ts` drew a
species-accurate portrait for each of the 32 plants. They are no longer
rendered — see the note at the top of that file — and nothing imports them, so
they are tree-shaken out of the bundle. They are kept because the drawing system
underneath them (`leaves.ts`, `parts.tsx`) still powers `SceneArt`.

## 7b. Motion — how the site moves

Motion is treated as one system with one vocabulary, not as effects added per
component. The reference is a garden in light wind: things settle rather than
snap, and most of the page is perfectly still so that the moments which do move
carry weight.

### Where it lives

| File | What it does |
|---|---|
| `src/styles/motion.css` | The whole vocabulary: easings, durations, reveal variants, micro-interactions, the cursor, the progress vine, and every reduced-motion override |
| `src/motion/scrollEngine.ts` | **One** passive scroll listener and **one** rAF loop for the entire site. Everything that moves on scroll subscribes here |
| `src/motion/useParallax.ts` | Depth layers. Geometry is measured on entry and on resize — never inside the scroll loop |
| `src/motion/usePointerDepth.ts` | The hero's mouse-driven depth. Desktop pointers only |
| `src/motion/useTilt.ts` | The plant card's slight turn. Desktop pointers only |
| `src/motion/useScrollDepth.ts` | Large images settling as they rise into view |

### The pieces

**Hero.** Four separate depth planes — sky, far ridge, nursery midground,
foreground foliage — plus two leaves overhanging the frame. The mid and near
planes drift on scroll; all four shift by different amounts as the mouse moves
across the scene; the sun drifts and the leaves sway on a long, slow cycle.

**Reveals.** Eight variants sharing one accent, chosen per section rather than
per element: `rise`, `unfurl` (opens from its base, like a new leaf), `bloom`,
`drift-left` / `drift-right`, `settle`, `sweep`, `grow`. Sections arrive as
compositions — a heading with its supporting text, a grid as a short sequence.

**Plant cards.** A slight 3D turn on desktop, as though a printed plant label
were being tilted in the hand, with the image drifting a little further than the
card. Capped low on purpose. Touch devices get a press state instead.

**Scroll depth.** Large images ease from slightly oversized to true size as they
rise, with the corners softening and the shadow deepening.

**Service cards.** Each icon hints at its own work: the irrigation drop falls,
the maintenance blades close, the vertical-garden cells turn into place, the
plantation icon grows upward, the compass needle finds its bearing. The
irrigation card goes further — engaging with it makes the drip line actually
run, drops falling from each emitter in a stagger and re-forming. Its resting
and final states match the static illustration exactly, so nothing jumps.

**Living plants.** Two illustrations on the whole site breathe: the plant on a
detail page, and the seedling inset on the home page. That restraint is the
point — the breath only reads as life because everything around it is still.
The motion is a translate rather than a scale (translating a layer is
composited; scaling re-rasterises it every frame), it runs at twelve seconds for
a seven-pixel rise, and it pauses the moment the artwork leaves the screen.
Use `alive` on `SmartImage`, or the `LiveArt` wrapper — and use it sparingly.

**Masked reveals.** The single large image on a service page and on a care guide
uncovers itself left to right through a mask rather than fading in.

**Growth.** Footer links and breadcrumbs are underlined by a rule that extends
from the left on hover, and section eyebrows draw their own rule as the section
arrives — the growth idea used abstractly rather than literally.

**Elsewhere.** A thin vine draws itself along the top as you read; a small
seed-green cursor dot with a ring that opens over anything clickable; organic
curved boundaries where dark sections meet light; buttons that light from below
and press under the finger; a navbar underline that travels between links; the
plant detail page arrives as one composition, the plant opening outward first
and its details following in from the side a beat later.

### The rules it follows

- **Stillness is the default.** Calm sections stay calm.
- **`prefers-reduced-motion` stops all of it.** No parallax, no pointer depth,
  no continuous animation, no cursor, no progress vine. Content still arrives —
  it simply arrives already in place.
- **Touch devices get no hover or pointer effects at all**, and parallax is
  reduced rather than copied from desktop.
- **Nothing reads layout inside the scroll loop.** Positions are measured on
  entry and on resize; each frame is arithmetic and one transform write.
- **`will-change` is scoped to the moment it is needed** — a layer is promoted
  while it moves and released afterwards, never left on across the page.

### Performance

Measured in this environment with a headless, software-rendered browser (no GPU
compositing), scrolling the whole home page:

| | motion on | motion off |
|---|---|---|
| Mobile 390px | **60 fps** | 60 fps |
| Mobile 390px, 4× slower CPU | **30 fps** | — |
| Desktop 1440px | **57–59 fps** | 60 fps |
| Desktop 1920px | **49–57 fps** | 60 fps |
| Plant detail (breathing plant) | **60 fps** | — |

Measured three times to separate real cost from noise. Every page except the
home page runs at 60 fps at every size.

Optimisations applied, in order of what they were worth:

1. **The hero parks itself completely once scrolled past** — animations paused,
   scene no longer rendered. By far the biggest win: its gating originally went
   through React state, and fast scrolling starved the update, leaving a
   full-screen animated scene rendering for the length of the page.
2. **No hook reads layout during scroll.** Positions are measured on entry and
   on resize; each frame is arithmetic and one transform write.
3. **`will-change` is scoped** to the moment it is needed, rather than left on
   every revealed element for the life of the page.
4. **Illustrations sit in their own positioned wrapper** (`.media__art`), which
   gives each one its own paint boundary and moves the hover zoom off the raw
   SVG. This alone lifted 1920px from ~36 fps to ~53 fps.
5. **Repaint-triggering properties** (radius, shadow, scale) are quantised to
   ~24 steps instead of changing every frame.

A note on measuring this, because it cost real time to learn: a tight
`requestAnimationFrame` scroll loop starves IntersectionObserver and scroll
events completely, so all the visibility gating never fires and the numbers
describe something that never happens in normal use. Measure with wheel-driven
scrolling and real gaps between steps. Likewise, full-page screenshots capture
reveals mid-transition and show blank sections — use element or viewport
screenshots with a wait longer than the 900 ms reveal.

## 8. How WhatsApp is configured

**Number:** `src/config/businessConfig.ts → WHATSAPP_NUMBER` (currently `918888453354`).
Change that one line and every WhatsApp button on the site follows.

**Messages:** `src/lib/whatsapp.ts` is the single utility. It builds a contextual message
for each situation:

| Context | Message generated |
|---|---|
| `plant` | *Hello Oxygen Nursery, I am interested in [Plant]. Please share availability and details.* |
| `plant-availability` | *…could you let me know when [Plant] will be available again?* |
| `service` | *…I would like to enquire about [Service].* |
| `appointment` | *…I would like to book a consultation for [Service] on [Date] at [Time]. My name is […]* |
| `project`, `care`, `custom`, `general` | contextual variants |

WhatsApp appears in the navbar, hero, plant cards, plant details, service cards, service
pages, contact page, footer, the floating button, the mobile action bar and the
appointment confirmation.

---

## 9. How appointments currently work

1. The visitor fills in the form on `/book`.
2. `appointmentService.validate()` checks required fields, a valid Indian mobile number,
   a valid date, and **rejects past dates**. Errors appear inline, focus jumps to the
   first invalid field.
3. `appointmentService.submit()` hands the request to the **data provider**.
4. The Phase 1 provider assigns a reference (`APT_…`), sets `status: 'pending'` and saves
   it to `localStorage` under `oxygen-nursery:appointments`. Storage failures (private
   browsing, quota) are handled silently — the visitor still gets their confirmation.
5. A professional success screen shows the reference, service, date, time and contact
   details, plus **"Continue on WhatsApp"** with the message pre-written.

The form is honest about what it is: it says a request has been received and will be
confirmed by phone or WhatsApp — it never claims a booking is confirmed.

Booking from a service page pre-selects that service: `/book?service=Terrace%20Gardens`.

---

## 10. Where the real backend connects

The UI never touches demo data or `localStorage` directly:

```
UI  →  service layer  →  DataProvider  →  local demo data      ← today
UI  →  service layer  →  DataProvider  →  REST / Firebase / Supabase   ← later
```

**To go live:**

1. Copy `src/services/apiProvider.example.ts` to `apiProvider.ts` and fill in the
   endpoints (the file already contains the full implementation sketch).
2. Add `VITE_API_URL` to a `.env` file.
3. Change **one line** in `src/services/providerRegistry.ts`:

```ts
export const provider: DataProvider = new ApiDataProvider();
```

That is the whole migration. No page, component, form, type or style changes. Because
services return a `Result<T>` envelope, a network failure will surface through the same
loading and error states that already exist.

`DataProvider` also declares the optional admin write methods (`savePlant`,
`deletePlant`, `saveProject`, `saveCareGuide`, …). The local provider now
implements the plant ones against the catalogue overlay described below.

### The other two seams

Authentication and image storage follow the same pattern, each with its own
one-line registry:

```
UI  →  useAuth()      →  AuthProvider  →  browser storage        ← today
UI  →  useAuth()      →  AuthProvider  →  your API / Firebase    ← later

UI  →  adminService   →  ImageStore    →  IndexedDB              ← today
UI  →  adminService   →  ImageStore    →  S3 / Cloudinary / …    ← later
```

| Seam | Interface | Today | The one line to change |
|---|---|---|---|
| Data | `services/dataProvider.ts` | `LocalDataProvider` | `services/providerRegistry.ts` |
| Auth | `services/auth/authProvider.ts` | `LocalAuthProvider` | `services/auth/authRegistry.ts` |
| Images | `services/images/imageStore.ts` | `LocalImageStore` | `services/images/imageRegistry.ts` |

A server implementation of `AuthProvider` keeps the same method names and simply
stops returning anything sensitive: `signIn` posts the credentials and lets the
server set an httpOnly cookie, `current()` becomes `GET /me`, and admin
management becomes ordinary authorised requests. No page, form or route guard
changes.

### The catalogue overlay

`services/catalogStore.ts` keeps the 32 shipped plants in `data/plants.ts` — they
are content, versioned with the code — and stores everything an admin does
**separately**, as an overlay of additions, field-level edits and hidden slugs,
merged on read.

Keeping the two apart is what makes the prototype safe to throw away: clearing
the overlay returns the catalogue to exactly what the build shipped, and a real
backend can adopt the overlay wholesale instead of reconciling it against the
seed data. Every public page reads through this layer, so an admin edit reaches
the catalogue, search, filters, category counts, related plants and the detail
page without any of them knowing the layer exists.

**Future pages** (`/shop`, `/cart`, `/checkout`, `/account`, `/wishlist`) are equally
additive — the catalogue already carries the fields a shop needs.

---

## 10b. Admin — login, plants, images, people

The public website is unchanged and completely open: no visitor ever needs an
account to browse, search, filter, read care guides, use WhatsApp or book a
consultation. Everything below sits behind `/login`.

### Getting in

The initial account is seeded at build time from **a salt and a PBKDF2 digest —
never a password**:

```bash
node scripts/make-admin-hash.mjs      # prompts, echoes nothing, prints the block
```

Put the block in `.env.local` (git-ignored; `.env.example` shows the shape) and
restart the dev server. If those variables are absent no account exists, and the
login screen says so rather than failing silently.

Vite inlines every `VITE_*` variable into the built JavaScript, which is exactly
why the password must not be one of them. A salted PBKDF2-SHA256 digest at
210,000 iterations cannot be read back into a password, so the bundle carries no
usable credential and neither does the repository.

### What it is, and what it is not

This is **access control, not security**. Accounts, the session and the password
check all live in the browser, so someone determined can open developer tools on
their own machine and write their own session. That is acceptable while there is
no server and nothing behind these screens except the same browser's data. It
stops being acceptable the moment the admin screens write to a real database — at
which point you replace `LocalAuthProvider` and the screens carry on unchanged.

The admin UI says this out loud on the login page and on every dashboard screen,
rather than letting anyone believe otherwise.

### The screens

| Route | What it does |
|---|---|
| `/login` | One door. States plainly that customers need no account. |
| `/admin` | Overview: catalogue size, how many plants still lack a photograph, appointment count, upload usage |
| `/admin/plants` | The catalogue, unphotographed plants first. Search, category and state filters. Remove and restore. |
| `/admin/plants/new` | Add a plant — name, botanical name, category, descriptions, availability, light, water, care level, soil, size, placement, purpose, tags, care notes |
| `/admin/plants/:slug/edit` | The same form, plus that plant's images |
| `/admin/images` | Pick a plant, manage its photographs |
| `/admin/appointments` | Consultation requests, with a pre-filled WhatsApp reply per request |
| `/admin/admins` | **Owners only.** Add, disable and remove admins |

Every route is wrapped in `RequireAdmin`, which waits for the session check
before deciding — otherwise a refresh would bounce a signed-in admin back to the
login page. A visitor typing an admin URL lands on `/login` and is returned to
where they were headed after signing in. A non-owner admin never sees Admin
Management in the sidebar and is redirected away from its URL.

### Roles

**Owner** does everything and manages people. **Admin** manages plants and
images. An owner cannot disable or remove their own account, and the owner
account cannot be deleted at all — otherwise the last way in could be closed by
accident.

### Images

A plant's pictures are one ordered list covering two kinds: photographs that
shipped with the build, and files uploaded through this screen. The first is the
primary image — the one the card, the search results and the page hero all use.
Both kinds can be reordered, promoted, given new alt text or nudged with a crop
position, so a shipped photograph and an uploaded one never fight.

Removing an upload deletes it. Removing a shipped photograph only takes it off
that plant; **Restore shipped images** puts the build's set back.

Files chosen for upload are previewed before anything is stored, and anything
over 500 KB is flagged with a note about resizing rather than silently accepted.

### Where prototype data lives, and its limits

| What | Where | Survives |
|---|---|---|
| Admin accounts, session | `localStorage` | this browser |
| Plant additions and edits | `localStorage` | this browser |
| Image order and crops | `localStorage` | this browser |
| Uploaded image bytes | IndexedDB | this browser |

IndexedDB rather than `localStorage` for the bytes: `localStorage` holds strings,
so a photograph would have to be base64-encoded — a third larger — inside a
~5 MB origin budget.

**An image uploaded here is on this browser, on this machine, and nowhere else.**
It is not on the website and another person opening the site will not see it.
That is the honest limit of a prototype with no server, and the admin screens say
so rather than letting someone believe they have published a photograph.
Photographs meant for every visitor go into `public/photos/plants/` at build
time — `scripts/import_plant_photos.py` does that in bulk.

---

## 11. What was tested

Verified in a real browser (Chromium) across **360, 390, 768, 1024, 1440 and 1920 px**:

- Navbar, active indicator, mobile menu, all 12 routes, all internal links resolve
- Plant search (debounced, URL-synced), all six filter groups, category deep links,
  sorting, empty state, clear filters
- Plant details, image gallery, lightbox (mouse + keyboard), related plants
- WhatsApp links generate the correct number and the correct contextual message
- Appointment validation (required fields, phone format, past dates), submission,
  success screen, localStorage persistence, service pre-selection
- Project gallery filtering, lightbox, before/after slider via mouse **and** arrow keys
- Plant care topic filtering and guide pages
- Recommendation tool end-to-end, including reset
- Loading, empty and error states
- No console errors, no page errors, no horizontal scrolling at any width
- One `<h1>` per page, no heading-level jumps, all images have alt text, every button
  and link has an accessible name, all non-inline controls ≥ 24 px
- `prefers-reduced-motion` disables every animation — verified explicitly:
  parallax, pointer depth, hero animations, cursor and progress vine all stop,
  and all content is visible immediately
- Touch devices verified to receive no cursor and no card tilt
- The hero verified to park itself (animations paused, scene not rendered) once
  scrolled past
- Off-screen illustrations mount only when approached: the home page loads with
  ~5,400 DOM nodes instead of ~14,600, and first contentful paint is under 550 ms

**This pass (photographs and admin)**

- All 46 supplied photographs reviewed individually against the species their
  folder claimed. Two were rejected: a watermarked Duranta frame, and a "Neem"
  frame that was a photograph of ferns.
- All 13 photographed plants verified to render their own images — no image
  reused across species, none broken, none falling back to artwork
- The catalogue verified to contain 32 cards, 13 photographs, 19 coming-soon
  panels and **zero** plant illustrations
- Responsive selection verified: a 390 px phone at 1× fetches the 400 px tier
  (64 KB above the fold), at 2× the 600–800 px tiers (73 KB); desktop 76 KB
- Admin: unauthenticated access to `/admin`, `/admin/plants`, `/admin/images`,
  `/admin/admins` and `/admin/plants/new` all redirect to `/login`; a wrong
  password is refused; the right one returns you to the page you asked for
- A non-owner admin has no Admin Management in the sidebar and is redirected
  away from its URL
- Adding a plant, then finding it by search on the public site, on its own detail
  page, and with its uploaded photograph rendering
- Editing a shipped plant, then seeing the new description, the new availability
  badge, the new tag in search and the plant under the availability filter
- Creating a second admin: mismatched passwords refused, duplicate username
  refused, the account then able to sign in
- Making a gallery image primary, then seeing the public hero follow
- Contrast checked on every new colour pair (5.5:1 to 12.3:1, all pass AA)

---

## 12. Content rules the site follows

- **No invented claims.** No years of experience, awards, certifications, employee or
  project counts, client names, or guarantees appear anywhere.
- **Demo reviews are labelled as demo** and are never presented as real feedback.
- **Demo projects are labelled as samples** describing a *type* of work, never a client.
- **No third-party details.** No other company's name, address, contact details, branding
  or personal information appears. The site is only Oxygen Nursery.
- **Customer service is described as "24/7 Customer Service"** — never as the nursery
  being physically open 24/7. The Contact page says explicitly that visiting hours may
  differ and to call ahead.
- **No map coordinates were guessed.** The Contact page shows a clear placeholder with a
  working Google Maps search link until the exact pin is supplied — add
  `GOOGLE_MAPS.embedUrl` in `businessConfig.ts` and the embedded map appears.
- Plant care guides state general horticultural practice, with no medical or scientific
  claims. The oleander entry carries a toxicity warning.

---

## 13. Suggested next steps

**Content to supply**
1. Photographs for the 19 plants that still show "coming soon" — through
   Image Management, or in bulk with `scripts/import_plant_photos.py`
2. Photographs of the nursery itself and of completed projects (services and
   projects still use illustrations)
3. The exact Google Maps location
4. Real pricing, if you want prices shown
5. Real customer reviews
6. Instagram / Facebook / YouTube URLs (footer links stay disabled until then)

**Phase 2 build**
7. Backend + database (Firebase, Supabase or a Node/REST API) via the provider
   swap — this is also what turns admin uploads into something the public sees
8. Server-side authentication, replacing `LocalAuthProvider` at its registry
   line. Until then the admin login is access control, not security.
9. WhatsApp Business API for automatic appointment notifications
10. Online shop: cart, checkout, UPI/online payments, delivery and pickup, order tracking
11. Customer accounts, wishlist, order history, availability notifications
12. Google Business Profile and Google Reviews integration
13. Analytics, sitemap.xml, robots.txt and structured data (LocalBusiness schema)
14. Deploy: any static host works (Netlify, Vercel, Cloudflare Pages) — build with
    `npm run build` and serve `dist/`, with a catch-all rewrite to `index.html` for
    client-side routing.

---

© Oxygen Nursery · *Green Begins With Us.*
 
 
