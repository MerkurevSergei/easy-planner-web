// Получаем ссылки на элементы страницы
const addBtn = document.getElementById('addBtn');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const sideMenu = document.getElementById('sideMenu');
const elementForm = document.getElementById('elementForm');
const formTitle = document.getElementById('formTitle');
const cancelBtn = document.getElementById('cancelBtn');
const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

let selectedRow = null;
let mode = 'add'; // Режим работы формы: 'add' или 'edit'

// Функция открытия бокового меню
function openSideMenu() {
  sideMenu.classList.add('open');
}

// Функция закрытия бокового меню и сброса формы
function closeSideMenu() {
  sideMenu.classList.remove('open');
  elementForm.reset();
}

// Функция выбора строки таблицы
function selectRow(row) {
  // Снимаем выделение с предыдущей выбранной строки
  if (selectedRow) {
    selectedRow.classList.remove('selected');
  }
  selectedRow = row;
  row.classList.add('selected');
}

// Функция для создания строки таблицы из объекта элемента
function createTableRow(item) {
  const newRow = dataTable.insertRow();
  console.log(item);
  newRow.setAttribute('data-id', item.id);
  newRow.innerHTML = `<td>${item.name}</td>
                      <td>${item.description}</td>
                      <td>${item.status}</td>
                      <td>${item.isId}</td>
                      <td>${item.isCode}</td>`;
  newRow.addEventListener('click', function () {
    selectRow(this);
  });
  return newRow;
}

// Загрузка данных с сервера при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:8080/api/projects');
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных');
    }
    const items = await response.json();
    items.forEach(item => {
      createTableRow(item);
    });
  } catch (error) {
    console.error(error);
    alert('Ошибка при загрузке данных с сервера.');
  }
});

// Обработчик нажатия кнопки "Добавить"
addBtn.addEventListener('click', () => {
  mode = 'add';
  formTitle.textContent = 'Добавить элемент';
  elementForm.reset();
  openSideMenu();
});

// Обработчик нажатия кнопки "Редактировать"
editBtn.addEventListener('click', () => {
  if (!selectedRow) {
    alert('Пожалуйста, выберите элемент для редактирования.');
    return;
  }
  mode = 'edit';
  formTitle.textContent = 'Редактировать элемент';
  // Заполняем форму данными выбранной строки
  const cells = selectedRow.getElementsByTagName('td');
  document.getElementById('name').value = cells[0].textContent;
  document.getElementById('description').value = cells[1].textContent;
  document.getElementById('code').value = cells[2].textContent;
  document.getElementById('identifier').value = cells[3].textContent;
  openSideMenu();
});

// Обработчик нажатия кнопки "Удалить"
deleteBtn.addEventListener('click', async () => {
  if (!selectedRow) {
    alert('Пожалуйста, выберите элемент для удаления.');
    return;
  }
  const id = selectedRow.getAttribute('data-id');
  if (confirm('Вы уверены, что хотите удалить выбранный элемент?')) {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Ошибка при удалении');
      }
      selectedRow.remove();
      selectedRow = null;
    } catch (error) {
      console.error(error);
      alert('Ошибка при удалении элемента.');
    }
  }
});

// Обработчик отправки формы (Сохранить)
elementForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const code = document.getElementById('code').value.trim();
  const identifier = document.getElementById('identifier').value.trim();

  // Формируем объект с данными элемента
  const formData = { name, description, code, identifier };

  if (mode === 'add') {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Ошибка при добавлении');
      }
      const newItem = await response.json();
      // Создаём новую строку таблицы с данными, полученными с сервера (включая id)
      createTableRow(newItem);
    } catch (error) {
      console.error(error);
      alert('Ошибка при добавлении элемента.');
    }
  } else if (mode === 'edit') {
    const id = selectedRow.getAttribute('data-id');
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Ошибка при обновлении');
      }
      const updatedItem = await response.json();
      // Обновляем данные выбранной строки
      const cells = selectedRow.getElementsByTagName('td');
      cells[0].textContent = updatedItem.name;
      cells[1].textContent = updatedItem.description;
      cells[2].textContent = updatedItem.code;
      cells[3].textContent = updatedItem.identifier;
      selectedRow.setAttribute('data-id', updatedItem.id);
    } catch (error) {
      console.error(error);
      alert('Ошибка при обновлении элемента.');
    }
  }
  closeSideMenu();
});

// Обработчик кнопки "Отмена"
cancelBtn.addEventListener('click', () => {
  closeSideMenu();
});