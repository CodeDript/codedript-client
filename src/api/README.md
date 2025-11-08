# src/api

## Purpose

This folder contains modules that define API requests and clients used across the app. Keep network-related code (fetch wrappers, axios instances, request/response transformers, and endpoint wrappers) here.

## Conventions

- Export functions that perform single-purpose requests (e.g. `getUser`, `createBooking`).
- Keep a single API client/config in `client.ts` (or similar) for base URL, timeouts and interceptors.
- Do not include UI code or side-effectful logic here (formatting should be minimal — return raw or parsed data).

## Example

```
// src/api/user.ts
export const getUser = async (id: string) => { /* ... */ }
```

## Tests & Types

- Add types alongside requests (or import from `src/types` if you centralize types).
- Keep unit tests for request mapping and error handling in a `__tests__` folder or next to files.
