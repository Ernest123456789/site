/* Разметка страниц и форматирование данных для вывода. */
const providerViews = (() => {
  const rubles = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const methods = { card: 'Банковская карта', sbp: 'СБП', office: 'В офисе' };
  const paymentStatuses = { success: ['Успешно', 'b-ok'], pending: ['В обработке', 'b-wip'], failed: ['Ошибка', 'b-bad'] };
  const serviceStatuses = { active: ['Активна', 'b-ok'], suspended: ['Приостановлена', 'b-wip'], disconnected: ['Отключена', 'b-bad'] };
  const applicationStatuses = { new: ['Новая', 'b-new'], in_progress: ['В обработке', 'b-wip'], connected: ['Подключено', 'b-ok'], rejected: ['Отклонена', 'b-bad'] };
  const appealStatuses = { open: ['Открыто', 'b-new'], in_progress: ['В работе', 'b-wip'], closed: ['Закрыто', 'b-ok'] };
  const tariffSorts = { popular: 'Сначала популярные', price_asc: 'Сначала дешёвые', price_desc: 'Сначала дорогие', speed_desc: 'По скорости' };

  function escape(value) {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value ?? '').replace(/[&<>"']/g, char => entities[char]);
  }

  function lines(value) {
    return escape(value).replace(/\r?\n/g, '<br>');
  }

  function money(value) {
    return `${rubles.format(value)}\u00a0₽`;
  }

  function dateTime(value) {
    const [year, month, day] = value.slice(0, 10).split('-');
    const time = value.slice(11, 16);
    return `${day}.${month}.${year}${time ? ` ${time}` : ''}`;
  }

  function badge(statuses, code) {
    const [name, css] = statuses[code];
    return `<span class="badge ${css}">${name}</span>`;
  }

  function options(entries, selected) {
    return entries.map(([value, label]) => `<option value="${escape(value)}"${String(value) === String(selected) ? ' selected' : ''}>${escape(Array.isArray(label) ? label[0] : label)}</option>`).join('');
  }

  function field(label, name, config = {}) {
    const { type = 'text', value = '', entries = [], attrs = {}, hint = '' } = config;
    const extras = Object.entries(attrs).map(([key, attr]) => attr === true ? ` ${key}` : ` ${key}="${escape(attr)}"`).join('');
    const attributes = `id="${name}" name="${name}" aria-describedby="${name}-err"${extras}`;
    const labelHtml = `<label class="f" for="${name}">${label}</label>`;
    let input;
    if (type === 'checkbox') input = `<label class="chk"><input type="checkbox" value="1" ${attributes}><span>${label}</span></label>`;
    else if (type === 'select') input = `${labelHtml}<select class="in" ${attributes}><option value="">Выберите…</option>${options(entries, value)}</select>`;
    else if (type === 'textarea') input = `${labelHtml}<textarea class="in" ${attributes}>${escape(value)}</textarea>`;
    else input = `${labelHtml}<input class="in" type="${type}" value="${escape(value)}" ${attributes}>`;
    return `<div class="fld">${input}${hint ? `<div class="hint">${escape(hint)}</div>` : ''}<div class="ferr" id="${name}-err"></div></div>`;
  }

  function heading(title, subtitle) {
    return `<h1>${escape(title)}</h1><p class="sub">${subtitle}</p>`;
  }

  function notice(type, message) {
    return `<div class="alert alert-${type}" role="alert">${escape(message)}</div>`;
  }

  function navigation(user, active) {
    const links = [['tariffs', 'Тарифы'], ['connect', 'Подключение']];
    if (user?.role === 'subscriber') links.push(['cabinet', 'Кабинет'], ['topup', 'Оплата'], ['appeals', 'Обращения']);
    if (user?.role === 'admin') links.push(['admin', 'Заявки'], ['admin_appeals', 'Обращения']);
    return `<header class="top"><div class="wrap row"><input type="checkbox" id="burger" aria-hidden="true">
      <a class="logo" href="#/"><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle class="dot" cx="12" cy="19" r="2.1"/></svg></i>ИнтерАлекс</a>
      <div class="navwrap"><nav class="main">${links.map(([path, label]) => `<a href="#/${path}"${path === active ? ' class="act"' : ''}>${label}</a>`).join('')}</nav></div>
      ${user ? `<div class="usermenu"><span class="uname">${escape(user.full_name)}<small>${user.role === 'admin' ? 'Администратор' : 'Абонент'}</small></span>
        <form method="post" data-action="logout"><button class="btn ghost sm" type="submit">Выйти</button></form></div>` : '<a class="btn sm" href="#/login">Личный кабинет</a>'}
      <label class="burger-btn" for="burger" aria-label="Меню"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></label>
    </div></header>`;
  }

  function tariffs({ q, maxPrice, minSpeed, sort, onlyTv, filtered, items, total }) {
    const cards = items.map(t => `<div class="card tariff${t.is_popular ? ' pop' : ''}">
      ${t.is_popular ? '<span class="tag">Популярный</span>' : ''}
      <h3>${escape(t.name)}</h3><div class="speed">${t.speed_mbps} <small>Мбит/с</small></div>
      <p class="desc">${escape(t.description)}</p><ul><li>Безлимитный интернет</li>
      ${t.tv_channels > 0 ? `<li>${t.tv_channels} телеканалов</li>` : ''}
      <li>Оборудование: ${t.equipment_cost > 0 ? money(t.equipment_cost) : 'бесплатно'}</li></ul>
      <div class="price">${money(t.price)} <small>/ мес.</small></div>
      <div class="year">За первый год: <b>${money(t.price * 12 + t.equipment_cost)}</b></div>
      <a class="btn" href="#/connect?tariff=${t.id}">Подключить</a></div>`).join('');
    return `<main class="wrap cab">${heading('Тарифы', 'Найдите подходящий тариф: задайте поиск и фильтры')}
      <form class="card filters" method="get" data-action="tariffs"><div class="fgrid">
        <div class="fld"><label class="f" for="q">Поиск</label><input class="in" id="q" name="q" type="search" maxlength="60" value="${escape(q)}" placeholder="Название или описание"></div>
        <div class="fld"><label class="f" for="max_price">Цена до, ₽/мес.</label><input class="in" id="max_price" name="max_price" type="number" min="0" max="100000" step="50" value="${maxPrice || ''}" placeholder="любая"></div>
        <div class="fld"><label class="f" for="min_speed">Скорость</label><select class="in" id="min_speed" name="min_speed"><option value="0">любая</option>${options([100, 300, 500].map(speed => [speed, `от ${speed} Мбит/с`]), minSpeed)}</select></div>
        <div class="fld"><label class="f" for="sort">Сортировка</label><select class="in" id="sort" name="sort">${options(Object.entries(tariffSorts), sort)}</select></div>
      </div><div class="frow">
        <label class="chk inl"><input type="checkbox" name="tv" value="1"${onlyTv ? ' checked' : ''}><span>Только с телевидением</span></label>
        <div class="acts"><button class="btn sm" type="submit">Найти</button>${filtered ? '<a class="btn ghost sm" href="#/tariffs">Сбросить</a>' : ''}</div>
      </div></form>
      <p class="found">Найдено тарифов: <b>${items.length}</b> из ${total}</p>
      ${cards ? `<div class="cards3 tlist">${cards}</div>` : '<div class="card"><h3>Ничего не найдено</h3><p class="muted">Измените условия поиска или <a class="lnk" href="#/tariffs">сбросьте фильтры</a>.</p></div>'}
    </main>`;
  }

  function connect({ user, tariffId, tariffs, types, streets }) {
    const subscriber = user?.role === 'subscriber' ? user : null;
    const entries = tariffs.map(t => [t.id, `${t.name} — ${t.speed_mbps} Мбит/с, ${t.price} ₽/мес.`]);
    return `<main class="wrap cab narrow">${heading('Заявка на подключение', 'Заполните форму — мы проверим адрес и свяжемся с вами')}
      <form id="connect-form" class="card vform" method="post" data-action="connect" novalidate>
      <div class="fgrid">
        ${field('Ваше имя', 'name', { value: subscriber?.full_name, attrs: { maxlength: 100, autocomplete: 'name' } })}
        ${field('Телефон', 'phone', { type: 'tel', value: subscriber?.phone, attrs: { maxlength: 20, autocomplete: 'tel', placeholder: '+7 (900) 123-45-67' } })}
        ${field('Улица', 'street', { attrs: { maxlength: 100, list: 'streets', placeholder: 'например, ул. Ленина' } })}
        ${field('Дом', 'house', { attrs: { maxlength: 10 } })}
        ${field('Квартира (если есть)', 'flat', { attrs: { maxlength: 10 } })}
        ${field('Тип помещения', 'property_type_id', { type: 'select', entries: types.map(t => [t.id, t.title]) })}
      </div>
      <datalist id="streets">${streets.map(street => `<option value="${escape(street)}"></option>`).join('')}</datalist>
      ${field('Тариф', 'tariff_id', { type: 'select', value: tariffId, entries })}
      ${field('Согласен на обработку персональных данных', 'agree', { type: 'checkbox' })}
      <button class="btn" type="submit">Отправить заявку</button></form>
    </main>`;
  }

  function paymentRow(payment) {
    return `<div class="mini"><div class="t"><b>${escape(methods[payment.method] ?? payment.method)}</b><span>${dateTime(payment.paid_at)}</span></div>
      <b class="${payment.status === 'success' ? 'plus' : ''}">${money(payment.amount)}</b>${badge(paymentStatuses, payment.status)}</div>`;
  }

  function balanceCards(sub, extra) {
    return `<div class="stats${extra.length === 1 ? ' three' : ''}">
      <div class="card stat bal"><div class="l">Баланс</div><div class="v">${money(sub.balance)}</div><div class="n">Лицевой счёт ${escape(sub.account_number)}</div></div>
      <div class="card stat"><div class="l">Тариф</div><div class="v sm">${escape(sub.tariff.name)}</div><div class="n">${money(sub.tariff.price)} в месяц</div></div>
      ${extra.join('')}</div>`;
  }

  function cabinet({ user, sub, days, address, payments, items }) {
    const stats = sub && balanceCards(sub, [
      `<div class="card stat"><div class="l">Состояние услуги</div><div class="v sm">${badge(serviceStatuses, sub.status)}</div><div class="n">с ${dateTime(sub.connected_at)}</div></div>`,
      `<div class="card stat"><div class="l">Скорость</div><div class="v sm">${sub.tariff.speed_mbps} Мбит/с</div><div class="n">безлимитный интернет</div></div>`,
    ]);
    const rows = items.map(a => `<tr><td data-l="№">${a.id}</td><td data-l="Дата">${dateTime(a.created_at)}</td><td data-l="Тариф">${escape(a.tariff.name)}</td>
      <td data-l="Адрес">${escape(a.address)}</td><td data-l="Статус">${badge(applicationStatuses, a.status)}</td></tr>`).join('');
    return `<main class="wrap cab">${heading(`Здравствуйте, ${user.full_name.split(' ')[1] || user.full_name}!`, 'Личный кабинет абонента')}
      ${sub ? `${stats}<div class="two">
        <div class="card"><div class="hd"><h3>Мои данные</h3></div><dl class="kv">
          <dt>ФИО</dt><dd>${escape(user.full_name)}</dd><dt>Логин</dt><dd>${escape(user.login)}</dd>
          <dt>Адрес подключения</dt><dd>${escape(address)}</dd><dt>Лицевой счёт</dt><dd>${escape(sub.account_number)}</dd>
          <dt>Баланс хватит</dt><dd>${days} дн. при оплате тарифа за 30 дней</dd>
        </dl><div class="btns"><a class="btn sm" href="#/topup">Оплатить услуги</a><a class="btn ghost sm" href="#/appeals">Создать обращение</a></div></div>
        <div class="card"><div class="hd"><h3>Последние платежи</h3><a href="#/topup">Все платежи</a></div>
          ${payments.map(paymentRow).join('') || '<p class="muted">Платежей пока нет.</p>'}</div>
      </div>` : '<div class="card"><h3>Договор не найден</h3><p class="muted">К вашей учётной записи пока не подключена услуга. Оставьте заявку на подключение или обратитесь в поддержку.</p></div>'}
      <div class="card"><div class="hd"><h3>История заявок</h3><a href="#/connect">Новая заявка</a></div>
      ${rows ? `<table class="tb resp"><thead><tr><th>№</th><th>Дата</th><th>Тариф</th><th>Адрес</th><th>Статус</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">Заявок пока нет.</p>'}</div>
    </main>`;
  }

  function pager(route, query, page, pages) {
    if (pages <= 1) return '';
    const links = Array.from({ length: pages }, (_, index) => {
      const number = index + 1;
      const params = new URLSearchParams(query);
      if (number === 1) params.delete('page');
      else params.set('page', number);
      return number === page ? `<span class="cur">${number}</span>` : `<a href="#/${route}${params.size ? `?${escape(params.toString())}` : ''}">${number}</a>`;
    });
    return `<nav class="pager" aria-label="Страницы">${links.join('')}</nav>`;
  }

  function noContract(text) {
    return `<div class="card"><h3>Договор не найден</h3><p class="muted">${text} <a class="lnk" href="#/connect">Оставить заявку на подключение</a></p></div>`;
  }

  function topup({ sub, days, items, method, status, query, page, pages }) {
    const dayWord = { one: 'день', few: 'дня', many: 'дней' }[new Intl.PluralRules('ru').select(days)];
    return `<main class="wrap cab">${heading('Оплата услуг', 'Пополнение лицевого счёта и история платежей')}
      ${sub ? `${balanceCards(sub, [`<div class="card stat"><div class="l">Хватит на</div><div class="v sm">${days} ${dayWord}</div><div class="n">при оплате тарифа за 30 дней</div></div>`])}
      <div class="two">
        <form id="topup-form" class="card vform" method="post" data-action="topup" novalidate><div class="hd"><h3>Пополнить счёт</h3></div>
          ${field('Сумма, ₽', 'amount', { attrs: { inputmode: 'decimal', maxlength: 10, placeholder: 'от 50 до 15 000' }, hint: `Рекомендуем: ${money(sub.tariff.price)} — оплата месяца` })}
          ${field('Способ оплаты', 'method', { type: 'select', entries: [['card', methods.card], ['sbp', methods.sbp]] })}
          <button class="btn" type="submit">Пополнить</button></form>
        <div class="card"><div class="hd"><h3>История платежей</h3></div>
          <form class="tools" method="get" data-action="topup">
            <select class="in" name="method" aria-label="Способ оплаты"><option value="">Все способы</option>${options(Object.entries(methods), method)}</select>
            <select class="in" name="status" aria-label="Статус"><option value="">Все статусы</option>${options(Object.entries(paymentStatuses), status)}</select>
            <button class="btn ghost sm" type="submit">Показать</button></form>
          ${items.map(paymentRow).join('') || '<p class="muted">Платежей не найдено.</p>'}${pager('topup', query, page, pages)}</div>
      </div>` : noContract('К вашей учётной записи пока не подключена услуга.')}
    </main>`;
  }

  function appealSearch(route, q, status, admin) {
    return `<form class="tools" method="get" data-action="${route}">
      <input class="in" type="search" name="q" maxlength="60" value="${escape(q)}" placeholder="${admin ? 'Тема, текст, ФИО, лицевой счёт' : 'Поиск по тексту'}" aria-label="Поиск">
      <select class="in" name="status" aria-label="Статус"><option value="">Все статусы</option>${options(Object.entries(appealStatuses), status)}</select>
      <button class="btn${admin ? '' : ' ghost'} sm" type="submit">Найти</button>
      ${admin && (q || status) ? '<a class="btn ghost sm" href="#/admin_appeals">Сбросить</a>' : ''}</form>`;
  }

  function appealArticle(a, admin) {
    return `<article class="appeal">
      <div class="ah"><b>№${a.id} · ${escape(a.subject)}</b>${badge(appealStatuses, a.status)}</div>
      <div class="muted sm">${admin ? `${escape(a.fullName)} · лицевой счёт ${escape(a.accountNumber)} · ` : ''}${dateTime(a.created_at)}</div>
      <p>${lines(a.message)}</p>
      ${a.answer ? `<div class="answer"><b>${admin ? 'Ответ' : 'Ответ поддержки'}${a.answered_at ? ` · ${dateTime(a.answered_at)}` : ''}</b><br>${lines(a.answer)}</div>` : ''}
      ${admin ? `<form class="vform answerform" method="post" data-action="admin_appeals" novalidate>
        <input type="hidden" name="appeal_id" value="${a.id}">
        <div class="fld"><label class="f" for="answer-${a.id}">${a.answer ? 'Изменить ответ' : 'Ответ абоненту'}</label>
          <textarea class="in" id="answer-${a.id}" name="answer" maxlength="1000" rows="3">${escape(a.answer)}</textarea>
          <div class="ferr" data-for="answer"></div></div>
        <div class="rowform"><select class="in sm" name="status" aria-label="Статус обращения №${a.id}">
          <option value="">Статус…</option>${options([['in_progress', 'В работе'], ['closed', 'Закрыто']], a.status)}</select>
          <button class="btn sm" type="submit">Отправить ответ</button></div><div class="ferr" data-for="status"></div>
      </form>` : ''}</article>`;
  }

  function appeals({ sub, q, status, items }) {
    return `<main class="wrap cab">${heading('Обращения в поддержку', 'Опишите проблему — специалист ответит в этом разделе')}
      ${sub ? `<div class="two">
        <form id="appeal-form" class="card vform" method="post" data-action="appeals" novalidate><div class="hd"><h3>Новое обращение</h3></div>
          ${field('Тема', 'subject', { attrs: { maxlength: 150, placeholder: 'Например: низкая скорость вечером' } })}
          ${field('Сообщение', 'message', { type: 'textarea', attrs: { maxlength: 1000, rows: 5 } })}
          <button class="btn" type="submit">Отправить</button></form>
        <div class="card"><div class="hd"><h3>Мои обращения</h3></div>${appealSearch('appeals', q, status, false)}
        ${items.map(item => appealArticle(item, false)).join('') || '<p class="muted">Обращений не найдено.</p>'}</div>
      </div>` : noContract('Обращения доступны абонентам с подключённой услугой.')}
    </main>`;
  }

  function admin({ stats, items, q, status, tariff, tariffs, from, to, filtered, total, query, page, pages }) {
    const statusOptions = Object.entries(applicationStatuses);
    const rows = items.map(a => `<tr><td data-l="№">${a.id}</td><td data-l="Дата">${dateTime(a.created_at)}</td>
      <td data-l="Заявитель"><div class="rt"><b>${escape(a.name)}</b><br><span class="muted sm">${escape(a.phone)}</span></div></td>
      <td data-l="Адрес"><div class="rt">${escape(a.address)}${a.coverage_ok ? '' : '<br><span class="muted sm">нет тех. возможности</span>'}</div></td>
      <td data-l="Тариф">${escape(a.tariff.name)}</td><td data-l="Статус">${badge(applicationStatuses, a.status)}</td>
      <td class="actc"><form class="rowform" method="post" data-action="admin"><input type="hidden" name="application_id" value="${a.id}">
        <select class="in sm" name="status" aria-label="Статус заявки №${a.id}">${options(statusOptions, a.status)}</select>
        <input class="in sm" name="comment" maxlength="300" value="${escape(a.admin_comment)}" placeholder="Комментарий" aria-label="Комментарий к заявке №${a.id}">
        <button class="btn ghost sm" type="submit">Сохранить</button></form></td></tr>`).join('');
    const bars = stats.topTariffs.map(({ name, count }) => `<div class="bar"><span>${escape(name)}</span><i style="width:${Math.round(count / stats.topTariffs[0].count * 100)}%"></i><b>${count}</b></div>`).join('');
    return `<main class="wrap cab">${heading('Заявки на подключение', 'Панель администратора')}
      <div class="stats">
        <div class="card stat"><div class="l">Новые заявки</div><div class="v">${stats.counts.new}</div><div class="n">ожидают обработки</div></div>
        <div class="card stat"><div class="l">В обработке</div><div class="v">${stats.counts.in_progress}</div><div class="n">ожидают мастера</div></div>
        <div class="card stat"><div class="l">Подключено</div><div class="v">${stats.counts.connected}</div><div class="n">из ${stats.all} заявок (${stats.conversion}%)</div></div>
        <div class="card stat"><div class="l">Открытые обращения</div><div class="v">${stats.appeals}</div><div class="n"><a class="lnk" href="#/admin_appeals">перейти к обращениям</a></div></div>
      </div><div class="two">
        <div class="card"><div class="hd"><h3>Статистика</h3></div><dl class="kv wide">
          <dt>Активных абонентов</dt><dd>${stats.subs}</dd><dt>Выручка за всё время</dt><dd>${money(stats.revenue)}</dd>
          <dt>Выручка за этот месяц</dt><dd>${money(stats.month)}</dd><dt>Средняя цена тарифа абонента</dt><dd>${money(stats.avgPrice)}</dd>
          <dt>Доля подключённых заявок</dt><dd>${stats.conversion}%</dd></dl></div>
        <div class="card"><div class="hd"><h3>Популярные тарифы</h3></div>${bars || '<p class="muted">Заявок пока нет.</p>'}</div>
      </div><div class="card"><div class="hd"><h3>Заявки</h3></div>
        <form class="filters" method="get" data-action="admin"><div class="fgrid f5">
          <div class="fld"><label class="f" for="q">Поиск</label><input class="in" id="q" name="q" type="search" maxlength="60" value="${escape(q)}" placeholder="№, имя, телефон, адрес"></div>
          <div class="fld"><label class="f" for="status">Статус</label><select class="in" id="status" name="status"><option value="">Все</option>${options(statusOptions, status)}</select></div>
          <div class="fld"><label class="f" for="tariff">Тариф</label><select class="in" id="tariff" name="tariff"><option value="0">Все</option>${options(tariffs.map(t => [t.id, t.name]), tariff)}</select></div>
          <div class="fld"><label class="f" for="from">Дата с</label><input class="in" id="from" name="from" type="date" value="${from}"></div>
          <div class="fld"><label class="f" for="to">Дата по</label><input class="in" id="to" name="to" type="date" value="${to}"></div>
        </div><div class="acts"><button class="btn sm" type="submit">Применить</button>${filtered ? '<a class="btn ghost sm" href="#/admin">Сбросить</a>' : ''}</div></form>
        <p class="found">Найдено заявок: <b>${total}</b></p>
        ${rows ? `<table class="tb resp"><thead><tr><th>№</th><th>Дата</th><th>Заявитель</th><th>Адрес</th><th>Тариф</th><th>Статус</th><th>Изменить</th></tr></thead><tbody>${rows}</tbody></table>${pager('admin', query, page, pages)}` : '<p class="muted">По заданным условиям заявок нет.</p>'}
      </div></main>`;
  }

  function adminAppeals({ q, status, items, total, query, page, pages }) {
    return `<main class="wrap cab">${heading('Обращения абонентов', 'Панель администратора')}
      <div class="card">${appealSearch('admin_appeals', q, status, true)}
        <p class="found">Найдено обращений: <b>${total}</b></p>
        ${items.map(item => appealArticle(item, true)).join('') || '<p class="muted">Обращений не найдено.</p>'}
        ${pager('admin_appeals', query, page, pages)}
      </div></main>`;
  }

  return { tariffs, connect, cabinet, topup, appeals, admin, admin_appeals: adminAppeals,
    navigation, notice, money, methods, tariffSorts, paymentStatuses, applicationStatuses, appealStatuses };
})();
