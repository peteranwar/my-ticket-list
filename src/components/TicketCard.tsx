import { Ticket } from "../types"

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
    return (
        <li key={ticket.id} className="ticket-card">
            <h2>{ticket.subject} {ticket.id}</h2>
            <p><span className="label">Priority:</span>  <span className={`priority ${ticket.priority?.toLowerCase()}`}>{ticket.priority}</span> </p>
            <p><span className="label">Status: </span> {ticket.status}</p>
            <p><span className="label">Description:</span> {ticket.description}</p>
        </li>
    )
}

export default TicketCard