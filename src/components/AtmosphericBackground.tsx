/**
 * AtmosphericBackground Component
 * Renders cinematic Victorian Gothic-Romantic visual novel backgrounds with dynamic environmental particles and effects
 */

import React, { useEffect, useRef } from 'react';
import { BackgroundId } from '../types/novel';

interface Props {
  backgroundId: BackgroundId;
  screenEffect?: 'none' | 'shake' | 'flash' | 'glitch' | 'blood_pulse' | 'fade_black';
  sanity?: number;
  dreadLevel?: number;
}

export const AtmosphericBackground: React.FC<Props> = ({
  backgroundId,
  screenEffect = 'none',
  sanity = 100,
  dreadLevel = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Particle System (Gothic dark red rose petals, embers, or mist motes depending on scene)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
    }

    const particles: Particle[] = [];
    const count = backgroundId === 'cathedral_altar' || backgroundId === 'gothic_castle' ? 40 : 25;

    for (let i = 0; i < count; i++) {
      const isPetal = backgroundId === 'gothic_castle' || backgroundId === 'rose_garden';
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isPetal ? Math.random() * 8 + 5 : Math.random() * 4 + 2,
        speedX: Math.random() * 1.5 - 0.75 + (isPetal ? 0.8 : 0),
        speedY: isPetal ? Math.random() * 1.2 + 0.6 : -(Math.random() * 0.8 + 0.3),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.6 + 0.2,
        color:
          backgroundId === 'cathedral_altar'
            ? '#f43f5e'
            : backgroundId === 'crypt_chapel'
            ? '#c084fc'
            : backgroundId === 'crimson_parlor'
            ? '#fb7185'
            : '#e11d48',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) p.y = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Draw curved gothic rose petal or ember
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [backgroundId]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none transition-all duration-1000 ${
        screenEffect === 'shake' ? 'horror-glitch' : ''
      }`}
    >
      {/* Background Scenes */}
      {backgroundId === 'blackwood_forest' && <BlackwoodForestScene />}
      {(backgroundId === 'gothic_castle' || (backgroundId as string) === 'manor_exterior') && (
        <GothicCastleScene />
      )}
      {backgroundId === 'reception_hall' && <GrandReceptionHallScene />}
      {(backgroundId === 'crimson_parlor' || (backgroundId as string) === 'crimson_bedroom') && (
        <CrimsonParlorScene />
      )}
      {(backgroundId === 'victorian_library' || (backgroundId as string) === 'occult_library') && (
        <VictorianLibraryScene />
      )}
      {(backgroundId === 'crypt_chapel' || (backgroundId as string) === 'moonlit_shrine') && (
        <CryptChapelScene />
      )}
      {(backgroundId === 'cathedral_altar' || (backgroundId as string) === 'blood_altar') && (
        <CathedralAltarScene />
      )}
      {(backgroundId === 'rose_garden' || (backgroundId as string) === 'garden_mist') && (
        <RoseGardenScene />
      )}
      {backgroundId === 'alchemist_tower' && <AlchemistTowerScene />}
      {backgroundId === 'mirror_corridor' && <MirrorCorridorScene />}
      {backgroundId === 'servant_quarters' && <ServantQuartersScene />}
      {backgroundId === 'ending_dawn' && <EndingDawnScene />}

      {/* Floating Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Atmospheric Fog Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* Low Sanity / Horror Vignette */}
      {sanity < 50 && (
        <div
          className="absolute inset-0 pointer-events-none z-10 mix-blend-color-burn opacity-40 transition-opacity duration-1000"
          style={{
            background: 'radial-gradient(circle, transparent 30%, #7f1d1d 90%)',
          }}
        />
      )}

      {/* Heartbeat Vignette Pulse */}
      {(dreadLevel > 50 || screenEffect === 'blood_pulse') && (
        <div className="absolute inset-0 pointer-events-none z-20 vignette-heartbeat" />
      )}

      {/* Screen Flash (Thunder / Shock) */}
      {screenEffect === 'flash' && (
        <div className="absolute inset-0 pointer-events-none z-30 bg-white/80 animate-ping duration-300" />
      )}

      {/* Fade Black */}
      {screenEffect === 'fade_black' && (
        <div className="absolute inset-0 pointer-events-none z-30 bg-black animate-fade-in duration-700" />
      )}
    </div>
  );
};

/**
 * RAVENSCROFT CASTLE - Gothic Spires, Stained Glass & Blood Moon
 */
const GothicCastleScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#05020a]">
      {/* Midnight Sky with Dark Crimson Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0418] via-[#1a0620] to-[#040107]" />

      {/* Giant Crimson Blood Moon */}
      <div className="absolute top-8 right-12 md:right-32 w-60 h-60 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-[#ff2a5f] via-[#be123c] to-[#4c0519] shadow-[0_0_90px_rgba(244,63,94,0.7)] animate-pulse">
        <div className="absolute top-12 left-16 w-16 h-16 rounded-full bg-black/20" />
        <div className="absolute top-32 left-28 w-24 h-24 rounded-full bg-black/25" />
        <div className="absolute bottom-16 right-20 w-12 h-12 rounded-full bg-black/20" />
      </div>

      {/* Moonlit Ominous Clouds */}
      <div className="absolute top-16 right-10 w-96 h-32 bg-rose-950/40 blur-3xl" />
      <div className="absolute top-32 right-44 w-80 h-24 bg-purple-950/40 blur-2xl" />

      {/* Silhouettes of Gothic Castle Spires, Flying Buttresses & Gargoyles */}
      <svg
        viewBox="0 0 1440 800"
        className="absolute bottom-0 w-full h-auto object-cover opacity-95"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="castleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e0a22" />
            <stop offset="100%" stopColor="#08020b" />
          </linearGradient>
        </defs>

        {/* Distant Craggy Cliffs */}
        <path d="M0,520 Q300,420 600,500 T1200,440 L1440,490 L1440,800 L0,800 Z" fill="#0c0312" />

        {/* Central Gothic Cathedral Keep */}
        <polygon points="340,160 350,110 360,160 370,420 330,420" fill="url(#castleGrad)" />
        {/* Ornate Cross on Spire */}
        <line x1="350" y1="95" x2="350" y2="125" stroke="#f43f5e" strokeWidth="2.5" />
        <line x1="342" y1="105" x2="358" y2="105" stroke="#f43f5e" strokeWidth="2.5" />

        {/* Left Flanking Watchtower */}
        <polygon points="180,240 190,200 200,240 215,480 165,480" fill="url(#castleGrad)" />
        <line x1="190" y1="185" x2="190" y2="210" stroke="#f43f5e" strokeWidth="2" />
        <line x1="183" y1="193" x2="197" y2="193" stroke="#f43f5e" strokeWidth="2" />

        {/* Right Flanking Watchtower */}
        <polygon points="500,240 510,200 520,240 535,480 485,480" fill="url(#castleGrad)" />
        <line x1="510" y1="185" x2="510" y2="210" stroke="#f43f5e" strokeWidth="2" />
        <line x1="503" y1="193" x2="517" y2="193" stroke="#f43f5e" strokeWidth="2" />

        {/* Massive Gothic Castle Walls and Battlements */}
        <path
          d="M100,460 L140,460 L140,480 L180,480 L180,450 L520,450 L520,480 L560,480 L560,460 L620,460 L660,750 L60,750 Z"
          fill="url(#castleGrad)"
        />

        {/* Gothic Arched Stained Glass Windows with Warm Amber & Crimson Glow */}
        <path d="M335,320 C335,280 365,280 365,320 L365,370 L335,370 Z" fill="#fde047" opacity="0.8" />
        <path d="M335,320 C335,280 365,280 365,320 L365,370 L335,370 Z" stroke="#110515" strokeWidth="2" fill="none" />
        <line x1="350" y1="285" x2="350" y2="370" stroke="#110515" strokeWidth="2" />
        <line x1="335" y1="330" x2="365" y2="330" stroke="#110515" strokeWidth="2" />

        <path d="M260,500 C260,470 285,470 285,500 L285,550 L260,550 Z" fill="#f43f5e" opacity="0.75" />
        <line x1="272" y1="475" x2="272" y2="550" stroke="#110515" strokeWidth="1.5" />

        <path d="M415,500 C415,470 440,470 440,500 L440,550 L415,550 Z" fill="#fde047" opacity="0.75" />
        <line x1="427" y1="475" x2="427" y2="550" stroke="#110515" strokeWidth="1.5" />

        {/* Wrought Iron Gate at Bottom */}
        <g stroke="#09020d" strokeWidth="3">
          <line x1="310" y1="620" x2="310" y2="750" />
          <line x1="330" y1="600" x2="330" y2="750" />
          <line x1="350" y1="590" x2="350" y2="750" />
          <line x1="370" y1="600" x2="370" y2="750" />
          <line x1="390" y1="620" x2="390" y2="750" />
          <path d="M300,660 Q350,620 400,660" fill="none" />
        </g>

        {/* Flying Ravens Silhouette */}
        <path d="M230,220 Q240,210 250,220 Q260,210 270,220 Q250,225 230,220 Z" fill="#000000" />
        <path d="M430,160 Q438,152 446,160 Q454,152 462,160 Q446,164 430,160 Z" fill="#000000" />
      </svg>
    </div>
  );
};

/**
 * GRAND RECEPTION HALL - Ravenscroft Ancestor Portrait Gallery & Acceptance Hall
 * Features:
 * - Duvarlarda boydan boya altın varaklı barok çerçeveler içinde Ravenscroft atalarının portreleri (Lord Malakar, Countess Carmilla, Lord Alistair, Lady Vivienne)
 * - Tablolardaki canlı gibi parlayan tekinsiz yakut rengi gözler (ruby eyes that follow the player)
 * - Mermer kaideler üzerinde içi taze kesilmiş kırmızı güllerle dolup taşan gümüş ve kristal vazolar, yerlere dökülmüş taç yaprakları
 * - Tavandan sarkan ağır ferforje avize ve duvar apliklerinde damlayan asil sarı balmumu şamdanlar
 * - Halberd tutan parlak çelik şövalye zırhları
 * - Antika büyük ayaklı saat (Grandfather clock)
 * - Konsol masası, kristal karaf ve kadehlerde kan kırmızısı şarap
 * - Parlak damalı mermer zemin ve altın saçaklı karmen kırmızısı salon halısı
 */
const GrandReceptionHallScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#0a030a] overflow-hidden select-none">
      {/* Ambient Gothic Vault Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#180414] via-[#0d020c] to-[#050106]" />

      <svg
        viewBox="0 0 1440 900"
        className="w-full h-full object-cover pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gold Filigree & Baroque Frame Gradients */}
          <linearGradient id="goldFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#eab308" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="75%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          <linearGradient id="brassPlaque" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Stone Column & Arch Gradient */}
          <linearGradient id="hallStone" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1c0b1e" />
            <stop offset="50%" stopColor="#2e1432" />
            <stop offset="100%" stopColor="#140616" />
          </linearGradient>

          {/* Crimson Velvet Carpet Gradient */}
          <linearGradient id="carpetRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#500718" />
            <stop offset="40%" stopColor="#881337" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          {/* Chandelier Candle Glow */}
          <radialGradient id="candleHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#b45309" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ============================================================== */}
        {/* 1. HIGH GOTHIC RIBBED VAULTED CEILING & COLUMNS                */}
        {/* ============================================================== */}
        {/* Deep Background Wall (Damask Dark Maroon) */}
        <rect x="0" y="0" width="1440" height="900" fill="#11030d" />

        {/* Ceiling Gothic Ribs */}
        <path d="M720,0 L200,320 L0,380 L0,0 Z" fill="#18051a" opacity="0.6" />
        <path d="M720,0 L1240,320 L1440,380 L1440,0 Z" fill="#18051a" opacity="0.6" />
        <path d="M720,0 L720,380" stroke="#2a0d2f" strokeWidth="8" />
        <path d="M720,0 L360,420" stroke="#220a26" strokeWidth="6" />
        <path d="M720,0 L1080,420" stroke="#220a26" strokeWidth="6" />

        {/* Distant Twin Bifurcated Staircase & Arched Doors */}
        {/* Distant Upper Arch Gallery */}
        <path d="M540,420 Q720,340 900,420 L900,560 L540,560 Z" fill="#080109" />
        {/* Left Double Door (Library - Cool Violet Occult Mist seeping) */}
        <rect x="560" y="440" width="85" height="120" rx="6" fill="#170c24" stroke="#4c1d95" strokeWidth="2" />
        <path d="M555,560 L650,560" stroke="#a855f7" strokeWidth="4" className="animate-pulse" />
        {/* Right Double Door (Crimson Parlor - Warm Fireplace Hearth Glow seeping) */}
        <rect x="795" y="440" width="85" height="120" rx="6" fill="#2b0a13" stroke="#991b1b" strokeWidth="2" />
        <path d="M790,560 L885,560" stroke="#f59e0b" strokeWidth="4" className="animate-pulse" />

        {/* Marble Staircase Wings */}
        <polygon points="520,560 620,560 650,680 480,680" fill="#1f1522" stroke="#4a2153" strokeWidth="2" />
        <polygon points="920,560 820,560 790,680 960,680" fill="#1f1522" stroke="#4a2153" strokeWidth="2" />

        {/* Heavy Gothic Stone Pillars (Colonnade Perspective) */}
        {/* Far Left Pillar */}
        <rect x="180" y="100" width="45" height="600" fill="url(#hallStone)" stroke="#0d040e" strokeWidth="3" />
        {/* Mid Left Pillar */}
        <rect x="380" y="80" width="55" height="640" fill="url(#hallStone)" stroke="#0d040e" strokeWidth="3" />
        {/* Mid Right Pillar */}
        <rect x="1005" y="80" width="55" height="640" fill="url(#hallStone)" stroke="#0d040e" strokeWidth="3" />
        {/* Far Right Pillar */}
        <rect x="1215" y="100" width="45" height="600" fill="url(#hallStone)" stroke="#0d040e" strokeWidth="3" />

        {/* ============================================================== */}
        {/* 2. CHECKERBOARD MARBLE FLOOR & CRIMSON VELVET RUNNER           */}
        {/* ============================================================== */}
        {/* High-Gloss Marble Floor with Perspective Perspective */}
        <polygon points="0,680 1440,680 1440,900 0,900" fill="#080209" />
        {/* Checkerboard Tiles Grid */}
        <g opacity="0.35">
          <polygon points="100,680 260,680 160,900 -50,900" fill="#261b2b" />
          <polygon points="420,680 580,680 540,900 340,900" fill="#261b2b" />
          <polygon points="740,680 900,680 960,900 760,900" fill="#261b2b" />
          <polygon points="1060,680 1220,680 1380,900 1180,900" fill="#261b2b" />
        </g>

        {/* Grand Crimson Velvet Runner Carpet */}
        <polygon points="560,680 880,680 1080,900 360,900" fill="url(#carpetRed)" />
        {/* Gold Braided Tassel Fringe Edges */}
        <line x1="560" y1="680" x2="360" y2="900" stroke="#eab308" strokeWidth="5" strokeDasharray="8 4" />
        <line x1="880" y1="680" x2="1080" y2="900" stroke="#eab308" strokeWidth="5" strokeDasharray="8 4" />

        {/* ============================================================== */}
        {/* 3. RAVENSCROFT ANCESTOR PORTRAITS (BOYDAN BOYA PORTRELER)     */}
        {/* ============================================================== */}
        
        {/* PORTRAIT 1: Lord Malakar Ravenscroft (1582-1647) - Left Wall */}
        <g id="portrait-malakar">
          {/* Heavy Ornate Gilded Baroque Outer Frame */}
          <rect x="25" y="140" width="135" height="225" rx="8" fill="url(#goldFrameGrad)" stroke="#78350f" strokeWidth="4" />
          <rect x="35" y="150" width="115" height="205" fill="#050106" stroke="#ca8a04" strokeWidth="3" />
          
          {/* Malakar Painting Canvas */}
          {/* Dark Background & Renaissance Collar */}
          <path d="M45,340 C55,270 125,270 135,340 Z" fill="#1e293b" />
          {/* Steel Breastplate with Crimson Raven Inlay */}
          <path d="M65,300 L115,300 L120,350 L60,350 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M85,315 L95,305 L100,325 Z" fill="#dc2626" />
          {/* White Elizabethan Ruff Collar */}
          <ellipse cx="90" cy="265" rx="30" ry="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
          {/* Severe Pale Noble Face */}
          <ellipse cx="90" cy="225" rx="22" ry="28" fill="#e2d8ce" />
          {/* Silver/Black Hair & Goatee */}
          <path d="M68,220 C68,185 112,185 112,220 C105,200 75,200 68,220" fill="#334155" />
          <polygon points="87,245 93,245 90,256" fill="#334155" />
          {/* Tekinsiz Canlı Gibi Parlayan Yakut Gözler (Ruby Eyes Following Player) */}
          <circle cx="82" cy="223" r="2.5" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 6px #ef4444)" />
          <circle cx="98" cy="223" r="2.5" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 6px #ef4444)" />

          {/* Engraved Brass Nameplate */}
          <rect x="25" y="375" width="135" height="24" rx="4" fill="url(#brassPlaque)" stroke="#451a03" strokeWidth="1.5" />
          <text x="92" y="391" fill="#451a03" fontSize="8.5" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle" letterSpacing="0.5">
            LORD MALAKAR I. KONT
          </text>

          {/* Ornate Brass Wall Sconce under Portrait with Golden Wax Candle */}
          <path d="M92,400 L92,430 L105,445" stroke="#ca8a04" strokeWidth="3" fill="none" />
          <rect x="86" y="425" width="12" height="4" fill="#b45309" />
          <rect x="89" y="405" width="6" height="20" fill="#fef08a" />
          {/* Dripping Wax Tears */}
          <path d="M95,415 C96,418 97,420 95,422" stroke="#fef08a" strokeWidth="1.5" fill="none" />
          {/* Flickering Flame & Halo */}
          <ellipse cx="92" cy="400" rx="14" ry="14" fill="url(#candleHalo)" />
          <ellipse cx="92" cy="400" rx="3.5" ry="6" fill="#f59e0b" className="animate-pulse" />
          <ellipse cx="92" cy="401" rx="1.5" ry="3.5" fill="#fef08a" />
        </g>

        {/* PORTRAIT 2: Countess Carmilla Ravenscroft (1684-1738) - Left Inner Wall */}
        <g id="portrait-carmilla">
          {/* Heavy Ornate Gilded Baroque Outer Frame */}
          <rect x="245" y="125" width="120" height="215" rx="8" fill="url(#goldFrameGrad)" stroke="#78350f" strokeWidth="4" />
          <rect x="253" y="133" width="104" height="199" fill="#08020a" stroke="#ca8a04" strokeWidth="2.5" />

          {/* Carmilla Canvas */}
          {/* Black Lace Mourning Dress & Veil */}
          <path d="M260,330 C270,270 335,270 345,330 Z" fill="#09050d" />
          {/* Alabaster Neck & Blood Garnet Choker */}
          <ellipse cx="305" cy="225" rx="20" ry="26" fill="#f1ece7" />
          <rect x="295" y="244" width="20" height="4" fill="#881337" />
          <circle cx="305" cy="250" r="3" fill="#ef4444" filter="drop-shadow(0 0 5px #ef4444)" />
          {/* Black Victorian Hair & Mourning Lace Veil */}
          <path d="M280,215 C280,180 330,180 330,215 C335,250 330,280 325,300 L285,300 C280,280 275,250 280,215" fill="#0f0715" opacity="0.95" />
          {/* Pale Parted Crimson Lips */}
          <path d="M301,238 Q305,241 309,238" stroke="#991b1b" strokeWidth="2" fill="none" />
          {/* Piercing Glowing Ruby Eyes */}
          <circle cx="297" cy="222" r="2.5" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 6px #ef4444)" />
          <circle cx="313" cy="222" r="2.5" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 6px #ef4444)" />
          {/* Holding Wilted Crimson Rose in Pale Hand */}
          <circle cx="305" cy="305" r="5" fill="#881337" />
          <path d="M305,305 L305,325" stroke="#166534" strokeWidth="1.5" />

          {/* Brass Nameplate */}
          <rect x="245" y="350" width="120" height="22" rx="4" fill="url(#brassPlaque)" stroke="#451a03" strokeWidth="1.5" />
          <text x="305" y="365" fill="#451a03" fontSize="8" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle">
            COUNTESS CARMILLA
          </text>

          {/* Sconce under Carmilla */}
          <path d="M305,375 L305,405 L315,420" stroke="#ca8a04" strokeWidth="3" fill="none" />
          <rect x="300" y="400" width="10" height="3" fill="#b45309" />
          <rect x="303" y="382" width="5" height="18" fill="#fef08a" />
          <ellipse cx="305" cy="378" rx="14" ry="14" fill="url(#candleHalo)" />
          <ellipse cx="305" cy="378" rx="3.5" ry="6" fill="#f59e0b" className="animate-pulse" />
        </g>

        {/* PORTRAIT 3: Lord Alistair Ravenscroft (Julian's Uncle) - Right Inner Wall */}
        <g id="portrait-alistair">
          {/* Heavy Ornate Gilded Baroque Outer Frame */}
          <rect x="1075" y="125" width="120" height="215" rx="8" fill="url(#goldFrameGrad)" stroke="#78350f" strokeWidth="4" />
          <rect x="1083" y="133" width="104" height="199" fill="#08020a" stroke="#ca8a04" strokeWidth="2.5" />

          {/* Alistair Canvas */}
          {/* Victorian High Cravat & Frock Coat */}
          <path d="M1090,330 C1100,270 1165,270 1175,330 Z" fill="#18181b" />
          <polygon points="1130,275 1140,250 1135,275" fill="#f8fafc" />
          {/* Melancholic Noble Face with Hollow Cheeks */}
          <ellipse cx="1135" cy="225" rx="20" ry="27" fill="#e4ded5" />
          {/* Dark Hair with Silver Streaks */}
          <path d="M1113,220 C1113,180 1157,180 1157,220 C1150,195 1120,195 1113,220" fill="#27272a" />
          <path d="M1116,205 C1120,195 1130,195 1135,200" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
          {/* Sorrowful yet Shimmering Ruby Eyes */}
          <circle cx="1127" cy="222" r="2.5" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 6px #ef4444)" />
          <circle cx="1143" cy="222" r="2.5" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 6px #ef4444)" />
          {/* Gold Pocket Watch in Hand */}
          <circle cx="1145" cy="310" r="6" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
          <path d="M1145,304 L1145,285" stroke="#ca8a04" strokeWidth="1" />

          {/* Brass Nameplate */}
          <rect x="1075" y="350" width="120" height="22" rx="4" fill="url(#brassPlaque)" stroke="#451a03" strokeWidth="1.5" />
          <text x="1135" y="365" fill="#451a03" fontSize="8" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle">
            LORD ALISTAIR
          </text>

          {/* Sconce under Alistair */}
          <path d="M1135,375 L1135,405 L1125,420" stroke="#ca8a04" strokeWidth="3" fill="none" />
          <rect x="1130" y="400" width="10" height="3" fill="#b45309" />
          <rect x="1132" y="382" width="5" height="18" fill="#fef08a" />
          <ellipse cx="1135" cy="378" rx="14" ry="14" fill="url(#candleHalo)" />
          <ellipse cx="1135" cy="378" rx="3.5" ry="6" fill="#f59e0b" className="animate-pulse" />
        </g>

        {/* PORTRAIT 4: Lady Vivienne Ravenscroft (Young Countess) - Right Wall */}
        <g id="portrait-vivienne">
          {/* Heavy Ornate Gilded Baroque Outer Frame */}
          <rect x="1275" y="140" width="135" height="225" rx="8" fill="url(#goldFrameGrad)" stroke="#78350f" strokeWidth="4" />
          <rect x="1285" y="150" width="115" height="205" fill="#070105" stroke="#ca8a04" strokeWidth="3" />

          {/* Vivienne Canvas */}
          {/* Off-the-shoulder Scarlet Red Velvet Gown */}
          <path d="M1295,340 C1305,275 1375,275 1385,340 Z" fill="#991b1b" />
          {/* Seductive Porcelain Alabaster Neck & Cleavage */}
          <ellipse cx="1340" cy="225" rx="21" ry="27" fill="#fdf2f4" />
          {/* Victorian Gold Choker with Teardrop Ruby */}
          <rect x="1330" y="244" width="20" height="3.5" fill="#eab308" />
          <circle cx="1340" cy="251" r="3.5" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)" />
          {/* Cascading Raven Hair Curls */}
          <path d="M1318,220 C1318,175 1362,175 1362,220 C1370,250 1360,290 1355,320 L1325,320 C1320,290 1310,250 1318,220" fill="#14060b" />
          {/* Seductive Red Lips */}
          <path d="M1336,238 Q1340,242 1344,238" stroke="#be123c" strokeWidth="2.5" fill="none" />
          {/* Alluring, Seductive Predatory Ruby Gaze */}
          <circle cx="1332" cy="222" r="2.8" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 8px #ef4444)" />
          <circle cx="1348" cy="222" r="2.8" fill="#ef4444" className="animate-pulse" filter="drop-shadow(0 0 8px #ef4444)" />

          {/* Brass Nameplate */}
          <rect x="1275" y="375" width="135" height="24" rx="4" fill="url(#brassPlaque)" stroke="#451a03" strokeWidth="1.5" />
          <text x="1342" y="391" fill="#451a03" fontSize="8.5" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle">
            LADY VIVIENNE
          </text>

          {/* Sconce under Vivienne */}
          <path d="M1342,400 L1342,430 L1329,445" stroke="#ca8a04" strokeWidth="3" fill="none" />
          <rect x="1336" y="425" width="12" height="4" fill="#b45309" />
          <rect x="1339" y="405" width="6" height="20" fill="#fef08a" />
          <ellipse cx="1342" cy="400" rx="14" ry="14" fill="url(#candleHalo)" />
          <ellipse cx="1342" cy="400" rx="3.5" ry="6" fill="#f59e0b" className="animate-pulse" />
        </g>

        {/* ============================================================== */}
        {/* 4. SUITS OF FLUTED GOTHIC KNIGHT PLATE ARMOR (ÇELİK ZIRHLAR)   */}
        {/* ============================================================== */}
        {/* LEFT SUIT OF ARMOR (Holding Steel Halberd) */}
        <g id="armor-left" transform="translate(170, 360)">
          {/* Stone Plinth Base */}
          <rect x="10" y="260" width="60" height="25" fill="#1f1824" stroke="#473a50" strokeWidth="2" />
          {/* Steel Greaves / Sabatons (Boots) */}
          <rect x="20" y="210" width="16" height="50" rx="3" fill="#64748b" stroke="#334155" strokeWidth="2" />
          <rect x="44" y="210" width="16" height="50" rx="3" fill="#64748b" stroke="#334155" strokeWidth="2" />
          {/* Tassets & Faulds */}
          <polygon points="15,150 65,150 60,210 20,210" fill="#475569" stroke="#1e293b" strokeWidth="2" />
          {/* Fluted Gothic Breastplate with Plackart */}
          <polygon points="12,70 68,70 64,150 16,150" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
          {/* Pauldrons (Shoulder Plates) */}
          <ellipse cx="12" cy="80" rx="14" ry="12" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
          <ellipse cx="68" cy="80" rx="14" ry="12" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
          {/* Great Helm (Closed Visor with Cross Slit) */}
          <rect x="25" y="20" width="30" height="45" rx="8" fill="#cbd5e1" stroke="#334155" strokeWidth="2.5" />
          <line x1="28" y1="36" x2="52" y2="36" stroke="#0f172a" strokeWidth="3" />
          <line x1="40" y1="28" x2="40" y2="44" stroke="#0f172a" strokeWidth="2" />
          {/* 2.5m Tall Steel Halberd */}
          <line x1="68" y1="-80" x2="68" y2="260" stroke="#334155" strokeWidth="4" />
          {/* Halberd Axe Blade & Crescent Spear */}
          <path d="M68,-80 L68,-40 L95,-55 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
          <polygon points="65,-95 71,-95 68,-120" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
          <polygon points="68,-55 50,-62 68,-70" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        </g>

        {/* RIGHT SUIT OF ARMOR (Holding Battle-Axe & Raven Shield) */}
        <g id="armor-right" transform="translate(1200, 360)">
          {/* Stone Plinth Base */}
          <rect x="10" y="260" width="60" height="25" fill="#1f1824" stroke="#473a50" strokeWidth="2" />
          {/* Steel Greaves */}
          <rect x="20" y="210" width="16" height="50" rx="3" fill="#64748b" stroke="#334155" strokeWidth="2" />
          <rect x="44" y="210" width="16" height="50" rx="3" fill="#64748b" stroke="#334155" strokeWidth="2" />
          {/* Cuirass & Tassets */}
          <polygon points="12,70 68,70 62,210 18,210" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
          {/* Pauldrons */}
          <ellipse cx="12" cy="80" rx="14" ry="12" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
          <ellipse cx="68" cy="80" rx="14" ry="12" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
          {/* Great Helm */}
          <rect x="25" y="20" width="30" height="45" rx="8" fill="#cbd5e1" stroke="#334155" strokeWidth="2.5" />
          <line x1="28" y1="36" x2="52" y2="36" stroke="#0f172a" strokeWidth="3" />
          {/* Heraldic Kite Shield with Ravenscroft Raven */}
          <path d="M-5,100 L30,100 C30,170 12,200 12,210 C12,200 -5,170 -5,100 Z" fill="#881337" stroke="#eab308" strokeWidth="3" />
          <path d="M12,140 L7,130 L17,130 Z" fill="#eab308" />
          {/* Heavy Double-Bitted Battle-Axe */}
          <line x1="68" y1="-30" x2="68" y2="260" stroke="#334155" strokeWidth="4" />
          <path d="M68,-10 C90,-35 90,15 68,-5" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
          <path d="M68,-10 C46,-35 46,15 68,-5" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        </g>

        {/* ============================================================== */}
        {/* 5. ANTIQUE GRANDFATHER CLOCK (BÜYÜK AYAKLI SAAT)               */}
        {/* ============================================================== */}
        <g id="grandfather-clock" transform="translate(385, 340)">
          {/* Tall Mahogany Carved Casing */}
          <rect x="15" y="60" width="45" height="260" fill="#2e1005" stroke="#140501" strokeWidth="2.5" />
          {/* Gothic Spire Peak & Finials */}
          <polygon points="12,60 37,20 62,60" fill="#451a03" stroke="#140501" strokeWidth="2" />
          <circle cx="37" cy="18" r="4" fill="#ca8a04" />
          {/* Clock Dial Face with Roman Numerals */}
          <circle cx="37.5" cy="90" r="18" fill="#fef9c3" stroke="#78350f" strokeWidth="3" />
          <line x1="37.5" y1="90" x2="37.5" y2="78" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          <line x1="37.5" y1="90" x2="46" y2="90" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
          {/* Glass Pendulum Chamber */}
          <rect x="22" y="130" width="31" height="130" fill="#140501" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Swinging Brass Pendulum */}
          <line x1="37.5" y1="135" x2="37.5" y2="210" stroke="#eab308" strokeWidth="2" />
          <circle cx="37.5" cy="215" r="10" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" className="animate-pulse" />
        </g>

        {/* ============================================================== */}
        {/* 6. MARBLE PLINTHS & FRESH CUT RED ROSES IN VASES               */}
        {/* ============================================================== */}
        {/* LEFT PEDESTAL & OVERFLOWING BLOOD ROSES VASE */}
        <g id="roses-left" transform="translate(485, 480)">
          {/* Fluted Carrara White Marble Column Plinth */}
          <rect x="10" y="80" width="50" height="150" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <line x1="22" y1="80" x2="22" y2="230" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="35" y1="80" x2="35" y2="230" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="48" y1="80" x2="48" y2="230" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="5" y="70" width="60" height="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="0" y="230" width="70" height="14" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />

          {/* Antique Ornate Silver Baroque Urn/Vase */}
          <ellipse cx="35" cy="55" rx="20" ry="24" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          <path d="M15,55 C5,55 5,35 15,35" stroke="#94a3b8" strokeWidth="3" fill="none" />
          <path d="M55,55 C65,55 65,35 55,35" stroke="#94a3b8" strokeWidth="3" fill="none" />

          {/* Deep Crimson Fresh Roses Bouquet */}
          <g filter="drop-shadow(0 0 10px rgba(185,28,28,0.5))">
            {/* Green Thorns and Leaves */}
            <path d="M20,30 Q10,15 25,10" stroke="#166534" strokeWidth="2.5" fill="none" />
            <path d="M50,30 Q60,15 45,10" stroke="#166534" strokeWidth="2.5" fill="none" />
            <path d="M35,30 L35,-5" stroke="#166534" strokeWidth="3" fill="none" />
            {/* Rich Blooming Velvet Crimson Roses */}
            <circle cx="35" cy="0" r="14" fill="#991b1b" stroke="#450a0a" strokeWidth="1.5" />
            <circle cx="35" cy="0" r="8" fill="#be123c" />
            <circle cx="35" cy="0" r="4" fill="#f43f5e" />

            <circle cx="18" cy="15" r="12" fill="#881337" stroke="#450a0a" strokeWidth="1" />
            <circle cx="18" cy="15" r="6" fill="#be123c" />

            <circle cx="52" cy="15" r="12" fill="#881337" stroke="#450a0a" strokeWidth="1" />
            <circle cx="52" cy="15" r="6" fill="#be123c" />

            <circle cx="35" cy="22" r="10" fill="#991b1b" />
          </g>

          {/* Fallen Crimson Petals Scattered on Floor */}
          <ellipse cx="25" cy="245" rx="6" ry="2.5" fill="#be123c" transform="rotate(-15 25 245)" />
          <ellipse cx="50" cy="248" rx="7" ry="3" fill="#991b1b" transform="rotate(25 50 248)" />
          <ellipse cx="38" cy="254" rx="5" ry="2" fill="#881337" />
          <ellipse cx="75" cy="250" rx="6" ry="2.5" fill="#be123c" transform="rotate(10 75 250)" />
        </g>

        {/* RIGHT PEDESTAL & OVERFLOWING BLOOD ROSES VASE */}
        <g id="roses-right" transform="translate(885, 480)">
          {/* Fluted Carrara White Marble Column Plinth */}
          <rect x="10" y="80" width="50" height="150" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <line x1="22" y1="80" x2="22" y2="230" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="35" y1="80" x2="35" y2="230" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="48" y1="80" x2="48" y2="230" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="5" y="70" width="60" height="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="0" y="230" width="70" height="14" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />

          {/* Crystal Fluted Vase */}
          <ellipse cx="35" cy="55" rx="18" ry="24" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" opacity="0.9" />

          {/* Roses Bouquet */}
          <g filter="drop-shadow(0 0 10px rgba(185,28,28,0.5))">
            <path d="M35,30 L35,-5" stroke="#166534" strokeWidth="3" fill="none" />
            <circle cx="35" cy="0" r="14" fill="#991b1b" stroke="#450a0a" strokeWidth="1.5" />
            <circle cx="35" cy="0" r="8" fill="#be123c" />
            <circle cx="35" cy="0" r="4" fill="#f43f5e" />

            <circle cx="18" cy="15" r="12" fill="#881337" stroke="#450a0a" strokeWidth="1" />
            <circle cx="18" cy="15" r="6" fill="#be123c" />

            <circle cx="52" cy="15" r="12" fill="#881337" stroke="#450a0a" strokeWidth="1" />
            <circle cx="52" cy="15" r="6" fill="#be123c" />

            <circle cx="35" cy="22" r="10" fill="#991b1b" />
          </g>

          {/* Fallen Crimson Petals on Floor */}
          <ellipse cx="20" cy="246" rx="6" ry="2.5" fill="#be123c" transform="rotate(-20 20 246)" />
          <ellipse cx="55" cy="248" rx="6" ry="3" fill="#991b1b" transform="rotate(30 55 248)" />
          <ellipse cx="40" cy="252" rx="5" ry="2" fill="#881337" />
          <ellipse cx="-15" cy="250" rx="7" ry="2.5" fill="#be123c" />
        </g>

        {/* ============================================================== */}
        {/* 7. ROCOCO CONSOLE TABLE WITH WINE DECANTER & CHALICES          */}
        {/* ============================================================== */}
        <g id="console-table" transform="translate(980, 520)">
          {/* Carved Dark Mahogany Console Table */}
          <rect x="0" y="60" width="80" height="12" rx="3" fill="#451a03" stroke="#260e02" strokeWidth="2" />
          <path d="M10,72 L15,140 M70,72 L65,140" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
          <path d="M20,100 Q40,110 60,100" stroke="#260e02" strokeWidth="3" fill="none" />

          {/* Cut-Crystal Decanter Filled with Deep Blood-Red Wine */}
          <polygon points="35,60 25,40 32,25 48,25 55,40 45,60" fill="#881337" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="37" y="16" width="6" height="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="40" cy="14" r="3.5" fill="#fde047" />

          {/* Two Stemmed Crystal Goblets with Glowing Wine */}
          <path d="M15,58 L12,45 L24,45 L21,58 Z" fill="#991b1b" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="18" y1="58" x2="18" y2="60" stroke="#e2e8f0" strokeWidth="2" />

          <path d="M60,58 L57,45 L69,45 L66,58 Z" fill="#991b1b" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="63" y1="58" x2="63" y2="60" stroke="#e2e8f0" strokeWidth="2" />
        </g>

        {/* ============================================================== */}
        {/* 8. MASSIVE CENTRAL GOTHIC WROUGHT-IRON CHANDELIER              */}
        {/* ============================================================== */}
        <g id="grand-chandelier" transform="translate(720, 160)">
          {/* Heavy Black Chains Hanging from Arch */}
          <line x1="0" y1="-160" x2="0" y2="0" stroke="#18181b" strokeWidth="5" strokeDasharray="6 3" />
          <line x1="-80" y1="-160" x2="-80" y2="-40" stroke="#27272a" strokeWidth="3" strokeDasharray="6 3" />
          <line x1="80" y1="-160" x2="80" y2="-40" stroke="#27272a" strokeWidth="3" strokeDasharray="6 3" />

          {/* Two-Tiered Wrought Iron Rings with Gothic Trefoils */}
          <ellipse cx="0" cy="0" rx="140" ry="32" fill="none" stroke="#27272a" strokeWidth="9" />
          <ellipse cx="0" cy="0" rx="140" ry="32" fill="none" stroke="#ca8a04" strokeWidth="2.5" />
          <ellipse cx="0" cy="-35" rx="90" ry="22" fill="none" stroke="#27272a" strokeWidth="7" />
          <ellipse cx="0" cy="-35" rx="90" ry="22" fill="none" stroke="#ca8a04" strokeWidth="2" />

          {/* Central Iron Spike / Spire */}
          <polygon points="-8,0 8,0 0,55" fill="#18181b" stroke="#ca8a04" strokeWidth="1.5" />

          {/* 10 Ivory Beeswax Candles with Golden Halos & Flickering Flames */}
          {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((xOffset, i) => {
            const yOffset = Math.sin((i / 8) * Math.PI) * 14;
            return (
              <g key={i} transform={`translate(${xOffset}, ${yOffset})`}>
                {/* Brass Cup */}
                <rect x="-6" y="-4" width="12" height="6" rx="2" fill="#ca8a04" stroke="#78350f" strokeWidth="1" />
                {/* Beeswax Candle Column with Dripping Wax */}
                <rect x="-3.5" y="-28" width="7" height="24" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
                <path d="M3.5,-16 C4.5,-13 4.5,-11 3.5,-9" stroke="#fef08a" strokeWidth="1.5" fill="none" />
                {/* Warm Amber Halo */}
                <ellipse cx="0" cy="-34" rx="26" ry="26" fill="url(#candleHalo)" />
                {/* Flame */}
                <ellipse cx="0" cy="-34" rx="3.5" ry="7" fill="#f59e0b" className="animate-pulse" />
                <ellipse cx="0" cy="-32" rx="1.8" ry="4" fill="#fef9c3" />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Dust Motes & Red Rose Fragrance Particles */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
};

/**
 * CRIMSON PARLOR - Victorian Gothic Velvet Chamber & Roaring Fireplace
 * Enhanced with rich gothic objects:
 * - Grand gilded baroque mantel mirror with skull crest reflecting chandeliers
 * - Victorian plush button-tufted velvet chaise lounge / armchair
 * - Clawfoot mahogany side table with crystal decanter of blood-red wine and silver bowl of red roses
 * - Antique brass mantel clock and skull ornament
 * - Persian-style crimson ornamental carpet
 */
const CrimsonParlorScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#12040c] overflow-hidden select-none">
      {/* Ambient Red & Fireplace Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2c0618] via-[#16040d] to-[#070104]" />

      {/* Massive Arched Gothic Stained Glass Window with Moon Shadow */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-80 md:w-96 h-76 rounded-t-full border-4 border-rose-950/80 bg-gradient-to-b from-rose-950/40 to-purple-950/50 shadow-[0_0_60px_rgba(225,29,72,0.35)] overflow-hidden">
        {/* Stained Glass Rose Medallion & Gothic Traceries */}
        <svg viewBox="0 0 200 200" className="w-full h-full opacity-60">
          <circle cx="100" cy="100" r="70" stroke="#881337" strokeWidth="3" fill="none" />
          <circle cx="100" cy="100" r="35" stroke="#881337" strokeWidth="2" fill="none" />
          <line x1="100" y1="30" x2="100" y2="170" stroke="#881337" strokeWidth="2" />
          <line x1="30" y1="100" x2="170" y2="100" stroke="#881337" strokeWidth="2" />
          <line x1="50" y1="50" x2="150" y2="150" stroke="#881337" strokeWidth="2" />
          <line x1="50" y1="150" x2="150" y2="50" stroke="#881337" strokeWidth="2" />
        </svg>
        {/* Crimson Moon Glow behind glass */}
        <div className="absolute top-10 right-14 w-24 h-24 rounded-full bg-rose-500/30 blur-sm pointer-events-none" />
      </div>

      {/* Flowing Deep Crimson Velvet Drapes with Gold Tiebacks */}
      <div className="absolute top-0 left-0 w-44 md:w-72 h-full bg-gradient-to-r from-red-950/95 via-rose-900/60 to-transparent blur-[1px]">
        <div className="absolute top-1/2 left-28 w-4 h-16 border-2 border-amber-500/60 rounded-full" />
      </div>
      <div className="absolute top-0 right-0 w-44 md:w-72 h-full bg-gradient-to-l from-red-950/95 via-rose-900/60 to-transparent blur-[1px]">
        <div className="absolute top-1/2 right-28 w-4 h-16 border-2 border-amber-500/60 rounded-full" />
      </div>

      {/* Persian-style Crimson Ornamental Rug on Parquet Floor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-44 bg-gradient-to-t from-red-950/80 via-rose-950/40 to-transparent border-t-2 border-amber-600/30 rounded-t-[80px] pointer-events-none" />

      {/* LEFT: Victorian Plush Button-Tufted Velvet Armchair */}
      <div className="absolute bottom-8 left-6 md:left-20 flex flex-col items-center pointer-events-none opacity-90">
        <div className="w-24 md:w-32 h-28 md:h-36 rounded-t-2xl bg-gradient-to-b from-[#881337] to-[#450a0a] border-4 border-[#78350f] shadow-2xl relative">
          {/* Button tufts */}
          <div className="absolute inset-4 grid grid-cols-2 gap-3 opacity-60">
            <div className="w-2 h-2 rounded-full bg-black/60" />
            <div className="w-2 h-2 rounded-full bg-black/60" />
            <div className="w-2 h-2 rounded-full bg-black/60" />
            <div className="w-2 h-2 rounded-full bg-black/60" />
          </div>
        </div>
        {/* Armchair Cushion & Carved Wooden Legs */}
        <div className="w-28 md:w-36 h-10 bg-[#991b1b] border-2 border-[#78350f] rounded-md shadow-lg flex justify-between px-2 pt-2">
          <div className="w-3 h-8 bg-amber-950 rounded-b" />
          <div className="w-3 h-8 bg-amber-950 rounded-b" />
        </div>
      </div>

      {/* RIGHT: Mahogany Clawfoot Table with Crystal Decanter & Fresh Roses */}
      <div className="absolute bottom-8 right-6 md:right-20 flex flex-col items-center pointer-events-none">
        {/* Tabletop Items */}
        <div className="flex items-end gap-3 mb-1">
          {/* Silver Bowl with Crimson Roses */}
          <div className="w-10 h-7 rounded-b-full bg-slate-300 border border-slate-400 flex items-center justify-center relative shadow-md">
            <div className="absolute -top-3 flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-700" />
              <div className="w-4 h-4 rounded-full bg-red-600" />
              <div className="w-3 h-3 rounded-full bg-red-800" />
            </div>
          </div>
          {/* Crystal Wine Decanter with Blood Wine */}
          <div className="w-6 h-12 bg-rose-950/80 border border-slate-300 rounded-b-lg flex flex-col items-center justify-between p-0.5 shadow-md">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-4 h-6 bg-red-600 rounded-b" />
          </div>
          {/* Wine Goblet */}
          <div className="w-4 h-7 flex flex-col items-center">
            <div className="w-3.5 h-4 bg-red-600/80 border border-slate-300 rounded-b-md" />
            <div className="w-1 h-2.5 bg-slate-300" />
            <div className="w-3 h-0.5 bg-slate-300" />
          </div>
        </div>
        {/* Round Polished Mahogany Tabletop */}
        <div className="w-28 md:w-36 h-5 rounded-full bg-amber-900 border-2 border-amber-950 shadow-xl" />
        {/* Clawfoot Pedestal */}
        <div className="w-4 h-16 bg-amber-950 flex flex-col items-center justify-end">
          <div className="w-16 h-3 bg-amber-950 rounded-t" />
        </div>
      </div>

      {/* Grand Stone Fireplace at Center Bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 md:w-96 h-56 bg-stone-950 border-t-4 border-x-4 border-stone-800 rounded-t-xl flex flex-col items-center justify-end p-4">
        {/* Fireplace Mantel Shelf with Skull Relic & Mantel Clock */}
        <div className="absolute -top-8 w-92 md:w-104 h-8 bg-stone-900 border-2 border-amber-700/60 rounded-t flex items-center justify-around px-4">
          {/* Mantel Candelabra */}
          <div className="w-2 h-5 bg-amber-400 shadow-[0_0_12px_#f59e0b] rounded-full animate-pulse" />
          {/* Antique Gothic Mantel Clock */}
          <div className="w-8 h-8 rounded-t bg-amber-950 border border-amber-600/70 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-yellow-100 border border-amber-800 flex items-center justify-center text-[7px] text-amber-950 font-bold">
              XII
            </div>
          </div>
          {/* Carved Skull Relic */}
          <div className="w-6 h-6 rounded-full bg-stone-300 border border-stone-400 flex items-center justify-center shadow-md">
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-black" />
              <div className="w-1 h-1 rounded-full bg-black" />
            </div>
          </div>
        </div>

        {/* Fireplace Hearth Arch */}
        <div className="w-64 h-36 border-t-4 border-x-4 border-stone-700 rounded-t-full bg-black/90 flex flex-col items-center justify-end overflow-hidden relative">
          {/* Roaring Flames */}
          <div className="w-32 h-20 bg-gradient-to-t from-red-600 via-amber-500 to-yellow-300 rounded-t-full blur-sm animate-pulse shadow-[0_0_50px_#f97316]" />
          <div className="w-20 h-14 bg-yellow-200 rounded-t-full -mt-10 blur-xs animate-ping duration-700" />
        </div>
      </div>

      {/* Multi-Armed Candelabras on Both Sides of Fireplace */}
      <div className="absolute bottom-24 left-14 md:left-24 flex flex-col items-center pointer-events-none">
        <div className="flex gap-4 mb-1">
          <div className="w-3 h-5 rounded-full bg-amber-400 shadow-[0_0_20px_#f59e0b] animate-pulse" />
          <div className="w-3 h-6 rounded-full bg-amber-400 shadow-[0_0_20px_#f59e0b] animate-pulse" />
          <div className="w-3 h-5 rounded-full bg-amber-400 shadow-[0_0_20px_#f59e0b] animate-pulse" />
        </div>
        <div className="w-16 h-3 bg-amber-800 rounded" />
        <div className="w-4 h-24 bg-amber-900" />
        <div className="w-16 h-4 bg-stone-900 rounded" />
      </div>

      <div className="absolute bottom-24 right-14 md:right-24 flex flex-col items-center pointer-events-none">
        <div className="flex gap-4 mb-1">
          <div className="w-3 h-5 rounded-full bg-amber-400 shadow-[0_0_20px_#f59e0b] animate-pulse" />
          <div className="w-3 h-6 rounded-full bg-amber-400 shadow-[0_0_20px_#f59e0b] animate-pulse" />
          <div className="w-3 h-5 rounded-full bg-amber-400 shadow-[0_0_20px_#f59e0b] animate-pulse" />
        </div>
        <div className="w-16 h-3 bg-amber-800 rounded" />
        <div className="w-4 h-24 bg-amber-900" />
        <div className="w-16 h-4 bg-stone-900 rounded" />
      </div>
    </div>
  );
};

/**
 * VICTORIAN LIBRARY - Occult Grimoires, Stained Glass & Arched Ceilings
 * Enhanced with extensive gothic scholarly objects:
 * - Study partner desk with glowing green glass banker's lamp
 * - Open ancient leather-bound grimoire with esoteric pentagram
 * - Brass hourglass with blood-red sand & inkwell with raven feather quill
 * - Brass armillary celestial sphere on an oak plinth
 * - Rolling library ladder leaning on tall bookshelves
 * - Stacks of leather tomes and ribbon-tied parchment scrolls on parquet floor
 * - Stuffed raven specimen perched atop the left bookcase
 */
const VictorianLibraryScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#080a10] overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d] via-[#05060b] to-[#020306]" />

      {/* Tall Arched Victorian Bookshelves flanking Left */}
      <div className="absolute inset-y-0 left-0 w-40 md:w-68 bg-[#110e0c] border-r-2 border-amber-950/40 flex flex-col justify-around p-3 opacity-95">
        {/* Stuffed Black Raven Perched on Top Arch */}
        <div className="absolute top-2 left-6 flex items-center gap-1">
          <div className="w-6 h-5 rounded-full bg-black border border-stone-800" />
          <div className="w-2 h-1 bg-amber-500 rounded-r" />
        </div>

        {[1, 2, 3, 4, 5].map((shelf) => (
          <div key={shelf} className="w-full h-14 border-b-2 border-amber-900 flex items-end gap-1 px-1">
            <div className="w-3 h-11 bg-red-950 rounded-t border-t border-amber-600/40" />
            <div className="w-4 h-12 bg-amber-900 rounded-t" />
            <div className="w-3.5 h-10 bg-emerald-950 rounded-t" />
            <div className="w-5 h-13 bg-purple-950 rounded-t" />
            <div className="w-4 h-11 bg-indigo-950 rounded-t" />
            <div className="w-3 h-10 bg-stone-800 rounded-t" />
          </div>
        ))}

        {/* Rolling Library Ladder Leaning on Bookshelf */}
        <div className="absolute top-12 left-28 w-8 h-4/5 flex justify-between border-x-2 border-amber-800 rotate-6 pointer-events-none opacity-80">
          {[1, 2, 3, 4, 5, 6, 7].map((rung) => (
            <div key={rung} className="w-full h-1 bg-amber-700" style={{ marginTop: `${rung * 40}px` }} />
          ))}
        </div>
      </div>

      {/* Tall Arched Victorian Bookshelves flanking Right */}
      <div className="absolute inset-y-0 right-0 w-40 md:w-68 bg-[#110e0c] border-l-2 border-amber-950/40 flex flex-col justify-around p-3 opacity-95">
        {[1, 2, 3, 4, 5].map((shelf) => (
          <div key={shelf} className="w-full h-14 border-b-2 border-amber-900 flex items-end gap-1 px-1">
            <div className="w-4 h-12 bg-purple-900 rounded-t" />
            <div className="w-3 h-11 bg-red-950 rounded-t" />
            <div className="w-4 h-13 bg-amber-900 rounded-t" />
            <div className="w-3.5 h-10 bg-slate-900 rounded-t" />
            <div className="w-5 h-12 bg-emerald-950 rounded-t" />
          </div>
        ))}
      </div>

      {/* Left Foreground: Antique Brass Armillary Celestial Sphere on Oak Plinth */}
      <div className="absolute bottom-12 left-44 md:left-72 flex flex-col items-center pointer-events-none opacity-85">
        <div className="w-14 h-14 rounded-full border-2 border-amber-400 flex items-center justify-center relative shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <div className="w-12 h-12 rounded-full border border-amber-500 rotate-45" />
          <div className="w-3 h-3 rounded-full bg-amber-300" />
        </div>
        <div className="w-3 h-12 bg-amber-800" />
        <div className="w-12 h-4 bg-amber-950 rounded-t" />
      </div>

      {/* Right Foreground: Stacks of Leather Books & Ribboned Scrolls on Floor */}
      <div className="absolute bottom-6 right-44 md:right-72 flex flex-col items-center pointer-events-none opacity-85">
        <div className="w-16 h-3 bg-red-900 border border-amber-700 rounded-sm mb-0.5" />
        <div className="w-20 h-4 bg-amber-950 border border-amber-700 rounded-sm mb-0.5" />
        <div className="w-22 h-4 bg-indigo-950 border border-amber-700 rounded-sm" />
        {/* Rolled parchment with red seal */}
        <div className="w-14 h-3 bg-amber-100 rounded-full border border-amber-400 flex items-center justify-center mt-1">
          <div className="w-2 h-2 rounded-full bg-red-600" />
        </div>
      </div>

      {/* Center Study Desk with Green Glass Banker's Lamp & Open Grimoire */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-80 md:w-96 flex flex-col items-center pointer-events-none">
        {/* Desk Objects */}
        <div className="w-full flex items-end justify-around px-6 mb-1">
          {/* Green Glass Banker's Lamp */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-4 rounded-t-full bg-emerald-500 shadow-[0_0_25px_#10b981] border border-emerald-300" />
            <div className="w-1.5 h-6 bg-amber-600" />
            <div className="w-6 h-2 bg-amber-700 rounded" />
          </div>

          {/* Open Ancient Grimoire with Pentagram */}
          <div className="w-24 h-14 bg-[#fef3c7] border-2 border-amber-950 rounded-sm shadow-xl flex justify-between p-1.5 transform -rotate-1">
            <div className="w-1/2 border-r border-amber-300 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border border-rose-600/70 flex items-center justify-center text-[7px] text-rose-700">
                ⛥
              </div>
            </div>
            <div className="w-1/2 flex flex-col justify-around px-1">
              <div className="w-full h-0.5 bg-amber-900/60" />
              <div className="w-full h-0.5 bg-amber-900/60" />
              <div className="w-3/4 h-0.5 bg-amber-900/60" />
            </div>
          </div>

          {/* Hourglass with Blood-Red Sand */}
          <div className="w-4 h-8 flex flex-col items-center justify-between border-y-2 border-amber-600">
            <div className="w-3 h-3 rounded-full bg-red-950/70 border border-amber-300 flex items-end justify-center">
              <div className="w-2 h-1 bg-red-500 rounded-b" />
            </div>
            <div className="w-3 h-3 rounded-full bg-red-950/70 border border-amber-300 flex items-start justify-center">
              <div className="w-2 h-1.5 bg-red-600 rounded-t" />
            </div>
          </div>
        </div>

        {/* Polished Mahogany Partner Desk Top */}
        <div className="w-full h-8 bg-amber-950 border-t-2 border-x-2 border-amber-700 rounded-t-lg shadow-2xl" />
        <div className="w-5/6 h-10 bg-[#1c0a02] border-x-2 border-amber-950 flex justify-between px-4">
          <div className="w-8 h-8 bg-amber-950 border border-amber-800 rounded-sm mt-1" />
          <div className="w-8 h-8 bg-amber-950 border border-amber-800 rounded-sm mt-1" />
        </div>
      </div>

      {/* Occult Magic Circle on Parquet Floor */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-96 h-40 border-2 border-rose-500/40 rounded-full shadow-[0_0_50px_rgba(225,29,72,0.4)] flex items-center justify-center animate-pulse pointer-events-none">
        <div className="w-72 h-28 border border-rose-500/30 rounded-full flex items-center justify-center">
          <span className="text-rose-400/40 text-xs tracking-widest font-cinzel">SANGUIS ET OCCULTA</span>
        </div>
      </div>
    </div>
  );
};

/**
 * CRYPT CHAPEL - Gothic Ribbed Vaults, Sarcophagus & Weeping Angels
 */
const CryptChapelScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#080214]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#13072b] via-[#0b031b] to-[#04010a]" />

      {/* Pale Lavender Moonbeam */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-gradient-to-b from-[#f3e8ff] to-[#c084fc] shadow-[0_0_80px_rgba(192,132,252,0.55)] opacity-80" />

      {/* Gothic Pointed Arches & Pillars of the Crypt */}
      <div className="absolute inset-x-0 top-0 h-96 flex justify-around">
        <div className="w-8 h-full bg-gradient-to-b from-stone-900 to-black border-r border-purple-900/40" />
        <div className="w-8 h-full bg-gradient-to-b from-stone-900 to-black border-x border-purple-900/40" />
        <div className="w-8 h-full bg-gradient-to-b from-stone-900 to-black border-l border-purple-900/40" />
      </div>

      {/* Carved Marble Sarcophagus at Center with Weeping Rose Petals */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-72 md:w-96 h-40 bg-gradient-to-t from-stone-950 to-stone-800 border-2 border-purple-900/60 rounded-t-lg shadow-[0_0_60px_rgba(168,85,247,0.3)] flex flex-col items-center justify-between p-3">
        <div className="w-full h-4 border-b border-purple-900/40 flex justify-center">
          <span className="text-[10px] font-cinzel text-purple-300/80 tracking-widest">REQUIESCAT IN PACE</span>
        </div>
        {/* Soft Lavender Candle Glow on Sarcophagus */}
        <div className="w-full flex justify-around">
          <div className="w-2.5 h-4 bg-purple-400 rounded-full shadow-[0_0_15px_#c084fc] animate-pulse" />
          <div className="w-2.5 h-4 bg-purple-400 rounded-full shadow-[0_0_15px_#c084fc] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

/**
 * CATHEDRAL ALTAR - Gothic Sacrificial Chamber & Blood Eclipse Rose Window
 */
const CathedralAltarScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#180004]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#3b030b] via-[#200105] to-[#0a0002]" />

      {/* Massive Gothic Cathedral Rose Window with Blood Eclipse */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-72 md:w-96 h-72 md:h-96 rounded-full border-4 border-red-600/80 bg-black shadow-[0_0_120px_rgba(220,38,38,0.9)] flex items-center justify-center animate-pulse">
        {/* Eclipse Ring */}
        <div className="w-64 md:w-84 h-64 md:h-84 rounded-full border border-red-500/50 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-t from-red-950 via-black to-black shadow-inner" />
        </div>
      </div>

      {/* Black Marble High Altar Slabs & Taper Candles */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 md:w-[500px] h-36 bg-gradient-to-t from-stone-950 to-stone-900 border-t-2 border-red-700/60 shadow-[0_0_80px_rgba(185,28,28,0.6)]">
        <div className="absolute top-2 inset-x-6 flex justify-around">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-3 h-5 rounded-full bg-rose-500 shadow-[0_0_15px_#f43f5e] animate-pulse" />
              <div className="w-2 h-8 bg-stone-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ROSE GARDEN - Thorny Midnight Victorian Rose Conservatory
 */
const RoseGardenScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#05060b]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0d18] via-[#05060c] to-[#020204]" />

      {/* Pale Silver Moon */}
      <div className="absolute top-8 right-24 w-44 h-44 rounded-full bg-slate-200/90 shadow-[0_0_70px_rgba(226,232,240,0.5)]" />

      {/* Wrought Iron Arches & Thorny Trellises */}
      <div className="absolute inset-x-0 bottom-0 h-96 flex justify-around items-end opacity-75">
        {[1, 2, 3, 4, 5].map((a) => (
          <div key={a} className="w-4 h-full bg-gradient-to-t from-stone-950 to-stone-800 border-x border-stone-800" />
        ))}
      </div>

      {/* Red Gothic Rose Blooms in the Shadows */}
      <div className="absolute bottom-20 left-20 w-6 h-6 rounded-full bg-red-700 shadow-[0_0_20px_#b91c1c] animate-pulse" />
      <div className="absolute bottom-32 left-44 w-5 h-5 rounded-full bg-rose-800 shadow-[0_0_15px_#be123c] animate-pulse" />
      <div className="absolute bottom-24 right-32 w-6 h-6 rounded-full bg-red-700 shadow-[0_0_20px_#b91c1c] animate-pulse" />
    </div>
  );
};

/**
 * ENDING DAWN - Golden Pink Sunrise of Salvation
 */
const EndingDawnScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#1e1b4b] via-[#701a75] to-[#f43f5e]">
      {/* Warm Golden Sun on Horizon */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-t from-amber-300 via-rose-300 to-transparent shadow-[0_0_120px_#f59e0b]" />

      {/* Calming Morning Mist and Valley */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#0f172a] via-[#334155] to-amber-200/40" />
    </div>
  );
};

/**
 * ALCHEMIST TOWER - Morrigan's High Tower Library & Occult Study
 * Modeled directly after the 4K Tower Library artwork:
 * - Gothic arched stone tracery window overlooking misty pine mountains.
 * - Arching carved oak bookshelves packed with ancient leather-bound grimoires, rolled scrolls, and hanging dried lavender/sage bundles.
 * - Glass alchemical alembics, retorts with luminous green & amethyst solutions.
 * - Candelabra with warm dripping beeswax candles illuminating the dark study.
 */
const AlchemistTowerScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#0a0712] overflow-hidden">
      {/* Deep Shadow & Gothic Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120a1f] via-[#090510] to-[#040207]" />

      <svg
        viewBox="0 0 1440 900"
        className="w-full h-full object-cover pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Candlelight Warmth Gradient */}
          <radialGradient id="studyCandleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#b45309" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Misty Mountain Window Sky */}
          <linearGradient id="mistyWindowSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#384252" />
            <stop offset="45%" stopColor="#64748b" />
            <stop offset="80%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Stone Texture Dark */}
          <linearGradient id="towerStone" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e1b24" />
            <stop offset="50%" stopColor="#292534" />
            <stop offset="100%" stopColor="#131018" />
          </linearGradient>

          {/* Rich Mahogany Shelves */}
          <linearGradient id="mahoganyWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="50%" stopColor="#291102" />
            <stop offset="100%" stopColor="#140601" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* LEFT: GOTHIC ARCHED WINDOW OVERLOOKING MISTY MOUNTAINS         */}
        {/* ============================================================== */}
        <g transform="translate(60, 40)">
          {/* Outer Recessed Stone Wall Arch */}
          <path
            d="M0,600 L0,220 C0,70 60,0 160,0 C260,0 320,70 320,220 L320,600 Z"
            fill="url(#towerStone)"
            stroke="#090510"
            strokeWidth="12"
          />
          {/* Window Glass Pane Opening */}
          <path
            d="M20,590 L20,225 C20,90 70,25 160,25 C250,25 300,90 300,225 L300,590 Z"
            fill="url(#mistyWindowSky)"
          />

          {/* Distant Mountain Ridges & Misty Pine Silhouettes in Window */}
          {/* Far Mountains */}
          <path
            d="M20,380 C70,330 140,360 210,310 C260,330 300,320 300,320 L300,590 L20,590 Z"
            fill="#334155"
            opacity="0.85"
          />
          {/* Closer Misty Ridge */}
          <path
            d="M20,440 C80,410 160,430 240,390 L300,420 L300,590 L20,590 Z"
            fill="#1e293b"
            opacity="0.9"
          />
          {/* Pine Tree Tops Silhouettes */}
          <g fill="#0f172a" opacity="0.9">
            <polygon points="50,470 58,430 66,470" />
            <polygon points="75,480 85,420 95,480" />
            <polygon points="120,460 132,410 144,460" />
            <polygon points="170,475 180,425 190,475" />
            <polygon points="220,450 232,400 244,450" />
            <polygon points="260,470 270,415 280,470" />
          </g>

          {/* Gothic Twin Arch Mullions & Stone Trefoil Tracery */}
          <path
            d="M160,25 L160,590"
            stroke="#1e1b24"
            strokeWidth="14"
          />
          {/* Twin Inner Arches */}
          <path
            d="M20,300 C20,180 60,110 90,110 C120,110 160,180 160,300"
            fill="none"
            stroke="#1e1b24"
            strokeWidth="10"
          />
          <path
            d="M160,300 C160,180 200,110 230,110 C260,110 300,180 300,300"
            fill="none"
            stroke="#1e1b24"
            strokeWidth="10"
          />
          {/* Quatrefoil Trefoil Ring above twin arches */}
          <circle cx="160" cy="95" r="28" fill="none" stroke="#1e1b24" strokeWidth="10" />

          {/* Hanging Dried Lavender & Sage Bundles on Window Hook */}
          <g transform="translate(45, 120)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="#78350f" strokeWidth="2" />
            {/* Lavender Florals */}
            <path d="M-10,35 Q-15,65 0,90 Q15,65 10,35 Z" fill="#6b21a8" opacity="0.85" />
            <path d="M-5,40 Q-8,70 0,95 Q8,70 5,40 Z" fill="#9333ea" opacity="0.8" />
          </g>
        </g>

        {/* ============================================================== */}
        {/* RIGHT: TOWERING CARVED ARCHED BOOKSHELVES & ALCHEMICAL FLASKS  */}
        {/* ============================================================== */}
        <g transform="translate(980, 20)">
          {/* Grand Carved Gothic Bookshelf Frame */}
          <path
            d="M0,880 L0,150 C0,50 80,0 220,0 C360,0 440,50 440,150 L440,880 Z"
            fill="url(#mahoganyWood)"
            stroke="#140601"
            strokeWidth="8"
          />

          {/* Shelves Horizontal Beams */}
          <rect x="20" y="160" width="400" height="18" fill="#140601" stroke="#78350f" strokeWidth="1.5" />
          <rect x="20" y="320" width="400" height="18" fill="#140601" stroke="#78350f" strokeWidth="1.5" />
          <rect x="20" y="480" width="400" height="18" fill="#140601" stroke="#78350f" strokeWidth="1.5" />
          <rect x="20" y="650" width="400" height="18" fill="#140601" stroke="#78350f" strokeWidth="1.5" />

          {/* Top Shelf: Scrolls, Alembics & Hanging Bundles */}
          <g transform="translate(40, 90)">
            {/* Rolled Vellum Scrolls */}
            <rect x="20" y="40" width="60" height="25" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="1.2" />
            <rect x="90" y="35" width="70" height="28" rx="4" fill="#fef9c3" stroke="#b45309" strokeWidth="1.2" />
            {/* Hanging Sage Bundle */}
            <g transform="translate(180, 68)">
              <path d="M-8,0 Q-12,35 0,55 Q12,35 8,0 Z" fill="#047857" opacity="0.85" />
            </g>
            {/* Round Glass Boiling Flask with Amethyst Potion */}
            <circle cx="280" cy="50" r="18" fill="#7e22ce" stroke="#d8b4fe" strokeWidth="1.5" fillOpacity="0.8" />
            <rect x="276" y="24" width="8" height="12" fill="none" stroke="#d8b4fe" strokeWidth="1.2" />
          </g>

          {/* Shelf 2: Leather-bound Tomes & Grimoires */}
          <g transform="translate(40, 185)">
            {/* Array of Books in various gothic bindings */}
            <rect x="10" y="15" width="22" height="120" rx="2" fill="#7f1d1d" stroke="#b91c1c" strokeWidth="1" />
            <rect x="35" y="5" width="26" height="130" rx="2" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1" />
            <rect x="64" y="20" width="18" height="115" rx="2" fill="#14532d" stroke="#15803d" strokeWidth="1" />
            <rect x="85" y="0" width="30" height="135" rx="2" fill="#451a03" stroke="#92400e" strokeWidth="1" />
            <rect x="118" y="10" width="20" height="125" rx="2" fill="#312e81" stroke="#4f46e5" strokeWidth="1" />
            {/* Brass Astrological Telescope on Shelf */}
            <g transform="translate(230, 70) rotate(-25)">
              <polygon points="0,0 80,-8 80,8 0,0" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="40" y1="0" x2="40" y2="40" stroke="#b45309" strokeWidth="3" />
            </g>
          </g>

          {/* Shelf 3: Glass Alembic & Chemical Retorts with Boiling Green Elixir */}
          <g transform="translate(40, 345)">
            {/* Large Alchemical Retort Flask */}
            <circle cx="90" cy="95" r="28" fill="#059669" stroke="#6ee7b7" strokeWidth="2" fillOpacity="0.85" />
            <path d="M90,70 Q130,50 160,110" stroke="#6ee7b7" strokeWidth="3" fill="none" />
            {/* Small Erlenmeyer Beaker with Glowing Purple Solution */}
            <polygon points="210,75 220,75 240,120 190,120" fill="#9333ea" stroke="#f0abfc" strokeWidth="1.5" fillOpacity="0.8" />
            {/* Stacks of Manuscripts */}
            <rect x="270" y="85" width="80" height="14" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <rect x="265" y="100" width="90" height="18" fill="#78350f" stroke="#92400e" strokeWidth="1" />
          </g>
        </g>

        {/* ============================================================== */}
        {/* CANDELABRA WITH WARM DRIPPING BEESWAX CANDLES                 */}
        {/* ============================================================== */}
        <g transform="translate(1120, 480)">
          {/* Heavy Antique 3-Branch Brass Candelabra */}
          <path d="M0,0 L0,90 M-45,30 Q-45,60 0,60 Q45,60 45,30" stroke="#b45309" strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="0" cy="95" rx="30" ry="8" fill="#78350f" stroke="#b45309" strokeWidth="2" />

          {/* Candle 1 (Left) */}
          <rect x="-49" y="5" width="8" height="25" fill="#fef9c3" stroke="#fde047" strokeWidth="0.8" rx="1" />
          <path d="M-45,5 L-45,-2" stroke="#1f2937" strokeWidth="1.5" />
          {/* Flame */}
          <ellipse cx="-45" cy="-8" rx="4" ry="7" fill="#f97316" />
          <ellipse cx="-45" cy="-7" rx="2.5" ry="5" fill="#fef08a" />

          {/* Candle 2 (Center Highest) */}
          <rect x="-4" y="-20" width="8" height="30" fill="#fef9c3" stroke="#fde047" strokeWidth="0.8" rx="1" />
          <path d="M0,-20 L0,-27" stroke="#1f2937" strokeWidth="1.5" />
          <ellipse cx="0" cy="-33" rx="4.5" ry="8" fill="#f97316" />
          <ellipse cx="0" cy="-32" rx="2.8" ry="5.5" fill="#fef08a" />

          {/* Candle 3 (Right) */}
          <rect x="41" y="5" width="8" height="25" fill="#fef9c3" stroke="#fde047" strokeWidth="0.8" rx="1" />
          <path d="M45,5 L45,-2" stroke="#1f2937" strokeWidth="1.5" />
          <ellipse cx="45" cy="-8" rx="4" ry="7" fill="#f97316" />
          <ellipse cx="45" cy="-7" rx="2.5" ry="5" fill="#fef08a" />

          {/* Warm Ambient Radial Candle Glow */}
          <circle cx="0" cy="-15" r="140" fill="url(#studyCandleGlow)" className="animate-pulse" />
        </g>
      </svg>

      {/* Mystic Atmospheric Violet Motes & Soft Steam in Tower */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

/**
 * MIRROR CORRIDOR - Lady Lenore's Haunting Castle Hallway
 * Modeled directly from the 4K Ghost Bride reference artwork:
 * - Left: Gothic arched stone window streaming silvery-blue moonlit god-rays across the corridor.
 * - Right: Medieval woven tapestry hanging on aged stone walls and wrought-iron sconce with lit candles.
 * - Floor: Receding stone cobblestones illuminated by pale moonlight.
 * - Ceiling: Ribbed gothic vaulted arches draped with dusty cobwebs and spectral mist.
 */
const MirrorCorridorScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#030611] overflow-hidden">
      {/* Deep Cold Gothic Hallway Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06101e] via-[#030712] to-[#01040a]" />

      <svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="corridorStone" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Moonlight Ray Streaming from Left Window */}
          <linearGradient id="moonGodRayLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#7dd3fc" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>

          {/* Medieval Tapestry Gradient */}
          <linearGradient id="tapestryFab" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* RECOLLECTING VAULTED CORRIDOR & COBBLESTONE PAVING             */}
        {/* ============================================================== */}
        {/* Stone Hallway Cobblestones on Floor in Perspective */}
        <g stroke="#0f172a" strokeWidth="2" opacity="0.75">
          {/* Perspective Floor Lines */}
          <line x1="720" y1="480" x2="100" y2="900" stroke="#1e293b" strokeWidth="2" />
          <line x1="720" y1="480" x2="350" y2="900" stroke="#1e293b" strokeWidth="2" />
          <line x1="720" y1="480" x2="600" y2="900" stroke="#1e293b" strokeWidth="2" />
          <line x1="720" y1="480" x2="840" y2="900" stroke="#1e293b" strokeWidth="2" />
          <line x1="720" y1="480" x2="1090" y2="900" stroke="#1e293b" strokeWidth="2" />
          <line x1="720" y1="480" x2="1340" y2="900" stroke="#1e293b" strokeWidth="2" />
          {/* Cobble Pavers Rows */}
          <path d="M520,550 Q720,530 920,550" stroke="#1e293b" strokeWidth="2" fill="none" />
          <path d="M420,620 Q720,590 1020,620" stroke="#1e293b" strokeWidth="2" fill="none" />
          <path d="M300,710 Q720,670 1140,710" stroke="#334155" strokeWidth="2.5" fill="none" />
          <path d="M160,810 Q720,760 1280,810" stroke="#334155" strokeWidth="3" fill="none" />
        </g>

        {/* Ribbed Vaulted Ceiling Arches */}
        <path
          d="M100,0 C100,280 350,420 720,420 C1090,420 1340,280 1340,0"
          stroke="#1e293b"
          strokeWidth="12"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M280,0 C280,220 480,340 720,340 C960,340 1160,220 1160,0"
          stroke="#0f172a"
          strokeWidth="8"
          fill="none"
          opacity="0.75"
        />

        {/* ============================================================== */}
        {/* LEFT: GOTHIC ARCHED WINDOW STREAMING SILVERY GOD-RAYS          */}
        {/* ============================================================== */}
        <g transform="translate(140, 100)">
          {/* Outer Recessed Stone Window Frame */}
          <path
            d="M0,520 L0,200 C0,60 50,0 120,0 C190,0 240,60 240,200 L240,520 Z"
            fill="#030814"
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Glass Pane Glowing with Cold Blue Light */}
          <path
            d="M14,510 L14,205 C14,80 55,18 120,18 C185,18 226,80 226,205 L226,510 Z"
            fill="#7dd3fc"
            fillOpacity="0.32"
          />
          {/* Window Stone Mullions & Crossbar Grid */}
          <line x1="120" y1="18" x2="120" y2="510" stroke="#0f172a" strokeWidth="6" />
          <line x1="14" y1="220" x2="226" y2="220" stroke="#0f172a" strokeWidth="5" />
          <line x1="14" y1="360" x2="226" y2="360" stroke="#0f172a" strokeWidth="5" />
          {/* Stone Trefoil Arc */}
          <path d="M14,140 Q67,70 120,140 Q173,70 226,140" stroke="#0f172a" strokeWidth="5" fill="none" />
        </g>

        {/* SILVERY-BLUE MOONBEAMS STREAMING DIAGONALLY ACROSS CORRIDOR */}
        <polygon
          points="260,120 380,120 950,900 480,900"
          fill="url(#moonGodRayLeft)"
          className="pointer-events-none"
        />

        {/* ============================================================== */}
        {/* RIGHT: MEDIEVAL TAPESTRY & WROUGHT-IRON CANDLE SCONCE          */}
        {/* ============================================================== */}
        {/* Antique Medieval Tapestry Hanging on Right Wall */}
        <g transform="translate(1080, 160)">
          {/* Hanging Rod & Finials */}
          <line x1="-10" y1="0" x2="260" y2="0" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
          <circle cx="-10" cy="0" r="5" fill="#b45309" />
          <circle cx="260" cy="0" r="5" fill="#b45309" />
          {/* Tapestry Woven Body with Mythological Faded Design */}
          <rect x="0" y="8" width="250" height="380" rx="2" fill="url(#tapestryFab)" stroke="#1e293b" strokeWidth="2" />
          {/* Faded Ornamental Border */}
          <rect x="12" y="20" width="226" height="356" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4,3" />
          {/* Faded Heraldic Tree / Rose Emblem */}
          <circle cx="125" cy="180" r="45" fill="none" stroke="#64748b" strokeWidth="1.2" opacity="0.6" />
          <path d="M125,140 L125,220 M95,180 L155,180" stroke="#64748b" strokeWidth="1.2" opacity="0.6" />
          {/* Bottom Fringe */}
          <line x1="0" y1="388" x2="250" y2="388" stroke="#78350f" strokeWidth="3" strokeDasharray="3,2" />
        </g>

        {/* Wrought-Iron Double Candle Sconce with Wax Candles on Right */}
        <g transform="translate(980, 240)">
          {/* Iron Wall Mount */}
          <circle cx="0" cy="0" r="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <path d="M0,0 Q25,25 45,0 M0,0 Q-25,25 -45,0" stroke="#1e293b" strokeWidth="4" fill="none" />
          {/* Left Candle Holder */}
          <rect x="-48" y="-22" width="6" height="22" fill="#fef9c3" rx="1" />
          <ellipse cx="-45" cy="-28" rx="3.5" ry="6" fill="#f97316" />
          <ellipse cx="-45" cy="-27" rx="2" ry="4" fill="#fef08a" />
          {/* Right Candle Holder */}
          <rect x="42" y="-22" width="6" height="22" fill="#fef9c3" rx="1" />
          <ellipse cx="45" cy="-28" rx="3.5" ry="6" fill="#f97316" />
          <ellipse cx="45" cy="-27" rx="2" ry="4" fill="#fef08a" />
          {/* Warm Candlelight Flickers */}
          <circle cx="-45" cy="-25" r="30" fill="#f59e0b" opacity="0.2" className="animate-pulse" />
          <circle cx="45" cy="-25" r="30" fill="#f59e0b" opacity="0.2" className="animate-pulse" />
        </g>

        {/* Cobwebs Draped in Upper Vaulted Corners */}
        <g stroke="#cbd5e1" strokeWidth="0.8" opacity="0.4" fill="none">
          <path d="M0,0 Q180,90 280,0" />
          <path d="M0,40 Q140,110 240,0" />
          <line x1="0" y1="0" x2="200" y2="80" />
          <path d="M1440,0 Q1260,90 1160,0" />
          <line x1="1440" y1="0" x2="1240" y2="80" />
        </g>
      </svg>

      {/* Atmospheric Moonlit Dust Motes & Spectral Particle Twinkles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] animate-ping" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_12px_#38bdf8] animate-pulse" />
        <div className="absolute top-2/3 left-1/2 w-1.5 h-1.5 rounded-full bg-sky-200 opacity-80" />
        <div className="absolute top-1/4 left-1/2 w-1 h-1 rounded-full bg-white opacity-70" />
      </div>

      {/* Creeping Spectral Cyan Fog along the Polished Flagstone Floor */}
      <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-sky-950/70 via-sky-900/30 to-transparent blur-md pointer-events-none" />
      <div className="absolute -bottom-8 inset-x-0 h-32 bg-sky-500/10 blur-2xl animate-pulse pointer-events-none" />
    </div>
  );
};

/**
 * SERVANT QUARTERS - Beatrice's Intimate Gothic Chamber
 * Dim candelabras, heavy iron keys on vanity, dark mahogany bed drapes, and fireplace embers.
 */
const ServantQuartersScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#09080c]">
      {/* Dim Warm Shadows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#18131d] via-[#09080c] to-[#040306]" />

      {/* Small Diamond-Paned Gothic Window */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-64 border-4 border-stone-800 rounded-t-full bg-slate-950/90 shadow-[0_0_40px_rgba(16,185,129,0.2)] overflow-hidden">
        {/* Moon Slit & Diamond Glass Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-emerald-500/20 blur-sm" />
      </div>

      {/* Deep Draped Four-Poster Bed on Left */}
      <div className="absolute bottom-0 left-6 md:left-20 w-72 md:w-96 h-80 bg-gradient-to-t from-stone-950 via-[#1c1917] to-transparent border-t-2 border-stone-800 rounded-t-lg">
        {/* Heavy Velvet Canopy Drapes */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-emerald-950/80 to-transparent" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-emerald-950/80 to-transparent" />
      </div>

      {/* Vanity Table on Right with Iron Keys & Candle */}
      <div className="absolute bottom-0 right-8 md:right-24 w-60 h-48 bg-stone-950 border-t-4 border-stone-800 rounded-t-md p-4 flex flex-col justify-between">
        {/* Burning Candle */}
        <div className="flex flex-col items-center">
          <div className="w-2.5 h-4 rounded-full bg-amber-400 shadow-[0_0_20px_#f59e0b] animate-pulse" />
          <div className="w-4 h-12 bg-stone-200 rounded-t-sm" />
          <div className="w-10 h-3 bg-amber-900 rounded" />
        </div>
        {/* Iron Keys Ring on Vanity */}
        <div className="w-12 h-6 border-2 border-stone-600 rounded-full mx-auto" />
      </div>
    </div>
  );
};

/**
 * BLACKWOOD FOREST ROAD - Prologue Scene 01
 * Ominous blood-red full moon, choking mist shrouding ancient twisted pines,
 * and winding muddy carriage path cut through the pitch-black wilderness.
 */
const BlackwoodForestScene: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#050208] overflow-hidden select-none">
      {/* Night Sky with deep purplish-blood darkness */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0314] via-[#1a051d] to-[#040106]" />

      {/* Menacing Blood-Red Full Moon */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-36 w-64 h-64 md:w-84 md:h-84 rounded-full bg-gradient-to-br from-[#ff1744] via-[#b91c1c] to-[#450a0a] shadow-[0_0_120px_rgba(239,68,68,0.75)] animate-pulse">
        {/* Lunar Crater Veins */}
        <div className="absolute top-10 left-12 w-20 h-20 rounded-full bg-black/25 blur-xs" />
        <div className="absolute top-28 left-24 w-28 h-28 rounded-full bg-black/30 blur-xs" />
        <div className="absolute bottom-12 right-16 w-16 h-16 rounded-full bg-black/25 blur-xs" />
        <div className="absolute inset-0 rounded-full border border-red-500/30" />
      </div>

      {/* Choking Clouds / Red Moon Mist Veils */}
      <div className="absolute top-16 inset-x-0 h-48 bg-gradient-to-b from-transparent via-red-950/20 to-transparent blur-2xl pointer-events-none" />

      {/* SVG Ancient Black Pines & Muddy Forest Road Silhouette */}
      <svg
        viewBox="0 0 1440 800"
        className="absolute bottom-0 w-full h-auto object-cover opacity-95 pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="forestDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#15061c" />
            <stop offset="60%" stopColor="#0d0312" />
            <stop offset="100%" stopColor="#030006" />
          </linearGradient>
          <linearGradient id="muddyRoadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a1122" />
            <stop offset="50%" stopColor="#180715" />
            <stop offset="100%" stopColor="#080208" />
          </linearGradient>
          <linearGradient id="puddleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Deep Background Tree Ridge */}
        <path
          d="M0,480 L40,430 L80,470 L120,410 L160,460 L220,380 L260,450 L320,400 L380,470 L460,390 L520,450 L600,370 L660,440 L720,390 L800,460 L880,380 L960,450 L1040,390 L1120,460 L1200,380 L1280,450 L1360,410 L1440,470 L1440,800 L0,800 Z"
          fill="#08020d"
          opacity="0.85"
        />

        {/* Foreground Gigantic Gnarled Black Pines (Left Side) */}
        {/* Tree 1 Left */}
        <polygon points="120,120 100,240 140,240" fill="url(#forestDarkGrad)" />
        <polygon points="120,180 80,330 160,330" fill="url(#forestDarkGrad)" />
        <polygon points="120,270 60,460 180,460" fill="url(#forestDarkGrad)" />
        <polygon points="120,380 40,620 200,620" fill="url(#forestDarkGrad)" />
        <rect x="105" y="600" width="30" height="200" fill="#040106" />

        {/* Tree 2 Far Left */}
        <polygon points="30,220 0,420 70,420" fill="url(#forestDarkGrad)" />
        <polygon points="30,340 -20,660 90,660" fill="url(#forestDarkGrad)" />

        {/* Foreground Gigantic Gnarled Black Pines (Right Side) */}
        {/* Tree 1 Right */}
        <polygon points="1320,110 1300,230 1340,230" fill="url(#forestDarkGrad)" />
        <polygon points="1320,170 1280,320 1360,320" fill="url(#forestDarkGrad)" />
        <polygon points="1320,260 1250,450 1390,450" fill="url(#forestDarkGrad)" />
        <polygon points="1320,370 1230,620 1410,620" fill="url(#forestDarkGrad)" />
        <rect x="1305" y="600" width="32" height="200" fill="#040106" />

        {/* Tree 2 Far Right */}
        <polygon points="1420,180 1380,380 1450,380" fill="url(#forestDarkGrad)" />
        <polygon points="1420,300 1360,650 1470,650" fill="url(#forestDarkGrad)" />

        {/* Winding Muddy Road Cut Through Center */}
        <path
          d="M680,490 C690,530 730,580 710,630 C680,700 620,740 540,800 L950,800 C920,740 850,700 810,630 C780,570 730,530 720,490 Z"
          fill="url(#muddyRoadGrad)"
        />

        {/* Carriage Wheel Ruts in Thick Mud */}
        <path
          d="M695,500 C705,540 735,590 715,640 C685,710 635,760 560,800"
          stroke="#09020a"
          strokeWidth="6"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M710,500 C720,540 755,590 735,640 C715,710 690,760 630,800"
          stroke="#09020a"
          strokeWidth="6"
          fill="none"
          opacity="0.8"
        />

        {/* Glistening Muddy Puddles Reflecting the Crimson Moon */}
        <ellipse cx="690" cy="580" rx="35" ry="10" fill="url(#puddleGlow)" />
        <ellipse cx="730" cy="670" rx="55" ry="14" fill="url(#puddleGlow)" />
        <ellipse cx="660" cy="740" rx="80" ry="18" fill="url(#puddleGlow)" />

        {/* Gnarled, Twisted Overhanging Branches */}
        <path
          d="M130,420 Q240,360 380,390 Q450,405 520,370"
          stroke="#050108"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M1310,410 Q1200,350 1060,380 Q990,395 920,360"
          stroke="#050108"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Distant Fleeting Red Eyes Glowing in the Dark Pines (Hint of Danger) */}
      <div className="absolute top-[48%] left-[28%] flex gap-3 pointer-events-none opacity-80 animate-pulse">
        <div className="w-1.5 h-1 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
        <div className="w-1.5 h-1 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
      </div>

      {/* Rolling Low Volumetric Fog Layers */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-slate-900/60 via-purple-950/20 to-transparent blur-xl pointer-events-none" />
      <div className="absolute bottom-6 inset-x-0 h-28 bg-gradient-to-t from-red-950/30 via-slate-950/40 to-transparent blur-lg pointer-events-none animate-pulse duration-1000" />
    </div>
  );
};
