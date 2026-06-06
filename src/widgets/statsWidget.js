export class StatsWidget {
  constructor(store, container, onSelectProject) {
    this.store = store;
    this.container = container;
    this.onSelectProject = onSelectProject;
    this.subscription = null;
  }

  render(projects) {
    this.container.innerHTML = '<h2>Статистика открытых задач</h2>';
    if (!projects.length) {
      this.container.innerHTML += '<p>Нет проектов</p>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'stats-table';

    // Заголовки
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const thProject = document.createElement('th');
    thProject.textContent = 'Название проектов';
    const thOpen = document.createElement('th');
    thOpen.textContent = 'открытые задачи';
    thOpen.style.textAlign = 'center';
    headerRow.append(thProject, thOpen);
    thead.append(headerRow);
    table.append(thead);

    // Тело таблицы
    const tbody = document.createElement('tbody');
    projects.forEach(project => {
      const openTasks = project.tasks.filter(task => !task.done).length;
      const row = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = project.name;
      tdName.style.cursor = 'pointer';
      tdName.addEventListener('click', () => {
        if (this.onSelectProject) this.onSelectProject(project.id);
      });

      const tdCount = document.createElement('td');
      tdCount.style.textAlign = 'center';
      // Овал с числом
      const oval = document.createElement('span');
      oval.className = 'task-count-oval';
      oval.textContent = openTasks;
      tdCount.append(oval);

      row.append(tdName, tdCount);
      tbody.append(row);
    });
    table.append(tbody);
    this.container.append(table);
  }

  init() {
    this.subscription = this.store.subscribe(state => {
      this.render(state.projects);
    });
  }

  destroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}