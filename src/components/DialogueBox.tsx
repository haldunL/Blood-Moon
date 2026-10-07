/**
 * DialogueBox Component
 * High-end Visual Novel dialogue container with typewriter text, nameplate, quick-menu, and choices
 */

import React, { useState, useEffect, useRef } from 'react';
import { StoryNode, ChoiceOption, CharacterId, GameStats } from '../types/novel';
import { soundManager } from '../utils/audioSynthesizer';
import { 
  Play, 
  FastForward, 
  BookOpen, 
  Save, 
  FolderOpen, 
  Settings, 
  Users, 
  Sparkles, 
  EyeOff,
  ChevronRight,
  Home,
  Mail,
  X,
  Briefcase
} from 'lucide-react';

interface Props {
  currentNode: StoryNode;
  onAdvance: () => void;
  onSelectChoice: (choice: ChoiceOption) => void;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
  isSkipMode: boolean;
  onToggleSkipMode: () => void;
  onOpenBacklog: () => void;
  onOpenSaveModal: (mode: 'save' | 'load') => void;
  onOpenSettings: () => void;
  onOpenCodex: () => void;
  onOpenGallery: () => void;
  onOpenInventory?: () => void;
  onReturnToTitle: () => void;
  textSpeed: number; // ms per char (e.g. 25ms)
  isUiHidden: boolean;
  onToggleHideUi: () => void;
  stats?: GameStats;
  canGoBack?: boolean;
  onStepPrevious?: () => void;
}

// Helper to strip out mechanical prefixes and all bracketed descriptors [...] for pure immersive dialogue
const formatCleanChoiceText = (text: string): string => {
  return text
    .replace(/^SEÇENEK\s+[A-Z0-9]+[:\s\-\]]*/gi, '')
    .replace(/^\[SEÇENEK\s+[A-Z0-9]+\][:\s\-]*/gi, '')
    .replace(/\[.*?\]/g, '') // strip any [bracketed] tags
    .replace(/^[\s\-–—:•]+/, '')
    .replace(/[\s\-–—:•]+$/, '')
    .trim();
};

export const DialogueBox: React.FC<Props> = ({
  currentNode,
  onAdvance,
  onSelectChoice,
  isAutoPlay,
  onToggleAutoPlay,
  isSkipMode,
  onToggleSkipMode,
  onOpenBacklog,
  onOpenSaveModal,
  onOpenSettings,
  onOpenCodex,
  onOpenGallery,
  onOpenInventory,
  onReturnToTitle,
  textSpeed,
  isUiHidden,
  onToggleHideUi,
  stats,
  canGoBack = false,
  onStepPrevious,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showLetterModal, setShowLetterModal] = useState<boolean>(true);
  const textIndexRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const fullText = currentNode.text;

  // Open letter modal automatically when node has letterModal
  useEffect(() => {
    if (currentNode.letterModal) {
      setShowLetterModal(true);
    }
  }, [currentNode.id]);

  // Clear typing interval helper
  const stopTypingInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Typewriter effect
  useEffect(() => {
    stopTypingInterval();
    textIndexRef.current = 0;

    if (isSkipMode) {
      setDisplayedText(fullText);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    const interval = window.setInterval(() => {
      if (textIndexRef.current < fullText.length) {
        textIndexRef.current += 1;
        setDisplayedText(fullText.slice(0, textIndexRef.current));
      } else {
        setIsTyping(false);
        stopTypingInterval();
      }
    }, Math.max(8, textSpeed));

    intervalRef.current = interval;

    return () => {
      stopTypingInterval();
    };
  }, [currentNode.id, fullText, textSpeed, isSkipMode]);

  // Click on dialogue box: finish typing or advance
  const handleBoxClick = () => {
    if (currentNode.choices && currentNode.choices.length > 0) {
      // If there are choices, finish typing
      if (isTyping) {
        stopTypingInterval();
        textIndexRef.current = fullText.length;
        setDisplayedText(fullText);
        setIsTyping(false);
        soundManager.playSfx('click');
      }
      return;
    }

    if (isTyping) {
      // If typing, immediately show full text and stop interval
      stopTypingInterval();
      textIndexRef.current = fullText.length;
      setDisplayedText(fullText);
      setIsTyping(false);
      soundManager.playSfx('click');
    } else {
      // If already finished typing, advance to next dialogue
      soundManager.playSfx('click');
      onAdvance();
    }
  };

  // Speaker nameplate color accents
  const getSpeakerStyle = (speaker: CharacterId | string) => {
    switch (speaker) {
      case 'vivienne':
      case 'shiori':
        return {
          bg: 'bg-rose-950/80 border-rose-600/70 text-rose-200',
          glow: 'shadow-[0_0_15px_rgba(225,29,72,0.4)]',
        };
      case 'evangeline':
      case 'aria':
        return {
          bg: 'bg-purple-950/80 border-purple-400/70 text-purple-200',
          glow: 'shadow-[0_0_15px_rgba(192,132,252,0.4)]',
        };
      case 'valeria':
      case 'karin':
        return {
          bg: 'bg-amber-950/80 border-amber-500/70 text-amber-200',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
        };
      case 'protagonist':
        return {
          bg: 'bg-slate-900/80 border-slate-500/70 text-slate-200',
          glow: 'shadow-[0_0_10px_rgba(148,163,184,0.3)]',
        };
      default:
        return {
          bg: 'bg-stone-900/80 border-stone-600/70 text-stone-300',
          glow: 'shadow-[0_0_10px_rgba(120,113,108,0.3)]',
        };
    }
  };

  if (isUiHidden) {
    return (
      <button
        onClick={onToggleHideUi}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/60 border border-red-500/40 text-red-300 hover:bg-black/90 transition-all backdrop-blur-md"
        title="Arayüzü Göster"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    );
  }

  const speakerStyle = getSpeakerStyle(currentNode.speaker);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-center pointer-events-none select-none pb-4 px-3 md:px-8">
      {/* Gothic Parchment Letter Modal */}
      {currentNode.letterModal && showLetterModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full max-w-xl p-6 md:p-8 rounded-lg bg-[#f7eed8] text-[#291102] border-4 border-[#78350f] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(185,28,28,0.3)] overflow-hidden">
            {/* Scorched paper texture & vignette overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(69,26,3,0.35)_100%)] pointer-events-none" />
            
            {/* Blood stains on parchment */}
            {currentNode.letterModal.bloodStained && (
              <>
                <div className="absolute top-2 right-4 w-12 h-12 rounded-full bg-[#7f1d1d]/40 blur-xs pointer-events-none" />
                <div className="absolute bottom-8 left-6 w-8 h-8 rounded-full bg-[#991b1b]/35 blur-xs pointer-events-none" />
                <div className="absolute top-1/2 right-12 w-6 h-10 rounded-full bg-[#450a0a]/30 blur-xs pointer-events-none" />
              </>
            )}

            {/* Letter Header with Wax Seal */}
            <div className="flex items-center justify-between border-b-2 border-[#b45309]/40 pb-3 mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#991b1b] border-2 border-[#fef08a] flex items-center justify-center shadow-lg">
                  <span className="font-cinzel text-xs font-bold text-[#fef08a]">R</span>
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-base md:text-lg text-[#451a03] tracking-wide">
                    {currentNode.letterModal.title}
                  </h3>
                  <p className="text-xs font-serif text-[#78350f] italic">
                    {currentNode.letterModal.sender}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playSfx('page_flip');
                  setShowLetterModal(false);
                }}
                className="p-1 rounded-full text-[#78350f] hover:text-[#451a03] hover:bg-[#b45309]/15 transition-colors cursor-pointer"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Letter Content (Shaky, cursive gothic handwriting) */}
            <div className="relative z-10 space-y-3 font-serif italic text-sm md:text-base leading-relaxed text-[#1c1917] max-h-[50vh] overflow-y-auto pr-2">
              {currentNode.letterModal.content.map((paragraph, idx) => (
                <p key={idx} className="indent-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Signature */}
            {currentNode.letterModal.signature && (
              <div className="relative z-10 mt-6 text-right font-cinzel font-semibold text-sm md:text-base text-[#7f1d1d] border-t border-[#b45309]/30 pt-3">
                {currentNode.letterModal.signature}
              </div>
            )}

            {/* Action button */}
            <div className="relative z-10 mt-6 flex justify-end">
              <button
                onClick={() => {
                  soundManager.playSfx('page_flip');
                  setShowLetterModal(false);
                }}
                className="px-5 py-2 rounded-md bg-[#78350f] hover:bg-[#451a03] text-[#fef3c7] font-cinzel text-xs tracking-wider uppercase font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                Mektubu Katla ve Devam Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branching Choices overlay */}
      {currentNode.choices && currentNode.choices.length > 0 && !isTyping && (
        <div className="w-full max-w-3xl mb-4 flex flex-col gap-2.5 pointer-events-auto animate-fade-in">
          {currentNode.choices.map((choice) => {
            const currentWillpower = stats?.willpower ?? stats?.sanity ?? 100;
            const currentMystery = stats?.mystery ?? 0;
            const currentFocus = stats?.focus ?? 0;
            const currentSanity = stats?.sanity ?? 100;

            const isWillpowerLocked = choice.requiredWillpower !== undefined && currentWillpower < choice.requiredWillpower;
            const isMysteryLocked = choice.requiredMystery !== undefined && currentMystery < choice.requiredMystery;
            const isFocusLocked = choice.requiredFocus !== undefined && currentFocus < choice.requiredFocus;
            const isSanityLocked = choice.requiredSanityMin !== undefined && currentSanity < choice.requiredSanityMin;
            const isLocked = isWillpowerLocked || isMysteryLocked || isFocusLocked || isSanityLocked;

            return (
              <button
                key={choice.id}
                disabled={isLocked}
                onClick={() => {
                  if (isLocked) return;
                  soundManager.playSfx('sensual_chime');
                  onSelectChoice(choice);
                }}
                className={`group relative w-full text-left p-4 rounded-xl border transition-all duration-300 backdrop-blur-md flex items-center justify-between ${
                  isLocked
                    ? 'bg-black/80 border-stone-800 text-stone-500 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-black/90 via-stone-950/90 to-black/90 border-rose-900/40 hover:border-rose-500 hover:shadow-[0_0_25px_rgba(225,29,72,0.35)] cursor-pointer'
                }`}
              >
                <div className="flex-1 pr-4">
                  {/* Stat check badges */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {choice.requiredWillpower !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isWillpowerLocked
                          ? 'bg-red-950/60 border-red-800 text-red-400'
                          : 'bg-cyan-950/60 border-cyan-700 text-cyan-300'
                      }`}>
                        {isWillpowerLocked ? '🔒 [İrade Yetersiz]' : `✨ [İrade ≥ ${choice.requiredWillpower}]`}
                      </span>
                    )}
                    {choice.requiredMystery !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isMysteryLocked
                          ? 'bg-red-950/60 border-red-800 text-red-400'
                          : 'bg-purple-950/60 border-purple-700 text-purple-300'
                      }`}>
                        {isMysteryLocked ? '🔒 [Gizem Yetersiz]' : `🔍 [Gizem ≥ ${choice.requiredMystery}]`}
                      </span>
                    )}
                    {choice.requiredFocus !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isFocusLocked
                          ? 'bg-red-950/60 border-red-800 text-red-400'
                          : 'bg-amber-950/60 border-amber-700 text-amber-300'
                      }`}>
                        {isFocusLocked ? '🔒 [Odak Yetersiz]' : `🔥 [Odak ≥ ${choice.requiredFocus}]`}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm md:text-base font-medium transition-colors ${
                    isLocked ? 'text-stone-400' : 'text-rose-100 group-hover:text-white'
                  }`}>
                    {formatCleanChoiceText(choice.text)}
                  </p>
                </div>
                <ChevronRight className={`w-5 h-5 transform transition-transform ${
                  isLocked ? 'text-stone-600' : 'text-rose-500 group-hover:translate-x-1'
                }`} />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Dialogue Box Container */}
      <div className="w-full max-w-4xl relative pointer-events-auto">
        {/* Nameplate */}
        {currentNode.speaker !== 'narrator' && (
          <div className="absolute -top-7 left-4 z-10">
            <div
              className={`px-5 py-1.5 rounded-t-lg border-t border-x backdrop-blur-md font-cinzel text-xs md:text-sm font-bold tracking-wider ${speakerStyle.bg} ${speakerStyle.glow}`}
            >
              {currentNode.speakerDisplayName}
            </div>
          </div>
        )}

        {/* Text Container Card */}
        <div
          onClick={handleBoxClick}
          className="relative min-h-[140px] md:min-h-[160px] p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[#14060c]/90 via-[#0a0206]/95 to-black/95 border border-rose-900/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-lg cursor-pointer transition-all hover:border-rose-700/60"
        >
          {/* Chapter indicator badge */}
          {currentNode.chapterTitle && (
            <div className="absolute top-2.5 right-4 text-[10px] uppercase font-cinzel tracking-widest text-rose-400/70">
              {currentNode.chapterTitle}
            </div>
          )}

          {/* Dialogue Text */}
          <div className="mt-1 font-serif-novel text-base md:text-xl leading-relaxed text-slate-100 tracking-wide pr-6">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-2 h-4 ml-1 bg-rose-500 animate-pulse" />
            )}
          </div>

          {/* Letter Re-read button if closed */}
          {currentNode.letterModal && !showLetterModal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('page_flip');
                setShowLetterModal(true);
              }}
              className="mt-3.5 px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/50 text-amber-200 text-xs font-cinzel flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              Mektubu Tekrar Oku & İncele
            </button>
          )}

          {/* Advance Prompt Indicator */}
          {!isTyping && !currentNode.isEnding && (!currentNode.choices || currentNode.choices.length === 0) && (
            <div className="absolute bottom-3 right-4 flex items-center text-rose-500 text-xs font-cinzel animate-bounce">
              <span className="mr-1">İlerle</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}

          {/* Ending Badge if final scene */}
          {currentNode.isEnding && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-rose-950/80 via-red-950/70 to-black/80 border border-rose-600/60 shadow-[0_0_20px_rgba(225,29,72,0.3)] flex flex-col gap-2">
              <span className="text-sm font-cinzel tracking-widest text-rose-300 font-bold uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                SON: {currentNode.endingTitle}
              </span>
              <p className="text-xs md:text-sm text-rose-100/90 font-serif-novel leading-relaxed">
                {currentNode.textEndingDescription || 'Hikayeyi tamamladınız! Yeni seçimlerle farklı bir son ve açılmamış sahneleri keşfedebilirsiniz.'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playSfx('click');
                    onReturnToTitle();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-cinzel text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  Ana Menüye Dön
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playSfx('sensual_chime');
                    onOpenGallery();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-black/60 hover:bg-rose-950 text-rose-200 border border-rose-800/50 font-cinzel text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  CG Galerisi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Navigation Bar */}
        <div className="w-full mt-2 px-2 flex flex-wrap items-center justify-between text-xs text-rose-300/80">
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Test Mode: Quick Undo Button */}
            {onStepPrevious && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canGoBack) {
                    onStepPrevious();
                  }
                }}
                disabled={!canGoBack}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 border ${
                  canGoBack
                    ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border-amber-500/70 shadow-[0_0_8px_rgba(245,158,11,0.3)] cursor-pointer'
                    : 'bg-black/30 text-stone-600 border-stone-800/30 cursor-not-allowed opacity-40'
                }`}
                title="Test: Bir sahne / seçim öncesine geri dön (Backspace / Z)"
              >
                <span>⏪</span>
                <span className="font-bold">Önceki</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('click');
                onToggleAutoPlay();
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 border ${
                isAutoPlay
                  ? 'bg-rose-600 text-white border-rose-400'
                  : 'bg-black/50 text-rose-300 border-rose-900/30 hover:bg-rose-950/60'
              }`}
            >
              <Play className="w-3 h-3" />
              Oto
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('click');
                onToggleSkipMode();
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 border ${
                isSkipMode
                  ? 'bg-amber-600 text-white border-amber-400'
                  : 'bg-black/50 text-rose-300 border-rose-900/30 hover:bg-rose-950/60'
              }`}
            >
              <FastForward className="w-3 h-3" />
              Geç
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('page_flip');
                onOpenBacklog();
              }}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 bg-black/50 text-rose-300 border border-rose-900/30 hover:bg-rose-950/60"
            >
              <BookOpen className="w-3 h-3" />
              Geçmiş
            </button>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 mt-1 sm:mt-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('click');
                onOpenSaveModal('save');
              }}
              className="px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 bg-black/50 text-rose-300 border border-rose-900/30 hover:bg-rose-950/60"
            >
              <Save className="w-3 h-3" />
              Kaydet
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('click');
                onOpenSaveModal('load');
              }}
              className="px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 bg-black/50 text-rose-300 border border-rose-900/30 hover:bg-rose-950/60"
            >
              <FolderOpen className="w-3 h-3" />
              Yükle
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('click');
                onOpenCodex();
              }}
              className="px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 bg-black/50 text-rose-300 border border-rose-900/30 hover:bg-rose-950/60"
              title="Karakterler"
            >
              <Users className="w-3 h-3" />
              Leydiler
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('sensual_chime');
                onOpenGallery();
              }}
              className="px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 bg-black/50 text-rose-300 border border-rose-900/30 hover:bg-rose-950/60"
              title="CG Galeri"
            >
              <Sparkles className="w-3 h-3" />
              Galeri
            </button>

            {onOpenInventory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playSfx('click');
                  onOpenInventory();
                }}
                className="px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 bg-rose-950/70 text-rose-200 border border-rose-700/50 hover:bg-rose-900/80 hover:text-white"
                title="Envanter & Yadigârlar (Kısayol: I veya E)"
              >
                <Briefcase className="w-3 h-3 text-rose-400" />
                <span>Envanter</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('click');
                onOpenSettings();
              }}
              className="p-1 rounded-md text-[11px] font-medium transition-colors bg-black/50 text-rose-300 border border-rose-900/30 hover:bg-rose-950/60"
              title="Ayarlar"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSfx('click');
                onReturnToTitle();
              }}
              className="px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 bg-rose-950/50 text-rose-300 border border-rose-800/40 hover:bg-rose-900/70 hover:text-white"
              title="Ana Menüye Dön"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ana Menü</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleHideUi();
              }}
              className="p-1 rounded-md text-[11px] font-medium transition-colors bg-black/50 text-rose-300 border border-rose-900/30 hover:bg-rose-950/60"
              title="Arayüzü Gizle"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
