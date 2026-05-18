import { CreateProgramData, Program, ProgramCategory } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';

const PROGRAMS_PATH = '/api/admin/programs';

type BackendProgram = {
  id: string;
  title: string;
  category: ProgramCategory;
  target_audience: string;
  description: string;
  duration: string;
  status: Program['status'];
  created_at: string;
  updated_at: string;
};

type BackendProgramPayload = {
  title: string;
  category: ProgramCategory;
  target_audience: string;
  description: string;
  duration: string;
  status: Program['status'];
};

const byNewest = (a: Program, b: Program) => b.createdAt.getTime() - a.createdAt.getTime();

const mapProgram = (item: BackendProgram): Program => ({
  id: item.id,
  title: item.title,
  category: item.category,
  targetAudience: item.target_audience,
  description: item.description,
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
  ...(data.duration !== undefined && { duration: data.duration }),
  ...(data.status !== undefined && { status: data.status }),
});

export const programsApi = {
  getAll: async (): Promise<Program[]> => {
    const data = await apiRequest<BackendProgram[]>(PROGRAMS_PATH, { method: 'GET' });
    return data.map(mapProgram).sort(byNewest);
  },

  getByCategory: async (category: ProgramCategory): Promise<Program[]> => {
    const all = await programsApi.getAll();
    return all.filter((program) => program.category === category);
  },

  getActive: async (): Promise<Program[]> => {
    const all = await programsApi.getAll();
    return all.filter((program) => program.status === 'active');
  },

  getById: async (id: string): Promise<Program | undefined> => {
    const item = await apiRequest<BackendProgram>(`${PROGRAMS_PATH}/${id}`, { method: 'GET' });
    return mapProgram(item);
  },

  create: async (data: CreateProgramData): Promise<Program> => {
    const created = await apiRequest<BackendProgram>(PROGRAMS_PATH, {
      method: 'POST',
      body: JSON.stringify(mapToBackend(data)),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return mapProgram(created);
  },

  update: async (id: string, data: Partial<CreateProgramData>): Promise<Program | undefined> => {
    const updated = await apiRequest<BackendProgram>(`${PROGRAMS_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToBackend(data)),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return mapProgram(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    await apiRequest<{ ok: boolean }>(`${PROGRAMS_PATH}/${id}`, { method: 'DELETE' });
    return true;
  },

  getFeatured: async (): Promise<Program | undefined> => {
    const active = await programsApi.getActive();
    return active[0];
  },
};