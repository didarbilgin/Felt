import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type ApplicationFormValues = {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  title: string;
  message: string;
};

export const emptyApplicationFormValues: ApplicationFormValues = {
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  title: '',
  message: '',
};

type ApplicationFormFieldsProps = {
  values: ApplicationFormValues;
  onChange: (values: ApplicationFormValues) => void;
  showMessage?: boolean;
  messageLabel?: string;
  idPrefix?: string;
};

export function ApplicationFormFields({
  values,
  onChange,
  showMessage = true,
  messageLabel = 'Mesaj / Not',
  idPrefix = 'app',
}: ApplicationFormFieldsProps) {
  const set = (field: keyof ApplicationFormValues, value: string) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <div className="grid gap-4 min-w-0">
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-fullName`}>Ad Soyad *</Label>
        <Input
          id={`${idPrefix}-fullName`}
          value={values.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          required
          autoComplete="name"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-email`}>E-posta *</Label>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-phone`}>Telefon *</Label>
          <Input
            id={`${idPrefix}-phone`}
            type="tel"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            required
            autoComplete="tel"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-organization`}>Kurum</Label>
          <Input
            id={`${idPrefix}-organization`}
            value={values.organization}
            onChange={(e) => set('organization', e.target.value)}
            autoComplete="organization"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-title`}>Ünvan</Label>
          <Input
            id={`${idPrefix}-title`}
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            autoComplete="organization-title"
          />
        </div>
      </div>
      {showMessage ? (
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-message`}>{messageLabel}</Label>
          <Textarea
            id={`${idPrefix}-message`}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            rows={4}
          />
        </div>
      ) : null}
    </div>
  );
}

export function validateApplicationForm(values: ApplicationFormValues): string | null {
  if (!values.fullName.trim()) return 'Ad Soyad zorunludur.';
  if (!values.email.trim()) return 'E-posta zorunludur.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    return 'Geçerli bir e-posta adresi girin.';
  }
  if (!values.phone.trim()) return 'Telefon zorunludur.';
  if (values.phone.trim().length < 7) return 'Telefon numarası çok kısa.';
  return null;
}
