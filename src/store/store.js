import { BehaviorSubject } from 'rxjs';

export class Store {
  constructor(initialState) {
    this.state$ = new BehaviorSubject(initialState);
    this.state = initialState;
  }

  // Получить текущее состояние
  getState() {
    return this.state;
  }

  // Обновить состояние (частично)
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.state$.next(this.state);
  }

  // Обновить конкретную задачу
  updateTask(projectId, taskId, done) {
    const projects = this.state.projects.map(project => {
      if (project.id !== projectId) return project;
      const tasks = project.tasks.map(task =>
        task.id === taskId ? { ...task, done } : task
      );
      return { ...project, tasks };
    });
    this.updateState({ projects });
  }

  // Подписка на изменения (можно использовать state$)
  subscribe(callback) {
    return this.state$.subscribe(callback);
  }
}