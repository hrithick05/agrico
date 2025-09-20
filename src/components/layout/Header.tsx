import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Menu, 
  X, 
  Globe,
  ChevronDown,
  ShoppingCart
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

const languages = [
  { code: "en", name: "English" },
  { code: "ta", name: "தமிழ்" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const { getCartItemCount } = useCart();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navigation = [
    { name: t('nav.dashboard'), href: "/" },
    { name: t('nav.equipment'), href: "/equipment" },
    { name: t('nav.orders'), href: "/orders" },
    { name: t('nav.forum'), href: "/forum" },
    { name: t('nav.lending'), href: "/lending" },
    { name: t('nav.expenses'), href: "/expenses" },
    { name: t('nav.insights'), href: "/insights" },
    { name: t('nav.schemes'), href: "/schemes" },
    { name: t('nav.banking'), href: "/banking" },
    { name: t('nav.location'), href: "/location" },
  ];

  return (
    <header className="bg-card border-b border-border shadow-card sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-card group-hover:shadow-glow transition-all duration-300">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AgroConnect</h1>
              <p className="text-xs text-muted-foreground">Farmers United</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-card ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart Button & Language Selector & Auth & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Cart Button */}
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <ShoppingCart className="h-4 w-4 mr-1" />
                {t('header.cart')}
                {getCartItemCount() > 0 && (
                  <Badge className="ml-2 bg-orange-500 text-white text-xs">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Authentication */}
            <SignedOut>
              <div className="hidden sm:flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">
                    {t('header.signIn')}
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">
                    {t('header.signUp')}
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Globe className="h-4 w-4 mr-1" />
                  {languages.find(lang => lang.code === language)?.name}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as 'en' | 'ta')}
                    className={language === lang.code ? "bg-muted" : ""}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-bounce-in">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Authentication */}
            <div className="px-4 py-2 space-y-2">
              <SignedOut>
                <div className="flex flex-col space-y-2">
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm" className="w-full">
                      {t('header.signIn')}
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm" className="w-full">
                      {t('header.signUp')}
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-center">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>

            {/* Mobile Language Selector */}
            <div className="px-4 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    {languages.find(lang => lang.code === currentLanguage)?.name}
                    <ChevronDown className="h-3 w-3 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-popover border-border">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => setCurrentLanguage(language.code)}
                      className={currentLanguage === language.code ? "bg-muted" : ""}
                    >
                      {language.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}