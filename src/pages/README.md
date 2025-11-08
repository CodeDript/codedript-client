# src/pages

## Purpose

Top-level route pages (screens) used by the router. Pages assemble components, contexts, and services to form full screens.

## Conventions

- Pages are usually tied to a route and live under this folder (e.g., `Home.tsx`, `BookingDetails.tsx`).
- Keep route-specific data fetching in the page or in a connected container.

## Example

```
src/pages/Home.tsx
src/pages/Bookings/Index.tsx
```
