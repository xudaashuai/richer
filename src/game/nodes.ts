import { BuildingType } from './building';

export enum MapNodeType {
  工业 = '工业',
  商业 = '商业',
  住宅 = '住宅',
  许愿屋 = '许愿屋',
  起点 = '起点',
  电视台 = '电视台',
  能量站 = '能量站',
  地铁 = '地铁',
  EMPTY = 'EMPTY'
}

MapNodeType.工业;
export interface BaseNode {
  owner: string | null;
  position: number;
}

export type BuildingNode = BaseNode & {
  level: number;
  maxLevel: number;
  validBuildingTypes: BuildingType[];
  cost: number;
  fee: number;
  buildingType?: BuildingType;
  type: MapNodeType.工业 | MapNodeType.商业 | MapNodeType.住宅;
};

export interface MagicNode {}

export type WishNode = BaseNode &
  MagicNode & {
    wishs: [];
    type: MapNodeType.许愿屋;
  };
export type StartNode = BaseNode &
  MagicNode & {
    money: number;
    type: MapNodeType.起点;
  };
export type PowerNode = BaseNode &
  MagicNode & {
    power: number;
    type: MapNodeType.能量站;
  };
export type NewsNode = BaseNode &
  MagicNode & {
    news: [];
    type: MapNodeType.电视台;
  };

export type SubwayNode = BaseNode &
  MagicNode & {
    news: [];
    type: MapNodeType.地铁;
  };

export type MapNode =
  | BuildingNode
  | WishNode
  | NewsNode
  | PowerNode
  | StartNode
  | SubwayNode
  | { type: MapNodeType.EMPTY; position?: number };

export const ValidBuildingTypes = {
  [MapNodeType.工业]: [BuildingType.甜品工厂, BuildingType.木材厂, BuildingType.钢铁厂],
  [MapNodeType.商业]: [BuildingType.甜品店, BuildingType.家具城, BuildingType.五金店],
  [MapNodeType.住宅]: [BuildingType.蛋蛋屋, BuildingType.复古木屋, BuildingType.轻钢别墅]
};

export function createBuildingNode(
  type: MapNodeType.工业 | MapNodeType.商业 | MapNodeType.住宅,
  position: number,
  maxLevel = 3
): MapNode {
  return {
    type: type,
    owner: null,
    level: 0,
    maxLevel: maxLevel,
    validBuildingTypes: ValidBuildingTypes[type],
    position,
    cost: 300,
    fee: 100
  };
}

export function createStartNode(money: number, position: number): MapNode {
  return {
    type: MapNodeType.起点,
    owner: null,
    money: money,
    position
  };
}
export function createWishNode(position: number): MapNode {
  return {
    type: MapNodeType.许愿屋,
    owner: null,
    wishs: [],
    position
  };
}

export function createPowerNode(power: number, position: number): MapNode {
  return {
    type: MapNodeType.能量站,
    owner: null,
    power: 3,
    position
  };
}

export function createNewsNode(position: number): MapNode {
  return {
    type: MapNodeType.电视台,
    owner: null,
    news: [],
    position
  };
}

export function createSubwayNode(position: number): MapNode {
  return {
    type: MapNodeType.地铁,
    owner: null,
    news: [],
    position
  };
}
