import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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

export type ApplicationFormConfig = {
  sourceType: ApplicationSourceType;
  sourceId?: string | null;
  sourceTitle: string;
  title?: string;
  successMessage?: string;
  successToastTitle?: string;
  submitLabel?: string;
  messageLabel?: string;
};

type ApplicationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: ApplicationFormConfig | null;
};

export function ApplicationFormDialog({ open, onOpenChange, config }: ApplicationFormDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ApplicationFormValues>(emptyApplicationFormValues);

  useEffect(() => {
    if (!open) return;
    setStep('form');
    setForm(emptyApplicationFormValues);
  }, [open, config]);

  const handleClose = (next: boolean) => {
    if (!next) {
      setStep('form');
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
        title: config.successToastTitle || 'Başvurunuz alındı',
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

  const formTitle = config.title || 'Başvur';
  const submitLabel = config.submitLabel || 'Gönder';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>{formTitle}</DialogTitle>
            </DialogHeader>
            <ApplicationFormFields
              values={form}
              onChange={setForm}
              idPrefix={`${config.sourceType}-apply`}
              messageLabel={config.messageLabel}
            />
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={loading}
              >
                İptal
              </Button>
              <Button type="button" onClick={submitApplication} disabled={loading}>
                {loading ? 'Gönderiliyor...' : submitLabel}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Teşekkürler</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              {config.successMessage || 'Başvurunuz başarıyla kaydedildi.'}
            </p>
            <DialogFooter>
              <Button type="button" onClick={() => handleClose(false)}>
                Tamam
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
