

# Fix: Stale Cache Error + Map Whitespace Cleanup

## Issue 1: "Cannot read properties of null (reading 'useContext')"

This is the recurring Vite stale dependency cache problem. The pre-bundled chunks have diverged (two different React copies). The fix is toggling `force` in `vite.config.ts` to bust the cache.

**Change:** In `vite.config.ts`, toggle `optimizeDeps.force` from `true` to `false` (or vice versa) to force Vite to re-bundle all dependencies into a single consistent set of chunks.

## Issue 2: Map whitespace and navbar visual consistency

The map page has extra whitespace because:
- The `Container` component wrapping navbar content may add horizontal padding or a max-width constraint
- The map content area itself may not stretch fully edge-to-edge

**Changes:**

### `src/screens/MapScreen/layouts/MobileLayout.tsx` and `DesktopLayout.tsx`
- Ensure the outer `div` uses `h-dvh` (dynamic viewport height) instead of `h-screen` for better mobile behavior and to eliminate any gap from browser chrome
- Confirm `overflow-hidden` on the outer container prevents any body scroll bleed

### `src/components/layout/Navbar.tsx`
- No visual changes needed -- the flat navbar already uses solid `bg-background` and `relative` positioning, which matches the visual style of other pages (same border, same padding, same logo/nav items). The only difference is it sits in document flow instead of floating. This is working as intended.

## Summary of file changes

| File | Change |
|------|--------|
| `vite.config.ts` | Toggle `force` to bust stale dep cache |
| `MobileLayout.tsx` | Use `h-dvh` instead of `h-screen` |
| `DesktopLayout.tsx` | Use `h-dvh` instead of `h-screen` |

