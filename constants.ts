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

// Content mapped to specific coordinates would be complex, 
// so we'll just queue them up. When a user hits a type, we pop from the list.
export const CONTENT_DATA: ContentItem[] = [
  {
    id: 'skill-tech',
    title: 'Core Technologies',
    category: 'SKILL',
    description: 'Proficient in modern web stacks including React, Next.js, TypeScript, and Node.js. Experienced with Tailwind CSS for styling and Framer Motion for animations.',
    tags: ['React', 'Next.js', 'TypeScript', 'Node.js']
  },
  {
    id: 'exp-senior',
    title: 'Senior Frontend Engineer',
    category: 'EXPERIENCE',
    description: 'Led a team of 5 developers in rebuilding a legacy e-commerce platform. Improved site performance by 40% and implemented a comprehensive design system.',
    tags: ['Leadership', 'Architecture', 'Performance']
  },
  {
    id: 'proj-saas',
    title: 'AI Analytics SaaS',
    category: 'PROJECT',
    description: 'A real-time dashboard visualizing complex datasets using Recharts and D3. Integrated with Gemini API for natural language data querying.',
    link: 'https://github.com/example/ai-saas'
  },
  {
    id: 'proj-game',
    title: 'Web3 Trading Card Game',
    category: 'PROJECT',
    description: 'Developed the frontend interface for a blockchain-based TCG. Handled wallet connections, smart contract interactions, and WebGL assets.',
  }
];