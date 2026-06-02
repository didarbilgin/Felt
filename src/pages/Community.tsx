import { useState } from 'react';
import { Users, BookOpen, Lightbulb, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/cms/PageHero';
import { usePageContent } from '@/hooks/usePageContent';
import {
  SourceActionDialog,
  type SourceActionConfig,
} from '@/components/applications/SourceActionDialog';
import { getItemBenefits, getSection } from '@/lib/cms/pages';

const defaultGroups = [
  {
    icon: BookOpen,
    title: 'Gelecek Okuryazarlığı Çemberi',
    description: 'Gelecek okuryazarlığı üzerine okuma ve tartışma grubu',
  },
  {
    icon: Lightbulb,
    title: 'Liderlik ve Değerler Merkezi',
    description: 'Eğitim liderliği ve değerler eğitimi çalışma grubu',
  },
  {
    icon: MessageCircle,
    title: 'Teknoloji ve Etik Forumu',
    description: 'Eğitim teknolojileri ve etik tartışmalar platformu',
  },
];

const groupIcons = [BookOpen, Lightbulb, MessageCircle];

export default function Community() {
  const { heroTitle, heroSubtitle, sections } = usePageContent('community', {
    title: 'FELT Topluluğu',
    subtitle: 'Eğitimin geleceğini birlikte şekillendiren küresel bir araştırma ve düşünce ağı',
  });

  const contributorTypes = getSection(sections, 'contributor-types');
  const researchCircles = getSection(sections, 'research-circles');
  const cta = getSection(sections, 'cta');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<SourceActionConfig | null>(null);
  const [dialogStep, setDialogStep] = useState<'detail' | 'apply'>('apply');

  const membershipTypes =
    contributorTypes?.items?.map((item) => ({
      title: item.title || '',
      description: item.content || '',
      benefits: getItemBenefits(item),
    })) || [];

  const communityGroups =
    researchCircles?.items?.map((item, index) => ({
      icon: groupIcons[index] || BookOpen,
      title: item.title || '',
      description: item.content || '',
    })) || defaultGroups;

  const openCommunity = (
    title: string,
    description: string,
    step: 'detail' | 'apply' = 'apply'
  ) => {
    setDialogConfig({
      sourceType: 'community',
      sourceTitle: title,
      detailTitle: title,
      detailDescription: description,
      applyLabel: 'Katıl',
      successMessage: 'Topluluk başvurunuz alındı.',
    });
    setDialogStep(step);
    setDialogOpen(true);
  };

  return (
    <div>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="section-padding">
        <div className="container-wide">
          {membershipTypes.length > 0 && (
            <>
              <div className="max-w-3xl mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  {contributorTypes?.title || 'Katılım Alanları'}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {contributorTypes?.subtitle || 'Farklı rollerle topluluğa katılın'}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {membershipTypes.map((type) => (
                  <Card key={type.title} className="border-border card-hover flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => openCommunity(type.title, type.description, 'apply')}
                      >
                        Katıl
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {researchCircles && (
        <section className="section-padding bg-muted/30 border-y border-border">
          <div className="container-wide">
            <div className="max-w-3xl mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                {researchCircles.title || 'Araştırma Çevreleri'}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {researchCircles.subtitle || 'İlgi alanlarınıza göre çalışma gruplarına katılın'}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {communityGroups.map((group) => (
                <Card key={group.title} className="border-border card-hover text-center flex flex-col">
                  <CardHeader>
                    <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <group.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{group.title}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openCommunity(group.title, group.description, 'detail')}
                    >
                      Detay
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="ml-2"
                      onClick={() => openCommunity(group.title, group.description, 'apply')}
                    >
                      Katıl
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {cta ? (
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container-wide text-center">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="font-heading text-3xl font-bold">
              {cta.title || 'FELT Topluluğuna Katıl'}
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              {cta.subtitle || 'Etkinliklere katılın ve araştırma çevrelerine dahil olun.'}
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-6"
              onClick={() =>
                openCommunity(
                  cta.title || 'FELT Topluluğu',
                  cta.subtitle || '',
                  'apply'
                )
              }
            >
              Topluluğa Katıl
            </Button>
          </div>
        </section>
      ) : null}

      <SourceActionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        config={dialogConfig}
        initialStep={dialogStep}
      />
    </div>
  );
}
