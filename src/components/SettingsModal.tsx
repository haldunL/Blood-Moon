/**
 * SettingsModal Component
 * Visual novel configuration for audio, text speed, visual effects, and character portraits
 * (Supports Lady Vivienne, Evangeline, and Valeria)
 */

import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audioSynthesizer';
import { X, Volume2, Sliders, Monitor, Image as ImageIcon, Upload, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  onVolumeChange: (master: number, bgm: number, sfx: number) => void;
  textSpeed: number;
  onTextSpeedChange: (speed: number) => void;
  autoPlayDelay: number;
  onAutoPlayDelayChange: (delay: number) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  masterVolume,
  bgmVolume,
  sfxVolume,
  onVolumeChange,
  textSpeed,
  onTextSpeedChange,
  autoPlayDelay,
  onAutoPlayDelayChange,
}) => {
  const [portraits, setPortraits] = useState({
    vivienne: false,
    evangeline: false,
    valeria: false,
  });

  const [activeUploadTarget, setActiveUploadTarget] = useState<'vivienne' | 'evangeline' | 'valeria'>('vivienne');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshPortraits = () => {
    setPortraits({
      vivienne: !!localStorage.getItem('vivienne_custom_portrait'),
      evangeline: !!localStorage.getItem('evangeline_custom_portrait'),
      valeria: !!localStorage.getItem('valeria_custom_portrait'),
    });
  };

  useEffect(() => {
    refreshPortraits();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerUpload = (target: 'vivienne' | 'evangeline' | 'valeria') => {
    setActiveUploadTarget(target);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        localStorage.setItem(`${activeUploadTarget}_custom_portrait`, dataUrl);
        refreshPortraits();
        soundManager.playSfx('sensual_chime');
        window.dispatchEvent(new Event(`${activeUploadTarget}_portrait_updated`));
      }
    };
    reader.readAsDataURL(file);
    // Reset value so same file can be re-selected if desired
    e.target.value = '';
  };

  const handleResetPortrait = (target: 'vivienne' | 'evangeline' | 'valeria') => {
    localStorage.removeItem(`${target}_custom_portrait`);
    refreshPortraits();
    soundManager.playSfx('click');
    window.dispatchEvent(new Event(`${target}_portrait_updated`));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-xl bg-[#0c0307] border border-rose-900/60 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-rose-950/60 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2 text-rose-300 font-cinzel font-bold text-base">
            <Sliders className="w-4 h-4 text-rose-500" />
            <span>Ayarlar & Yapılandırma</span>
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

        {/* Sliders Content */}
        <div className="p-6 space-y-6 text-xs overflow-y-auto">
          {/* Audio Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-cinzel font-bold border-b border-rose-950/60 pb-1">
              <Volume2 className="w-4 h-4" />
              <span>Ses ve Müzik (Statiksiz, Kristal Netliğinde)</span>
            </div>

            <div>
              <div className="flex justify-between text-stone-300 mb-1.5 font-medium">
                <span>Ana Ses (Master)</span>
                <span>%{Math.round(masterVolume * 100)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value), bgmVolume, sfxVolume)}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-stone-300 mb-1.5 font-medium items-center">
                <span>Müzik & Melodi (BGM)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onVolumeChange(masterVolume, bgmVolume > 0 ? 0 : 0.35, sfxVolume)}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                  >
                    {bgmVolume === 0 ? 'Müziği Aç' : 'Sustur'}
                  </button>
                  <span className="font-mono">%{Math.round(bgmVolume * 100)}</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bgmVolume}
                onChange={(e) => onVolumeChange(masterVolume, parseFloat(e.target.value), sfxVolume)}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-stone-300 mb-1.5 font-medium">
                <span>Ses Efektleri (SFX)</span>
                <span>%{Math.round(sfxVolume * 100)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => onVolumeChange(masterVolume, bgmVolume, parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Character Portraits Customization */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-cinzel font-bold border-b border-rose-950/60 pb-1">
              <ImageIcon className="w-4 h-4" />
              <span>Karakter Portresi Özelleştirme</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Lady Vivienne */}
            <div className="p-3 bg-black/50 border border-rose-950/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-cinzel text-xs text-rose-200 font-bold">
                    Lady Vivienne (Kırmızı Kadife Elbise)
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {portraits.vivienne ? 'Özel fotoğraf portresi aktif' : 'Varsayılan kırmızı kadife elbiseli klasik çizim'}
                  </div>
                </div>
                {portraits.vivienne && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Özel İmaj
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerUpload('vivienne')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-cinzel font-bold border border-rose-700/50 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{portraits.vivienne ? 'Görseli Değiştir' : 'İmaj Yükle'}</span>
                </button>
                {portraits.vivienne && (
                  <button
                    onClick={() => handleResetPortrait('vivienne')}
                    className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-rose-300 text-xs border border-stone-800 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sıfırla</span>
                  </button>
                )}
              </div>
            </div>

            {/* Evangeline */}
            <div className="p-3 bg-black/50 border border-purple-950/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-cinzel text-xs text-purple-200 font-bold">
                    Evangeline (Beyaz Dantel Gecelik)
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {portraits.evangeline ? 'Özel fotoğraf portresi aktif' : 'Varsayılan beyaz dantel gecelikli çizim'}
                  </div>
                </div>
                {portraits.evangeline && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Özel İmaj
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerUpload('evangeline')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-200 text-xs font-cinzel font-bold border border-purple-800/60 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{portraits.evangeline ? 'Görseli Değiştir' : 'İmaj Yükle'}</span>
                </button>
                {portraits.evangeline && (
                  <button
                    onClick={() => handleResetPortrait('evangeline')}
                    className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-purple-300 text-xs border border-stone-800 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sıfırla</span>
                  </button>
                )}
              </div>
            </div>

            {/* Valeria */}
            <div className="p-3 bg-black/50 border border-amber-950/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-cinzel text-xs text-amber-200 font-bold">
                    Valeria (Kılıçlı Kızıl Muhafız)
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {portraits.valeria ? 'Özel fotoğraf portresi aktif' : 'Varsayılan omuz zırhlı kılıçlı avcı çizimi'}
                  </div>
                </div>
                {portraits.valeria && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Özel İmaj
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerUpload('valeria')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-xs font-cinzel font-bold border border-amber-800/60 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{portraits.valeria ? 'Görseli Değiştir' : 'İmaj Yükle'}</span>
                </button>
                {portraits.valeria && (
                  <button
                    onClick={() => handleResetPortrait('valeria')}
                    className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-300 text-xs border border-stone-800 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sıfırla</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Gameplay & Text Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-cinzel font-bold border-b border-rose-950/60 pb-1">
              <Monitor className="w-4 h-4" />
              <span>Metin ve Oynanış</span>
            </div>

            <div>
              <div className="flex justify-between text-stone-300 mb-1.5 font-medium">
                <span>Metin Akış Hızı</span>
                <span>{textSpeed <= 15 ? 'Çok Hızlı' : textSpeed <= 30 ? 'Normal' : 'Yavaş'}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={textSpeed}
                onChange={(e) => onTextSpeedChange(parseInt(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-stone-300 mb-1.5 font-medium">
                <span>Otomatik Oynatma Bekleme Süresi</span>
                <span>{(autoPlayDelay / 1000).toFixed(1)} sn</span>
              </div>
              <input
                type="range"
                min="1500"
                max="6000"
                step="500"
                value={autoPlayDelay}
                onChange={(e) => onAutoPlayDelayChange(parseInt(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-rose-950/60 bg-black/40 flex justify-end">
          <button
            onClick={() => {
              soundManager.playSfx('click');
              onClose();
            }}
            className="px-5 py-2 rounded-lg text-xs font-cinzel font-bold bg-rose-800 hover:bg-rose-700 text-white transition-colors cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
