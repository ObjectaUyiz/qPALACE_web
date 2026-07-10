# Carousel images

This folder holds the image assets referenced by the homepage carousel.

## Image specs

| Property | Recommendation |
| --- | --- |
| **Format** | SVG or PNG preferred, PDF also supported |
| **Aspect ratio** | **16:9** (e.g. 1600×900, 800×450) |
| **viewBox** | `viewBox="0 0 800 450"` for SVGs |
| **Max file size** | ≤ 500 kB (SVG/PNG), ≤ 5 MB (PDF) |
| **Reference** | `carousel.json` → `image` field |

The carousel component uses `aspect-[16/9]` with `object-fit: contain`. Images
scale to fit the container without cropping. PDFs are rendered inline via
`<embed>`. Files with a different aspect ratio will be letterboxed.

## File naming

No fixed naming convention — the `image` field in `carousel.json` points to the
file directly. Use descriptive filenames.

## Current files

| Slug (in `carousel.json`) | File | Format | Notes |
| --- | --- | --- | --- |
| `qPALACE-flow-rsfq` | `qPALACE_flow_RSFQ.svg` | SVG | Design flow for RSFQ logic |
| `qPALACE-flow-aqfp` | `qPALACE_flow_AQFP.svg` | SVG | Design flow for AQFP logic |
| `synthesis` | `synthesis.svg` | SVG | 800×450, custom |
| `placement-routing` | `qPALACE_flow_pnr.svg` | SVG | Visio export, 390×174 viewBox |
| `timing-analysis` | `timing.svg` | SVG | 800×450, custom |
| `cell-library` | `qPALACE_flow_cell.svg` | SVG | Visio export, 549×358 viewBox |
| `verification` | `verification.svg` | SVG | 800×450, custom |
| `GDS` | `KSA16GDS.pdf` | PDF | GDSII layout example |

## Adding a new slide

1. Add an entry to `src/data/carousel.json`
2. Save the image file to this folder (SVG, PNG, or PDF)
3. Reference it in the entry's `image` field

## Fallback behavior

If an image is missing or fails to load, the carousel slide shows a tinted
fallback block with the slide title and subtitle text.