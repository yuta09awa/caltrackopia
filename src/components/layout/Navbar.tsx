
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MapPin, Utensils, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "../ui/Container";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Map", path: "/map", icon: MapPin },
    { name: "Nutrition", path: "/nutrition", icon: Utensils },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4",
        isScrolled
          ? "glass shadow-sm border-b border-gray-200/10"
          : "bg-transparent"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-semibold flex items-center space-x-2"
          >
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Nutrackr
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-1 text-sm text-foreground/90 hover:text-primary transition-colors"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
            <Link
              to="/account"
              className="flex items-center justify-center rounded-full w-8 h-8 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass animate-fade-in border-b border-gray-200/10">
            <div className="flex flex-col space-y-4 px-6 py-5">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 text-base hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                to="/account"
                className="flex items-center space-x-2 text-base hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;
