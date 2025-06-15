
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Utensils, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppStore } from "@/store/appStore";
import NavItem from "./NavItem";
import NavButton from "./NavButton";

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
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, itemCount } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthNavigation = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-2 pb-3",
        isScrolled
          ? "glass shadow-sm border-b border-border/10"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto w-full px-2 sm:px-4">
        <nav className="flex items-center justify-between gap-4" role="navigation" aria-label="Main navigation">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <img 
              src="/lovable-uploads/0b3bf1b1-20e6-4b84-a220-f978cdf6b783.png" 
              alt="Recipe Book" 
              className="h-10 w-auto" 
            />
          </Link>

          {children}

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
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
