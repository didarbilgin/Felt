import { PageHero } from '@/components/cms/PageHero';
import { FELT_CONTACT_EMAIL } from '@/lib/socialLinks';

export default function Privacy() {
  return (
    <div>
      <PageHero
        title="Gizlilik Politikası"
        subtitle="Kişisel verilerinizin nasıl işlendiğine dair özet bilgiler"
      />

      <section className="section-padding">
        <div className="container-wide max-w-3xl space-y-8 text-muted-foreground leading-relaxed">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
              Veri sorumlusu
            </h2>
            <p>
              FELT (Futures of Education, Leadership &amp; Technology) web sitesi üzerinden toplanan
              kişisel veriler, site yönetimi tarafından 6698 sayılı Kişisel Verilerin Korunması
              Kanunu kapsamında işlenir.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
              Toplanan veriler
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Program, etkinlik, bülten ve iletişim formları aracılığıyla paylaştığınız ad,
                e-posta, telefon ve mesaj bilgileri
              </li>
              <li>Site kullanımına ilişkin ziyaret istatistikleri (kişisel kimlik içermez)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
              Kullanım amacı
            </h2>
            <p>
              Verileriniz; başvurularınızı değerlendirmek, taleplerinize yanıt vermek, bülten
              gönderimlerini yürütmek ve site performansını ölçmek amacıyla kullanılır.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Haklarınız</h2>
            <p>
              KVKK kapsamında verilerinize erişme, düzeltme, silme ve işlemeye itiraz etme
              haklarına sahipsiniz. Talepleriniz için{' '}
              <a href={`mailto:${FELT_CONTACT_EMAIL}`} className="text-primary hover:underline">
                {FELT_CONTACT_EMAIL}
              </a>{' '}
              adresine yazabilirsiniz.
            </p>
          </div>

          <p className="text-sm">Son güncelleme: Mayıs 2026</p>
        </div>
      </section>
    </div>
  );
}
