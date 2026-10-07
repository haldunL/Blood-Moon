/**
 * Types and interfaces for the Turn-Based RPG Battle System in Ravenscroft Castle
 */

import { CharacterId } from './novel';

export type EnemyId = 'shadow_beast' | 'crypt_knight' | 'blood_phantom' | 'inquisitor_wraith' | 'grave_wolf';

export interface EnemyStats {
  id: EnemyId;
  name: string;
  title: string;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  speed: number;
  expReward: number;
  accentColor: string;
  description: string;
  spriteType: 'shadow' | 'knight' | 'phantom' | 'wraith' | 'wolf';
  actions: {
    name: string;
    description: string;
    power: number; // multiplier of atk
    type: 'physical' | 'dark_magic' | 'drain' | 'curse' | 'ultimate';
    statusEffect?: 'bleed' | 'stun' | 'fear';
  }[];
}

export interface PlayerStats {
  maxHp: number;
  hp: number;
  maxSp: number;
  sp: number;
  atk: number;
  def: number;
  overdrive: number; // 0 - 100 (Odak / Gerilim barı - Tension Gauge)
  focus?: number;    // 0 - 100 Odak puanı
  willpower?: number;// İrade puanı
  inventory: {
    holyWater: number;
    blackRoseNectar: number;
    silverCrucifixDust: number;
  };
}

export interface CompanionBattleSkill {
  name: string;
  description: string;
  spCost: number;
  type: 'damage' | 'heal' | 'buff' | 'ultimate';
  power: number;
  cooldownTurns: number;
}

export interface BattleLogEntry {
  id: string;
  text: string;
  type: 'player' | 'companion' | 'enemy' | 'system' | 'critical' | 'victory' | 'defeat';
}

export interface FloatingText {
  id: string;
  text: string;
  type: 'damage' | 'heal' | 'crit' | 'sp' | 'miss' | 'status';
  target: 'player' | 'enemy';
}

export type BattlePhase = 
  | 'player_turn' 
  | 'action_executing' 
  | 'enemy_turn' 
  | 'victory' 
  | 'defeat';
