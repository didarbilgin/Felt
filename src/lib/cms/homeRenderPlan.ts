import type { PageSection } from '@/lib/cms/types';

export const HOME_RENDERABLE_SECTION_KEYS = new Set([
  'hero',
  'manifesto',
  'hubs',
  'ecosystem',
  'highlights',
  'blog-preview',
  'network-cta',
]);

export type HomeRenderBlock =
  | { kind: 'hero' }
  | { kind: 'manifesto' }
  | { kind: 'hubs' }
  | { kind: 'ecosystem-signals' }
  | { kind: 'highlights' }
  | { kind: 'blog-preview' }
  | { kind: 'network-cta' };

export function getOrderedHomeSections(sections: PageSection[]): PageSection[] {
  return [...sections]
    .filter((s) => s.is_active && HOME_RENDERABLE_SECTION_KEYS.has(s.section_key))
    .sort((a, b) => a.sort_order - b.sort_order);
}

/** One CMS section → one public block, in sort_order. */
export function buildHomeRenderPlan(sections: PageSection[]): HomeRenderBlock[] {
  const blocks: HomeRenderBlock[] = [];

  for (const section of getOrderedHomeSections(sections)) {
    switch (section.section_key) {
      case 'hero':
        blocks.push({ kind: 'hero' });
        break;
      case 'manifesto':
        blocks.push({ kind: 'manifesto' });
        break;
      case 'hubs':
        blocks.push({ kind: 'hubs' });
        break;
      case 'ecosystem':
        blocks.push({ kind: 'ecosystem-signals' });
        break;
      case 'highlights':
        blocks.push({ kind: 'highlights' });
        break;
      case 'blog-preview':
        blocks.push({ kind: 'blog-preview' });
        break;
      case 'network-cta':
        blocks.push({ kind: 'network-cta' });
        break;
    }
  }

  return blocks;
}
