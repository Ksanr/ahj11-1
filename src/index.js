import { initPollingWidget } from './tasks/task1.js';
import './styles.css';

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    const div = document.createElement('div');
    div.id = 'app';
    document.body.append(div);
  }
  initPollingWidget(document.getElementById('app'));
});