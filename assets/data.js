/* Исходные учебные данные «ИнтерАлекс». */
const providerCatalog = {
  tariffs: [
    {"id": 1, "name": "Старт 50", "speed_mbps": 50, "price": 450.0, "tv_channels": 0, "equipment_cost": 0.0, "description": "Для просмотра сайтов и общения в мессенджерах", "is_popular": 0, "is_active": 1},
    {"id": 2, "name": "Оптимальный 100", "speed_mbps": 100, "price": 550.0, "tv_channels": 0, "equipment_cost": 0.0, "description": "Для семьи: видео, соцсети, работа из дома", "is_popular": 1, "is_active": 1},
    {"id": 3, "name": "Максимальный 300", "speed_mbps": 300, "price": 750.0, "tv_channels": 0, "equipment_cost": 0.0, "description": "Для нескольких устройств и онлайн-игр", "is_popular": 1, "is_active": 1},
    {"id": 4, "name": "Игровой 500", "speed_mbps": 500, "price": 950.0, "tv_channels": 0, "equipment_cost": 500.0, "description": "Минимальные задержки для онлайн-игр и стриминга", "is_popular": 0, "is_active": 1},
    {"id": 5, "name": "Старт ТВ", "speed_mbps": 100, "price": 700.0, "tv_channels": 120, "equipment_cost": 0.0, "description": "Интернет 100 Мбит/с и 120 телеканалов", "is_popular": 1, "is_active": 1},
    {"id": 6, "name": "Семейный ТВ+", "speed_mbps": 300, "price": 1000.0, "tv_channels": 200, "equipment_cost": 500.0, "description": "Интернет 300 Мбит/с и 200 телеканалов", "is_popular": 0, "is_active": 1}
  ],
  coverage_addresses: [
    {"id": 1, "street": "ул. Ленина", "house": "5", "is_available": 1, "note": null},
    {"id": 2, "street": "ул. Ленина", "house": "12", "is_available": 1, "note": null},
    {"id": 3, "street": "ул. Ленина", "house": "24", "is_available": 1, "note": null},
    {"id": 4, "street": "ул. Советская", "house": "3", "is_available": 1, "note": null},
    {"id": 5, "street": "ул. Советская", "house": "15", "is_available": 1, "note": null},
    {"id": 6, "street": "ул. Советская", "house": "40", "is_available": 1, "note": null},
    {"id": 7, "street": "ул. Гагарина", "house": "7", "is_available": 1, "note": null},
    {"id": 8, "street": "ул. Гагарина", "house": "21", "is_available": 1, "note": null},
    {"id": 9, "street": "ул. Революции", "house": "10", "is_available": 1, "note": null},
    {"id": 10, "street": "ул. Революции", "house": "33", "is_available": 1, "note": null},
    {"id": 11, "street": "ул. Фрунзе", "house": "4", "is_available": 1, "note": null},
    {"id": 12, "street": "ул. Фрунзе", "house": "18", "is_available": 1, "note": null},
    {"id": 13, "street": "ул. Королёва", "house": "9", "is_available": 1, "note": null},
    {"id": 14, "street": "ул. Королёва", "house": "30", "is_available": 0, "note": "Подключение запланировано, сроки уточняйте"},
    {"id": 15, "street": "ул. Институтская", "house": "2", "is_available": 1, "note": null},
    {"id": 16, "street": "ул. Институтская", "house": "14", "is_available": 1, "note": null},
    {"id": 17, "street": "Красный пер.", "house": "6", "is_available": 1, "note": null},
    {"id": 18, "street": "Пионерский пер.", "house": "3", "is_available": 0, "note": "Нет технической возможности"},
    {"id": 19, "street": "ул. Менделеева", "house": "8", "is_available": 0, "note": "Подключение запланировано, сроки уточняйте"},
    {"id": 20, "street": "ул. Менделеева", "house": "17", "is_available": 1, "note": null}
  ],
  property_types: [
    {"id": 1, "title": "Квартира"},
    {"id": 2, "title": "Частный дом"},
    {"id": 3, "title": "Офис"}
  ]
};

const providerSeed = {
  users: [
    {"id": 1, "login": "admin_orlov", "full_name": "Орлов Сергей Иванович", "phone": "+7 (900) 555-01-01", "email": "orlov@example.ru", "created_at": "2024-01-10 09:00:00", "is_active": 1, "salt": "75a2a693189290a460d912fb0f45ad2b", "password_hash": "5897f5607f8fbcefc7062dfe9702907ca0746cdccbcfb24cdda7ee1206715b37", "role": "admin"},
    {"id": 2, "login": "admin_kuznetsova", "full_name": "Кузнецова Марина Петровна", "phone": "+7 (900) 555-01-02", "email": "kuznetsova@example.ru", "created_at": "2024-01-10 09:05:00", "is_active": 1, "salt": "b4d7897cee0be78a341f93023b499cc0", "password_hash": "52f25ba582daa0ba2d7290990a4e86d3b122bd7204b7a503af6687bb9d858d05", "role": "admin"},
    {"id": 3, "login": "ivanov_a", "full_name": "Иванов Алексей Сергеевич", "phone": "+7 (900) 555-02-01", "email": "ivanov.a@example.ru", "created_at": "2024-03-12 14:20:00", "is_active": 1, "salt": "f9d478e968b2c518fa0f27a22f90d8c7", "password_hash": "04026c8f850eb7bcda7e41975efa040083a36857713163c1faf8ca4a56874976", "role": "subscriber"},
    {"id": 4, "login": "petrova_m", "full_name": "Петрова Мария Андреевна", "phone": "+7 (900) 555-02-02", "email": "petrova.m@example.ru", "created_at": "2024-04-02 10:15:00", "is_active": 1, "salt": "5824bfed58656fc3d0c8d8120bb2e571", "password_hash": "a746b419aa40b81444c949cb8fe469e75edad7ec69ffb9e1ec9d25c590bdca52", "role": "subscriber"},
    {"id": 5, "login": "smirnov_d", "full_name": "Смирнов Дмитрий Олегович", "phone": "+7 (900) 555-02-03", "email": "smirnov.d@example.ru", "created_at": "2024-05-20 18:40:00", "is_active": 1, "salt": "963157ffa88f1da36c7027b4a4ed544c", "password_hash": "1d86b2abc9af3d9f885ec28db1a23ae2dda3aaeb7c5726c47a67d4ad81f7543a", "role": "subscriber"},
    {"id": 6, "login": "sokolova_e", "full_name": "Соколова Елена Викторовна", "phone": "+7 (900) 555-02-04", "email": "sokolova.e@example.ru", "created_at": "2024-07-08 12:00:00", "is_active": 1, "salt": "0ba3fc7b8b28e362927a04f99b64856b", "password_hash": "25115dd5d92e2fc64b7c865a347faab4a2f8190b13292e60d6702727804c6728", "role": "subscriber"},
    {"id": 7, "login": "volkov_i", "full_name": "Волков Игорь Николаевич", "phone": "+7 (900) 555-02-05", "email": "volkov.i@example.ru", "created_at": "2024-09-14 16:30:00", "is_active": 1, "salt": "d9d07c6e7c8ae56ea2f6ef9c5191ca37", "password_hash": "a4fe746c663ed319dfcd9431ee98c2178b9dbf2ac8e7f5d11a886edc02c377c7", "role": "subscriber"},
    {"id": 8, "login": "fedorova_o", "full_name": "Фёдорова Ольга Павловна", "phone": "+7 (900) 555-02-06", "email": "fedorova.o@example.ru", "created_at": "2025-01-25 11:10:00", "is_active": 1, "salt": "97eacae934c6ac7cc4027be833475ad2", "password_hash": "abb2960b2a2eaa3a84319e71d640608b875c7e9109c4cc05919bd034989ba53e", "role": "subscriber"},
    {"id": 9, "login": "mikhailov_p", "full_name": "Михайлов Павел Александрович", "phone": "+7 (900) 555-02-07", "email": "mikhailov.p@example.ru", "created_at": "2025-06-03 20:05:00", "is_active": 1, "salt": "bed60f09ec9d392f58cb24bb87a16d65", "password_hash": "9a1648cc449ff0a667a7347bc4ef23d6f404c5539c57c3fea8fa7d8f7491b31b", "role": "subscriber"},
    {"id": 10, "login": "novikova_t", "full_name": "Новикова Татьяна Юрьевна", "phone": "+7 (900) 555-02-08", "email": "novikova.t@example.ru", "created_at": "2025-10-17 08:50:00", "is_active": 1, "salt": "838fe08bf624d223770b1af3336315b0", "password_hash": "c8fbcfbac9d2bf3cf5a72032f5427e1223f4cbfb88957ac8f8d6f37bc4fd5ba6", "role": "subscriber"}
  ],
  subscribers: [
    {"id": 1, "user_id": 3, "account_number": "100001", "address_id": 1, "flat": "14", "tariff_id": 2, "balance": 320.5, "connected_at": "2024-03-20", "status": "active"},
    {"id": 2, "user_id": 4, "account_number": "100002", "address_id": 4, "flat": "7", "tariff_id": 3, "balance": -120.0, "connected_at": "2024-04-10", "status": "active"},
    {"id": 3, "user_id": 5, "account_number": "100003", "address_id": 7, "flat": null, "tariff_id": 5, "balance": 980.0, "connected_at": "2024-05-28", "status": "active"},
    {"id": 4, "user_id": 6, "account_number": "100004", "address_id": 9, "flat": "31", "tariff_id": 1, "balance": 0.0, "connected_at": "2024-07-15", "status": "suspended"},
    {"id": 5, "user_id": 7, "account_number": "100005", "address_id": 11, "flat": "2", "tariff_id": 4, "balance": 1500.0, "connected_at": "2024-09-22", "status": "active"},
    {"id": 6, "user_id": 8, "account_number": "100006", "address_id": 13, "flat": null, "tariff_id": 6, "balance": 240.0, "connected_at": "2025-02-03", "status": "active"},
    {"id": 7, "user_id": 9, "account_number": "100007", "address_id": 15, "flat": "9", "tariff_id": 2, "balance": 550.0, "connected_at": "2025-06-12", "status": "active"},
    {"id": 8, "user_id": 10, "account_number": "100008", "address_id": 17, "flat": null, "tariff_id": 3, "balance": -30.0, "connected_at": "2025-10-25", "status": "active"}
  ],
  applications: [
    {"id": 1, "user_id": null, "name": "Андрей", "phone": "+7 (900) 555-03-01", "address": "ул. Ленина, 12, кв. 5", "property_type_id": 1, "tariff_id": 2, "coverage_ok": 1, "created_at": "2026-10-20 10:12:00", "processed_by": null, "admin_comment": null, "status": "new"},
    {"id": 2, "user_id": null, "name": "Ирина Захарова", "phone": "+7 (900) 555-03-02", "address": "ул. Советская, 40, кв. 18", "property_type_id": 1, "tariff_id": 3, "coverage_ok": 1, "created_at": "2026-10-19 15:30:00", "processed_by": 1, "admin_comment": "Мастер назначен на 30.10", "status": "in_progress"},
    {"id": 3, "user_id": null, "name": "Николай", "phone": "+7 (900) 555-03-03", "address": "ул. Менделеева, 8", "property_type_id": 2, "tariff_id": 1, "coverage_ok": 0, "created_at": "2026-10-18 09:05:00", "processed_by": 2, "admin_comment": "Нет технической возможности, предложили альтернативу", "status": "rejected"},
    {"id": 4, "user_id": 3, "name": "Иванов Алексей", "phone": "+7 (900) 555-02-01", "address": "ул. Ленина, 5, кв. 14", "property_type_id": 1, "tariff_id": 4, "coverage_ok": 1, "created_at": "2026-09-02 12:00:00", "processed_by": 1, "admin_comment": "Тариф изменён", "status": "connected"},
    {"id": 5, "user_id": null, "name": "Светлана К.", "phone": "+7 (900) 555-03-05", "address": "ул. Гагарина, 21, кв. 3", "property_type_id": 1, "tariff_id": 5, "coverage_ok": 1, "created_at": "2026-10-27 08:40:00", "processed_by": null, "admin_comment": null, "status": "new"},
    {"id": 6, "user_id": null, "name": "Олег Петров", "phone": "+7 (900) 555-03-06", "address": "ул. Фрунзе, 18", "property_type_id": 2, "tariff_id": 2, "coverage_ok": 1, "created_at": "2026-10-26 17:25:00", "processed_by": 2, "admin_comment": "Ожидает выезда мастера", "status": "in_progress"},
    {"id": 7, "user_id": null, "name": "ООО «Вектор»", "phone": "+7 (900) 555-03-07", "address": "ул. Революции, 10, офис 4", "property_type_id": 3, "tariff_id": 3, "coverage_ok": 1, "created_at": "2026-09-15 11:00:00", "processed_by": 1, "admin_comment": "Подключено, акт подписан", "status": "connected"},
    {"id": 8, "user_id": null, "name": "Елена", "phone": "+7 (900) 555-03-08", "address": "Пионерский пер., 3", "property_type_id": 2, "tariff_id": 1, "coverage_ok": 0, "created_at": "2026-10-05 13:50:00", "processed_by": 2, "admin_comment": "Адрес вне зоны покрытия", "status": "rejected"},
    {"id": 9, "user_id": 7, "name": "Волков Игорь", "phone": "+7 (900) 555-02-05", "address": "ул. Фрунзе, 4, кв. 2", "property_type_id": 1, "tariff_id": 6, "coverage_ok": 1, "created_at": "2026-10-24 19:10:00", "processed_by": 1, "admin_comment": null, "status": "in_progress"},
    {"id": 10, "user_id": null, "name": "Мария С.", "phone": "+7 (900) 555-03-10", "address": "ул. Институтская, 14, кв. 33", "property_type_id": 1, "tariff_id": 2, "coverage_ok": 1, "created_at": "2026-10-28 07:45:00", "processed_by": null, "admin_comment": null, "status": "new"},
    {"id": 11, "user_id": null, "name": "Алексей Н.", "phone": "+7 (900) 555-03-11", "address": "Красный пер., 6", "property_type_id": 2, "tariff_id": 5, "coverage_ok": 1, "created_at": "2026-08-30 16:15:00", "processed_by": 2, "admin_comment": "Подключено", "status": "connected"},
    {"id": 12, "user_id": null, "name": "Дарья", "phone": "+7 (900) 555-03-12", "address": "ул. Королёва, 30, кв. 1", "property_type_id": 1, "tariff_id": 3, "coverage_ok": 0, "created_at": "2026-10-12 10:00:00", "processed_by": 1, "admin_comment": "Подключение запланировано, сообщим", "status": "rejected"}
  ],
  appeals: [
    {"id": 1, "subscriber_id": 1, "subject": "Нет доступа в интернет", "message": "С утра не работает интернет, индикатор на роутере горит красным.", "status": "closed", "created_at": "2026-10-10 08:20:00", "answer": "Выполнен выезд мастера, замена оптического кабеля. Услуга восстановлена.", "answered_by": 1, "answered_at": "2026-10-10 15:00:00"},
    {"id": 2, "subscriber_id": 2, "subject": "Вопрос по тарифу", "message": "Хочу подключить телевидение к текущему тарифу, как это сделать?", "status": "closed", "created_at": "2026-10-12 12:05:00", "answer": "Перейдите на тариф «Старт ТВ» или оставьте заявку в личном кабинете.", "answered_by": 2, "answered_at": "2026-10-12 13:10:00"},
    {"id": 3, "subscriber_id": 3, "subject": "Низкая скорость", "message": "По вечерам скорость падает ниже 20 Мбит/с.", "status": "in_progress", "created_at": "2026-10-20 21:30:00", "answer": null, "answered_by": null, "answered_at": null},
    {"id": 4, "subscriber_id": 5, "subject": "Смена тарифа", "message": "Прошу перевести на тариф «Максимальный 300».", "status": "open", "created_at": "2026-10-25 09:15:00", "answer": null, "answered_by": null, "answered_at": null},
    {"id": 5, "subscriber_id": 6, "subject": "Не поступил платёж", "message": "Оплатил 25.10 картой, на счёте деньги не появились.", "status": "in_progress", "created_at": "2026-10-26 18:40:00", "answer": null, "answered_by": null, "answered_at": null},
    {"id": 6, "subscriber_id": 4, "subject": "Приостановка услуги", "message": "Уезжаю на 2 месяца, нужно приостановить услугу.", "status": "closed", "created_at": "2026-07-01 10:00:00", "answer": "Услуга приостановлена на период с 05.07 по 05.09.", "answered_by": 1, "answered_at": "2026-07-01 12:30:00"},
    {"id": 7, "subscriber_id": 7, "subject": "Счёт на оплату", "message": "Нужна квитанция об оплате за сентябрь.", "status": "closed", "created_at": "2026-10-03 14:00:00", "answer": "Квитанция отправлена на электронную почту.", "answered_by": 2, "answered_at": "2026-10-03 16:45:00"},
    {"id": 8, "subscriber_id": 8, "subject": "Перенос оборудования", "message": "Планирую ремонт, нужно перенести розетку интернета в другую комнату.", "status": "open", "created_at": "2026-10-27 20:10:00", "answer": null, "answered_by": null, "answered_at": null}
  ],
  payments: [
    {"id": 1, "subscriber_id": 1, "amount": 550.0, "method": "card", "status": "success", "paid_at": "2026-08-02 10:11:00"},
    {"id": 2, "subscriber_id": 1, "amount": 550.0, "method": "sbp", "status": "success", "paid_at": "2026-09-03 09:40:00"},
    {"id": 3, "subscriber_id": 1, "amount": 550.0, "method": "card", "status": "success", "paid_at": "2026-10-02 19:22:00"},
    {"id": 4, "subscriber_id": 2, "amount": 750.0, "method": "card", "status": "success", "paid_at": "2026-08-05 14:05:00"},
    {"id": 5, "subscriber_id": 2, "amount": 750.0, "method": "card", "status": "success", "paid_at": "2026-09-05 14:07:00"},
    {"id": 6, "subscriber_id": 2, "amount": 750.0, "method": "card", "status": "failed", "paid_at": "2026-10-06 11:30:00"},
    {"id": 7, "subscriber_id": 3, "amount": 700.0, "method": "sbp", "status": "success", "paid_at": "2026-08-10 08:00:00"},
    {"id": 8, "subscriber_id": 3, "amount": 700.0, "method": "sbp", "status": "success", "paid_at": "2026-09-10 08:02:00"},
    {"id": 9, "subscriber_id": 3, "amount": 1000.0, "method": "card", "status": "success", "paid_at": "2026-10-11 17:45:00"},
    {"id": 10, "subscriber_id": 4, "amount": 450.0, "method": "office", "status": "success", "paid_at": "2026-06-20 12:30:00"},
    {"id": 11, "subscriber_id": 4, "amount": 450.0, "method": "office", "status": "success", "paid_at": "2026-07-02 12:15:00"},
    {"id": 12, "subscriber_id": 5, "amount": 950.0, "method": "card", "status": "success", "paid_at": "2026-08-15 21:00:00"},
    {"id": 13, "subscriber_id": 5, "amount": 950.0, "method": "card", "status": "success", "paid_at": "2026-09-15 21:03:00"},
    {"id": 14, "subscriber_id": 5, "amount": 1500.0, "method": "sbp", "status": "success", "paid_at": "2026-10-15 20:40:00"},
    {"id": 15, "subscriber_id": 6, "amount": 1000.0, "method": "card", "status": "success", "paid_at": "2026-09-01 09:00:00"},
    {"id": 16, "subscriber_id": 6, "amount": 1000.0, "method": "card", "status": "pending", "paid_at": "2026-10-25 18:35:00"},
    {"id": 17, "subscriber_id": 7, "amount": 550.0, "method": "sbp", "status": "success", "paid_at": "2026-09-12 10:10:00"},
    {"id": 18, "subscriber_id": 7, "amount": 550.0, "method": "sbp", "status": "success", "paid_at": "2026-10-12 10:12:00"},
    {"id": 19, "subscriber_id": 8, "amount": 750.0, "method": "card", "status": "success", "paid_at": "2026-09-25 13:00:00"},
    {"id": 20, "subscriber_id": 8, "amount": 750.0, "method": "card", "status": "success", "paid_at": "2026-10-25 13:05:00"}
  ]
};
