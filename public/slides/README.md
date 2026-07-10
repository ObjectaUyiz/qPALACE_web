# Place slides here

Drop PDF/PPTX files (e.g. `qpalace-intro.pdf`) into this folder and reference
them from `src/data/slides.json`:

```json
{
  "fileUrl": "/slides/qpalace-intro.pdf",
  "pptxUrl": "/slides/qpalace-intro.pptx"
}
```

Files in this directory are served at `/slides/...` after the static build.

For internal/restricted slides, leave `fileUrl` empty and add a `notes` field
explaining how to request access.
