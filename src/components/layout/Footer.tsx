import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Hakkında', href: '/about' },
    { label: 'Araştırma', href: '/research' },
    { label: 'Programlar', href: '/programs' },
    { label: 'FELT Lab', href: '/lab' },
  ],
  community: [
    { label: 'Etkinlikler', href: '/events' },
    { label: 'Topluluk', href: '/community' },
    { label: 'Blog', href: '/blog' },
    { label: 'İletişim', href: '/contact' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Mail, href: 'mailto:info@felt.org', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-heading text-3xl font-bold">FELT</span>
            </Link>
            <p className="mt-3 text-sm text-primary-foreground/80 max-w-md">
              Futures of Education, Leadership & Technology — Eğitimin, liderliğin ve teknolojinin 
              geleceğini şekillendiren araştırma ve eğitim platformu.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold mb-4">Topluluk</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} FELT. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/60">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">
              Gizlilik Politikası
            </Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
