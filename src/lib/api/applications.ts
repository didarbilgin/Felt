import { apiRequest } from '@/lib/api/client';
import type {
  Application,
  ApplicationCreatePayload,
  ApplicationSourceType,
  ApplicationStatus,
} from '@/lib/types';

type ApplicationDto = {
  id: string;
  source_type: ApplicationSourceType;
  source_id: string | null;
  source_title: string | null;
  full_name: string;
  email: string;
  phone: string;
  organization: string | null;
  title: string | null;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
};

function mapApplication(dto: ApplicationDto): Application {
  return {
    id: dto.id,
    sourceType: dto.source_type,
    sourceId: dto.source_id,
    sourceTitle: dto.source_title,
    fullName: dto.full_name,
    email: dto.email,
    phone: dto.phone,
    organization: dto.organization,
    title: dto.title,
    message: dto.message,
    status: dto.status,
    createdAt: new Date(dto.created_at),
  };
}

function mapCreatePayload(payload: ApplicationCreatePayload) {
  return {
    source_type: payload.sourceType,
    source_id: payload.sourceId ?? null,
    source_title: payload.sourceTitle ?? null,
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    organization: payload.organization ?? null,
    title: payload.title ?? null,
    message: payload.message ?? null,
  };
}

export const applicationsApi = {
  create: async (payload: ApplicationCreatePayload): Promise<Application> => {
    const data = await apiRequest<ApplicationDto>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(mapCreatePayload(payload)),
    });
    return mapApplication(data);
  },

  listAdmin: async (params?: {
    sourceType?: ApplicationSourceType;
    sourceId?: string;
  }): Promise<Application[]> => {
    const search = new URLSearchParams();
    if (params?.sourceType) search.set('source_type', params.sourceType);
    if (params?.sourceId) search.set('source_id', params.sourceId);
    const qs = search.toString();
    const data = await apiRequest<ApplicationDto[]>(
      `/api/admin/applications${qs ? `?${qs}` : ''}`
    );
    return data.map(mapApplication);
  },

  updateStatus: async (id: string, status: ApplicationStatus): Promise<Application> => {
    const data = await apiRequest<ApplicationDto>(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return mapApplication(data);
  },
};
