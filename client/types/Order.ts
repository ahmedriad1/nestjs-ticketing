import { Ticket } from './Ticket';

export interface Order {
  id: string;
  ticket: Ticket;
  userId: string;
  expiresAt: string;
  status: 'created' | 'complete' | 'cancelled';
}
