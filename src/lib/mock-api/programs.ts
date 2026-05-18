import { Program, CreateProgramData, ProgramCategory } from '../types';
import { programs, generateId } from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const programsApi = {
  getAll: async (): Promise<Program[]> => {
    await delay(100);
    return [...programs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  getByCategory: async (category: ProgramCategory): Promise<Program[]> => {
    await delay(100);
    return programs.filter(p => p.category === category);
  },

  getActive: async (): Promise<Program[]> => {
    await delay(100);
    return programs.filter(p => p.status === 'active');
  },

  getById: async (id: string): Promise<Program | undefined> => {
    await delay(100);
    return programs.find(p => p.id === id);
  },

  create: async (data: CreateProgramData): Promise<Program> => {
    await delay(200);
    const newProgram: Program = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    programs.push(newProgram);
    return newProgram;
  },

  update: async (id: string, data: Partial<CreateProgramData>): Promise<Program | undefined> => {
    await delay(200);
    const index = programs.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    programs[index] = {
      ...programs[index],
      ...data,
      updatedAt: new Date(),
    };
    return programs[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = programs.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    programs.splice(index, 1);
    return true;
  },

  getFeatured: async (): Promise<Program | undefined> => {
    await delay(100);
    const active = programs.filter(p => p.status === 'active');
    return active[0];
  },
};
