import { TileType, ContentItem } from './types';

export const TILE_SIZE = 32; // Pixels per grid cell
export const PLAYER_SPEED = 3;
export const PLAYER_START_GRID = { c: 10, r: 7 }; // Center of the map

export const GHOST_SPEED = 2; // Slightly slower than player
export const GHOST_CONFIG = [
  { id: 1, color: '#ef4444', startGrid: { c: 1, r: 1 } },   // Red - Top Left
  { id: 2, color: '#06b6d4', startGrid: { c: 19, r: 1 } },  // Cyan - Top Right
  { id: 3, color: '#f472b6', startGrid: { c: 1, r: 13 } },  // Pink - Bottom Left
  { id: 4, color: '#f97316', startGrid: { c: 19, r: 13 } }  // Orange - Bottom Right
];

// A 21x15 Grid. 
// 1 = Wall, 0 = Empty (Path), 2 = Dot
// 3 = Skill Node, 4 = Project Node, 5 = Experience Node
// 9 = Portal (Locked until all special nodes collected)
export const MAZE_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 5, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 9, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 0, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 1], // Center start
  [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1],
  [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
  [1, 4, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const COLORS = {
  WALL: '#1e293b', // Slate 800
  WALL_BORDER: '#3b82f6', // Blue 500
  DOT: '#fbbf24', // Amber 400
  PACMAN: '#facc15', // Yellow 400
  SKILL: '#ec4899', // Pink 500
  PROJECT: '#10b981', // Emerald 500
  EXP: '#8b5cf6', // Violet 500
  PORTAL: '#06b6d4', // Cyan 500
};

// Resume Content mapped to game nodes
export const CONTENT_DATA: ContentItem[] = [
  {
    id: 'skill-core',
    title: 'TECH ARSENAL (Skills)',
    category: 'SKILL',
    description: 'Equipped with the latest frontend weaponry: React.js, Next.js, and TypeScript. Rendering optimized via TanStack Table & Virtualization. UI styled with Tailwind CSS & Shadcn UI.',
    tags: ['Next.js', 'React', 'TypeScript', 'TanStack', 'Framer Motion']
  },
  {
    id: 'exp-voxturr-sde',
    title: 'MISSION: SDE @ VOXTURR',
    category: 'EXPERIENCE',
    description: 'Architected a reusable state-driven form system adopted across 5 workflows, cutting build time by 25%. Reduced large dataset render times from 3s to <300ms. Centralized RBAC for zero post-deployment access bugs.',
    tags: ['Performance', 'Architecture', 'React Context', 'RBAC']
  },
  {
    id: 'exp-voxturr-intern',
    title: 'MISSION: INTERN @ VOXTURR',
    category: 'EXPERIENCE',
    description: 'Integrated Django REST APIs for dynamic pagination. Fortified forms with Google reCAPTCHA v3 & Zod, reducing spam by 35%. Optimized render bottlenecks using React DevTools profiling.',
    tags: ['API Integration', 'Security', 'Optimization']
  },
  {
    id: 'proj-movie',
    title: 'PROJECT: MOVIE DISCOVERY',
    category: 'PROJECT',
    description: 'A semantic search engine delivering sub-second results via Cosine Similarity. Features an automated data ingestion pipeline with 99%+ reliability and smooth Framer Motion interactions.',
    link: 'https://github.com/prabal-goyal/movie-discovery'
  }
];