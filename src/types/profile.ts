import type { MasteredWord } from '../components/InventoryModal';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  inventory: MasteredWord[];
  createdAt: number;
}
