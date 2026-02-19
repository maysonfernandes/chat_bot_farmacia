const { cache } = require('./cache.service');
const { rateLimite } = require('../config/env');

module.exports = (user) => {
  const key = `rate:${user}`;
  const count = cache.get(key) || 0;

  if (count >= rateLimite) return false;

  cache.set(key, count + 1, 60_000);
  return true;
};
