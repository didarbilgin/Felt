import { useEffect, useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PageHero } from '@/components/cms/PageHero';
import { usePageContent } from '@/hooks/usePageContent';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { FELT_CONTACT_EMAIL } from '@/lib/socialLinks';
import { getSection } from '@/lib/cms/pages';
import { applicationsApi } from '@/lib/api/applications';
import { NewsletterSubscribeBlock } from '@/components/applications/NewsletterSubscribeBlock';
import { validateApplicationForm } from '@/components/applications/ApplicationFormFields';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';
import { ContactType, contactTypeLabels } from '@/lib/types';

export default function Contact() {
  const { heroTitle, heroSubtitle, sections } = usePageContent('contact', {
    title: 'İletişim',
    subtitle: 'Önerileriniz, görüşleriniz ve mesajlarınız için bize yazın',
  });
  const contactInfo = getSection(sections, 'contact-info');
  const contactForm = getSection(sections, 'contact-form');
  const sidebarNewsletter = getSection(sections, 'contact-sidebar-newsletter');
  const sidebarSocial = getSection(sections, 'contact-sidebar-social');
  const emailItem = contactInfo?.items?.find((i) => i.title === 'E-posta');
  const locationItem = contactInfo?.items?.find((i) => i.title === 'Konum');

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scrollToForm = () => {
      const el = document.getElementById('contact-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (window.location.hash === '#contact-form') {
      requestAnimationFrame(scrollToForm);
    }
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    title: '',
    type: '' as ContactType | '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.type || !formData.message) {
      toast({
        title: 'Hata',
        description: 'Lütfen zorunlu alanları doldurun.',
        variant: 'destructive',
      });
      return;
    }

    const validation = validateApplicationForm({
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      title: formData.title,
      message: formData.message,
    });
    if (validation) {
      toast({ title: 'Hata', description: validation, variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const typeLabel = contactTypeLabels[formData.type as ContactType];
      await applicationsApi.create({
        sourceType: 'contact',
        sourceTitle: `İletişim — ${typeLabel}`,
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim() || null,
        title: formData.title.trim() || null,
        message: `[${typeLabel}]\n\n${formData.message.trim()}`,
      });
      toast({
        title: 'Başarılı',
        description: 'Mesajınız alındı. Teşekkür ederiz.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        title: '',
        type: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: formatApiErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div
            className={`grid grid-cols-1 gap-8 ${
              contactForm ? 'lg:grid-cols-3' : 'lg:grid-cols-1 lg:max-w-md lg:ml-auto'
            }`}
          >
            {contactForm ? (
            <div className="lg:col-span-2 scroll-mt-24" id="contact-form">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>{contactForm?.title || 'Mesajınızı Paylaşın'}</CardTitle>
                  <CardDescription>
                    {contactForm?.subtitle ||
                      'Düşüncelerinizi, önerilerinizi veya sorularınızı bizimle paylaşabilirsiniz.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Adınız Soyadınız"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ornek@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+90 5xx xxx xx xx"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization">Kurum</Label>
                        <Input
                          id="organization"
                          value={formData.organization}
                          onChange={(e) =>
                            setFormData({ ...formData, organization: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Ünvan</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Konu *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as ContactType })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Konu seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(contactTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mesajınız *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Mesajınızı buraya yazın..."
                        rows={5}
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Gönderiliyor...' : 'Gönder'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            ) : null}

            {/* Sidebar */}
            {(contactInfo || sidebarNewsletter || sidebarSocial) ? (
            <div className="space-y-6">
              {contactInfo ? (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">İletişim Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">E-posta</p>
                        <a
                          href={`mailto:${emailItem?.content || FELT_CONTACT_EMAIL}`}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {emailItem?.content || FELT_CONTACT_EMAIL}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Adres</p>
                        <p className="text-sm text-muted-foreground">
                          {locationItem?.content || 'İstanbul, Türkiye'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {sidebarNewsletter ? (
              <Card className="border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    Bülten
                  </p>
                  <CardTitle className="text-lg">
                    {sidebarNewsletter?.title || 'Haftalık içgörüler'}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {sidebarNewsletter?.subtitle ||
                      'Araştırma notları ve yeni yayınlardan haberdar olun.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NewsletterSubscribeBlock sourceTitle="İletişim Bülteni" />
                </CardContent>
              </Card>
              ) : null}

              {sidebarSocial ? (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {sidebarSocial?.title || 'Sosyal Medya'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SocialLinks variant="card" />
                </CardContent>
              </Card>
              ) : null}
            </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
