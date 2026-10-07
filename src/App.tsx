/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { STORY_NODES, CG_GALLERY } from './data/storyData';
import { StoryNode, ChoiceOption, GameStats, SaveSlot, CgGalleryItem, CharacterId } from './types/novel';
import { soundManager } from './utils/audioSynthesizer';
import { TitleScreen } from './components/TitleScreen';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { AnimeCharacterSprite } from './components/AnimeCharacterSprite';
import { DialogueBox } from './components/DialogueBox';
import { StatusBar } from './components/StatusBar';
import { BacklogModal, BacklogEntry } from './components/BacklogModal';
import { SaveLoadModal } from './components/SaveLoadModal';
import { GalleryModal } from './components/GalleryModal';
import { CharacterCodexModal } from './components/CharacterCodexModal';
import { ScenarioEditorModal } from './components/ScenarioEditorModal';
import { SettingsModal } from './components/SettingsModal';
import { RpgBattleModal } from './components/RpgBattleModal';
import { ChapterSelectModal, ChapterCheckpoint } from './components/ChapterSelectModal';
import { InventoryModal } from './components/InventoryModal';
import { ITEMS_DATABASE, DEFAULT_STARTING_INVENTORY } from './data/inventoryData';
import { InventoryItemDef } from './types/inventory';
import { EnemyId } from './types/battle';
import { ENEMY_PRESETS } from './data/battleData';
import { calculateLevelProgress } from './utils/progression';

export default function App() {
  const [inGame, setInGame] = useState<boolean>(false);
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [customNode, setCustomNode] = useState<StoryNode | null>(null);

  // History stack for Test Mode (Go back to previous scene/choice)
  const [historyStack, setHistoryStack] = useState<Array<{
    nodeId: string;
    stats: GameStats;
    customNode: StoryNode | null;
  }>>([]);

  // RPG Battle System State
  const [battleOpen, setBattleOpen] = useState<boolean>(false);
  const [battleEnemyId, setBattleEnemyId] = useState<EnemyId>('grave_wolf');
  const [battleCompanion, setBattleCompanion] = useState<'none' | 'vivienne' | 'evangeline' | 'valeria' | 'beatrice' | 'morrigan' | 'lenore'>('none');
  const [pendingNextNodeAfterBattle, setPendingNextNodeAfterBattle] = useState<string | null>(null);

  // Player & Story Stats
  const [stats, setStats] = useState<GameStats>({
    hp: 100,
    maxHp: 100,
    exp: 0,
    level: 1,
    sanity: 100,
    willpower: 50,
    mystery: 10,
    focus: 0,
    vivienneAffection: 20,
    evangelineAffection: 15,
    valeriaAffection: 15,
    beatriceAffection: 15,
    morriganAffection: 15,
    lenoreAffection: 15,
    dreadLevel: 25,
    metCharacters: {},
    inventory: { ...DEFAULT_STARTING_INVENTORY },
    claimedRewards: {},
  });

  // Item pickup notification banner
  const [itemNotification, setItemNotification] = useState<string | null>(null);

  // Backlog and CGs
  const [backlog, setBacklog] = useState<BacklogEntry[]>([]);
  const [galleryItems, setGalleryItems] = useState<CgGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kizil_ay_gallery_v2');
      return saved ? JSON.parse(saved) : CG_GALLERY;
    } catch {
      return CG_GALLERY;
    }
  });

  // UI & Playback Settings
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [isSkipMode, setIsSkipMode] = useState<boolean>(false);
  const [isUiHidden, setIsUiHidden] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [textSpeed, setTextSpeed] = useState<number>(25);
  const [autoPlayDelay, setAutoPlayDelay] = useState<number>(3200);
  const [masterVolume, setMasterVolume] = useState<number>(0.8);
  const [bgmVolume, setBgmVolume] = useState<number>(0.6);
  const [sfxVolume, setSfxVolume] = useState<number>(0.7);

  // Modal States
  const [backlogOpen, setBacklogOpen] = useState<boolean>(false);
  const [saveLoadModal, setSaveLoadModal] = useState<{ isOpen: boolean; mode: 'save' | 'load' }>({
    isOpen: false,
    mode: 'save',
  });
  const [codexOpen, setCodexOpen] = useState<boolean>(false);
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
  const [inventoryOpen, setInventoryOpen] = useState<boolean>(false);
  const [scenarioEditorOpen, setScenarioEditorOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [chapterSelectOpen, setChapterSelectOpen] = useState<boolean>(false);

  // Jump directly to chapter/checkpoint for easy testing and navigation
  const handleSelectChapter = (nodeId: string, checkpoint?: Partial<ChapterCheckpoint>) => {
    setCustomNode(null);
    setCurrentNodeId(nodeId);
    setInGame(true);
    setHistoryStack([]);
    if (checkpoint?.sanityPreset !== undefined) {
      setStats((prev) => ({
        ...prev,
        sanity: checkpoint.sanityPreset!,
        dreadLevel: 100 - checkpoint.sanityPreset!,
        vivienneAffection: checkpoint.defaultAffection?.vivienne ?? prev.vivienneAffection,
        evangelineAffection: checkpoint.defaultAffection?.evangeline ?? prev.evangelineAffection,
        valeriaAffection: checkpoint.defaultAffection?.valeria ?? prev.valeriaAffection,
        lenoreAffection: checkpoint.defaultAffection?.lenore ?? prev.lenoreAffection,
      }));
    }
    const targetNode = STORY_NODES[nodeId];
    if (targetNode) {
      setBacklog([
        {
          speaker: targetNode.speakerDisplayName,
          text: targetNode.text,
          chapter: targetNode.chapterTitle,
        },
      ]);
    }
  };

  // Helper to push snapshot before any node/stat transition
  const pushHistorySnapshot = useCallback(() => {
    setHistoryStack((prev) => {
      const next = [
        ...prev,
        {
          nodeId: currentNodeId,
          stats: {
            ...stats,
            inventory: stats.inventory ? { ...stats.inventory } : { ...DEFAULT_STARTING_INVENTORY },
            metCharacters: stats.metCharacters ? { ...stats.metCharacters } : {},
            claimedRewards: stats.claimedRewards ? { ...stats.claimedRewards } : {},
          },
          customNode,
        },
      ];
      return next.slice(-60); // keep up to 60 previous steps
    });
  }, [currentNodeId, stats, customNode]);

  // Grant Item Helper
  const grantItem = useCallback((itemId: string, count: number = 1) => {
    const itemDef = ITEMS_DATABASE[itemId];
    setStats((prev) => {
      const currentInv = { ...(prev.inventory || DEFAULT_STARTING_INVENTORY) };
      currentInv[itemId] = (currentInv[itemId] || 0) + count;
      return {
        ...prev,
        inventory: currentInv,
      };
    });
    if (itemDef) {
      soundManager.playSfx('sensual_chime');
      setItemNotification(`🎒 Envantere Eklendi: ${itemDef.name}`);
      setTimeout(() => setItemNotification(null), 3500);
    }
  }, []);

  // Grant Experience Points (EXP) & Level Up Helper
  const grantExp = useCallback((amount: number) => {
    if (amount <= 0) return;
    setStats((prev) => {
      const currentExp = prev.exp || 0;
      const oldProg = calculateLevelProgress(currentExp);
      const newExp = currentExp + amount;
      const newProg = calculateLevelProgress(newExp);

      if (newProg.level > oldProg.level) {
        soundManager.playVictory();
        setItemNotification(`🎉 SEVİYE ATLADIN! Seviye ${newProg.level} (${newProg.title}) — Maksimum Can ve Güç Arttı!`);
        return {
          ...prev,
          exp: newExp,
          level: newProg.level,
          maxHp: (prev.maxHp || 100) + 15,
          hp: Math.min((prev.maxHp || 100) + 15, (prev.hp || 100) + 30),
        };
      } else {
        setItemNotification(`✨ +${amount} EXP Kazanıldı! (${newProg.expInLevel}/${newProg.expNeededForNext} EXP)`);
        return {
          ...prev,
          exp: newExp,
          level: newProg.level,
        };
      }
    });
  }, []);

  // Use Consumable Item Helper
  const handleUseInventoryItem = useCallback((itemId: string, itemDef: InventoryItemDef) => {
    setStats((prev) => {
      const currentInv = { ...(prev.inventory || {}) };
      if (!currentInv[itemId] || currentInv[itemId] <= 0) return prev;
      currentInv[itemId] -= 1;
      if (currentInv[itemId] <= 0) {
        delete currentInv[itemId];
      }
      const fx = itemDef.consumableEffect || {};
      return {
        ...prev,
        inventory: currentInv,
        hp: Math.min(prev.maxHp ?? 100, (prev.hp ?? 100) + (fx.hp || 0)),
        sanity: Math.min(100, (prev.sanity ?? 100) + (fx.sanity || 0)),
        willpower: Math.min(100, (prev.willpower ?? 50) + (fx.willpower || 0)),
        focus: Math.min(100, (prev.focus ?? 0) + (fx.focus || 0)),
        mystery: Math.min(100, (prev.mystery ?? 0) + (fx.mystery || 0)),
      };
    });
  }, []);

  // Handle Step Back / Previous Scene (Test Mode)
  const handleStepPrevious = useCallback(() => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setCurrentNodeId(previous.nodeId);
    setStats(previous.stats);
    setCustomNode(previous.customNode);
    setBacklog((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    soundManager.playSfx('page_flip');
  }, [historyStack]);

  // Current active story node
  const currentNode: StoryNode = customNode || STORY_NODES[currentNodeId] || STORY_NODES['start'];

  // Update BGM & SFX when story node changes
  useEffect(() => {
    if (!inGame) {
      soundManager.playMood('mystery');
      return;
    }

    if (currentNode.audioMood) {
      soundManager.playMood(currentNode.audioMood);
    }
    if (currentNode.sfx) {
      soundManager.playSfx(currentNode.sfx);
    }

    // Unlock CG if present in node
    if (currentNode.unlockedCgId) {
      setGalleryItems((prev) => {
        const updated = prev.map((item) =>
          item.id === currentNode.unlockedCgId ? { ...item, unlocked: true } : item
        );
        try {
          localStorage.setItem('kizil_ay_gallery_v2', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }

    // Process Node-level Item Reward & EXP Reward & Stat Changes atomically
    if (currentNode.itemReward || currentNode.expReward || currentNode.mysteryChange || currentNode.willpowerChange || currentNode.focusChange || currentNode.sanityChange) {
      const rewardKey = `node_${currentNode.id}`;
      let shouldNotifyItem: string | null = null;
      let shouldNotifyExp: number | null = null;

      setStats((prev) => {
        const alreadyClaimed = prev.claimedRewards?.[rewardKey];
        const currentInv = { ...(prev.inventory || DEFAULT_STARTING_INVENTORY) };

        if (currentNode.itemReward && !alreadyClaimed) {
          const items = Array.isArray(currentNode.itemReward)
            ? currentNode.itemReward
            : [currentNode.itemReward];
          items.forEach((id) => {
            currentInv[id] = (currentInv[id] || 0) + 1;
            if (!shouldNotifyItem) shouldNotifyItem = id;
          });
        }

        let newExp = prev.exp || 0;
        let newLevel = prev.level || 1;
        let newMaxHp = prev.maxHp || 100;
        let calculatedHp = prev.hp || 100;
        if (currentNode.expReward && currentNode.expReward > 0 && !alreadyClaimed) {
          const oldProg = calculateLevelProgress(newExp);
          newExp += currentNode.expReward;
          const newProg = calculateLevelProgress(newExp);
          newLevel = newProg.level;
          shouldNotifyExp = currentNode.expReward;
          if (newProg.level > oldProg.level) {
            newMaxHp += 15;
            calculatedHp = Math.min(newMaxHp, calculatedHp + 30);
          }
        }

        const newClaimed = { ...(prev.claimedRewards || {}), [rewardKey]: true };

        return {
          ...prev,
          hp: calculatedHp,
          maxHp: newMaxHp,
          exp: newExp,
          level: newLevel,
          inventory: currentInv,
          claimedRewards: newClaimed,
          mystery: Math.max(0, Math.min(100, (prev.mystery ?? 0) + (currentNode.mysteryChange || 0))),
          willpower: Math.max(0, Math.min(100, (prev.willpower ?? 50) + (currentNode.willpowerChange || 0))),
          focus: Math.max(0, Math.min(100, (prev.focus ?? 0) + (currentNode.focusChange || 0))),
          sanity: Math.max(0, Math.min(100, (prev.sanity ?? 100) + (currentNode.sanityChange || 0))),
        };
      });

      if (shouldNotifyItem) {
        const itemDef = ITEMS_DATABASE[shouldNotifyItem];
        if (itemDef) {
          soundManager.playSfx('sensual_chime');
          setItemNotification(`🎒 Envantere Eklendi: ${itemDef.name}`);
          setTimeout(() => setItemNotification(null), 3500);
        }
      } else if (shouldNotifyExp) {
        setItemNotification(`✨ +${shouldNotifyExp} EXP Kazanıldı!`);
        setTimeout(() => setItemNotification(null), 3500);
      }
    }

    // Unlock met ladies if present in node
    const activeChars = [
      currentNode.speaker,
      currentNode.characterSprite?.character,
      currentNode.secondarySprite?.character,
    ].filter(Boolean) as string[];

    const ladies = ['vivienne', 'evangeline', 'valeria', 'beatrice', 'morrigan', 'lenore'];
    const newlyMet = ladies.filter((lady) => activeChars.includes(lady));

    if (newlyMet.length > 0) {
      setStats((prev) => {
        const currentMet = prev.metCharacters || {};
        const needsUpdate = newlyMet.some((lady) => !currentMet[lady]);
        if (!needsUpdate) return prev;
        const updatedMet = { ...currentMet };
        for (const lady of newlyMet) {
          updatedMet[lady] = true;
        }
        return { ...prev, metCharacters: updatedMet };
      });
    }

    // Append to backlog
    setBacklog((prev) => [
      ...prev,
      {
        speaker: currentNode.speakerDisplayName,
        text: currentNode.text,
        chapter: currentNode.chapterTitle,
      },
    ]);
  }, [currentNodeId, customNode, inGame, currentNode]);

  // Handle Advance dialogue
  const handleAdvance = useCallback(() => {
    if (currentNode.choices && currentNode.choices.length > 0) {
      return; // Must select choice
    }

    // Direct node battle trigger
    if (currentNode.battleTrigger) {
      pushHistorySnapshot();
      setBattleCompanion(currentNode.battleTrigger.companion || 'none');
      setBattleEnemyId(currentNode.battleTrigger.enemyId || 'grave_wolf');
      setPendingNextNodeAfterBattle(currentNode.battleTrigger.victoryNodeId || currentNode.nextNodeId || 'start');
      setBattleOpen(true);
      return;
    }

    if (currentNode.nextNodeId && STORY_NODES[currentNode.nextNodeId]) {
      pushHistorySnapshot();
      setCurrentNodeId(currentNode.nextNodeId);
      setCustomNode(null);
    } else if (customNode) {
      // Return to main story after custom scene
      pushHistorySnapshot();
      setCustomNode(null);
      setCurrentNodeId('start');
    }
  }, [currentNode, customNode, pushHistorySnapshot]);

  // Handle Choice Selection
  const handleSelectChoice = useCallback((choice: ChoiceOption) => {
    // Record current state to history stack before applying choice changes
    pushHistorySnapshot();

    // Apply Stat Changes, Items & EXP atomically
    setStats((prev) => {
      const newSanity = Math.max(0, Math.min(100, prev.sanity + (choice.sanityChange || 0)));
      const newVivienne = Math.max(
        0,
        Math.min(
          100,
          prev.vivienneAffection +
            (choice.affectionChange?.vivienne ?? (choice.affectionChange as any)?.shiori ?? 0)
        )
      );
      const newEvangeline = Math.max(
        0,
        Math.min(
          100,
          prev.evangelineAffection +
            (choice.affectionChange?.evangeline ?? (choice.affectionChange as any)?.aria ?? 0)
        )
      );
      const newValeria = Math.max(
        0,
        Math.min(
          100,
          prev.valeriaAffection +
            (choice.affectionChange?.valeria ?? (choice.affectionChange as any)?.karin ?? 0)
        )
      );
      const newBeatrice = Math.max(
        0,
        Math.min(100, prev.beatriceAffection + (choice.affectionChange?.beatrice ?? 0))
      );
      const newMorrigan = Math.max(
        0,
        Math.min(100, prev.morriganAffection + (choice.affectionChange?.morrigan ?? 0))
      );
      const newLenore = Math.max(
        0,
        Math.min(100, prev.lenoreAffection + (choice.affectionChange?.lenore ?? 0))
      );
      const newDread =
        choice.sanityChange && choice.sanityChange < 0
          ? Math.min(100, prev.dreadLevel + 15)
          : prev.dreadLevel;
      const newWillpower = Math.max(0, Math.min(100, (prev.willpower ?? prev.sanity) + (choice.willpowerChange ?? choice.sanityChange ?? 0)));
      const newMystery = Math.max(0, Math.min(100, (prev.mystery ?? 10) + (choice.mysteryChange ?? 0)));
      const newFocus = Math.max(0, Math.min(100, (prev.focus ?? 0) + (choice.focusChange ?? 0)));
      const newHp = Math.max(0, Math.min(100, (prev.hp ?? 100) + (choice.hpChange ?? 0)));

      // Handle items in choice
      const currentInv = { ...(prev.inventory || DEFAULT_STARTING_INVENTORY) };
      const choiceRewardKey = `choice_${choice.id}`;
      const alreadyClaimed = prev.claimedRewards?.[choiceRewardKey];

      if (choice.itemReward && !alreadyClaimed) {
        const items = Array.isArray(choice.itemReward) ? choice.itemReward : [choice.itemReward];
        items.forEach((id) => {
          currentInv[id] = (currentInv[id] || 0) + 1;
        });
      }
      if (choice.itemRemove) {
        const itemsToRemove = Array.isArray(choice.itemRemove) ? choice.itemRemove : [choice.itemRemove];
        itemsToRemove.forEach((id) => {
          if (currentInv[id]) {
            currentInv[id] -= 1;
            if (currentInv[id] <= 0) delete currentInv[id];
          }
        });
      }

      // Handle EXP in choice
      let newExp = prev.exp || 0;
      let newLevel = prev.level || 1;
      let newMaxHp = prev.maxHp || 100;
      let calculatedHp = newHp;
      if (choice.expReward && choice.expReward > 0 && !alreadyClaimed) {
        const oldProg = calculateLevelProgress(newExp);
        newExp += choice.expReward;
        const newProg = calculateLevelProgress(newExp);
        newLevel = newProg.level;
        if (newProg.level > oldProg.level) {
          newMaxHp += 15;
          calculatedHp = Math.min(newMaxHp, calculatedHp + 30);
        }
      }

      const newClaimed = { ...(prev.claimedRewards || {}), [choiceRewardKey]: true };

      return {
        ...prev,
        hp: calculatedHp,
        maxHp: newMaxHp,
        exp: newExp,
        level: newLevel,
        inventory: currentInv,
        claimedRewards: newClaimed,
        sanity: newSanity,
        willpower: newWillpower,
        mystery: newMystery,
        focus: newFocus,
        vivienneAffection: newVivienne,
        evangelineAffection: newEvangeline,
        valeriaAffection: newValeria,
        beatriceAffection: newBeatrice,
        morriganAffection: newMorrigan,
        lenoreAffection: newLenore,
        dreadLevel: newDread,
      };
    });

    if (choice.itemReward) {
      const itemKey = Array.isArray(choice.itemReward) ? choice.itemReward[0] : choice.itemReward;
      const itemDef = ITEMS_DATABASE[itemKey];
      if (itemDef) {
        soundManager.playSfx('sensual_chime');
        setItemNotification(`🎒 Envantere Eklendi: ${itemDef.name}`);
        setTimeout(() => setItemNotification(null), 3500);
      }
    }

    if (choice.expReward && choice.expReward > 0) {
      setItemNotification(`✨ +${choice.expReward} EXP Kazanıldı!`);
      setTimeout(() => setItemNotification(null), 3500);
    }

    // Check if choice triggers an RPG Battle
    if (choice.battleTrigger) {
      setBattleCompanion(choice.battleTrigger.companion || 'none');
      setBattleEnemyId(choice.battleTrigger.enemyId || 'grave_wolf');
      setPendingNextNodeAfterBattle(choice.battleTrigger.victoryNodeId || choice.nextNodeId);
      setBattleOpen(true);
      return;
    }

    if (choice.id.startsWith('c_battle_')) {
      const comp = choice.id.includes('vivienne')
        ? 'vivienne'
        : choice.id.includes('evangeline')
        ? 'evangeline'
        : choice.id.includes('beatrice')
        ? 'beatrice'
        : choice.id.includes('morrigan')
        ? 'morrigan'
        : choice.id.includes('lenore')
        ? 'lenore'
        : 'valeria';
      setBattleCompanion(comp);
      setBattleEnemyId('shadow_beast');
      setPendingNextNodeAfterBattle(choice.nextNodeId);
      setBattleOpen(true);
      return;
    }

    if (choice.nextNodeId && STORY_NODES[choice.nextNodeId]) {
      setCurrentNodeId(choice.nextNodeId);
      setCustomNode(null);
    }
  }, [pushHistorySnapshot]);

  // Handle Battle Trigger & Victory
  const handleOpenBattle = useCallback((enemyId: EnemyId = 'shadow_beast', companion: 'vivienne' | 'evangeline' | 'valeria' | 'beatrice' | 'morrigan' | 'lenore' = 'valeria') => {
    setBattleEnemyId(enemyId);
    setBattleCompanion(companion);
    setBattleOpen(true);
  }, []);

  const handleBattleVictory = useCallback((rewards: {
    expGained?: number;
    itemReward?: string;
    sanityBonus: number;
    affectionBonus: { character: CharacterId; amount: number };
  }) => {
    const isEarlyBattle = pendingNextNodeAfterBattle === 'prologue_wolf_victory' || 
                          pendingNextNodeAfterBattle === 'prologue_scene03_beatrice' || 
                          pendingNextNodeAfterBattle === 'act1_scene03_battle_win' || 
                          battleEnemyId === 'grave_wolf' || 
                          battleEnemyId === 'crypt_knight' || 
                          currentNodeId.includes('act1') ||
                          currentNodeId.includes('prologue');
    const expToGrant = rewards.expGained ?? (isEarlyBattle ? 25 : (ENEMY_PRESETS[battleEnemyId]?.expReward || 35));
    const itemToGrant = isEarlyBattle 
      ? 'ravenscroft_crest_seal' 
      : (rewards.itemReward || (battleEnemyId === 'shadow_beast' ? 'silver_guard_badge' : (battleEnemyId === 'blood_phantom' ? 'black_rose_nectar' : 'inquisition_blade_shard')));

    // Grant EXP and Item immediately in one single atomic state update
    setStats((prev) => {
      const currentExp = prev.exp || 0;
      const oldProg = calculateLevelProgress(currentExp);
      const newExp = currentExp + expToGrant;
      const newProg = calculateLevelProgress(newExp);

      const currentInv = { ...(prev.inventory || DEFAULT_STARTING_INVENTORY) };
      if (itemToGrant) {
        currentInv[itemToGrant] = (currentInv[itemToGrant] || 0) + 1;
      }

      const leveledUp = newProg.level > oldProg.level;

      return {
        ...prev,
        exp: newExp,
        level: newProg.level,
        maxHp: leveledUp ? (prev.maxHp || 100) + 15 : (prev.maxHp || 100),
        hp: leveledUp ? Math.min((prev.maxHp || 100) + 15, (prev.hp || 100) + 30) : prev.hp,
        inventory: currentInv,
        sanity: Math.min(100, prev.sanity + rewards.sanityBonus),
        vivienneAffection: rewards.affectionBonus.character === 'vivienne' ? Math.min(100, prev.vivienneAffection + rewards.affectionBonus.amount) : prev.vivienneAffection,
        evangelineAffection: rewards.affectionBonus.character === 'evangeline' ? Math.min(100, prev.evangelineAffection + rewards.affectionBonus.amount) : prev.evangelineAffection,
        valeriaAffection: rewards.affectionBonus.character === 'valeria' ? Math.min(100, prev.valeriaAffection + rewards.affectionBonus.amount) : prev.valeriaAffection,
        beatriceAffection: rewards.affectionBonus.character === 'beatrice' ? Math.min(100, prev.beatriceAffection + rewards.affectionBonus.amount) : prev.beatriceAffection,
        morriganAffection: rewards.affectionBonus.character === 'morrigan' ? Math.min(100, prev.morriganAffection + rewards.affectionBonus.amount) : prev.morriganAffection,
        lenoreAffection: rewards.affectionBonus.character === 'lenore' ? Math.min(100, prev.lenoreAffection + rewards.affectionBonus.amount) : prev.lenoreAffection,
        dreadLevel: Math.max(0, prev.dreadLevel - 15),
      };
    });

    const itemDef = ITEMS_DATABASE[itemToGrant];
    if (itemDef) {
      setItemNotification(`🏆 Zafer Ganimeti: +${expToGrant} EXP & "${itemDef.name}" Kazanıldı!`);
      setTimeout(() => setItemNotification(null), 4000);
    }

    if (pendingNextNodeAfterBattle && STORY_NODES[pendingNextNodeAfterBattle]) {
      setCurrentNodeId(pendingNextNodeAfterBattle);
      setPendingNextNodeAfterBattle(null);
    }
  }, [battleEnemyId, currentNodeId, pendingNextNodeAfterBattle]);

  // Return to Title Screen handler
  const handleReturnToTitle = useCallback(() => {
    setIsAutoPlay(false);
    setIsSkipMode(false);
    setInGame(false);
    setCustomNode(null);
    soundManager.playMood('mystery');
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!inGame || !isAutoPlay) return;
    if (currentNode.choices && currentNode.choices.length > 0) return;

    const timer = setTimeout(() => {
      handleAdvance();
    }, autoPlayDelay);

    return () => clearTimeout(timer);
  }, [inGame, isAutoPlay, currentNode, autoPlayDelay, handleAdvance]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when inside modal or inputs
      if (
        backlogOpen ||
        saveLoadModal.isOpen ||
        codexOpen ||
        galleryOpen ||
        inventoryOpen ||
        scenarioEditorOpen ||
        settingsOpen ||
        chapterSelectOpen ||
        battleOpen
      ) {
        if (e.key === 'Escape') {
          if (battleOpen) {
            // Battle cannot be cancelled by ESC
            return;
          }
          setBacklogOpen(false);
          setSaveLoadModal({ isOpen: false, mode: 'save' });
          setCodexOpen(false);
          setGalleryOpen(false);
          setInventoryOpen(false);
          setScenarioEditorOpen(false);
          setSettingsOpen(false);
          setChapterSelectOpen(false);
        }
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleAdvance();
      } else if (e.key === 'Backspace' || e.key === 'z' || e.key === 'Z' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        handleStepPrevious();
      } else if (e.key === 'i' || e.key === 'I' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setInventoryOpen((prev) => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        setIsUiHidden((prev) => !prev);
      } else if (e.key === 'a' || e.key === 'A') {
        setIsAutoPlay((prev) => !prev);
      } else if (e.key === 'l' || e.key === 'L') {
        setBacklogOpen(true);
      } else if (e.key === 'm' || e.key === 'M') {
        handleReturnToTitle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleAdvance,
    handleStepPrevious,
    handleReturnToTitle,
    backlogOpen,
    saveLoadModal,
    codexOpen,
    galleryOpen,
    inventoryOpen,
    scenarioEditorOpen,
    settingsOpen,
    chapterSelectOpen,
    battleOpen,
  ]);

  // Start new game
  const handleStartGame = () => {
    setInGame(true);
    setCurrentNodeId('start');
    setCustomNode(null);
    setHistoryStack([]);
    setStats({
      hp: 100,
      maxHp: 100,
      exp: 0,
      level: 1,
      sanity: 100,
      willpower: 50,
      mystery: 10,
      focus: 0,
      vivienneAffection: 20,
      evangelineAffection: 15,
      valeriaAffection: 15,
      beatriceAffection: 15,
      morriganAffection: 15,
      lenoreAffection: 15,
      dreadLevel: 25,
      metCharacters: {},
      inventory: { ...DEFAULT_STARTING_INVENTORY },
    });
    setBacklog([]);
  };

  // Load save slot
  const handleLoadSlot = (slot: SaveSlot) => {
    setInGame(true);
    setCurrentNodeId(slot.nodeId);
    setCustomNode(null);
    setHistoryStack([]);
    setStats({
      hp: slot.stats.hp ?? 100,
      maxHp: slot.stats.maxHp ?? 100,
      exp: slot.stats.exp ?? 0,
      level: slot.stats.level ?? 1,
      sanity: slot.stats.sanity ?? 100,
      willpower: slot.stats.willpower ?? slot.stats.sanity ?? 50,
      mystery: slot.stats.mystery ?? 10,
      focus: slot.stats.focus ?? 0,
      vivienneAffection: slot.stats.vivienneAffection ?? (slot.stats as any).shioriAffection ?? 20,
      evangelineAffection: slot.stats.evangelineAffection ?? (slot.stats as any).ariaAffection ?? 15,
      valeriaAffection: slot.stats.valeriaAffection ?? (slot.stats as any).karinAffection ?? 15,
      beatriceAffection: slot.stats.beatriceAffection ?? 15,
      morriganAffection: slot.stats.morriganAffection ?? 15,
      lenoreAffection: slot.stats.lenoreAffection ?? 15,
      dreadLevel: 100 - (slot.stats.sanity ?? 100),
      metCharacters: slot.stats.metCharacters ?? {},
      inventory: slot.stats.inventory || { ...DEFAULT_STARTING_INVENTORY },
    });
  };

  // Volume Changes
  const handleVolumeChange = (m: number, b: number, s: number) => {
    setMasterVolume(m);
    setBgmVolume(b);
    setSfxVolume(s);
    soundManager.setVolumes(m, b, s);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans select-none">
      {!inGame ? (
        <TitleScreen
          onStartGame={handleStartGame}
          onOpenLoadModal={() => setSaveLoadModal({ isOpen: true, mode: 'load' })}
          onOpenCodex={() => setCodexOpen(true)}
          onOpenGallery={() => setGalleryOpen(true)}
          onOpenInventory={() => setInventoryOpen(true)}
          onOpenScenarioEditor={() => setScenarioEditorOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenChapterSelect={() => setChapterSelectOpen(true)}
          onOpenBattle={() => handleOpenBattle('shadow_beast', 'valeria')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      ) : (
        <main className="relative w-full h-full overflow-hidden">
          {/* Top Status Bar with Return to Menu, Undo button, and Inventory */}
          {!isUiHidden && (
            <StatusBar
              stats={stats}
              chapterTitle={currentNode.chapterTitle}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onReturnToTitle={handleReturnToTitle}
              canGoBack={historyStack.length > 0}
              onStepPrevious={handleStepPrevious}
              onOpenChapterSelect={() => setChapterSelectOpen(true)}
              onOpenInventory={() => setInventoryOpen(true)}
            />
          )}

          {/* Item Acquisition Floating Toast Notification */}
          {itemNotification && (
            <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-950/95 via-red-950/95 to-stone-950/95 border border-rose-500 text-rose-100 font-cinzel font-bold text-xs tracking-wider shadow-[0_0_25px_rgba(225,29,72,0.5)] flex items-center gap-2.5 animate-bounce backdrop-blur-md">
              <span className="text-base">✨</span>
              <span>{itemNotification}</span>
            </div>
          )}

          {/* Atmospheric Background Scene with Parallax Particles & Screen FX */}
          <AtmosphericBackground
            backgroundId={currentNode.background}
            screenEffect={currentNode.screenEffect}
            sanity={stats.sanity}
            dreadLevel={stats.dreadLevel}
          />

          {/* Anime Character Sprites */}
          {currentNode.characterSprite && (
            <AnimeCharacterSprite
              character={currentNode.characterSprite.character}
              expression={currentNode.characterSprite.expression}
              position={currentNode.characterSprite.position}
              isSpeaking={true}
            />
          )}

          {/* Secondary Sprite if present in multi-character scenes */}
          {currentNode.secondarySprite && (
            <AnimeCharacterSprite
              character={currentNode.secondarySprite.character}
              expression={currentNode.secondarySprite.expression}
              position={currentNode.secondarySprite.position}
              isSpeaking={false}
            />
          )}

          {/* Main Visual Novel Dialogue Box & Choice Controls */}
          <DialogueBox
            key={currentNode.id}
            currentNode={currentNode}
            onAdvance={handleAdvance}
            onSelectChoice={handleSelectChoice}
            isAutoPlay={isAutoPlay}
            onToggleAutoPlay={() => setIsAutoPlay((p) => !p)}
            isSkipMode={isSkipMode}
            onToggleSkipMode={() => setIsSkipMode((p) => !p)}
            onOpenBacklog={() => setBacklogOpen(true)}
            onOpenSaveModal={(mode) => setSaveLoadModal({ isOpen: true, mode })}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenCodex={() => setCodexOpen(true)}
            onOpenGallery={() => setGalleryOpen(true)}
            onOpenInventory={() => setInventoryOpen(true)}
            onReturnToTitle={handleReturnToTitle}
            textSpeed={textSpeed}
            isUiHidden={isUiHidden}
            onToggleHideUi={() => setIsUiHidden((p) => !p)}
            stats={stats}
            canGoBack={historyStack.length > 0}
            onStepPrevious={handleStepPrevious}
          />
        </main>
      )}

      {/* MODALS */}
      <BacklogModal
        isOpen={backlogOpen}
        onClose={() => setBacklogOpen(false)}
        entries={backlog}
      />

      <SaveLoadModal
        isOpen={saveLoadModal.isOpen}
        onClose={() => setSaveLoadModal({ isOpen: false, mode: 'save' })}
        mode={saveLoadModal.mode}
        currentSaveData={{
          nodeId: currentNodeId,
          chapterTitle: currentNode.chapterTitle || 'Ravenscroft Şatosu',
          previewText: currentNode.text,
          speaker: currentNode.speakerDisplayName,
          background: currentNode.background,
          character: currentNode.characterSprite?.character,
          stats,
        }}
        onLoadSlot={handleLoadSlot}
      />

      <CharacterCodexModal
        isOpen={codexOpen}
        onClose={() => setCodexOpen(false)}
        stats={stats}
      />

      <GalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        galleryItems={galleryItems}
      />

      {/* INVENTORY & RELICS MODAL */}
      <InventoryModal
        isOpen={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        stats={stats}
        onUseItem={handleUseInventoryItem}
      />

      <ScenarioEditorModal
        isOpen={scenarioEditorOpen}
        onClose={() => setScenarioEditorOpen(false)}
        onPlayCustomScene={(customScene) => {
          setInGame(true);
          setCustomNode(customScene);
        }}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        masterVolume={masterVolume}
        bgmVolume={bgmVolume}
        sfxVolume={sfxVolume}
        onVolumeChange={handleVolumeChange}
        textSpeed={textSpeed}
        onTextSpeedChange={setTextSpeed}
        autoPlayDelay={autoPlayDelay}
        onAutoPlayDelayChange={setAutoPlayDelay}
      />

      {/* CHAPTER & SCENE SELECT MODAL (FAST TEST MODE) */}
      <ChapterSelectModal
        isOpen={chapterSelectOpen}
        onClose={() => setChapterSelectOpen(false)}
        onSelectChapter={handleSelectChapter}
        currentNodeId={currentNodeId}
      />

      {/* TURN-BASED RPG BATTLE MODAL */}
      <RpgBattleModal
        isOpen={battleOpen}
        onClose={() => setBattleOpen(false)}
        onVictory={handleBattleVictory}
        initialEnemyId={battleEnemyId}
        defaultCompanion={battleCompanion}
        currentStats={stats}
      />
    </div>
  );
}
