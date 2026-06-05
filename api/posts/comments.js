import { faker } from '@faker-js/faker';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { postId } = req.query;
  const comments = Array.from({ length: 3 }, () => ({
    id: faker.string.uuid(),
    post_id: parseInt(postId),
    author_id: faker.string.uuid(),
    author: faker.person.fullName(),
    avatar: faker.image.avatar(),
    content: faker.lorem.sentence({ min: 5, max: 15 }),
    created: faker.date.recent({ days: 2 }).getTime(),
  }));

  res.status(200).json({ status: 'ok', data: comments });
}