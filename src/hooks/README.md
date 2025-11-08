# src/hooks

## Purpose

Custom React hooks that encapsulate reusable logic (data fetching, form handling, subscriptions, etc.).

## Conventions

- Name hooks with a `use` prefix (e.g., `useFetchBookings`).
- Keep hooks pure and avoid directly interacting with DOM; return state and helpers.
- Put hooks that are tightly coupled to a component in the component folder; keep widely used hooks here.

## Testing

Test hook logic with `@testing-library/react-hooks` or the React Testing Library by wrapping in a minimal component.
