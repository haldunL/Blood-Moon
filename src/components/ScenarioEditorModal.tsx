/**
 * ScenarioEditorModal Component
 * Interactive visual novel sandbox where players can craft custom gothic erotic-horror scenes
 * and immediately test-play them in real-time!
 */

import React, { useState } from 'react';
import { CharacterId, CharacterExpression, BackgroundId, SfxType, AudioMood, StoryNode } from '../types/novel';
import { soundManager } from '../utils/audioSynthesizer';
import { X, Play, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPlayCustomScene: (node: StoryNode) => void;
}

export const ScenarioEditorModal: React.FC<Props> = ({ isOpen, onClose, onPlayCustomScene }) => {
  const [speaker, setSpeaker] = useState<CharacterId>('vivienne');
  const [expression, setExpression] = useState<CharacterExpression>('seductive');
  const [background, setBackground] = useState<BackgroundId>('crimson_parlor');
  const [audioMood, setAudioMood] = useState<AudioMood>('romance');
  const [sfx, setSfx] = useState<SfxType>('sensual_chime');
  const [text, setText] = useState<string>(
    'Bu şatoda geçirdiğimiz her saniye, kanımı daha da alevlendiriyor... Artık karanlığımdan kaçamayacağını sen de biliyorsun, değil mi Kont?'
  );

  // Custom Choices
  const [choiceA, setChoiceA] = useState<string>('Gözlerini ayırmadan ona doğru bir adım daha at.');
  const [choiceB, setChoiceB] = useState<string>('Tereddütle geriye çekilip gümüş hançerini kontrol et.');

  if (!isOpen) return null;

  const handleRunScene = () => {
    soundManager.playSfx('sensual_chime');

    const displayNameMap: Record<CharacterId, string> = {
      vivienne: 'Lady Vivienne',
      evangeline: 'Evangeline',
      valeria: 'Valeria',
      beatrice: 'Beatrice',
      morrigan: 'Morrigan',
      lenore: 'Lady Lenore',
      protagonist: 'Julian',
      narrator: 'Anlatıcı',
      shadow: 'Karanlık Gölge',
    };

    const customNode: StoryNode = {
      id: 'custom_scene_' + Date.now(),
      speaker,
      speakerDisplayName: displayNameMap[speaker] || 'Bilinmeyen',
      text,
      characterSprite:
        speaker !== 'narrator'
          ? {
              character: speaker,
              expression,
              position: 'center',
            }
          : undefined,
      background,
      audioMood,
      sfx,
      chapterTitle: 'Özel Sahne / Yaratıcı Mod',
      choices: [
        {
          id: 'custom_c1',
          text: choiceA,
          nextNodeId: 'start',
          effectDescription: 'Özel seçim 1 yapıldı.',
        },
        {
          id: 'custom_c2',
          text: choiceB,
          nextNodeId: 'start',
          effectDescription: 'Özel seçim 2 yapıldı.',
        },
      ],
    };

    onPlayCustomScene(customNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-[#0c0307] border border-rose-900/60 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-rose-950/60 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2 text-rose-300 font-cinzel font-bold text-base">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Senaryo & Sahne Editörü</span>
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

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Character & Expression */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-cinzel text-stone-300 font-bold mb-1.5">
                Konuşan Karakter
              </label>
              <select
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value as CharacterId)}
                className="w-full bg-black/60 border border-rose-900/50 rounded-lg p-2.5 text-rose-200 focus:outline-none focus:border-rose-500 font-sans"
              >
                <option value="vivienne">Lady Vivienne (Vampir Kontesi / Seductive)</option>
                <option value="evangeline">Evangeline (Kriptanın Gülü / Melankolik)</option>
                <option value="valeria">Valeria (Engizisyon Avcısı / Tutkulu)</option>
                <option value="beatrice">Beatrice (Şatonun Kahyası / İtaatkâr & Soğuk)</option>
                <option value="morrigan">Morrigan (Kulenin Simyacısı / Kara Okültist)</option>
                <option value="lenore">Lady Lenore (Aynaların Melankolik Hayaleti)</option>
                <option value="protagonist">Julian Ravenscroft (Başkarakter)</option>
                <option value="narrator">Anlatıcı</option>
                <option value="shadow">Kadim Gölge Varlığı</option>
              </select>
            </div>

            <div>
              <label className="block font-cinzel text-stone-300 font-bold mb-1.5">
                Yüz İfadesi & Duygu
              </label>
              <select
                value={expression}
                onChange={(e) => setExpression(e.target.value as CharacterExpression)}
                className="w-full bg-black/60 border border-rose-900/50 rounded-lg p-2.5 text-rose-200 focus:outline-none focus:border-rose-500 font-sans"
              >
                <option value="seductive">Baştan Çıkarıcı / Seductive (Tebessüm & Bakış)</option>
                <option value="blushing">Kızarmış / Blushing (Utangaç / Tensel)</option>
                <option value="yandere">Yandere / Takıntılı (Karanlık Bakış)</option>
                <option value="fear">Korku / Dehşet (Titreyen Gözler)</option>
                <option value="smile">Nazik Tebessüm</option>
                <option value="serious">Ciddi / Tetikte</option>
                <option value="neutral">Sakin / Nötr</option>
              </select>
            </div>
          </div>

          {/* Background & Atmosphere */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-cinzel text-stone-300 font-bold mb-1.5">
                Mekân & Arka Plan
              </label>
              <select
                value={background}
                onChange={(e) => setBackground(e.target.value as BackgroundId)}
                className="w-full bg-black/60 border border-rose-900/50 rounded-lg p-2.5 text-rose-200 focus:outline-none focus:border-rose-500 font-sans"
              >
                <option value="crimson_parlor">Kızıl Kadife Salon (Şömine & Şamdanlar)</option>
                <option value="gothic_castle">Ravenscroft Şatosu (Kızıl Ay & Sivri Kuleler)</option>
                <option value="crypt_chapel">Kripta Şapeli (Lahitler & Sivri Kemerler)</option>
                <option value="cathedral_altar">Katedral Sunağı (Kızıl Tutulma Rose Window)</option>
                <option value="rose_garden">Dikenli Gül Bahçesi & Sis</option>
                <option value="alchemist_tower">Simya Kulesi (Mor İksirler & Rünik Çember)</option>
                <option value="mirror_corridor">Aynalı Koridor (Buz Mavisi Hayalet Yolu)</option>
                <option value="servant_quarters">Hizmetkâr Dairesi (Loş Şamdan & Anahtarlar)</option>
                <option value="ending_dawn">Altın Şafak & Sisli Vadi</option>
              </select>
            </div>

            <div>
              <label className="block font-cinzel text-stone-300 font-bold mb-1.5">
                Müzik ve Ses Efekti
              </label>
              <div className="flex gap-2">
                <select
                  value={audioMood}
                  onChange={(e) => setAudioMood(e.target.value as AudioMood)}
                  className="w-1/2 bg-black/60 border border-rose-900/50 rounded-lg p-2 text-rose-200 focus:outline-none focus:border-rose-500 font-sans text-xs"
                >
                  <option value="romance">Romantik Ortam</option>
                  <option value="horror">Psikolojik Korku</option>
                  <option value="mystery">Gizemli Dron</option>
                  <option value="music_box">Hüzünlü Müzik Kutusu</option>
                </select>

                <select
                  value={sfx}
                  onChange={(e) => setSfx(e.target.value as SfxType)}
                  className="w-1/2 bg-black/60 border border-rose-900/50 rounded-lg p-2 text-rose-200 focus:outline-none focus:border-rose-500 font-sans text-xs"
                >
                  <option value="sensual_chime">Tensel Çan</option>
                  <option value="heartbeat">Kalp Atışı</option>
                  <option value="whisper">Karanlık Fısıltı</option>
                  <option value="thunder">Gök Gürültüsü</option>
                  <option value="horror_stinger">Korku Çığlığı</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dialogue Text */}
          <div>
            <label className="block font-cinzel text-stone-300 font-bold mb-1.5">
              Diyalog Metni
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full bg-black/60 border border-rose-900/50 rounded-lg p-3 text-sm font-serif-novel text-slate-100 focus:outline-none focus:border-rose-500 leading-relaxed"
              placeholder="Karakterin söyleyeceği repliği yazın..."
            />
          </div>

          {/* Interactive Choices to give to player */}
          <div className="space-y-2 pt-2 border-t border-rose-950/60">
            <label className="block font-cinzel text-stone-300 font-bold">
              Oyuncuya Sunulacak Karar Seçenekleri
            </label>
            <input
              type="text"
              value={choiceA}
              onChange={(e) => setChoiceA(e.target.value)}
              className="w-full bg-black/60 border border-rose-900/50 rounded-lg p-2 text-xs text-rose-100 focus:outline-none focus:border-rose-500"
              placeholder="1. Seçenek"
            />
            <input
              type="text"
              value={choiceB}
              onChange={(e) => setChoiceB(e.target.value)}
              className="w-full bg-black/60 border border-rose-900/50 rounded-lg p-2 text-xs text-rose-100 focus:outline-none focus:border-rose-500"
              placeholder="2. Seçenek"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-rose-950/60 bg-black/40 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-cinzel text-stone-400 hover:text-white"
          >
            İptal
          </button>
          <button
            onClick={handleRunScene}
            className="px-5 py-2 rounded-lg text-xs font-cinzel font-bold bg-rose-700 hover:bg-rose-600 text-white flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Sahneyi Canlandır ve Oyna
          </button>
        </div>
      </div>
    </div>
  );
};
