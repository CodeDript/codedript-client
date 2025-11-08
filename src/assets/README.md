# src/assets

## Purpose

Static resources used by the app: images, fonts, icons, and other media. This folder is for files imported by components and bundled by the build system.

## Conventions

- Organize by type or feature (e.g., `images/`, `icons/`, `fonts/`).
- Prefer descriptive file names and keep optimized/production-ready assets here.
- If you need helper modules for asset handling (e.g., an index that exports many icons), place them in `src/assets/index.ts`.

## Notes

Avoid committing large raw media files when possible; prefer optimized and web-friendly formats. If large assets are required, consider hosting on a CDN or using Git LFS.
