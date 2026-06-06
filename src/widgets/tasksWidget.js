export class TasksWidget {
  constructor(store, container) {
    this.store = store;
    this.container = container;
    this.subscription = null;
    this.currentProjectId = null;
    this.menuElement = null; // для выпадающего меню
  }

  // Создание выпадающего меню
  createProjectMenu(projects, currentProject) {
    // Удаляем предыдущее меню, если есть
    if (this.menuElement) this.menuElement.remove();

    const menu = document.createElement('div');
    menu.className = 'project-menu';

    // Первая строка: "проект: Текущий проект"
    const currentLine = document.createElement('div');
    currentLine.className = 'menu-current';
    currentLine.textContent = `Проект: ${currentProject.name}`;
    menu.append(currentLine);

    // Разделитель
    const hr = document.createElement('hr');
    menu.append(hr);

    // Список остальных проектов
    projects.forEach(project => {
      if (project.id === currentProject.id) return;
      const item = document.createElement('div');
      item.className = 'menu-item';
      item.textContent = project.name;
      item.addEventListener('click', () => {
        this.setProject(project.id);
        this.closeMenu();
      });
      menu.append(item);
    });

    // Закрытие при клике вне меню
    const closeHandler = (e) => {
      if (!menu.contains(e.target) && e.target !== this.projectLink) {
        this.closeMenu();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 0);

    this.menuElement = menu;
    return menu;
  }

  // В обработчике закрытия меню (closeMenu) возвращаем видимость:
  closeMenu() {
    if (this.menuElement) {
      this.menuElement.remove();
      this.menuElement = null;
    }
  }

  render(projects) {
    const project = projects.find(p => p.id === this.currentProjectId);
    if (!project) {
      this.container.innerHTML = '<h2>Задачи</h2><p>Выберите проект слева</p>';
      return;
    }

    // Заголовок "Задачи"
    const title = document.createElement('h2');
    title.textContent = 'Задачи';

    // Строка "Проект: Имя_проекта"
    const projectLine = document.createElement('div');
    projectLine.className = 'project-line';
    const projectLabel = document.createElement('span');
    projectLabel.textContent = 'Проект: ';
    this.projectLink = document.createElement('a');
    this.projectLink.href = '#';
    this.projectLink.textContent = project.name;
    this.projectLink.className = 'project-link';
    this.projectLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Если меню уже открыто – закрываем, иначе открываем
      if (this.menuElement) {
        this.closeMenu();
      } else {
        const menu = this.createProjectMenu(projects, project);
        const rect = this.projectLink.getBoundingClientRect();
        menu.style.top = `${rect.top - 8}px`;
        menu.style.left = `${rect.left - 88}px`;
        document.body.append(menu);
      }
    });
    projectLine.append(projectLabel, this.projectLink);

    // Список задач
    const taskList = document.createElement('ul');
    taskList.className = 'tasks-list';
    project.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.className = 'task-checkbox';
      checkbox.addEventListener('change', (e) => {
        this.store.updateTask(project.id, task.id, e.target.checked);
      });
      const label = document.createElement('span');
      label.textContent = task.name;
      li.append(checkbox, label);
      taskList.append(li);
    });

    this.container.innerHTML = '';
    this.container.append(title, projectLine, taskList);
  }

  setProject(projectId) {
    this.currentProjectId = projectId;
    this.closeMenu();
    const state = this.store.getState();
    this.render(state.projects);
  }

  init() {
    this.subscription = this.store.subscribe(state => {
      if (this.currentProjectId !== null) {
        this.render(state.projects);
      }
    });
  }

  destroy() {
    if (this.subscription) this.subscription.unsubscribe();
    this.closeMenu();
  }
}