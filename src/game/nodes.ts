import { BuildingCategory, BuildingName } from './building';

export enum MapNodeType {
  空地 = '空地',
  许愿屋 = '许愿屋',
  起点 = '起点',
  电视台 = '电视台',
  能量站 = '能量站',
  地铁 = '地铁',
  EMPTY = 'EMPTY'
}

export interface BaseNode {
  owner: string | null;
  position: number;
}

export type BuildingNode = BaseNode & {
  level: number;
  buildingName?: BuildingName;
  type: MapNodeType.空地;
  eligibleBuildingCategories: BuildingCategory[];
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
    nextPosition: number;
  };

export type MapNode =
  | BuildingNode
  | WishNode
  | NewsNode
  | PowerNode
  | StartNode
  | SubwayNode
  | { type: MapNodeType.EMPTY; position?: number };

export function createBuildingNode(
  eligibleBuildingCategories: BuildingCategory[],
  position: number
): MapNode {
  return {
    type: MapNodeType.空地,
    owner: null,
    level: 0,
    position,
    eligibleBuildingCategories
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

export function createSubwayNode(position: number, nextPosition: number): MapNode {
  return {
    type: MapNodeType.地铁,
    owner: null,
    news: [],
    position,
    nextPosition
  };
}
