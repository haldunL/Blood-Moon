/**
 * Types and interfaces for the Visual Novel engine
 */

export type CharacterId = 
  | 'narrator' 
  | 'protagonist' 
  | 'vivienne' 
  | 'evangeline' 
  | 'valeria' 
  | 'beatrice' 
  | 'morrigan' 
  | 'lenore' 
  | 'shadow';

export type CharacterExpression = 
  | 'neutral' 
  | 'smile' 
  | 'seductive' 
  | 'blushing' 
  | 'fear' 
  | 'yandere' 
  | 'serious';

export type BackgroundId = 
  | 'gothic_castle' 
  | 'blackwood_forest'
  | 'reception_hall'
  | 'crimson_parlor' 
  | 'victorian_library' 
  | 'crypt_chapel' 
  | 'cathedral_altar'
  | 'rose_garden'
  | 'ending_dawn'
  | 'alchemist_tower'
  | 'mirror_corridor'
  | 'servant_quarters';

export type AudioMood = 
  | 'mystery' 
  | 'romance' 
  | 'horror' 
  | 'tension' 
  | 'silence' 
  | 'music_box';

export type SfxType = 
  | 'heartbeat' 
  | 'thunder' 
  | 'horror_stinger' 
  | 'sensual_chime' 
  | 'whisper' 
  | 'click' 
  | 'page_flip' 
  | 'door_creak'
  | 'bell_ring'
  | 'glass_shatter'
  | 'wind_howl'
  | 'horse_whinny'
  | 'carriage_stop';

export interface ChoiceOption {
  id: string;
  text: string;
  nextNodeId: string;
  effectDescription?: string;
  sanityChange?: number; // negative or positive
  willpowerChange?: number;
  mysteryChange?: number;
  focusChange?: number;
  hpChange?: number;
  affectionChange?: {
    vivienne?: number;
    evangeline?: number;
    valeria?: number;
    beatrice?: number;
    morrigan?: number;
    lenore?: number;
  };
  requiredWillpower?: number; // e.g. [İrade ≥ 15]
  requiredMystery?: number;   // e.g. [Gizem ≥ 10]
  requiredFocus?: number;     // e.g. [Odak ≥ 20]
  requiredSanityMin?: number;
  requiredSanityMax?: number;
  itemReward?: string | string[];
  itemRemove?: string | string[];
  expReward?: number;
  battleTrigger?: {
    enemyId: 'shadow_beast' | 'crypt_knight' | 'blood_phantom' | 'inquisitor_wraith' | 'grave_wolf';
    companion?: 'none' | 'vivienne' | 'evangeline' | 'valeria' | 'beatrice' | 'morrigan' | 'lenore';
    victoryNodeId: string;
    defeatNodeId?: string;
    isBoss?: boolean;
  };
}

export interface StoryNode {
  id: string;
  speaker: CharacterId;
  speakerDisplayName: string;
  text: string;
  characterSprite?: {
    character: CharacterId;
    expression: CharacterExpression;
    position: 'center' | 'left' | 'right';
  };
  secondarySprite?: {
    character: CharacterId;
    expression: CharacterExpression;
    position: 'left' | 'right';
  };
  background: BackgroundId;
  audioMood?: AudioMood;
  sfx?: SfxType;
  screenEffect?: 'none' | 'shake' | 'flash' | 'glitch' | 'blood_pulse' | 'fade_black';
  letterModal?: {
    title: string;
    sender: string;
    content: string[];
    signature?: string;
    bloodStained?: boolean;
  };
  choices?: ChoiceOption[];
  nextNodeId?: string; // if no choices
  chapterTitle?: string;
  isEnding?: boolean;
  endingTitle?: string;
  textEndingDescription?: string;
  unlockedCgId?: string;
  itemReward?: string | string[];
  itemRemove?: string | string[];
  expReward?: number;
  sanityChange?: number;
  willpowerChange?: number;
  mysteryChange?: number;
  focusChange?: number;
  affectionChange?: {
    vivienne?: number;
    evangeline?: number;
    valeria?: number;
    beatrice?: number;
    morrigan?: number;
    lenore?: number;
  };
  battleTrigger?: {
    enemyId: 'shadow_beast' | 'crypt_knight' | 'blood_phantom' | 'inquisitor_wraith' | 'grave_wolf';
    companion?: 'none' | 'vivienne' | 'evangeline' | 'valeria' | 'beatrice' | 'morrigan' | 'lenore';
    victoryNodeId: string;
    defeatNodeId?: string;
    isBoss?: boolean;
  };
}

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  motto: string;
  title: string;
  age: string;
  description: string;
  secretDesire: string;
  dangerLevel: string;
  accentColor: string;
  quotes: string[];
}

export interface SaveSlot {
  id: number;
  timestamp: number;
  dateStr: string;
  nodeId: string;
  chapterTitle: string;
  previewText: string;
  speaker: string;
  background: BackgroundId;
  character?: CharacterId;
  stats: {
    sanity: number;
    hp?: number;
    maxHp?: number;
    focus?: number;
    mystery?: number;
    willpower?: number;
    exp?: number;
    level?: number;
    vivienneAffection: number;
    evangelineAffection: number;
    valeriaAffection: number;
    beatriceAffection?: number;
    morriganAffection?: number;
    lenoreAffection?: number;
    metCharacters?: Record<string, boolean>;
    inventory?: Record<string, number>;
    claimedRewards?: Record<string, boolean>;
  };
}

export interface GameStats {
  hp?: number;
  maxHp?: number;
  exp?: number; // Total Experience Points (EXP)
  level?: number; // Julian's Character Level
  sanity: number; // 0 - 100 (also SP / İrade)
  focus: number; // 0 - 100 (Odak / Büyülenme / Tension Barı)
  mystery: number; // 0 - 100 (Gizem / Dedektiflik Puanı)
  willpower: number; // 0 - 100 (İrade / Mantık Puanı)
  vivienneAffection: number; // 0 - 100
  evangelineAffection: number; // 0 - 100
  valeriaAffection: number; // 0 - 100
  beatriceAffection: number; // 0 - 100
  morriganAffection: number; // 0 - 100
  lenoreAffection: number; // 0 - 100
  dreadLevel: number; // 0 - 100
  metCharacters?: Record<string, boolean>;
  inventory?: Record<string, number>;
  claimedRewards?: Record<string, boolean>;
}

export interface CgGalleryItem {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  thumbnailBackground: BackgroundId;
  character: CharacterId;
  sensualScore: number;
}
