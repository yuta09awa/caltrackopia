

# Fix: Clear Stale Vite Cache Causing useNavigate Crash

## Problem

The error "Cannot read properties of null (reading 'useContext')" at `Index.tsx:23` references `useNavigate`, but the current source code for `Index.tsx` does NOT contain `useNavigate` -- it was already removed in the previous refactor. The browser is running a **stale cached build** from before the fix.

Evidence:
- The chunk URLs in the error have old version hashes (`?v=890b0593`, `?v=f4672ef2`)
- No component in the Index page tree (`Navbar`, `GlobalSearch`, `Hero`, `Footer`, etc.) imports `useNavigate`
- The previous refactor already replaced all router hooks with `window.location` in the landing page tree

## Fix

Force a full Vite dependency cache bust by toggling the `optimizeDeps.force` flag in `vite.config.ts`:

| File | Change |
|------|--------|
| `vite.config.ts` | Change a comment or whitespace in `optimizeDeps` to force Vite to re-prebundle all dependencies, clearing the stale chunk cache |

This is a one-line change. After the rebuild, the Index page will load correctly since no router hooks exist in the landing page tree.

## Technical Details

- Vite's pre-bundler caches dependency chunks with version hashes. When source files change but the dependency graph appears unchanged, Vite may serve stale chunks.
- `optimizeDeps.force: true` is already set but may not have triggered a full rebuild after the last refactor.
- The fix adds a cache-busting comment change to force Vite to regenerate all chunks with the updated source code.

