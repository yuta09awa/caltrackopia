import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Utensils, ShoppingCart, User, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  name: string;
  path: string;
  icon: typeof MapPin;
  badge?: number;
}

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  menuItems: MenuItem[];
  isAuthenticated: boolean;
  onAuthClick: () => void;
  itemCount: number;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onOpenChange,
  menuItems,
  isAuthenticated,
  onAuthClick,
  itemCount,
}) => {
  const handleItemClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col space-y-4 mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleItemClick}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "min-h-[44px] relative"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-lg font-medium">{item.name}</span>
              {item.path === "/shopping" && itemCount > 0 && (
                <span 
                  className="ml-auto bg-primary text-primary-foreground text-sm rounded-full h-6 w-6 flex items-center justify-center"
                  aria-label={`${itemCount} items in ${item.name.toLowerCase()}`}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          ))}
          
          <div className="border-t border-border pt-4">
            <Button
              onClick={() => {
                onAuthClick();
                handleItemClick();
              }}
              className={cn(
                "flex items-center space-x-3 w-full justify-start p-3 rounded-lg min-h-[44px]",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              variant="ghost"
            >
              <User className="w-6 h-6" />
              <span className="text-lg font-medium">
                {isAuthenticated ? "My Profile" : "Login / Register"}
              </span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;