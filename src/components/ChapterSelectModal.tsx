/**
 * ChapterSelectModal Component
 * Allows players and testers to jump directly to any story act, scene, or branch.
 */

import React from 'react';
import { Bookmark, Sparkles, X, Play, Compass, ShieldAlert, Heart } from 'lucide-react';
import { soundManager } from '../utils/audioSynthesizer';
import { CharacterId, BackgroundId } from '../types/novel';

export interface ChapterCheckpoint {
  id: string;
  chapterBadge: string;
  title: string;
  summary: string;
  keyCharacter?: CharacterId;
  backgroundId: BackgroundId;
  defaultAffection?: {
    vivienne?: number;
    evangeline?: number;
    valeria?: number;
    beatrice?: number;
    morrigan?: number;
    lenore?: number;
  };
  sanityPreset?: number;
}

export const CHAPTER_LIST: ChapterCheckpoint[] = [
  {
    id: 'start',
    chapterBadge: 'PROLOG',
    title: 'Fırtına ve Şatonun Ağır Kapıları',
    summary: 'Blackwood Ormanı’nın azgın fırtınası, devrilen at arabası ve Julian’ın sisler arasındaki Ravenscroft Şatosu’na ilk adımı.',
    backgroundId: 'gothic_castle',
    sanityPreset: 100,
  },
  {
    id: 'prologue_hall_split',
    chapterBadge: 'PROLOG YOL AYRIMI',
    title: 'Büyük Karşılama Salonu ve Tercih',
    summary: 'Mermer koridorun ayrımı: Bir yanda şöminenin kor ateşinden süzülen viyolonsel sesi, diğer yanda asırlık kütüphanenin tozlu kokusu.',
    backgroundId: 'reception_hall',
    sanityPreset: 95,
  },
  {
    id: 'act1_parlor_enter',
    chapterBadge: 'BÖLÜM 1',
    title: 'Kızıl Kadife Salon: Lady Vivienne',
    summary: 'Şöminenin başında kadehini çeviren büyüleyici kontes. Amcanın sırları, kan kırmızısı şarap ve ilk aristokratik yüzleşme.',
    keyCharacter: 'vivienne',
    backgroundId: 'crimson_parlor',
    defaultAffection: { vivienne: 25 },
    sanityPreset: 90,
  },
  {
    id: 'act2_library_enter',
    chapterBadge: 'BÖLÜM 2',
    title: 'Asırlık Kütüphane & Yasak Parşömenler',
    summary: 'Meşe kitaplıklar, ay ışığı, Liber Sanguinis ve gizli mezar mekanizmasını açan melek heykeli.',
    backgroundId: 'victorian_library',
    defaultAffection: { vivienne: 30 },
    sanityPreset: 85,
  },
  {
    id: 'act_lenore_corridor_enter',
    chapterBadge: 'ARA BÖLÜM',
    title: 'Aynalar Koridoru: Lady Lenore',
    summary: 'Mavi sislerle kaplı koridor ve aynaların içinde hapsolmuş melankolik ruh Lenore ile karşılaşma.',
    keyCharacter: 'lenore',
    backgroundId: 'mirror_corridor',
    defaultAffection: { lenore: 25 },
    sanityPreset: 80,
  },
  {
    id: 'act3_crypt_descent',
    chapterBadge: 'BÖLÜM 3',
    title: 'Kriptanın Solgun Gülü: Evangeline',
    summary: 'Şatonun temellerindeki kadim taş şapel, mermer lahitler ve beyaz güller arasında uyuyan masum Evangeline.',
    keyCharacter: 'evangeline',
    backgroundId: 'crypt_chapel',
    defaultAffection: { evangeline: 30 },
    sanityPreset: 75,
  },
  {
    id: 'act4_garden_descent',
    chapterBadge: 'BÖLÜM 4',
    title: 'Dikenli Gül Bahçesi: Savaşçı Valeria',
    summary: 'Sisli avlu, gümüş kılıcıyla nöbet tutan asil savaşçı leydi Valeria ve lanetli gölgelerle çarpışma.',
    keyCharacter: 'valeria',
    backgroundId: 'rose_garden',
    defaultAffection: { valeria: 35 },
    sanityPreset: 70,
  },
  {
    id: 'act5_cathedral_gathering',
    chapterBadge: 'BÖLÜM 5',
    title: 'Katedral Sunağı: Kızıl Ay Tutulması',
    summary: 'Tüm leydilerin sunağın etrafında toplandığı kader anı. Kızıl ayın kanlı ışığında nihai seçim.',
    backgroundId: 'cathedral_altar',
    defaultAffection: { vivienne: 50, evangeline: 50, valeria: 50 },
    sanityPreset: 60,
  },
  {
    id: 'ending_true_01',
    chapterBadge: 'GERÇEK SON',
    title: 'Altın Şafak ve Üç Gül Paktı',
    summary: 'Kanı, duayı ve çeliği harmanlayarak üç leydiyi de kurtaran efsanevi kurtuluş ve güneşin doğuşu.',
    backgroundId: 'ending_dawn',
    sanityPreset: 100,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (nodeId: string, customStats?: Partial<ChapterCheckpoint>) => void;
  currentNodeId?: string;
}

export const ChapterSelectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectChapter,
  currentNodeId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-950 border border-rose-900/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-rose-950/80 bg-black/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-lg text-rose-200 tracking-wide flex items-center gap-2">
                Bölüm & Sahne Seçimi
                <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40">
                  Hızlı Test Modu
                </span>
              </h2>
              <p className="text-xs text-stone-400 font-serif-novel mt-0.5">
                Dilediğiniz bölüme doğrudan atlayarak hikaye akışını ve sahneleri test edebilirsiniz.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playSfx('click');
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-rose-950/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapters Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {CHAPTER_LIST.map((chapter) => {
              const isCurrent = currentNodeId === chapter.id;

              return (
                <div
                  key={chapter.id}
                  onClick={() => {
                    soundManager.playSfx('sensual_chime');
                    onSelectChapter(chapter.id, chapter);
                    onClose();
                  }}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                    isCurrent
                      ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                      : 'bg-black/50 border-stone-800/80 hover:border-rose-700/60 hover:bg-rose-950/20'
                  }`}
                >
                  {/* Background Ambient Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-600/10 transition-colors" />

                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-cinzel font-bold px-2 py-0.5 rounded bg-stone-900 border border-stone-700/80 text-rose-400 tracking-wider">
                        {chapter.chapterBadge}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-emerald-400 font-cinzel font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          ŞU ANKİ SAHNE
                        </span>
                      )}
                    </div>

                    <h3 className="font-cinzel font-bold text-sm text-stone-100 group-hover:text-rose-200 transition-colors">
                      {chapter.title}
                    </h3>

                    <p className="text-xs text-stone-400 font-serif-novel mt-1.5 leading-relaxed line-clamp-2">
                      {chapter.summary}
                    </p>
                  </div>

                  {/* Card Footer: Metadata and Jump Button */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-800/60 text-[11px] text-stone-400">
                    <div className="flex items-center gap-2">
                      {chapter.keyCharacter && (
                        <span className="capitalize text-rose-300/80 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400" />
                          {chapter.keyCharacter}
                        </span>
                      )}
                      {chapter.sanityPreset && (
                        <span className="text-cyan-300/80">
                          Akıl Sağlığı: %{chapter.sanityPreset}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-rose-400 font-cinzel font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Başlat</span>
                      <Play className="w-3.5 h-3.5 fill-rose-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 border-t border-rose-950/60 bg-black/50 flex items-center justify-between text-xs text-stone-400 font-serif-novel">
          <span>İpucu: Bölüm seçildiğinde karakter ilgisi ve akıl sağlığı o bölüme göre otomatik ayarlanır.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition-colors text-xs font-cinzel"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
