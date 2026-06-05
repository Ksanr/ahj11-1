import { faker } from '@faker-js/faker';

export default function handler(req, res) {
  // CORS-заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Обрабатываем preflight-запрос (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  // Имитация задержки сети
  setTimeout(() => {
    // Генерируем от 1 до 3 случайных сообщений
    const count = faker.number.int({ min: 1, max: 3 });
    const messages = Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      from: faker.internet.email(),
      subject: faker.lorem.sentence({ min: 3, max: 8 }),
      body: faker.lorem.paragraph(),
      received: faker.date.recent({ days: 7 }).getTime() / 1000, // timestamp в секундах
    }));

    res.status(200).json({
      status: 'ok',
      timestamp: Math.floor(Date.now() / 1000),
      messages,
    });
  }, 300); // небольшая задержка для имитации реальной сети
}