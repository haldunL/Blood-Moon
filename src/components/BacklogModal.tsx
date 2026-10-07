/**
 * BacklogModal Component
 * Shows dialogue history for review
 */

import React from 'react';
import { X, BookOpen, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audioSynthesizer';

export interface BacklogEntry {
  speaker: string;
  text: string;
  chapter?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: BacklogEntry[];
}

export const BacklogModal: React.FC<Props> = ({ isOpen, onClose, entries }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl max-h-[85vh] bg-[#0d0408] border border-rose-900/50 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-rose-950/60 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2 text-rose-300 font-cinzel font-bold text-base">
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span>Diyalog Geçmişi</span>
          </div>
          <button
            onClick={() => {
              soundManager.playSfx('click');
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-rose-950/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {entries.length === 0 ? (
            <p className="text-center text-sm text-stone-500 italic py-8">Henüz okunmuş diyalog yok.</p>
          ) : (
            entries.map((entry, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-black/40 border border-stone-900 hover:border-rose-950/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-cinzel text-xs font-bold text-rose-400">
                    {entry.speaker}
                  </span>
                  <button
                    onClick={() => soundManager.playSfx('whisper')}
                    className="text-stone-600 hover:text-rose-400 transition-colors"
                    title="Ses yankısını dinle"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm font-serif-novel text-slate-200 leading-relaxed">
                  {entry.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
