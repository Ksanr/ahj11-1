import { interval, from } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const API_URL = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api/messages/unread`
  : '/api/messages/unread';

/**
 * Форматирует timestamp (в секундах) в строку "ЧЧ:ММ ДД.ММ.ГГГГ"
 * @param {number} timestamp - секунды с эпохи
 * @returns {string}
 */
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

/**
 * Укорачивает строку до 15 символов, добавляя многоточие, если нужно.
 * @param {string} subject
 * @returns {string}
 */
function truncateSubject(subject) {
  if (subject.length <= 15) return subject;
  return subject.slice(0, 15) + '…';
}

/**
 * Создаёт HTML-строку строки таблицы для одного сообщения.
 * @param {Object} msg - сообщение
 * @returns {string}
 */
function messageRowHtml(msg) {
  return `
    <tr data-id="${msg.id}">
      <td>${escapeHtml(msg.from)}</td>
      <td>${escapeHtml(truncateSubject(msg.subject))}</td>
      <td>${escapeHtml(formatDate(msg.received))}</td>
    </tr>
  `;
}

/**
 * Простейшая защита от XSS.
 */
function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

/**
 * Основная функция инициализации виджета.
 * @param {HTMLElement} container - элемент, в который будет помещена таблица
 */
export function initPollingWidget(container) {
  // Очищаем контейнер и создаём таблицу
  container.innerHTML = '';
  const table = document.createElement('table');
  table.classList.add('messages-table');
  // Заголовок таблицы
  table.insertAdjacentHTML('beforeend', `
    <thead>
      <tr><th>От кого</th><th>Тема</th><th>Получено</th></tr>
    </thead>
  `);
  const tbody = document.createElement('tbody');
  table.append(tbody);
  container.append(table);

  // Поток опроса: каждые 5 секунд делаем GET-запрос
  // Сохраняем подписку
  const subscription = interval(5000).pipe(
    switchMap(() => ajax.getJSON(API_URL).pipe(
      catchError(err => {
        console.error('Ошибка при опросе сервера:', err);
        // Возвращаем пустой массив сообщений (аналог отсутствия новых)
        return from([{ messages: [] }]);
      })
    )),
    map(response => response.messages || [])
  ).subscribe(messages => {
    // Добавляем новые сообщения в начало таблицы (сверху)
    if (messages.length === 0) return;
    for (const msg of messages) {
      // Проверяем, нет ли уже такого сообщения по id (защита от дублей)
      if (tbody.querySelector(`tr[data-id="${msg.id}"]`)) continue;
      tbody.insertAdjacentHTML('afterbegin', messageRowHtml(msg));
    }
  });

  // Возвращаем функцию очистки
  return {
    destroy() {
      subscription.unsubscribe();
      console.log('Задача 1: подписка отключена');
    }
  };
}