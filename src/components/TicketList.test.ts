import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TicketsList from './TicketsList';


// Explicitly define the type of TicketsList
// const TicketsList: React.FC = require('./TicketsList').default;

import { getMoreTickets } from '../api/tickets';
import { Ticket } from '../types'; // Import the Ticket type

jest.mock('../api/tickets'); // Mock the API

const mockTickets: Ticket[] = [
  { id: 1, subject: 'Ticket 1', priority: 'High', status: 'Open', description: 'Description 1' },
  { id: 2, subject: 'Ticket 2', priority: 'Medium', status: 'Closed', description: 'Description 2' },
  { id: 3, subject: 'Ticket 3', priority: 'High', status: 'Open', description: 'Description 3' },
  { id: 4, subject: 'Ticket 4', priority: 'Low', status: 'Closed', description: 'Description 4' },
];
describe('TicketsList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component without crashing', () => {
    render(<TicketsList />); 
    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
  });

  it('fetches and displays tickets on scroll', async () => {
    (getMoreTickets as jest.Mock).mockResolvedValueOnce(mockTickets);

    render(<TicketsList />);

    // Simulate initial fetch
    await waitFor(() => {
      expect(getMoreTickets).toHaveBeenCalledWith(0, 4);
    });

    // Scroll to the bottom
    const listElement = screen.getByRole('list');
    fireEvent.scroll(listElement, {
      target: { scrollTop: listElement.scrollHeight },
    });

    // Simulate fetching more tickets
    await waitFor(() => {
      expect(getMoreTickets).toHaveBeenCalledWith(4, 8);
    });

    // Verify tickets are rendered
    mockTickets.forEach((ticket) => {
      expect(screen.getByText(ticket.title)).toBeInTheDocument();
    });
  });

  it('shows a loading indicator while fetching', async () => {
    (getMoreTickets as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockTickets), 1000))
    );

    render(<TicketsList />);

    // Simulate initial fetch
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    // Ensure loading indicator disappears after fetch
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it('does not fetch tickets if already fetching', async () => {
    (getMoreTickets as jest.Mock).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    render(<TicketsList />);

    // Simulate multiple scrolls while fetching
    const listElement = screen.getByRole('list');
    fireEvent.scroll(listElement, {
      target: { scrollTop: listElement.scrollHeight },
    });
    fireEvent.scroll(listElement, {
      target: { scrollTop: listElement.scrollHeight },
    });

    await waitFor(() => {
      expect(getMoreTickets).toHaveBeenCalledTimes(1);
    });
  });

  it('appends new tickets to the list', async () => {
    (getMoreTickets as jest.Mock)
      .mockResolvedValueOnce(mockTickets)
      .mockResolvedValueOnce([
        { id: 5, subject: 'Ticket 5', priority: 'High', status: 'Open', description: 'Description 4' },
        { id: 6, subject: 'Ticket 6', priority: 'High', status: 'Open', description: 'Description 4' },
      ]);

    render(<TicketsList />);

    // Wait for the initial fetch
    await waitFor(() => {
      mockTickets.forEach((ticket) => {
        expect(screen.getByText(ticket.title)).toBeInTheDocument();
      });
    });

    // Scroll to the bottom
    const listElement = screen.getByRole('list');
    fireEvent.scroll(listElement, {
      target: { scrollTop: listElement.scrollHeight },
    });

    // Wait for the second fetch
    await waitFor(() => {
      expect(screen.getByText('Ticket 5')).toBeInTheDocument();
      expect(screen.getByText('Ticket 6')).toBeInTheDocument();
    });
  });
});
