import React, { useRef, useEffect, useCallback } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { GameContextType, GameState, TileType, Player, Position, Ghost } from '../types';
import { 
  MAZE_LAYOUT, 
  TILE_SIZE, 
  COLORS, 
  PLAYER_SPEED, 
  PLAYER_START_GRID,
  CONTENT_DATA,
  GHOST_CONFIG,
  GHOST_SPEED
} from '../constants';

interface GameCanvasProps {
  gameCtx: GameContextType;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameCtx }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game State Refs (Use refs for game loop performance to avoid re-renders)
  const playerRef = useRef<Player>({
    pos: { 
      x: TILE_SIZE * PLAYER_START_GRID.c + TILE_SIZE / 2, 
      y: TILE_SIZE * PLAYER_START_GRID.r + TILE_SIZE / 2 
    }, 
    velocity: { x: 0, y: 0 },
    radius: TILE_SIZE * 0.4,
    speed: PLAYER_SPEED,
    direction: 'NONE',
    nextDirection: 'NONE'
  });

  // Initialize Ghosts
  const ghostsRef = useRef<Ghost[]>(
    GHOST_CONFIG.map(cfg => ({
      id: cfg.id,
      color: cfg.color,
      speed: GHOST_SPEED,
      direction: 'RIGHT', // Initial direction
      pos: {
        x: TILE_SIZE * cfg.startGrid.c + TILE_SIZE / 2,
        y: TILE_SIZE * cfg.startGrid.r + TILE_SIZE / 2
      }
    }))
  );
  
  // Create a mutable copy of the maze for dot collection
  const mazeRef = useRef<number[][]>(JSON.parse(JSON.stringify(MAZE_LAYOUT)));
  const contentQueueRef = useRef([...CONTENT_DATA]);
  
  // Handle Reset when GameState changes to START
  useEffect(() => {
    if (gameCtx.gameState === GameState.START) {
      // 1. Reset Maze (restore dots)
      mazeRef.current = JSON.parse(JSON.stringify(MAZE_LAYOUT));
      // 2. Reset Content Queue
      contentQueueRef.current = [...CONTENT_DATA];
      // 3. Reset Player
      playerRef.current = {
        pos: { 
          x: TILE_SIZE * PLAYER_START_GRID.c + TILE_SIZE / 2, 
          y: TILE_SIZE * PLAYER_START_GRID.r + TILE_SIZE / 2 
        }, 
        velocity: { x: 0, y: 0 },
        radius: TILE_SIZE * 0.4,
        speed: PLAYER_SPEED,
        direction: 'NONE',
        nextDirection: 'NONE'
      };
      // 4. Reset Ghosts
      ghostsRef.current = GHOST_CONFIG.map(cfg => ({
        id: cfg.id,
        color: cfg.color,
        speed: GHOST_SPEED,
        direction: 'RIGHT',
        pos: {
          x: TILE_SIZE * cfg.startGrid.c + TILE_SIZE / 2,
          y: TILE_SIZE * cfg.startGrid.r + TILE_SIZE / 2
        }
      }));
      
      // Force a redraw
      if (canvasRef.current && containerRef.current) {
         // Ensure size is correct before drawing
         canvasRef.current.width = containerRef.current.clientWidth;
         canvasRef.current.height = containerRef.current.clientHeight;
         draw();
      }
    }
  }, [gameCtx.gameState]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameCtx.gameState === GameState.PAUSED) {
        if (e.code === 'Space' || e.key === 'Escape') {
          gameCtx.setActiveModal(null); // Resume
        }
        return;
      }
      if (gameCtx.gameState !== GameState.PLAYING) return;

      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          playerRef.current.nextDirection = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          playerRef.current.nextDirection = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          playerRef.current.nextDirection = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          playerRef.current.nextDirection = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameCtx.gameState]);

  // Helper: Check wall collision
  const isWall = (c: number, r: number) => {
    if (r < 0 || r >= mazeRef.current.length || c < 0 || c >= mazeRef.current[0].length) return true;
    const tile = mazeRef.current[r][c];
    if (tile === TileType.PORTAL) {
      // Portal acts as wall until unlocked
      return !gameCtx.allItemsCollected; 
    }
    return tile === TileType.WALL;
  };

  const getTileAt = (x: number, y: number) => {
    const c = Math.floor(x / TILE_SIZE);
    const r = Math.floor(y / TILE_SIZE);
    return { c, r };
  };

  const alignToCenter = (pos: number) => {
    return Math.floor(pos / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
  };

  const resetPositions = () => {
    // Reset Player
    playerRef.current.pos = {
      x: TILE_SIZE * PLAYER_START_GRID.c + TILE_SIZE / 2, 
      y: TILE_SIZE * PLAYER_START_GRID.r + TILE_SIZE / 2 
    };
    playerRef.current.direction = 'NONE';
    playerRef.current.nextDirection = 'NONE';

    // Reset Ghosts
    ghostsRef.current.forEach((ghost, idx) => {
      const cfg = GHOST_CONFIG[idx];
      ghost.pos = {
        x: TILE_SIZE * cfg.startGrid.c + TILE_SIZE / 2,
        y: TILE_SIZE * cfg.startGrid.r + TILE_SIZE / 2
      };
      ghost.direction = 'RIGHT'; // Or random
    });
  };

  const canMove = (direction: string, pos: Position, isGhost = false) => {
    const { c, r } = getTileAt(pos.x, pos.y);
    
    // Check strict center alignment for turns
    const centerX = c * TILE_SIZE + TILE_SIZE / 2;
    const centerY = r * TILE_SIZE + TILE_SIZE / 2;
    const tolerance = 4; 

    // If trying to turn perpendicular, we must be near center of tile
    const distX = Math.abs(pos.x - centerX);
    const distY = Math.abs(pos.y - centerY);

    if (distX > tolerance && (direction === 'UP' || direction === 'DOWN')) return false;
    if (distY > tolerance && (direction === 'LEFT' || direction === 'RIGHT')) return false;

    // Check target tile
    let nextC = c;
    let nextR = r;
    if (direction === 'LEFT') nextC--;
    if (direction === 'RIGHT') nextC++;
    if (direction === 'UP') nextR--;
    if (direction === 'DOWN') nextR++;

    // Ghosts treat Portal as Wall always
    if (isGhost) {
      if (mazeRef.current[nextR]?.[nextC] === TileType.PORTAL) return false;
    }

    return !isWall(nextC, nextR);
  };

  const update = useCallback((_dt: number) => {
    if (gameCtx.gameState !== GameState.PLAYING) return;

    // --- PLAYER UPDATE ---
    const p = playerRef.current;

    // 1. Try to switch to nextDirection
    if (p.nextDirection !== 'NONE' && p.nextDirection !== p.direction) {
      if (canMove(p.nextDirection, p.pos)) {
        p.direction = p.nextDirection;
        // Snap to grid axis to prevent drifting
        if (p.direction === 'UP' || p.direction === 'DOWN') p.pos.x = alignToCenter(p.pos.x);
        if (p.direction === 'LEFT' || p.direction === 'RIGHT') p.pos.y = alignToCenter(p.pos.y);
        p.nextDirection = 'NONE';
      }
    }

    // 2. Move Player
    let dx = 0;
    let dy = 0;
    if (p.direction === 'UP') dy = -p.speed;
    if (p.direction === 'DOWN') dy = p.speed;
    if (p.direction === 'LEFT') dx = -p.speed;
    if (p.direction === 'RIGHT') dx = p.speed;

    // 3. Wall Collision (Look ahead)
    const nextX = p.pos.x + dx;
    const nextY = p.pos.y + dy;
    
    // Check tile ahead edge
    const { c, r } = getTileAt(nextX + (dx ? Math.sign(dx) * p.radius : 0), nextY + (dy ? Math.sign(dy) * p.radius : 0));
    
    if (isWall(c, r)) {
      p.velocity = { x: 0, y: 0 };
      const currentTile = getTileAt(p.pos.x, p.pos.y);
      if (dx !== 0) p.pos.x = currentTile.c * TILE_SIZE + TILE_SIZE / 2;
      if (dy !== 0) p.pos.y = currentTile.r * TILE_SIZE + TILE_SIZE / 2;
    } else {
      p.pos.x += dx;
      p.pos.y += dy;
    }

    // 4. Wrap Around 
    const mapWidth = mazeRef.current[0].length * TILE_SIZE;
    if (p.pos.x < 0) p.pos.x = mapWidth;
    if (p.pos.x > mapWidth) p.pos.x = 0;


    // --- GHOST UPDATE ---
    ghostsRef.current.forEach(g => {
      // Check if ghost is at center of tile (approx) to make a decision
      const tileCenter = {
        x: Math.floor(g.pos.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2,
        y: Math.floor(g.pos.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2
      };
      
      const distToCenter = Math.hypot(g.pos.x - tileCenter.x, g.pos.y - tileCenter.y);

      if (distToCenter < g.speed) {
        // Snap to center to turn cleanly
        g.pos.x = tileCenter.x;
        g.pos.y = tileCenter.y;

        // Determine possible directions
        const directions: Array<'UP'|'DOWN'|'LEFT'|'RIGHT'> = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        const validDirs = directions.filter(d => canMove(d, g.pos, true));
        
        // Don't reverse unless stuck
        const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
        const nonReverseDirs = validDirs.filter(d => d !== opposite[g.direction]);
        
        if (nonReverseDirs.length > 0) {
          // 20% chance to turn if possible, otherwise keep going (unless hit wall)
          // Simple Patrol: Pick random valid direction
          g.direction = nonReverseDirs[Math.floor(Math.random() * nonReverseDirs.length)];
        } else if (validDirs.length > 0) {
           // Dead end, must reverse
           g.direction = validDirs[0];
        }
      }

      // Move Ghost
      let gx = 0, gy = 0;
      if (g.direction === 'UP') gy = -g.speed;
      if (g.direction === 'DOWN') gy = g.speed;
      if (g.direction === 'LEFT') gx = -g.speed;
      if (g.direction === 'RIGHT') gx = g.speed;
      
      g.pos.x += gx;
      g.pos.y += gy;

      // Ghost Collision with Player
      const distToPlayer = Math.hypot(p.pos.x - g.pos.x, p.pos.y - g.pos.y);
      if (distToPlayer < (p.radius + 12)) { // 12 approx ghost radius
         gameCtx.addScore(-500); // Penalty
         resetPositions();
         // Could trigger a brief "Ouch" state here
      }
    });


    // --- COLLECTIBLES ---
    const tilePos = getTileAt(p.pos.x, p.pos.y);
    const tileVal = mazeRef.current[tilePos.r]?.[tilePos.c];

    if (tileVal && tileVal !== TileType.WALL && tileVal !== TileType.EMPTY) {
      // Hit Portal
      if (tileVal === TileType.PORTAL && gameCtx.allItemsCollected) {
        gameCtx.setGameState(GameState.GAMEOVER);
        return;
      }

      // Collect Dot
      if (tileVal === TileType.DOT) {
        mazeRef.current[tilePos.r][tilePos.c] = TileType.EMPTY;
        gameCtx.addScore(10);
      }
      
      // Collect Special
      if ([TileType.POWER_SKILL, TileType.POWER_PROJECT, TileType.POWER_EXP].includes(tileVal)) {
        mazeRef.current[tilePos.r][tilePos.c] = TileType.EMPTY;
        gameCtx.addScore(100);
        
        let category = 'SKILL';
        if (tileVal === TileType.POWER_PROJECT) category = 'PROJECT';
        if (tileVal === TileType.POWER_EXP) category = 'EXPERIENCE';
        
        const itemIndex = contentQueueRef.current.findIndex(i => i.category === category);
        
        if (itemIndex >= 0) {
          const item = contentQueueRef.current[itemIndex];
          contentQueueRef.current.splice(itemIndex, 1);
          gameCtx.setActiveModal(item);
          gameCtx.markCollected(item.id);
        } else {
           // Fallback if we have more nodes on map than content
           gameCtx.setActiveModal({
             id: 'bonus',
             title: 'BONUS DATA',
             category: category as any,
             description: 'Encrypted data fragment found. Keep searching for the main artifacts.',
           });
        }
      }
    }

  }, [gameCtx]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save Translation
    ctx.save();
    const mapW = mazeRef.current[0].length * TILE_SIZE;
    const mapH = mazeRef.current.length * TILE_SIZE;
    const offsetX = (canvas.width - mapW) / 2;
    const offsetY = (canvas.height - mapH) / 2;
    ctx.translate(offsetX, offsetY);

    // Draw Maze
    mazeRef.current.forEach((row, r) => {
      row.forEach((tile, c) => {
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        if (tile === TileType.WALL) {
          ctx.strokeStyle = COLORS.WALL_BORDER;
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          ctx.shadowBlur = 10;
          ctx.shadowColor = COLORS.WALL_BORDER;
        } else if (tile === TileType.DOT) {
          ctx.fillStyle = COLORS.DOT;
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === TileType.POWER_SKILL) {
          ctx.fillStyle = COLORS.SKILL;
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 15;
          ctx.shadowColor = COLORS.SKILL;
        } else if (tile === TileType.POWER_PROJECT) {
          ctx.fillStyle = COLORS.PROJECT;
          ctx.beginPath();
          ctx.rect(x + 10, y + 10, TILE_SIZE - 20, TILE_SIZE - 20);
          ctx.fill();
          ctx.shadowBlur = 15;
          ctx.shadowColor = COLORS.PROJECT;
        } else if (tile === TileType.POWER_EXP) {
          ctx.fillStyle = COLORS.EXP;
          ctx.beginPath();
          ctx.moveTo(x + TILE_SIZE/2, y + 6);
          ctx.lineTo(x + TILE_SIZE - 6, y + TILE_SIZE - 6);
          ctx.lineTo(x + 6, y + TILE_SIZE - 6);
          ctx.fill();
          ctx.shadowBlur = 15;
          ctx.shadowColor = COLORS.EXP;
        } else if (tile === TileType.PORTAL) {
          ctx.strokeStyle = gameCtx.allItemsCollected ? COLORS.PORTAL : '#333';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 12, 0, Math.PI * 2);
          ctx.stroke();
          if(gameCtx.allItemsCollected) {
             ctx.fillStyle = COLORS.PORTAL;
             ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 200) * 0.2;
             ctx.fill();
             ctx.globalAlpha = 1;
          }
        }
        ctx.shadowBlur = 0; // Reset
      });
    });

    // Draw Player
    const p = playerRef.current;
    ctx.fillStyle = COLORS.PACMAN;
    ctx.beginPath();
    const mouthOpen = Math.abs(Math.sin(Date.now() / 100)) * 0.2 * Math.PI;
    let angle = 0;
    if (p.direction === 'DOWN') angle = Math.PI / 2;
    if (p.direction === 'LEFT') angle = Math.PI;
    if (p.direction === 'UP') angle = -Math.PI / 2;

    ctx.save();
    ctx.translate(p.pos.x, p.pos.y);
    ctx.rotate(angle);
    ctx.arc(0, 0, p.radius, mouthOpen, Math.PI * 2 - mouthOpen);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.restore();

    // Draw Ghosts
    ghostsRef.current.forEach(g => {
      ctx.fillStyle = g.color;
      ctx.beginPath();
      // Dome
      ctx.arc(g.pos.x, g.pos.y, 12, Math.PI, 0);
      // Feet
      ctx.lineTo(g.pos.x + 12, g.pos.y + 12);
      ctx.lineTo(g.pos.x - 12, g.pos.y + 12);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(g.pos.x - 4, g.pos.y - 4, 3, 0, Math.PI * 2);
      ctx.arc(g.pos.x + 4, g.pos.y - 4, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      // Pupils point to direction?
      let px = 0, py = 0;
      if (g.direction === 'UP') py = -1;
      if (g.direction === 'DOWN') py = 1;
      if (g.direction === 'LEFT') px = -1;
      if (g.direction === 'RIGHT') px = 1;
      
      ctx.arc(g.pos.x - 4 + px, g.pos.y - 4 + py, 1.5, 0, Math.PI * 2);
      ctx.arc(g.pos.x + 4 + px, g.pos.y - 4 + py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }, [gameCtx.allItemsCollected]); 

  useGameLoop((dt) => {
    update(dt);
    draw();
  }, gameCtx.gameState === GameState.PAUSED || gameCtx.gameState === GameState.START || gameCtx.gameState === GameState.GAMEOVER);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        draw();
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-gray-950">
      <canvas ref={canvasRef} className="block" />
      {/* Mobile Controls Overlay */}
      <div className="absolute bottom-8 right-8 md:hidden flex flex-col gap-2 z-20 opacity-50 hover:opacity-100 transition-opacity">
         <div className="flex justify-center">
             <button onTouchStart={() => playerRef.current.nextDirection = 'UP'} className="w-16 h-16 bg-slate-800 rounded-full border border-slate-600">▲</button>
         </div>
         <div className="flex gap-4">
            <button onTouchStart={() => playerRef.current.nextDirection = 'LEFT'} className="w-16 h-16 bg-slate-800 rounded-full border border-slate-600">◀</button>
            <button onTouchStart={() => playerRef.current.nextDirection = 'DOWN'} className="w-16 h-16 bg-slate-800 rounded-full border border-slate-600">▼</button>
            <button onTouchStart={() => playerRef.current.nextDirection = 'RIGHT'} className="w-16 h-16 bg-slate-800 rounded-full border border-slate-600">▶</button>
         </div>
      </div>
    </div>
  );
};

export default GameCanvas;