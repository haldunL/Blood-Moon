/**
 * InventoryModal Component
 * Atmospheric Gothic Victorian inventory showcase for collected items, relics, weapons, and clues
 */

import React, { useState } from 'react';
import { GameStats } from '../types/novel';
import { InventoryItemDef, ItemCategory, ItemRarity } from '../types/inventory';
import { ITEMS_DATABASE } from '../data/inventoryData';
import { soundManager } from '../utils/audioSynthesizer';
import { calculateLevelProgress } from '../utils/progression';
import {
  X,
  Briefcase,
  Sword,
  Shield,
  Scroll,
  Mail,
  Droplets,
  Sparkles,
  Search,
  CheckCircle,
  AlertCircle,
  Zap,
  Heart,
  Flame,
  ShieldAlert,
  BookOpen,
  Eye,
  Key,
  Gem,
  Map,
  Flower2,
  FlaskConical,
  Award,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onUseItem?: (itemId: string, item: InventoryItemDef) => void;
}

const CATEGORY_TABS: { id: ItemCategory; label: string; icon: any }[] = [
  { id: 'all', label: 'Tümü', icon: Briefcase },
  { id: 'weapon', label: 'Silahlar', icon: Sword },
  { id: 'clue', label: 'İpuçları & Belgeler', icon: Scroll },
  { id: 'relic', label: 'Tılsım & Yadigârlar', icon: Gem },
  { id: 'consumable', label: 'İksir & Şifa', icon: FlaskConical },
];

const RARITY_CONFIG: Record<
  ItemRarity,
  { label: string; color: string; border: string; bg: string; glow: string }
> = {
  common: {
    label: 'Sıradan',
    color: 'text-stone-300',
    border: 'border-stone-700/60',
    bg: 'bg-stone-900/50',
    glow: 'shadow-[0_0_10px_rgba(120,113,108,0.15)]',
  },
  uncommon: {
    label: 'Kutsanmış',
    color: 'text-emerald-400',
    border: 'border-emerald-700/60',
    bg: 'bg-emerald-950/30',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  },
  rare: {
    label: 'Nadir Miras',
    color: 'text-sky-400',
    border: 'border-sky-600/60',
    bg: 'bg-sky-950/30',
    glow: 'shadow-[0_0_15px_rgba(56,189,248,0.25)]',
  },
  relic: {
    label: 'Kadim Tılsım',
    color: 'text-purple-400',
    border: 'border-purple-600/60',
    bg: 'bg-purple-950/30',
    glow: 'shadow-[0_0_18px_rgba(168,85,247,0.3)]',
  },
  legendary: {
    label: 'Efsanevi Yadigâr',
    color: 'text-amber-400',
    border: 'border-amber-500/70',
    bg: 'bg-amber-950/40',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
  },
};

export const InventoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  stats,
  onUseItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [useFeedback, setUseFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const inventoryMap = stats.inventory || {};

  // Build items array from inventory map
  const ownedItems: { def: InventoryItemDef; count: number }[] = Object.entries(
    inventoryMap
  )
    .filter(([_, count]) => count > 0)
    .map(([id, count]) => {
      const def = ITEMS_DATABASE[id] || {
        id,
        name: id.replace(/_/g, ' '),
        category: 'relic',
        rarity: 'rare',
        iconName: 'Sparkles',
        emoji: '✨',
        shortDescription: 'Gizemli Şato Nesnesi',
        lore: 'Şatonun karanlık köşelerinden toplanmış gizemli bir nesne.',
        acquiredLocation: 'Ravenscroft Şatosu',
      };
      return { def, count };
    });

  // Filter items by active category tab
  const filteredItems = ownedItems.filter((slot) => {
    if (selectedCategory === 'all') return true;
    return slot.def.category === selectedCategory;
  });

  // Active selected item (or default to first available)
  const activeSlot =
    ownedItems.find((s) => s.def.id === selectedItemId) ||
    filteredItems[0] ||
    ownedItems[0] ||
    null;

  const handleSelect = (itemId: string) => {
    soundManager.playSfx('click');
    setSelectedItemId(itemId);
    setInspectMode(false);
    setUseFeedback(null);
  };

  const handleUse = (slot: { def: InventoryItemDef; count: number }) => {
    if (!slot.def.isConsumable || slot.count <= 0) return;
    soundManager.playSfx('sensual_chime');
    if (onUseItem) {
      onUseItem(slot.def.id, slot.def);
    }
    setUseFeedback(`"${slot.def.name}" kullanıldı!`);
    setTimeout(() => setUseFeedback(null), 3000);
  };

  const handleToggleInspect = () => {
    soundManager.playSfx('page_flip');
    setInspectMode((prev) => !prev);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] max-h-[780px] bg-gradient-to-b from-stone-950 via-rose-950/20 to-black border-2 border-rose-900/60 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.25)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-950/60 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-900/60 to-red-950 border border-rose-600/50 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.3)]">
              <Briefcase className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-rose-300 to-amber-200 tracking-wider">
                ENVANTER & YADİGÂRLAR
              </h2>
              <p className="text-xs text-rose-300/70 font-serif-novel italic">
                Toplanan deliller, kutsanmış silahlar ve Alistair’in mirası ({ownedItems.length} Çeşit Eşya)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Player Stat Badges in Inventory Header */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono">
              {/* Level & EXP */}
              {(() => {
                const prog = calculateLevelProgress(stats.exp || 0);
                return (
                  <div
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/80 to-stone-900/80 border border-amber-600/50 px-2.5 py-1 rounded-lg text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                    title={`Seviye ${prog.level} (${prog.title})\nToplam EXP: ${prog.totalExp}\nİlerleme: ${prog.expInLevel}/${prog.expNeededForNext} EXP`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-amber-200">Lv.{prog.level}</span>
                    <span className="text-[10px] text-amber-400/80">({prog.expInLevel}/{prog.expNeededForNext} EXP)</span>
                  </div>
                );
              })()}

              <div className="flex items-center gap-1 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-1 rounded-lg text-emerald-300">
                <Heart className="w-3.5 h-3.5 text-emerald-400" />
                <span>HP: {stats.hp ?? 100}</span>
              </div>
              <div className="flex items-center gap-1 bg-cyan-950/50 border border-cyan-800/40 px-2.5 py-1 rounded-lg text-cyan-300">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                <span>İrade: {stats.willpower ?? stats.sanity}</span>
              </div>
              <div className="flex items-center gap-1 bg-amber-950/50 border border-amber-800/40 px-2.5 py-1 rounded-lg text-amber-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Odak: %{stats.focus ?? 0}</span>
              </div>
              <div className="flex items-center gap-1 bg-purple-950/50 border border-purple-800/40 px-2.5 py-1 rounded-lg text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Gizem: {stats.mystery ?? 0}</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playSfx('click');
                onClose();
              }}
              className="p-2 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-white hover:border-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-black/40 border-b border-rose-950/40 overflow-x-auto scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            const count =
              tab.id === 'all'
                ? ownedItems.length
                : ownedItems.filter((s) => s.def.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playSfx('click');
                  setSelectedCategory(tab.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? 'bg-rose-900/60 text-white border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : 'bg-stone-900/40 text-stone-400 border-stone-800/60 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-300' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-rose-500/40 text-white' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Use Feedback Banner */}
        {useFeedback && (
          <div className="px-6 py-2 bg-emerald-950/80 border-b border-emerald-700/60 text-emerald-200 text-xs flex items-center justify-between animate-fadeIn font-cinzel">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{useFeedback}</span>
            </div>
            <span className="text-[11px] text-emerald-400/80">Etkiler uygulandı.</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Grid: Items List */}
          <div className="w-full md:w-7/12 p-4 sm:p-6 overflow-y-auto border-r border-rose-950/40">
            {filteredItems.length === 0 ? (
              <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-8 text-stone-500">
                <Briefcase className="w-12 h-12 text-stone-700 mb-3" />
                <p className="font-cinzel text-base text-stone-400 font-bold">
                  Bu Kategoride Eşya Bulunmuyor
                </p>
                <p className="text-xs font-serif-novel italic text-stone-600 mt-1 max-w-sm">
                  Şatonun karanlık koridorlarını ve gizli odalarını keşfederek yeni ipuçları ve yadigârlar toplayabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((slot) => {
                  const { def, count } = slot;
                  const isSelected = activeSlot?.def.id === def.id;
                  const rarityStyle = RARITY_CONFIG[def.rarity] || RARITY_CONFIG.common;

                  return (
                    <div
                      key={def.id}
                      onClick={() => handleSelect(def.id)}
                      className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? `bg-rose-950/70 border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.3)] ring-1 ring-rose-400/40`
                          : `${rarityStyle.bg} ${rarityStyle.border} hover:border-rose-700/60 hover:bg-stone-900/70`
                      }`}
                    >
                      {/* Item Emoji/Icon Avatar */}
                      <div
                        className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border bg-black/60 ${rarityStyle.border} ${rarityStyle.glow}`}
                      >
                        <span>{def.emoji}</span>
                        {count > 1 && (
                          <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-md border border-rose-400">
                            x{count}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4
                            className={`font-cinzel font-bold text-sm truncate ${
                              isSelected ? 'text-white' : rarityStyle.color
                            }`}
                          >
                            {def.name}
                          </h4>
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold font-mono ${rarityStyle.color}`}
                        >
                          {rarityStyle.label}
                        </span>
                        <p className="text-xs text-stone-400 font-serif-novel line-clamp-2 mt-1">
                          {def.shortDescription}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Inspector Panel */}
          <div className="w-full md:w-5/12 p-5 sm:p-6 bg-black/40 flex flex-col justify-between overflow-y-auto">
            {activeSlot ? (
              <div className="flex flex-col h-full justify-between gap-4">
                {/* Item Details */}
                <div className="flex flex-col gap-4">
                  {/* Item Showcase Card */}
                  <div
                    className={`relative p-5 rounded-2xl border bg-gradient-to-b from-stone-950 to-black ${
                      RARITY_CONFIG[activeSlot.def.rarity]?.border || 'border-stone-800'
                    } ${RARITY_CONFIG[activeSlot.def.rarity]?.glow || ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-black/70 border border-stone-800 flex items-center justify-center text-4xl shadow-inner">
                        {activeSlot.def.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-bold ${
                              RARITY_CONFIG[activeSlot.def.rarity]?.bg
                            } ${RARITY_CONFIG[activeSlot.def.rarity]?.color} border ${
                              RARITY_CONFIG[activeSlot.def.rarity]?.border
                            }`}
                          >
                            {RARITY_CONFIG[activeSlot.def.rarity]?.label}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            Adet: {activeSlot.count}
                          </span>
                        </div>
                        <h3 className="font-cinzel text-lg font-bold text-rose-100 mt-1">
                          {activeSlot.def.name}
                        </h3>
                        {activeSlot.def.acquiredLocation && (
                          <p className="text-[11px] text-rose-400/70 font-mono flex items-center gap-1 mt-0.5">
                            <span>📍</span>
                            <span>{activeSlot.def.acquiredLocation}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Consumable Effect Bar */}
                  {activeSlot.def.effectDescription && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{activeSlot.def.effectDescription}</span>
                    </div>
                  )}

                  {/* Lore or Detailed Inspection View */}
                  <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-900 flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-stone-800/60 pb-2">
                      <span className="font-cinzel text-xs text-rose-300/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                        {inspectMode ? 'Belge & İpucu İncelemesi' : 'Nesne Hikayesi & Tasviri'}
                      </span>
                      {activeSlot.def.inspectionText && (
                        <button
                          onClick={handleToggleInspect}
                          className="text-[11px] text-amber-400 hover:text-amber-200 underline font-serif-novel italic flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          {inspectMode ? 'Hikayeye Dön' : 'Detaylı İncele'}
                        </button>
                      )}
                    </div>

                    {inspectMode && activeSlot.def.inspectionText ? (
                      <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-amber-200/90 text-xs font-serif-novel italic leading-relaxed animate-fadeIn">
                        {activeSlot.def.inspectionText}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-300 font-serif-novel leading-relaxed">
                        {activeSlot.def.lore}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Footer in Right Panel */}
                <div className="flex items-center gap-3 pt-2">
                  {activeSlot.def.isConsumable ? (
                    <button
                      onClick={() => handleUse(activeSlot)}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-900 border border-emerald-500 text-white font-cinzel font-bold text-xs tracking-wider hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-emerald-300" />
                      <span>Kullan ({activeSlot.count})</span>
                    </button>
                  ) : activeSlot.def.category === 'weapon' ? (
                    <div className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900/80 border border-sky-800/50 text-sky-300 font-cinzel font-semibold text-xs text-center flex items-center justify-center gap-2">
                      <Sword className="w-4 h-4 text-sky-400" />
                      <span>Kuşanılmış Ana Silah</span>
                    </div>
                  ) : activeSlot.def.inspectionText ? (
                    <button
                      onClick={handleToggleInspect}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-stone-900 to-rose-950 border border-rose-700/60 text-rose-200 font-cinzel font-bold text-xs tracking-wider hover:border-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-rose-400" />
                      <span>{inspectMode ? 'Genel Bakış' : 'İpuçlarını Oku / İncele'}</span>
                    </button>
                  ) : (
                    <div className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-400 font-cinzel text-xs text-center">
                      Pasif Hikaye Yadigârı
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-stone-600 text-xs">
                İncelemek için sol menüden bir eşya seçin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
