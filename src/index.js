import { initPollingWidget } from './tasks/task1.js';
import { initPostsWidget } from './tasks/task2.js';
import { initDashboard } from './tasks/task3.js';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.append(app);

  // Создаём панель переключения
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const btnTask1 = document.createElement('button');
  btnTask1.textContent = 'Задача 1: Polling';

  const btnTask2 = document.createElement('button');
  btnTask2.textContent = 'Задача 2: Posts with comments';

  const btnTask3 = document.createElement('button');
  btnTask3.textContent = 'Задача 3: Dashboard';

  toolbar.append(btnTask1, btnTask2, btnTask3);
  document.body.insertBefore(toolbar, app);

  // функция уничтожения текущего виджета
  let currentDestroy = null;

  function switchToTask(taskNumber) {
    if (currentDestroy) {
      // Удаляем предыдущий виджет (очищаем контейнер)
      currentDestroy();
      currentDestroy = null;
    }
    app.innerHTML = '';
    if (taskNumber === 1) {
      const widget = initPollingWidget(app);
      currentDestroy = widget.destroy.bind(widget);
    } else if (taskNumber === 2) {
      const widget = initPostsWidget(app);
      currentDestroy = widget.destroy.bind(widget);
    } else {
      const widget = initDashboard(app);
      currentDestroy = widget.destroy.bind(widget);
    }
  }

  btnTask1.addEventListener('click', () => switchToTask(1));
  btnTask2.addEventListener('click', () => switchToTask(2));
  btnTask3.addEventListener('click', () => switchToTask(3));

  // По умолчанию показываем задачу 1
  switchToTask(1);
});