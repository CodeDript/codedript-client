# src/components

## Purpose

Houses the reusable UI components for the application. Components should be small, focused, and composable.

## Conventions

- Use a folder-per-component pattern for complex components (e.g., `Button/` with `index.tsx`, `styles.module.css`, and tests).
- Keep presentational components (pure) separated from container components (that handle data fetching/state) when practical.
- Name files with PascalCase for components: `MyButton.tsx` or index exports from a component folder.

## Exports

Create barrel files (`src/components/index.ts`) to centralize commonly used component exports.

## Example

```
src/components/Button/index.tsx
src/components/Button/styles.module.css
src/components/Button/index.ts
```
