/**
 * Inventory and Collectible Items Types for Ravenscroft Castle
 */

export type ItemCategory = 'all' | 'weapon' | 'clue' | 'relic' | 'consumable';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'relic' | 'legendary';

export interface ConsumableEffect {
  hp?: number;
  sanity?: number;
  willpower?: number;
  focus?: number;
  mystery?: number;
}

export interface InventoryItemDef {
  id: string;
  name: string;
  category: 'weapon' | 'clue' | 'relic' | 'consumable';
  rarity: ItemRarity;
  iconName: string;
  emoji: string;
  shortDescription: string;
  lore: string;
  inspectionText?: string;
  isConsumable?: boolean;
  consumableEffect?: ConsumableEffect;
  effectDescription?: string;
  acquiredLocation?: string;
}

export interface InventorySlot {
  item: InventoryItemDef;
  quantity: number;
}
