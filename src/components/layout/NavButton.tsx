
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface NavButtonProps {
  isAuthenticated: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ isAuthenticated, onClick }) => {
  const location = useLocation();
  const isActive = isAuthenticated || location.pathname === '/auth' || location.pathname === '/profile';

  return (
    <Button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full w-8 h-8 transition-colors",
        isActive
          ? "bg-accent text-accent-foreground hover:bg-accent/80"
          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
      variant="ghost"
      size="icon"
      title={isAuthenticated ? "My Profile" : "Login / Register"}
      aria-label={isAuthenticated ? "Go to profile" : "Login or register"}
    >
      <User className="w-4 h-4" />
    </Button>
  );
};

export default NavButton;
