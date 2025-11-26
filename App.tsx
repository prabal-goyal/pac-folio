import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import { GameState, GameContextType, ContentItem } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [collectedItems, setCollectedItems] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<ContentItem | null>(null);

  // We need at least 3 items to open the portal based on the map layout (1 Skill, 2 Exp, 2 Proj available)
  // Let's require 3 unique content pieces to be found.
  const allItemsCollected = collectedItems.length >= 3; 

  // When opening a modal, pause the game
  useEffect(() => {
    if (activeModal) {
      setGameState(GameState.PAUSED);
    } else if (gameState === GameState.PAUSED) {
      setGameState(GameState.PLAYING);
    }
  }, [activeModal]);

  const resetGame = () => {
    setScore(0);
    setCollectedItems([]);
    setActiveModal(null);
    setGameState(GameState.START);
  };

  const gameCtx: GameContextType = {
    gameState,
    setGameState,
    score,
    addScore: (points) => setScore(s => s + points),
    collectedItems,
    markCollected: (id) => setCollectedItems(prev => [...prev, id]),
    activeModal,
    setActiveModal,
    allItemsCollected,
    resetGame
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex flex-col relative">
      <div className="flex-1 w-full relative">
        <GameCanvas gameCtx={gameCtx} />
      </div>
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