import { PageHero } from '@/components/cms/PageHero';
import { FELT_CONTACT_EMAIL } from '@/lib/socialLinks';

export default function Terms() {
  return (
    <div>
      <PageHero
        title="Kullanım Koşulları"
        subtitle="FELT web sitesini kullanırken geçerli olan temel kurallar"
      />

      <section className="section-padding">
        <div className="container-wide max-w-3xl space-y-8 text-muted-foreground leading-relaxed">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Genel</h2>
            <p>
              Bu site, FELT araştırma ve eğitim platformunun kamuya açık içeriklerini sunar. Siteyi
              kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
              Site kullanımı
            </h2>
            <p>
              Site içeriği bilgilendirme amaçlıdır. Formlar aracılığıyla ilettiğiniz bilgilerin
              doğru ve güncel olmasından siz sorumlusunuz. Siteyi yasa dışı, zararlı veya başkalarının
              haklarını ihlal edecek şekilde kullanamazsınız.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
              Fikri mülkiyet
            </h2>
            <p>
              Sitedeki metinler, görseller ve diğer materyaller FELT&apos;e aittir veya lisanslı
              olarak kullanılmaktadır. İzin alınmadan kopyalanamaz veya ticari amaçla
              kullanılamaz.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
              Sorumluluk sınırı
            </h2>
            <p>
              FELT, sitedeki bilgilerin eksiksiz veya hatasız olduğunu taahhüt etmez. Site
              erişiminde yaşanabilecek kesintilerden doğan dolaylı zararlardan sorumlu tutulamaz.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">İletişim</h2>
            <p>
              Sorularınız için{' '}
              <a href={`mailto:${FELT_CONTACT_EMAIL}`} className="text-primary hover:underline">
                {FELT_CONTACT_EMAIL}
              </a>{' '}
              adresine ulaşabilirsiniz.
            </p>
          </div>

          <p className="text-sm">Son güncelleme: Mayıs 2026</p>
        </div>
      </section>
    </div>
  );
}
