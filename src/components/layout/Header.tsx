import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Hakkında', href: '/about' },
  { label: 'Araştırma & Yayınlar', href: '/research' },
  { label: 'Programlar', href: '/programs' },
  { label: 'FELT Lab', href: '/lab' },
  { label: 'Etkinlikler', href: '/events' },
  { label: 'Topluluk', href: '/community' },
  { label: 'Blog', href: '/blog' },
  { label: 'İletişim', href: '/contact#contact-form' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-primary">FELT</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  location.pathname === item.href
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const path = item.href.split('#')[0];
                const isActive =
                  location.pathname === path ||
                  (path !== '/' && location.pathname.startsWith(path));
                return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    isActive
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                  )}
                >
                  {item.label}
                </Link>
              );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
