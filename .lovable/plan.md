

# Comprehensive Refactor: React Stability, Map Hooks, Navigation, and Types

## 1. Fix Duplicate React Instance Errors (Root Cause)

The `useContext`/`useEffect` null errors stem from `NavButton.tsx` importing `useLocation` from `react-router-dom`. This is the ONLY remaining component in the Navbar tree that uses a React Router hook -- all others (NavItem, MobileMenu, Navbar, Hero, Footer) already use `window.location`. When the Vite pre-bundler creates separate chunks, `NavButton` pulls in a second React instance through the router dependency.

**Fix:** Replace `useLocation()` in `NavButton.tsx` with `window.location.pathname`, matching the pattern already used everywhere else in the navbar tree.

| File | Change |
|------|--------|
| `src/components/layout/NavButton.tsx` | Replace `useLocation()` with `window.location.pathname` |

---

## 2. Delete Legacy/Deprecated Map Hooks

Three hooks are marked "LEGACY - Will be removed" and three more are "DEPRECATED". After checking usage:

- `useSimpleMapState` -- no active consumers (migration completed per CHANGELOG)
- `useLocationSelection` -- no active consumers
- `useMapRendering` -- no active consumers
- `useMapState` -- still imported by `MapContainer`, `SimplifiedMapContainer`, `MapView`, `MapScreenMap`, `MapScreenContent`, and `MapScreen/types`. Only used for the `MapState` and `LatLng` type re-exports, not the hook itself.

**Plan:**

| File | Action |
|------|--------|
| `src/features/map/hooks/useSimpleMapState.ts` | Delete |
| `src/features/map/hooks/useLocationSelection.ts` | Delete |
| `src/features/map/hooks/useMapRendering.ts` | Delete |
| `src/features/map/hooks/useMapState.tsx` | Keep but strip to type-only re-exports (remove the hook function and test markers). Eventually consumers should import from `../types` directly. |
| `src/features/map/hooks/index.ts` | Remove exports for deleted hooks. Remove "DEPRECATED" and "LEGACY" sections. |

---

## 3. Consolidate Deprecated Search Hooks

`usePlaceSearch`, `useTextSearch`, and `useNearbySearch` are marked deprecated but are still in the active call chain: `usePlacesApi` -> `usePlaceSearch` -> `useTextSearch` + `useNearbySearch`. They should be inlined into `usePlacesApi` to eliminate the indirection.

| File | Action |
|------|--------|
| `src/features/map/hooks/usePlacesApi.ts` | Inline logic from `usePlaceSearch` (which just combines `useTextSearch` + `useNearbySearch` + `useIngredientSearch`) |
| `src/features/map/hooks/usePlaceSearch.ts` | Delete after inlining |
| `src/features/map/hooks/useTextSearch.ts` | Keep as internal utility (still has significant logic) but remove from public exports |
| `src/features/map/hooks/useNearbySearch.ts` | Keep as internal utility but remove from public exports |
| `src/features/map/hooks/index.ts` | Remove deprecated exports |

---

## 4. Type System Cleanup

`MapState` from `useMapState.tsx` duplicates `UnifiedMapState` from `types/unified.ts`. Multiple files import `MapState` and `LatLng` from the hook file instead of the types directory.

| File | Change |
|------|--------|
| `src/features/map/types/index.ts` | Ensure `MapState` is exported as an alias for backward compat |
| `src/features/map/hooks/useMapState.tsx` | Reduce to type re-exports only (no hook, no test markers) |
| `src/screens/MapScreen/types/index.ts` | Update import to `@/features/map/types` |
| `src/features/map/components/MapContainer.tsx` | Update import to `@/features/map/types` |
| `src/features/map/components/SimplifiedMapContainer.tsx` | Update import to `@/features/map/types` |
| `src/features/map/components/MapView.tsx` | Update import to `@/features/map/types` |
| `src/screens/MapScreen/components/MapScreenMap.tsx` | Update import to `@/features/map/types` |
| `src/screens/MapScreen/components/MapScreenContent.tsx` | Update import to `@/features/map/types` |

---

## 5. Summary

```text
Files deleted:     3  (useSimpleMapState, useLocationSelection, useMapRendering)
Files modified:   ~12  (NavButton, usePlacesApi, useMapState, hooks/index, 
                        types/index, + 6 import updates)
Files removed from
  public exports:  5  (usePlaceSearch, useTextSearch, useNearbySearch, 
                        useSimpleMapState, useLocationSelection)
```

**Priority order:**
1. NavButton fix (immediately resolves the crash)
2. Delete legacy hooks (dead code removal)
3. Consolidate search hooks (reduce indirection)
4. Type import cleanup (consistency)

