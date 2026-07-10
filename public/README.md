# Public assets

This directory contains static files served at the site root.

Recommended structure:

```
public/
  papers/         <-- PDF papers, e.g. /papers/example.pdf
  slides/         <-- PDF/PPTX slides, e.g. /slides/talk.pdf
  images/         <-- static images
    people/       <-- team member avatars, e.g. /images/people/alice.jpg
  favicon.svg
  favicon.ico     <-- optional fallback
```

## Adding new files

1. Drop the file into the appropriate subfolder.
2. Reference it from a JSON data file:

```json
{
  "paperUrl": "/papers/example.pdf",
  "slidesUrl": "/slides/example.pdf"
}
```

## Large files

Avoid committing large binaries directly to the repo. Instead:

- Upload to Google Drive, Zenodo, OSF, or a lab server
- Use GitHub Releases for tagged assets
- Store the public link in the JSON data file

## Why is `.nojekyll` here?

The empty `.nojekyll` file at the repo root tells GitHub Pages to skip Jekyll
processing. This keeps Vite's hashed asset paths working.
