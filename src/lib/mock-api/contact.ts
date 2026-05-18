import { ContactMessage, NewsletterSubscriber, ContactType } from '../types';
import { contactMessages, newsletterSubscribers, generateId } from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const contactApi = {
  // Contact Messages
  submitMessage: async (data: {
    name: string;
    email: string;
    type: ContactType;
    message: string;
  }): Promise<ContactMessage> => {
    await delay(300);
    const newMessage: ContactMessage = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
    };
    contactMessages.push(newMessage);
    return newMessage;
  },

  getAllMessages: async (): Promise<ContactMessage[]> => {
    await delay(100);
    return [...contactMessages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // Newsletter
  subscribe: async (email: string): Promise<NewsletterSubscriber> => {
    await delay(300);
    
    // Check if already subscribed
    const existing = newsletterSubscribers.find(s => s.email === email);
    if (existing) {
      throw new Error('Bu e-posta adresi zaten kayıtlı.');
    }

    const newSubscriber: NewsletterSubscriber = {
      id: generateId(),
      email,
      subscribedAt: new Date(),
    };
    newsletterSubscribers.push(newSubscriber);
    return newSubscriber;
  },

  unsubscribe: async (email: string): Promise<boolean> => {
    await delay(200);
    const index = newsletterSubscribers.findIndex(s => s.email === email);
    if (index === -1) return false;
    
    newsletterSubscribers.splice(index, 1);
    return true;
  },

  getAllSubscribers: async (): Promise<NewsletterSubscriber[]> => {
    await delay(100);
    return [...newsletterSubscribers];
  },
};
