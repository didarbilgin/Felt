import { ContactMessage, ContactType, NewsletterSubscriber } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';

export type AdminContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
};

type AdminContactMessageDto = Omit<AdminContactMessage, 'createdAt'> & {
  created_at: string;
};

interface SubmitMessageRequest {
  name: string;
  email: string;
  type: ContactType;
  message: string;
}

export const contactApi = {
  submitMessage: async (data: SubmitMessageRequest): Promise<ContactMessage> => {
    const response = await apiRequest<ContactMessage>('/api/contact/messages', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return {
      ...response,
      createdAt: new Date(response.createdAt),
    };
  },

  listAdminMessages: async (): Promise<AdminContactMessage[]> => {
    const rows = await apiRequest<AdminContactMessageDto[]>('/api/admin/contact-messages');
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      createdAt: new Date(row.created_at),
    }));
  },

  subscribe: async (email: string): Promise<NewsletterSubscriber> => {
    const response = await apiRequest<NewsletterSubscriber>('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return {
      ...response,
      subscribedAt: new Date(response.subscribedAt),
    };
  },
};
