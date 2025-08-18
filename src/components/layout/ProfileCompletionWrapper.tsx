import React from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileCompletionBanner } from '@/components/profile/ProfileCompletionBanner';

interface ProfileCompletionWrapperProps {
  children: React.ReactNode;
}

export const ProfileCompletionWrapper: React.FC<ProfileCompletionWrapperProps> = ({ 
  children 
}) => {
  const location = useLocation();
  
  // Don't show on auth pages or profile page
  const hideOnPaths = ['/auth', '/profile', '/auth/reset-password', '/auth/forgot-password'];
  const shouldShowBanner = !hideOnPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {shouldShowBanner && <ProfileCompletionBanner />}
      {children}
    </>
  );
};