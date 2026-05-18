import { ContactMessage, ContactType, NewsletterSubscriber } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';

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
