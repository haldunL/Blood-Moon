/**
 * TitleScreen Component
 * Cinematic main menu with gothic Victorian blood moon aesthetic, haunting music, and menu options
 */

import React from 'react';
import { soundManager } from '../utils/audioSynthesizer';
import { Play, FolderOpen, Users, Sparkles, Edit3, Settings, Volume2, VolumeX, Swords, Compass, Briefcase } from 'lucide-react';
import { AtmosphericBackground } from './AtmosphericBackground';

interface Props {
  onStartGame: () => void;
  onOpenLoadModal: () => void;
  onOpenCodex: () => void;
  onOpenGallery: () => void;
  onOpenInventory?: () => void;
  onOpenScenarioEditor: () => void;
  onOpenSettings: () => void;
  onOpenChapterSelect?: () => void;
  onOpenBattle?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const TitleScreen: React.FC<Props> = ({
  onStartGame,
  onOpenLoadModal,
  onOpenCodex,
  onOpenGallery,
  onOpenInventory,
  onOpenScenarioEditor,
  onOpenSettings,
  onOpenChapterSelect,
  onOpenBattle,
  isMuted = false,
  onToggleMute,
}) => {
  const handleItemHover = () => {
    soundManager.playSfx('click');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none flex flex-col justify-between p-8 md:p-14 z-30">
      {/* Background with blood moon and gothic castle */}
      <AtmosphericBackground backgroundId="gothic_castle" dreadLevel={40} />

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none z-10" />

      {/* Top Right Quick Audio Controls */}
      {onToggleMute && (
        <div className="absolute top-8 right-8 z-40">
          <button
            onClick={() => {
              onToggleMute();
              soundManager.playSfx('click');
            }}
            className="px-3.5 py-2 rounded-xl bg-black/60 border border-stone-800/80 hover:border-rose-600/60 text-stone-300 hover:text-white transition-all flex items-center gap-2 text-xs font-cinzel backdrop-blur-md cursor-pointer shadow-lg"
            title={isMuted ? 'Müziği ve Sesi Aç' : 'Müziği ve Sesi Sustur'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span className="text-rose-400 font-semibold hidden sm:inline">Ses Kapalı</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="text-stone-200 hidden sm:inline">Ses Açık</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Title Header */}
      <div className="relative z-20 max-w-2xl mt-12 animate-fade-in">
        <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-rose-500 tracking-wider drop-shadow-[0_5px_25px_rgba(225,29,72,0.8)] leading-tight">
          KIZIL AYIN FISILTISI
        </h1>
        <p className="font-serif-novel italic text-lg sm:text-2xl text-rose-200/90 mt-2 tracking-wide font-light">
          Ravenscroft Şatosu’nun Kanlı Sırları
        </p>
        <div className="w-36 h-0.5 bg-gradient-to-r from-rose-600 via-rose-400 to-transparent mt-4" />
      </div>

      {/* Menu Options */}
      <div className="relative z-20 max-w-sm flex flex-col gap-3 mb-6 animate-fade-in">
        <button
          onClick={() => {
            soundManager.playSfx('sensual_chime');
            onStartGame();
          }}
          onMouseEnter={handleItemHover}
          className="group w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-900/80 via-red-950/80 to-black/80 border border-rose-600/60 hover:border-rose-400 hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all duration-300 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Play className="w-4 h-4 text-rose-400 group-hover:text-rose-200 fill-rose-500/50" />
            <span className="font-cinzel font-bold text-sm tracking-wider text-white">
              Hikayeye Başla
            </span>
          </div>
          <span className="text-[10px] text-rose-400/80 font-cinzel tracking-widest">
            YENİ OYUN
          </span>
        </button>

        {onOpenChapterSelect && (
          <button
            onClick={() => {
              soundManager.playSfx('click');
              onOpenChapterSelect();
            }}
            onMouseEnter={handleItemHover}
            className="group w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-700/60 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-rose-400 group-hover:text-rose-200" />
              <span className="font-cinzel text-sm text-stone-100 group-hover:text-white font-bold">
                Bölüm Seçimi & Sahneler
              </span>
            </div>
            <span className="text-[10px] text-rose-300 font-cinzel font-bold tracking-wider">
              TEST MODU
            </span>
          </button>
        )}

        {onOpenBattle && (
          <button
            onClick={() => {
              soundManager.playSfx('click');
              onOpenBattle();
            }}
            onMouseEnter={handleItemHover}
            className="group w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-950/70 to-amber-950/70 border border-amber-600/60 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Swords className="w-4 h-4 text-amber-400 group-hover:text-amber-200" />
              <span className="font-cinzel text-sm text-stone-100 group-hover:text-white font-bold">
                Şato Zindanı (RPG Savaşı)
              </span>
            </div>
            <span className="text-[10px] text-amber-300 font-cinzel font-bold tracking-wider">
              TUR BAZLI
            </span>
          </button>
        )}

        <button
          onClick={() => {
            soundManager.playSfx('click');
            onOpenLoadModal();
          }}
          onMouseEnter={handleItemHover}
          className="group w-full py-3 px-6 rounded-xl bg-black/60 border border-stone-800/80 hover:border-rose-700/60 hover:bg-rose-950/30 transition-all flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FolderOpen className="w-4 h-4 text-stone-400 group-hover:text-rose-400" />
            <span className="font-cinzel text-sm text-stone-200 group-hover:text-white">
              Kayıttan Yükle
            </span>
          </div>
        </button>

        <button
          onClick={() => {
            soundManager.playSfx('click');
            onOpenCodex();
          }}
          onMouseEnter={handleItemHover}
          className="group w-full py-3 px-6 rounded-xl bg-black/60 border border-stone-800/80 hover:border-rose-700/60 hover:bg-rose-950/30 transition-all flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-stone-400 group-hover:text-rose-400" />
            <span className="font-cinzel text-sm text-stone-200 group-hover:text-white">
              Ravenscroft Hanedanı & Sırlar
            </span>
          </div>
          <span className="text-[10px] text-rose-400 font-cinzel">3 LEYDİ</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSfx('sensual_chime');
            onOpenGallery();
          }}
          onMouseEnter={handleItemHover}
          className="group w-full py-3 px-6 rounded-xl bg-black/60 border border-stone-800/80 hover:border-rose-700/60 hover:bg-rose-950/30 transition-all flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-stone-400 group-hover:text-rose-400" />
            <span className="font-cinzel text-sm text-stone-200 group-hover:text-white">
              CG & Sahne Galerisi
            </span>
          </div>
        </button>

        {onOpenInventory && (
          <button
            onClick={() => {
              soundManager.playSfx('click');
              onOpenInventory();
            }}
            onMouseEnter={handleItemHover}
            className="group w-full py-3 px-6 rounded-xl bg-black/60 border border-stone-800/80 hover:border-rose-700/60 hover:bg-rose-950/30 transition-all flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-stone-400 group-hover:text-rose-400" />
              <span className="font-cinzel text-sm text-stone-200 group-hover:text-white">
                Envanter & Yadigârlar
              </span>
            </div>
            <span className="text-[10px] text-rose-300 font-cinzel">EŞYALAR</span>
          </button>
        )}

        <button
          onClick={() => {
            soundManager.playSfx('click');
            onOpenScenarioEditor();
          }}
          onMouseEnter={handleItemHover}
          className="group w-full py-3 px-6 rounded-xl bg-black/60 border border-stone-800/80 hover:border-rose-700/60 hover:bg-rose-950/30 transition-all flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Edit3 className="w-4 h-4 text-stone-400 group-hover:text-rose-400" />
            <span className="font-cinzel text-sm text-stone-200 group-hover:text-white">
              Özel Sahne Yazarı
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-cinzel">YARATICI MOD</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSfx('click');
            onOpenSettings();
          }}
          onMouseEnter={handleItemHover}
          className="group w-full py-2.5 px-6 rounded-xl bg-black/40 border border-stone-900 hover:border-stone-700 text-stone-400 hover:text-white transition-all flex items-center gap-3 text-left cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="font-cinzel text-xs">Ayarlar</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="relative z-20 text-[11px] text-stone-500 font-serif-novel flex items-center justify-between">
        <span>© Ravenscroft Gothic Visual Novel Studios · Tüm Hakları Saklıdır</span>
        <span className="hidden sm:inline">Kulaklık ile oynanması tavsiye edilir</span>
      </div>
    </div>
  );
};
