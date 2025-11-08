# src/services

## Purpose

Reusable service modules that encapsulate business logic, orchestration between APIs and state, and cross-cutting concerns (e.g., authentication, billing helpers, caching strategies).

## Conventions

- Keep services independent of UI; they should be callable from hooks, contexts, or pages.
- Services can wrap multiple API calls and combine results into useful domain objects.

## Example

```
src/services/bookingService.ts
export const fetchAvailableRides = async (params) => { /* ... */ }
```
