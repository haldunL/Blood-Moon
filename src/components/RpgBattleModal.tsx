/**
 * Turn-Based RPG Battle Screen for Ravenscroft Castle
 * Features full party combat with Julian and his chosen companion (Vivienne, Evangeline, or Valeria),
 * dynamic enemy AI, floating combat text, visual attack FX, sound synthesis, and rewards.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CharacterId, GameStats } from '../types/novel';
import { 
  EnemyId, 
  EnemyStats, 
  PlayerStats, 
  BattleLogEntry, 
  FloatingText, 
  BattlePhase 
} from '../types/battle';
import { ENEMY_PRESETS, COMPANION_CONFIGS, PLAYER_SKILLS } from '../data/battleData';
import { ITEMS_DATABASE } from '../data/inventoryData';
import { soundManager } from '../utils/audioSynthesizer';
import { calculateLevelProgress } from '../utils/progression';
import { AnimeCharacterSprite } from './AnimeCharacterSprite';
import { Award, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface RpgBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVictory?: (rewards: {
    expGained?: number;
    itemReward?: string;
    sanityBonus: number;
    affectionBonus: { character: CharacterId; amount: number };
  }) => void;
  initialEnemyId?: EnemyId;
  defaultCompanion?: 'none' | 'vivienne' | 'evangeline' | 'valeria' | 'beatrice' | 'morrigan' | 'lenore';
  currentStats: GameStats;
}

export const RpgBattleModal: React.FC<RpgBattleModalProps> = ({
  isOpen,
  onClose,
  onVictory,
  initialEnemyId = 'grave_wolf',
  defaultCompanion = 'none',
  currentStats,
}) => {
  // Selected enemy and companion
  const [selectedEnemyId, setSelectedEnemyId] = useState<EnemyId>(initialEnemyId);
  const [activeCompanion, setActiveCompanion] = useState<'none' | 'vivienne' | 'evangeline' | 'valeria' | 'beatrice' | 'morrigan' | 'lenore'>(defaultCompanion);

  // Combat Entities State
  const [enemy, setEnemy] = useState<EnemyStats>(() => ({ ...(ENEMY_PRESETS[initialEnemyId] || ENEMY_PRESETS['grave_wolf']) }));
  const [player, setPlayer] = useState<PlayerStats>({
    maxHp: 220,
    hp: 220,
    maxSp: 80,
    sp: 80,
    atk: 32,
    def: 18,
    overdrive: 40,
    inventory: {
      holyWater: 4,
      blackRoseNectar: 3,
      silverCrucifixDust: 3,
    },
  });

  // Battle State
  const [phase, setPhase] = useState<BattlePhase>('player_turn');
  const [turnCount, setTurnCount] = useState<number>(1);
  const [isGuarding, setIsGuarding] = useState<boolean>(false);
  const [companionShield, setCompanionShield] = useState<number>(0);
  const [enemyBleedTurns, setEnemyBleedTurns] = useState<number>(0);
  const [enemyStunned, setEnemyStunned] = useState<boolean>(false);

  // Submenu states
  const [menuTab, setMenuTab] = useState<'main' | 'skills' | 'companion' | 'items'>('main');

  // Visual Effects State
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [bloodFlash, setBloodFlash] = useState<boolean>(false);
  const [holyFlash, setHolyFlash] = useState<boolean>(false);
  const [enemyHurt, setEnemyHurt] = useState<boolean>(false);
  const [enemyAttacking, setEnemyAttacking] = useState<boolean>(false);
  const [slashAnim, setSlashAnim] = useState<boolean>(false);

  // Battle Log
  const [battleLogs, setBattleLogs] = useState<BattleLogEntry[]>([
    {
      id: 'init_1',
      text: '⚔️ Savaş başladı! Pozisyonunu al ve hazır ol!',
      type: 'system',
    },
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Reset or initialize combat when modal opens or parameters change
  useEffect(() => {
    if (isOpen) {
      setSelectedEnemyId(initialEnemyId);
      setActiveCompanion(defaultCompanion);
      const preset = ENEMY_PRESETS[initialEnemyId] || ENEMY_PRESETS['grave_wolf'];
      setEnemy({ ...preset, hp: preset.maxHp });
      setPlayer({
        maxHp: 120,
        hp: 120,
        maxSp: 60,
        sp: 60,
        atk: 24,
        def: 12,
        overdrive: 25,
        inventory: {
          holyWater: 3,
          blackRoseNectar: 2,
          silverCrucifixDust: 2,
        },
      });
      setPhase('player_turn');
      setTurnCount(1);
      setIsGuarding(false);
      setCompanionShield(0);
      setEnemyBleedTurns(0);
      setEnemyStunned(false);
      setMenuTab('main');
      setBattleLogs([
        {
          id: 'init_' + Date.now(),
          text: `⚔️ ${preset.name} (${preset.title}) karşına dikildi!`,
          type: 'system',
        },
      ]);
      soundManager.playMood('tension');
    }
  }, [isOpen, initialEnemyId, defaultCompanion]);

  // Safe internal auto-scroll for log only (never scrolls window or modal)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [battleLogs]);

  // Add floating combat text
  const addFloatingText = (text: string, type: FloatingText['type'], target: 'player' | 'enemy') => {
    const id = Math.random().toString();
    setFloatingTexts((prev) => [...prev, { id, text, type, target }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Add log
  const addLog = (text: string, type: BattleLogEntry['type']) => {
    setBattleLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        text,
        type,
      },
    ]);
  };

  // Trigger screen shake
  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  // ENEMY TURN AI LOGIC
  const executeEnemyTurn = useCallback(() => {
    if (enemy.hp <= 0) return;

    setPhase('enemy_turn');

    // Check Stun
    if (enemyStunned) {
      addLog(`💫 ${enemy.name} sersemlemiş durumda, bu tur hamle yapamadı!`, 'system');
      addFloatingText('SERSEM!', 'status', 'enemy');
      setEnemyStunned(false);
      setTimeout(() => {
        setPhase('player_turn');
        setTurnCount((prev) => prev + 1);
      }, 1000);
      return;
    }

    // Process Bleed DoT on Enemy
    if (enemyBleedTurns > 0) {
      const bleedDmg = Math.round(enemy.maxHp * 0.08);
      setEnemy((prev) => ({ ...prev, hp: Math.max(0, prev.hp - bleedDmg) }));
      addFloatingText(`-${bleedDmg} KANAMA`, 'damage', 'enemy');
      addLog(`🩸 ${enemy.name} kanama nedeniyle ${bleedDmg} hasar aldı!`, 'system');
      setEnemyBleedTurns((p) => p - 1);

      if (enemy.hp - bleedDmg <= 0) {
        soundManager.playVictory();
        setPhase('victory');
        return;
      }
    }

    // AI selects action
    setTimeout(() => {
      setEnemyAttacking(true);
      const action = enemy.actions[Math.floor(Math.random() * enemy.actions.length)];
      addLog(`⚡ ${enemy.name}, "${action.name}" ile saldırıya geçti!`, 'enemy');

      // Visual cues
      if (action.type === 'dark_magic' || action.type === 'curse') {
        setBloodFlash(true);
        setTimeout(() => setBloodFlash(false), 300);
        soundManager.playSpell();
      } else {
        triggerShake();
        soundManager.playSlash();
      }

      setTimeout(() => {
        setEnemyAttacking(false);

        // Calculate damage
        let rawDamage = enemy.atk * action.power;
        // Companion passive mitigation
        if (activeCompanion === 'evangeline') {
          rawDamage *= 0.85; // Evangeline passive holy ward
        }

        let finalDamage = Math.max(8, Math.round(rawDamage - player.def * 0.5));

        // Player guarding effect
        if (isGuarding) {
          finalDamage = Math.round(finalDamage * 0.5);
          addFloatingText('SAVUNULDU!', 'status', 'player');
        }

        // Companion shield absorption
        if (companionShield > 0) {
          finalDamage = Math.round(finalDamage * 0.35);
          setCompanionShield(0);
          addFloatingText('KALKAN EMİŞİ!', 'status', 'player');
        }

        // Apply damage to player
        setPlayer((prev) => {
          const nextHp = Math.max(0, prev.hp - finalDamage);
          const nextOverdrive = Math.min(100, prev.overdrive + 12);
          return { ...prev, hp: nextHp, overdrive: nextOverdrive };
        });

        addFloatingText(`-${finalDamage} HP`, 'damage', 'player');
        addLog(`💥 ${action.name} sana ${finalDamage} hasar verdi!`, 'enemy');

        // Check player defeat
        if (player.hp - finalDamage <= 0) {
          soundManager.playSfx('glass_shatter');
          setPhase('defeat');
          addLog('💀 Julian bilincini kaybetti... Şatonun karanlığı üzerine çöktü!', 'defeat');
          return;
        }

        // End turn, return to player
        setIsGuarding(false);
        setPhase('player_turn');
        setTurnCount((prev) => prev + 1);
      }, 600);
    }, 800);
  }, [enemy, enemyStunned, enemyBleedTurns, isGuarding, companionShield, activeCompanion, player.def, player.hp]);

  // PLAYER BASIC ATTACK
  const handlePlayerAttack = () => {
    if (phase !== 'player_turn') return;
    setPhase('action_executing');
    setMenuTab('main');

    // Slash animation & sound
    setSlashAnim(true);
    soundManager.playSlash();
    setTimeout(() => setSlashAnim(false), 300);

    // Calculate damage with critical chance
    const isCrit = Math.random() < (activeCompanion === 'valeria' ? 0.35 : 0.15);
    const baseDamage = player.atk + Math.floor(Math.random() * 8);
    const damage = isCrit ? Math.round(baseDamage * 1.8) : baseDamage;

    // Apply Vivienne Lifesteal Passive
    if (activeCompanion === 'vivienne') {
      const heal = Math.round(damage * 0.2);
      setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + heal) }));
      addFloatingText(`+${heal} HP`, 'heal', 'player');
    }

    setEnemyHurt(true);
    setTimeout(() => setEnemyHurt(false), 400);

    setEnemy((prev) => {
      const nextHp = Math.max(0, prev.hp - damage);
      return { ...prev, hp: nextHp };
    });

    setPlayer((prev) => ({
      ...prev,
      overdrive: Math.min(100, prev.overdrive + 10),
    }));

    if (isCrit) {
      soundManager.playCrit();
      triggerShake();
      addFloatingText(`KRİTİK! -${damage}`, 'crit', 'enemy');
      addLog(`🔥 KRİTİK VURUŞ! Gümüş hançerinle ${enemy.name} üzerinde ${damage} hasar açtın!`, 'critical');
    } else {
      addFloatingText(`-${damage}`, 'damage', 'enemy');
      addLog(`🗡️ ${enemy.name} hedefine gümüş hançerle saldırdın: ${damage} hasar!`, 'player');
    }

    // Check Victory
    if (enemy.hp - damage <= 0) {
      handleVictory();
      return;
    }

    // Next: Enemy turn
    setTimeout(() => {
      executeEnemyTurn();
    }, 900);
  };

  // PLAYER CAST SKILL
  const handlePlayerSkill = (skill: typeof PLAYER_SKILLS[0]) => {
    if (phase !== 'player_turn') return;
    if (player.sp < skill.spCost) {
      addFloatingText('Yetersiz SP!', 'status', 'player');
      return;
    }

    setPhase('action_executing');
    setMenuTab('main');

    setPlayer((p) => ({ ...p, sp: p.sp - skill.spCost }));

    if (skill.id === 'mind_fortress') {
      soundManager.playHeal();
      setPlayer((p) => ({ ...p, sp: Math.min(p.maxSp, p.sp + 25) }));
      addFloatingText('+25 SP', 'sp', 'player');
      addLog('🧘 Zihnini toparladın ve ruh gücünü tazeledin (+25 SP).', 'player');
      setTimeout(executeEnemyTurn, 800);
      return;
    }

    if (skill.id === 'blood_pact') {
      soundManager.playSpell();
      setBloodFlash(true);
      setTimeout(() => setBloodFlash(false), 300);
      setPlayer((p) => ({ ...p, hp: Math.max(1, p.hp - 15) }));
      addFloatingText('-15 HP KAN', 'status', 'player');
    } else {
      soundManager.playSpell();
      setHolyFlash(true);
      setTimeout(() => setHolyFlash(false), 300);
    }

    const damage = Math.round((player.atk * skill.power) + Math.random() * 10);
    setEnemyHurt(true);
    setTimeout(() => setEnemyHurt(false), 400);

    setEnemy((prev) => ({ ...prev, hp: Math.max(0, prev.hp - damage) }));
    addFloatingText(`-${damage}`, 'damage', 'enemy');
    addLog(`✨ "${skill.name}" büyüsünü fırlattın: ${damage} hasar!`, 'player');

    if (enemy.hp - damage <= 0) {
      handleVictory();
      return;
    }

    setTimeout(executeEnemyTurn, 900);
  };

  // COMPANION SKILL
  const handleCompanionSkill = (skillIndex: number) => {
    if (phase !== 'player_turn') return;
    const config = COMPANION_CONFIGS[activeCompanion];
    const skill = config.skills[skillIndex];

    if (player.sp < skill.spCost) {
      addFloatingText('Yetersiz SP!', 'status', 'player');
      return;
    }

    setPhase('action_executing');
    setMenuTab('main');
    setPlayer((p) => ({ ...p, sp: p.sp - skill.spCost }));

    addLog(`👑 ${config.name}, "${skill.name}" hamlesini sahaya sürdü!`, 'companion');

    // Visual & Audio based on animType
    if (skill.animType === 'blood') {
      setBloodFlash(true);
      setTimeout(() => setBloodFlash(false), 350);
      soundManager.playSpell();
    } else if (skill.animType === 'holy') {
      setHolyFlash(true);
      setTimeout(() => setHolyFlash(false), 350);
      soundManager.playHeal();
    } else {
      setSlashAnim(true);
      triggerShake();
      soundManager.playSlash();
      setTimeout(() => setSlashAnim(false), 350);
    }

    // Effect logic
    if (skill.type === 'heal') {
      const healAmount = Math.round(60 * skill.powerMultiplier);
      setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + healAmount) }));
      addFloatingText(`+${healAmount} HP`, 'heal', 'player');
      addLog(`💚 ${config.name} şifalı dokunuşuyla Julian'ı ${healAmount} HP iyileştirdi!`, 'companion');
    } else if (skill.type === 'buff') {
      setCompanionShield(1);
      addFloatingText('KUTSAL KALKAN!', 'status', 'player');
      addLog(`🛡️ ${config.name} etrafına ışık bariyeri ördü! Gelecek darbe hafifleyecek.`, 'companion');
    } else {
      // Damage or Ultimate
      const dmg = Math.round(player.atk * skill.powerMultiplier * 1.5 + Math.random() * 12);
      setEnemyHurt(true);
      setTimeout(() => setEnemyHurt(false), 400);

      setEnemy((prev) => ({ ...prev, hp: Math.max(0, prev.hp - dmg) }));
      addFloatingText(`-${dmg}`, skill.type === 'ultimate' ? 'crit' : 'damage', 'enemy');

      if (skill.animType === 'blood') {
        setEnemyBleedTurns(3);
        addFloatingText('KANAMA!', 'status', 'enemy');
      } else if (skill.type === 'ultimate' && activeCompanion === 'valeria') {
        setEnemyStunned(true);
        addFloatingText('SERSEMLEDİ!', 'status', 'enemy');
      }

      addLog(`💥 ${config.name} düşmana ${dmg} hasar indirdi!`, 'companion');

      if (enemy.hp - dmg <= 0) {
        handleVictory();
        return;
      }
    }

    setTimeout(executeEnemyTurn, 1000);
  };

  // OVERDRIVE LIMIT BREAK
  const handleOverdrive = () => {
    if (phase !== 'player_turn' || player.overdrive < 100) return;

    setPhase('action_executing');
    setMenuTab('main');
    setPlayer((p) => ({ ...p, overdrive: 0 }));

    setBloodFlash(true);
    setHolyFlash(true);
    triggerShake();
    soundManager.playCrit();
    setTimeout(() => {
      setBloodFlash(false);
      setHolyFlash(false);
    }, 600);

    const dmg = Math.round(player.atk * 3.5 + 45);
    setEnemyHurt(true);
    setTimeout(() => setEnemyHurt(false), 500);

    setEnemy((prev) => ({ ...prev, hp: Math.max(0, prev.hp - dmg) }));
    addFloatingText(`NİHAİ PATLAMA! -${dmg}`, 'crit', 'enemy');
    addLog(`🌕 KIZIL AYIN NİHAİ GAZABI! Julian ve ${COMPANION_CONFIGS[activeCompanion].name} birleşerek ${dmg} devasa hasar verdi!`, 'critical');

    if (enemy.hp - dmg <= 0) {
      handleVictory();
      return;
    }

    setTimeout(executeEnemyTurn, 1100);
  };

  // DEFEND ACTION
  const handleDefend = () => {
    if (phase !== 'player_turn') return;
    setPhase('action_executing');
    setMenuTab('main');
    setIsGuarding(true);
    soundManager.playSfx('click');

    setPlayer((p) => ({
      ...p,
      overdrive: Math.min(100, p.overdrive + 20),
    }));

    addFloatingText('SAVUNMA DURUŞU', 'status', 'player');
    addLog('🛡️ Savunmaya geçtin; gelen hasar yarıya inecek ve Overdrive dolacak.', 'player');

    setTimeout(executeEnemyTurn, 700);
  };

  // USE ITEM
  const handleUseItem = (itemKey: keyof PlayerStats['inventory']) => {
    if (phase !== 'player_turn') return;
    if (player.inventory[itemKey] <= 0) return;

    setPhase('action_executing');
    setMenuTab('main');

    setPlayer((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [itemKey]: prev.inventory[itemKey] - 1,
      },
    }));

    if (itemKey === 'holyWater') {
      soundManager.playHeal();
      setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + 60) }));
      addFloatingText('+60 HP', 'heal', 'player');
      addLog('🧪 Kutsal Şato İksirini içtin; 60 Can yenilendi!', 'player');
    } else if (itemKey === 'blackRoseNectar') {
      soundManager.playSpell();
      setPlayer((p) => ({ ...p, sp: Math.min(p.maxSp, p.sp + 35) }));
      addFloatingText('+35 SP', 'sp', 'player');
      addLog('🌹 Siyah Gül Nektarını içtin; 35 Ruh Gücü (SP) tazelendi!', 'player');
    } else if (itemKey === 'silverCrucifixDust') {
      soundManager.playSpell();
      setEnemyStunned(true);
      addFloatingText('GÖZ KAMAŞTI!', 'status', 'enemy');
      addLog('✝️ Gümüş Haç Tozunu düşmanın gözlerine savurdun! Düşman bir tur sersemledi.', 'player');
    }

    setTimeout(executeEnemyTurn, 800);
  };

  // EXP & Level calculation for rewards
  const currentExp = currentStats?.exp || 0;
  const isEarlyEnemy = selectedEnemyId === 'crypt_knight' || selectedEnemyId === 'grave_wolf';
  const expGained = isEarlyEnemy ? 25 : (enemy.expReward || 35);
  const oldProg = calculateLevelProgress(currentExp);
  const newProg = calculateLevelProgress(currentExp + expGained);
  const didLevelUp = newProg.level > oldProg.level;

  const rewardedItemId = isEarlyEnemy 
    ? 'ravenscroft_crest_seal' 
    : (selectedEnemyId === 'blood_phantom' 
      ? 'black_rose_nectar' 
      : (selectedEnemyId === 'inquisitor_wraith' 
        ? 'inquisition_blade_shard' 
        : 'silver_guard_badge'));
  const rewardedItemDef = ITEMS_DATABASE[rewardedItemId];

  // VICTORY HANDLER
  const handleVictory = () => {
    soundManager.playVictory();
    setPhase('victory');
    addLog(`🏆 ZAFER! ${enemy.name} yok edildi! Şatonun karanlığı geri çekildi.`, 'victory');
    addLog(`⭐ +${expGained} EXP kazanıldı! ${didLevelUp ? `🎉 SEVİYE ATLADIN: Lv.${newProg.level}!` : ''}`, 'victory');
    if (rewardedItemDef) {
      addLog(`🦅 Ganimet: 1x "${rewardedItemDef.name}" elde edildi!`, 'victory');
    }

    if (onVictory) {
      onVictory({
        expGained,
        itemReward: rewardedItemId,
        sanityBonus: 15,
        affectionBonus: {
          character: activeCompanion === 'none' ? 'vivienne' : activeCompanion,
          amount: activeCompanion === 'none' ? 0 : 15,
        },
      });
    }
  };

  if (!isOpen) return null;

  const companion = COMPANION_CONFIGS[activeCompanion] || COMPANION_CONFIGS['none'];
  const hpPercent = Math.max(0, Math.min(100, Math.round((enemy.hp / enemy.maxHp) * 100)));
  const playerHpPercent = Math.max(0, Math.min(100, Math.round((player.hp / player.maxHp) * 100)));
  const playerSpPercent = Math.max(0, Math.min(100, Math.round((player.sp / player.maxSp) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md select-none overflow-hidden animate-fadeIn">
      {/* Visual Flash Layers */}
      {bloodFlash && <div className="absolute inset-0 bg-red-600/30 z-30 pointer-events-none transition-opacity duration-150" />}
      {holyFlash && <div className="absolute inset-0 bg-amber-200/30 z-30 pointer-events-none transition-opacity duration-150" />}
      {slashAnim && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rotate-45 animate-ping shadow-[0_0_20px_#38bdf8]" />
        </div>
      )}

      {/* Main Battle Container */}
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[760px] bg-slate-950 border-2 border-red-950/80 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.4)] flex flex-col overflow-hidden select-none overscroll-none"
      >
        {/* Battle Top Bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border-b border-red-900/40">
          <div className="flex items-center space-x-3">
            <span className="text-xl">⚔️</span>
            <div>
              <h2 className="text-sm font-serif font-bold tracking-widest text-red-200 uppercase flex items-center gap-2">
                <span>KIZIL AYIN DÖVÜŞÜ</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-800/40 font-mono">
                  Tur {turnCount}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Faz: {phase === 'player_turn' ? 'Sıra Sende' : phase === 'enemy_turn' ? 'Düşman Hamlesi' : 'Sonuç'}</p>
            </div>
          </div>
        </header>

        {/* Combat Arena Canvas */}
        <div
          className={`relative flex-1 min-h-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-stone-950 to-black overflow-hidden flex flex-col justify-between p-5 transition-transform duration-75 ${
            screenShake ? 'translate-x-1 -translate-y-1' : ''
          }`}
        >
          {/* Gothic Background Grid / Embers */}
          <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-red-950/20 to-transparent pointer-events-none" />

          {/* ENEMY ZONE */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Enemy HP and Stats Bar */}
            <div className="w-full max-w-md bg-black/60 backdrop-blur-md border border-red-900/60 rounded-xl p-3 shadow-lg flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-serif font-bold text-red-300 tracking-wide">{enemy.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">{enemy.hp} / {enemy.maxHp} HP ({hpPercent}%)</span>
              </div>
              {/* HP Bar */}
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-red-950">
                <div
                  className="h-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-300 rounded-full"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              {/* Status Badges */}
              <div className="flex items-center space-x-2 pt-0.5">
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                  {enemy.title}
                </span>
                {enemyBleedTurns > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-rose-950 text-rose-300 rounded border border-rose-800 flex items-center space-x-1 animate-pulse">
                    <span>🩸</span>
                    <span>Kanama ({enemyBleedTurns})</span>
                  </span>
                )}
                {enemyStunned && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-950 text-amber-300 rounded border border-amber-800 flex items-center space-x-1 animate-bounce">
                    <span>💫</span>
                    <span>Sersemledi</span>
                  </span>
                )}
              </div>
            </div>

            {/* Enemy Sprite & Floating Text */}
            <div className="relative mt-2 h-44 w-64 flex items-center justify-center">
              {/* Floating Combat Text for Enemy */}
              {floatingTexts
                .filter((f) => f.target === 'enemy')
                .map((f) => (
                  <div
                    key={f.id}
                    className={`absolute z-30 font-bold font-serif pointer-events-none animate-bounce ${
                      f.type === 'crit'
                        ? 'text-yellow-400 text-2xl font-black drop-shadow-[0_0_10px_#eab308]'
                        : f.type === 'damage'
                        ? 'text-red-400 text-xl drop-shadow-[0_0_8px_#dc2626]'
                        : 'text-cyan-300 text-sm'
                    }`}
                    style={{ top: '10%' }}
                  >
                    {f.text}
                  </div>
                ))}

              {/* Enemy Animated Body */}
              <div
                className={`relative w-40 h-40 transition-all duration-200 flex items-center justify-center ${
                  enemyHurt
                    ? 'filter brightness-200 contrast-150 scale-95 translate-y-2'
                    : enemyAttacking
                    ? 'scale-110 -translate-y-4'
                    : 'animate-pulse'
                }`}
              >
                {selectedEnemyId === 'grave_wolf' ? (
                  <svg viewBox="0 0 240 240" className="w-full h-full filter drop-shadow-[0_0_35px_rgba(220,38,38,0.95)]">
                    <defs>
                      <linearGradient id="grotesqueWolfFur" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2a060d" />
                        <stop offset="40%" stopColor="#150306" />
                        <stop offset="100%" stopColor="#050002" />
                      </linearGradient>
                      <linearGradient id="bloodDripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#450a0a" />
                      </linearGradient>
                      <radialGradient id="demonicEyeGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="40%" stopColor="#f87171" />
                        <stop offset="100%" stopColor="#7f1d1d" />
                      </radialGradient>
                    </defs>

                    {/* Dark Mist / Cursed Shadow Aura */}
                    <path
                      d="M20,160 Q60,110 90,140 T170,110 Q220,150 200,200 Q140,230 100,210 Q40,220 20,160 Z"
                      fill="#450a0a"
                      opacity="0.35"
                      className="animate-pulse"
                    />

                    {/* Jagged Necrotic Spine & Mane Spikes */}
                    <path d="M40,70 L65,40 L75,75 L105,25 L118,65 L155,20 L160,70 L195,45 L180,95 L220,80 L195,120 L230,135 L190,160 L210,195 L170,185 Z" fill="#0c0204" stroke="#991b1b" strokeWidth="2.5" />
                    
                    {/* Grotesque Wolf Skull Base */}
                    <path
                      d="M120,40 C160,40 185,85 180,125 C175,160 145,190 120,205 C95,190 65,160 60,125 C55,85 80,40 120,40 Z"
                      fill="url(#grotesqueWolfFur)"
                      stroke="#b91c1c"
                      strokeWidth="2.5"
                    />

                    {/* Exposed Bone Skull Plates & Sutures */}
                    <path d="M100,60 L120,95 L140,60" stroke="#fecaca" strokeWidth="2" fill="none" opacity="0.8" />
                    <path d="M85,90 L115,110 M155,90 L125,110" stroke="#fecaca" strokeWidth="1.5" fill="none" opacity="0.7" />

                    {/* Terrifying Multi-Eyes (2 Main Burning Eyes + 2 Smaller Demon Eyes) */}
                    {/* Main Left Eye */}
                    <circle cx="85" cy="105" r="9" fill="#7f1d1d" />
                    <circle cx="85" cy="105" r="7" fill="url(#demonicEyeGrad)" className="animate-ping" />
                    <circle cx="85" cy="105" r="4.5" fill="#fef08a" />
                    <circle cx="86" cy="103" r="1.5" fill="#ffffff" />
                    {/* Small Upper Left Eye */}
                    <circle cx="72" cy="85" r="4" fill="#ef4444" className="animate-pulse" />
                    <circle cx="72" cy="85" r="2" fill="#fef08a" />

                    {/* Main Right Eye */}
                    <circle cx="155" cy="105" r="9" fill="#7f1d1d" />
                    <circle cx="155" cy="105" r="7" fill="url(#demonicEyeGrad)" className="animate-ping" />
                    <circle cx="155" cy="105" r="4.5" fill="#fef08a" />
                    <circle cx="154" cy="103" r="1.5" fill="#ffffff" />
                    {/* Small Upper Right Eye */}
                    <circle cx="168" cy="85" r="4" fill="#ef4444" className="animate-pulse" />
                    <circle cx="168" cy="85" r="2" fill="#fef08a" />

                    {/* Gaping Snout & Snarl Jaws */}
                    <path d="M90,135 L120,120 L150,135 L145,190 L120,215 L95,190 Z" fill="#000000" stroke="#7f1d1d" strokeWidth="3" />
                    {/* Black Nostrils */}
                    <ellipse cx="112" cy="142" rx="4" ry="2.5" fill="#450a0a" />
                    <ellipse cx="128" cy="142" rx="4" ry="2.5" fill="#450a0a" />

                    {/* Multiple Long Serrated Razor Fangs */}
                    {/* Upper Fangs */}
                    <path d="M96,145 L102,175 L108,145 M114,145 L120,178 L126,145 M132,145 L138,175 L144,145" fill="#ffffff" stroke="#fecaca" strokeWidth="1.5" />
                    {/* Giant Outer Upper Canines */}
                    <path d="M90,140 L84,185 L98,150" fill="#f8fafc" stroke="#dc2626" strokeWidth="1.5" />
                    <path d="M150,140 L156,185 L142,150" fill="#f8fafc" stroke="#dc2626" strokeWidth="1.5" />
                    {/* Lower Upward Protruding Fangs */}
                    <path d="M100,195 L106,165 L112,195 M128,195 L134,165 L140,195" fill="#ffffff" stroke="#fecaca" strokeWidth="1.5" />

                    {/* Dripping Black & Crimson Viscous Blood Strands */}
                    <path d="M85,185 Q83,210 85,225" stroke="url(#bloodDripGrad)" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M155,185 Q157,210 155,225" stroke="url(#bloodDripGrad)" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M120,180 L120,230" stroke="url(#bloodDripGrad)" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="120" cy="235" r="3.5" fill="#ef4444" className="animate-bounce" />
                    <circle cx="85" cy="228" r="2.5" fill="#991b1b" className="animate-bounce" />
                    <circle cx="155" cy="228" r="2.5" fill="#991b1b" className="animate-bounce" />
                  </svg>
                ) : selectedEnemyId === 'shadow_beast' ? (
                  <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_25px_rgba(225,29,72,0.8)]">
                    <path
                      d="M100,20 C60,40 30,90 35,140 C20,170 30,190 100,195 C170,190 180,170 165,140 C170,90 140,40 100,20 Z"
                      fill="#050103"
                    />
                    <circle cx="75" cy="85" r="7" fill="#e11d48" className="animate-ping" />
                    <circle cx="75" cy="85" r="5" fill="#ffffff" />
                    <circle cx="125" cy="85" r="7" fill="#e11d48" className="animate-ping" />
                    <circle cx="125" cy="85" r="5" fill="#ffffff" />
                    {/* Shadow spikes */}
                    <path d="M40,110 L15,95 L35,130 M160,110 L185,95 L165,130" stroke="#881337" strokeWidth="4" />
                  </svg>
                ) : selectedEnemyId === 'crypt_knight' ? (
                  <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(100,116,139,0.7)]">
                    <path d="M70,40 L130,40 L140,110 L100,130 L60,110 Z" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                    <path d="M75,55 L125,55 L120,75 L80,75 Z" fill="#0f172a" />
                    <circle cx="90" cy="65" r="3" fill="#38bdf8" />
                    <circle cx="110" cy="65" r="3" fill="#38bdf8" />
                    <path d="M50,110 L150,110 L160,180 L40,180 Z" fill="#1e293b" />
                    <path d="M30,70 L45,170 M170,70 L155,170" stroke="#cbd5e1" strokeWidth="6" />
                  </svg>
                ) : selectedEnemyId === 'blood_phantom' ? (
                  <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_25px_rgba(190,18,60,0.9)]">
                    <path d="M100,10 C50,30 40,80 50,140 C30,170 50,195 100,190 C150,195 170,170 150,140 C160,80 150,30 100,10 Z" fill="#4c0519" />
                    <ellipse cx="80" cy="70" rx="6" ry="10" fill="#f43f5e" />
                    <ellipse cx="120" cy="70" rx="6" ry="10" fill="#f43f5e" />
                    <path d="M70,120 Q100,145 130,120" stroke="#ffe4e6" strokeWidth="3" fill="none" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                    <path d="M100,20 L150,80 L130,180 L70,180 L50,80 Z" fill="#1c1917" stroke="#ca8a04" strokeWidth="2" />
                    <circle cx="85" cy="75" r="4" fill="#fef08a" />
                    <circle cx="115" cy="75" r="4" fill="#fef08a" />
                    <path d="M20,110 L180,110" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4,4" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* PLAYER & COMPANION PARTY ZONE */}
          <div className="relative z-10 flex items-end justify-between gap-4 mt-2">
            {/* Player Status Card */}
            <div className="relative flex-1 max-w-sm bg-black/75 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl">
              {/* Floating Combat Text for Player */}
              {floatingTexts
                .filter((f) => f.target === 'player')
                .map((f) => (
                  <div
                    key={f.id}
                    className={`absolute -top-6 left-1/2 -translate-x-1/2 z-30 font-bold font-serif pointer-events-none animate-bounce ${
                      f.type === 'heal'
                        ? 'text-emerald-400 text-lg drop-shadow-[0_0_8px_#10b981]'
                        : f.type === 'sp'
                        ? 'text-cyan-400 text-sm'
                        : 'text-rose-400 text-lg drop-shadow-[0_0_8px_#f43f5e]'
                    }`}
                  >
                    {f.text}
                  </div>
                ))}

              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-bold text-slate-100 text-xs flex items-center space-x-1">
                    <span>🗡️</span>
                    <span>Julian</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-600/50 text-amber-300">
                    Lv.{oldProg.level}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] font-mono">
                  <span className="text-amber-400/90 text-[10px]">{oldProg.expInLevel}/{oldProg.expNeededForNext} EXP</span>
                  <span className="text-emerald-400">{player.hp} / {player.maxHp} HP</span>
                </div>
              </div>

              {/* HP Bar */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 mb-1.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-300 rounded-full"
                  style={{ width: `${playerHpPercent}%` }}
                />
              </div>

              {/* SP Bar */}
              <div className="flex justify-between items-center text-[10px] text-cyan-300 font-mono mb-0.5">
                <span>Ruh Gücü (SP)</span>
                <span>{player.sp} / {player.maxSp}</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700 mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${playerSpPercent}%` }}
                />
              </div>

              {/* Overdrive / Limit Bar */}
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-amber-300 flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Kızıl Ay Gazabı</span>
                </span>
                <span className={player.overdrive >= 100 ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-400'}>
                  {player.overdrive}% {player.overdrive >= 100 ? '🔥 HAZIR!' : ''}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-amber-900/60">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    player.overdrive >= 100
                      ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-yellow-400 animate-pulse'
                      : 'bg-gradient-to-r from-amber-700 to-amber-500'
                  }`}
                  style={{ width: `${player.overdrive}%` }}
                />
              </div>
            </div>

            {/* Companion Showcase & Selector */}
            <div className="relative flex items-center bg-black/75 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl space-x-3">
              {/* Companion Portrait Thumbnail */}
              <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0 flex items-center justify-center">
                {activeCompanion === 'none' ? (
                  <AnimeCharacterSprite character="protagonist" expression="serious" isPortrait={true} />
                ) : (
                  <AnimeCharacterSprite character={activeCompanion} expression="serious" isPortrait={true} />
                )}
              </div>

              {/* Companion Info */}
              <div className="flex flex-col justify-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-slate-100">{companion.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {companion.role}
                  </span>
                </div>
                <p className="text-[11px] text-amber-300/80 font-serif italic mt-0.5 line-clamp-1">{companion.quote}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  <strong className="text-slate-300">{companion.passiveName}:</strong> {companion.passiveDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BATTLE FOOTER: RPG COMMAND MENU & COMBAT LOG */}
        <footer className="flex-shrink-0 h-60 min-h-[240px] max-h-[240px] grid grid-cols-12 bg-slate-950 border-t border-red-950/80 overflow-hidden">
          {/* LEFT: Turn Action Menus (Col 7) */}
          <div className="col-span-7 p-3 flex flex-col h-full min-h-0 overflow-hidden border-r border-slate-800">
            {/* Submenu Navigation Tabs */}
            <div className="flex-shrink-0 flex items-center space-x-1 pb-1.5 border-b border-slate-800 text-xs">
              <button
                onClick={() => setMenuTab('main')}
                className={`px-3 py-1 rounded-t transition-colors ${
                  menuTab === 'main' ? 'bg-red-950 text-red-200 border-b-2 border-red-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚔️ Ana Komutlar
              </button>
              <button
                onClick={() => setMenuTab('skills')}
                className={`px-3 py-1 rounded-t transition-colors ${
                  menuTab === 'skills' ? 'bg-red-950 text-red-200 border-b-2 border-red-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✨ Büyü & Rün ({PLAYER_SKILLS.length})
              </button>
              <button
                onClick={() => setMenuTab('companion')}
                className={`px-3 py-1 rounded-t transition-colors ${
                  menuTab === 'companion' ? 'bg-red-950 text-red-200 border-b-2 border-red-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeCompanion === 'none' ? `🗡️ Julian Becerileri (${companion.skills.length})` : `👑 ${companion.name} (${companion.skills.length})`}
              </button>
              <button
                onClick={() => setMenuTab('items')}
                className={`px-3 py-1 rounded-t transition-colors ${
                  menuTab === 'items' ? 'bg-red-950 text-red-200 border-b-2 border-red-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🧪 Envanter ({player.inventory.holyWater + player.inventory.blackRoseNectar + player.inventory.silverCrucifixDust})
              </button>
            </div>

            {/* TAB CONTENT (Fixed Height, Stable Buttons) */}
            <div className="flex-1 min-h-0 py-2 overflow-y-auto pr-1">
              {menuTab === 'main' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handlePlayerAttack}
                    disabled={phase !== 'player_turn'}
                    className="h-12 min-h-[48px] max-h-[48px] flex items-center justify-center space-x-2 bg-gradient-to-r from-red-950/80 to-slate-900 hover:from-red-900/80 hover:to-slate-800 disabled:opacity-50 text-slate-100 rounded-lg border border-red-900/60 px-3 text-xs font-serif font-bold transition-all shadow hover:shadow-red-900/30"
                  >
                    <span className="text-base">⚔️</span>
                    <span>Gümüş Hançer Saldırısı</span>
                  </button>

                  <button
                    onClick={() => setMenuTab('skills')}
                    disabled={phase !== 'player_turn'}
                    className="h-12 min-h-[48px] max-h-[48px] flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-950/80 to-slate-900 hover:from-blue-900/80 hover:to-slate-800 disabled:opacity-50 text-slate-100 rounded-lg border border-blue-900/60 px-3 text-xs font-serif font-bold transition-all shadow hover:shadow-blue-900/30"
                  >
                    <span className="text-base">✨</span>
                    <span>Büyü & Rünler</span>
                  </button>

                  <button
                    onClick={() => setMenuTab('companion')}
                    disabled={phase !== 'player_turn'}
                    className="h-12 min-h-[48px] max-h-[48px] flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-950/80 to-slate-900 hover:from-amber-900/80 hover:to-slate-800 disabled:opacity-50 text-slate-100 rounded-lg border border-amber-900/60 px-3 text-xs font-serif font-bold transition-all shadow hover:shadow-amber-900/30"
                  >
                    <span className="text-base">👑</span>
                    <span>{companion.name} Hamlesi</span>
                  </button>

                  <button
                    onClick={handleDefend}
                    disabled={phase !== 'player_turn'}
                    className="h-12 min-h-[48px] max-h-[48px] flex items-center justify-center space-x-2 bg-gradient-to-r from-slate-900 to-stone-900 hover:bg-slate-800 disabled:opacity-50 text-slate-100 rounded-lg border border-slate-700 px-3 text-xs font-serif font-bold transition-all"
                  >
                    <span className="text-base">🛡️</span>
                    <span>Savunma (Guard)</span>
                  </button>
                </div>
              )}

              {menuTab === 'skills' && (
                <div className="grid grid-cols-2 gap-2">
                  {PLAYER_SKILLS.map((sk) => (
                    <button
                      key={sk.id}
                      onClick={() => handlePlayerSkill(sk)}
                      disabled={phase !== 'player_turn' || player.sp < sk.spCost}
                      className="h-12 min-h-[48px] max-h-[48px] flex flex-col justify-center items-start bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-left px-2.5 py-1 rounded border border-slate-800 transition-colors overflow-hidden"
                    >
                      <div className="flex justify-between w-full text-xs font-bold text-cyan-300">
                        <span className="truncate pr-1">{sk.name}</span>
                        <span className="text-[10px] text-cyan-400 flex-shrink-0">{sk.spCost > 0 ? `${sk.spCost} SP` : 'Ücretsiz'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">{sk.description}</span>
                    </button>
                  ))}
                </div>
              )}

              {menuTab === 'companion' && (
                <div className="flex flex-col gap-1.5">
                  {companion.skills.map((cSkill, idx) => (
                    <button
                      key={cSkill.id}
                      onClick={() => handleCompanionSkill(idx)}
                      disabled={phase !== 'player_turn' || player.sp < cSkill.spCost}
                      className={`h-11 min-h-[44px] max-h-[44px] flex justify-between items-center px-2.5 py-1 rounded border text-left transition-colors overflow-hidden ${
                        cSkill.type === 'ultimate'
                          ? 'bg-gradient-to-r from-red-950 to-amber-950 border-amber-600/70 hover:border-amber-400'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="text-xs font-bold text-amber-200 flex items-center space-x-1 truncate">
                          <span>{cSkill.type === 'ultimate' ? '💥' : '⭐'}</span>
                          <span className="truncate">{cSkill.name}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">{cSkill.description}</span>
                      </div>
                      <span className="text-xs font-mono text-cyan-300 flex-shrink-0 font-bold">{cSkill.spCost} SP</span>
                    </button>
                  ))}
                </div>
              )}

              {menuTab === 'items' && (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUseItem('holyWater')}
                    disabled={phase !== 'player_turn' || player.inventory.holyWater <= 0}
                    className="h-14 min-h-[56px] max-h-[56px] flex flex-col justify-center items-center bg-slate-900 hover:bg-slate-800 disabled:opacity-40 p-1.5 rounded border border-slate-800 text-center"
                  >
                    <span className="text-lg">🧪</span>
                    <span className="text-[11px] font-bold text-emerald-300">Kutsal Su</span>
                    <span className="text-[9px] text-slate-400">+60 HP ({player.inventory.holyWater}x)</span>
                  </button>

                  <button
                    onClick={() => handleUseItem('blackRoseNectar')}
                    disabled={phase !== 'player_turn' || player.inventory.blackRoseNectar <= 0}
                    className="h-14 min-h-[56px] max-h-[56px] flex flex-col justify-center items-center bg-slate-900 hover:bg-slate-800 disabled:opacity-40 p-1.5 rounded border border-slate-800 text-center"
                  >
                    <span className="text-lg">🌹</span>
                    <span className="text-[11px] font-bold text-cyan-300">Siyah Gül</span>
                    <span className="text-[9px] text-slate-400">+35 SP ({player.inventory.blackRoseNectar}x)</span>
                  </button>

                  <button
                    onClick={() => handleUseItem('silverCrucifixDust')}
                    disabled={phase !== 'player_turn' || player.inventory.silverCrucifixDust <= 0}
                    className="h-14 min-h-[56px] max-h-[56px] flex flex-col justify-center items-center bg-slate-900 hover:bg-slate-800 disabled:opacity-40 p-1.5 rounded border border-slate-800 text-center"
                  >
                    <span className="text-lg">✝️</span>
                    <span className="text-[11px] font-bold text-amber-300">Gümüş Haç</span>
                    <span className="text-[9px] text-slate-400">Sersemlet ({player.inventory.silverCrucifixDust}x)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Overdrive Quick Trigger Button */}
            {player.overdrive >= 100 && (
              <button
                onClick={handleOverdrive}
                disabled={phase !== 'player_turn'}
                className="flex-shrink-0 w-full mt-1 py-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:brightness-125 text-white font-serif font-black text-xs uppercase tracking-widest rounded shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"
              >
                🔥 KIZIL AYIN NİHAİ GAZABINI BAŞLAT (%100 OVERDRIVE)
              </button>
            )}
          </div>

          {/* RIGHT: Combat Narrative Log (Col 5) */}
          <div className="col-span-5 p-3 flex flex-col h-full min-h-0 overflow-hidden bg-black/40">
            <div className="flex-shrink-0 flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-xs font-serif text-slate-400">
              <span>📜 Savaş Günlüğü</span>
              <span className="text-[10px] text-slate-500">{turnCount}. Tur</span>
            </div>

            <div ref={logContainerRef} className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 font-sans text-xs scrollbar-thin scrollbar-thumb-stone-800">
              {battleLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-1.5 rounded text-[11px] leading-relaxed ${
                    log.type === 'critical'
                      ? 'bg-amber-950/50 text-amber-200 border-l-2 border-amber-500'
                      : log.type === 'player'
                      ? 'bg-slate-900/60 text-slate-200 border-l-2 border-cyan-500'
                      : log.type === 'companion'
                      ? 'bg-purple-950/40 text-purple-200 border-l-2 border-purple-500'
                      : log.type === 'enemy'
                      ? 'bg-red-950/50 text-red-200 border-l-2 border-red-600'
                      : log.type === 'victory'
                      ? 'bg-emerald-950/60 text-emerald-200 border-l-2 border-emerald-500 font-bold'
                      : log.type === 'defeat'
                      ? 'bg-rose-950/60 text-rose-200 border-l-2 border-rose-500 font-bold'
                      : 'text-slate-400 italic'
                  }`}
                >
                  {log.text}
                </div>
              ))}
            </div>

            {/* Victory / Defeat Overlay Button */}
            {phase === 'victory' && (
              <div className="flex-shrink-0 mt-1.5 pt-1.5 border-t border-emerald-900 flex justify-between items-center">
                <span className="text-xs text-emerald-400 font-bold">🏆 Savaş Kazanıldı!</span>
                <button
                  onClick={onClose}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-bold shadow"
                >
                  Ödülleri Al & Hikayeye Dön
                </button>
              </div>
            )}

            {phase === 'defeat' && (
              <div className="flex-shrink-0 mt-1.5 pt-1.5 border-t border-rose-900 flex justify-between items-center">
                <span className="text-xs text-rose-400 font-bold">💀 Yenildin!</span>
                <button
                  onClick={() => {
                    const preset = ENEMY_PRESETS[selectedEnemyId];
                    setEnemy({ ...preset, hp: preset.maxHp });
                    setPlayer((p) => ({ ...p, hp: p.maxHp, sp: p.maxSp }));
                    setPhase('player_turn');
                  }}
                  className="px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded text-xs font-bold shadow"
                >
                  Yeniden Dene
                </button>
              </div>
            )}
          </div>
        </footer>

        {/* ========================================== */}
        {/* FULL VICTORY SPOILS & LEVEL UP MODAL POPUP */}
        {/* ========================================== */}
        {phase === 'victory' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-lg bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-amber-500/70 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.35)] text-center overflow-hidden">
              {/* Decorative top flare */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-20 bg-amber-500/20 blur-2xl pointer-events-none rounded-full" />
              
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] mb-3 animate-bounce">
                <span className="text-2xl">🏆</span>
              </div>

              <h3 className="font-cinzel font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-wider mb-1">
                SAVAŞ ZAFERİ!
              </h3>
              <p className="text-xs text-stone-400 font-serif mb-4">
                <span className="text-rose-400 font-bold">{enemy.name}</span> mağlup edildi; şatonun karanlığı geri çekildi.
              </p>

              {/* Level Up Banner if applicable */}
              {didLevelUp && (
                <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-950/90 via-yellow-950/90 to-amber-950/90 border border-yellow-500/60 shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-yellow-300 font-cinzel font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>TEBRİKLER! SEVİYE ATLADIN!</span>
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="text-xs text-amber-200 font-mono mt-1">
                    Seviye {oldProg.level} ➔ <span className="font-bold text-white text-sm">Seviye {newProg.level}</span> ({newProg.title})
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                    +15 Max HP, +4 Saldırı Gücü, +10 SP Kapasitesi!
                  </div>
                </div>
              )}

              {/* Spoils & Rewards Grid */}
              <div className="space-y-2.5 mb-5 text-left">
                {/* EXP Card */}
                <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-600/50 flex items-center justify-center text-amber-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-amber-200">Tecrübe Puanı</div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        Seviye {newProg.level}: {newProg.expInLevel} / {newProg.expNeededForNext} EXP
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-yellow-400">+{expGained} EXP</span>
                  </div>
                </div>

                {/* EXP Bar */}
                <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-amber-900/60">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                    style={{ width: `${newProg.progressPercent}%` }}
                  />
                </div>

                {/* Item / Relic Drop Card */}
                {rewardedItemDef && (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-950/70 to-stone-900/90 border border-rose-800/60 flex items-center justify-between shadow-[0_0_10px_rgba(225,29,72,0.15)]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-900/60 border border-rose-500/50 flex items-center justify-center text-rose-200 text-lg">
                        {rewardedItemDef.emoji}
                      </div>
                      <div>
                        <div className="text-xs font-serif font-bold text-rose-200 flex items-center gap-1.5">
                          <span>{rewardedItemDef.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                            {rewardedItemDef.category === 'relic' ? 'Yadigâr' : 'Eşya'}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-400 line-clamp-1">
                          {rewardedItemDef.shortDescription}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center text-xs font-mono font-bold text-emerald-400">
                      <span>+1 Eklendi</span>
                    </div>
                  </div>
                )}

                {/* Sanity / Willpower bonus */}
                <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-900/40 flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>İrade (Akıl Sağlığı) Arınması</span>
                  </span>
                  <span className="text-cyan-400 font-bold">+15 İrade</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:brightness-125 text-stone-950 font-serif font-black text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                🏆 Ganimetleri Al & Hikayeye Devam Et
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
