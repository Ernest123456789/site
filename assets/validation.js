/* Проверка форм и отображение ошибок под полями. */
const providerForms = (() => {
  const namePattern = /^[A-Za-zЀ-ӿ][A-Za-zЀ-ӿ .'-]*$/;
  const housePattern = /^[0-9A-Za-zЀ-ӿ\/-]+$/;

  function personName(v, full) {
    v = v.replace(/\s+/g, ' ');
    if (v === '') return full ? 'Введите ФИО.' : 'Введите имя.';
    if (v.length < (full ? 5 : 2)) return full ? 'ФИО должно содержать не менее 5 символов.' : 'Имя должно содержать не менее 2 символов.';
    if (v.length > 100) return 'Не более 100 символов.';
    if (!namePattern.test(v)) return 'Допустимы только буквы, пробел, точка, дефис и апостроф.';
    if (full && v.split(' ').length < 2) return 'Укажите фамилию и имя.';
    return '';
  }

  function phone(v) {
    if (v === '') return 'Введите телефон.';
    const digits = v.replace(/\D/g, '');
    const validLength = digits.length === 10 || (digits.length === 11 && /^[78]/.test(digits));
    if (!/^[\d\s()+\-]+$/.test(v) || !validLength) return 'Введите телефон в формате +7 (900) 123-45-67.';
    return '';
  }

  const rules = {
    full_name: value => personName(value, true),
    name: value => personName(value, false),
    login(v) {
      if (v === '') return 'Введите логин.';
      if (v.length < 3) return 'Логин должен содержать не менее 3 символов.';
      if (v.length > 50) return 'Логин должен содержать не более 50 символов.';
      if (!/^[A-Za-z0-9_.@-]+$/.test(v)) return 'Логин может содержать только латинские буквы, цифры и символы _ . @ -';
      return '';
    },
    login_password(v) {
      if (v === '') return 'Введите пароль.';
      if (v.length < 6) return 'Пароль должен содержать не менее 6 символов.';
      if (v.length > 72) return 'Пароль должен содержать не более 72 символов.';
      return '';
    },
    email(v) {
      if (v === '') return 'Введите e-mail.';
      if (v.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Введите корректный e-mail, например name@example.ru.';
      return '';
    },
    phone,
    password(v, form) {
      if (v === '') return 'Придумайте пароль.';
      if (v.length < 8) return 'Пароль должен содержать не менее 8 символов.';
      if (v.length > 72) return 'Пароль должен содержать не более 72 символов.';
      if (!/[A-Za-zЀ-ӿ]/.test(v) || !/\d/.test(v)) return 'Пароль должен содержать буквы и цифры.';
      const login = form.elements.login.value.trim().toLowerCase();
      if (login === v.toLowerCase()) return 'Пароль не должен совпадать с логином.';
      return '';
    },
    password2(v, form) {
      if (v === '') return 'Повторите пароль.';
      return v !== form.elements.password.value ? 'Пароли не совпадают.' : '';
    },
    agree: (value, form, field) => field.checked ? '' : 'Необходимо согласие на обработку персональных данных.',
    street(v) {
      v = v.replace(/\s+/g, ' ');
      if (v === '') return 'Укажите улицу.';
      return v.length < 3 || v.length > 100 ? 'Название улицы — от 3 до 100 символов.' : '';
    },
    house(v) {
      if (v === '') return 'Укажите номер дома.';
      return v.length > 10 || !housePattern.test(v) ? 'Номер дома: цифры и буквы, не более 10 символов.' : '';
    },
    flat(v) {
      return v && (v.length > 10 || !housePattern.test(v)) ? 'Номер квартиры: цифры и буквы, не более 10 символов.' : '';
    },
    property_type_id: value => value ? '' : 'Выберите тип помещения.',
    tariff_id: value => value ? '' : 'Выберите тариф.',
    method: value => value ? '' : 'Выберите способ оплаты.',
    status: value => value ? '' : 'Выберите статус.',
    amount(v) {
      v = v.replace(/\s/g, '').replace(',', '.');
      if (v === '') return 'Введите сумму.';
      if (!/^\d+(\.\d{1,2})?$/.test(v)) return 'Сумма — число, не более двух знаков после запятой.';
      if (parseFloat(v) < 50) return 'Минимальная сумма пополнения — 50 ₽.';
      if (parseFloat(v) > 15000) return 'Максимальная сумма пополнения — 15 000 ₽.';
      return '';
    },
    subject(v) {
      v = v.replace(/\s+/g, ' ');
      if (v === '') return 'Укажите тему обращения.';
      if (v.length < 5) return 'Тема должна содержать не менее 5 символов.';
      return v.length > 150 ? 'Тема должна содержать не более 150 символов.' : '';
    },
    message(v) {
      if (v === '') return 'Опишите проблему.';
      if (v.length < 10) return 'Опишите проблему подробнее (не менее 10 символов).';
      return v.length > 1000 ? 'Сообщение должно содержать не более 1000 символов.' : '';
    },
    answer(v) {
      if (v === '') return 'Введите ответ абоненту.';
      if (v.length < 5) return 'Ответ должен содержать не менее 5 символов.';
      return v.length > 1000 ? 'Ответ должен содержать не более 1000 символов.' : '';
    }
  };

  function show(field, message) {
    const box = field.form.querySelector(`.ferr[data-for="${field.name}"]`) || document.getElementById(`${field.name}-err`);
    if (box) box.textContent = message;
    field.classList.toggle('err', Boolean(message));
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function check(field) {
    // Имя в HTML (name) совпадает с именем проверки в rules.
    if (!Object.hasOwn(rules, field.name)) return true;
    let rule = rules[field.name];
    if (field.name === 'password' && field.form.id === 'login-form') rule = rules.login_password;

    const value = field.type === 'password' ? field.value : field.value.trim();
    const message = rule(value, field.form, field);
    show(field, message);
    return message === '';
  }

  function validate(form) {
    let firstError;
    for (const field of form.elements) {
      if (!check(field) && !firstError) firstError = field;
    }
    if (firstError) firstError.focus();
    return !firstError;
  }

  // Один обработчик для всех полей, в том числе в новых карточках обращений.
  function checkOnEdit(event) {
    const field = event.target;
    if (!field.form?.classList.contains('vform') || !Object.hasOwn(rules, field.name)) return;
    if (event.type === 'focusout') {
      if (field.value && field.type !== 'checkbox') check(field);
      return;
    }
    if (field.classList.contains('err') || event.type === 'change') check(field);
    if (field.name === 'password') {
      const repeat = field.form.elements.password2;
      if (repeat?.classList.contains('err')) check(repeat);
    }
  }

  return { validate, checkOnEdit, show };
})();
