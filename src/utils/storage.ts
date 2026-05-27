import { Ticket } from '../types';

const STORAGE_KEY = 'tickets_db';

export const getTickets = (): Record<string, Ticket> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Error reading from localStorage', err);
    return {};
  }
};

export const saveTicket = (ticket: Ticket): void => {
  const tickets = getTickets();
  tickets[ticket.id] = ticket;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

export const getTicketStatus = (id: string): Ticket | null => {
  const tickets = getTickets();
  return tickets[id] || null;
};

export const markTicketAsUsed = (id: string, time: string): Ticket | null => {
  const tickets = getTickets();
  if (tickets[id]) {
    tickets[id].status = 'used';
    tickets[id].entryTime = time;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    return tickets[id];
  }
  return null;
};

export const clearTickets = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
