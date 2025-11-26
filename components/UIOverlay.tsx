import React from 'react';
import { GameContextType, GameState } from '../types';
import { Play, RotateCcw, X, ExternalLink, Mail, Github, Linkedin } from 'lucide-react';

interface UIOverlayProps {
  gameCtx: GameContextType;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameCtx }) => {
  const {
    gameState,
    setGameState,
    score,
    activeModal,
    setActiveModal,
    resetGame
  } = gameCtx;

  if (gameState === GameState.START) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-center p-6 transition-colors duration-500">
        <h1 className="text-4xl md:text-6xl font-retro text-yellow-400 mb-8 animate-pulse text-shadow-glow">
          PAC-FOLIO
        </h1>
        <p className="text-gray-300 mb-8 max-w-md text-lg">
          Navigate the maze to unlock my skills, experience, and projects.
          <br /><br />
          <span className="text-blue-400 font-bold">WASD / Arrows</span> to move.
          <br />
          <span className="text-pink-400 font-bold">Collect Nodes</span> to reveal data.
        </p>
        <button
          onClick={() => setGameState(GameState.PLAYING)}
          className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105"
        >
          <div className="flex items-center gap-2 font-retro text-xl">
            <Play size={24} /> INSERT COIN
          </div>
        </button>
      </div>
    );
  }

  if (gameState === GameState.GAMEOVER) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 overflow-y-auto">
        <div className="max-w-2xl w-full bg-slate-900 border-2 border-cyan-500 rounded-lg p-8 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          <h2 className="text-3xl md:text-5xl font-retro text-cyan-400 mb-6 text-center">
            LEVEL CLEARED!
          </h2>
          <p className="text-gray-300 text-center mb-8">
            You've explored my entire portfolio. Let's build something amazing together.
          </p>

          <form className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="bg-slate-800 border border-slate-700 p-3 rounded text-white focus:border-cyan-500 outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-slate-800 border border-slate-700 p-3 rounded text-white focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <textarea
              rows={4}
              placeholder="Message"
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded text-white focus:border-cyan-500 outline-none transition-colors"
            ></textarea>
            <button
              type="button"
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition-colors"
            >
              SEND TRANSMISSION
            </button>
          </form>

          <div className="flex justify-center gap-6 mb-8">
            <a href="https://github.com/prabal-goyal" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github size={32} /></a>
            <a href="https://linkedin.com/in/prabal-goyal" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={32} /></a>
            <a href="mailto:prabal30goyal@gmail.com" className="text-gray-400 hover:text-white transition-colors"><Mail size={32} /></a>
          </div>

          <div className="text-center">
            <button
              onClick={resetGame}
              className="flex items-center justify-center gap-2 mx-auto text-yellow-400 hover:text-yellow-300 font-retro text-sm"
            >
              <RotateCcw size={16} /> RESTART GAME
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal for content
  if (gameState === GameState.PAUSED && activeModal) {
    const isSkill = activeModal.category === 'SKILL';
    const isProject = activeModal.category === 'PROJECT';

    let borderColor = 'border-white';
    if (isSkill) borderColor = 'border-pink-500';
    else if (isProject) borderColor = 'border-emerald-500';
    else borderColor = 'border-violet-500';

    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className={`relative w-full max-w-lg bg-slate-900 border-2 ${borderColor} rounded-lg shadow-2xl transform scale-100 transition-all`}>
          <button
            onClick={() => setActiveModal(null)}
            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10"
          >
            <X size={20} />
          </button>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold px-2 py-1 rounded ${isSkill ? 'bg-pink-900 text-pink-200' : isProject ? 'bg-emerald-900 text-emerald-200' : 'bg-violet-900 text-violet-200'}`}>
                {activeModal.category}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{activeModal.title}</h3>
            <p className="text-gray-300 leading-relaxed mb-4">{activeModal.description}</p>

            {activeModal.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeModal.tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-800 text-gray-400 border border-slate-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {activeModal.link && (
              <a
                href={activeModal.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                View Artifact <ExternalLink size={16} />
              </a>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-500 hover:text-white text-sm animate-pulse"
              >
                Press SPACE or Click X to Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HUD
  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-30">
      <div className="bg-slate-900/80 border border-slate-700 rounded p-2 backdrop-blur">
        <div className="text-xs text-gray-400 uppercase tracking-widest">Score</div>
        <div className="text-2xl font-retro text-yellow-400 leading-none mt-1">
          {score.toString().padStart(6, '0')}
        </div>
      </div>

      <div className="hidden md:block bg-slate-900/80 border border-slate-700 rounded p-2 backdrop-blur">
        <div className="text-xs text-gray-400 uppercase tracking-widest text-right">System</div>
        <div className="text-sm font-mono text-green-400 leading-none mt-1">
          ONLINE
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;