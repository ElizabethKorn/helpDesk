export default class TicketView {
  constructor() {}

  renderTicket(ticket) {
    const div = document.createElement('div');
    div.className = 'ticket';
    div.style.border = '1px solid #ccc';
    div.style.margin = '8px';
    div.style.padding = '10px';
    div.style.position = 'relative';

    div.innerHTML = `
      <input type="checkbox" class="done-checkbox" ${ticket.status ? 'checked' : ''} style="position:absolute; top:10px; left:10px;">
      <div class="ticket-body" style="margin-left:30px; cursor:pointer;">
        <strong>${ticket.name}</strong><br>
        <small>Создан: ${new Date(ticket.created).toLocaleString()}</small>
      </div>
      <button class="edit-btn" style="position:absolute; top:10px; right:40px;">✎</button>
      <button class="delete-btn" style="position:absolute; top:10px; right:10px;">x</button>
    `;
    return div;
  }

  renderTickets(tickets) {
    const container = document.createElement('div');
    tickets.forEach(ticket => {
      container.appendChild(this.renderTicket(ticket));
    });
    return container;
  }
}
