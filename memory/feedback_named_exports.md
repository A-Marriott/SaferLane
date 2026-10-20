---
name: Named exports and named declarations
description: Always use named declarations even when default export is required (Next.js pages/layouts)
type: feedback
---

Always name component declarations, even in Next.js page/layout files that require `export default`.

```ts
// pages/layouts — name the declaration, then export default
const RootLayout = ({ children }: { children: ReactNode }) => (...);
export default RootLayout;

// components — pure named export
export const HeroPicker = () => (...);
```

**Why:** CLAUDE.md convention is "use named exports". The spirit is that declarations always have a name for DevTools/stack traces. `export default () => (...)` violates this even though Next.js forces a default export.

**How to apply:** Never write anonymous default exports. Even when `export default` is required, declare the const with a name first.