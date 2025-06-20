/**
 *  Класс для создания формы создания нового тикета
 * */
export default class TicketForm {
  constructor() {}

  show(ticket, onSubmit) {
    const isEdit = !!ticket;
    const name = isEdit ? ticket.name : '';
    const description = isEdit ? ticket.description : '';
    const status = isEdit ? ticket.status : false;

    // Создадим форму в модальном окне (или на странице)
    const form = document.createElement('form');
    form.innerHTML = `
      <label>
        Название:<br>
        <input name="name" type="text" value="${name}" required />
      </label><br><br>
      <label>
        Описание:<br>
        <textarea name="description" rows="4" required>${description}</textarea>
      </label><br><br>
      <label>
        Выполнено:
        <input name="status" type="checkbox" ${status ? 'checked' : ''} />
      </label><br><br>
      <button type="submit">${isEdit ? 'Сохранить' : 'Создать'}</button>
    `;

    // Предположим, что у тебя есть элемент с id 'modalBody' для показа формы
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = '';
    modalBody.appendChild(form);

    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        status: formData.get('status') === 'on',
      };
      onSubmit(data);
      // Закрытие модалки делай в HelpDesk или здесь, если нужно
    };
  }
}

