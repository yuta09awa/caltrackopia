
# Fix Plan: Multiple React Instances Context Error

## Problem Analysis

The error `Cannot read properties of null (reading 'useContext')` occurs when calling `useNavigate` in the Navbar component. This is a well-known "multiple React instances" issue in Vite's sandbox environment.

**Root Cause**: The lazy-loaded Index page imports Navbar, which uses `useNavigate()` hook. Due to Vite's module bundling, these components may receive different React instances, causing React Router's context to be null.

**Affected Components**:
1. `src/components/layout/Navbar.tsx` - Uses `useNavigate()` directly (line 34)
2. `src/components/home/Hero.tsx` - Uses `<Link>` component
3. `src/components/home/TractionMetrics.tsx` - Uses `<Link>` component
4. `src/components/layout/Footer.tsx` - Uses `<Link>` component

## Solution

Replace React Router hooks and components with native navigation in Index page components:

### 1. Update `src/components/layout/Navbar.tsx`

Replace `useNavigate()` with a callback prop pattern or `window.location.href`:

**Changes:**
- Remove `useNavigate` import
- Convert `navigate()` calls to `window.location.href` assignments
- Keep `Link` for logo (it's acceptable or also convert)

### 2. Update `src/components/home/Hero.tsx`

**Changes:**
- Replace `Link` component with `<a>` tags using `href` for internal navigation
- Change `/map` Link to anchor tag with `window.location.href` via onClick

### 3. Update `src/components/home/TractionMetrics.tsx`

**Changes:**
- Replace `Link` component with `<a>` tags
- Use `onClick` handlers with `window.location.href` for internal routes

### 4. Update `src/components/layout/Footer.tsx`

**Changes:**
- Replace `Link` components with `<a>` tags using `href`

## Technical Details

The workaround using `window.location.href` instead of React Router's hooks bypasses the context issue entirely. This causes a full page reload but is acceptable for:
- Landing page navigation (users typically navigate to other pages anyway)
- Maintaining stability in the Vite sandbox environment

## Implementation Order

1. Navbar.tsx (most critical - uses `useNavigate` directly)
2. Hero.tsx
3. TractionMetrics.tsx
4. Footer.tsx

## Alternative Considered

Adding more packages to `vite.config.ts` `optimizeDeps.include` has already been attempted and the error persists. The native navigation workaround is the proven solution per the project's architecture memory notes.
