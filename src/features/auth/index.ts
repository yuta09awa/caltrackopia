// API module
export * from './api';

// Components
export { default as AuthInitializer } from './components/AuthInitializer';
export { default as LoginForm } from './components/LoginForm';
export { default as RegisterForm } from './components/RegisterForm';
export { RequireRole } from './components/RequireRole';
export { default as UserTypeSelection } from './components/UserTypeSelection';

// Hooks
export { useUserRoles } from './hooks/useUserRoles';

// Store hooks (Phase 2)
export { 
  useAuth,
  useUser,
  useAuthStatus,
  useUserRole
} from './store/useAuth';

export { AuthService } from './services/authService';
export { createAuthSlice } from './store/authSlice';
export type { AuthSlice } from './store/authSlice';
