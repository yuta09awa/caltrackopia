
# Fix Plan: Complete Native Navigation Migration for Navbar Sub-components

## Problem Summary

The error `Cannot read properties of null (reading 'useContext')` persists because the Navbar component renders two sub-components that still use React Router:

1. **`NavItem.tsx`** - Uses `useLocation()` hook (line 15) and `<Link>` component (line 19)
2. **`MobileMenu.tsx`** - Uses `<Link>` component (lines 2, 52)

These React Router dependencies conflict with Vite's module bundling in the sandbox environment, causing the router context to be unavailable.

## Solution

Convert both components to use native HTML navigation elements, following the pattern already established in the Navbar, Hero, Footer, and TractionMetrics components.

---

## Changes Required

### 1. Update `src/components/layout/NavItem.tsx`

**Current issues:**
- Uses `useLocation()` to determine active state
- Uses `<Link>` for navigation

**Changes:**
- Remove React Router imports (`Link`, `useLocation`)
- Replace `<Link>` with `<a>` tag using `href`
- Determine active state using `window.location.pathname` instead of `useLocation()`

### 2. Update `src/components/layout/MobileMenu.tsx`

**Current issues:**
- Uses `<Link>` component for menu item navigation

**Changes:**
- Remove `Link` import from `react-router-dom`
- Replace all `<Link>` components with `<a>` tags using `href`

---

## Technical Details

Using native `<a>` tags with `href` attributes causes full page reloads, which is acceptable for:
- Landing page navigation (users navigate away from the page anyway)
- Mobile menu navigation (menu closes, page changes)
- Maintaining stability in the Vite sandbox environment

The active state detection will use `window.location.pathname` at render time, which works correctly for initial page loads.

---

## Implementation Order

1. `NavItem.tsx` - Most critical (uses `useLocation` hook directly)
2. `MobileMenu.tsx` - Uses `<Link>` components
