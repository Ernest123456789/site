/* Навигация, фильтрация и действия пользователя. */
(() => {
  'use strict';

  const pageNode = document.querySelector('#page');
  const views = providerViews;
  const store = providerStorage;
  const { tariffs, coverage_addresses: coverage, property_types: types } = providerCatalog;
  const activeTariffs = tariffs.filter(tariff => tariff.is_active);
  const loginKey = 'interalex:login-attempts:v1';
  const pages = {
    login: { title: 'Вход в личный кабинет', template: 'login-page' },
    register: { title: 'Регистрация', template: 'register-page' },
    tariffs: { title: 'Тарифы', load: tariffPage },
    connect: { title: 'Подключение', load: connectPage },
    cabinet: { title: 'Личный кабинет абонента', load: cabinetPage, role: 'subscriber' },
    topup: { title: 'Оплата услуг', load: topupPage, role: 'subscriber' },
    appeals: { title: 'Обращения', load: appealsPage, role: 'subscriber' },
    admin: { title: 'Панель администратора', load: adminPage, role: 'admin' },
    admin_appeals: { title: 'Обращения абонентов', load: adminAppealsPage, role: 'admin' },
  };
  let submitting = false;

  function home(user) {
    return user ? (user.role === 'admin' ? 'admin' : 'cabinet') : 'login';
  }

  function readRoute() {
    const address = location.hash.slice(2);
    const questionMark = address.indexOf('?');
    if (questionMark === -1) return { route: address, query: new URLSearchParams() };
    return { route: address.slice(0, questionMark), query: new URLSearchParams(address.slice(questionMark + 1)) };
  }

  // Адрес после # позволяет открывать все разделы из одного index.html.
  function openPage(route, { query, notices = [], replace = false } = {}) {
    const address = `#/${route}${query?.size ? `?${query}` : ''}`;
    if (replace) history.replaceState(null, '', address);
    else if (location.hash !== address) history.pushState(null, '', address);
    render(notices);
  }

  function now() {
    const date = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value ? value : '';
  }

  function folded(value) {
    return value.toLowerCase().replaceAll('ё', 'е');
  }

  function matches(q, ...values) {
    const word = folded(q);
    return !word || values.some(value => folded(String(value)).includes(word));
  }

  function newest(field) {
    return (a, b) => b[field].localeCompare(a[field]) || b.id - a.id;
  }

  function subscribed(state, user) {
    return state.subscribers.find(sub => sub.user_id === user.id);
  }

  function tariffFor(id) {
    return tariffs.find(tariff => tariff.id === id);
  }

  function pagesFor(items, size, query) {
    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / size));
    const page = Math.min(pages, Math.max(1, parseInt(query.get('page'), 10) || 1));
    return { items: items.slice((page - 1) * size, page * size), total, query, page, pages };
  }

  function allowed(query, name, choices, fallback = '') {
    const value = query.get(name);
    return Object.hasOwn(choices, value) ? value : fallback;
  }

  function tariffPage({ query }) {
    const q = (query.get('q') || '').trim().slice(0, 60);
    const maxPrice = Math.max(0, Math.min(100000, parseInt(query.get('max_price'), 10) || 0));
    const speed = Number(query.get('min_speed'));
    const minSpeed = [100, 300, 500].includes(speed) ? speed : 0;
    const onlyTv = Boolean(query.get('tv') && query.get('tv') !== '0');
    const sort = allowed(query, 'sort', views.tariffSorts, 'popular');
    const compare = {
      popular: (a, b) => b.is_popular - a.is_popular || a.price - b.price,
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      speed_desc: (a, b) => b.speed_mbps - a.speed_mbps || a.price - b.price,
    };
    const items = activeTariffs.filter(t => matches(q, t.name, t.description)
      && (!maxPrice || t.price <= maxPrice) && t.speed_mbps >= minSpeed && (!onlyTv || t.tv_channels > 0)).sort(compare[sort]);
    const filtered = Boolean(q || maxPrice || minSpeed || onlyTv || sort !== 'popular');
    return { q, maxPrice, minSpeed, sort, onlyTv, filtered, items, total: activeTariffs.length };
  }

  function connectPage({ user, query }) {
    const streets = [...new Set(coverage.map(address => address.street))].sort((a, b) => a.localeCompare(b, 'ru'));
    return { user, tariffId: Number(query.get('tariff')), tariffs: [...activeTariffs].sort((a, b) => a.price - b.price), types, streets };
  }

  function account(state, user) {
    const subscriber = subscribed(state, user);
    if (!subscriber) return { sub: null, days: 0, payments: [] };
    const sub = { ...subscriber, tariff: tariffFor(subscriber.tariff_id) };
    const days = sub.tariff.price > 0 && sub.balance > 0 ? Math.floor(sub.balance / (sub.tariff.price / 30)) : 0;
    const payments = state.payments.filter(payment => payment.subscriber_id === sub.id).sort(newest('paid_at'));
    return { sub, days, payments };
  }

  function cabinetPage({ state, user }) {
    const { sub, days, payments } = account(state, user);
    const address = sub && coverage.find(item => item.id === sub.address_id);
    const items = state.applications.filter(a => a.user_id === user.id).sort(newest('created_at'))
      .map(a => ({ ...a, tariff: tariffFor(a.tariff_id) }));
    return { user, sub, days, address: address && `${address.street}, ${address.house}${sub.flat ? `, кв. ${sub.flat}` : ''}`, payments: payments.slice(0, 5), items };
  }

  function topupPage({ state, user, query }) {
    const { sub, days, payments } = account(state, user);
    const method = allowed(query, 'method', views.methods);
    const status = allowed(query, 'status', views.paymentStatuses);
    const items = payments.filter(payment => (!method || payment.method === method) && (!status || payment.status === status));
    return { sub, days, method, status, ...pagesFor(items, 8, query) };
  }

  function appealsPage({ state, user, query }) {
    const sub = subscribed(state, user);
    const q = (query.get('q') || '').trim().slice(0, 60);
    const status = allowed(query, 'status', views.appealStatuses);
    const items = state.appeals.filter(a => a.subscriber_id === sub?.id && matches(q, a.subject, a.message)
      && (!status || a.status === status)).sort(newest('created_at'));
    return { sub, q, status, items };
  }

  function adminAppealsPage({ state, query }) {
    const q = (query.get('q') || '').trim().slice(0, 60);
    const status = allowed(query, 'status', views.appealStatuses);
    const byDate = newest('created_at');
    const items = state.appeals.map(a => {
      const sub = state.subscribers.find(item => item.id === a.subscriber_id);
      const user = state.users.find(item => item.id === sub.user_id);
      return { ...a, fullName: user.full_name, accountNumber: sub.account_number };
    }).filter(a => (!status || a.status === status) && matches(q, a.subject, a.message, a.fullName, a.accountNumber))
      .sort((a, b) => Number(a.status === 'closed') - Number(b.status === 'closed') || byDate(a, b));
    return { q, status, ...pagesFor(items, 8, query) };
  }

  function statistics(state) {
    const counts = { new: 0, in_progress: 0, connected: 0, rejected: 0 };
    const tariffCounts = new Map();
    for (const app of state.applications) {
      counts[app.status] += 1;
      tariffCounts.set(app.tariff_id, (tariffCounts.get(app.tariff_id) || 0) + 1);
    }
    const topTariffs = Array.from(tariffCounts, ([id, count]) => ({ name: tariffFor(id).name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ru')).slice(0, 5);
    const all = state.applications.length;
    const active = state.subscribers.filter(sub => sub.status === 'active');
    const successful = state.payments.filter(payment => payment.status === 'success');
    const monthStart = `${now().slice(0, 7)}-01`;
    const sum = items => items.reduce((total, payment) => total + payment.amount, 0);
    return {
      counts, all, conversion: all ? Math.round(counts.connected / all * 100) : 0, topTariffs,
      appeals: state.appeals.filter(a => a.status !== 'closed').length, subs: active.length,
      revenue: sum(successful), month: sum(successful.filter(payment => payment.paid_at >= monthStart)),
      avgPrice: active.length ? active.reduce((total, sub) => total + tariffFor(sub.tariff_id).price, 0) / active.length : 0,
    };
  }

  function adminPage({ state, query }) {
    const q = (query.get('q') || '').trim().slice(0, 60);
    const status = allowed(query, 'status', views.applicationStatuses);
    const tariff = Math.max(0, parseInt(query.get('tariff'), 10) || 0);
    const from = validDate(query.get('from'));
    const to = validDate(query.get('to'));
    const items = state.applications.filter(a => matches(q, a.name, a.phone, a.address) || (/^\d+$/.test(q) && a.id === Number(q)))
      .filter(a => (!status || a.status === status) && (!tariff || a.tariff_id === tariff)
        && (!from || a.created_at.slice(0, 10) >= from) && (!to || a.created_at.slice(0, 10) <= to))
      .sort(newest('created_at')).map(a => ({ ...a, tariff: tariffFor(a.tariff_id) }));
    return { stats: statistics(state), q, status, tariff, tariffs: [...tariffs].sort((a, b) => a.name.localeCompare(b.name, 'ru')),
      from, to, filtered: Boolean(q || status || tariff || from || to), ...pagesFor(items, 10, query) };
  }

  function render(notices = []) {
    try {
      const state = store.read();
      const user = store.currentUser(state);
      let { route, query } = readRoute();
      let page = Object.hasOwn(pages, route) ? pages[route] : null;

      if (page?.role && page.role !== user?.role) {
        const message = user ? 'У вас нет доступа к этому разделу.' : 'Для доступа в личный кабинет войдите в систему.';
        notices.push(['error', message]);
        page = null;
      } else if (user && page?.template) {
        const suffix = route === 'login' ? ' Чтобы войти под другой учётной записью, сначала выйдите.' : '';
        notices.push(['info', `Вы уже авторизованы как ${user.full_name}.${suffix}`]);
        page = null;
      }

      if (!page) {
        route = home(user);
        page = pages[route];
        query = new URLSearchParams();
        history.replaceState(null, '', `#/${route}`);
      }

      const alerts = notices.map(([type, message]) => `<div class="wrap">${views.notice(type, message)}</div>`).join('');
      document.body.className = page.template ? 'page-auth' : '';
      document.title = `${page.title} — ИнтерАлекс`;
      pageNode.innerHTML = views.navigation(user, route) + alerts;
      if (page.template) {
        const template = document.getElementById(page.template);
        pageNode.append(template.content.cloneNode(true));
      } else {
        const data = page.load({ state, user, query });
        pageNode.insertAdjacentHTML('beforeend', views[route](data));
      }
      const main = pageNode.querySelector('main');
      main.tabIndex = -1;
      (main.querySelector('[autofocus]') || main).focus({ preventScroll: true });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
      pageNode.innerHTML = views.navigation(null, '') + `<main class="wrap cab">${views.notice('error', 'Не удалось загрузить данные сайта. Проверьте, доступно ли локальное хранилище браузера, и обновите страницу.')}</main>`;
    }
  }

  function formError(form, message) {
    pageNode.querySelector('.form-error')?.remove();
    const description = form.closest('main')?.querySelector('.s, .sub');
    if (!description) return;
    description.insertAdjacentHTML('afterend', views.notice('error', message));
    description.nextElementSibling.classList.add('form-error');
  }

  function rateLimit(action, limit) {
    const key = `interalex:rate:${action}:v1`;
    const time = Date.now();
    const recent = JSON.parse(localStorage.getItem(key) || '[]').filter(hit => hit > time - 600_000);
    if (recent.length >= limit) return true;
    localStorage.setItem(key, JSON.stringify([...recent, time]));
    return false;
  }

  function normalizedText(value) {
    return value.trim().replace(/\s+/g, ' ');
  }

  function normalizedPhone(value) {
    const digits = value.replace(/\D/g, '').slice(-10);
    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
  }

  // Обработчики форм. После проверки поля читаются из FormData.
  async function login(form, data) {
    const attempts = JSON.parse(localStorage.getItem(loginKey) || '{"failures":0,"until":0}');
    const seconds = Math.ceil((attempts.until - Date.now()) / 1000);
    if (seconds > 0) return formError(form, `Слишком много неудачных попыток входа. Повторите через ${seconds} сек.`);
    const state = store.read();
    if (store.currentUser(state)) return render();
    const user = state.users.find(item => item.login.toLowerCase() === data.get('login').trim().toLowerCase());
    const hash = await store.hashPassword(data.get('password'), user?.salt || '00000000000000000000000000000000');
    if (store.currentUser(store.read())) return render();
    if (!user || hash !== user.password_hash || !user.is_active) {
      attempts.failures += 1;
      if (attempts.failures >= 5) {
        attempts.failures = 0;
        attempts.until = Date.now() + 60_000;
      }
      localStorage.setItem(loginKey, JSON.stringify(attempts));
      const message = user && hash === user.password_hash ? 'Учётная запись отключена. Обратитесь в службу поддержки.' : 'Неверный логин или пароль.';
      return formError(form, message);
    }
    store.setUser(user.id);
    localStorage.removeItem(loginKey);
    openPage(home(user), { notices: [['success', `Добро пожаловать, ${user.full_name}!`]] });
  }

  async function register(form, data) {
    if (rateLimit('register', 10)) return formError(form, 'Слишком много попыток регистрации. Повторите позже.');
    const login = data.get('login').trim();
    const email = data.get('email').trim().toLowerCase();
    const salt = store.createSalt();
    const hash = await store.hashPassword(data.get('password'), salt);
    const result = await store.update((state, user) => {
      if (user) return { authorized: true };
      const duplicateLogin = state.users.some(item => item.login.toLowerCase() === login.toLowerCase());
      const duplicateEmail = state.users.some(item => item.email.toLowerCase() === email);
      if (duplicateLogin || duplicateEmail) return { duplicateLogin, duplicateEmail };
      state.users.push({ id: store.nextId(state.users), login, email, full_name: normalizedText(data.get('full_name')),
        phone: normalizedPhone(data.get('phone')), role: 'subscriber', created_at: now(), is_active: 1, salt, password_hash: hash });
      return { registered: true };
    });
    if (result.authorized) return render();
    if (!result.registered) {
      if (result.duplicateLogin) providerForms.show(form.elements.login, 'Этот логин уже занят. Выберите другой.');
      if (result.duplicateEmail) providerForms.show(form.elements.email, 'Пользователь с таким e-mail уже зарегистрирован.');
      (result.duplicateLogin ? form.elements.login : form.elements.email).focus();
      return;
    }
    openPage('login', { notices: [['success', 'Регистрация прошла успешно. Теперь войдите, используя свой логин и пароль.']] });
  }

  async function connect(form, data) {
    if (rateLimit('application', 5)) return formError(form, 'Вы отправили слишком много заявок. Повторите позже.');
    const type = types.find(item => item.id === Number(data.get('property_type_id')));
    const tariff = activeTariffs.find(item => item.id === Number(data.get('tariff_id')));
    if (!type || !tariff) return formError(form, 'Выберите тип помещения и тариф.');
    const street = normalizedText(data.get('street'));
    const house = data.get('house').trim();
    const flat = data.get('flat').trim();
    const phone = normalizedPhone(data.get('phone'));
    const covered = coverage.some(a => a.is_available && folded(a.street) === folded(street) && folded(a.house) === folded(house));
    const address = `${street}, ${house}${flat ? `, кв. ${flat}` : ''}`;
    const { id, subscriber } = await store.update((state, user) => {
      const id = store.nextId(state.applications);
      const subscriber = user?.role === 'subscriber';
      state.applications.push({ id, user_id: subscriber ? user.id : null, name: normalizedText(data.get('name')), phone,
        address, property_type_id: type.id, tariff_id: tariff.id, coverage_ok: Number(covered), status: 'new',
        created_at: now(), processed_by: null, admin_comment: null });
      return { id, subscriber };
    });
    const equipment = tariff.equipment_cost > 0 ? views.money(tariff.equipment_cost) : 'бесплатно';
    const message = `Заявка №${id} принята. Тариф «${tariff.name}»: ${views.money(tariff.price)} в месяц, оборудование — ${equipment}. Мы свяжемся с вами по телефону ${phone}.`;
    const notices = [['success', message]];
    if (!covered) notices.push(['info', `По адресу «${address}» пока нет технической возможности подключения. Специалист проверит адрес и предложит варианты.`]);
    openPage(subscriber ? 'cabinet' : 'connect', { notices });
  }

  async function topup(form, data) {
    if (rateLimit('topup', 10)) return formError(form, 'Слишком много платежей за короткое время. Повторите позже.');
    const amount = Number(data.get('amount').replace(/\s/g, '').replace(',', '.'));
    const method = data.get('method');
    if (!['card', 'sbp'].includes(method)) return formError(form, 'Выберите способ оплаты.');
    const saved = await store.update((state, user) => {
      const sub = user?.role === 'subscriber' && subscribed(state, user);
      if (!sub) return false;
      sub.balance = (Math.round(sub.balance * 100) + Math.round(amount * 100)) / 100;
      state.payments.push({ id: store.nextId(state.payments), subscriber_id: sub.id, amount, method, status: 'success', paid_at: now() });
      return true;
    });
    if (!saved) return render();
    const message = `Счёт пополнен на ${views.money(amount)}. Способ оплаты: ${views.methods[method]}.`;
    openPage('topup', { notices: [['success', message]] });
  }

  async function appeal(form, data) {
    if (rateLimit('appeal', 5)) return formError(form, 'Вы отправили слишком много обращений. Повторите позже.');
    const id = await store.update((state, user) => {
      const sub = user?.role === 'subscriber' && subscribed(state, user);
      if (!sub) return null;
      const id = store.nextId(state.appeals);
      state.appeals.push({ id, subscriber_id: sub.id, subject: normalizedText(data.get('subject')), message: data.get('message').trim(),
        status: 'open', created_at: now(), answer: null, answered_by: null, answered_at: null });
      return id;
    });
    if (id === null) return render();
    openPage('appeals', { notices: [['success', `Обращение №${id} отправлено. Ответ появится в этом разделе.`]] });
  }

  async function admin(form, data) {
    const id = Number(data.get('application_id'));
    const status = data.get('status');
    const comment = data.get('comment').trim();
    if (id <= 0 || comment.length > 300 || !Object.hasOwn(views.applicationStatuses, status)) {
      return formError(form, 'Некорректные данные: выберите статус, комментарий — не более 300 символов.');
    }
    const saved = await store.update((state, user) => {
      if (user?.role !== 'admin') return false;
      const app = state.applications.find(item => item.id === id);
      if (!app) return false;
      Object.assign(app, { status, processed_by: user.id, admin_comment: comment || null });
      return true;
    });
    render([saved ? ['success', `Заявка №${id} обновлена.`] : ['error', `Заявка №${id} не найдена.`]]);
  }

  async function adminAppeal(form, data) {
    const id = Number(data.get('appeal_id'));
    const status = data.get('status');
    if (!['in_progress', 'closed'].includes(status)) return formError(form, 'Выберите статус.');
    const saved = await store.update((state, user) => {
      if (user?.role !== 'admin') return false;
      const appeal = state.appeals.find(item => item.id === id);
      if (!appeal) return false;
      Object.assign(appeal, { status, answer: data.get('answer').trim(), answered_by: user.id, answered_at: now() });
      return true;
    });
    render([saved ? ['success', `Ответ на обращение №${id} отправлен.`] : ['error', 'Обращение не найдено.']]);
  }

  function logout() {
    store.setUser(null);
    openPage('login', { replace: true, notices: [['success', 'Вы вышли из личного кабинета.']] });
  }

  const actions = { login, register, connect, topup, appeals: appeal, admin, admin_appeals: adminAppeal, logout };

  for (const event of ['input', 'change', 'focusout']) {
    pageNode.addEventListener(event, providerForms.checkOnEdit);
  }

  pageNode.addEventListener('submit', async event => {
    if (event.defaultPrevented) return;
    event.preventDefault();
    const form = event.target;
    const action = form.dataset.action;
    if (form.getAttribute('method') === 'get') {
      const fields = Array.from(new FormData(form)).filter(([, value]) => value !== '');
      const query = new URLSearchParams(fields);
      openPage(action, { query });
      return;
    }
    if (submitting || !Object.hasOwn(actions, action)) return;
    if (form.classList.contains('vform') && !providerForms.validate(form)) return;
    pageNode.querySelector('.form-error')?.remove();
    submitting = true;
    if (event.submitter) event.submitter.disabled = true;
    try {
      await actions[action](form, new FormData(form));
    } catch (error) {
      console.error(error);
      formError(form, 'Не удалось выполнить действие. Проверьте хранилище браузера и попробуйте снова.');
    } finally {
      submitting = false;
      if (event.submitter) event.submitter.disabled = false;
    }
  });

  window.addEventListener('hashchange', () => render());
  window.addEventListener('storage', event => {
    if (event.key === store.userKey || event.key === null) render();
  });
  render();
})();
