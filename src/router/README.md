# src/router

## Purpose

Routing configuration and route-level wrappers (e.g., auth guards) for the application. This folder wires pages to routes and defines route metadata.

## Conventions

- Keep a central `routes.tsx` or `AppRouter.tsx` that mounts route components.
- Put route-specific guards or lazy-loading helpers here.

## Example

```
src/router/AppRouter.tsx
src/router/routes.ts
```
