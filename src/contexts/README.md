# src/contexts

## Purpose

React Context providers and related utilities that hold app-wide or feature-wide state (auth, theme, language, etc.).

## Conventions

- Keep provider implementations and hooks together (e.g., `AuthContext.tsx` and `useAuth.ts`).
- Keep contexts small and focused; prefer composition of multiple providers rather than one large global provider.

## Example

```
src/contexts/AuthProvider.tsx
src/contexts/index.ts
```
