import { BuildingCategory } from './building';
import {
  createBuildingNode,
  createNewsNode,
  createPowerNode,
  createStartNode,
  createSubwayNode,
  createWishNode
} from './nodes';
import { MapNode } from './nodes';

export interface GameMap {
  startNode: MapNode;
  nodes: MapNode[];
  width: 7;
  height: 7;
}

export function createDefaultMap(): GameMap {
  const wishNode = createWishNode(0);
  const startNode = createStartNode(300, 6);
  const newsNode = createNewsNode(12);
  const powerNode = createPowerNode(3, 18);
  return {
    startNode,
    nodes: [
      wishNode,
      createBuildingNode([BuildingCategory.工业], 1),
      createBuildingNode([BuildingCategory.商业], 2),
      createBuildingNode([BuildingCategory.商业], 3),
      createBuildingNode([BuildingCategory.商业], 4),
      createBuildingNode([BuildingCategory.工业], 5),
      startNode,
      createBuildingNode([BuildingCategory.工业], 7),
      createBuildingNode([BuildingCategory.工业], 8),
      createSubwayNode(9, 21),
      createBuildingNode([BuildingCategory.住宅], 10),
      createBuildingNode([BuildingCategory.住宅], 11),
      newsNode,
      createBuildingNode([BuildingCategory.住宅], 13),
      createBuildingNode([BuildingCategory.商业], 14),
      createBuildingNode([BuildingCategory.商业], 15),
      createBuildingNode([BuildingCategory.商业], 16),
      createBuildingNode([BuildingCategory.住宅], 17),
      powerNode,
      createBuildingNode([BuildingCategory.工业], 19),
      createBuildingNode([BuildingCategory.工业], 20),
      createSubwayNode(21, 9),
      createBuildingNode([BuildingCategory.住宅], 22),
      createBuildingNode([BuildingCategory.住宅], 23)
    ],
    width: 7,
    height: 7
  };
}
