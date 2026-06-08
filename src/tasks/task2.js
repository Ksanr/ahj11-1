import { from, forkJoin, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const API_BASE = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}` : '';

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fetchPosts() {
  return ajax.getJSON(`${API_BASE}/api/posts/latest`).pipe(
    tap(response => console.log('Ответ /posts/latest:', response)),
    map(response => response.data || response || []),
    catchError(error => {
      console.error('Ошибка загрузки постов:', error);
      return of([]);
    })
  );
}

function fetchCommentsForPost(post) {
  const url = `${API_BASE}/api/posts/comments?postId=${post.id}`;
  console.log(`Загружаем комментарии для поста ${post.id}: ${url}`);
  return ajax.getJSON(url).pipe(
    map(response => ({ ...post, comments: response.data })),
    catchError(error => {
      console.error(`Ошибка загрузки комментариев для поста ${post.id}:`, error);
      return from([{ ...post, comments: [] }]);
    })
  );
}

function createCommentElement(comment) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';

  const avatar = document.createElement('img');
  avatar.src = comment.avatar || 'https://via.placeholder.com/32';
  avatar.className = 'comment-avatar';
  avatar.alt = 'Аватар';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'comment-content';

  const authorSpan = document.createElement('span');
  authorSpan.className = 'comment-author';
  authorSpan.textContent = comment.author || 'Аноним';

  const textSpan = document.createElement('span');
  textSpan.className = 'comment-text';
  textSpan.textContent = comment.content || comment.text || '';

  const dateSpan = document.createElement('span');
  dateSpan.className = 'comment-date';
  dateSpan.textContent = comment.created ? formatDate(comment.created) : '';

  contentDiv.append(authorSpan, textSpan, dateSpan);
  commentDiv.append(avatar, contentDiv);
  return commentDiv;
}

function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post';

  // Шапка
  const header = document.createElement('div');
  header.className = 'post-header';

  const avatar = document.createElement('img');
  avatar.src = post.avatar || 'https://via.placeholder.com/48';
  avatar.className = 'avatar';
  avatar.alt = 'Аватар';

  const authorInfo = document.createElement('div');
  authorInfo.className = 'author-info';

  const authorName = document.createElement('span');
  authorName.className = 'author-name';
  authorName.textContent = post.author || 'Неизвестный автор';

  const postDate = document.createElement('span');
  postDate.className = 'post-date';
  postDate.textContent = post.created ? formatDate(post.created) : '';

  authorInfo.append(authorName, postDate);
  header.append(avatar, authorInfo);

  // Заголовок
  const title = document.createElement('h3');
  title.className = 'post-title';
  title.textContent = post.title || 'Без заголовка';

  // Изображение
  const image = document.createElement('img');
  image.src = post.image || 'https://via.placeholder.com/300x200';
  image.className = 'post-image';
  image.alt = 'Изображение поста';

  // Комментарии
  const commentsBlock = document.createElement('div');
  commentsBlock.className = 'comments';

  const commentsTitle = document.createElement('div');
  commentsTitle.className = 'comments-title';
  commentsTitle.textContent = `Комментарии (${post.comments?.length || 0})`;
  commentsBlock.append(commentsTitle);

  if (post.comments && post.comments.length) {
    post.comments.forEach(comment => {
      commentsBlock.append(createCommentElement(comment));
    });
  } else {
    const noComments = document.createElement('div');
    noComments.className = 'no-comments';
    noComments.textContent = 'Нет комментариев';
    commentsBlock.append(noComments);
  }

  postDiv.append(header, title, image, commentsBlock);
  return postDiv;
}

function renderPosts(postsWithComments, container) {
  container.innerHTML = '';
  if (!postsWithComments.length) {
    container.innerHTML = '<div class="error">Посты не найдены</div>';
    return;
  }
  postsWithComments.forEach(post => {
    container.append(createPostElement(post));
  });
}

export function initPostsWidget(container) {
  container.innerHTML = '<div class="loading">Загрузка постов...</div>';

  const subscription = fetchPosts()
    .pipe(
      switchMap(posts => {
        if (!posts.length) return of([]);
        const postsWithComments$ = posts.map(post => fetchCommentsForPost(post));
        return forkJoin(postsWithComments$);
      })
    )
    .subscribe({
      next: postsWithComments => {
        renderPosts(postsWithComments, container);
      },
      error: err => {
        console.error('Необработанная ошибка:', err);
        container.innerHTML = '<div class="error">Произошла ошибка. Проверьте консоль.</div>';
      }
    });

  // Возвращаем функцию очистки
  return {
    destroy() {
      subscription.unsubscribe();
      console.log('Задача 2: подписка отключена');
    }
  };
}