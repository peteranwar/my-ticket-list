import { TICKETS_DATA } from "../data/tickets";
import { Ticket } from "../types";


export const getMoreTickets = async (startIndex: number, count: number): Promise<Ticket[]> => {
       return new Promise((resolve) => {
           setTimeout(() => {
               resolve(TICKETS_DATA.slice(startIndex, count));
           }, 2000);
       });
};