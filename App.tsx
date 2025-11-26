import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import { GameState, GameContextType, ContentItem } from './types';
import { CONTENT_DATA } from './constants';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [collectedItems, setCollectedItems] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<ContentItem | null>(null);

  // Derive "allItemsCollected" from content data length vs collected length
  // Note: In a real game, constants might have more items than map nodes. 
  // For this logic, we assume victory when the map is cleared of special nodes. 
  // However, simpler logic: Have we triggered all main content?
  // Let's assume we need to collect at least 3 items to open portal
  const allItemsCollected = collectedItems.length >= 3; 

  // When opening a modal, pause the game
  useEffect(() => {
    if (activeModal) {
      setGameState(GameState.PAUSED);
    } else if (gameState === GameState.PAUSED) {
      setGameState(GameState.PLAYING);
    }
  }, [activeModal]);

  const gameCtx: GameContextType = {
    gameState,
    setGameState,
    score,
    addScore: (points) => setScore(s => s + points),
    collectedItems,
    markCollected: (id) => setCollectedItems(prev => [...prev, id]),
    activeModal,
    setActiveModal,
    allItemsCollected
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex flex-col relative">
      <GameCanvas gameCtx={gameCtx} />
      <UIOverlay gameCtx={gameCtx} />
      
      {/* Background Grid decorative effect for empty space */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
             backgroundSize: '32px 32px' 
           }}>
      </div>
    </div>
  );
}

export default App;