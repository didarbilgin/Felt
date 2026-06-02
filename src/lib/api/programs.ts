import { CreateProgramData, Program, ProgramCategory } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';

const ADMIN_PROGRAMS_PATH = '/api/admin/programs';
const PUBLIC_PROGRAMS_PATH = '/api/programs';

type BackendProgram = {
  id: string;
  title: string;
  category: ProgramCategory | string;
  target_audience: string;
  description: string;
  detail_description?: string | null;
  link?: string | null;
  duration: string;
  status: Program['status'];
  created_at: string;
  updated_at: string;
};

type BackendProgramPayload = {
  title: string;
  category: ProgramCategory | string;
  target_audience: string;
  description: string;
  detail_description?: string | null;
  link?: string | null;
  duration: string;
  status: Program['status'];
};

const byNewest = (a: Program, b: Program) => b.createdAt.getTime() - a.createdAt.getTime();

const mapProgram = (item: BackendProgram): Program => ({
  id: item.id,
  title: item.title,
  category: item.category as Program['category'],
  targetAudience: item.target_audience,
  description: item.description,
  detailDescription: item.detail_description?.trim() || undefined,
  link: item.link?.trim() || undefined,
  duration: item.duration,
  status: item.status,
  createdAt: new Date(item.created_at),
  updatedAt: new Date(item.updated_at),
});

const mapToBackend = (data: CreateProgramData | Partial<CreateProgramData>): Partial<BackendProgramPayload> => ({
  ...(data.title !== undefined && { title: data.title }),
  ...(data.category !== undefined && { category: data.category }),
  ...(data.targetAudience !== undefined && { target_audience: data.targetAudience }),
  ...(data.description !== undefined && { description: data.description }),
  ...(data.detailDescription !== undefined && {
    detail_description: data.detailDescription || null,
  }),
  ...(data.link !== undefined && { link: data.link || null }),
  ...(data.duration !== undefined && { duration: data.duration }),
  ...(data.status !== undefined && { status: data.status }),
});

export const programsApi = {
  /** Public site — active programs only (no auth). */
  getPublished: async (): Promise<Program[]> => {
    const data = await apiRequest<BackendProgram[]>(PUBLIC_PROGRAMS_PATH, { method: 'GET' });
    return data.map(mapProgram).sort(byNewest);
  },

  getActive: async (): Promise<Program[]> => programsApi.getPublished(),

  getByCategory: async (category: ProgramCategory | string): Promise<Program[]> => {
    const all = await programsApi.getPublished();
    return all.filter((program) => program.category === category);
  },

  /** Admin — all programs (auth required). */
  getAll: async (): Promise<Program[]> => {
    const data = await apiRequest<BackendProgram[]>(ADMIN_PROGRAMS_PATH, { method: 'GET' });
    return data.map(mapProgram).sort(byNewest);
  },

  getById: async (id: string): Promise<Program | undefined> => {
    const item = await apiRequest<BackendProgram>(`${ADMIN_PROGRAMS_PATH}/${id}`, { method: 'GET' });
    return mapProgram(item);
  },

  create: async (data: CreateProgramData): Promise<Program> => {
    const created = await apiRequest<BackendProgram>(ADMIN_PROGRAMS_PATH, {
      method: 'POST',
      body: JSON.stringify(mapToBackend(data)),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return mapProgram(created);
  },

  update: async (id: string, data: Partial<CreateProgramData>): Promise<Program | undefined> => {
    const updated = await apiRequest<BackendProgram>(`${ADMIN_PROGRAMS_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToBackend(data)),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return mapProgram(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    await apiRequest<{ ok: boolean }>(`${ADMIN_PROGRAMS_PATH}/${id}`, { method: 'DELETE' });
    return true;
  },

  getFeatured: async (): Promise<Program | undefined> => {
    const active = await programsApi.getPublished();
    return active[0];
  },
};
