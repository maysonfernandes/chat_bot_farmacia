const cache = new Map();   // cache com TTL (rateLimit, etc)
const state = new Map();   // estado do usuário (fluxos do bot)

module.exports = {
  cache: {
    get(key) {
      const item = cache.get(key);
      if (!item || item.expires < Date.now()) return null;
      return item.value;
    },

    set(key, value, ttl = 300000) {
      cache.set(key, {
        value,
        expires: Date.now() + ttl
      });
    }
  },

  state: {
    get(user) {
      return state.get(user) || null;
    },

    set(user, value) {
      state.set(user, value);
    },

    clear(user) {
      state.delete(user);
    }
  }
};
