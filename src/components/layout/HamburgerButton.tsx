import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface HamburgerButtonProps {
  onClick: () => void;
  isScrolled: boolean;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick, isScrolled }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
        "hover:bg-accent hover:text-accent-foreground"
      )}
      aria-label="Open navigation menu"
    >
      <Menu className="w-6 h-6" />
    </Button>
  );
};

export default HamburgerButton;