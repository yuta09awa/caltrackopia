
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ name, path, icon: Icon, badge }) => {
  const isActive = window.location.pathname === path;

  return (
    <a
      href={path}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full relative transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50 text-muted-foreground hover:text-accent-foreground"
      )}
      title={name}
      aria-label={name}
    >
      <Icon className="w-4 h-4" />
      {badge && badge > 0 && (
        <span 
          className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
          aria-label={`${badge} items in ${name.toLowerCase()}`}
        >
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </a>
  );
};

export default NavItem;
