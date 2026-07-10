# Place papers here

Drop PDF files (e.g. `example.pdf`) into this folder and reference them from
`src/data/papers.json`:

```json
{ "paperUrl": "/papers/example.pdf" }
```

Files in this directory are served at `/papers/...` after the static build.

For large files, host externally (Google Drive, Zenodo, lab server) and paste
the URL into the JSON instead.
