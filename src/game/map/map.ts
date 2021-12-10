import {
  createBuildingNode,
  createNewsNode,
  createPowerNode,
  createStartNode,
  createSubwayNode,
  createWishNode
} from '../nodes';
import { MapNode, MapNodeType } from '../nodes';

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
      createBuildingNode(MapNodeType.工业, 1),
      createBuildingNode(MapNodeType.商业, 2),
      createBuildingNode(MapNodeType.商业, 3),
      createBuildingNode(MapNodeType.商业, 4),
      createBuildingNode(MapNodeType.工业, 5),
      startNode,
      createBuildingNode(MapNodeType.工业, 7),
      createBuildingNode(MapNodeType.工业, 8),
      createSubwayNode(9),
      createBuildingNode(MapNodeType.住宅, 10),
      createBuildingNode(MapNodeType.住宅, 11),
      newsNode,
      createBuildingNode(MapNodeType.住宅, 13),
      createBuildingNode(MapNodeType.商业, 14),
      createBuildingNode(MapNodeType.商业, 15),
      createBuildingNode(MapNodeType.商业, 16),
      createBuildingNode(MapNodeType.住宅, 17),
      powerNode,
      createBuildingNode(MapNodeType.工业, 19),
      createBuildingNode(MapNodeType.工业, 20),
      createSubwayNode(21),
      createBuildingNode(MapNodeType.住宅, 22),
      createBuildingNode(MapNodeType.住宅, 23)
    ],
    width: 7,
    height: 7
  };
}
