
import { useState } from "react";
import { MapPin, Utensils, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "../ui/Container";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/features/auth";
import { useCart } from "@/features/cart";
import NavItem from "./NavItem";
import NavButton from "./NavButton";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";
import { SPACING } from "@/constants/spacing";

interface MenuItem {
  name: string;
  path: string;
  icon: typeof MapPin;
}

const menuItems: MenuItem[] = [
  { name: "Map", path: "/map", icon: MapPin },
  { name: "Shopping List", path: "/shopping", icon: ShoppingCart },
  { name: "Nutrition", path: "/nutrition", icon: Utensils },
];

interface NavbarProps {
  children?: React.ReactNode;
  flat?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ children, flat = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  const handleAuthNavigation = () => {
    if (isAuthenticated) {
      window.location.href = "/profile";
    } else {
      window.location.href = "/auth";
    }
  };

  return (
    <>
      <header 
        className={cn(
          "top-0 left-0 right-0 z-50 border-b border-border",
          flat
            ? "relative bg-background shrink-0"
            : "fixed bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}
        style={{ paddingTop: SPACING.navbar.py, paddingBottom: SPACING.navbar.py }}
      >
        <Container size="full" className="px-4">
          <nav className="flex items-center justify-between gap-4" role="navigation" aria-label="Main navigation">
            <a
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              <img 
                src="/nutrimap-icon.png" 
                alt="NutriMap Logo"
                className={cn(
                  "h-10 w-auto object-contain max-w-[120px]",
                  isMobile ? "h-8 max-w-[100px]" : "h-10 max-w-[120px]"
                )}
              />
            </a>

            {children}

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="flex items-center space-x-4" role="group" aria-label="Navigation menu">
                {menuItems.map((item) => (
                  <NavItem
                    key={item.name}
                    name={item.name}
                    path={item.path}
                    icon={item.icon}
                    badge={item.path === "/shopping" ? itemCount : undefined}
                  />
                ))}
                <NavButton
                  isAuthenticated={isAuthenticated}
                  onClick={handleAuthNavigation}
                />
              </div>
            )}

            {/* Mobile Navigation */}
            {isMobile && (
              <HamburgerButton
                onClick={() => setIsMobileMenuOpen(true)}
                isScrolled={false}
              />
            )}
          </nav>
        </Container>
      </header>
        
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        menuItems={menuItems.map(item => ({
          ...item,
          badge: item.path === "/shopping" ? itemCount : undefined
        }))}
        isAuthenticated={isAuthenticated}
        onAuthClick={handleAuthNavigation}
        itemCount={itemCount}
      />
    </>
  );
};

export default Navbar;
