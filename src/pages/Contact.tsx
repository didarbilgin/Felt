import { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { contactApi } from '@/lib/api/contact';
import { ContactType, contactTypeLabels } from '@/lib/types';

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '' as ContactType | '',
    message: '',
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.type || !formData.message) {
      toast({
        title: 'Hata',
        description: 'Lütfen tüm alanları doldurun.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await contactApi.submitMessage({
        name: formData.name,
        email: formData.email,
        type: formData.type as ContactType,
        message: formData.message,
      });
      toast({
        title: 'Başarılı',
        description: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
      });
      setFormData({ name: '', email: '', type: '', message: '' });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterLoading(true);
    try {
      await contactApi.subscribe(newsletterEmail);
      toast({
        title: 'Başarılı',
        description: 'Bültene başarıyla abone oldunuz.',
      });
      setNewsletterEmail('');
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Abonelik işlemi başarısız.',
        variant: 'destructive',
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">İletişim</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            Sorularınız, iş birliği teklifleriniz veya geri bildirimleriniz için bize ulaşın
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Bize Yazın</CardTitle>
                  <CardDescription>
                    Formu doldurun, en kısa sürede size dönüş yapacağız.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Adınız Soyadınız"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Konu</Label>
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
                      <Label htmlFor="message">Mesajınız</Label>
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">İletişim Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">E-posta</p>
                      <a href="mailto:info@felt.org" className="text-sm text-muted-foreground hover:text-primary">
                        info@felt.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Adres</p>
                      <p className="text-sm text-muted-foreground">
                        İstanbul, Türkiye
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="border-border bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Bülten</CardTitle>
                  <CardDescription>
                    Haftalık içgörüler ve güncellemeler için abone olun.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewsletter} className="space-y-3">
                    <Input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="E-posta adresiniz"
                    />
                    <Button type="submit" className="w-full" disabled={newsletterLoading}>
                      {newsletterLoading ? 'Kaydediliyor...' : 'Abone Ol'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Sosyal Medya</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Twitter"
                    >
                      𝕏
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="LinkedIn"
                    >
                      in
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="YouTube"
                    >
                      ▶
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
