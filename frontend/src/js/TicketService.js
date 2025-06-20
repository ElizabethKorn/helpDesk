export default class TicketService {
  constructor() {
    this.baseUrl = "http://localhost:7070";
  }

  async list() {
    try {
      const res = await fetch(`${this.baseUrl}/?method=allTickets`);
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }

  async get(id) {
    try {
      const res = await fetch(`${this.baseUrl}/?method=ticketById&id=${id}`);
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    try {
      const res = await fetch(`${this.baseUrl}/?method=createTicket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async update(id, data) {
    try {
      const res = await fetch(`${this.baseUrl}/?method=updateById&id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    try {
      const res = await fetch(`${this.baseUrl}/?method=deleteById&id=${id}`);
      if (res.status === 204) {
        return true;
      } else {
        throw new Error("Failed to delete ticket");
      }
    } catch (err) {
      throw err;
    }
  }
}
