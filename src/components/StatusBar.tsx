/**
 * StatusBar Component
 * Displays psychological sanity, character affection meters, and audio quick-toggle
 */

import React from 'react';
import { GameStats } from '../types/novel';
import { Volume2, VolumeX, ShieldAlert, Heart, Flame, Sparkles, Key, Moon, Droplets, Briefcase, Award } from 'lucide-react';
import { soundManager } from '../utils/audioSynthesizer';
import { calculateLevelProgress } from '../utils/progression';

interface Props {
  stats: GameStats;
  chapterTitle?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onReturnToTitle?: () => void;
  canGoBack?: boolean;
  onStepPrevious?: () => void;
  onOpenChapterSelect?: () => void;
  onOpenInventory?: () => void;
}

export const StatusBar: React.FC<Props> = ({
  stats,
  chapterTitle = 'Ravenscroft Şatosu',
  isMuted,
  onToggleMute,
  onReturnToTitle,
  canGoBack = false,
  onStepPrevious,
  onOpenChapterSelect,
  onOpenInventory,
}) => {
  const met = stats.metCharacters || {};
  const inventoryCount = Object.values(stats.inventory || {}).reduce((acc, v) => acc + (v > 0 ? 1 : 0), 0);
  const prog = calculateLevelProgress(stats.exp || 0);

  return (
    <header className="fixed top-0 inset-x-0 z-30 p-2 md:p-2.5 pointer-events-auto flex items-center justify-between text-xs backdrop-blur-md bg-black/60 border-b border-rose-950/40 select-none">
      {/* Left: Chapter, Return to Title & Sanity */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {onReturnToTitle && (
          <button
            onClick={() => {
              soundManager.playSfx('click');
              onReturnToTitle();
            }}
            className="px-2 py-1 rounded bg-rose-950/60 text-rose-300 hover:text-white hover:bg-rose-900/60 border border-rose-900/40 transition-colors flex items-center gap-1 font-cinzel text-[11px]"
            title="Ana Menüye Dön"
          >
            Ana Menü
          </button>
        )}

        {/* TEST MODE: Go Back / Previous Scene Button */}
        {onStepPrevious && (
          <button
            onClick={() => {
              if (canGoBack) {
                onStepPrevious();
              }
            }}
            disabled={!canGoBack}
            className={`px-2 py-1 rounded font-cinzel text-[11px] flex items-center gap-1 transition-all border ${
              canGoBack
                ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border-amber-600/60 shadow-[0_0_10px_rgba(245,158,11,0.3)] cursor-pointer'
                : 'bg-stone-900/40 text-stone-600 border-stone-800/40 cursor-not-allowed opacity-40'
            }`}
            title="Test Modu: Bir sahne / seçim öncesine geri dön (Kısayol: Backspace veya Z)"
          >
            <span>⏪</span>
            <span className="hidden sm:inline font-bold">Önceki Sahne</span>
            <span className="sm:hidden font-bold">Geri</span>
          </button>
        )}

        {/* Quick Chapter Select Button */}
        {onOpenChapterSelect && (
          <button
            onClick={() => {
              soundManager.playSfx('page_flip');
              onOpenChapterSelect();
            }}
            className="px-2 py-1 rounded bg-purple-950/60 hover:bg-purple-900/70 text-purple-200 border border-purple-800/50 transition-colors flex items-center gap-1 font-cinzel text-[11px] cursor-pointer"
            title="İstediğin Bölüm ve Sahneye Anında Atla"
          >
            <span>📖</span>
            <span className="hidden sm:inline">Bölümler</span>
          </button>
        )}

        {/* Quick Inventory Button */}
        {onOpenInventory && (
          <button
            onClick={() => {
              soundManager.playSfx('click');
              onOpenInventory();
            }}
            className="px-2 py-1 rounded bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 border border-rose-800/60 transition-all flex items-center gap-1.5 font-cinzel text-[11px] cursor-pointer shadow-[0_0_10px_rgba(225,29,72,0.25)]"
            title="Envanter ve Toplanan Eşyaları Aç (Kısayol: I veya E)"
          >
            <Briefcase className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-bold">Envanter</span>
            <span className="bg-rose-600/60 text-rose-100 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {inventoryCount}
            </span>
          </button>
        )}

        <span className="font-cinzel font-bold text-rose-300 text-xs tracking-wider hidden lg:inline">
          {chapterTitle}
        </span>

        {/* Sanity & Core Stats */}
        <div className="flex items-center gap-2">
          {/* Level & EXP Progress */}
          <div
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/80 via-stone-900/90 to-stone-950/90 px-2 py-0.5 rounded border border-amber-600/50 shadow-[0_0_8px_rgba(245,158,11,0.2)] cursor-help"
            title={`Julian - ${prog.title}\nToplam EXP: ${prog.totalExp}\nBu Seviyedeki İlerleme: ${prog.expInLevel} / ${prog.expNeededForNext} EXP (%${prog.progressPercent})\nBonuslar: +${prog.maxHpBonus} Max HP, +${prog.atkBonus} Saldırı Gücü`}
          >
            <div className="flex items-center gap-1">
              <span className="text-amber-400 font-serif font-black text-[11px]">Lv.{prog.level}</span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center justify-between text-[9px] font-mono text-amber-200/90 leading-none mb-0.5 gap-1">
                <span className="font-bold">EXP</span>
                <span>{prog.expInLevel}/{prog.expNeededForNext}</span>
              </div>
              <div className="w-12 md:w-16 h-1.5 bg-stone-950 rounded-full overflow-hidden border border-amber-900/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                  style={{ width: `${prog.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* HP */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-stone-950/80 px-2 py-0.5 rounded border border-emerald-900/40">
            <span className="text-[10px] text-emerald-500 font-bold">HP</span>
            <span>{stats.hp ?? 100}</span>
          </div>

          {/* İrade (Sanity / Willpower) */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-stone-950/80 px-2 py-0.5 rounded border border-cyan-900/40" title="İrade (SP / Akıl Sağlığı): Hipnoz ve karanlık büyülere zihinsel direnç">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-cyan-400 font-bold">İrade</span>
            <span>{stats.willpower ?? stats.sanity}</span>
          </div>

          {/* Odak (Focus / Tension) */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-stone-950/80 px-2 py-0.5 rounded border border-amber-900/40" title="Odak (Gerilim / Çekim Barı): Kritik vuruş ve Partner Link yeteneklerini açar">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-amber-400 font-bold">Odak</span>
            <span>%{stats.focus ?? 0}</span>
          </div>

          {/* Gizem (Mystery / Dedektiflik) */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-purple-300 bg-stone-950/80 px-2 py-0.5 rounded border border-purple-900/40" title="Gizem: İpuçlarını çözme, Alistair'in gizli notları ve Gerçek Son anahtarı">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] text-purple-400 font-bold">Gizem</span>
            <span>{stats.mystery ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Right: Affection Meters & Audio */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* Vivienne */}
        {met.vivienne ? (
          <div className="flex items-center gap-1 animate-fadeIn" title={`Lady Vivienne Tutkusu: %${stats.vivienneAffection}`}>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="text-[10px] text-rose-200 hidden xl:inline">Vivienne</span>
            <div className="w-10 md:w-12 h-1.5 rounded-full bg-stone-900 overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${Math.min(100, stats.vivienneAffection)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-30" title="Henüz Karşılaşılmadı">
            <Heart className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-[10px] text-stone-500 font-mono">???</span>
          </div>
        )}

        {/* Evangeline */}
        {met.evangeline ? (
          <div className="flex items-center gap-1 animate-fadeIn" title={`Evangeline Bağı: %${stats.evangelineAffection}`}>
            <Sparkles className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
            <span className="text-[10px] text-purple-200 hidden xl:inline">Evangeline</span>
            <div className="w-10 md:w-12 h-1.5 rounded-full bg-stone-900 overflow-hidden">
              <div
                className="h-full bg-purple-400 transition-all duration-300"
                style={{ width: `${Math.min(100, stats.evangelineAffection)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-30" title="Henüz Karşılaşılmadı">
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-[10px] text-stone-500 font-mono">???</span>
          </div>
        )}

        {/* Valeria */}
        {met.valeria ? (
          <div className="flex items-center gap-1 animate-fadeIn" title={`Valeria Yakınlığı: %${stats.valeriaAffection}`}>
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-[10px] text-amber-200 hidden xl:inline">Valeria</span>
            <div className="w-10 md:w-12 h-1.5 rounded-full bg-stone-900 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${Math.min(100, stats.valeriaAffection)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-30" title="Henüz Karşılaşılmadı">
            <Flame className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-[10px] text-stone-500 font-mono">???</span>
          </div>
        )}

        {/* Beatrice */}
        {met.beatrice ? (
          <div className="flex items-center gap-1 animate-fadeIn" title={`Beatrice Sadakati: %${stats.beatriceAffection}`}>
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-emerald-200 hidden xl:inline">Beatrice</span>
            <div className="w-10 md:w-12 h-1.5 rounded-full bg-stone-900 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${Math.min(100, stats.beatriceAffection)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-30" title="Henüz Karşılaşılmadı">
            <Key className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-[10px] text-stone-500 font-mono">???</span>
          </div>
        )}

        {/* Morrigan */}
        {met.morrigan ? (
          <div className="flex items-center gap-1 animate-fadeIn" title={`Morrigan Paktı: %${stats.morriganAffection}`}>
            <Moon className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
            <span className="text-[10px] text-violet-200 hidden xl:inline">Morrigan</span>
            <div className="w-10 md:w-12 h-1.5 rounded-full bg-stone-900 overflow-hidden">
              <div
                className="h-full bg-violet-400 transition-all duration-300"
                style={{ width: `${Math.min(100, stats.morriganAffection)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-30" title="Henüz Karşılaşılmadı">
            <Moon className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-[10px] text-stone-500 font-mono">???</span>
          </div>
        )}

        {/* Lenore */}
        {met.lenore ? (
          <div className="flex items-center gap-1 animate-fadeIn" title={`Lady Lenore Bağı: %${stats.lenoreAffection}`}>
            <Droplets className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
            <span className="text-[10px] text-sky-200 hidden xl:inline">Lenore</span>
            <div className="w-10 md:w-12 h-1.5 rounded-full bg-stone-900 overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-300"
                style={{ width: `${Math.min(100, stats.lenoreAffection)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-30" title="Henüz Karşılaşılmadı">
            <Droplets className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-[10px] text-stone-500 font-mono">???</span>
          </div>
        )}

        {/* Mute Toggle */}
        <button
          onClick={() => {
            soundManager.playSfx('click');
            onToggleMute();
          }}
          className="p-1 rounded bg-stone-900/60 text-slate-300 hover:text-white transition-colors ml-1"
          title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
