/* Хранение учебных данных и локальный вход. */
const providerStorage = (() => {
  const dataKey = 'interalex:data:v1';
  const userKey = 'interalex:user:v1';
  const encoder = new TextEncoder();

  function read() {
    const saved = localStorage.getItem(dataKey);
    if (saved !== null) return JSON.parse(saved);
    const initial = JSON.stringify(providerSeed);
    localStorage.setItem(dataKey, initial);
    return JSON.parse(initial);
  }

  function currentUser(state) {
    const id = Number(localStorage.getItem(userKey));
    return state.users.find(user => user.id === id && user.is_active) || null;
  }

  function setUser(id) {
    if (id === null) localStorage.removeItem(userKey);
    else localStorage.setItem(userKey, String(id));
  }

  // Связанные изменения, например платёж и баланс, сохраняются одной записью.
  function update(change) {
    function save() {
      const state = read();
      const result = change(state, currentUser(state));
      localStorage.setItem(dataKey, JSON.stringify(state));
      return result;
    }
    if (navigator.locks) return navigator.locks.request(dataKey, save);
    return save();
  }

  function nextId(items) {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }

  function toHex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function hashPassword(password, salt) {
    // Параметры должны совпадать с теми, которыми сделаны учебные аккаунты.
    const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bytes = Uint8Array.from(salt.match(/../g), pair => parseInt(pair, 16));
    const result = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: bytes, iterations: 100_000 }, key, 256);
    return toHex(new Uint8Array(result));
  }

  function createSalt() {
    return toHex(crypto.getRandomValues(new Uint8Array(16)));
  }

  return { read, currentUser, setUser, update, nextId, hashPassword, createSalt, userKey };
})();
