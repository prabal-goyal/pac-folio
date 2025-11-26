export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED', // Used when modal is open
  GAMEOVER = 'GAMEOVER', // Finished the maze
}

export enum TileType {
  EMPTY = 0,
  WALL = 1,
  DOT = 2,
  POWER_SKILL = 3,
  POWER_PROJECT = 4,
  POWER_EXP = 5,
  PORTAL = 9, // The exit/contact form
}

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  pos: Position;
  velocity: Position;
  radius: number;
  speed: number;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';
  nextDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';
}

export interface ContentItem {
  id: string;
  title: string;
  category: 'SKILL' | 'PROJECT' | 'EXPERIENCE' | 'ABOUT';
  description: string;
  tags?: string[];
  link?: string;
}

export interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  score: number;
  addScore: (points: number) => void;
  collectedItems: string[];
  markCollected: (id: string) => void;
  activeModal: ContentItem | null;
  setActiveModal: (item: ContentItem | null) => void;
  allItemsCollected: boolean;
}