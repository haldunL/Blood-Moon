/**
 * GalleryModal Component
 * Shows unlocked CG Event illustrations with full-screen inspect mode
 */

import React, { useState } from 'react';
import { CgGalleryItem } from '../types/novel';
import { soundManager } from '../utils/audioSynthesizer';
import { X, Lock, Sparkles, Eye } from 'lucide-react';
import { AtmosphericBackground } from './AtmosphericBackground';
import { AnimeCharacterSprite } from './AnimeCharacterSprite';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  galleryItems: CgGalleryItem[];
}

export const GalleryModal: React.FC<Props> = ({ isOpen, onClose, galleryItems }) => {
  const [selectedItem, setSelectedItem] = useState<CgGalleryItem | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in select-none">
      {/* Full Screen CG Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/70 text-white hover:bg-rose-950 transition-colors border border-rose-500/40"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Render Full CG Scene */}
          <div className="relative w-full max-w-4xl h-[70vh] rounded-2xl overflow-hidden border border-rose-900/60 shadow-[0_0_50px_rgba(225,29,72,0.4)]">
            <AtmosphericBackground backgroundId={selectedItem.thumbnailBackground} />
            <AnimeCharacterSprite
              character={selectedItem.character}
              expression={
                selectedItem.character === 'morrigan' ||
                selectedItem.character === 'lenore' ||
                selectedItem.character === 'beatrice' ||
                selectedItem.character === 'vivienne'
                  ? 'seductive'
                  : 'blushing'
              }
              position="center"
              isSpeaking={true}
            />

            {/* Captions Overlay at Bottom */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-30">
              <h3 className="font-cinzel text-lg md:text-xl font-bold text-rose-300">
                {selectedItem.title}
              </h3>
              <p className="text-sm font-serif-novel text-slate-200 mt-1">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Gallery Grid */}
      <div className="w-full max-w-3xl bg-[#0c0307] border border-rose-900/60 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-rose-950/60 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2 text-rose-300 font-cinzel font-bold text-base">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>CG & Sahne Galerisi</span>
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

        {/* CG Thumbnails Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.unlocked) {
                  soundManager.playSfx('sensual_chime');
                  setSelectedItem(item);
                }
              }}
              className={`relative rounded-xl border overflow-hidden aspect-video transition-all duration-300 flex flex-col justify-end p-4 ${
                item.unlocked
                  ? 'border-rose-900/60 hover:border-rose-500 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] cursor-pointer'
                  : 'border-stone-900 bg-stone-950 cursor-not-allowed opacity-60'
              }`}
            >
              {item.unlocked ? (
                <>
                  <div className="absolute inset-0">
                    <AtmosphericBackground backgroundId={item.thumbnailBackground} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
                  <div className="relative z-30">
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-xs font-bold text-rose-300">
                        {item.title}
                      </span>
                      <Eye className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <p className="text-[11px] font-serif-novel text-stone-300 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-600 gap-2">
                  <Lock className="w-6 h-6 text-stone-700" />
                  <span className="text-xs font-cinzel">Kilitli Sahne</span>
                  <span className="text-[10px] text-stone-600">Hikayeyi oynayarak açın</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
