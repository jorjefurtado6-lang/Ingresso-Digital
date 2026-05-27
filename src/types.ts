export interface Ticket {
  id: string;
  name: string;
  session: string;
  row: string;
  seat: string;
  status: 'available' | 'used';
  entryTime?: string;
}

export type ViewMode = 'login' | 'admin' | 'scanner';
