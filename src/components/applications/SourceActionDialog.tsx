import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';
import { applicationsApi } from '@/lib/api/applications';
import type { ApplicationCreatePayload, ApplicationSourceType } from '@/lib/types';
import {
  ApplicationFormFields,
  emptyApplicationFormValues,
  validateApplicationForm,
  type ApplicationFormValues,
} from './ApplicationFormFields';

export type SourceDetailMeta = {
  label: string;
  value: string;
};

export type SourceActionConfig = {
  sourceType: ApplicationSourceType;
  sourceId?: string | null;
  sourceTitle: string;
  detailTitle: string;
  detailDescription?: string;
  detailMeta?: SourceDetailMeta[];
  canApply?: boolean;
  applyLabel?: string;
  successMessage?: string;
};

type SourceActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SourceActionConfig | null;
  /** Open directly on the application form step */
  initialStep?: 'detail' | 'apply';
};

export function SourceActionDialog({
  open,
  onOpenChange,
  config,
  initialStep = 'detail',
}: SourceActionDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'detail' | 'apply' | 'success'>('detail');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ApplicationFormValues>(emptyApplicationFormValues);

  useEffect(() => {
    if (!open) return;
    setStep(initialStep === 'apply' && config?.canApply !== false ? 'apply' : 'detail');
    setForm(emptyApplicationFormValues);
  }, [open, config, initialStep]);

  const handleClose = (next: boolean) => {
    if (!next) {
      setStep('detail');
      setForm(emptyApplicationFormValues);
    }
    onOpenChange(next);
  };

  const submitApplication = async () => {
    if (!config) return;
    const error = validateApplicationForm(form);
    if (error) {
      toast({ title: 'Eksik bilgi', description: error, variant: 'destructive' });
      return;
    }

    const payload: ApplicationCreatePayload = {
      sourceType: config.sourceType,
      sourceId: config.sourceId ?? null,
      sourceTitle: config.sourceTitle,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      organization: form.organization.trim() || null,
      title: form.title.trim() || null,
      message: form.message.trim() || null,
    };

    setLoading(true);
    try {
      await applicationsApi.create(payload);
      setStep('success');
      toast({
        title: 'Başvurunuz alındı',
        description: config.successMessage || 'En kısa sürede sizinle iletişime geçeceğiz.',
      });
    } catch (e) {
      toast({
        title: 'Gönderilemedi',
        description: formatApiErrorMessage(e),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!config) return null;

  const applyLabel = config.applyLabel || 'Başvur';
  const canApply = config.canApply !== false;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {step === 'detail' ? (
          <>
            <DialogHeader>
              <DialogTitle>{config.detailTitle}</DialogTitle>
              {config.detailDescription ? (
                <DialogDescription className="text-left pt-2 text-base text-muted-foreground">
                  {config.detailDescription}
                </DialogDescription>
              ) : null}
            </DialogHeader>
            {config.detailMeta && config.detailMeta.length > 0 ? (
              <div className="flex flex-wrap gap-2 py-2">
                {config.detailMeta.map((item) => (
                  <Badge key={`${item.label}-${item.value}`} variant="secondary">
                    {item.label}: {item.value}
                  </Badge>
                ))}
              </div>
            ) : null}
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Kapat
              </Button>
              {canApply ? (
                <Button type="button" onClick={() => setStep('apply')}>
                  {applyLabel}
                </Button>
              ) : null}
            </DialogFooter>
          </>
        ) : null}

        {step === 'apply' ? (
          <>
            <DialogHeader>
              <DialogTitle>{applyLabel}</DialogTitle>
              <DialogDescription>
                {config.sourceTitle} — bilgileriniz kayıt altına alınacaktır.
              </DialogDescription>
            </DialogHeader>
            <ApplicationFormFields
              values={form}
              onChange={setForm}
              idPrefix={`${config.sourceType}-apply`}
            />
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('detail')}
                disabled={loading}
              >
                Geri
              </Button>
              <Button type="button" onClick={submitApplication} disabled={loading}>
                {loading ? 'Gönderiliyor...' : 'Gönder'}
              </Button>
            </DialogFooter>
          </>
        ) : null}

        {step === 'success' ? (
          <>
            <DialogHeader>
              <DialogTitle>Teşekkürler</DialogTitle>
              <DialogDescription>
                {config.successMessage || 'Başvurunuz başarıyla kaydedildi.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={() => handleClose(false)}>
                Tamam
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
