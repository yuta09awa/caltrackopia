

# Flatten Map Page Layout with Conditional Navbar Positioning

## Overview

Add a `flat` prop to the Navbar so the map page renders it in normal document flow (no overlap), while all other pages keep the current fixed/floating behavior.

## Changes

### 1. `src/components/layout/Navbar.tsx`
- Add optional `flat?: boolean` prop
- When `flat` is true: use `relative` position, solid `bg-background`, no `backdrop-blur`
- When `flat` is false (default): keep current `fixed` + translucent styling (unchanged behavior for landing page, etc.)

### 2. `src/screens/MapScreen/components/MapScreenHeader.tsx`
- Pass `flat` prop to `<Navbar flat>`

### 3. `src/screens/MapScreen/layouts/MobileLayout.tsx`
- Remove the `style={{ position: 'fixed', top: navHeight... }}` from `<main>`
- Use `flex-1 overflow-hidden` so content fills remaining space naturally
- Remove `navHeight` from props usage

### 4. `src/screens/MapScreen/layouts/DesktopLayout.tsx`
- Same as MobileLayout: remove fixed positioning from `<main>`, use `flex-1`

### 5. `src/screens/MapScreen/hooks/useMapScreen.ts`
- Remove the `navHeight` state and the entire `ResizeObserver` / `useLayoutEffect` block
- Remove `navHeight` from the return object

### 6. `src/screens/MapScreen/types/index.ts`
- Remove `navHeight` from `MapScreenLayoutProps`

### 7. `src/screens/MapScreen/MapScreen.tsx`
- Remove `navHeight` from `layoutProps`

## Resulting Layout

```text
Landing page (unchanged):          Map page (flat):
+---------------------------+      +---------------------------+
| Navbar (fixed, floating)  |      | Navbar (in normal flow)   |
+--  overlaps content  -----+      +---------------------------+
|                           |      | Map + List (flex-1)       |
| Hero scrolls under navbar |      | No overlap, no JS sizing  |
|                           |      |                           |
+---------------------------+      +---------------------------+
```

## What This Achieves
- Zero overlap on the map page -- navbar and map content stack naturally
- Removes the ResizeObserver and navHeight state entirely from the map screen
- No changes to landing page or other pages -- they keep the fixed floating navbar
- Map list view and map panning/scrolling work as before within their flex container

