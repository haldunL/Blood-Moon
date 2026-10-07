/**
 * CharacterCodexModal Component
 * In-depth profiles for the visual novel gothic heroines with secret desires, motto and quotes.
 * Includes interactive custom portrait loader for Lady Vivienne, Evangeline, and Valeria.
 */

import React, { useState, useRef, useEffect } from 'react';
import { CHARACTER_PROFILES } from '../data/storyData';
import { CharacterProfile, GameStats } from '../types/novel';
import { AnimeCharacterSprite } from './AnimeCharacterSprite';
import { soundManager } from '../utils/audioSynthesizer';
import { X, Heart, ShieldAlert, Sparkles, Volume2, Upload, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export const CharacterCodexModal: React.FC<Props> = ({ isOpen, onClose, stats }) => {
  const [selectedChar, setSelectedChar] = useState<CharacterProfile>(CHARACTER_PROFILES[0]);
  const [customPortraits, setCustomPortraits] = useState<Record<string, boolean>>({
    protagonist: false,
    vivienne: false,
    evangeline: false,
    valeria: false,
    beatrice: false,
    morrigan: false,
    lenore: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkPortraits = () => {
    setCustomPortraits({
      protagonist: !!localStorage.getItem('protagonist_custom_portrait') || !!localStorage.getItem('julian_custom_portrait'),
      vivienne: !!localStorage.getItem('vivienne_custom_portrait'),
      evangeline: !!localStorage.getItem('evangeline_custom_portrait'),
      valeria: !!localStorage.getItem('valeria_custom_portrait'),
      beatrice: !!localStorage.getItem('beatrice_custom_portrait'),
      morrigan: !!localStorage.getItem('morrigan_custom_portrait'),
      lenore: !!localStorage.getItem('lenore_custom_portrait'),
    });
  };

  useEffect(() => {
    checkPortraits();
  }, [isOpen]);

  if (!isOpen) return null;

  const getCharAffection = (id: string) => {
    if (id === 'vivienne' || id === 'shiori') return stats.vivienneAffection;
    if (id === 'evangeline' || id === 'aria') return stats.evangelineAffection;
    if (id === 'valeria' || id === 'karin') return stats.valeriaAffection;
    if (id === 'beatrice') return stats.beatriceAffection;
    if (id === 'morrigan') return stats.morriganAffection;
    if (id === 'lenore') return stats.lenoreAffection;
    return 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const charKey = `${selectedChar.id}_custom_portrait`;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        localStorage.setItem(charKey, dataUrl);
        if (selectedChar.id === 'protagonist') {
          localStorage.setItem('julian_custom_portrait', dataUrl);
        }
        checkPortraits();
        soundManager.playSfx('sensual_chime');
        window.dispatchEvent(new Event(`${selectedChar.id}_portrait_updated`));
        if (selectedChar.id === 'protagonist') {
          window.dispatchEvent(new Event('julian_portrait_updated'));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPortrait = () => {
    const charKey = `${selectedChar.id}_custom_portrait`;
    localStorage.removeItem(charKey);
    if (selectedChar.id === 'protagonist') {
      localStorage.removeItem('julian_custom_portrait');
    }
    checkPortraits();
    soundManager.playSfx('click');
    window.dispatchEvent(new Event(`${selectedChar.id}_portrait_updated`));
    if (selectedChar.id === 'protagonist') {
      window.dispatchEvent(new Event('julian_portrait_updated'));
    }
  };

  const hasCustom = customPortraits[selectedChar.id];
  const charShortName =
    selectedChar.id === 'protagonist'
      ? 'Julian'
      : selectedChar.id === 'vivienne'
      ? 'Vivienne'
      : selectedChar.id === 'evangeline'
      ? 'Evangeline'
      : selectedChar.id === 'valeria'
      ? 'Valeria'
      : selectedChar.id === 'beatrice'
      ? 'Beatrice'
      : selectedChar.id === 'morrigan'
      ? 'Morrigan'
      : 'Lady Lenore';

  const defaultExpression =
    selectedChar.id === 'protagonist'
      ? 'serious'
      : selectedChar.id === 'valeria'
      ? 'serious'
      : selectedChar.id === 'evangeline'
      ? 'smile'
      : selectedChar.id === 'beatrice'
      ? 'seductive'
      : selectedChar.id === 'morrigan'
      ? 'seductive'
      : selectedChar.id === 'lenore'
      ? 'seductive'
      : 'seductive';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in select-none">
      <div className="w-full max-w-4xl bg-[#0d0309] border border-rose-900/60 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-rose-950/60 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <span className="font-cinzel text-base font-bold text-rose-300">
              Ravenscroft Soy Kütüğü & Karakter Sırları
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Character Selector Tabs */}
            {CHARACTER_PROFILES.map((c) => {
              const isMet = !!stats.metCharacters?.[c.id] || c.id === 'protagonist';
              const shortName = c.name.split(' ')[0] === 'Lady' ? c.name.split(' ')[1] : c.name.split(' ')[0];
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    soundManager.playSfx('click');
                    setSelectedChar(c);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-cinzel font-bold transition-all flex items-center gap-1 ${
                    selectedChar.id === c.id
                      ? 'bg-rose-800 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                      : isMet
                      ? 'text-stone-300 hover:text-white bg-black/40'
                      : 'text-stone-500 hover:text-stone-300 bg-black/60 opacity-60'
                  }`}
                >
                  {!isMet && <span>🔒</span>}
                  <span>{isMet ? shortName : '???'}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                soundManager.playSfx('click');
                onClose();
              }}
              className="p-1 ml-2 rounded-full text-slate-400 hover:text-white hover:bg-rose-950/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          {(() => {
            const isSelectedCharMet = !!stats.metCharacters?.[selectedChar.id] || selectedChar.id === 'protagonist';

            if (!isSelectedCharMet) {
              return (
                <>
                  {/* Left: Locked Mysterious Silhouette */}
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <div className="w-full h-80 md:h-[400px] rounded-xl bg-gradient-to-b from-[#110309] to-black border border-stone-800 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                      <div className="w-24 h-24 rounded-full bg-stone-900/80 border border-stone-700 flex items-center justify-center text-4xl text-stone-600 mb-3 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                        🔒
                      </div>
                      <span className="font-cinzel text-base font-bold text-stone-400 tracking-wider">
                        ???
                      </span>
                      <span className="text-xs font-serif text-stone-500 mt-1 italic">
                        Henüz Karşılaşılmadı
                      </span>
                      <div className="absolute bottom-3 inset-x-3 text-center bg-black/85 px-3 py-1.5 rounded border border-stone-900 text-[11px] font-cinzel text-stone-500 italic backdrop-blur-sm">
                        "Şatoda bu gizemli hanımefendiyle henüz yüzleşmediniz."
                      </div>
                    </div>

                    <div className="bg-black/40 border border-stone-900 p-2.5 rounded-xl text-center text-xs text-stone-500 font-cinzel">
                      🔒 Karakterle karşılaşıldıktan sonra özel portre ve detaylar açılacaktır.
                    </div>
                  </div>

                  {/* Right: Locked Dossier Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between border-b border-stone-800 pb-2">
                        <div>
                          <h2 className="font-cinzel text-xl font-bold text-stone-400 flex items-center gap-2">
                            <span>??? (Bilinmeyen Hanımefendi)</span>
                          </h2>
                          <p className="text-xs text-stone-500 font-cinzel">
                            Kilitli Profil (Yaş: ???)
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 bg-stone-950/40 px-2.5 py-1 rounded-md border border-stone-800">
                          <Heart className="w-3.5 h-3.5 text-stone-600" />
                          <span className="text-xs font-bold text-stone-500">
                            🔒 Kilitli
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="mt-3">
                        <h4 className="text-xs font-cinzel text-stone-500 uppercase tracking-wider mb-1">
                          Karakter Geçmişi
                        </h4>
                        <p className="text-sm font-serif-novel text-stone-400 leading-relaxed italic">
                          Bu karakterin geçmişi, sırları ve hikayedeki rolü onunla Ravenscroft Şatosu koridorlarında bizzat karşılaştığınızda açığa çıkacaktır.
                        </p>
                      </div>

                      {/* Secret Desire */}
                      <div className="mt-3 p-3 rounded-lg bg-stone-950/40 border border-stone-900">
                        <div className="flex items-center gap-1.5 text-xs font-cinzel text-stone-500 font-bold mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-stone-600" />
                          <span>Gizli Arzusu & Zaafı</span>
                        </div>
                        <p className="text-xs font-serif-novel text-stone-500 italic">
                          🔒 Henüz keşfedilmedi.
                        </p>
                      </div>

                      {/* Quotes */}
                      <div className="mt-3">
                        <h4 className="text-xs font-cinzel text-stone-500 uppercase tracking-wider mb-1">
                          Önemli Replikler
                        </h4>
                        <div className="space-y-1 text-xs font-serif-novel text-stone-500 italic">
                          <p>• "..."</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }

            return (
              <>
                {/* Left: Character Portrait Preview */}
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                  <div className="w-full h-80 md:h-[400px] rounded-xl bg-gradient-to-b from-[#1b0512] to-black border border-rose-950/80 relative overflow-hidden flex items-center justify-center shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.15)_0,transparent_70%)] pointer-events-none" />
                    <div className="w-full h-full relative flex items-center justify-center">
                      <AnimeCharacterSprite
                        character={selectedChar.id}
                        expression={defaultExpression}
                        position="center"
                        isSpeaking={true}
                        isPortrait={true}
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/85 px-3 py-1 rounded border border-rose-950 text-[11px] font-cinzel text-rose-300 italic z-30 backdrop-blur-sm">
                      {selectedChar.motto}
                    </div>
                  </div>

                  {/* Custom Portrait Controls for Current Character */}
                  <div className="bg-black/60 border border-rose-950/80 p-2.5 rounded-xl flex items-center justify-between gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-cinzel font-bold border border-rose-700/50 hover:shadow-[0_0_12px_rgba(225,29,72,0.3)] transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{hasCustom ? `${charShortName} Görselini Değiştir` : `${charShortName} İmajı Yükle`}</span>
                    </button>

                    {hasCustom && (
                      <button
                        onClick={handleResetPortrait}
                        title="Orijinal çizime geri dön"
                        className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-rose-300 text-xs border border-stone-800 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Sıfırla</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Dossier Details */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between border-b border-rose-950/60 pb-2">
                      <div>
                        <h2 className="font-cinzel text-xl font-bold text-rose-100 flex items-center gap-2">
                          <span>{selectedChar.name}</span>
                          {hasCustom && (
                            <span className="flex items-center gap-1 text-[10px] font-sans px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Özel Portre
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-rose-400/80 font-cinzel">
                          {selectedChar.title} (Yaş: {selectedChar.age})
                        </p>
                      </div>

                      {/* Affection Level / Protagonist Willpower */}
                      {selectedChar.id === 'protagonist' ? (
                        <div className="flex items-center gap-1.5 bg-sky-950/50 px-2.5 py-1 rounded-md border border-sky-700/50">
                          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                          <span className="text-xs font-bold text-sky-200">
                            İrade: {stats.willpower ?? 25} | Sv. {stats.level ?? 1}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-900/40">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span className="text-xs font-bold text-rose-200">
                            %{getCharAffection(selectedChar.id)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    <div className="mt-3">
                      <h4 className="text-xs font-cinzel text-stone-400 uppercase tracking-wider mb-1">
                        Karakter Geçmişi & Görünümü
                      </h4>
                      <p className="text-sm font-serif-novel text-slate-200 leading-relaxed">
                        {selectedChar.description}
                      </p>
                    </div>

                    {/* Secret Desire */}
                    <div className="mt-3 p-3 rounded-lg bg-rose-950/30 border border-rose-900/40">
                      <div className="flex items-center gap-1.5 text-xs font-cinzel text-rose-300 font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                        <span>Gizli Arzusu & Zaafı</span>
                      </div>
                      <p className="text-xs font-serif-novel text-rose-200/90 italic">
                        {selectedChar.secretDesire}
                      </p>
                    </div>

                    {/* Danger Level */}
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      <span className="text-stone-400">Tehlike Derecesi:</span>
                      <span className="text-amber-300 font-medium">{selectedChar.dangerLevel}</span>
                    </div>

                    {/* Voice Lines / Quotes */}
                    <div className="border-t border-rose-950/60 pt-3 mt-3">
                      <h4 className="text-xs font-cinzel text-stone-400 uppercase tracking-wider mb-2">
                        Unutulmaz Fısıltılar
                      </h4>
                      <div className="space-y-1.5">
                        {selectedChar.quotes.map((q, i) => (
                          <div
                            key={i}
                            onClick={() => soundManager.playSfx(selectedChar.id === 'vivienne' ? 'whisper' : 'sensual_chime')}
                            className="p-2 rounded bg-black/40 hover:bg-rose-950/30 text-[11px] font-serif-novel text-stone-300 border border-stone-900 cursor-pointer flex items-center justify-between group transition-colors"
                          >
                            <span>"{q}"</span>
                            <Volume2 className="w-3 h-3 text-stone-600 group-hover:text-rose-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
