import { colors } from '../constant';

export interface Player {
  role: '1';
  name: string;
  position: number;
  isActive: boolean;
  money: number;
  color: string;
}
export function createPlayer(id: string, position: number): Player {
  return {
    isActive: true,
    role: '1',
    name: id,
    position: position,
    money: 3600,
    color: colors[+id]
  };
}
