import { Ctx } from 'boardgame.io';
import { GameData } from './game';
import { BuildingNode } from './nodes';
import { Player } from './players';

export enum BuildingName {
  甜品店 = '甜品店',
  蛋蛋屋 = '蛋蛋屋',
  甜品工厂 = '甜品工厂',
  木材厂 = '木材厂',
  五金店 = '五金店',
  钢铁厂 = '钢铁厂',
  家具城 = '家具城',
  轻钢别墅 = '轻钢别墅',
  复古木屋 = '复古木屋'
}

export enum BuildingCategory {
  工业 = '工业',
  商业 = '商业',
  住宅 = '住宅'
}

export enum BuildingType {
  木材 = '木材',
  钢铁 = '钢铁',
  甜品 = '甜品'
}

export interface BuildingConfig {
  category: BuildingCategory;
  type: BuildingType;
  baseFee: number;
  baseCost: number;
  maxLevel: number;
  feeCalculator?: Calculator;
  buyCostCalculator?: Calculator;
  upgradeCostCalculator?: Calculator;
}

const BuindingConfigMap: { [key in BuildingName]: BuildingConfig } = {
  [BuildingName.五金店]: {
    category: BuildingCategory.商业,
    type: BuildingType.钢铁,
    maxLevel: 3,
    baseFee: 80,
    baseCost: 400
  },
  [BuildingName.甜品店]: {
    category: BuildingCategory.商业,
    type: BuildingType.甜品,
    maxLevel: 3,
    baseFee: 80,
    baseCost: 400
  },
  [BuildingName.家具城]: {
    category: BuildingCategory.商业,
    type: BuildingType.木材,
    maxLevel: 3,
    baseFee: 80,
    baseCost: 400
  },
  [BuildingName.甜品工厂]: {
    category: BuildingCategory.工业,
    type: BuildingType.甜品,
    maxLevel: 3,
    baseFee: 80,
    baseCost: 400
  },
  [BuildingName.木材厂]: {
    category: BuildingCategory.工业,
    type: BuildingType.木材,
    maxLevel: 3,
    baseFee: 80,
    baseCost: 400
  },
  [BuildingName.钢铁厂]: {
    category: BuildingCategory.工业,
    type: BuildingType.钢铁,
    maxLevel: 3,
    baseFee: 80,
    baseCost: 400
  },
  [BuildingName.轻钢别墅]: {
    category: BuildingCategory.住宅,
    type: BuildingType.钢铁,
    maxLevel: 3,
    baseFee: 120,
    baseCost: 400
  },
  [BuildingName.复古木屋]: {
    category: BuildingCategory.住宅,
    type: BuildingType.木材,
    maxLevel: 3,
    baseFee: 120,
    baseCost: 400
  },
  [BuildingName.蛋蛋屋]: {
    category: BuildingCategory.住宅,
    type: BuildingType.甜品,
    maxLevel: 3,
    baseFee: 120,
    baseCost: 400
  }
};

type Calculator = (
  G: GameData,
  ctx: Ctx,
  node: BuildingNode,
  player: Player,
  buildingName?: BuildingName
) => CalculatorResult;

export interface CalculatorResult {
  money: number;
}

const defaultFeeCalculator: Calculator = (
  G: GameData,
  ctx: Ctx,
  node: BuildingNode,
  player: Player,
  buildingName?: BuildingName
) => {
  return {
    money:
      BuindingConfigMap[buildingName ?? node.buildingName].baseFee * Math.pow(2, node.level - 1)
  };
};

const defaultCostCalculator: Calculator = (
  G: GameData,
  ctx: Ctx,
  node: BuildingNode,
  player: Player,
  buildingName?: BuildingName
) => {
  return {
    money: node.level === 0 ? 400 : 100
  };
};
export const calculateFee: Calculator = (
  G: GameData,
  ctx: Ctx,
  node: BuildingNode,
  player: Player
) => {
  return (BuindingConfigMap[node.buildingName].feeCalculator || defaultFeeCalculator)(
    G,
    ctx,
    node,
    player
  );
};

export function calculateBuyCost(
  G: GameData,
  ctx: Ctx,
  node: BuildingNode,
  player: Player,
  buildingName?: BuildingName
) {
  return (
    BuindingConfigMap[buildingName ?? node.buildingName].buyCostCalculator || defaultCostCalculator
  )(G, ctx, node, player, buildingName);
}

export const calculateUpgradeCost: Calculator = (
  G: GameData,
  ctx: Ctx,
  node: BuildingNode,
  player: Player,
  buildingName?: BuildingName
) => {
  return (BuindingConfigMap[node.buildingName].upgradeCostCalculator || defaultCostCalculator)(
    G,
    ctx,
    node,
    player,
    buildingName
  );
};

export function getEligibleBuildingNames(
  G: GameData,
  ctx: Ctx,
  node: BuildingNode,
  player: Player
): BuildingName[] {
  return Object.entries(BuindingConfigMap)
    .filter(([, value]) => {
      return node.eligibleBuildingCategories.includes(value.category);
    })
    .map(([key]) => key as BuildingName);
}

export function isEligibleToUpgrade(
  G: GameData,
  ctx: Ctx,
  node: BuildingNode,
  player?: Player
): string | undefined {
  if (node.level >= BuindingConfigMap[node.buildingName].maxLevel) {
    return '已到达等级上限！';
  }
  if (player) {
    const result = calculateUpgradeCost(G, ctx, node, player);
    if (result.money >= player.money) {
      return '金钱不足';
    }
  }
}
