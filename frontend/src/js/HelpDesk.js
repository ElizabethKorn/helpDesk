import "./style.css";
export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("Container должен быть HTML элементом");
    }
    this.container = container;
    this.ticketService = ticketService;

    this.tickets = [];
    this.modal = null;
  }

  async init() {
    this.container.innerHTML = `
      <button class="btn-add">Добавить тикет</button>
      <div class="tickets-list"></div>
      <div class="modal hidden"></div>
    `;
    this.ticketsListEl = this.container.querySelector(".tickets-list");
    this.modal = this.container.querySelector(".modal");
    this.container
      .querySelector(".btn-add")
      .addEventListener("click", () => this.showCreateModal());

    await this.loadAndRenderTickets();
  }

  async loadAndRenderTickets() {
    this.ticketsListEl.innerHTML = "Загрузка...";
    try {
      this.tickets = await this.ticketService.list();
      this.renderTickets();
    } catch (err) {
      this.ticketsListEl.innerHTML = `<div class="error">Ошибка загрузки: ${err.message}</div>`;
    }
  }

  renderTickets() {
    if (!this.tickets.length) {
      this.ticketsListEl.innerHTML = "<p>Тикетов нет</p>";
      return;
    }

    this.ticketsListEl.innerHTML = "";
    this.tickets.forEach((ticket) => {
      const ticketEl = document.createElement("div");
      ticketEl.className = "ticket";
      if (ticket.status) ticketEl.classList.add("done");

      ticketEl.innerHTML = `
        <input type="checkbox" class="ticket-done" ${
          ticket.status ? "checked" : ""
        } />
        <div class="ticket-body">${ticket.name}</div>
        <button class="btn-edit" title="Редактировать">✎</button>
        <button class="btn-delete" title="Удалить">×</button>
      `;

      // Клик по чекбоксу — меняем статус
      ticketEl
        .querySelector(".ticket-done")
        .addEventListener("change", async (e) => {
          const done = e.target.checked;
          await this.updateTicketStatus(ticket.id, done);
        });

      // Клик по телу — показать детали
      ticketEl
        .querySelector(".ticket-body")
        .addEventListener("click", () => this.showDetailsModal(ticket.id));

      // Редактировать
      ticketEl
        .querySelector(".btn-edit")
        .addEventListener("click", () => this.showEditModal(ticket));

      // Удалить
      ticketEl
        .querySelector(".btn-delete")
        .addEventListener("click", () => this.showDeleteModal(ticket));

      this.ticketsListEl.appendChild(ticketEl);
    });
  }

  async updateTicketStatus(id, done) {
    try {
      await this.ticketService.update(id, { status: done });
      await this.loadAndRenderTickets();
    } catch (err) {
      alert("Ошибка обновления статуса: " + err.message);
    }
  }

  // --- Модалки ---

  showCreateModal() {
    this.showModal({
      title: "Создать тикет",
      name: "",
      description: "",
      onSave: async (data) => {
        await this.ticketService.create(data);
        this.hideModal();
        await this.loadAndRenderTickets();
      },
    });
  }

  showEditModal(ticket) {
    this.showModal({
      title: "Редактировать тикет",
      name: ticket.name,
      description: ticket.description,
      onSave: async (data) => {
        await this.ticketService.update(ticket.id, data);
        this.hideModal();
        await this.loadAndRenderTickets();
      },
    });
  }

  showDeleteModal(ticket) {
    this.modal.innerHTML = `
      <div class="modal-content">
        <h3>Удалить тикет?</h3>
        <p>${ticket.name}</p>
        <button class="btn-confirm">Удалить</button>
        <button class="btn-cancel">Отмена</button>
      </div>
    `;
    this.modal.classList.remove("hidden");

    this.modal.querySelector(".btn-confirm").onclick = async () => {
      try {
        await this.ticketService.delete(ticket.id);
        this.hideModal();
        await this.loadAndRenderTickets();
      } catch (err) {
        alert("Ошибка удаления: " + err.message);
      }
    };
    this.modal.querySelector(".btn-cancel").onclick = () => this.hideModal();
  }

  async showDetailsModal(id) {
    try {
      const ticket = await this.ticketService.get(id);
      this.modal.innerHTML = `
        <div class="modal-content">
          <h3>Детали тикета</h3>
          <p><b>Название:</b> ${ticket.name}</p>
          <p><b>Описание:</b> ${ticket.description || "Отсутствует"}</p>
          <p><b>Статус:</b> ${ticket.status ? "Выполнен" : "В работе"}</p>
          <button class="btn-close">Закрыть</button>
        </div>
      `;
      this.modal.classList.remove("hidden");

      this.modal.querySelector(".btn-close").onclick = () => this.hideModal();
    } catch (err) {
      alert("Ошибка загрузки деталей: " + err.message);
    }
  }

  showModal({ title, name, description, onSave }) {
    this.modal.innerHTML = `
      <div class="modal-content">
        <h3>${title}</h3>
        <label>Краткое описание<br><input type="text" class="input-name" value="${name}" /></label>
        <label>Подробное описание<br><textarea class="input-description">${description}</textarea></label>
        <div class="modal-buttons">
          <button class="btn-save">Сохранить</button>
          <button class="btn-cancel">Отмена</button>
        </div>
      </div>
    `;
    this.modal.classList.remove("hidden");

    const inputName = this.modal.querySelector(".input-name");
    const inputDesc = this.modal.querySelector(".input-description");

    this.modal.querySelector(".btn-save").onclick = () => {
      const newName = inputName.value.trim();
      if (!newName) {
        alert("Название не может быть пустым");
        return;
      }
      onSave({ name: newName, description: inputDesc.value.trim() });
    };
    this.modal.querySelector(".btn-cancel").onclick = () => this.hideModal();
  }

  hideModal() {
    this.modal.classList.add("hidden");
    this.modal.innerHTML = "";
  }
}
