import Container from "../ui/Container";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto py-12 bg-secondary/30">
      <Container className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              NutriMap
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto md:mx-0">
              Connecting every eater with every food source. Your food choices, powered by information.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="#"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/map"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Map
                </a>
              </li>
              <li>
                <a
                  href="/nutrition"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Nutrition
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Restaurants
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Brands
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#market-opportunity"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Investors
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Get the App</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block w-full text-center py-2 px-4 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                App Store
              </a>
              <a
                href="#"
                className="block w-full text-center py-2 px-4 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                Google Play
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-muted/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NutriMap. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
