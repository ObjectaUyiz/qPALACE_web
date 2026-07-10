# qPALACE — SFQ Logic Compiler Homepage

A lightweight, academic-style static website for the **qPALACE** project (Physical
and Logical Aware Compiler Engine for Single Flux Quantum Logic). Built with
**Vue 3 + Vite + TypeScript + Tailwind CSS**.

Maintained by [SPORTLab](https://sportlab.usc.edu/) at the USC Viterbi School of
Engineering.

---

## Contents

- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Updating content](#updating-content)
  - [1. `site.json` — site-wide settings](#1-sitejson--site-wide-settings)
  - [2. `people/` — team profiles](#2-people--team-profiles)
  - [3. `papers.json` — publications](#3-papersjson--publications)
  - [4. `slides.json` — talks & presentations](#4-slidesjson--talks--presentations)
  - [5. `carousel.json` — homepage carousel](#5-carouseljson--homepage-carousel)
  - [6. `features.json` — feature blocks](#6-featuresjson--feature-blocks)
  - [7. `news.json` — latest news](#7-newsjson--latest-news)
  - [8. `resources.json` — external links](#8-resourcesjson--external-links)
  - [9. `libraries.json` — license attributions](#9-librariesjson--license-attributions)
- [Image specifications](#image-specifications)
- [Deployment](#deployment)
- [Development](#development)

---

## Quick start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173/

# Build for production
npm run build

# Preview the production build
npm run preview
```

Requires **Node.js ≥ 18**.

---

## Project structure

```
qpalace-web/
├── public/
│   ├── favicon.svg                   site icon (SVG)
│   ├── papers/                       PDF papers → /papers/...
│   ├── slides/                       PDF/PPTX slides → /slides/...
│   ├── images/
│   │   ├── carousel/                 homepage carousel images
│   │   └── people/                   team member avatars
├── src/
│   ├── assets/main.css               Tailwind + component styles
│   ├── components/
│   │   ├── Navbar.vue                sticky top navigation
│   │   ├── Footer.vue                contact + funding + back-to-top
│   │   ├── PaperCitationItem.vue     Google Scholar–style citation row
│   │   ├── PaperFilters.vue          search bar + dropdowns
│   │   ├── BibtexBlock.vue           expandable BibTeX + copy button
│   │   ├── SlideCard.vue             slide card with download links
│   │   ├── common/Pagination.vue     page numbers + page-size changer
│   │   └── home/
│   │       ├── HeroSection.vue       centered wordmark hero
│   │       ├── ImageCarousel.vue     auto-rotating image carousel
│   │       ├── FeatureSection.vue    stacked feature blocks
│   │       └── LatestNews.vue        dated news list
│   ├── data/                         ← content: edit these files
│   │   ├── site.json                 site-wide settings
│   │   ├── people/                   team member profiles (one file per person)
│   │   │   ├── index.ts              loader — auto-discovers all .json files
│   │   │   ├── pedram-massoud.json
│   │   │   ├── alice-chen.json
│   │   │   └── ...
│   │   ├── papers.json               publication list
│   │   ├── slides.json               talk / presentation list
│   │   ├── carousel.json             homepage carousel slides
│   │   ├── features.json             homepage feature blocks
│   │   ├── news.json                 latest news
│   │   ├── resources.json            external resource links
│   │   └── libraries.json            third-party library attributions
│   ├── router/index.ts               Vue Router config
│   ├── views/                        page components (one per route)
│   ├── layouts/DefaultLayout.vue     Navbar + RouterView + Footer
│   ├── utils/paths.ts                withBase() helper for sub-path deployment
│   ├── App.vue
│   └── main.ts
├── index.html
├── tailwind.config.js
├── vite.config.ts
├── package.json
└── README.md
```

---

## Updating content

All content is driven by JSON files under `src/data/`. Lab members can edit
these files directly — no Vue knowledge required.

### 1. `site.json` — site-wide settings

```json
{
  "name": "qPALACE",
  "shortName": "qPALACE",
  "tagline": "Physical and Logical Aware Compiler Engine for Single Flux Quantum Logic",
  "description": "Maps high-level designs (Verilog HDL or BLIF) to a placed-and-routed SFQ chip...",
  "acronym": "Physical and Logical Aware Compiler Engine for Single Flux Quantum Logic",
  "keywords": ["qPALACE", "SPORTLab", "USC", "SFQ"],
  "author": "SPORTLab, USC",
  "labName": "SPORTLab",
  "labUrl": "https://sportlab.usc.edu/",
  "institution": "University of Southern California",
  "department": "Ming Hsieh Department of Electrical and Computer Engineering",
  "school": "USC Viterbi School of Engineering",
  "githubUrl": "https://github.com/USC-qPALACE/qpalace",
  "lastUpdated": "2026-07-09",
  "navigation": [
    { "id": "home",      "label": "Home",       "to": "/" },
    { "id": "overview",  "label": "Overview",   "to": "/overview" },
    { "id": "papers",    "label": "Papers",     "to": "/papers" },
    { "id": "slides",    "label": "Slides",     "to": "/slides" },
    { "id": "team",      "label": "Team",       "to": "/team" },
    { "id": "resources", "label": "Resources",  "to": "/resources" },
    { "id": "libraries", "label": "Libraries",  "to": "/libraries-license" }
  ],
  "hero": {
    "eyebrow": "SPORTLab at USC",
    "title": "qPALACE",
    "subtitle": "…",
    "description": "…",
    "primaryCta":   { "label": "Contact us" },
    "secondaryCta": { "label": "Read the overview", "to": "/overview" }
  },
  "contact": {
    "intro": "qPALACE is distributed on request. For evaluation, collaboration, or press inquiries, please contact the project lead.",
    "personSlug": "pedram-massoud"
  },
  "funding": {
    "intro": "The development of qPALACE is supported by…",
    "disclaimer": "The views and conclusions contained herein are those of the authors…"
  },
  "home": { "showNews": true, "newsCount": 4 }
}
```

**Fields to update:**
- `name`, `tagline`, `description` — change the project name and description
- `navigation` — add/remove/reorder nav links
- `contact.personSlug` — selects the Contact/PI person from `src/data/people/`
- `hero.primaryCta` — label and optional route/link; email links are derived from the contact person
- `funding` — sponsorship acknowledgements
- `lastUpdated` — update when content changes

Person-related details such as PI name, contact email, phone, office, and faculty profile URL should live in `src/data/people/*.json`, not in `site.json`.

---

### 2. `people/` — team profiles

**One file per person** in `src/data/people/`. The loader (`index.ts`) uses
`import.meta.glob` to discover every `.json` file automatically — adding a new
person is as simple as creating a new file.

**File naming convention:** `firstname-lastname.json` (lowercase, kebab-case).

**Name format:** `Given Name + Family Name` (American standard), e.g.
`"Massoud Pedram"`, `"Alice Chen"`, `"Ziyu Liu"`.

```json
{
  "type": "pi | member",
  "slug": "pedram-massoud",
  "firstName": "Massoud",
  "lastName": "Pedram",
  "title": "Professor",
  "appointments": ["Research Productivity", "Ming Hsieh Department of Electrical and Computer Engineering"],
  "department": "Ming Hsieh Department of Electrical and Computer Engineering",
  "school": "USC Viterbi School of Engineering",
  "institution": "University of Southern California",
  "email": "pedram@ceng.usc.edu",
  "phone": "+1 (213) 740-4458",
  "profiles": {
    "googleScholar": "https://scholar.google.com/citations?user=...",
    "linkedin": "https://www.linkedin.com/in/...",
    "github": "https://github.com/...",
    "orcid": "https://orcid.org/...",
    "dblp": "https://dblp.org/pid/...",
    "semanticScholar": "https://www.semanticscholar.org/author/...",
    "researchGate": "https://www.researchgate.net/profile/...",
    "personalWebsite": "https://viterbi.usc.edu/directory/faculty/Pedram/Massoud",
    "arxiv": "https://arxiv.org/a/...",
    "twitter": "https://x.com/...",
    "mastodon": "https://..."
  },
  "office": {
    "room": "EEB 300B",
    "building": "Hughes Aircraft Electrical Engineering Center",
    "street": "3740 McClintock Ave.",
    "city": "Los Angeles, CA 90089",
    "mailCode": "USC Mail Code: 2562"
  },
  "avatar": "/images/people/massoud.jpg",
  "bio": "One-line bio…",
  "researchInterests": ["Electronic Design Automation (EDA)", "Superconducting / SFQ logic design"],
  "education": [
    { "degree": "Ph.D.", "field": "Electrical Engineering", "institution": "MIT", "year": 2000 },
    { "degree": "M.S.",  "field": "Electrical Engineering", "institution": "MIT", "year": 1998 },
    { "degree": "B.S.",  "field": "Electrical Engineering", "institution": "MIT", "year": 1996 }
  ],
  "awards": [
    { "title": "Best Paper Award", "year": 2024, "org": "ICCAD", "url": "https://…" }
  ],
  "news": [
    { "date": "2026-05-01", "title": "Talk at IEEE Quantum Week", "url": "https://…" }
  ],
  "additionalPapers": [
    {
      "title": "A paper not in the main qPALACE list",
      "authors": ["Massoud Pedram", "Other Author"],
      "venue": "Some Venue",
      "year": 2018,
      "type": "Conference",
      "status": "Published",
      "paperUrl": "https://…",
      "arxivUrl": "",
      "codeUrl": "",
      "projectUrl": "",
      "slidesUrl": "",
      "datasetUrl": "",
      "demoUrl": "",
      "abstract": "Short description…",
      "bibtex": "@inproceedings{…}",
      "highlightAuthors": ["Massoud Pedram"]
    }
  ],
  "highlightsAuthorInPapers": true,
  "featuredAuthorPosition": "last"
}
```

**Optional fields:** every field except `type`, `slug`, `firstName`, and `lastName` is optional.
Sections are auto-hidden when their data is empty or missing.

- `type` — `"pi"` (appears in the PI section) or `"member"` (appears in the
  Students & Researchers grid)
- `slug` — used in the URL: `/people/<slug>`. Must be unique.
- `profiles` — add any supported platform key. Unsupported keys are ignored.
  Supported: `googleScholar`, `linkedin`, `github`, `orcid`, `dblp`,
  `semanticScholar`, `researchGate`, `personalWebsite`, `arxiv`, `twitter`,
  `mastodon`.
- `additionalPapers` — papers from before this person joined the qPALACE
  project, or papers not in the main `papers.json` list. They display with a
  `Personal` badge.
- `highlightsAuthorInPapers` — if `true`, this person's name is bolded in
  citation rows
- `featuredAuthorPosition` — `"first"` (default) or `"last"` (PI convention).
  Controls which papers appear in the "Lead-Author" / "Senior-Author" section.

---

### 3. `papers.json` — publications

```json
[
  {
    "title": "Paper Title Here",
    "authors": ["Alice Chen", "Bob Martinez", "Massoud Pedram"],
    "venue": "Conference or Journal Name",
    "year": 2026,
    "type": "Conference",
    "status": "Published",
    "paperUrl": "/papers/example.pdf",
    "arxivUrl": "https://arxiv.org/abs/xxxx.xxxxx",
    "codeUrl": "https://github.com/USC-qPALACE/repo",
    "projectUrl": "",
    "slidesUrl": "/slides/example.pdf",
    "datasetUrl": "",
    "demoUrl": "",
    "abstract": "One-paragraph summary of the paper.",
    "bibtex": "@inproceedings{…}",
    "highlightAuthors": ["Alice Chen", "Bob Martinez"]
  }
]
```

**Fields:**
- `title`, `authors`, `venue` — required
- `year`, `type`, `status` — required for filtering and grouping
- `paperUrl` / `arxivUrl` / `codeUrl` / `projectUrl` / `slidesUrl` /
  `datasetUrl` / `demoUrl` — optional links. Empty strings hide the button.
- `abstract` — optional. Displayed on the person detail page in the
  featured-papers section.
- `bibtex` — optional. Renders an expandable block with one-click copy.
- `highlightAuthors` — optional. Names in this array appear bolded in the
  citation row.

**Name format:** `Given Name + Family Name`, e.g. `"Massoud Pedram"`,
`"Alice Chen"`, `"Ziyu Liu"`.

---

### 4. `slides.json` — talks & presentations

```json
[
  {
    "title": "qPALACE Project Introduction",
    "event": "Lab Meeting",
    "date": "2026-07-01",
    "speaker": "Alice Chen",
    "description": "An introductory overview of the qPALACE project.",
    "fileUrl": "/slides/qpalace-intro.pdf",
    "pptxUrl": "/slides/qpalace-intro.pptx",
    "type": "PDF",
    "visibility": "public",
    "notes": "Internal slides; please contact the speaker for access."
  }
]
```

**Fields:**
- `visibility` — `"public"` (shows View/Download buttons) or `"internal"`
  (shows only title + notes, no file links)
- `fileUrl` — PDF link (shown for public slides)
- `pptxUrl` — optional PPTX download link
- `type` — display label, e.g. `"PDF"`, `"PPTX"`
- `notes` — visible only for internal slides

---

### 5. `carousel.json` — homepage carousel

```json
[
  {
    "id": "synthesis",
    "title": "SFQ Logic Synthesis",
    "subtitle": "Compile high-level SFQ descriptions into gate-level netlists",
    "image": "/images/carousel/synthesis.svg",
    "alt": "Illustration of the qPALACE SFQ synthesis flow",
    "link": "/overview",
    "linkLabel": "Learn more"
  }
]
```

**Fields:**
- `id` — unique identifier, used for SVG filenames
- `image` — path to the image file under `public/images/carousel/`
- `link` — URL (internal or external) the slide CTA points to
- `linkLabel` — text for the CTA button

**Image specs:** see [Image specifications](#image-specifications) below.

---

### 6. `features.json` — homepage feature blocks

```json
[
  {
    "id": "synthesis",
    "title": "SFQ Logic Synthesis",
    "description": "Compile high-level descriptions of SFQ pipelines into optimized gate-level netlists…",
    "learnMoreUrl": "/overview#synthesis",
    "thumbnail": "/images/carousel/synthesis.svg"
  }
]
```

**Fields:**
- `id` — unique identifier
- `title` — feature heading
- `description` — one-paragraph explanation
- `learnMoreUrl` — optional link to a detail page or anchor
- `thumbnail` — optional image (1600×900 recommended)

---

### 7. `news.json` — latest news

```json
[
  {
    "date": "2026-07-01",
    "title": "qPALACE 2026.07 release — improved placement convergence",
    "url": "https://sportlab.usc.edu/"
  }
]
```

- `date` — ISO 8601 format (`YYYY-MM-DD`)
- `title` — news headline
- `url` — optional link to full announcement

---

### 8. `resources.json` — external links

```json
[
  {
    "title": "qPALACE on GitHub",
    "description": "Source code, releases, and ongoing development.",
    "url": "https://github.com/USC-qPALACE/qpalace",
    "type": "Code"
  }
]
```

**`type` values** control the icon shown:
- `Code` — code brackets icon
- `Docs` / `Documentation` — document icon
- `Dataset` — database cylinder icon
- `Website` — globe icon
- Anything else — link chain icon

---

### 9. `libraries.json` — license attributions

```json
[
  {
    "name": "Vue",
    "version": "3.4.x",
    "license": "MIT",
    "url": "https://github.com/vuejs/core",
    "author": "Evan You and contributors",
    "description": "Progressive JavaScript framework used for the site UI."
  }
]
```

Grouped by license type on the Libraries & Licenses page (`/libraries-license`).
The `license` field determines which group the entry falls under
(MIT, Apache-2.0, BSD-3-Clause, ISC, MPL-2.0, OFL-1.1, etc.).

---

## Image specifications

### Carousel images

| Property | Recommendation |
| --- | --- |
| **Format** | SVG or PNG preferred, **PDF also supported** (rendered inline via `<embed>`) |
| **Aspect ratio** | **16:9** (e.g. 1600×900, 800×450) |
| **viewBox** | `viewBox="0 0 800 450"` for SVGs |
| **Max file size** | ≤ 500 kB (SVG/PNG), ≤ 5 MB (PDF) |
| **Location** | `public/images/carousel/` |
| **Reference** | `carousel.json` → `image` field |

The carousel component uses `aspect-[16/9]` with `object-fit: contain`. Images
scale to fit the container without cropping. PDFs are rendered inline via
`<embed>`. Files with a different aspect ratio will be letterboxed.

### Team avatars

| Property | Recommendation |
| --- | --- |
| **Format** | JPG or WebP |
| **Resolution** | 400×400 px minimum (square) |
| **Max file size** | ≤ 200 kB |
| **Location** | `public/images/people/` |
| **Reference** | person JSON → `avatar` field |

If an avatar is missing or fails to load, the card shows a text placeholder
with the person's initials.

### Feature thumbnails

The same carousel images can be reused as feature section thumbnails.
Same specs apply.

---

## Deployment

The site is fully static. See the deployment section in the previous README
for GitHub Pages, Vercel, Netlify, and lab-server instructions.

**Key:** update `base` in `vite.config.ts` to match your deployment path:
- GitHub Pages project page: `base: '/qpalace/'`
- Root domain or Vercel: `base: '/'`

---

## Development

### Dev server

```bash
npm run dev
# → http://localhost:5173/
```

### Build

```bash
npm run build
# → dist/
```

### Add a new route

1. Create a view file in `src/views/`
2. Add a route entry to `src/router/index.ts`
3. Add a nav link to `src/data/site.json` → `navigation`

### Add a new person

1. Create `src/data/people/firstname-lastname.json` with the schema above
2. Drop their avatar into `public/images/people/`
3. The Team page and People route pick up the file automatically

### Add a new profile platform

The supported platforms are defined in `src/views/PersonView.vue` in the
`PROFILE_PLATFORMS` array. Add an entry with `{ key, label, viewBox, iconPath }`
to support a new platform.

---

## License

Code: MIT. Content (papers, slides, bios): © the respective authors / SPORTLab.
