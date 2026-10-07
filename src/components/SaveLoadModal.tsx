/**
 * SaveLoadModal Component
 * Visual novel save and load management with slots and previews
 */

import React, { useState, useEffect } from 'react';
import { SaveSlot, GameStats, BackgroundId, CharacterId } from '../types/novel';
import { soundManager } from '../utils/audioSynthesizer';
import { X, Save, FolderOpen, Trash2, Heart, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
  currentSaveData: {
    nodeId: string;
    chapterTitle: string;
    previewText: string;
    speaker: string;
    background: BackgroundId;
    character?: CharacterId;
    stats: GameStats;
  };
  onLoadSlot: (slot: SaveSlot) => void;
}

const STORAGE_KEY = 'kizil_ayin_fisiltisi_saves_v1';

export const SaveLoadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  currentSaveData,
  onLoadSlot,
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'load'>(mode);
  const [slots, setSlots] = useState<(SaveSlot | null)[]>([null, null, null, null, null, null]);

  // Sync activeTab when mode prop changes
  useEffect(() => {
    setActiveTab(mode);
  }, [mode]);

  // Load slots from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setSlots(parsed);
        }
      } catch (e) {
        console.error('Failed to parse save data', e);
      }
    }
  }, [isOpen]);

  const handleSaveToSlot = (slotIndex: number) => {
    const newSlot: SaveSlot = {
      id: slotIndex,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      nodeId: currentSaveData.nodeId,
      chapterTitle: currentSaveData.chapterTitle,
      previewText: currentSaveData.previewText.slice(0, 75) + '...',
      speaker: currentSaveData.speaker,
      background: currentSaveData.background,
      character: currentSaveData.character,
      stats: {
        sanity: currentSaveData.stats.sanity,
        hp: currentSaveData.stats.hp,
        maxHp: currentSaveData.stats.maxHp,
        exp: currentSaveData.stats.exp,
        level: currentSaveData.stats.level,
        willpower: currentSaveData.stats.willpower,
        mystery: currentSaveData.stats.mystery,
        focus: currentSaveData.stats.focus,
        vivienneAffection: currentSaveData.stats.vivienneAffection,
        evangelineAffection: currentSaveData.stats.evangelineAffection,
        valeriaAffection: currentSaveData.stats.valeriaAffection,
        beatriceAffection: currentSaveData.stats.beatriceAffection,
        morriganAffection: currentSaveData.stats.morriganAffection,
        lenoreAffection: currentSaveData.stats.lenoreAffection,
        metCharacters: currentSaveData.stats.metCharacters,
        inventory: currentSaveData.stats.inventory,
        claimedRewards: currentSaveData.stats.claimedRewards,
      },
    };

    const newSlots = [...slots];
    newSlots[slotIndex] = newSlot;
    setSlots(newSlots);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
    soundManager.playSfx('sensual_chime');
  };

  const handleDeleteSlot = (e: React.MouseEvent, slotIndex: number) => {
    e.stopPropagation();
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
    soundManager.playSfx('click');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-3xl bg-[#0c0307] border border-rose-900/60 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header & Tabs */}
        <div className="p-4 border-b border-rose-950/60 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playSfx('click');
                setActiveTab('save');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-cinzel font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'save'
                  ? 'bg-rose-700 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              Kayıt Et
            </button>
            <button
              onClick={() => {
                soundManager.playSfx('click');
                setActiveTab('load');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-cinzel font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'load'
                  ? 'bg-rose-700 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Yükle
            </button>
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

        {/* 6 Save Slots Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map((slot, index) => {
            const isEmpty = slot === null;

            return (
              <div
                key={index}
                onClick={() => {
                  if (activeTab === 'save') {
                    handleSaveToSlot(index);
                  } else if (slot) {
                    soundManager.playSfx('page_flip');
                    onLoadSlot(slot);
                    onClose();
                  }
                }}
                className={`relative p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[140px] cursor-pointer ${
                  isEmpty
                    ? 'border-stone-900 bg-stone-950/40 hover:border-rose-900/60 hover:bg-rose-950/20'
                    : 'border-rose-950 bg-gradient-to-br from-black/80 via-[#18040d]/70 to-black/90 hover:border-rose-600/70 hover:shadow-[0_0_20px_rgba(225,29,72,0.25)]'
                }`}
              >
                {/* Slot Number Label */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-cinzel text-xs font-bold text-rose-400">
                    SLOT 0{index + 1}
                  </span>
                  {!isEmpty && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500 font-mono">
                        {slot.dateStr}
                      </span>
                      <button
                        onClick={(e) => handleDeleteSlot(e, index)}
                        className="p-1 text-stone-500 hover:text-red-400 transition-colors"
                        title="Kaydı Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {isEmpty ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-6 text-stone-600">
                    <p className="text-xs font-cinzel tracking-wider">
                      {activeTab === 'save' ? '+ Bu Slota Kaydet' : 'Boş Yuva'}
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-rose-200 line-clamp-1">
                        {slot.chapterTitle}
                      </p>
                      <p className="text-[11px] font-serif-novel text-stone-300 mt-1 line-clamp-2 italic">
                        "{slot.previewText}"
                      </p>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-3 pt-2 border-t border-rose-950/40 flex items-center justify-between text-[10px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-red-400" />
                        Akıl: %{slot.stats.sanity}
                      </span>
                      <span className="flex items-center gap-1 text-rose-300">
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                        Vi:%{slot.stats.vivienneAffection ?? 0} Ev:%{slot.stats.evangelineAffection ?? 0} Va:%{slot.stats.valeriaAffection ?? 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
