import { useState, useEffect, useRef, FC } from 'react';
import TicketCard from './TicketCard';
import { Ticket } from '../types';
import { getMoreTickets } from '../api/tickets';
import './styles.css'


const TicketsList : FC =  () => {
  const containerRef = useRef<HTMLUListElement | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [fetchCount, setFetchCount] = useState(4); // Start fetching 4 tickets
  const [isFetching, setIsFetching] = useState(false); // To prevent duplicate fetches
  const [startIndex, setStartIndex] = useState(0); // 

  const initialFetchRef = useRef(true); // Ref to track initial fetch

  const fetchMoreData = async () => {
    if (isFetching) return; // Prevent duplicate fetches

    // Update the starting index for the next fetch
    setStartIndex((prevIndex) => prevIndex + fetchCount);

    // Increase the fetch count for the next fetch
    setFetchCount((prevCount) => prevCount + 4); // Increase by 4 for the next fetch

  };

  useEffect(() => {
    async function handleUpdateTickets() {
      if (initialFetchRef.current) {
        initialFetchRef.current = false; // Set to false after the first fetch
      } else {
        setIsFetching(true); // Set fetching state

        const moreTickets = await getMoreTickets(startIndex, fetchCount) as Ticket[];

        // Update tickets state
        setTickets((prevTickets) => [...prevTickets, ...moreTickets]); // Add new tickets to existing array
        setIsFetching(false); // Reset fetching state
      }
    }

    handleUpdateTickets();
  }, [startIndex, fetchCount]);

  const handleScroll = () => {
    if (containerRef.current) {
      const atBottom = containerRef.current.scrollHeight - containerRef.current.scrollTop <= containerRef.current.clientHeight + 1; // Adding 1 to account for rounding errors
      if (atBottom) {
        fetchMoreData(); // Fetch more data when reaching the bottom
      }
    }
  };

  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
      <ul ref={containerRef} className='tickets-list'>
        {tickets.map((ticket: Ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
        {isFetching && <div className="loading loading--full-height"></div>} 
      </ul>
  );
};

export default TicketsList;