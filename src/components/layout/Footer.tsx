import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pagesApi } from '@/lib/cms/pages';
import { getSection } from '@/lib/cms/pages';
import { SocialLinks } from '@/components/layout/SocialLinks';

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
    { label: 'İletişim', href: '/contact#contact-form' },
  ],
};

const DEFAULT_BRAND_TEXT =
  'Futures of Education, Leadership & Technology — Eğitimin, liderliğin ve teknolojinin geleceğini şekillendiren araştırma ve eğitim platformu.';
const DEFAULT_COPYRIGHT_TEXT = '© FELT. Tüm hakları saklıdır.';

export function Footer() {
  const [brandText, setBrandText] = useState<string | null>(null);
  const [copyrightText, setCopyrightText] = useState<string | null>(null);

  useEffect(() => {
    pagesApi
      .getPage('footer')
      .then((page) => {
        const brand = getSection(page?.sections, 'brand');
        const copyright = getSection(page?.sections, 'copyright');
        setBrandText(brand ? brand.content || DEFAULT_BRAND_TEXT : null);
        setCopyrightText(copyright ? copyright.content || DEFAULT_COPYRIGHT_TEXT : null);
      })
      .catch(() => {
        setBrandText(DEFAULT_BRAND_TEXT);
        setCopyrightText(DEFAULT_COPYRIGHT_TEXT);
      });
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-heading text-3xl font-bold">FELT</span>
            </Link>
            {brandText !== null && brandText ? (
              <p className="mt-3 text-sm text-primary-foreground/80 max-w-md">{brandText}</p>
            ) : null}
            <SocialLinks variant="footer" className="mt-6" />
          </div>

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

        <div
          className={`mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row gap-4 text-center sm:text-left ${
            copyrightText !== null ? 'justify-between items-center' : 'justify-end items-center'
          }`}
        >
          {copyrightText !== null && copyrightText ? (
            <p className="text-sm text-primary-foreground/60">{copyrightText}</p>
          ) : null}
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-sm text-primary-foreground/60">
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
