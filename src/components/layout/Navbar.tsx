
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Utensils, User, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "../ui/Container";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppStore } from "@/store/appStore";
import { Button } from "../ui/button";

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAppStore();

  const menuItems = [
    { name: "Map", path: "/map", icon: MapPin },
    { name: "Shopping List", path: "/shopping", icon: ShoppingCart },
    { name: "Nutrition", path: "/nutrition", icon: Utensils },
  ];

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-3",
        isScrolled
          ? "glass shadow-sm border-b border-gray-200/10"
          : "bg-transparent"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center space-x-2"
            aria-label="Home"
          >
            <img 
              src="/lovable-uploads/0b3bf1b1-20e6-4b84-a220-f978cdf6b783.png" 
              alt="Recipe Book" 
              className="h-10 w-auto" 
            />
          </Link>

          {children}

          <div className="flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-100 text-gray-700"
                } transition-colors`}
                title={item.name}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            ))}
            <Button
              onClick={handleAuthNavigation}
              className={`flex items-center justify-center rounded-full w-10 h-10 ${
                isAuthenticated || location.pathname === '/auth' || location.pathname === '/profile'
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition-colors`}
              variant="ghost"
              size="icon"
              title={isAuthenticated ? "My Profile" : "Login / Register"}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
