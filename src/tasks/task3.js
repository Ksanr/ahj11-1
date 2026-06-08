import { Store } from '../store/store.js';
import { initialData } from '../store/initialData.js';
import { StatsWidget } from '../widgets/statsWidget.js';
import { TasksWidget } from '../widgets/tasksWidget.js';

export function initDashboard(container) {
  const store = new Store(initialData);

  container.innerHTML = '';
  const leftCol = document.createElement('div');
  leftCol.className = 'dashboard-stats';
  const rightCol = document.createElement('div');
  rightCol.className = 'dashboard-tasks';
  container.append(leftCol, rightCol);

  const tasksWidget = new TasksWidget(store, rightCol);
  tasksWidget.init();

  const statsWidget = new StatsWidget(store, leftCol, (projectId) => {
    tasksWidget.setProject(projectId);
  });
  statsWidget.init();

  const firstProject = store.getState().projects[0];
  if (firstProject) tasksWidget.setProject(firstProject.id);

  // Возвращаем функцию очистки
  return {
    destroy() {
      statsWidget.destroy();
      tasksWidget.destroy();
      console.log('Задача 3: виджеты уничтожены');
    }
  };
}