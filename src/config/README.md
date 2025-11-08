# src/config

## Purpose

Configuration values, feature flags, and client-side constants used across the app. This can include environment-aware settings and small helper utilities for reading config values.

## Conventions

- Keep secrets out of this repo; use environment variables (e.g., `.env`) and ensure `.env` is ignored.
- Structure per environment if needed (`development.ts`, `production.ts`) or export a single runtime-config getter.

## Example

```
export const API_BASE = process.env.VITE_API_BASE || 'http://localhost:3000'
```
