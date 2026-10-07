/**
 * AnimeCharacterSprite component
 * Renders high-fidelity, expressive gothic-romantic anime visual novel character artwork with dynamic emotions.
 * Lady Vivienne Ravenscroft, Evangeline, Valeria, and Shadow.
 * Supports custom uploaded image portraits for Vivienne, Evangeline, and Valeria
 * (e.g. Woman_wearing_red_velvet_dress_4K, Woman_in_white_lace_nightgown_4K, Woman_holding_engraved_sword_4K)
 * with dedicated, high-detail vector artwork modeled directly after the user references.
 */

import React, { useState, useEffect } from 'react';
import { CharacterId, CharacterExpression } from '../types/novel';

interface Props {
  character: CharacterId;
  expression: CharacterExpression;
  position?: 'left' | 'center' | 'right';
  isSpeaking?: boolean;
  isPortrait?: boolean;
}

export const AnimeCharacterSprite: React.FC<Props> = ({
  character,
  expression,
  position = 'center',
  isSpeaking = false,
  isPortrait = false,
}) => {
  const [customVivienneImg, setCustomVivienneImg] = useState<string | null>(() => {
    return localStorage.getItem('vivienne_custom_portrait') || null;
  });
  const [vivienneImgError, setVivienneImgError] = useState(false);

  const [customEvangelineImg, setCustomEvangelineImg] = useState<string | null>(() => {
    return localStorage.getItem('evangeline_custom_portrait') || null;
  });
  const [evangelineImgError, setEvangelineImgError] = useState(false);

  const [customValeriaImg, setCustomValeriaImg] = useState<string | null>(() => {
    return localStorage.getItem('valeria_custom_portrait') || null;
  });
  const [valeriaImgError, setValeriaImgError] = useState(false);

  const [customBeatriceImg, setCustomBeatriceImg] = useState<string | null>(() => {
    return localStorage.getItem('beatrice_custom_portrait') || null;
  });
  const [beatriceImgError, setBeatriceImgError] = useState(false);

  const [customJulianImg, setCustomJulianImg] = useState<string | null>(() => {
    return localStorage.getItem('protagonist_custom_portrait') || localStorage.getItem('julian_custom_portrait') || null;
  });
  const [julianImgError, setJulianImgError] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setCustomVivienneImg(localStorage.getItem('vivienne_custom_portrait') || null);
      setVivienneImgError(false);
      setCustomEvangelineImg(localStorage.getItem('evangeline_custom_portrait') || null);
      setEvangelineImgError(false);
      setCustomValeriaImg(localStorage.getItem('valeria_custom_portrait') || null);
      setValeriaImgError(false);
      setCustomBeatriceImg(localStorage.getItem('beatrice_custom_portrait') || null);
      setBeatriceImgError(false);
      setCustomJulianImg(localStorage.getItem('protagonist_custom_portrait') || localStorage.getItem('julian_custom_portrait') || null);
      setJulianImgError(false);
    };

    window.addEventListener('vivienne_portrait_updated', handleUpdate);
    window.addEventListener('evangeline_portrait_updated', handleUpdate);
    window.addEventListener('valeria_portrait_updated', handleUpdate);
    window.addEventListener('beatrice_portrait_updated', handleUpdate);
    window.addEventListener('protagonist_portrait_updated', handleUpdate);
    window.addEventListener('julian_portrait_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('vivienne_portrait_updated', handleUpdate);
      window.removeEventListener('evangeline_portrait_updated', handleUpdate);
      window.removeEventListener('valeria_portrait_updated', handleUpdate);
      window.removeEventListener('beatrice_portrait_updated', handleUpdate);
      window.removeEventListener('protagonist_portrait_updated', handleUpdate);
      window.removeEventListener('julian_portrait_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (character === 'narrator') {
    return null;
  }

  // Positioning classes
  const posClass =
    position === 'left'
      ? 'left-8 md:left-24'
      : position === 'right'
      ? 'right-8 md:right-24'
      : 'left-1/2 -translate-x-1/2';

  const glowColor =
    character === 'evangeline'
      ? 'rgba(168, 85, 247, 0.5)'
      : character === 'valeria'
      ? 'rgba(245, 158, 11, 0.5)'
      : character === 'beatrice'
      ? 'rgba(16, 185, 129, 0.5)'
      : character === 'morrigan'
      ? 'rgba(139, 92, 246, 0.5)'
      : character === 'lenore'
      ? 'rgba(56, 189, 248, 0.55)'
      : character === 'protagonist'
      ? 'rgba(14, 165, 233, 0.55)'
      : 'rgba(220, 38, 38, 0.45)';

  return (
    <div
      className={
        isPortrait
          ? "relative w-full h-full pointer-events-none select-none flex items-center justify-center overflow-hidden"
          : `absolute bottom-0 z-20 pointer-events-none transition-all duration-500 ease-out select-none flex flex-col items-center justify-end ${posClass}`
      }
      style={{
        height: isPortrait ? '100%' : '92vh',
        width: isPortrait ? '100%' : 'min(540px, 95vw)',
        filter: isSpeaking
          ? `drop-shadow(0 0 25px ${glowColor})`
          : 'brightness(0.88) drop-shadow(0 0 15px rgba(0, 0, 0, 0.7))',
      }}
    >
      <div
        className={`w-full h-full relative flex items-center justify-center transition-transform duration-700 ${
          isSpeaking ? (isPortrait ? 'scale-[1.01]' : 'scale-[1.02] translate-y-[-4px]') : 'scale-100'
        } ${expression === 'fear' ? 'horror-glitch' : ''}`}
      >
        {/* Julian (Protagonist) */}
        {character === 'protagonist' && (
          <>
            {customJulianImg && !julianImgError ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={customJulianImg}
                  alt="Julian Ravenscroft"
                  referrerPolicy="no-referrer"
                  className={
                    isPortrait
                      ? `w-full h-full object-cover object-top filter drop-shadow-[0_10px_35px_rgba(14,165,233,0.45)] transition-all duration-300 ${
                          expression === 'yandere' ? 'contrast-125 saturate-150 drop-shadow-[0_0_30px_rgba(14,165,233,0.8)]' : ''
                        } ${expression === 'blushing' ? 'brightness-105' : ''}`
                      : `h-full max-h-[90vh] w-auto object-contain filter drop-shadow-[0_10px_35px_rgba(14,165,233,0.45)] transition-all duration-300 ${
                          expression === 'yandere' ? 'contrast-125 saturate-150 drop-shadow-[0_0_30px_rgba(14,165,233,0.8)]' : ''
                        } ${expression === 'blushing' ? 'brightness-105' : ''}`
                  }
                  onError={() => setJulianImgError(true)}
                />
                {expression === 'blushing' && (
                  <div className="absolute top-[28%] w-36 h-12 bg-sky-500/25 blur-xl rounded-full pointer-events-none" />
                )}
                {expression === 'yandere' && (
                  <div className="absolute inset-0 bg-sky-950/25 mix-blend-color-burn pointer-events-none" />
                )}
              </div>
            ) : (
              <JulianSprite expression={expression} isPortrait={isPortrait} />
            )}
          </>
        )}
        {/* Lady Vivienne */}
        {character === 'vivienne' && (
          <>
            {customVivienneImg && !vivienneImgError ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={customVivienneImg}
                  alt="Lady Vivienne Ravenscroft"
                  referrerPolicy="no-referrer"
                  className={
                    isPortrait
                      ? `w-full h-full object-cover object-top filter drop-shadow-[0_10px_35px_rgba(225,29,72,0.45)] transition-all duration-300 ${
                          expression === 'yandere' ? 'contrast-125 saturate-150 drop-shadow-[0_0_30px_rgba(225,29,72,0.8)]' : ''
                        } ${expression === 'blushing' ? 'brightness-105' : ''}`
                      : `h-full max-h-[90vh] w-auto object-contain filter drop-shadow-[0_10px_35px_rgba(225,29,72,0.45)] transition-all duration-300 ${
                          expression === 'yandere' ? 'contrast-125 saturate-150 drop-shadow-[0_0_30px_rgba(225,29,72,0.8)]' : ''
                        } ${expression === 'blushing' ? 'brightness-105' : ''}`
                  }
                  onError={() => setVivienneImgError(true)}
                />
                {expression === 'blushing' && (
                  <div className="absolute top-[28%] w-36 h-12 bg-rose-500/30 blur-xl rounded-full pointer-events-none" />
                )}
                {expression === 'yandere' && (
                  <div className="absolute inset-0 bg-red-950/25 mix-blend-color-burn pointer-events-none" />
                )}
              </div>
            ) : (
              <VivienneSprite expression={expression} isPortrait={isPortrait} />
            )}
          </>
        )}

        {/* Evangeline */}
        {character === 'evangeline' && (
          <>
            {customEvangelineImg && !evangelineImgError ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={customEvangelineImg}
                  alt="Evangeline"
                  referrerPolicy="no-referrer"
                  className={
                    isPortrait
                      ? `w-full h-full object-cover object-top filter drop-shadow-[0_10px_35px_rgba(168,85,247,0.45)] transition-all duration-300 ${
                          expression === 'fear' ? 'contrast-120 saturate-75 brightness-95' : ''
                        } ${expression === 'blushing' ? 'brightness-105' : ''}`
                      : `h-full max-h-[90vh] w-auto object-contain filter drop-shadow-[0_10px_35px_rgba(168,85,247,0.45)] transition-all duration-300 ${
                          expression === 'fear' ? 'contrast-120 saturate-75 brightness-95' : ''
                        } ${expression === 'blushing' ? 'brightness-105' : ''}`
                  }
                  onError={() => setEvangelineImgError(true)}
                />
                {expression === 'blushing' && (
                  <div className="absolute top-[28%] w-36 h-12 bg-pink-500/30 blur-xl rounded-full pointer-events-none" />
                )}
                {expression === 'fear' && (
                  <div className="absolute inset-0 bg-indigo-950/25 mix-blend-color-burn pointer-events-none" />
                )}
              </div>
            ) : (
              <EvangelineSprite expression={expression} isPortrait={isPortrait} />
            )}
          </>
        )}

        {/* Valeria */}
        {character === 'valeria' && (
          <>
            {customValeriaImg && !valeriaImgError ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={customValeriaImg}
                  alt="Valeria"
                  referrerPolicy="no-referrer"
                  className={
                    isPortrait
                      ? `w-full h-full object-cover object-top filter drop-shadow-[0_10px_35px_rgba(245,158,11,0.45)] transition-all duration-300 ${
                          expression === 'blushing' ? 'brightness-105' : ''
                        } ${expression === 'serious' ? 'contrast-115' : ''}`
                      : `h-full max-h-[92vh] w-auto object-contain filter drop-shadow-[0_10px_35px_rgba(245,158,11,0.45)] transition-all duration-300 ${
                          expression === 'blushing' ? 'brightness-105' : ''
                        } ${expression === 'serious' ? 'contrast-115' : ''}`
                  }
                  onError={() => setValeriaImgError(true)}
                />
                {expression === 'blushing' && (
                  <div className="absolute top-[28%] w-36 h-12 bg-amber-500/25 blur-xl rounded-full pointer-events-none" />
                )}
              </div>
            ) : (
              <ValeriaSprite expression={expression} isPortrait={isPortrait} />
            )}
          </>
        )}

        {/* Beatrice */}
        {character === 'beatrice' && (
          <>
            {customBeatriceImg && !beatriceImgError ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={customBeatriceImg}
                  alt="Beatrice"
                  referrerPolicy="no-referrer"
                  className={
                    isPortrait
                      ? `w-full h-full object-cover object-top filter drop-shadow-[0_10px_35px_rgba(16,185,129,0.45)] transition-all duration-300 ${
                          expression === 'yandere' ? 'contrast-125 saturate-125 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]' : ''
                        } ${expression === 'blushing' ? 'brightness-105' : ''}`
                      : `h-full max-h-[92vh] w-auto object-contain filter drop-shadow-[0_10px_35px_rgba(16,185,129,0.45)] transition-all duration-300 ${
                          expression === 'yandere' ? 'contrast-125 saturate-125 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]' : ''
                        } ${expression === 'blushing' ? 'brightness-105' : ''}`
                  }
                  onError={() => setBeatriceImgError(true)}
                />
                {expression === 'blushing' && (
                  <div className="absolute top-[28%] w-36 h-12 bg-rose-500/25 blur-xl rounded-full pointer-events-none" />
                )}
                {expression === 'yandere' && (
                  <div className="absolute inset-0 bg-emerald-950/20 mix-blend-color-burn pointer-events-none" />
                )}
              </div>
            ) : (
              <BeatriceSprite expression={expression} isPortrait={isPortrait} />
            )}
          </>
        )}

        {/* Morrigan */}
        {character === 'morrigan' && (
          <MorriganSprite expression={expression} isPortrait={isPortrait} />
        )}

        {/* Lady Lenore */}
        {character === 'lenore' && (
          <LenoreSprite expression={expression} isPortrait={isPortrait} />
        )}

        {character === 'shadow' && <ShadowSprite expression={expression} />}
      </div>
    </div>
  );
};

/**
 * JULIAN RAVENSCROFT - The Noble Protagonist & Gothic Investigator
 * Striking midnight-blue Victorian tailored tailcoat, velvet lapels, silver pocket-watch chain,
 * crisp white wing collar, pleated silk ascot cravat pinned with the Ravenscroft sapphire crest brooch,
 * alabaster skin, handsome anime features, expressive sapphire eyes, and textured wavy dark hair.
 */
const JulianSprite: React.FC<{ expression: CharacterExpression; isPortrait?: boolean }> = ({
  expression,
  isPortrait = false,
}) => {
  return (
    <svg
      viewBox={isPortrait ? "60 95 380 430" : "0 0 500 700"}
      className="w-full h-full object-contain filter drop-shadow-2xl"
      preserveAspectRatio={isPortrait ? "xMidYMid meet" : "xMidYMax meet"}
    >
      <defs>
        {/* Hair Gradients */}
        <linearGradient id="julianHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="35%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="julianHairBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="julianHairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </linearGradient>

        {/* Noble Aristocratic Skin */}
        <linearGradient id="julianSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffdfa" />
          <stop offset="60%" stopColor="#f8ede3" />
          <stop offset="100%" stopColor="#ebd3c5" />
        </linearGradient>
        <linearGradient id="julianSkinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dfbeb0" />
          <stop offset="100%" stopColor="#cca292" />
        </linearGradient>

        {/* Midnight Victorian Tailcoat */}
        <linearGradient id="julianCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="45%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
        <linearGradient id="julianLapelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Damask Patterned Waistcoat */}
        <linearGradient id="julianVestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#293548" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Shirt & Pleated Cravat */}
        <linearGradient id="julianShirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="julianCravatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Piercing Sapphire Eyes */}
        <radialGradient id="julianSapphireEye" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="65%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#082f49" />
        </radialGradient>
        <radialGradient id="julianBroochGem" cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="40%" stopColor="#38bdf8" />
          <stop offset="85%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#082f49" />
        </radialGradient>
        <radialGradient id="julianYandereAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="65%" stopColor="#0284c7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="julianSilverMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e2e8f0" />
          <stop offset="80%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="julianDarkShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#0f172a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Back Hair Volume behind Neck and Shoulders */}
      <g>
        <path
          d="M175,180 C160,250 165,320 185,360 L315,360 C335,320 340,250 325,180 Z"
          fill="url(#julianHairBackGrad)"
        />
        <path
          d="M170,220 C155,270 165,335 180,365 C175,340 170,300 175,250 Z"
          fill="url(#julianHairGrad)"
        />
        <path
          d="M330,220 C345,270 335,335 320,365 C325,340 330,300 325,250 Z"
          fill="url(#julianHairGrad)"
        />
      </g>

      {/* Dark Victorian Tailcoat (Base Body) */}
      <g>
        {/* Tailcoat silhouette */}
        <path
          d="M100,410 C140,380 200,370 250,370 C300,370 360,380 400,410 L435,700 L65,700 Z"
          fill="url(#julianCoatGrad)"
        />
        {/* Coat Seam & Structure Lines */}
        <path
          d="M165,410 Q195,490 180,700 M335,410 Q305,490 320,700"
          stroke="#070d18"
          strokeWidth="3"
          fill="none"
          opacity="0.8"
        />

        {/* Waistcoat / Brocade Vest */}
        <path
          d="M205,372 L295,372 L312,545 L250,575 L188,545 Z"
          fill="url(#julianVestGrad)"
        />
        {/* Vest button seam */}
        <path d="M250,375 L250,570" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 3" />
        {/* Double-breasted Antique Silver Buttons */}
        <circle cx="236" cy="425" r="4.5" fill="url(#julianSilverMetal)" stroke="#334155" strokeWidth="1" />
        <circle cx="264" cy="425" r="4.5" fill="url(#julianSilverMetal)" stroke="#334155" strokeWidth="1" />
        <circle cx="236" cy="460" r="4.5" fill="url(#julianSilverMetal)" stroke="#334155" strokeWidth="1" />
        <circle cx="264" cy="460" r="4.5" fill="url(#julianSilverMetal)" stroke="#334155" strokeWidth="1" />
        <circle cx="236" cy="495" r="4.5" fill="url(#julianSilverMetal)" stroke="#334155" strokeWidth="1" />
        <circle cx="264" cy="495" r="4.5" fill="url(#julianSilverMetal)" stroke="#334155" strokeWidth="1" />

        {/* Draped Silver Pocket Watch Chain */}
        <path
          d="M236,460 Q215,488 198,480"
          stroke="url(#julianSilverMetal)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="198" cy="480" r="3" fill="#cbd5e1" />

        {/* Structured Peaked Notch Lapels */}
        {/* Left Lapel */}
        <path
          d="M170,372 L205,372 L225,485 L180,445 L150,410 Z"
          fill="url(#julianLapelGrad)"
          stroke="#475569"
          strokeWidth="1.2"
        />
        {/* Right Lapel */}
        <path
          d="M330,372 L295,372 L275,485 L320,445 L350,410 Z"
          fill="url(#julianLapelGrad)"
          stroke="#475569"
          strokeWidth="1.2"
        />
        {/* Silver Edge Piping on Lapels */}
        <path d="M170,372 L205,372 L225,485" stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.75" />
        <path d="M330,372 L295,372 L275,485" stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.75" />

        {/* Silver Runed Dagger Grip at Belt (Hero's Weapon) */}
        <g opacity="0.95">
          <rect x="142" y="475" width="8" height="42" rx="3" fill="#1e293b" transform="rotate(-18 142 475)" stroke="#64748b" strokeWidth="1" />
          <path d="M130,478 L160,470" stroke="url(#julianSilverMetal)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="152" cy="515" r="5" fill="url(#julianSilverMetal)" stroke="#334155" strokeWidth="1" />
          <circle cx="152" cy="515" r="2" fill="#38bdf8" />
        </g>
      </g>

      {/* Neck & Clavicle Area */}
      <g>
        {/* Neck Base */}
        <path
          d="M222,290 L278,290 L276,355 L224,355 Z"
          fill="url(#julianSkinGrad)"
        />
        {/* Shadow beneath jawline */}
        <path
          d="M222,290 C235,315 265,315 278,290 L276,310 C265,328 235,328 224,310 Z"
          fill="url(#julianSkinShadow)"
        />
        {/* Adam's apple subtle anatomical highlight */}
        <path d="M250,318 L248,326 L252,326" stroke="#cca292" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />

        {/* Victorian White Wing Collar */}
        {/* Left Collar Wing */}
        <path
          d="M210,332 L225,376 L250,376 L236,336 Z"
          fill="url(#julianShirtGrad)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        {/* Right Collar Wing */}
        <path
          d="M290,332 L275,376 L250,376 L264,336 Z"
          fill="url(#julianShirtGrad)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        {/* Pleated Silk Ascot / Cravat */}
        <path
          d="M226,350 L274,350 L270,372 L230,372 Z"
          fill="url(#julianCravatGrad)"
          stroke="#94a3b8"
          strokeWidth="1"
        />
        {/* Cascading Cravat Drapery */}
        <path
          d="M230,368 L270,368 L278,448 L250,465 L222,448 Z"
          fill="url(#julianCravatGrad)"
          stroke="#94a3b8"
          strokeWidth="1.2"
        />
        {/* Cravat Pleats */}
        <path d="M240,372 L238,446" stroke="#94a3b8" strokeWidth="1.5" opacity="0.8" />
        <path d="M250,372 L250,458" stroke="#94a3b8" strokeWidth="1.8" opacity="0.8" />
        <path d="M260,372 L262,446" stroke="#94a3b8" strokeWidth="1.5" opacity="0.8" />

        {/* Ravenscroft Heirloom Sapphire Brooch Pin */}
        <g>
          {/* Silver filigree mount */}
          <rect x="241" y="380" width="18" height="18" rx="4" fill="url(#julianSilverMetal)" stroke="#334155" strokeWidth="1.2" transform="rotate(45 250 389)" />
          {/* Glowing sapphire gem */}
          <circle cx="250" cy="389" r="6" fill="url(#julianBroochGem)" />
          {/* Specular sparkle */}
          <circle cx="248" cy="387" r="1.8" fill="#ffffff" />
          <circle cx="252" cy="391" r="0.9" fill="#e0f2fe" />
        </g>
      </g>

      {/* Head, Handsome Jawline & Ears */}
      <g>
        {/* Left Ear */}
        <path
          d="M192,230 C182,230 180,265 192,275 C195,268 194,245 192,230 Z"
          fill="url(#julianSkinGrad)"
          stroke="#dfbeb0"
          strokeWidth="1.2"
        />
        <path d="M188,245 C186,252 188,260 191,265" stroke="#cca292" strokeWidth="1" fill="none" />

        {/* Right Ear */}
        <path
          d="M308,230 C318,230 320,265 308,275 C305,268 306,245 308,230 Z"
          fill="url(#julianSkinGrad)"
          stroke="#dfbeb0"
          strokeWidth="1.2"
        />
        <path d="M312,245 C314,252 312,260 309,265" stroke="#cca292" strokeWidth="1" fill="none" />

        {/* Handsome Sculpted Anime Face */}
        <path
          d="M188,195 C188,300 220,350 250,350 C280,350 312,300 312,195 Z"
          fill="url(#julianSkinGrad)"
          stroke="#dfbeb0"
          strokeWidth="1.2"
        />

        {/* Chin & Jaw contour lines */}
        <path
          d="M225,325 C235,342 245,348 250,348 C255,348 265,342 275,325"
          stroke="#dfbeb0"
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
        />
      </g>

      {/* Facial Features: Dynamic Eyes, Nose, Mouth, and Expressions */}
      <g>
        {/* Anime Nose */}
        <path
          d="M250,238 L248,265 L254,265"
          stroke="#a87f6e"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="251" cy="265" r="0.8" fill="#7c5746" />

        {/* Eyebrows (Responsive to Expression) */}
        {expression === 'serious' ? (
          <g>
            <path d="M200,224 Q220,214 240,227" stroke="#0f172a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M260,227 Q280,214 300,224" stroke="#0f172a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            {/* Furrow wrinkle */}
            <path d="M246,218 L246,225" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M254,218 L254,225" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ) : expression === 'smile' ? (
          <g>
            <path d="M202,216 Q222,210 238,217" stroke="#0f172a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M262,217 Q278,210 298,216" stroke="#0f172a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </g>
        ) : expression === 'fear' ? (
          <g>
            <path d="M202,212 Q222,220 238,214" stroke="#0f172a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M262,214 Q278,220 298,212" stroke="#0f172a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </g>
        ) : expression === 'seductive' ? (
          <g>
            <path d="M202,214 Q222,208 238,215" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M262,218 Q278,212 298,219" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ) : expression === 'blushing' ? (
          <g>
            <path d="M203,218 Q222,214 238,220" stroke="#0f172a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M262,220 Q278,214 297,218" stroke="#0f172a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </g>
        ) : expression === 'yandere' ? (
          <g>
            <path d="M200,225 Q220,215 240,228" stroke="#020617" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            <path d="M260,228 Q280,215 300,225" stroke="#020617" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          /* Neutral / Focused */
          <g>
            <path d="M202,218 Q222,212 238,219" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M262,219 Q278,212 298,218" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* Eyes: Left Eye (Viewer's Left, x ~ 222) */}
        <g>
          {/* Eye Sclera */}
          <path
            d="M207,242 C209,232 232,232 237,242 C234,251 210,251 207,242 Z"
            fill="#ffffff"
          />
          {/* Sapphire Iris */}
          <ellipse cx="223" cy="242" rx={expression === 'fear' ? 6 : 8.5} ry={expression === 'fear' ? 8 : 10.5} fill="url(#julianSapphireEye)" />
          {/* Pupil */}
          <ellipse cx="223" cy="242" rx={expression === 'fear' ? 2.5 : 4} ry={expression === 'fear' ? 3.5 : 5} fill="#020617" />
          {/* Yandere pupil glow */}
          {expression === 'yandere' && (
            <circle cx="223" cy="242" r="10" fill="url(#julianYandereAura)" />
          )}
          {/* Specular Highlights */}
          <circle cx="226" cy="238" r="2.8" fill="#ffffff" />
          <circle cx="219" cy="245" r="1.4" fill="#bae6fd" />

          {/* Upper Eyelash line with anime corner flick */}
          <path
            d="M204,242 C210,230 234,230 240,242"
            stroke="#090d16"
            strokeWidth={expression === 'seductive' ? '3.5' : '3'}
            fill="none"
            strokeLinecap="round"
          />
          <path d="M208,247 C215,252 230,252 236,247" stroke="#334155" strokeWidth="1.2" fill="none" opacity="0.6" />
          {/* Double eyelid crease */}
          <path d="M211,230 Q223,227 235,231" stroke="#a87f6e" strokeWidth="1.2" fill="none" opacity="0.75" />
        </g>

        {/* Eyes: Right Eye (Viewer's Right, x ~ 277) */}
        <g>
          {/* Eye Sclera */}
          <path
            d="M263,242 C266,232 289,232 293,242 C290,251 266,251 263,242 Z"
            fill="#ffffff"
          />
          {/* Sapphire Iris */}
          <ellipse cx="277" cy="242" rx={expression === 'fear' ? 6 : 8.5} ry={expression === 'fear' ? 8 : 10.5} fill="url(#julianSapphireEye)" />
          {/* Pupil */}
          <ellipse cx="277" cy="242" rx={expression === 'fear' ? 2.5 : 4} ry={expression === 'fear' ? 3.5 : 5} fill="#020617" />
          {/* Yandere pupil glow */}
          {expression === 'yandere' && (
            <circle cx="277" cy="242" r="10" fill="url(#julianYandereAura)" />
          )}
          {/* Specular Highlights */}
          <circle cx="280" cy="238" r="2.8" fill="#ffffff" />
          <circle cx="273" cy="245" r="1.4" fill="#bae6fd" />

          {/* Upper Eyelash line with anime corner flick */}
          <path
            d="M260,242 C266,230 290,230 296,242"
            stroke="#090d16"
            strokeWidth={expression === 'seductive' ? '3.5' : '3'}
            fill="none"
            strokeLinecap="round"
          />
          <path d="M264,247 C270,252 285,252 292,247" stroke="#334155" strokeWidth="1.2" fill="none" opacity="0.6" />
          {/* Double eyelid crease */}
          <path d="M265,231 Q277,227 289,230" stroke="#a87f6e" strokeWidth="1.2" fill="none" opacity="0.75" />
        </g>

        {/* Mouth (Responsive to Expression) */}
        {expression === 'smile' ? (
          <g>
            {/* Handsome confident smirk */}
            <path d="M241,296 Q250,293 261,291" stroke="#7c5746" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M247,301 Q251,303 255,301" stroke="#a87f6e" strokeWidth="1.5" fill="none" />
          </g>
        ) : expression === 'serious' ? (
          <g>
            {/* Resolute straight line */}
            <path d="M239,296 L261,296" stroke="#684232" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M246,301 Q250,303 254,301" stroke="#a87f6e" strokeWidth="1.5" fill="none" />
          </g>
        ) : expression === 'seductive' ? (
          <g>
            {/* Alluring, parted smirk */}
            <path d="M240,295 Q250,291 261,289" stroke="#7c5746" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M244,297 Q251,301 258,294" stroke="#7c5746" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M247,303 Q251,305 255,303" stroke="#a87f6e" strokeWidth="1.5" fill="none" />
          </g>
        ) : expression === 'fear' ? (
          <g>
            {/* Shocked parted mouth */}
            <ellipse cx="250" cy="296" rx="6" ry="4" fill="#3f1d24" stroke="#7c5746" strokeWidth="1.8" />
            <path d="M246,295 L254,295" stroke="#f1f5f9" strokeWidth="1.5" />
          </g>
        ) : expression === 'blushing' ? (
          <g>
            {/* Awkward bashful mouth */}
            <path d="M243,296 Q249,299 257,295" stroke="#7c5746" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M248,301 Q251,303 254,301" stroke="#a87f6e" strokeWidth="1.2" fill="none" />
          </g>
        ) : expression === 'yandere' ? (
          <g>
            {/* Sinister wry grin */}
            <path d="M237,292 Q250,305 263,292" stroke="#451a03" strokeWidth="2.6" fill="#1c0a00" strokeLinecap="round" />
            <path d="M241,294 Q250,298 259,294" stroke="#f8fafc" strokeWidth="1.5" fill="none" />
          </g>
        ) : (
          /* Neutral */
          <g>
            <path d="M241,295 Q250,293 259,295" stroke="#7c5746" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M247,300 Q250,302 253,300" stroke="#a87f6e" strokeWidth="1.5" fill="none" opacity="0.8" />
          </g>
        )}

        {/* Expression Effects Overlays */}
        {/* Blushing: Rosy glow + anime blush hatches */}
        {expression === 'blushing' && (
          <g>
            <ellipse cx="218" cy="258" rx="14" ry="6" fill="#f43f5e" opacity="0.35" filter="blur(2px)" />
            <ellipse cx="282" cy="258" rx="14" ry="6" fill="#f43f5e" opacity="0.35" filter="blur(2px)" />
            <path d="M211,257 L216,253 M217,258 L222,254 M223,257 L228,253" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M272,257 L277,253 M278,258 L283,254 M284,257 L289,253" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* Fear: Tension vertical lines + sweat drop */}
        {expression === 'fear' && (
          <g>
            {/* Blue shock lines */}
            <path d="M205,215 L205,232 M212,213 L212,235 M288,213 L288,235 M295,215 L295,232" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            {/* Sweat droplet */}
            <path d="M298,225 C298,222 303,222 303,225 C303,229 298,229 298,225 Z" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />
          </g>
        )}

        {/* Yandere: Forehead dark shadow */}
        {expression === 'yandere' && (
          <path
            d="M188,195 L312,195 L308,245 C280,255 220,255 192,245 Z"
            fill="url(#julianDarkShadowGrad)"
          />
        )}
      </g>

      {/* Layered Textured Dark Victorian Hair & Bangs */}
      <g>
        {/* Main Hair Crown & Volume */}
        <path
          d="M175,190 C162,115 215,65 250,65 C285,65 338,115 325,190 C340,165 348,220 338,255 C330,230 332,190 320,180 C310,140 295,120 250,120 C205,120 190,140 180,180 C168,190 170,230 162,255 C152,220 160,165 175,190 Z"
          fill="url(#julianHairGrad)"
        />

        {/* Left Side-burn lock framing face */}
        <path
          d="M175,185 C168,215 172,250 182,275 C186,255 182,225 186,195 Z"
          fill="url(#julianHairGrad)"
          stroke="#090d16"
          strokeWidth="1"
        />

        {/* Right Side-burn lock framing face */}
        <path
          d="M325,185 C332,215 328,250 318,275 C314,255 318,225 314,195 Z"
          fill="url(#julianHairGrad)"
          stroke="#090d16"
          strokeWidth="1"
        />

        {/* Stylish Center-Parted Wavy Bangs dipping across forehead */}
        {/* Left Bang */}
        <path
          d="M246,118 C232,145 208,175 192,205 C204,185 224,165 235,145 C240,135 244,125 246,118 Z"
          fill="url(#julianHairGrad)"
        />
        {/* Left Center Lock dipping between eyes */}
        <path
          d="M248,118 C244,150 236,185 243,218 C247,192 251,165 252,135 Z"
          fill="url(#julianHairGrad)"
        />

        {/* Right Bang */}
        <path
          d="M254,118 C268,145 292,175 308,205 C296,185 276,165 265,145 C260,135 256,125 254,118 Z"
          fill="url(#julianHairGrad)"
        />
        {/* Right Center Lock */}
        <path
          d="M252,118 C256,150 264,185 258,216 C255,190 252,165 251,135 Z"
          fill="url(#julianHairGrad)"
        />

        {/* Additional textured hair tips */}
        <path d="M215,140 Q225,185 212,215 Q228,180 232,145 Z" fill="url(#julianHairGrad)" />
        <path d="M285,140 Q275,185 288,215 Q272,180 268,145 Z" fill="url(#julianHairGrad)" />

        {/* Glossy Anime Specular Highlights across Hair Crown */}
        <path
          d="M190,120 Q220,95 250,95 Q280,95 310,120"
          stroke="url(#julianHairHighlight)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200,128 Q225,108 250,108 Q275,108 300,128"
          stroke="url(#julianHairHighlight)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M236,155 Q244,185 243,205"
          stroke="url(#julianHairHighlight)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
      </g>
    </svg>
  );
};

/**
 * LADY VIVIENNE RAVENSCROFT - The Seductive Gothic Vampire Countess
 * Off-the-shoulder scarlet red velvet ballgown with sweetheart neckline, gold filigree trim,
 * cascading raven-chestnut wavy curls, alabaster porcelain skin, seductive ruby eyes,
 * and Victorian choker with blood ruby teardrop.
 */
const VivienneSprite: React.FC<{ expression: CharacterExpression; isPortrait?: boolean }> = ({
  expression,
  isPortrait = false,
}) => {
  return (
    <svg
      viewBox={isPortrait ? "60 95 380 430" : "0 0 500 700"}
      className="w-full h-full object-contain filter drop-shadow-2xl"
      preserveAspectRatio={isPortrait ? "xMidYMid meet" : "xMidYMax meet"}
    >
      <defs>
        <linearGradient id="vivienneHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#231a26" />
          <stop offset="40%" stopColor="#150f1a" />
          <stop offset="100%" stopColor="#09050c" />
        </linearGradient>
        <linearGradient id="vivienneHairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#881337" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="vivienneSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8f8" />
          <stop offset="60%" stopColor="#ffe4e6" />
          <stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>

        <linearGradient id="vivienneVelvetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3f0516" />
          <stop offset="35%" stopColor="#881337" />
          <stop offset="70%" stopColor="#4c0519" />
          <stop offset="100%" stopColor="#180209" />
        </linearGradient>
        <linearGradient id="velvetSheen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e11d48" stopOpacity="0" />
          <stop offset="50%" stopColor="#fda4af" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="vivienneRubyEye" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>
        <radialGradient id="yandereEyeAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e11d48" stopOpacity="1" />
          <stop offset="60%" stopColor="#881337" stopOpacity="0.8" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Luxurious Dark Gothic Waves at Back (Cascading behind neck with right wave draped over shoulder) */}
      <g>
        {/* Main Back Volume */}
        <path
          d="M175,160 C165,220 170,300 185,350 L315,350 C330,300 335,220 325,160 Z"
          fill="url(#vivienneHairGrad)"
        />
        {/* Glamorous Lock Draping over Right Shoulder onto Velvet Gown */}
        <path
          d="M305,270 C325,310 335,360 325,410 C320,435 305,445 295,435 C285,425 290,390 295,350 C298,320 295,290 290,270 Z"
          fill="url(#vivienneHairGrad)"
        />
        <path
          d="M312,300 C325,345 328,390 318,425"
          stroke="#4c0519"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
      </g>

      {/* Bare Shoulders, Décolleté & Clavicles */}
      <g>
        <path
          d="M135,395 C150,360 185,340 220,330 L280,330 C315,340 350,360 365,395 C375,430 360,460 350,470 L150,470 C140,460 125,430 135,395 Z"
          fill="url(#vivienneSkinGrad)"
        />
        <path d="M190,365 Q225,372 245,366" stroke="#fca5a5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.65" />
        <path d="M310,365 Q275,372 255,366" stroke="#fca5a5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.65" />
        <path d="M220,290 L220,345 C235,355 265,355 280,345 L280,290 Z" fill="url(#vivienneSkinGrad)" />

        {/* Victorian Velvet Choker with Blood Ruby Teardrop */}
        <path d="M220,332 C235,340 265,340 280,332" stroke="#1f030b" strokeWidth="8" fill="none" />
        <polygon points="250,334 243,342 250,352 257,342" fill="#d97706" />
        <circle cx="250" cy="342" r="4" fill="#e11d48" />
        <circle cx="249" cy="340" r="1.5" fill="#ffffff" />
      </g>

      {/* Red Velvet Gown */}
      <g>
        <path
          d="M130,400 C170,410 205,425 250,410 C295,425 330,410 370,400 L425,700 L75,700 Z"
          fill="url(#vivienneVelvetGrad)"
        />
        <path
          d="M175,410 Q210,480 190,700 M325,410 Q290,480 310,700 M250,420 L250,700"
          stroke="#25030d"
          strokeWidth="3.5"
          fill="none"
          opacity="0.75"
        />
        <path
          d="M130,400 C170,410 205,425 250,410 C295,425 330,410 370,400 L380,480 L120,480 Z"
          fill="url(#velvetSheen)"
        />
        <path
          d="M130,400 C165,412 210,428 250,412 C290,428 335,412 370,400"
          stroke="#f59e0b"
          strokeWidth="2.8"
          fill="none"
        />
        <path
          d="M140,402 Q150,408 160,403 Q170,410 180,405 Q190,412 200,407 Q215,416 230,412 Q240,416 250,413 Q260,416 270,412 Q285,416 300,407 Q310,412 320,405 Q330,410 340,403 Q350,408 360,402"
          stroke="#0f0207"
          strokeWidth="2"
          fill="none"
          opacity="0.85"
        />

        {/* Off-the-Shoulder Velvet Sleeves */}
        <path
          d="M125,400 C110,420 100,450 115,480 C130,485 140,440 138,405 Z"
          fill="url(#vivienneVelvetGrad)"
        />
        <path
          d="M375,400 C390,420 400,450 385,480 C370,485 360,440 362,405 Z"
          fill="url(#vivienneVelvetGrad)"
        />

        {/* Porcelain Forearms and Graceful Hands with Crimson Manicured Nails Resting on Gown */}
        <g>
          {/* Left Forearm */}
          <path
            d="M115,480 C125,510 155,535 185,545 C192,540 188,530 175,520 C150,505 130,485 125,480 Z"
            fill="url(#vivienneSkinGrad)"
          />
          {/* Left Hand & Polished Crimson Nails */}
          <path
            d="M185,545 C195,548 215,555 228,560 C232,562 230,556 220,550 C210,545 195,540 188,540 Z"
            fill="url(#vivienneSkinGrad)"
            stroke="#fca5a5"
            strokeWidth="0.8"
          />
          <circle cx="227" cy="559" r="1.2" fill="#be123c" />

          {/* Right Forearm */}
          <path
            d="M385,480 C375,510 345,535 315,545 C308,540 312,530 325,520 C350,505 370,485 375,480 Z"
            fill="url(#vivienneSkinGrad)"
          />
          {/* Right Hand & Polished Crimson Nails */}
          <path
            d="M315,545 C305,548 285,555 272,560 C268,562 270,556 280,550 C290,545 305,540 312,540 Z"
            fill="url(#vivienneSkinGrad)"
            stroke="#fca5a5"
            strokeWidth="0.8"
          />
          <circle cx="273" cy="559" r="1.2" fill="#be123c" />
        </g>

        {/* Ravenscroft Rose Crest */}
        <circle cx="250" cy="510" r="11" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="250" cy="510" r="6" fill="#be123c" />
        <path d="M244,522 L230,590 M256,522 L270,590" stroke="#f59e0b" strokeWidth="2.5" />
      </g>

      {/* Head / Aristocratic Face */}
      <g>
        <path
          d="M185,190 C175,265 200,320 250,330 C300,320 325,265 315,190 C310,120 190,120 185,190 Z"
          fill="url(#vivienneSkinGrad)"
        />

        {(expression === 'blushing' || expression === 'seductive') && (
          <g opacity="0.75">
            <ellipse cx="205" cy="275" rx="15" ry="8" fill="#fb7185" />
            <ellipse cx="295" cy="275" rx="15" ry="8" fill="#fb7185" />
            <path d="M198,272 L202,278 M205,271 L209,277 M212,272 L216,278" stroke="#e11d48" strokeWidth="1.2" />
            <path d="M288,272 L292,278 M295,271 L299,277 M302,272 L306,278" stroke="#e11d48" strokeWidth="1.2" />
          </g>
        )}

        {expression === 'yandere' && (
          <path
            d="M185,200 C220,235 280,235 315,200 L315,245 C280,260 220,260 185,245 Z"
            fill="#0f0207"
            opacity="0.55"
          />
        )}

        {/* Eyes */}
        <g>
          <path d="M196,244 C208,233 228,234 236,247" stroke="#12040b" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M196,244 L190,240 M236,247 L241,243" stroke="#12040b" strokeWidth="1.8" strokeLinecap="round" />

          {expression !== 'fear' ? (
            <g>
              <ellipse cx="217" cy="247" rx="10.5" ry="12.5" fill="url(#vivienneRubyEye)" />
              <circle cx="217" cy="248" r="4.5" fill="#2b0512" />
              <circle cx="213" cy="243" r="3" fill="white" />
              <circle cx="221" cy="252" r="1.4" fill="white" opacity="0.8" />
              {expression === 'yandere' && (
                <circle cx="217" cy="248" r="15" fill="url(#yandereEyeAura)" />
              )}
            </g>
          ) : (
            <g>
              <ellipse cx="217" cy="247" rx="8" ry="8" fill="url(#vivienneRubyEye)" />
              <circle cx="217" cy="247" r="3" fill="#12040b" />
              <circle cx="214" cy="244" r="1.5" fill="white" />
            </g>
          )}
        </g>

        <g>
          <path d="M304,244 C292,233 272,234 264,247" stroke="#12040b" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M304,244 L310,240 M264,247 L259,243" stroke="#12040b" strokeWidth="1.8" strokeLinecap="round" />

          {expression !== 'fear' ? (
            <g>
              <ellipse cx="283" cy="247" rx="10.5" ry="12.5" fill="url(#vivienneRubyEye)" />
              <circle cx="283" cy="248" r="4.5" fill="#2b0512" />
              <circle cx="279" cy="243" r="3" fill="white" />
              <circle cx="287" cy="252" r="1.4" fill="white" opacity="0.8" />
              {expression === 'yandere' && (
                <circle cx="283" cy="248" r="15" fill="url(#yandereEyeAura)" />
              )}
            </g>
          ) : (
            <g>
              <ellipse cx="283" cy="247" rx="8" ry="8" fill="url(#vivienneRubyEye)" />
              <circle cx="283" cy="247" r="3" fill="#12040b" />
              <circle cx="280" cy="244" r="1.5" fill="white" />
            </g>
          )}
        </g>

        {/* Eyebrows */}
        {expression === 'seductive' && (
          <>
            <path d="M197,228 Q216,222 234,229" stroke="#1e0c15" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M303,226 Q284,220 266,227" stroke="#1e0c15" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </>
        )}
        {expression === 'yandere' && (
          <>
            <path d="M197,232 Q216,230 234,223" stroke="#1e0c15" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M303,232 Q284,230 266,223" stroke="#1e0c15" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </>
        )}
        {(expression === 'neutral' || expression === 'smile' || expression === 'blushing') && (
          <>
            <path d="M197,230 Q216,224 234,228" stroke="#1e0c15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M303,230 Q284,224 266,228" stroke="#1e0c15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        )}
        {expression === 'fear' && (
          <>
            <path d="M199,225 Q216,232 234,230" stroke="#1e0c15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M301,225 Q284,232 266,230" stroke="#1e0c15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        )}

        <ellipse cx="250" cy="270" rx="1.2" ry="2" fill="#fda4af" />

        {/* Lips */}
        {expression === 'seductive' && (
          <g>
            <path d="M240,295 Q250,299 260,294" stroke="#9f1239" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M243,296 Q250,303 257,296" fill="#881337" opacity="0.95" />
            <polygon points="243,296 245,300 246,296" fill="#ffffff" />
            <circle cx="251" cy="300" r="1.2" fill="#ffffff" opacity="0.85" />
          </g>
        )}
        {expression === 'smile' && (
          <g>
            <path d="M241,294 Q250,302 259,294" stroke="#9f1239" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M244,295 Q250,300 256,295" fill="#be123c" opacity="0.8" />
          </g>
        )}
        {expression === 'yandere' && (
          <path d="M237,297 Q250,309 263,294" stroke="#e11d48" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        )}
        {expression === 'fear' && (
          <path d="M244,297 Q247,302 250,297 Q253,302 256,297" stroke="#881337" strokeWidth="1.8" fill="none" />
        )}
        {expression === 'blushing' && (
          <path d="M244,295 Q250,298 256,295" stroke="#be123c" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {expression === 'neutral' && (
          <path d="M242,295 L258,295" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" />
        )}
      </g>

      {/* Front: Glamorous Side-Parted Aristocratic Gothic Hair */}
      <g>
        {/* Side-Part Crown Volume & Swept Wave */}
        <path
          d="M180,180 C175,110 240,95 270,110 C310,100 330,135 330,185 C335,230 320,275 308,290 C298,300 290,265 292,235 C295,200 280,180 255,195 C230,210 215,245 210,275 C205,285 198,285 195,270 C190,240 182,215 180,180 Z"
          fill="url(#vivienneHairGrad)"
        />
        {/* Seductive Side-Swept Bang across Forehead */}
        <path
          d="M225,145 C245,175 275,205 300,218 C308,222 305,210 295,195 C280,175 260,155 240,140 Z"
          fill="url(#vivienneHairGrad)"
        />
        {/* Fine Silky Strand Curves */}
        <path d="M235,130 Q270,165 300,195" stroke="#1f030b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M205,175 Q212,230 206,265" stroke="#1f030b" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Wine/Burgundy Silk Gloss */}
        <path
          d="M230,125 C260,115 295,120 315,145 C305,155 270,140 240,145 Z"
          fill="url(#vivienneHairHighlight)"
          opacity="0.85"
        />
      </g>
    </svg>
  );
};

/**
 * EVANGELINE - The Ethereal Maiden of the Crypt
 * Modeled directly after the user reference:
 * Lush honey-golden wavy curls cascading down her shoulders and back.
 * Luminous amethyst-violet eyes with wistful, tragic depth.
 * Victorian high-collared white lace vintage gown with delicate embroidery and sheer floral lace yoke.
 */
const EvangelineSprite: React.FC<{ expression: CharacterExpression; isPortrait?: boolean }> = ({
  expression,
  isPortrait = false,
}) => {
  return (
    <svg
      viewBox={isPortrait ? "60 95 380 430" : "0 0 500 700"}
      className="w-full h-full object-contain filter drop-shadow-2xl"
      preserveAspectRatio={isPortrait ? "xMidYMid meet" : "xMidYMax meet"}
    >
      <defs>
        <linearGradient id="evangelineHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="65%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="evangelineHairGleam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fde047" stopOpacity="0.1" />
        </linearGradient>

        <radialGradient id="evangelineVioletEye" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="45%" stopColor="#a855f7" />
          <stop offset="85%" stopColor="#6b21a8" />
          <stop offset="100%" stopColor="#3b0764" />
        </radialGradient>

        <linearGradient id="evangelineLaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#fdfaf6" />
          <stop offset="80%" stopColor="#f3eee7" />
          <stop offset="100%" stopColor="#e2d9ce" />
        </linearGradient>
        <linearGradient id="evangelineSheerLace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f5f3ff" stopOpacity="0.5" />
        </linearGradient>

        <linearGradient id="evangelineSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#fff5f5" />
          <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Ethereal Golden Locks at Back (Falling softly behind neck and shoulders) */}
      <g>
        <path
          d="M175,160 C165,210 168,280 180,355 L320,355 C332,280 335,210 325,160 Z"
          fill="url(#evangelineHairGrad)"
          opacity="0.95"
        />
        {/* Soft undulating romantic waves at base */}
        <path
          d="M180,355 Q195,370 210,355 Q225,370 240,355 Q255,370 270,355 Q285,370 300,355 Q310,370 320,355"
          stroke="#ca8a04"
          strokeWidth="2.5"
          fill="none"
          opacity="0.7"
        />
      </g>

      {/* Full Body Anatomy: Shoulders, Décolleté, Arms, Hands & Vintage Victorian Gown */}
      <g>
        {/* Soft, porcelain shoulders and upper chest */}
        <path
          d="M125,385 C145,355 185,340 220,332 L280,332 C315,340 355,355 375,385 C385,420 370,455 355,465 L145,465 C130,455 115,420 125,385 Z"
          fill="url(#evangelineSkinGrad)"
        />

        {/* Neck */}
        <path d="M222,295 L222,350 C235,360 265,360 278,350 L278,295 Z" fill="url(#evangelineSkinGrad)" />
        {/* Subtle Chin Shadow on Neck */}
        <path d="M222,295 Q250,312 278,295 L278,310 Q250,324 222,310 Z" fill="#fbcfe8" opacity="0.4" />

        {/* Slender Clavicle Bones (Köprücük Kemikleri) */}
        <path d="M190,366 Q225,372 245,368" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75" />
        <path d="M310,366 Q275,372 255,368" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75" />

        {/* Arms: Left & Right Porcelain Arms */}
        {/* Left Upper Arm */}
        <path
          d="M125,385 C115,420 110,460 116,495 C126,500 142,485 140,445 C138,415 145,395 145,390 Z"
          fill="url(#evangelineSkinGrad)"
        />
        {/* Left Forearm angled towards waist */}
        <path
          d="M116,495 C125,518 160,540 195,548 C202,544 200,535 185,525 C155,510 135,490 126,500 Z"
          fill="url(#evangelineSkinGrad)"
        />

        {/* Right Upper Arm */}
        <path
          d="M375,385 C385,420 390,460 384,495 C374,500 358,485 360,445 C362,415 355,395 355,390 Z"
          fill="url(#evangelineSkinGrad)"
        />
        {/* Right Forearm angled towards waist */}
        <path
          d="M384,495 C375,518 340,540 305,548 C298,544 300,535 315,525 C345,510 365,490 374,500 Z"
          fill="url(#evangelineSkinGrad)"
        />

        {/* Demure, Gracefully Clasped Maiden Hands at Center Waist (X: 220-280, Y: 535-570) */}
        <g>
          {/* Left Hand Base & Fingers */}
          <path
            d="M192,546 C205,550 230,560 248,565 C255,567 252,560 238,554 C225,548 208,542 195,540 Z"
            fill="url(#evangelineSkinGrad)"
            stroke="#fbcfe8"
            strokeWidth="0.8"
          />
          {/* Right Hand resting over Left Wrist/Fingers */}
          <path
            d="M308,546 C295,550 270,558 252,560 C242,562 245,554 260,550 C275,545 295,540 305,540 Z"
            fill="url(#evangelineSkinGrad)"
            stroke="#fbcfe8"
            strokeWidth="0.8"
          />
          {/* Delicate Fingers Detail */}
          <path d="M236,555 Q248,560 256,558" stroke="#f472b6" strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M238,559 Q250,564 258,561" stroke="#f472b6" strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M242,563 Q252,567 260,564" stroke="#f472b6" strokeWidth="1" fill="none" opacity="0.6" />
        </g>

        {/* Victorian Vintage White Lace Gown */}
        {/* Full Layered Lace Skirt billowing to bottom */}
        <path
          d="M150,470 C180,480 220,485 250,485 C280,485 320,480 350,470 L430,700 L70,700 Z"
          fill="url(#evangelineLaceGrad)"
        />
        {/* Skirt Lace Folds & Drapes */}
        <path
          d="M170,480 Q195,580 180,700 M330,480 Q305,580 320,700 M250,485 L250,700 M210,500 Q225,600 215,700 M290,500 Q275,600 285,700"
          stroke="#d4c7b8"
          strokeWidth="2.2"
          fill="none"
          opacity="0.65"
        />
        {/* Tiered Scalloped Lace Ruffles on Skirt */}
        <path
          d="M95,620 Q120,640 145,625 Q170,645 195,630 Q220,650 250,635 Q280,650 305,630 Q330,645 355,625 Q380,640 405,620"
          stroke="#e7dfd5"
          strokeWidth="2.4"
          fill="none"
        />
        <path
          d="M80,670 Q110,690 140,675 Q170,695 205,680 Q250,700 295,680 Q330,695 360,675 Q390,690 420,670"
          stroke="#dcd2c4"
          strokeWidth="2.4"
          fill="none"
        />

        {/* Corset Bodice / Vintage Chemise cinched at waist */}
        <path
          d="M155,420 C185,432 215,440 250,440 C285,440 315,432 345,420 L350,485 C315,498 285,502 250,502 C215,502 185,498 150,485 Z"
          fill="url(#evangelineLaceGrad)"
          stroke="#e2d9ce"
          strokeWidth="1.2"
        />
        {/* Bodice Vertical Seams & Shading */}
        <path d="M210,435 L205,492 M290,435 L295,492 M250,440 L250,502" stroke="#d4c7b8" strokeWidth="1.6" fill="none" opacity="0.6" />

        {/* Sheer Floral Lace Yoke over Décolleté */}
        <path
          d="M185,360 L250,435 L315,360 L278,345 L222,345 Z"
          fill="url(#evangelineSheerLace)"
          stroke="#f1ede6"
          strokeWidth="1.5"
        />

        {/* Sheer Floral Lace Puff Sleeves at Shoulders */}
        <path
          d="M120,380 C100,410 95,450 115,475 C130,480 145,445 142,400 Z"
          fill="url(#evangelineSheerLace)"
          stroke="#f1ede6"
          strokeWidth="1.2"
        />
        <path
          d="M380,380 C400,410 405,450 385,475 C370,480 355,445 358,400 Z"
          fill="url(#evangelineSheerLace)"
          stroke="#f1ede6"
          strokeWidth="1.2"
        />
        {/* Lace Sleeve Cuffs */}
        <path d="M102,470 Q115,480 128,470 Q138,480 148,470" stroke="#d4c7b8" strokeWidth="2" fill="none" />
        <path d="M352,470 Q362,480 372,470 Q385,480 398,470" stroke="#d4c7b8" strokeWidth="2" fill="none" />

        {/* High Victorian Frilled Lace Collar at Neck */}
        <path
          d="M218,318 C232,328 268,328 282,318 L284,338 C268,348 232,348 216,338 Z"
          fill="#ffffff"
          stroke="#d4c7b8"
          strokeWidth="1.5"
        />
        <path
          d="M216,318 Q222,312 228,318 Q234,312 240,318 Q246,312 252,318 Q258,312 264,318 Q270,312 276,318 Q282,312 284,318"
          stroke="#c5b8a5"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M216,338 Q224,345 232,339 Q240,346 250,340 Q260,346 268,339 Q276,345 284,338"
          stroke="#c5b8a5"
          strokeWidth="1.8"
          fill="none"
        />

        {/* Delicate Violet Amethyst Pendant & Ribbon Bow at Chest Center */}
        <g>
          {/* Satin Ribbon Bow */}
          <path d="M250,368 C240,360 230,368 242,374 Z" fill="#c084fc" opacity="0.85" />
          <path d="M250,368 C260,360 270,368 258,374 Z" fill="#c084fc" opacity="0.85" />
          <circle cx="250" cy="370" r="3.5" fill="#a855f7" />
          {/* Amethyst Teardrop Gem */}
          <polygon points="250,374 246,382 250,392 254,382" fill="#9333ea" stroke="#d8b4fe" strokeWidth="1" />
          <circle cx="250" cy="382" r="2" fill="#c084fc" />
          <circle cx="249" cy="380" r="0.8" fill="#ffffff" />
        </g>
      </g>

      <g>
        <path
          d="M185,190 C175,265 200,320 250,330 C300,320 325,265 315,190 C310,120 190,120 185,190 Z"
          fill="url(#evangelineSkinGrad)"
        />

        {(expression === 'blushing' || expression === 'seductive') && (
          <g opacity="0.7">
            <ellipse cx="205" cy="275" rx="14" ry="7" fill="#f472b6" />
            <ellipse cx="295" cy="275" rx="14" ry="7" fill="#f472b6" />
            <path d="M198,272 L202,278 M205,271 L209,277" stroke="#ec4899" strokeWidth="1" />
            <path d="M295,271 L299,277 M302,272 L306,278" stroke="#ec4899" strokeWidth="1" />
          </g>
        )}

        <g>
          <path d="M197,245 C208,234 228,235 235,248" stroke="#372739" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <ellipse cx="217" cy="248" rx="10" ry="12.5" fill="url(#evangelineVioletEye)" />
          <circle cx="217" cy="249" r="4.2" fill="#2e1065" />
          <circle cx="214" cy="243" r="3" fill="white" />
          <circle cx="221" cy="252" r="1.5" fill="white" opacity="0.85" />
          <path d="M205,258 Q216,263 227,258" stroke="#7e5a87" strokeWidth="1" fill="none" />
        </g>

        <g>
          <path d="M303,245 C292,234 272,235 265,248" stroke="#372739" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <ellipse cx="283" cy="248" rx="10" ry="12.5" fill="url(#evangelineVioletEye)" />
          <circle cx="283" cy="249" r="4.2" fill="#2e1065" />
          <circle cx="280" cy="243" r="3" fill="white" />
          <circle cx="287" cy="252" r="1.5" fill="white" opacity="0.85" />
          <path d="M273,258 Q284,263 295,258" stroke="#7e5a87" strokeWidth="1" fill="none" />
        </g>

        {expression === 'fear' ? (
          <>
            <path d="M199,227 Q215,235 233,232" stroke="#78350f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M301,227 Q285,235 267,232" stroke="#78350f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        ) : expression === 'seductive' ? (
          <>
            <path d="M197,228 Q215,223 234,228" stroke="#78350f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M303,226 Q285,221 266,227" stroke="#78350f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M198,229 Q215,223 233,227" stroke="#78350f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M302,229 Q285,223 267,227" stroke="#78350f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        )}

        <circle cx="250" cy="271" r="1.2" fill="#f472b6" opacity="0.5" />

        {expression === 'smile' || expression === 'seductive' ? (
          <g>
            <path d="M241,294 Q250,302 259,294" stroke="#a21caf" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M243,295 Q250,300 257,295" fill="#f472b6" opacity="0.6" />
          </g>
        ) : expression === 'fear' ? (
          <ellipse cx="250" cy="297" rx="3.5" ry="4.5" fill="#86198f" opacity="0.75" />
        ) : (
          <g>
            <path d="M243,295 Q250,298 257,295" stroke="#a21caf" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M245,296 Q250,299 255,296" fill="#f472b6" opacity="0.5" />
          </g>
        )}
      </g>

      {/* Front: Ethereal Center-Parted Wispy Maiden Fringe & Tender Inward Tendrils */}
      <g>
        {/* Soft Rounded Crown */}
        <path
          d="M178,175 C182,105 318,105 322,175 C328,210 322,250 312,285 C306,305 298,315 292,305 C288,290 295,255 292,230 C290,200 275,190 260,225 C256,235 252,242 250,242 C248,242 244,235 240,225 C225,190 210,200 208,230 C205,255 212,290 208,305 C202,315 194,305 188,285 C178,250 172,210 178,175 Z"
          fill="url(#evangelineHairGrad)"
        />
        {/* Soft Wispy Fringe Touching Forehead (Delicate See-Through Anime Bangs) */}
        <g stroke="#ca8a04" strokeWidth="2" fill="none" opacity="0.85">
          {/* Center wisps */}
          <path d="M246,210 Q248,235 249,240" />
          <path d="M254,210 Q252,235 251,240" />
          {/* Left feathery fringe */}
          <path d="M232,205 Q235,228 238,236" />
          <path d="M220,195 Q225,222 226,232" />
          {/* Right feathery fringe */}
          <path d="M268,205 Q265,228 262,236" />
          <path d="M280,195 Q275,222 274,232" />
        </g>
        {/* Angelic Halo Sun Gleam */}
        <ellipse cx="250" cy="148" rx="55" ry="9" fill="url(#evangelineHairGleam)" />
      </g>
    </svg>
  );
};

/**
 * VALERIA - The Crimson Inquisitor / Hunter
 * Modeled directly after the user reference:
 * Dynamic, windswept fiery crimson/copper hair with twin side warrior braids.
 * Piercing, resolute amber eyes with intense warrior gaze.
 * Dark leather hunter doublet with lace-up corset front, buckled cross-belts,
 * steel shoulder pauldrons with ornate silver filigree, dark tattered hunter cape,
 * and rune-engraved silver ancient sword.
 */
const ValeriaSprite: React.FC<{ expression: CharacterExpression; isPortrait?: boolean }> = ({
  expression,
  isPortrait = false,
}) => {
  return (
    <svg
      viewBox={isPortrait ? "60 95 380 430" : "0 0 500 700"}
      className="w-full h-full object-contain filter drop-shadow-2xl"
      preserveAspectRatio={isPortrait ? "xMidYMid meet" : "xMidYMax meet"}
    >
      <defs>
        {/* Dynamic Fiery Auburn-Copper Hair */}
        <linearGradient id="valeriaHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="30%" stopColor="#c2410c" />
          <stop offset="70%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#431407" />
        </linearGradient>
        <linearGradient id="valeriaHairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#c2410c" stopOpacity="0.1" />
        </linearGradient>

        {/* Piercing Amber / Golden Eyes */}
        <radialGradient id="valeriaAmberEye" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="75%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>

        {/* Dark Hunter Leather Doublet */}
        <linearGradient id="valeriaLeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#442a22" />
          <stop offset="40%" stopColor="#2c1a14" />
          <stop offset="100%" stopColor="#170c08" />
        </linearGradient>

        {/* Silver Steel Pauldrons & Armor Plate */}
        <linearGradient id="valeriaSteelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="30%" stopColor="#94a3b8" />
          <stop offset="70%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Dark Hunter's Cloak */}
        <linearGradient id="valeriaCloakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="50%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>

        {/* Runic Silver Greatsword Blade */}
        <linearGradient id="valeriaBladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        <linearGradient id="valeriaSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="60%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
      </defs>

      {/* Tattered Gothic Hunter Cloak Draped Behind Silhouette */}
      <path
        d="M130,330 C120,430 115,550 125,700 L375,700 C385,550 380,430 370,330 L250,350 Z"
        fill="url(#valeriaCloakGrad)"
      />
      {/* Cloak Wind Folds */}
      <path d="M160,430 Q170,550 165,700 M340,430 Q330,550 335,700" stroke="#09090b" strokeWidth="3" fill="none" opacity="0.6" />

      {/* Fierce Layered Crimson/Auburn Locks at Back (Battle-ready, jagged warrior tips) */}
      <g>
        <path
          d="M172,160 C162,210 165,280 180,345 L320,345 C335,280 338,210 328,160 Z"
          fill="url(#valeriaHairGrad)"
        />
        {/* Jagged Layered Warrior Tips at base */}
        <path
          d="M175,345 L190,360 L205,345 L225,362 L245,345 L265,362 L285,345 L305,360 L320,345"
          fill="url(#valeriaHairGrad)"
          stroke="#431407"
          strokeWidth="1.5"
        />
      </g>

      {/* Full Body Anatomy: Gothic Inquisitor Warrior Armor */}
      <g>
        {/* Dark Padded Gambeson / Combat Tunic Base */}
        <path
          d="M135,355 C150,335 185,325 220,320 L280,320 C315,325 350,335 365,355 L365,510 L135,510 Z"
          fill="#18181b"
        />

        {/* Neck */}
        <path d="M222,295 L222,340 C235,350 265,350 278,340 L278,295 Z" fill="url(#valeriaSkinGrad)" />
        {/* Chin Shadow on Neck */}
        <path d="M222,295 Q250,314 278,295 L278,308 Q250,324 222,308 Z" fill="#fdba74" opacity="0.35" />

        {/* High Leather Armor Collar */}
        <path d="M214,318 L286,318 L288,345 L212,345 Z" fill="#27272a" stroke="#09090b" strokeWidth="1" />
        <path d="M214,330 L286,330" stroke="#ca8a04" strokeWidth="1.5" />

        {/* Steel Neck Gorget (Boğaz ve Köprücük Zırhı) */}
        <path
          d="M205,338 C225,358 275,358 295,338 L290,375 C275,385 225,385 210,375 Z"
          fill="url(#valeriaSteelGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <path d="M215,352 Q250,372 285,352" stroke="#e2e8f0" strokeWidth="1.5" fill="none" opacity="0.8" />
        {/* Inquisitor Cloak Brooch / Neck Sigil */}
        <circle cx="250" cy="365" r="10" fill="url(#valeriaSteelGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="250" cy="365" r="5" fill="#ca8a04" />
        <circle cx="250" cy="365" r="2.5" fill="#38bdf8" />

        {/* Fitted Dark Leather Combat Sleeves */}
        {/* Left Sleeve */}
        <path
          d="M135,355 C122,390 120,440 126,500 C138,505 152,490 148,445 C146,405 152,370 152,365 Z"
          fill="#1c1917"
          stroke="#09090b"
          strokeWidth="1"
        />
        {/* Left Sleeve Segment Trim */}
        <path d="M125,430 Q138,435 150,430" stroke="#44403c" strokeWidth="2" fill="none" />

        {/* Right Sleeve */}
        <path
          d="M365,355 C378,390 380,440 374,500 C362,505 348,490 352,445 C354,405 348,370 348,365 Z"
          fill="#1c1917"
          stroke="#09090b"
          strokeWidth="1"
        />
        {/* Right Sleeve Segment Trim */}
        <path d="M375,430 Q362,435 350,430" stroke="#44403c" strokeWidth="2" fill="none" />

        {/* Form-Fitting Contoured Steel Shoulder Pauldrons (Entegre Omuz Zırhları) */}
        {/* Left Pauldron */}
        <g>
          <path
            d="M130,355 C145,335 178,335 190,350 C182,378 152,392 132,375 Z"
            fill="url(#valeriaSteelGrad)"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <path d="M138,348 Q160,340 182,352" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
          <circle cx="160" cy="365" r="2.5" fill="#ca8a04" />
          <circle cx="145" cy="362" r="2" fill="#94a3b8" />
          <circle cx="175" cy="362" r="2" fill="#94a3b8" />
        </g>
        {/* Right Pauldron */}
        <g>
          <path
            d="M370,355 C355,335 322,335 310,350 C318,378 348,392 368,375 Z"
            fill="url(#valeriaSteelGrad)"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <path d="M362,348 Q340,340 318,352" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
          <circle cx="340" cy="365" r="2.5" fill="#ca8a04" />
          <circle cx="355" cy="362" r="2" fill="#94a3b8" />
          <circle cx="325" cy="362" r="2" fill="#94a3b8" />
        </g>

        {/* Hardened Steel Warrior Breastplate (Gövde Çelik Zırhı) */}
        <path
          d="M185,365 L315,365 L310,435 C285,455 215,455 190,435 Z"
          fill="url(#valeriaSteelGrad)"
          stroke="#64748b"
          strokeWidth="1.8"
        />
        {/* Breastplate Center Crease / Highlight */}
        <path d="M250,365 L250,448" stroke="#e2e8f0" strokeWidth="1.8" />
        <path d="M195,372 Q250,395 305,372" stroke="#334155" strokeWidth="1.5" fill="none" />

        {/* Inquisitor Silver Crest & Glowing Runic Cross */}
        <g>
          <path d="M250,380 L250,425 M235,395 L265,395" stroke="#e2e8f0" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="250" cy="395" r="4.5" fill="#0284c7" />
          <circle cx="250" cy="395" r="2.5" fill="#38bdf8" />
          {/* Rune Engraving Dots */}
          <circle cx="250" cy="382" r="1.5" fill="#38bdf8" />
          <circle cx="250" cy="423" r="1.5" fill="#38bdf8" />
          <circle cx="237" cy="395" r="1.5" fill="#38bdf8" />
          <circle cx="263" cy="395" r="1.5" fill="#38bdf8" />
        </g>

        {/* Tactical Cross-Harness Leather Straps with Buckles */}
        <path d="M165,375 L335,495" stroke="#2c1a14" strokeWidth="6" />
        <rect x="235" y="420" width="14" height="10" rx="1.5" fill="#d4af37" stroke="#78350f" strokeWidth="1" />
        <path d="M335,375 L165,495" stroke="#2c1a14" strokeWidth="6" />
        <rect x="251" y="420" width="14" height="10" rx="1.5" fill="#d4af37" stroke="#78350f" strokeWidth="1" />

        {/* Reinforced Leather Rib Armor with Steel Rivets */}
        <path
          d="M170,440 L330,440 L345,495 L155,495 Z"
          fill="url(#valeriaLeatherGrad)"
          stroke="#170c08"
          strokeWidth="1.5"
        />
        {/* Steel Rivet Studs along Side Ribs */}
        <circle cx="180" cy="455" r="2.2" fill="#cbd5e1" />
        <circle cx="180" cy="475" r="2.2" fill="#cbd5e1" />
        <circle cx="320" cy="455" r="2.2" fill="#cbd5e1" />
        <circle cx="320" cy="475" r="2.2" fill="#cbd5e1" />

        {/* Heavy Warrior War-Belt & Buckle */}
        <rect x="145" y="485" width="210" height="26" fill="#1c100c" stroke="#09090b" strokeWidth="1.5" />
        {/* Big Inquisitor Silver & Gold Buckle */}
        <rect x="230" y="482" width="40" height="32" rx="3" fill="url(#valeriaSteelGrad)" stroke="#cbd5e1" strokeWidth="1.8" />
        <circle cx="250" cy="498" r="8" fill="#ca8a04" stroke="#78350f" strokeWidth="1" />
        <circle cx="250" cy="498" r="4" fill="#1c100c" />
        {/* Belt Studs */}
        <circle cx="170" cy="498" r="2.5" fill="#d4af37" />
        <circle cx="195" cy="498" r="2.5" fill="#d4af37" />
        <circle cx="305" cy="498" r="2.5" fill="#d4af37" />
        <circle cx="330" cy="498" r="2.5" fill="#d4af37" />

        {/* Chainmail Fauld & Armored Tassets at Hips */}
        <path d="M140,511 L360,511 L375,565 L125,565 Z" fill="#334155" opacity="0.9" />
        <path d="M125,565 L375,565" stroke="#64748b" strokeWidth="2.5" strokeDasharray="4,4" />
        {/* Leather Fauld Slits */}
        <path d="M210,511 L200,565 M290,511 L300,565 M250,514 L250,565" stroke="#1c1917" strokeWidth="3" />

        {/* Dark Hunter Leather Trousers / Legs (giving full anatomical silhouette down to floor) */}
        <g>
          {/* Left Leg / Thigh */}
          <path
            d="M130,560 L240,565 L230,700 L110,700 Z"
            fill="#18181b"
          />
          {/* Right Leg / Thigh */}
          <path
            d="M245,565 L370,560 L390,700 L270,700 Z"
            fill="#18181b"
          />
          {/* Inner Leg Inseam Gap / Shadow */}
          <path d="M242,565 L250,700" stroke="#09090b" strokeWidth="5" />
          {/* Thigh Leather Holster Straps with Silver Buckles */}
          <path d="M135,605 L230,615" stroke="#451a03" strokeWidth="5" />
          <rect x="175" y="605" width="10" height="7" fill="#cbd5e1" rx="1" />
          <path d="M265,615 L365,605" stroke="#451a03" strokeWidth="5" />
          <rect x="315" y="605" width="10" height="7" fill="#cbd5e1" rx="1" />
          {/* Knee Guards / Tall Hunter Riding Boots */}
          <path d="M120,650 L235,655 L230,700 L110,700 Z" fill="#09090b" opacity="0.9" />
          <path d="M265,655 L380,650 L390,700 L270,700 Z" fill="#09090b" opacity="0.9" />
          <path d="M120,650 Q177,665 235,655" stroke="#ca8a04" strokeWidth="2" fill="none" />
          <path d="M265,655 Q322,665 380,650" stroke="#ca8a04" strokeWidth="2" fill="none" />
        </g>
      </g>

      {/* Head / Fierce Warrior Face */}
      <g>
        <path
          d="M185,190 C175,265 200,320 250,330 C300,320 325,265 315,190 C310,120 190,120 185,190 Z"
          fill="url(#valeriaSkinGrad)"
        />

        {/* Fierce Tsundere Blush */}
        {(expression === 'blushing' || expression === 'seductive') && (
          <g opacity="0.8">
            <ellipse cx="205" cy="275" rx="14" ry="7" fill="#f97316" />
            <ellipse cx="295" cy="275" rx="14" ry="7" fill="#f97316" />
            <path d="M198,272 L202,278 M205,271 L209,277" stroke="#c2410c" strokeWidth="1.2" />
            <path d="M295,271 L299,277 M302,272 L306,278" stroke="#c2410c" strokeWidth="1.2" />
          </g>
        )}

        {/* Left Amber Eye */}
        <g>
          <path d="M196,245 C208,233 228,234 236,248" stroke="#1c1917" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <ellipse cx="217" cy="248" rx="10.5" ry="12.5" fill="url(#valeriaAmberEye)" />
          <circle cx="217" cy="249" r="4.5" fill="#451a03" />
          <circle cx="213" cy="243" r="3" fill="white" />
          <circle cx="221" cy="252" r="1.5" fill="white" opacity="0.85" />
        </g>

        {/* Right Amber Eye */}
        <g>
          <path d="M304,245 C292,233 272,234 264,248" stroke="#1c1917" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <ellipse cx="283" cy="248" rx="10.5" ry="12.5" fill="url(#valeriaAmberEye)" />
          <circle cx="283" cy="249" r="4.5" fill="#451a03" />
          <circle cx="279" cy="243" r="3" fill="white" />
          <circle cx="287" cy="252" r="1.5" fill="white" opacity="0.85" />
        </g>

        {/* Fierce Determined Eyebrows */}
        {expression === 'serious' || expression === 'fear' ? (
          <>
            <path d="M196,229 Q215,235 235,227" stroke="#292524" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M304,229 Q285,235 265,227" stroke="#292524" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </>
        ) : expression === 'seductive' ? (
          <>
            <path d="M197,227 Q215,222 235,229" stroke="#292524" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M303,225 Q285,220 265,227" stroke="#292524" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M196,226 Q215,223 235,229" stroke="#292524" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M304,226 Q285,223 265,229" stroke="#292524" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </>
        )}

        <circle cx="250" cy="271" r="1.2" fill="#fb923c" />

        {/* Lips */}
        {expression === 'smile' && (
          <path d="M241,294 Q250,302 259,294" stroke="#991b1b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}
        {expression === 'blushing' && (
          <path d="M243,298 Q247,294 252,298 Q257,294 260,298" stroke="#991b1b" strokeWidth="2.2" fill="none" />
        )}
        {expression === 'seductive' && (
          <path d="M241,295 Q250,300 259,295" stroke="#991b1b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}
        {(expression === 'neutral' || expression === 'serious' || expression === 'fear') && (
          <path d="M242,295 L258,295" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" />
        )}
      </g>

      {/* Front: Fierce Layered Windswept Warrior Hair with Sharp Choppy Bangs & Temple Braid */}
      <g>
        {/* Textured Layered Crown & Choppy Bangs */}
        <path
          d="M174,175 C176,105 324,105 326,175 C336,205 330,240 322,265 C316,275 312,260 310,240 C306,205 298,190 288,245 C284,258 280,265 276,252 C270,225 264,200 255,238 C252,248 248,252 245,242 C240,215 232,200 224,248 C220,260 216,262 212,245 C206,215 198,205 192,260 C188,272 182,268 178,250 C172,225 168,200 174,175 Z"
          fill="url(#valeriaHairGrad)"
        />

        {/* Sharp Choppy Strand Shadow Accents */}
        <path d="M224,205 L220,245 M250,195 L247,238 M280,205 L278,248" stroke="#431407" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Sleek Warrior Temple Braid on Left with Silver Clasps */}
        <g>
          {/* Compact braid close to temple */}
          <path d="M184,215 L182,280" stroke="#7c2d12" strokeWidth="5" strokeLinecap="round" />
          <path d="M184,215 L182,280" stroke="#ea580c" strokeWidth="3" strokeDasharray="3,3" />
          {/* Silver Clasp Rings */}
          <rect x="179" y="235" width="7" height="3.5" rx="1" fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
          <rect x="178" y="260" width="7" height="3.5" rx="1" fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
        </g>

        {/* Sharp Fiery Copper Highlights */}
        <ellipse cx="250" cy="145" rx="50" ry="7" fill="url(#valeriaHairHighlight)" />
      </g>
    </svg>
  );
};

/**
 * Eldritch Shadow Entity
 */
const ShadowSprite: React.FC<{ expression: CharacterExpression }> = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-red-950/60 rounded-full blur-3xl animate-pulse" />
        <svg viewBox="0 0 200 300" className="w-full h-full filter drop-shadow-[0_0_30px_rgba(225,29,72,0.8)]">
          <path
            d="M100,20 C60,40 40,90 45,160 C30,210 20,270 100,290 C180,270 170,210 155,160 C160,90 140,40 100,20 Z"
            fill="#050103"
            opacity="0.95"
          />
          <circle cx="80" cy="110" r="6" fill="#e11d48" className="animate-ping" />
          <circle cx="80" cy="110" r="4" fill="#ffffff" />
          <circle cx="120" cy="110" r="6" fill="#e11d48" className="animate-ping" />
          <circle cx="120" cy="110" r="4" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
};

/**
 * BEATRICE - The Seductive Shadow Seneschal & Aristocratic Housekeeper
 * Authentic design matching her true gothic identity:
 * - Sleek, glossy center-parted obsidian hair swept up into an immaculate high chignon bun (no maid cap or bonnet)
 *   with delicate sensual loose tendrils framing her graceful neck and aristocratic jawline.
 * - Seductive, fitted gothic noir silk & tailored velvet gown with a deeply flattering sweetheart corset neckline,
 *   sculpted waistline hugging sensual curves, delicate dark eyelash lace, and an ornate emerald & filigree silver brooch.
 * - Commanding yet sultry piercing emerald eyes with winged liner and lush lashes.
 * - Plump crimson-berry lips with high-gloss sheen and a subtle, alluring smirk.
 * - Slender hands with an antique silver chatelaine and Ravenscroft master keys resting at her shapely hip.
 */
const BeatriceSprite: React.FC<{ expression: CharacterExpression; isPortrait?: boolean }> = ({
  expression,
  isPortrait = false,
}) => {
  return (
    <svg
      viewBox={isPortrait ? "60 95 380 430" : "0 0 500 700"}
      className="w-full h-full object-contain filter drop-shadow-2xl"
      preserveAspectRatio={isPortrait ? "xMidYMid meet" : "xMidYMax meet"}
    >
      <defs>
        {/* Sleek Obsidian Silk Hair */}
        <linearGradient id="beatriceHairObsidian" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e222d" />
          <stop offset="35%" stopColor="#11151e" />
          <stop offset="70%" stopColor="#080a0f" />
          <stop offset="100%" stopColor="#020305" />
        </linearGradient>
        <linearGradient id="beatriceHairSheen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1e222d" stopOpacity="0" />
        </linearGradient>

        {/* Midnight Velvet & Tailored Satin Gown */}
        <linearGradient id="beatriceGothicVelvet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#252a36" />
          <stop offset="30%" stopColor="#161922" />
          <stop offset="70%" stopColor="#0b0d13" />
          <stop offset="100%" stopColor="#030406" />
        </linearGradient>

        {/* Sensual Aristocratic Fair Porcelain Skin */}
        <linearGradient id="beatriceNobleSkin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8f8" />
          <stop offset="60%" stopColor="#ffe4e6" />
          <stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>

        {/* Piercing, Commanding Emerald Irises */}
        <radialGradient id="beatriceEmeraldEye" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="25%" stopColor="#6ee7b7" />
          <stop offset="55%" stopColor="#10b981" />
          <stop offset="85%" stopColor="#047857" />
          <stop offset="100%" stopColor="#022c22" />
        </radialGradient>

        {/* Ornate Antique Silver & Emerald Brooch */}
        <radialGradient id="broochGem" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#064e3b" />
        </radialGradient>
      </defs>

      {/* ============================================================== */}
      {/* LAYER 1: BACK HAIR - ARISTOCRATIC HIGH CHIGNON & FALLING TRESSES */}
      {/* ============================================================== */}
      <g>
        {/* Large Elegant High Crown Chignon Bun sitting atop head */}
        <ellipse cx="250" cy="115" rx="58" ry="42" fill="url(#beatriceHairObsidian)" />
        {/* Intricate Braided Twist Rings of the Bun */}
        <path
          d="M205,115 C215,85 285,85 295,115 C285,145 215,145 205,115 Z"
          fill="none"
          stroke="#334155"
          strokeWidth="1.8"
          opacity="0.6"
        />
        <path
          d="M220,115 C230,95 270,95 280,115 C270,135 230,135 220,115 Z"
          fill="none"
          stroke="#475569"
          strokeWidth="1.2"
          opacity="0.7"
        />
        {/* Antique Silver Filigree Hairpin with Emerald Gem */}
        <line x1="210" y1="130" x2="290" y2="95" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="212" cy="129" r="4.5" fill="url(#broochGem)" stroke="#e2e8f0" strokeWidth="1" />

        {/* Lower Back Hair Cascading Smoothly Behind Neck and Shoulders */}
        <path
          d="M175,160 C165,220 170,300 185,355 L315,355 C330,300 335,220 325,160 Z"
          fill="url(#beatriceHairObsidian)"
        />
      </g>

      {/* ============================================================== */}
      {/* LAYER 2: SHOULDERS, DÉCOLLETÉ, CHOKER & TAILORED VELVET GOWN   */}
      {/* ============================================================== */}
      <g>
        {/* Fair Porcelain Shoulders & Upper Chest */}
        <path
          d="M130,395 C150,360 185,335 220,330 L280,330 C315,335 350,360 370,395 C380,430 365,465 350,470 L150,470 C135,465 120,430 130,395 Z"
          fill="url(#beatriceNobleSkin)"
        />

        {/* Slender Clavicle Bones */}
        <path d="M190,365 Q225,372 245,366" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />
        <path d="M310,365 Q275,372 255,366" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />

        {/* Graceful Neck */}
        <path d="M220,290 L220,345 C235,355 265,355 280,345 L280,290 Z" fill="url(#beatriceNobleSkin)" />

        {/* Black Velvet Choker with Antique Silver & Emerald Brooch */}
        <path d="M220,332 C235,340 265,340 280,332" stroke="#0a0d14" strokeWidth="8" fill="none" />
        {/* Gothic Filigree Brooch */}
        <polygon points="250,334 243,342 250,352 257,342" fill="#94a3b8" />
        <circle cx="250" cy="342" r="4.5" fill="url(#broochGem)" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="249" cy="340" r="1.5" fill="#ffffff" />

        {/* Midnight Velvet & Noir Gown (Matching Vivienne/Evangeline silhouette) */}
        <path
          d="M130,400 C170,410 205,425 250,410 C295,425 330,410 370,400 L425,700 L75,700 Z"
          fill="url(#beatriceGothicVelvet)"
        />
        {/* Gown Velvet Folds */}
        <path
          d="M175,410 Q210,480 190,700 M325,410 Q290,480 310,700 M250,420 L250,700"
          stroke="#0b0d13"
          strokeWidth="3.5"
          fill="none"
          opacity="0.8"
        />

        {/* Scalloped Eyelash Lace Trim along Sweetheart Neckline */}
        <path
          d="M130,400 C165,412 210,428 250,412 C290,428 335,412 370,400"
          stroke="#10b981"
          strokeWidth="1.8"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M135,402 Q145,408 155,403 Q165,410 175,405 Q185,412 195,407 Q210,416 225,412 Q235,416 250,413 Q265,416 275,412 Q290,416 305,407 Q315,412 325,405 Q335,410 345,403 Q355,408 365,402"
          stroke="#020305"
          strokeWidth="2.2"
          fill="none"
          opacity="0.9"
        />

        {/* Fitted Velvet Sleeves */}
        <path
          d="M125,400 C110,420 100,450 115,480 C130,485 140,440 138,405 Z"
          fill="url(#beatriceGothicVelvet)"
        />
        <path
          d="M375,400 C390,420 400,450 385,480 C370,485 360,440 362,405 Z"
          fill="url(#beatriceGothicVelvet)"
        />
        {/* Scalloped Black Lace Cuffs at Wrists */}
        <path d="M102,475 Q115,485 128,475 Q138,485 148,475" stroke="#334155" strokeWidth="2" fill="none" />
        <path d="M352,475 Q362,485 372,475 Q385,485 398,475" stroke="#334155" strokeWidth="2" fill="none" />

        {/* Porcelain Forearms and Graceful Hands Resting at Waist */}
        <g>
          {/* Left Forearm */}
          <path
            d="M115,480 C125,510 155,535 185,545 C192,540 188,530 175,520 C150,505 130,485 125,480 Z"
            fill="url(#beatriceNobleSkin)"
          />
          {/* Left Hand with Dark Manicured Nails */}
          <path
            d="M185,545 C195,548 215,555 228,560 C232,562 230,556 220,550 C210,545 195,540 188,540 Z"
            fill="url(#beatriceNobleSkin)"
            stroke="#fca5a5"
            strokeWidth="0.8"
          />
          <circle cx="227" cy="559" r="1.2" fill="#064e3b" />

          {/* Right Forearm */}
          <path
            d="M385,480 C375,510 345,535 315,545 C308,540 312,530 325,520 C350,505 370,485 375,480 Z"
            fill="url(#beatriceNobleSkin)"
          />
          {/* Right Hand with Dark Manicured Nails */}
          <path
            d="M315,545 C305,548 285,555 272,560 C268,562 270,556 280,550 C290,545 305,540 312,540 Z"
            fill="url(#beatriceNobleSkin)"
            stroke="#fca5a5"
            strokeWidth="0.8"
          />
          <circle cx="273" cy="559" r="1.2" fill="#064e3b" />
        </g>

        {/* Silver Chatelaine & Ravenscroft Master Skeleton Keys at Hip */}
        <g transform="translate(195, 520)">
          <circle cx="0" cy="0" r="7" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#10b981" />
          <path d="M-2,6 Q-6,22 -3,38" stroke="#94a3b8" strokeWidth="1.4" fill="none" />
          <path d="M2,6 Q4,26 1,44" stroke="#cbd5e1" strokeWidth="1.4" fill="none" />
          <g transform="translate(-2, 40) rotate(15)">
            <circle cx="0" cy="0" r="6" fill="none" stroke="#e2e8f0" strokeWidth="2" />
            <line x1="0" y1="6" x2="0" y2="34" stroke="#e2e8f0" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M0,24 L5,24 M0,29 L7,29 M0,32 L4,32" stroke="#e2e8f0" strokeWidth="1.8" />
          </g>
        </g>
      </g>

      {/* ============================================================== */}
      {/* LAYER 3: ARISTOCRATIC HEAD, INTENSE EMERALD GAZE & LIPS        */}
      {/* ============================================================== */}
      <g>
        {/* Head / Aristocratic Oval Face with High Cheekbones */}
        <path
          d="M185,190 C175,265 200,320 250,330 C300,320 325,265 315,190 C310,120 190,120 185,190 Z"
          fill="url(#beatriceNobleSkin)"
        />

        {/* Subtle Rosy Blush on High Cheekbones */}
        {(expression === 'blushing' || expression === 'seductive') && (
          <g opacity="0.75">
            <ellipse cx="205" cy="275" rx="15" ry="8" fill="#fb7185" />
            <ellipse cx="295" cy="275" rx="15" ry="8" fill="#fb7185" />
            <path d="M198,272 L202,278 M205,271 L209,277 M212,272 L216,278" stroke="#be123c" strokeWidth="1.2" />
            <path d="M288,272 L292,278 M295,271 L299,277 M302,272 L306,278" stroke="#be123c" strokeWidth="1.2" />
          </g>
        )}

        {/* PIERCING, COMMANDING EMERALD EYES WITH SHARP FELINE LINER */}
        <g>
          {/* Left Eye */}
          <path d="M194,244 C206,233 228,233 238,247" stroke="#090d16" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M194,244 L188,239 M238,247 L244,243" stroke="#090d16" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="217" cy="247" rx="10.5" ry="12.5" fill="url(#beatriceEmeraldEye)" />
          <circle cx="217" cy="248" r="4.2" fill="#022c22" />
          <circle cx="213" cy="243" r="3" fill="#ffffff" />
          <circle cx="221" cy="252" r="1.4" fill="#ffffff" opacity="0.85" />
          <path d="M205,258 Q216,263 227,258" stroke="#059669" strokeWidth="1.2" fill="none" opacity="0.8" />
        </g>

        {/* Right Eye */}
        <g>
          <path d="M306,244 C294,233 272,233 262,247" stroke="#090d16" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M306,244 L312,239 M262,247 L256,243" stroke="#090d16" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="283" cy="247" rx="10.5" ry="12.5" fill="url(#beatriceEmeraldEye)" />
          <circle cx="283" cy="248" r="4.2" fill="#022c22" />
          <circle cx="279" cy="243" r="3" fill="#ffffff" />
          <circle cx="287" cy="252" r="1.4" fill="#ffffff" opacity="0.85" />
          <path d="M273,258 Q284,263 295,258" stroke="#059669" strokeWidth="1.2" fill="none" opacity="0.8" />
        </g>

        {/* Elegant, High-Arched Seductive Eyebrows */}
        <path d="M196,226 Q216,218 236,227" stroke="#0f172a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M304,226 Q284,218 264,227" stroke="#0f172a" strokeWidth="2.4" fill="none" strokeLinecap="round" />

        {/* Aristocratic Nose */}
        <ellipse cx="250" cy="270" rx="1.2" ry="2" fill="#f43f5e" opacity="0.5" />

        {/* Seductive, Plump Crimson-Berry Lips */}
        {expression === 'seductive' ? (
          <g>
            <path d="M239,294 Q249,301 262,293" stroke="#be123c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M243,295 Q250,303 257,295" fill="#e11d48" opacity="0.95" />
            <circle cx="251" cy="299" r="1.3" fill="#ffffff" opacity="0.9" />
          </g>
        ) : expression === 'smile' ? (
          <g>
            <path d="M240,294 Q250,302 260,294" stroke="#be123c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M244,295 Q250,300 256,295" fill="#e11d48" opacity="0.85" />
            <circle cx="249" cy="298" r="1.2" fill="#ffffff" />
          </g>
        ) : (
          <g>
            <path d="M241,295 Q250,299 259,295" stroke="#be123c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <ellipse cx="250" cy="297" rx="5.5" ry="2.2" fill="#e11d48" opacity="0.85" />
            <circle cx="249" cy="296" r="1.2" fill="#ffffff" />
          </g>
        )}
      </g>

      {/* ============================================================== */}
      {/* LAYER 4: CENTER-PARTED JET-BLACK HAIR & SENSUAL WISPS          */}
      {/* ============================================================== */}
      <g>
        {/* Sleek, Center-Parted Crown Framing Her Forehead & Temples */}
        <path
          d="M185,190 C185,130 236,115 250,122 C264,115 315,130 315,190 C305,200 292,175 272,165 C256,158 250,174 250,174 C250,174 244,158 228,165 C208,175 195,200 185,190 Z"
          fill="url(#beatriceHairObsidian)"
        />
        {/* Distinct Crisp Center Parting Line */}
        <line x1="250" y1="120" x2="250" y2="174" stroke="#020305" strokeWidth="1.5" />

        {/* Hair Highlights */}
        <ellipse cx="250" cy="145" rx="45" ry="6" fill="url(#beatriceHairSheen)" />

        {/* Sensual Loose Tendrils Falling Along Her Neck */}
        <path d="M192,185 C186,240 196,285 206,325 C209,320 200,265 198,210 Z" fill="url(#beatriceHairObsidian)" />
        <path d="M308,185 C314,240 304,285 294,325 C291,320 300,265 302,210 Z" fill="url(#beatriceHairObsidian)" />
      </g>
    </svg>
  );
};

/**
 * MORRIGAN - The Tower Alchemist & Arcane Scholar
 * Rendered in the exact cohesive visual novel anime sprite art style as Vivienne, Evangeline & Valeria:
 * - Matching standard VN viewport (0 0 500 700, portrait 60 95 380 430) and proportions (chin y=330, eyes y=247).
 * - Softer, wiser facial features with serene almond-shaped amethyst eyes brimming with ancient intellect.
 * - Sleek obsidian raven-black hair parted neatly down the center, falling over her shoulders.
 * - Sensual aristocratic porcelain skin, sheer ruffled Victorian tulle collar and translucent smoky-black chiffon décolletage.
 * - Deep sweetheart black leather and violet velvet corset with silver buckle straps and an occult silver runic talisman.
 * - Billowing sheer bishop sleeves with ruffled cuffs, cradling a glowing emerald alchemical flask and ancient leather grimoire at her waist.
 * - Flowing dark occult scholar skirt cascading gracefully down to the floor.
 */
const MorriganSprite: React.FC<{ expression: CharacterExpression; isPortrait?: boolean }> = ({
  expression,
  isPortrait = false,
}) => {
  return (
    <svg
      viewBox={isPortrait ? "60 95 380 430" : "0 0 500 700"}
      className="w-full h-full object-contain filter drop-shadow-2xl"
      preserveAspectRatio={isPortrait ? "xMidYMid meet" : "xMidYMax meet"}
    >
      <defs>
        {/* Sleek Obsidian Jet-Black Hair */}
        <linearGradient id="morriganObsidianHair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b2e" />
          <stop offset="25%" stopColor="#12101c" />
          <stop offset="65%" stopColor="#08070e" />
          <stop offset="100%" stopColor="#020104" />
        </linearGradient>
        <linearGradient id="morriganHairGloss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#6b21a8" stopOpacity="0" />
        </linearGradient>

        {/* Polished Black Leather & Velvet Corset */}
        <linearGradient id="morriganCorsetLeather" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e273b" />
          <stop offset="35%" stopColor="#181522" />
          <stop offset="70%" stopColor="#0d0b13" />
          <stop offset="100%" stopColor="#050408" />
        </linearGradient>

        {/* Translucent Smoky-Black Chiffon Mesh */}
        <linearGradient id="morriganSmokyChiffon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1224" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#2d1f3d" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#0e0a14" stopOpacity="0.75" />
        </linearGradient>

        {/* Fair Aristocratic Porcelain Skin */}
        <linearGradient id="morriganPorcelainSkin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8f8" />
          <stop offset="60%" stopColor="#ffe4e6" />
          <stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>

        {/* Deep, Wise Amethyst / Violet Eyes */}
        <radialGradient id="morriganAmethystGaze" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="25%" stopColor="#d8b4fe" />
          <stop offset="55%" stopColor="#a855f7" />
          <stop offset="85%" stopColor="#6b21a8" />
          <stop offset="100%" stopColor="#2e1065" />
        </radialGradient>

        {/* Antique Silver Amulet Metallic */}
        <linearGradient id="morriganSilverSigil" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Glowing Alchemical Elixir */}
        <radialGradient id="elixirPotionGlow" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="40%" stopColor="#10b981" />
          <stop offset="85%" stopColor="#047857" />
          <stop offset="100%" stopColor="#022c22" />
        </radialGradient>
      </defs>

      {/* ============================================================== */}
      {/* LAYER 1: BACK HAIR - JET BLACK OBSIDIAN TRESSES                */}
      {/* ============================================================== */}
      <g>
        {/* Main Back Hair Volume Flowing Behind Neck and Shoulders */}
        <path
          d="M175,160 C165,220 168,300 178,440 L322,440 C332,300 335,220 325,160 Z"
          fill="url(#morriganObsidianHair)"
        />
        {/* Soft undulating tresses at base */}
        <path
          d="M178,440 C176,520 182,600 188,680 L312,680 C318,600 324,520 322,440 Z"
          fill="url(#morriganObsidianHair)"
          opacity="0.9"
        />
      </g>

      {/* ============================================================== */}
      {/* LAYER 2: SHOULDERS, DÉCOLLETÉ, RUFFLED COLLAR & CORSET GOWN    */}
      {/* ============================================================== */}
      <g>
        {/* Fair Porcelain Shoulders & Upper Chest */}
        <path
          d="M130,395 C150,360 185,335 220,330 L280,330 C315,335 350,360 370,395 C380,430 365,465 350,470 L150,470 C135,465 120,430 130,395 Z"
          fill="url(#morriganPorcelainSkin)"
        />

        {/* Slender Clavicle Bones */}
        <path d="M190,365 Q225,372 245,366" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />
        <path d="M310,365 Q275,372 255,366" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />

        {/* Graceful Neck */}
        <path d="M220,290 L220,345 C235,355 265,355 280,345 L280,290 Z" fill="url(#morriganPorcelainSkin)" />

        {/* Sheer Ruffled Victorian Tulle High Collar */}
        <path
          d="M216,325 C230,336 270,336 284,325 L286,342 C270,352 230,352 214,342 Z"
          fill="url(#morriganSmokyChiffon)"
          stroke="#a855f7"
          strokeWidth="1.2"
          opacity="0.85"
        />
        {/* Tiny Delicate Ruffles */}
        <path
          d="M214,325 Q220,320 226,325 Q232,320 238,325 Q244,320 250,325 Q256,320 262,325 Q268,320 274,325 Q280,320 286,325"
          stroke="#c084fc"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />

        {/* Antique Silver Occult Runic Talisman on Chest */}
        <g transform="translate(250, 368)">
          <path d="M-18,-35 L0,0 L18,-35" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
          <circle cx="0" cy="0" r="12" fill="url(#morriganSilverSigil)" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="9" fill="#181522" stroke="#a855f7" strokeWidth="0.8" />
          {/* Inner Arcane Star / Sigil */}
          <polygon points="0,-7 6,4 -7,-2 7,-2 -6,4" fill="none" stroke="#d8b4fe" strokeWidth="1" />
          <circle cx="0" cy="0" r="2.5" fill="#a855f7" />
        </g>

        {/* Dark Occult Scholar Skirt Flowing to Floor */}
        <path
          d="M130,400 C170,410 205,425 250,410 C295,425 330,410 370,400 L425,700 L75,700 Z"
          fill="#13101c"
        />
        <path
          d="M175,410 Q210,480 190,700 M325,410 Q290,480 310,700 M250,420 L250,700"
          stroke="#261b36"
          strokeWidth="3.2"
          fill="none"
          opacity="0.75"
        />

        {/* Sweetheart Leather & Violet Velvet Corset Bodice */}
        <path
          d="M135,400 C165,412 210,426 250,412 C290,426 335,412 365,400 L370,485 C335,498 290,502 250,502 C210,502 165,498 130,485 Z"
          fill="url(#morriganCorsetLeather)"
          stroke="#09080e"
          strokeWidth="1.4"
        />
        {/* Corset Silver Buckle Straps */}
        <g stroke="#94a3b8" strokeWidth="1.8" fill="none">
          <line x1="210" y1="435" x2="290" y2="435" />
          <rect x="244" y="430" width="12" height="10" rx="2" fill="#1e1b2e" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="215" y1="460" x2="285" y2="460" />
          <rect x="245" y="455" width="10" height="10" rx="2" fill="#1e1b2e" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="220" y1="485" x2="280" y2="485" />
          <rect x="246" y="480" width="8" height="10" rx="2" fill="#1e1b2e" stroke="#e2e8f0" strokeWidth="1.5" />
        </g>

        {/* Billowing Translucent Smoky Chiffon Bishop Sleeves */}
        <path
          d="M125,400 C100,425 90,460 110,490 C125,495 140,460 138,405 Z"
          fill="url(#morriganSmokyChiffon)"
          stroke="#581c87"
          strokeWidth="1"
        />
        <path
          d="M375,400 C400,425 410,460 390,490 C375,495 360,460 362,405 Z"
          fill="url(#morriganSmokyChiffon)"
          stroke="#581c87"
          strokeWidth="1"
        />
        {/* Ruffled Sleeve Cuffs */}
        <path d="M98,485 Q110,495 122,485" stroke="#a855f7" strokeWidth="2" fill="none" />
        <path d="M378,485 Q390,495 402,485" stroke="#a855f7" strokeWidth="2" fill="none" />

        {/* Porcelain Forearms and Graceful Scholar Hands at Waist */}
        <g>
          {/* Left Forearm angled holding glowing potion flask */}
          <path
            d="M110,490 C120,518 150,538 180,548 C188,542 184,532 170,522 C148,506 128,488 120,485 Z"
            fill="url(#morriganPorcelainSkin)"
          />
          {/* Left Hand Holding Glass Potion Flask */}
          <g transform="translate(195, 545)">
            <circle cx="0" cy="8" r="14" fill="url(#elixirPotionGlow)" opacity="0.9" />
            <circle cx="0" cy="8" r="14" fill="none" stroke="#a7f3d0" strokeWidth="1.2" />
            <rect x="-4" y="-8" width="8" height="7" rx="1" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="-3" cy="5" r="2" fill="#ffffff" opacity="0.8" />
            <circle cx="4" cy="9" r="1.5" fill="#ffffff" opacity="0.8" />
            <path d="M-6,-4 C-3,-6 3,-6 6,-4" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>

          {/* Right Forearm angled holding Arcane Grimoire */}
          <path
            d="M390,490 C380,518 350,538 320,548 C312,542 316,532 330,522 C352,506 372,488 380,485 Z"
            fill="url(#morriganPorcelainSkin)"
          />
          {/* Right Hand Cradling Ancient Leather Grimoire */}
          <g transform="translate(290, 525)">
            <rect x="0" y="0" width="36" height="48" rx="3" fill="#291102" stroke="#78350f" strokeWidth="1.8" transform="rotate(-15)" />
            <polygon points="0,0 10,0 0,10" fill="#f59e0b" transform="rotate(-15)" />
            <polygon points="26,0 36,0 36,10" fill="#f59e0b" transform="rotate(-15)" />
            <path d="M2,18 C12,16 22,18 28,24" stroke="#fca5a5" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <circle cx="28" cy="24" r="1.2" fill="#701a75" />
          </g>
        </g>
      </g>

      {/* ============================================================== */}
      {/* LAYER 3: SOFT NOBLE FACE, WISE AMETHYST EYES & LIPS             */}
      {/* ============================================================== */}
      <g>
        {/* Soft, Noble Oval Visage with Gentle Contours (Matching standard VN scale chin y=330) */}
        <path
          d="M185,190 C175,265 200,320 250,330 C300,320 325,265 315,190 C310,120 190,120 185,190 Z"
          fill="url(#morriganPorcelainSkin)"
        />

        {/* Gentle, Serene Cheek Contouring and Intellectual Warmth */}
        <ellipse cx="205" cy="275" rx="14" ry="7" fill="#f43f5e" opacity={expression === 'blushing' ? "0.45" : "0.15"} />
        <ellipse cx="295" cy="275" rx="14" ry="7" fill="#f43f5e" opacity={expression === 'blushing' ? "0.45" : "0.15"} />

        {/* WISE, CONTEMPLATIVE AMETHYST EYES (Gentle, Deep Arcane Wisdom) */}
        <g>
          {/* Left Eye - Calmer, Wiser Almond Shape at standard scale */}
          <g>
            <ellipse cx="217" cy="246" rx="11" ry="6" fill="#2e1065" opacity="0.25" />
            {/* Elegant, Composed Upper Eyelid - Serene and Wise */}
            <path d="M197,245 C206,236 226,236 236,247" stroke="#12101c" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <ellipse cx="217" cy="248" rx="9.5" ry="11.5" fill="url(#morriganAmethystGaze)" />
            {/* Deep Pupil with Arcane Focus */}
            <circle cx="217" cy="248" r="4.2" fill="#1e1035" />
            {/* Gentle Luminous Starlight Sparkle */}
            <circle cx="214" cy="243" r="2.8" fill="#ffffff" />
            <circle cx="221" cy="252" r="1.4" fill="#ffffff" opacity="0.85" />
            {/* Contemplative Lower Lash Line */}
            <path d="M205,258 Q216,263 227,258" stroke="#9333ea" strokeWidth="1.1" fill="none" opacity="0.75" />
          </g>

          {/* Right Eye - Symmetrical Wise Almond Shape */}
          <g>
            <ellipse cx="283" cy="246" rx="11" ry="6" fill="#2e1065" opacity="0.25" />
            <path d="M303,245 C294,236 274,236 264,247" stroke="#12101c" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <ellipse cx="283" cy="248" rx="9.5" ry="11.5" fill="url(#morriganAmethystGaze)" />
            <circle cx="283" cy="248" r="4.2" fill="#1e1035" />
            <circle cx="280" cy="243" r="2.8" fill="#ffffff" />
            <circle cx="287" cy="252" r="1.4" fill="#ffffff" opacity="0.85" />
            <path d="M273,258 Q284,263 295,258" stroke="#9333ea" strokeWidth="1.1" fill="none" opacity="0.75" />
          </g>

          {/* Thoughtful, Poised Eyebrows Radiating Ancient Intellect & Wisdom */}
          <path d="M197,227 Q215,221 234,228" stroke="#12101c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M303,227 Q285,221 266,228" stroke="#12101c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>

        {/* Straight, Delicate Aristocratic Nose */}
        <ellipse cx="250" cy="271" rx="1.2" ry="2" fill="#e879f9" opacity="0.45" />

        {/* Serene, Knowing Mauve-Berry Lips of a Wise Mage */}
        {expression === 'seductive' ? (
          <g>
            {/* Subtle, Knowing Sage Smirk */}
            <path d="M240,294 Q250,301 261,293" stroke="#701a75" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <ellipse cx="250" cy="297" rx="5.8" ry="2.6" fill="#a21caf" />
            <circle cx="249" cy="296" r="1.3" fill="#ffffff" opacity="0.85" />
          </g>
        ) : expression === 'blushing' ? (
          <g>
            <path d="M241,295 Q250,299 259,295" stroke="#701a75" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <ellipse cx="250" cy="297" rx="5.4" ry="2.4" fill="#a21caf" />
            <circle cx="249" cy="296" r="1.2" fill="#ffffff" />
          </g>
        ) : expression === 'smile' ? (
          <g>
            <path d="M240,294 Q250,301 260,294" stroke="#701a75" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <ellipse cx="250" cy="297" rx="5.6" ry="2.5" fill="#a21caf" />
            <circle cx="249" cy="296" r="1.2" fill="#ffffff" />
          </g>
        ) : (
          <g>
            {/* Composed, Serene Scholarly Lips */}
            <path d="M241,295 Q250,299 259,295" stroke="#701a75" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <ellipse cx="250" cy="297" rx="5.4" ry="2.2" fill="#a21caf" />
            <circle cx="249" cy="296" r="1.2" fill="#ffffff" opacity="0.8" />
          </g>
        )}
      </g>

      {/* ============================================================== */}
      {/* LAYER 4: SLEEK CENTER-PARTED JET-BLACK HAIR                    */}
      {/* ============================================================== */}
      <g>
        {/* Crown Hair with Crisp Center Parting */}
        <path
          d="M185,190 C185,130 236,115 250,122 C264,115 315,130 315,190 C305,200 292,175 272,165 C256,158 250,174 250,174 C250,174 244,158 228,165 C208,175 195,200 185,190 Z"
          fill="url(#morriganObsidianHair)"
        />
        {/* Precise Center Parting Line */}
        <line x1="250" y1="120" x2="250" y2="174" stroke="#050408" strokeWidth="1.5" />

        {/* Glossy Hair Highlights */}
        <ellipse cx="250" cy="145" rx="45" ry="6" fill="url(#morriganHairGloss)" />

        {/* Straight Sleek Framing Locks Falling in Front Across Shoulders and Bust */}
        {/* Left Side Hair */}
        <path
          d="M192,185 C186,240 190,300 200,380 C208,380 212,330 208,270 C206,225 204,185 208,170 Z"
          fill="url(#morriganObsidianHair)"
        />
        {/* Right Side Hair */}
        <path
          d="M308,185 C314,240 310,300 300,380 C292,380 288,330 292,270 C294,225 296,185 292,170 Z"
          fill="url(#morriganObsidianHair)"
        />
      </g>
    </svg>
  );
};

/**
 * LADY LENORE - Melancholic Mirror Ghost & Tragic Bride
 * Rendered in the exact cohesive visual novel anime sprite art style as Vivienne, Evangeline & Valeria:
 * - Matching standard VN viewport (0 0 500 700, portrait 60 95 380 430) and proportions (chin y=330, eyes y=247).
 * - Innocent, doll-like delicate face with sweet rounded cheeks and breathless pale rosebud lips.
 * - Straight silky silver bangs (kahkül) across her forehead with moonlit sheen, and long straight silver tresses cascading to her hips.
 * - Wide, innocent, dewy electric-cyan anime eyes with heartbreaking crystalline tears streaming down her pale cheeks.
 * - Antique Victorian/Edwardian lace wedding gown with sweetheart neckline, corseted bodice, sheer lace sleeves, and mist-dissolving bridal skirt.
 * - Holding a bouquet of withered white bridal roses in her translucent hands, bathed in an ethereal celestial cyan spirit halo.
 */
const LenoreSprite: React.FC<{ expression: CharacterExpression; isPortrait?: boolean }> = ({
  expression,
  isPortrait = false,
}) => {
  return (
    <svg
      viewBox={isPortrait ? "60 95 380 430" : "0 0 500 700"}
      className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(56,189,248,0.55)]"
      preserveAspectRatio={isPortrait ? "xMidYMid meet" : "xMidYMax meet"}
    >
      <defs>
        {/* Spectral Celestial Halo Aura */}
        <radialGradient id="lenoreGhostHalo" cx="50%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#0284c7" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
        </radialGradient>

        {/* Shimmering Long Straight Silver-White Hair */}
        <linearGradient id="lenoreSilverHairBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#f0f9ff" />
          <stop offset="60%" stopColor="#e0f2fe" />
          <stop offset="85%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
        <linearGradient id="lenoreSilverHairShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="50%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="lenoreHairLuminance" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
        </linearGradient>

        {/* Ethereal Glowing Cyan/Electric Blue Eyes */}
        <radialGradient id="lenoreElectricIris" cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#e0f2fe" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="80%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#082f49" />
        </radialGradient>

        {/* Glistening Cyan Tear Trails */}
        <linearGradient id="lenoreCyanTearTrail" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
        </linearGradient>

        {/* Translucent Ghostly Porcelain Skin */}
        <linearGradient id="lenoreGhostSkin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f8fafc" />
          <stop offset="75%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Antique Ivory Silk & Embroidered Lace */}
        <linearGradient id="lenoreBridalSilk" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#f8fafc" stopOpacity="0.9" />
          <stop offset="75%" stopColor="#e2e8f0" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.5" />
        </linearGradient>

        {/* Sheer Tattered Veil Gauze */}
        <linearGradient id="lenoreVeilMesh" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.2" />
        </linearGradient>

        {/* Dissolving Mist Fade for Lower Skirt */}
        <linearGradient id="lenoreMistDissolve" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ============================================================== */}
      {/* LAYER 1: ETHEREAL CYAN RADIANCE & CELESTIAL SPIRIT HALO        */}
      {/* ============================================================== */}
      <circle cx="250" cy="270" r="180" fill="url(#lenoreGhostHalo)" className="animate-pulse" />

      {/* ============================================================== */}
      {/* LAYER 2: LONG STRAIGHT SILKY SILVER HAIR AT BACK               */}
      {/* ============================================================== */}
      <g>
        {/* Left Side: Long Straight Silk Tresses Cascading Past Waist and Hips */}
        <path
          d="M175,160 C165,220 160,320 156,440 C152,540 156,620 165,680 L205,680 C198,620 195,520 196,440 C198,340 200,240 205,165 Z"
          fill="url(#lenoreSilverHairBase)"
        />
        <path
          d="M165,180 C155,240 148,340 144,460 C140,550 144,630 152,670 C160,670 166,660 164,610 C160,520 162,420 175,280 Z"
          fill="url(#lenoreSilverHairShadow)"
        />

        {/* Right Side: Long Straight Silk Tresses Cascading Past Waist and Hips */}
        <path
          d="M325,160 C335,220 340,320 344,440 C348,540 344,620 335,680 L295,680 C302,620 305,520 304,440 C302,340 300,240 295,165 Z"
          fill="url(#lenoreSilverHairBase)"
        />
        <path
          d="M335,180 C345,240 352,340 356,460 C360,550 356,630 348,670 C340,670 334,660 336,610 C340,520 338,420 325,280 Z"
          fill="url(#lenoreSilverHairShadow)"
        />

        {/* Straight Vertical Silky Shimmer Highlights Streaming Down the Length */}
        <path d="M168,220 L162,380 L160,540 L166,660" stroke="url(#lenoreHairLuminance)" strokeWidth="1.8" fill="none" opacity="0.9" />
        <path d="M182,260 L178,420 L176,560 L180,665" stroke="url(#lenoreHairLuminance)" strokeWidth="1.4" fill="none" opacity="0.85" />
        <path d="M332,220 L338,380 L340,540 L334,660" stroke="url(#lenoreHairLuminance)" strokeWidth="1.8" fill="none" opacity="0.9" />
        <path d="M318,260 L322,420 L324,560 L320,665" stroke="url(#lenoreHairLuminance)" strokeWidth="1.4" fill="none" opacity="0.85" />
      </g>

      {/* ============================================================== */}
      {/* LAYER 3: TATTERED BRIDAL VEIL & WEDDING GOWN                   */}
      {/* ============================================================== */}
      <g>
        {/* Tattered Sheer Bridal Veil Flowing From Head Behind Arms */}
        <path
          d="M180,180 C140,240 115,340 105,460 C135,480 160,430 168,340 C170,260 178,200 185,180 Z"
          fill="url(#lenoreVeilMesh)"
        />
        <path
          d="M320,180 C360,240 385,340 395,460 C365,480 340,430 332,340 C330,260 322,200 315,180 Z"
          fill="url(#lenoreVeilMesh)"
        />
        {/* Scalloped Veil Lace Edging */}
        <path
          d="M105,460 Q120,475 135,460 Q150,475 160,450"
          stroke="#ffffff"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3,2"
        />
        <path
          d="M395,460 Q380,475 365,460 Q350,475 340,450"
          stroke="#ffffff"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3,2"
        />

        {/* Translucent Ghostly Porcelain Shoulders & Upper Chest */}
        <path
          d="M130,395 C150,360 185,335 220,330 L280,330 C315,335 350,360 370,395 C380,430 365,465 350,470 L150,470 C135,465 120,430 130,395 Z"
          fill="url(#lenoreGhostSkin)"
        />

        {/* Slender Clavicle Bones */}
        <path d="M190,365 Q225,372 245,366" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M310,365 Q275,372 255,366" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* Graceful Neck */}
        <path d="M220,290 L220,345 C235,355 265,355 280,345 L280,290 Z" fill="url(#lenoreGhostSkin)" />

        {/* FLOATING BRIDAL SKIRT (DISSOLVING INTO MIST AT BOTTOM) */}
        <path
          d="M130,400 C170,410 205,425 250,410 C295,425 330,410 370,400 L425,700 L75,700 Z"
          fill="url(#lenoreMistDissolve)"
        />

        {/* Vintage Lace Overlays & Ruffled Flounces on Skirt */}
        <g stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.8">
          <path d="M175,450 Q250,490 325,450" strokeDasharray="5,3" />
          <path d="M155,510 Q250,560 345,510" strokeDasharray="6,4" />
          <path d="M135,580 Q250,635 365,580" strokeDasharray="6,4" />
          <path d="M190,420 C185,480 180,560 170,660" stroke="#93c5fd" strokeWidth="1.2" opacity="0.6" />
          <path d="M310,420 C315,480 320,560 330,660" stroke="#93c5fd" strokeWidth="1.2" opacity="0.6" />
        </g>

        {/* Sweetheart Bridal Corset Bodice with Boning */}
        <path
          d="M135,400 C165,412 210,426 250,412 C290,426 335,412 365,400 L370,485 C335,498 290,502 250,502 C210,502 165,498 130,485 Z"
          fill="url(#lenoreBridalSilk)"
          stroke="#cbd5e1"
          strokeWidth="1.2"
        />

        {/* Scalloped Vintage Lace Trim along the Sweetheart Neckline */}
        <path
          d="M135,402 Q145,408 155,403 Q165,410 175,405 Q185,412 195,407 Q210,416 225,412 Q235,416 250,413 Q265,416 275,412 Q290,416 305,407 Q315,412 325,405 Q335,410 345,403 Q355,408 365,402"
          stroke="#ffffff"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Corset Boning */}
        <g stroke="#93c5fd" strokeWidth="1" opacity="0.6">
          <line x1="215" y1="420" x2="218" y2="495" />
          <line x1="285" y1="420" x2="282" y2="495" />
          <line x1="235" y1="425" x2="238" y2="498" />
          <line x1="265" y1="425" x2="262" y2="498" />
        </g>

        {/* Translucent Sheer Lace Sleeves on Forearms */}
        <path
          d="M125,400 C105,425 95,460 115,490 C128,495 140,460 138,405 Z"
          fill="url(#lenoreVeilMesh)"
          stroke="#bae6fd"
          strokeWidth="1"
        />
        <path
          d="M375,400 C395,425 405,460 385,490 C372,495 360,460 362,405 Z"
          fill="url(#lenoreVeilMesh)"
          stroke="#bae6fd"
          strokeWidth="1"
        />
        {/* Scalloped Cuffs at Wrists */}
        <path d="M102,485 Q115,495 128,485" stroke="#ffffff" strokeWidth="1.8" fill="none" />
        <path d="M372,485 Q385,495 398,485" stroke="#ffffff" strokeWidth="1.8" fill="none" />

        {/* TRANSLUCENT HANDS HOLDING WITHERED WHITE ROSE BOUQUET AT WAIST */}
        <g transform="translate(250, 520)">
          {/* Bouquet Twig Stems & Thorny Vines */}
          <g stroke="#475569" strokeWidth="1.8" fill="none" strokeLinecap="round">
            <line x1="-12" y1="10" x2="-22" y2="55" />
            <line x1="-4" y1="12" x2="-8" y2="60" />
            <line x1="5" y1="12" x2="8" y2="60" />
            <line x1="14" y1="10" x2="20" y2="55" />
            <path d="M-15,25 L-19,22 M-6,35 L-10,33 M6,30 L10,28 M16,40 L20,38" />
          </g>

          {/* Slender Translucent Hands Clasped Around Stems */}
          {/* Left Hand */}
          <path
            d="M-30,5 C-22,0 -8,5 -6,18 C-12,24 -25,24 -32,16 Z"
            fill="url(#lenoreGhostSkin)"
          />
          <path d="M-22,12 C-16,15 -14,24 -18,30" stroke="url(#lenoreGhostSkin)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M-16,14 C-10,18 -8,26 -12,32" stroke="url(#lenoreGhostSkin)" strokeWidth="3.8" strokeLinecap="round" fill="none" />

          {/* Right Hand */}
          <path
            d="M30,5 C22,0 8,5 6,18 C12,24 25,24 32,16 Z"
            fill="url(#lenoreGhostSkin)"
          />
          <path d="M22,12 C16,15 14,24 18,30" stroke="url(#lenoreGhostSkin)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M16,14 C10,18 8,26 12,32" stroke="url(#lenoreGhostSkin)" strokeWidth="3.8" strokeLinecap="round" fill="none" />

          {/* BOUQUET OF WITHERED ANTIQUE WHITE ROSES */}
          {/* Rose 1 (Top Center) */}
          <g transform="translate(0, -8)">
            <ellipse cx="0" cy="0" rx="9" ry="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M-6,-2 Q0,-8 6,-2" stroke="#94a3b8" strokeWidth="1" fill="none" />
            <path d="M-5,3 Q0,8 5,3" stroke="#94a3b8" strokeWidth="1" fill="none" />
            <circle cx="0" cy="0" r="3.5" fill="#e2e8f0" />
          </g>
          {/* Rose 2 (Left) */}
          <g transform="translate(-16, 2) rotate(-15)">
            <ellipse cx="0" cy="0" rx="8" ry="7.5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M-5,-2 Q0,-7 5,-2" stroke="#94a3b8" strokeWidth="0.9" fill="none" />
            <circle cx="0" cy="0" r="3" fill="#e2e8f0" />
          </g>
          {/* Rose 3 (Right) */}
          <g transform="translate(16, 2) rotate(15)">
            <ellipse cx="0" cy="0" rx="8" ry="7.5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M-5,-2 Q0,-7 5,-2" stroke="#94a3b8" strokeWidth="0.9" fill="none" />
            <circle cx="0" cy="0" r="3" fill="#e2e8f0" />
          </g>
          {/* Faded Tattered Antique Silk Ribbon Bow trailing down */}
          <path d="M-6,22 Q-12,38 -8,52" stroke="#f1f5f9" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M6,22 Q12,38 8,52" stroke="#f1f5f9" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>
      </g>

      {/* ============================================================== */}
      {/* LAYER 4: INNOCENT DOLL-LIKE HEAD, DEWY CYAN EYES & TEARS       */}
      {/* ============================================================== */}
      <g>
        {/* Innocent, Youthful Tender Face with Softer Rounded Cheeks & Chin (Standard VN scale chin y=330) */}
        <path
          d="M185,190 C175,265 200,320 250,330 C300,320 325,265 315,190 C310,120 190,120 185,190 Z"
          fill="url(#lenoreGhostSkin)"
        />

        {/* Soft, Innocent Rosy-Blush Cheeks */}
        <ellipse cx="205" cy="275" rx="16" ry="8" fill="#f43f5e" opacity={expression === 'blushing' ? "0.6" : "0.26"} />
        <ellipse cx="295" cy="275" rx="16" ry="8" fill="#f43f5e" opacity={expression === 'blushing' ? "0.6" : "0.26"} />

        {/* INNOCENT, WIDE DEWY ELECTRIC CYAN EYES & STREAMING CELESTIAL TEARS */}
        <g>
          {/* LEFT EYE - Wide, Innocent, Dewy Doll-Like Aperture */}
          <g>
            <ellipse cx="217" cy="245" rx="13" ry="8" fill="#0284c7" opacity="0.2" />
            {/* Innocent, Wide Curved Upper Eyelid */}
            <path d="M195,245 C205,231 228,231 239,245" stroke="#0369a1" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            {/* Fine Delicate Innocent Lashes */}
            <path d="M200,235 L196,230" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M216,229 L216,224" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M233,235 L237,230" stroke="#0284c7" strokeWidth="1.2" />
            {/* Large Glowing Electric Cyan Iris */}
            <ellipse cx="217" cy="248" rx="10.5" ry="12" fill="url(#lenoreElectricIris)" />
            {/* Deep Pupil */}
            <circle cx="217" cy="248" r="4.2" fill="#082f49" />
            {/* Large Starry Innocent Light Highlights */}
            <circle cx="213" cy="243" r="3.4" fill="#ffffff" />
            <circle cx="221" cy="252" r="1.6" fill="#ffffff" opacity="0.95" />
            <circle cx="211" cy="250" r="1.2" fill="#e0f2fe" opacity="0.8" />
            {/* Lower Eye Dewy Moisture Line */}
            <path d="M204,258 Q217,265 230,258" stroke="#38bdf8" strokeWidth="1.4" fill="none" opacity="0.9" />

            {/* GLISTENING CYAN TEAR STREAMING DOWN LEFT CHEEK */}
            <path
              d="M214,260 Q211,276 209,296 Q208,304 209,312"
              stroke="url(#lenoreCyanTearTrail)"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            {/* Teardrop Accumulation Drop at Cheek */}
            <circle cx="209" cy="296" r="2.6" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" className="animate-pulse" />
          </g>

          {/* RIGHT EYE - Symmetrical Innocent Dewy Doll-Like Aperture */}
          <g>
            <ellipse cx="283" cy="245" rx="13" ry="8" fill="#0284c7" opacity="0.2" />
            <path d="M305,245 C295,231 272,231 261,245" stroke="#0369a1" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M300,235 L304,230" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M284,229 L284,224" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M267,235 L263,230" stroke="#0284c7" strokeWidth="1.2" />
            <ellipse cx="283" cy="248" rx="10.5" ry="12" fill="url(#lenoreElectricIris)" />
            <circle cx="283" cy="248" r="4.2" fill="#082f49" />
            <circle cx="279" cy="243" r="3.4" fill="#ffffff" />
            <circle cx="287" cy="252" r="1.6" fill="#ffffff" opacity="0.95" />
            <circle cx="277" cy="250" r="1.2" fill="#e0f2fe" opacity="0.8" />
            <path d="M270,258 Q283,265 296,258" stroke="#38bdf8" strokeWidth="1.4" fill="none" opacity="0.9" />

            {/* GLISTENING CYAN TEAR STREAMING DOWN RIGHT CHEEK */}
            <path
              d="M286,260 Q289,276 291,296 Q292,304 291,312"
              stroke="url(#lenoreCyanTearTrail)"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            <circle cx="291" cy="296" r="2.6" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" className="animate-pulse" />
          </g>

          {/* Sorrowful, Pure, Innocent Eyebrows with Fragile Slope */}
          <path d="M197,227 Q215,221 234,229" stroke="#0284c7" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M303,227 Q285,221 266,229" stroke="#0284c7" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>

        {/* Small, Delicate, Innocent Button Nose */}
        <ellipse cx="250" cy="271" rx="1.2" ry="2" fill="#7dd3fc" opacity="0.5" />

        {/* Sweet, Innocent, Breathless Pale Rosebud Lips */}
        {expression === 'seductive' ? (
          <g>
            <path d="M242,294 Q250,301 258,294" stroke="#f43f5e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <ellipse cx="250" cy="297" rx="5.6" ry="2.8" fill="#fda4af" />
            <circle cx="249" cy="296" r="1.3" fill="#ffffff" opacity="0.85" />
          </g>
        ) : expression === 'blushing' ? (
          <g>
            <path d="M242,295 Q250,299 258,295" stroke="#f43f5e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <ellipse cx="250" cy="297" rx="5.2" ry="2.6" fill="#fda4af" />
            <circle cx="249" cy="296" r="1.2" fill="#ffffff" />
          </g>
        ) : expression === 'smile' ? (
          <g>
            <path d="M241,294 Q250,301 259,294" stroke="#f43f5e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <ellipse cx="250" cy="297" rx="5.5" ry="2.6" fill="#fda4af" />
            <circle cx="249" cy="296" r="1.3" fill="#ffffff" />
          </g>
        ) : (
          <g>
            {/* Innocent, Melancholic Parted Rosebud Lips */}
            <path d="M242,295 Q250,299 258,295" stroke="#f43f5e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <ellipse cx="250" cy="297" rx="5.2" ry="2.6" fill="#fda4af" />
            <line x1="245" y1="296" x2="255" y2="296" stroke="#e11d48" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="249" cy="296" r="1.2" fill="#ffffff" />
          </g>
        )}
      </g>

      {/* ============================================================== */}
      {/* LAYER 5: STRAIGHT SILKY BANGS (KAHKÜL) & LONG STRAIGHT LOCKS   */}
      {/* ============================================================== */}
      <g>
        {/* Crown of Head - Silky Smooth Silver Hair Base */}
        <path
          d="M185,190 C185,125 236,110 250,110 C264,110 315,125 315,190 C305,160 285,145 250,145 C215,145 195,160 185,190 Z"
          fill="url(#lenoreSilverHairBase)"
        />

        {/* STRAIGHT SILKY BANGS (KAHKÜL) - Falling straight across the forehead */}
        <g>
          {/* Main Straight Bangs Curtain */}
          <path
            d="M192,165 C210,158 232,154 250,154 C268,154 290,158 308,165 L308,202 C299,204 292,203 285,205 C277,203 269,205 261,203 C253,205 247,203 239,205 C231,203 223,205 215,203 C208,204 201,202 192,202 Z"
            fill="url(#lenoreSilverHairBase)"
            stroke="#94a3b8"
            strokeWidth="0.5"
          />

          {/* Individual Fine Straight Bang Strands (Kahkül telleri) */}
          <line x1="205" y1="160" x2="205" y2="202" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.75" />
          <line x1="218" y1="156" x2="218" y2="204" stroke="#e2e8f0" strokeWidth="0.9" opacity="0.85" />
          <line x1="232" y1="155" x2="232" y2="204" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.75" />
          <line x1="250" y1="154" x2="250" y2="205" stroke="#f8fafc" strokeWidth="1" opacity="0.9" />
          <line x1="268" y1="155" x2="268" y2="204" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.75" />
          <line x1="282" y1="156" x2="282" y2="204" stroke="#e2e8f0" strokeWidth="0.9" opacity="0.85" />
          <line x1="295" y1="160" x2="295" y2="202" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.75" />

          {/* Silky Moonlit Sheen Ring Across the Bangs (Kahkül Işıltısı) */}
          <ellipse cx="250" cy="182" rx="42" ry="5" fill="#ffffff" opacity="0.7" />
          <ellipse cx="250" cy="182" rx="32" ry="2.5" fill="#e0f2fe" opacity="0.9" />
        </g>

        {/* LONG STRAIGHT FRAMING STRANDS (Uzun Düz Ön Bukleler) */}
        {/* Left Long Straight Framing Lock */}
        <path
          d="M192,185 C186,240 188,320 192,440 C200,440 204,380 202,300 C200,230 202,185 206,170 Z"
          fill="url(#lenoreSilverHairBase)"
        />
        <line x1="193" y1="190" x2="191" y2="435" stroke="url(#lenoreHairLuminance)" strokeWidth="1.4" opacity="0.85" />

        {/* Right Long Straight Framing Lock */}
        <path
          d="M308,185 C314,240 312,320 308,440 C300,440 296,380 298,300 C300,230 298,185 294,170 Z"
          fill="url(#lenoreSilverHairBase)"
        />
        <line x1="307" y1="190" x2="309" y2="435" stroke="url(#lenoreHairLuminance)" strokeWidth="1.4" opacity="0.85" />

        {/* Whispering Outer Floating Wisps */}
        <path d="M186,210 L184,360" stroke="url(#lenoreHairLuminance)" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M314,210 L316,360" stroke="url(#lenoreHairLuminance)" strokeWidth="1.2" fill="none" opacity="0.8" />
      </g>

      {/* ============================================================== */}
      {/* LAYER 6: FLOATING CELESTIAL SPIRIT MOTES & GHOST PARTICLES     */}
      {/* ============================================================== */}
      <g>
        <circle cx="150" cy="170" r="2.2" fill="#ffffff" className="animate-ping" opacity="0.8" />
        <circle cx="350" cy="180" r="2.5" fill="#7dd3fc" className="animate-pulse" />
        <circle cx="130" cy="350" r="1.8" fill="#ffffff" />
        <circle cx="370" cy="370" r="2.2" fill="#38bdf8" className="animate-pulse" />
        <circle cx="190" cy="580" r="2.5" fill="#bae6fd" opacity="0.7" />
        <circle cx="310" cy="600" r="2.2" fill="#7dd3fc" opacity="0.7" />
      </g>
    </svg>
  );
};
