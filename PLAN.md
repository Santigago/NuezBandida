# NuezBandida — Couples App: Project Plan

A shared web app for logging dates, bucket-list places, recipes, videos, tips,
motel ratings, and a movies/shows watchlist — with a photo slideshow homepage,
a randomized background, "next date" recommendations, and a shared
photo/text board.

**Language**: the entire UI is in **Spanish** (labels, buttons, nav, empty
states, etc).

This file is the source of truth for the build. Work through it phase by
phase inside your Claude Project — each phase is a self-contained chunk you
can hand me one at a time ("let's do Phase 2 now").

---

## 1. Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | **React + Vite + Tailwind CSS** | Fast dev loop, easy to make "pretty" quickly, huge ecosystem for sliders/animations |
| Backend + DB + Auth + File storage | **Supabase** (free tier) | One service gives you a Postgres database, image/file storage (for your photos), and simple login — no separate backend server to write or host |
| Hosting | **Vercel** (frontend) + Supabase (backend) | Both have generous free tiers, deploy from GitHub in a few clicks, gives you a real shareable link |

**Why not simpler (no backend, just local files)?**
Because you want *both of you* to add photos/entries and see each other's
updates — that requires shared storage somewhere, not just files on one
person's laptop. Supabase is the least-work way to get that without you
running your own server.

*(If you'd rather avoid a backend entirely, an alternative is a fully local
version — one shared browser, data stored only in that browser — but then
you can't each update it from your own phone. I've flagged this as a
decision below.)*

---

## 2. Decisions to confirm

1. ✅ **Stack**: Supabase + React
2. ✅ **Login**: one shared password for both of you
3. ✅ **Where it lives**: deployed online with a real link
4. ✅ **App name**: NuezBandida
5. ✅ **Language**: Spanish throughout
6. ✅ **Color palette**: Burgundy + coffee brown, coexisting in harmony — coffee brown predominant across most of the site, burgundy predominant specifically in the motel-related views
7. ✅ **Two background photos** (Hubble "what did Hubble see on your birthday" images, kept separate from the slideshow pool):
   - March 9 (her birthday) — Flame Nebula: `https://science.nasa.gov/specials/apps/what-did-hubble-see-on-your-birthday/images/march-9-2019-flame-nebula.jpg`
   - February 1 (his birthday) — Carina Nebula Pillars: `https://science.nasa.gov/specials/apps/what-did-hubble-see-on-your-birthday/images/february-1-2010-carina-nebula-pillars.jpg`

---

## 3. Phases

### Phase 0 — Setup
- Confirm decisions above
- Create Supabase project (free) + GitHub repo
- I scaffold the React + Vite + Tailwind project structure

### Phase 1 — Design system & shell
- Palette: burgundy + coffee brown. Coffee brown as the base/predominant tone site-wide; burgundy shifts to predominant specifically on motel-related screens (accent elsewhere)
- Fonts + overall "vibe" (you'll get a direction to react to)
- Top nav bar, in Spanish, with all sections: Inicio · Citas · Lugares por Visitar · Recetas · Videos y Links · Tips · Moteles · Películas y Series
- Responsive layout (mobile + desktop)

### Phase 2 — Auth
- Simple login for just the two of you (per decision #2)
- Basic "who's logged in" indicator

### Phase 3 — Core data sections (one CRUD pattern, reused everywhere)
- Database tables: dates_log, bucket_list, recipes, videos_links, tips, motel_ratings, watchlist
- Add / edit / delete / view entries for each section
- Ratings/stars for motels, watched/unwatched toggle for movies & shows
- **Places (Dates + Bucket List) specifically get:**
  - Tags (e.g. cafetería, parque, museo, restaurante — a manageable, extensible tag list)
  - Status per place: **Visitado** / **Por visitar**
  - Search bar (by name) plus filters by tag and by status

### Phase 4 — Homepage
- Photo slideshow (your uploaded pics)
- Randomized background on each visit, picked from your 2 chosen images (kept separate from the slideshow pool)
- "Where to go next" recommendations (simple version: pulls from places marked **Por visitar**; can get smarter later)
- Shared photo/text board (a corkboard-style area either of you can drop a photo or note on for the other to see)

### Phase 5 — Image upload & storage
- Wire up Supabase Storage for slideshow photos + board uploads
- Basic image handling (resize/compress on upload so it stays fast)

### Phase 6 — Polish
- Animations/transitions, empty states, loading states
- Mobile pass, since you'll likely both check this from your phones

### Phase 7 — Deployment
- Push to Vercel, connect to Supabase, get you a real link

### Phase 8 — Extend later (pick from anytime)
- Smarter recommendations (e.g. weighted by category you haven't done in a while)
- Google Maps embed for date locations / motels
- Notifications when the other adds something to the board
- Shared calendar view of past dates
- Export as a "yearbook" PDF at year-end

---

## 4. How we'll work through this

- Tackle one phase per session/message where possible
- At any point, say things like "change the nav bar colors" or "I don't like the slideshow transition" — style tweaks don't need to wait for a phase boundary
- I'll ask for decisions inline when a phase needs one (e.g. the 2 background photos before Phase 4)
