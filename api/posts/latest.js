import { faker } from '@faker-js/faker';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const posts = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    author_id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    author: faker.person.fullName(),
    avatar: faker.image.avatar(),
    image: `https://picsum.photos/seed/${i + 1}/300/200`,
    created: faker.date.recent({ days: 7 }).getTime(),
  }));

  res.status(200).json({ status: 'ok', data: posts });
}