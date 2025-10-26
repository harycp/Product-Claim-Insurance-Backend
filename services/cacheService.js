const redis = require("../config/redis");

const get = async (key) => {
  const raw = await redis.get(key);
  return raw ? JSON.parse(raw) : null;
};

const set = async (key, value, ttlSec = 120) => {
  await redis.set(key, JSON.stringify(value), "EX", ttlSec);
};

const del = async (key) => {
  await redis.del(key);
};

module.exports = { get, set, del };
