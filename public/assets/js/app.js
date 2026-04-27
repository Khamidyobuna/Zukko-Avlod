const app = document.getElementById("app");
const header = document.getElementById("site-header");
const footer = document.getElementById("site-footer");
const toastStack = document.getElementById("toast-stack");
const ADMIN_PORTAL_PATH = "/teacher-portal-begzod-2026";
const THEME_KEY = "zukko-theme";
const LANGUAGE_KEY = "zukko-language";
const SUPPORTED_LANGUAGES = ["uz", "ru", "en"];
const LOCALE_MAP = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US",
};

const translations = {
  uz: {
    register: "Ro'yxatdan o'tish",
    login: "Kirish",
    dashboard: "Dashboard",
    help_center: "Help Center",
    logout: "Chiqish",
    admin_panel: "Admin Panel",
    theme_dark: "Dark",
    theme_light: "Light",
    subtitle: "Maktab olimpiadalari platformasi",
    footer_tagline: "Maktab olimpiadalari uchun sodda, amaliy va zamonaviy platforma.",
    footer_owner: "Tashkilotchi:",
    footer_owner_text: "2026-yildan boshlab muntazam olimpiadalar uchun ishlab chiqildi.",
    loading: "Ma'lumotlar yuklanmoqda...",
    warning: "Ogohlantirish",
    offline_title: "Frontend ochildi, lekin backend ishlamayapti",
    offline_body: "Hozir siz sahifani Live Server orqali ochgansiz yoki PowerShell server yoqilmagan. To'liq ishlashi uchun",
    offline_body_2: "ni ishga tushirib, keyin",
    hero_eyebrow: "2026 Olimpiadalar Platformasi",
    hero_title: "Zukko Avlod bilan bilimni ishonchli sinovdan o'tkazing.",
    hero_body: "Platforma maktab sharoitidagi olimpiadalarni tartibli o'tkazish, o'quvchilarni ro'yxatdan o'tkazish, faol testlarni topshirish va natijalarni aniq ko'rsatish uchun yaratilgan.",
    subjects: "Fanlar",
    subjects_value: "Matematika va ingliz tili",
    class_range: "Sinf oralig'i",
    matched_filter: "Mos filtr bilan",
    management: "Boshqaruv",
    real: "Real",
    frontend_backend: "Frontend + backend",
    owner_eyebrow: "Platforma Egasi",
    owner_body: "Maktabdagi olimpiadalarni sodda va samarali tashkil qilish uchun ushbu platforma Begzod Poziljonov tomonidan 2026-yildan boshlab doimiy foydalanish maqsadida ishlab chiqildi.",
    teacher_side: "O'qituvchi tomoni",
    hidden_admin: "Maxsus admin kirishi",
    works_title: "Nimalar ishlaydi?",
    works_1: "Student ro'yxatdan o'tadi va avtomatik dashboardga o'tadi.",
    works_2: "Faol olimpiadalar sinf va vaqt bo'yicha filtrlab ko'rsatiladi.",
    works_3: "Natijalar savolma-savol yashil va qizil ko'rinishda chiqadi.",
    register_eyebrow: "Student ro'yxatdan o'tishi",
    register_title: "Yangi hisob ochish",
    register_body: "Ism, familiya, sinf va parolni kiriting. Muvaffaqiyatli yakunda tizim sizni avtomatik dashboardga olib o'tadi.",
    first_name: "Ism",
    last_name: "Familiya",
    class_label: "Sinf",
    select_option: "Tanlang",
    password: "Parol",
    password_hint: "Kamida 6 ta belgi",
    register_info: "Ro'yxatdan o'tgach sizga avtomatik ravishda student kabinet ochiladi. Keyingi kirishlar uchun tizim sizga",
    student_id: "Student ID",
    register_submit: "Hisob yaratish",
    rules: "Qoidalar",
    criteria: "Qabul mezonlari",
    rule_1: "Faqat 5-sinfdan 9-sinfgacha bo'lgan o'quvchilar qabul qilinadi.",
    rule_2: "Ism va familiya to'liq kiritilishi kerak.",
    rule_3: "Parol sizning hisobingizni himoya qiladi va bazada xavfsiz saqlanadi.",
    login_eyebrow: "Student kirishi",
    login_title: "Kabinetga kirish",
    login_body: "Ro'yxatdan o'tgandan keyin berilgan",
    login_body_2: "va parolingiz bilan kiring.",
    convenience: "Qulaylik",
    after_login: "Kirishdan keyin",
    after_login_1: "Dashboardda faol olimpiadalar va oldingi natijalar ko'rinadi.",
    after_login_2: "Help Center orqali platformadan foydalanish bo'yicha yo'riqnoma olasiz.",
    after_login_3: "Natijalar sahifasida savollar bo'yicha aniq navigatsiya mavjud.",
    login_submit: "Kirish",
    dashboard_for: "{name} uchun dashboard",
    grade: "Sinf",
    main_stats: "Asosiy statistika",
    student_metrics: "O'quvchi ko'rsatkichlari",
    total_participated: "Jami qatnashgan olimpiada",
    top3_wins: "Top 3 g'oliblik",
    average_percentage: "O'rtacha foiz",
    subject_stats: "Fanlar bo'yicha statistika",
    no_subject_stats: "Hali fanlar bo'yicha statistika yo'q.",
    available_olympiads: "Mavjud olimpiadalar",
    active_tests: "Faol testlar",
    no_active_olympiads: "Hozircha sizning sinfingiz uchun faol olimpiada topilmadi.",
    no_description: "Qisqacha tavsif berilmagan.",
    ends_at: "Tugash",
    minutes: "daqiqa",
    start_test: "Testni boshlash",
    recently: "Recently",
    previous_tasks: "Oldingi topshiriqlar",
    no_submissions: "Siz hali hech qanday test topshirmagansiz.",
    correct: "to'g'ri",
    result_view: "Natijasini ko'rish",
    rank: "Rank",
    help_title: "Platformadan foydalanish yo'riqnomasi",
    help_body: "Har bir bosqich sodda ishlashi uchun kerakli qisqa qo'llanma shu yerda jamlangan.",
    help_section_1_title: "Platformaga kirish",
    help_section_1_body: "Student ID va parolingiz orqali tizimga kiring. Dashboardda sizga mos faol olimpiadalar avtomatik chiqadi.",
    help_section_2_title: "Test topshirish",
    help_section_2_body: "Mavjud olimpiadalar bo'limidan kerakli testni tanlang, savollarga javob bering va yakunda topshiring.",
    help_section_3_title: "Natijani ko'rish",
    help_section_3_body: "Recently bo'limidagi Natijasini ko'rish tugmasi orqali oldingi ishlagan testlaringizning to'g'ri va noto'g'ri javoblarini ko'rishingiz mumkin.",
    back_dashboard: "Dashboardga qaytish",
    question: "Savol",
    submit_test: "Testni topshirish",
    result_suffix: "natijasi",
    admin_login_title: "Begzod Poziljonov uchun admin portal",
    page_not_found: "Sahifa topilmadi",
    page_not_found_body: "Kerakli bo'lim mavjud emas yoki ko'chirilgan.",
    back_home: "Bosh sahifaga qaytish",
    page_load_error: "Sahifani yuklab bo'lmadi",
    generic_error: "Xatolik",
    signed_out: "Hisobdan chiqildi.",
    registered_ok: "Ro'yxatdan o'tildi.",
    login_ok: "Kabinetga muvaffaqiyatli kirildi.",
    admin_login_ok: "Admin panelga kirildi.",
    all_answers_required: "Barcha savollarga javob tanlang.",
    test_submitted: "Test muvaffaqiyatli topshirildi.",
    at_least_one_question: "Kamida bitta savol qolishi kerak.",
    olympiad_created: "Yangi olimpiada yaratildi.",
    olympiad_ended: "Olimpiada tugatildi.",
    admin_active_hint: "Olimpiada o'quvchi dashboardida ko'rinishi uchun boshlanish vaqti hozir yoki o'tgan vaqt bo'lishi, tugash vaqti esa kelajakda bo'lishi kerak. Shuningdek, o'quvchi sinfi mos bo'lishi shart.",
    connect_error: "Backend serverga ulanib bo'lmadi. `server.ps1` ni ishga tushiring.",
    request_failed: "So'rov bajarilmadi.",
    language: "Til",
    end_olympiad: "Tugatish",
    ended: "Yakunlangan",
    confirm_end: "Rostdan ham olimpiadani tugatmoqchimisiz?",
  },
  ru: {
    register: "Регистрация",
    login: "Вход",
    dashboard: "Кабинет",
    help_center: "Помощь",
    logout: "Выход",
    admin_panel: "Админ панель",
    theme_dark: "Dark",
    theme_light: "Light",
    subtitle: "Платформа школьных олимпиад",
    footer_tagline: "Простая, практичная и современная платформа для школьных олимпиад.",
    footer_owner: "Организатор:",
    footer_owner_text: "Разработана для регулярных олимпиад с 2026 года.",
    loading: "Загрузка данных...",
    warning: "Предупреждение",
    offline_title: "Фронтенд открыт, но backend не работает",
    offline_body: "Сейчас вы открыли страницу через Live Server или PowerShell сервер не запущен. Для полной работы запустите",
    offline_body_2: "и затем откройте",
    hero_eyebrow: "Платформа олимпиад 2026",
    hero_title: "Проверяйте знания уверенно вместе с Zukko Avlod.",
    hero_body: "Платформа создана для удобного проведения школьных олимпиад, регистрации учеников, прохождения активных тестов и просмотра точных результатов.",
    subjects: "Предметы",
    subjects_value: "Математика и английский язык",
    class_range: "Классы",
    matched_filter: "С фильтрацией",
    management: "Управление",
    real: "Полное",
    frontend_backend: "Frontend + backend",
    owner_eyebrow: "Владелец платформы",
    owner_body: "Эта платформа создана для простого и эффективного проведения школьных олимпиад под руководством Бегзода Позилжонова с 2026 года.",
    teacher_side: "Сторона учителя",
    hidden_admin: "Скрытый вход админа",
    works_title: "Что работает?",
    works_1: "Ученик регистрируется и автоматически попадает в кабинет.",
    works_2: "Активные олимпиады фильтруются по классу и времени.",
    works_3: "Результаты показываются по вопросам с зелёной и красной подсветкой.",
    register_eyebrow: "Регистрация ученика",
    register_title: "Создать аккаунт",
    register_body: "Введите имя, фамилию, класс и пароль. После успешной регистрации система автоматически переведёт вас в кабинет.",
    first_name: "Имя",
    last_name: "Фамилия",
    class_label: "Класс",
    select_option: "Выберите",
    password: "Пароль",
    password_hint: "Минимум 6 символов",
    register_info: "После регистрации вам автоматически откроется кабинет ученика. Для следующих входов система выдаст",
    student_id: "Student ID",
    register_submit: "Создать аккаунт",
    rules: "Правила",
    criteria: "Условия приема",
    rule_1: "Допускаются только ученики 5-9 классов.",
    rule_2: "Имя и фамилия должны быть заполнены полностью.",
    rule_3: "Пароль защищает ваш аккаунт и безопасно хранится в базе.",
    login_eyebrow: "Вход ученика",
    login_title: "Вход в кабинет",
    login_body: "Войдите с помощью выданного",
    login_body_2: "и пароля.",
    convenience: "Удобство",
    after_login: "После входа",
    after_login_1: "В кабинете видны активные олимпиады и прошлые результаты.",
    after_login_2: "Через раздел Help Center вы получите инструкцию по использованию платформы.",
    after_login_3: "На странице результатов есть удобная навигация по вопросам.",
    login_submit: "Войти",
    dashboard_for: "Кабинет ученика {name}",
    grade: "Класс",
    main_stats: "Основная статистика",
    student_metrics: "Показатели ученика",
    total_participated: "Всего олимпиад",
    top3_wins: "Попаданий в топ-3",
    average_percentage: "Средний процент",
    subject_stats: "Статистика по предметам",
    no_subject_stats: "Пока нет статистики по предметам.",
    available_olympiads: "Доступные олимпиады",
    active_tests: "Активные тесты",
    no_active_olympiads: "Сейчас для вашего класса нет активных олимпиад.",
    no_description: "Краткое описание не указано.",
    ends_at: "Окончание",
    minutes: "минут",
    start_test: "Начать тест",
    recently: "Недавние",
    previous_tasks: "Предыдущие работы",
    no_submissions: "Вы пока не проходили тесты.",
    correct: "правильно",
    result_view: "Посмотреть результат",
    rank: "Место",
    help_title: "Инструкция по использованию платформы",
    help_body: "Здесь собраны краткие подсказки по каждому основному шагу.",
    help_section_1_title: "Вход на платформу",
    help_section_1_body: "Войдите с помощью Student ID и пароля. В кабинете автоматически появятся активные олимпиады, подходящие вашему классу.",
    help_section_2_title: "Прохождение теста",
    help_section_2_body: "Выберите нужную олимпиаду в разделе доступных олимпиад, ответьте на вопросы и отправьте тест.",
    help_section_3_title: "Просмотр результата",
    help_section_3_body: "В разделе Recently через кнопку просмотра результата можно увидеть правильные и неправильные ответы прошлых попыток.",
    back_dashboard: "Назад в кабинет",
    question: "Вопрос",
    submit_test: "Отправить тест",
    result_suffix: "результат",
    admin_login_title: "Админ портал для Бегзода Позилжонова",
    page_not_found: "Страница не найдена",
    page_not_found_body: "Нужный раздел не существует или был перемещен.",
    back_home: "На главную",
    page_load_error: "Не удалось загрузить страницу",
    generic_error: "Ошибка",
    signed_out: "Вы вышли из аккаунта.",
    registered_ok: "Регистрация завершена.",
    login_ok: "Вход выполнен успешно.",
    admin_login_ok: "Вход в админ панель выполнен.",
    all_answers_required: "Выберите ответы для всех вопросов.",
    test_submitted: "Тест успешно отправлен.",
    at_least_one_question: "Должен остаться хотя бы один вопрос.",
    olympiad_created: "Новая олимпиада создана.",
    olympiad_ended: "Олимпиада завершена.",
    admin_active_hint: "Чтобы олимпиада появилась у ученика в активных, время начала должно быть текущим или уже наступившим, а время окончания в будущем. Также класс ученика должен совпадать.",
    connect_error: "Не удалось подключиться к backend. Запустите `server.ps1`.",
    request_failed: "Не удалось выполнить запрос.",
    language: "Язык",
    end_olympiad: "Завершить",
    ended: "Завершено",
    confirm_end: "Вы действительно хотите завершить олимпиаду?",
  },
  en: {
    register: "Register",
    login: "Login",
    dashboard: "Dashboard",
    help_center: "Help Center",
    logout: "Logout",
    admin_panel: "Admin Panel",
    theme_dark: "Dark",
    theme_light: "Light",
    subtitle: "School olympiad platform",
    footer_tagline: "A simple, practical, and modern platform for school olympiads.",
    footer_owner: "Organizer:",
    footer_owner_text: "Built for regular olympiads starting from 2026.",
    loading: "Loading data...",
    warning: "Warning",
    offline_title: "Frontend is open, but backend is not running",
    offline_body: "You opened the page via Live Server or the PowerShell server is not running. For full functionality run",
    offline_body_2: "and then open",
    hero_eyebrow: "2026 Olympiad Platform",
    hero_title: "Test knowledge confidently with Zukko Avlod.",
    hero_body: "The platform is built to organize school olympiads clearly, register students, run active tests, and show accurate results.",
    subjects: "Subjects",
    subjects_value: "Mathematics and English",
    class_range: "Class range",
    matched_filter: "With matching filters",
    management: "Management",
    real: "Real",
    frontend_backend: "Frontend + backend",
    owner_eyebrow: "Platform Owner",
    owner_body: "This platform was created for simple and effective school olympiad management under Begzod Poziljonov from 2026 onward.",
    teacher_side: "Teacher side",
    hidden_admin: "Hidden admin access",
    works_title: "What works?",
    works_1: "A student registers and is redirected to the dashboard automatically.",
    works_2: "Active olympiads are filtered by class and time.",
    works_3: "Results are shown question by question with green and red highlights.",
    register_eyebrow: "Student registration",
    register_title: "Create account",
    register_body: "Enter first name, last name, class, and password. After success, the system will redirect you to your dashboard automatically.",
    first_name: "First name",
    last_name: "Last name",
    class_label: "Class",
    select_option: "Select",
    password: "Password",
    password_hint: "At least 6 characters",
    register_info: "After registration, your student cabinet opens automatically. For future logins the system will provide a",
    student_id: "Student ID",
    register_submit: "Create account",
    rules: "Rules",
    criteria: "Admission criteria",
    rule_1: "Only students from grades 5 to 9 are allowed.",
    rule_2: "First name and last name must be entered fully.",
    rule_3: "Your password protects the account and is stored securely in the database.",
    login_eyebrow: "Student login",
    login_title: "Sign in",
    login_body: "Sign in with the issued",
    login_body_2: "and your password.",
    convenience: "Convenience",
    after_login: "After login",
    after_login_1: "The dashboard shows active olympiads and previous results.",
    after_login_2: "The Help Center explains how to use the platform.",
    after_login_3: "The results page includes question-based navigation.",
    login_submit: "Login",
    dashboard_for: "Dashboard for {name}",
    grade: "Class",
    main_stats: "Main statistics",
    student_metrics: "Student metrics",
    total_participated: "Total olympiads joined",
    top3_wins: "Top 3 finishes",
    average_percentage: "Average percentage",
    subject_stats: "Subject statistics",
    no_subject_stats: "No subject statistics yet.",
    available_olympiads: "Available olympiads",
    active_tests: "Active tests",
    no_active_olympiads: "No active olympiads are currently available for your class.",
    no_description: "No short description provided.",
    ends_at: "Ends",
    minutes: "minutes",
    start_test: "Start test",
    recently: "Recently",
    previous_tasks: "Previous attempts",
    no_submissions: "You have not submitted any tests yet.",
    correct: "correct",
    result_view: "View result",
    rank: "Rank",
    help_title: "Platform usage guide",
    help_body: "Here you can find short instructions for each main step.",
    help_section_1_title: "Signing in",
    help_section_1_body: "Sign in with your Student ID and password. The dashboard will automatically show active olympiads that match your class.",
    help_section_2_title: "Taking a test",
    help_section_2_body: "Choose an olympiad from the available list, answer the questions, and submit the test at the end.",
    help_section_3_title: "Viewing results",
    help_section_3_body: "In the Recently section, use the result button to see correct and incorrect answers from your previous attempts.",
    back_dashboard: "Back to dashboard",
    question: "Question",
    submit_test: "Submit test",
    result_suffix: "result",
    admin_login_title: "Admin portal for Begzod Poziljonov",
    page_not_found: "Page not found",
    page_not_found_body: "The requested section does not exist or was moved.",
    back_home: "Back home",
    page_load_error: "Could not load the page",
    generic_error: "Error",
    signed_out: "Signed out successfully.",
    registered_ok: "Registration completed.",
    login_ok: "Logged in successfully.",
    admin_login_ok: "Admin login successful.",
    all_answers_required: "Please answer all questions.",
    test_submitted: "Test submitted successfully.",
    at_least_one_question: "At least one question must remain.",
    olympiad_created: "A new olympiad has been created.",
    olympiad_ended: "The olympiad has been ended.",
    admin_active_hint: "For the olympiad to appear in a student's active list, the start time must be now or earlier, the end time must be in the future, and the student's class must match.",
    connect_error: "Could not connect to backend. Run `server.ps1`.",
    request_failed: "Request could not be completed.",
    language: "Language",
    end_olympiad: "End",
    ended: "Ended",
    confirm_end: "Do you really want to end this olympiad?",
  },
};

const state = {
  context: null,
  language: "uz",
  navOpen: false,
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat(LOCALE_MAP[state.language] || LOCALE_MAP.uz, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDateInput(date) {
  const offset = date.getTimezoneOffset();
  const normalized = new Date(date.getTime() - offset * 60000);
  return normalized.toISOString().slice(0, 16);
}

function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

function getLanguage() {
  const stored = localStorage.getItem(LANGUAGE_KEY) || "uz";
  return SUPPORTED_LANGUAGES.includes(stored) ? stored : "uz";
}

function applyLanguage(language) {
  state.language = SUPPORTED_LANGUAGES.includes(language) ? language : "uz";
  localStorage.setItem(LANGUAGE_KEY, state.language);
}

function t(key, vars = {}) {
  const table = translations[state.language] || translations.uz;
  let value = table[key] || translations.uz[key] || key;
  Object.entries(vars).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, replacement);
  });
  return value;
}

function gradeLabel(grade) {
  if (state.language === "ru") return `${grade} класс`;
  if (state.language === "en") return `Grade ${grade}`;
  return `${grade}-sinf`;
}

function subjectLabel(subject) {
  switch (subject) {
    case "math":
      return state.language === "ru" ? "Математика" : state.language === "en" ? "Mathematics" : "Matematika";
    case "english":
      return state.language === "ru" ? "Английский язык" : state.language === "en" ? "English" : "Ingliz tili";
    default:
      return subject;
  }
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
  renderHeader();
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`.trim();
  toast.textContent = message;
  toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

async function api(path, options = {}) {
  const settings = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "same-origin",
  };

  if (options.body !== undefined) {
    settings.body = JSON.stringify(options.body);
  }

  let response;
  try {
    response = await fetch(path, settings);
  } catch (error) {
    throw new Error(t("connect_error"));
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || t("request_failed"));
  }
  return payload;
}

function navigate(path, replace = false) {
  state.navOpen = false;
  if (replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }
  renderRoute();
}

function isStudent() {
  return state.context?.studentUser?.role === "student";
}

function isAdmin() {
  return state.context?.adminUser?.role === "admin";
}

function renderHeader() {
  const path = window.location.pathname;
  const themeIcon = getTheme() === "dark" ? t("theme_light") : t("theme_dark");
  const languageControl = `
    <label class="language-select-wrap">
      <span class="sr-only">${t("language")}</span>
      <select class="language-select" data-language-select>
        <option value="uz" ${state.language === "uz" ? "selected" : ""}>O'zbek</option>
        <option value="ru" ${state.language === "ru" ? "selected" : ""}>Русский</option>
        <option value="en" ${state.language === "en" ? "selected" : ""}>English</option>
      </select>
    </label>
  `;

  const guestLinks = `
    <div class="nav-actions">
      ${languageControl}
      <a class="btn btn-secondary" href="/register" data-link>${t("register")}</a>
      <a class="btn btn-primary" href="/login" data-link>${t("login")}</a>
      <button class="btn btn-secondary theme-toggle" type="button" data-theme-toggle>${themeIcon}</button>
    </div>
  `;

  const studentLinks = `
    <div class="nav-links">
      ${languageControl}
      <a class="btn ${path === "/dashboard" ? "btn-primary" : "btn-secondary"}" href="/dashboard" data-link>${t("dashboard")}</a>
      <a class="btn ${path === "/help" ? "btn-primary" : "btn-secondary"}" href="/help" data-link>${t("help_center")}</a>
      <button class="btn btn-secondary" type="button" data-logout>${t("logout")}</button>
      <button class="btn btn-secondary theme-toggle" type="button" data-theme-toggle>${themeIcon}</button>
    </div>
  `;

  const adminLinks = `
    <div class="nav-links">
      ${languageControl}
      <button class="btn btn-secondary" type="button" data-logout>${t("logout")}</button>
      <button class="btn btn-secondary theme-toggle" type="button" data-theme-toggle>${themeIcon}</button>
    </div>
  `;

  const currentLinks = path === ADMIN_PORTAL_PATH
    ? (isAdmin() ? adminLinks : guestLinks)
    : (isStudent() ? studentLinks : isAdmin() ? adminLinks : guestLinks);

  header.innerHTML = `
    <nav class="nav-bar">
      <a class="brand-mark" href="/" data-link>
        <span class="brand-badge">ZA</span>
        <span>
          <strong>Zukko Avlod</strong><br>
          <small class="muted">${t("subtitle")}</small>
        </span>
      </a>
      <button class="mobile-menu-button" type="button" data-menu-toggle aria-expanded="${state.navOpen ? "true" : "false"}" aria-label="Toggle navigation">
        ${state.navOpen ? "✕" : "☰"}
      </button>
      <div class="nav-menu ${state.navOpen ? "open" : ""}">
        ${currentLinks}
      </div>
    </nav>
  `;
}

function renderFooter() {
  footer.innerHTML = `
    <div class="footer-box">
      <div>
        <strong>Zukko Avlod</strong>
        <div>${t("footer_tagline")}</div>
      </div>
      <div>
        <strong>${t("footer_owner")}</strong> Begzod Poziljonov
        <div>${t("footer_owner_text")}</div>
      </div>
    </div>
  `;
}

function renderLoading() {
  app.innerHTML = `
    <section class="loading-shell">
      <div class="stack" style="justify-items:center;">
        <div class="spinner" aria-hidden="true"></div>
        <div>${t("loading")}</div>
      </div>
    </section>
  `;
}

function landingMarkup() {
  const offlineNotice = state.context?.offline
    ? `
      <section class="panel">
        <span class="eyebrow">${t("warning")}</span>
        <h2>${t("offline_title")}</h2>
        <p class="section-copy">
          ${t("offline_body")} <code>powershell.exe -ExecutionPolicy Bypass -File .\\server.ps1 -Port 8080</code>
          ${t("offline_body_2")} <code>http://localhost:8080</code>.
        </p>
      </section>
    `
    : "";

  return `
    <section class="page-shell">
      ${offlineNotice}
      <section class="hero">
        <article class="glass-card hero-copy">
          <div>
            <span class="eyebrow">${t("hero_eyebrow")}</span>
            <h1>${t("hero_title")}</h1>
            <p>${t("hero_body")}</p>
            <div class="hero-stats">
              <div class="metric">
                <span class="muted">${t("subjects")}</span>
                <strong>2</strong>
                <span class="muted">${t("subjects_value")}</span>
              </div>
              <div class="metric">
                <span class="muted">${t("class_range")}</span>
                <strong>5-9</strong>
                <span class="muted">${t("matched_filter")}</span>
              </div>
              <div class="metric">
                <span class="muted">${t("management")}</span>
                <strong>${t("real")}</strong>
                <span class="muted">${t("frontend_backend")}</span>
              </div>
            </div>
          </div>
          <div class="quick-actions">
            <a class="btn btn-primary" href="/register" data-link>${t("register")}</a>
            <a class="btn btn-secondary" href="/login" data-link>${t("login")}</a>
          </div>
        </article>
        <div class="hero-side">
          <article class="glass-card person-card">
            <span class="eyebrow">${t("owner_eyebrow")}</span>
            <h2 class="card-title">Begzod Poziljonov</h2>
            <p class="card-copy">${t("owner_body")}</p>
            <div class="meta-row">
              <span class="meta-chip">${t("teacher_side")}</span>
              <span class="meta-chip">${t("hidden_admin")}</span>
            </div>
          </article>
          <article class="glass-card">
            <h3>${t("works_title")}</h3>
            <div class="stack">
              <div class="mini-card">${t("works_1")}</div>
              <div class="mini-card">${t("works_2")}</div>
              <div class="mini-card">${t("works_3")}</div>
            </div>
          </article>
        </div>
      </section>
    </section>
  `;
}

function registerMarkup() {
  return `
    <section class="auth-shell">
      <article class="form-card">
        <span class="eyebrow">${t("register_eyebrow")}</span>
        <h1 class="page-title">${t("register_title")}</h1>
        <p class="section-copy">${t("register_body")}</p>
        <form id="register-form" class="stack">
          <div class="form-grid">
            <div class="field">
              <label for="firstName">${t("first_name")}</label>
              <input id="firstName" name="firstName" required maxlength="40" placeholder="Masalan: Ali">
            </div>
            <div class="field">
              <label for="lastName">${t("last_name")}</label>
              <input id="lastName" name="lastName" required maxlength="40" placeholder="Masalan: Karimov">
            </div>
            <div class="field">
              <label for="class">${t("class_label")}</label>
              <select id="class" name="class" required>
                <option value="">${t("select_option")}</option>
                <option value="5">${gradeLabel(5)}</option>
                <option value="6">${gradeLabel(6)}</option>
                <option value="7">${gradeLabel(7)}</option>
                <option value="8">${gradeLabel(8)}</option>
                <option value="9">${gradeLabel(9)}</option>
              </select>
            </div>
            <div class="field">
              <label for="password">${t("password")}</label>
              <input id="password" name="password" type="password" required minlength="6" placeholder="${t("password_hint")}">
            </div>
          </div>
          <div class="message-box">
            ${t("register_info")} <code>${t("student_id")}</code> beradi.
          </div>
          <button class="btn btn-primary" type="submit">${t("register_submit")}</button>
        </form>
      </article>
      <aside class="glass-card">
        <span class="eyebrow">${t("rules")}</span>
        <h2>${t("criteria")}</h2>
        <div class="stack">
          <div class="mini-card">${t("rule_1")}</div>
          <div class="mini-card">${t("rule_2")}</div>
          <div class="mini-card">${t("rule_3")}</div>
        </div>
      </aside>
    </section>
  `;
}

function loginMarkup() {
  return `
    <section class="auth-shell">
      <article class="form-card">
        <span class="eyebrow">${t("login_eyebrow")}</span>
        <h1 class="page-title">${t("login_title")}</h1>
        <p class="section-copy">${t("login_body")} <code>${t("student_id")}</code> ${t("login_body_2")}</p>
        <form id="login-form" class="stack">
          <div class="field">
            <label for="studentCode">${t("student_id")}</label>
            <input id="studentCode" name="studentCode" required placeholder="Masalan: ZA-2026-0002">
          </div>
          <div class="field">
            <label for="loginPassword">${t("password")}</label>
            <input id="loginPassword" name="password" type="password" required placeholder="${t("password")}">
          </div>
          <button class="btn btn-primary" type="submit">${t("login_submit")}</button>
        </form>
      </article>
      <aside class="glass-card">
        <span class="eyebrow">${t("convenience")}</span>
        <h2>${t("after_login")}</h2>
        <div class="stack">
          <div class="mini-card">${t("after_login_1")}</div>
          <div class="mini-card">${t("after_login_2")}</div>
          <div class="mini-card">${t("after_login_3")}</div>
        </div>
      </aside>
    </section>
  `;
}

function dashboardMarkup(data) {
  const { profile, stats, availableOlympiads, recent } = data;
  const subjectCards = stats.subjectStats.length
    ? stats.subjectStats.map((item) => `
        <div class="mini-card">
          <span class="muted">${escapeHtml(subjectLabel(item.subject))}</span>
          <strong>${item.participated}</strong>
          <div class="helper">${t("average_percentage")}: ${item.average}%</div>
        </div>
      `).join("")
    : `<div class="empty-state">${t("no_subject_stats")}</div>`;

  const availableCards = availableOlympiads.length
    ? availableOlympiads.map((item) => `
        <article class="olympiad-card">
          <div class="split-card">
            <div>
              <span class="subject-chip">${escapeHtml(subjectLabel(item.subject))}</span>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
            <span class="meta-chip">${item.questionCount} ${t("question").toLowerCase()}</span>
          </div>
          <p class="card-copy">${escapeHtml(item.description || t("no_description"))}</p>
          <div class="meta-row">
            <span class="tag">${t("ends_at")}: ${formatDateTime(item.endAt)}</span>
            <span class="tag">${item.durationMinutes} ${t("minutes")}</span>
            <span class="tag">${item.gradeLevels.map((grade) => gradeLabel(grade)).join(", ")}</span>
          </div>
          <a class="btn btn-primary" href="/olympiads/${item.id}" data-link>${t("start_test")}</a>
        </article>
      `).join("")
    : `<div class="empty-state panel">${t("no_active_olympiads")}</div>`;

  const recentCards = recent.length
    ? recent.map((item) => `
        <article class="recent-card">
          <div class="split-card">
            <div>
              <span class="subject-chip">${escapeHtml(subjectLabel(item.subject))}</span>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
            <span class="meta-chip">${item.percentage}%</span>
          </div>
          <div class="meta-row">
            <span class="tag">${formatDateTime(item.submittedAt)}</span>
            <span class="tag">${item.correctCount}/${item.totalQuestions} ${t("correct")}</span>
            <span class="tag">${t("rank")}: #${item.rank || "-"}</span>
          </div>
          <a class="btn btn-secondary" href="/results/${item.submissionId}" data-link>${t("result_view")}</a>
        </article>
      `).join("")
    : `<div class="empty-state panel">${t("no_submissions")}</div>`;

  return `
    <section class="page-shell">
      <section class="banner">
        <strong>${t("dashboard_for", { name: `${escapeHtml(profile.firstName)} ${escapeHtml(profile.lastName)}` })}</strong>
        <div class="helper">${t("grade")}: ${gradeLabel(profile.class)} | ${t("student_id")}: ${escapeHtml(profile.studentCode)}</div>
      </section>

      <section class="dashboard-grid">
        <div class="stack">
          <section class="panel">
            <div class="section-head">
              <div>
                <span class="eyebrow">${t("main_stats")}</span>
                <h2>${t("student_metrics")}</h2>
              </div>
              <button class="btn btn-secondary" type="button" data-open-help>${t("help_center")}</button>
            </div>
            <div class="stats-grid">
              <div class="stat-box">
                <span class="muted">${t("total_participated")}</span>
                <strong>${stats.totalParticipated}</strong>
              </div>
              <div class="stat-box">
                <span class="muted">${t("top3_wins")}</span>
                <strong>${stats.top3Wins}</strong>
              </div>
              <div class="stat-box">
                <span class="muted">${t("average_percentage")}</span>
                <strong>${stats.averagePercentage}%</strong>
              </div>
            </div>
            <h3>${t("subject_stats")}</h3>
            <div class="subject-grid">${subjectCards}</div>
          </section>

          <section class="panel">
            <div class="section-head">
              <div>
                <span class="eyebrow">${t("available_olympiads")}</span>
                <h2>${t("active_tests")}</h2>
              </div>
            </div>
            <div class="cards-grid">${availableCards}</div>
          </section>
        </div>

        <section class="panel">
          <div class="section-head">
            <div>
              <span class="eyebrow">${t("recently")}</span>
              <h2>${t("previous_tasks")}</h2>
            </div>
          </div>
          <div class="stack">${recentCards}</div>
        </section>
      </section>
    </section>
  `;
}

function helpMarkup(sections) {
  const localizedSections = sections.map((section, index) => ({
    title: t(`help_section_${index + 1}_title`) || section.title,
    body: t(`help_section_${index + 1}_body`) || section.body,
  }));

  return `
    <section class="page-shell">
      <section class="panel">
        <span class="eyebrow">${t("help_center")}</span>
        <h1 class="page-title">${t("help_title")}</h1>
        <p class="section-copy">${t("help_body")}</p>
      </section>
      <section class="cards-grid">
        ${localizedSections.map((section) => `
          <article class="help-card">
            <h3>${escapeHtml(section.title)}</h3>
            <p class="card-copy">${escapeHtml(section.body)}</p>
          </article>
        `).join("")}
      </section>
      <div class="inline-actions">
        <a class="btn btn-primary" href="/dashboard" data-link>${t("back_dashboard")}</a>
      </div>
    </section>
  `;
}

function olympiadMarkup(olympiad) {
  const navButtons = olympiad.questions.map((question, index) => `
    <button type="button" data-jump-to="question-${question.id}" ${index === 0 ? 'class="active"' : ""}>${t("question")} ${index + 1}</button>
  `).join("");

  const cards = olympiad.questions.map((question, index) => `
    <article class="question-card" id="question-${question.id}">
      <span class="eyebrow">${t("question")} ${index + 1}</span>
      <h3>${escapeHtml(question.text)}</h3>
      <div class="options-grid">
        ${question.options.map((option, optionIndex) => `
          <label class="option">
            <input type="radio" name="question-${question.id}" value="${optionIndex}">
            <span>${escapeHtml(option)}</span>
          </label>
        `).join("")}
      </div>
    </article>
  `).join("");

  return `
    <section class="page-shell">
      <section class="panel">
        <span class="subject-chip">${escapeHtml(subjectLabel(olympiad.subject))}</span>
        <h1 class="page-title">${escapeHtml(olympiad.title)}</h1>
        <p class="section-copy">${escapeHtml(olympiad.description || "")}</p>
        <div class="meta-row">
          <span class="tag">${olympiad.durationMinutes} ${t("minutes")}</span>
          <span class="tag">${t("ends_at")}: ${formatDateTime(olympiad.endAt)}</span>
          <span class="tag">${olympiad.questions.length} ${t("question").toLowerCase()}</span>
        </div>
      </section>
      <section class="test-layout">
        <aside class="question-nav">${navButtons}</aside>
        <form id="olympiad-form" class="stack">
          ${cards}
          <button class="btn btn-primary" type="submit">${t("submit_test")}</button>
        </form>
      </section>
    </section>
  `;
}

function resultMarkup(result) {
  const buttons = result.questions.map((question) => `
    <button type="button" data-jump-to="result-question-${question.number}">${t("question")} ${question.number}</button>
  `).join("");

  const questionCards = result.questions.map((question) => `
    <article class="question-card ${question.isCorrect ? "correct" : "wrong"}" id="result-question-${question.number}">
      <span class="eyebrow">${t("question")} ${question.number}</span>
      <h3>${escapeHtml(question.text)}</h3>
      <div class="options-grid">
        ${question.options.map((option, index) => {
    const classes = [
      "option",
      index === question.correctIndex ? "correct" : "",
      index === question.selectedIndex && index !== question.correctIndex ? "wrong" : "",
      index === question.selectedIndex ? "selected" : "",
    ].filter(Boolean).join(" ");
    return `
            <div class="${classes}">
              <strong>${String.fromCharCode(65 + index)}</strong>
              <span>${escapeHtml(option)}</span>
            </div>
          `;
  }).join("")}
      </div>
    </article>
  `).join("");

  return `
    <section class="page-shell">
      <section class="panel">
        <span class="subject-chip">${escapeHtml(subjectLabel(result.olympiad.subject))}</span>
        <h1 class="page-title">${escapeHtml(result.olympiad.title)} ${t("result_suffix")}</h1>
        <div class="meta-row">
          <span class="tag">${result.olympiad.correctCount}/${result.olympiad.totalQuestions} ${t("correct")}</span>
          <span class="tag">${result.olympiad.percentage}%</span>
          <span class="tag">${formatDateTime(result.olympiad.submittedAt)}</span>
        </div>
      </section>
      <aside class="question-nav">${buttons}</aside>
      <section class="stack">${questionCards}</section>
      <a class="btn btn-secondary" href="/dashboard" data-link>${t("back_dashboard")}</a>
    </section>
  `;
}

function adminLoginMarkup() {
  return `
    <section class="auth-shell">
      <article class="form-card">
        <span class="eyebrow">Maxsus kirish</span>
        <h1 class="page-title">Begzod Poziljonov uchun admin portal</h1>
        <p class="section-copy">Bu sahifa landing page va oddiy ro'yxatdan o'tish oqimida ko'rinmaydi. Faqat maxsus link orqali ochiladi.</p>
        <form id="admin-login-form" class="stack">
          <div class="field">
            <label for="adminUsername">Login</label>
            <input id="adminUsername" name="username" required placeholder="Admin login">
          </div>
          <div class="field">
            <label for="adminPassword">Parol</label>
            <input id="adminPassword" name="password" type="password" required placeholder="Admin parol">
          </div>
          <button class="btn btn-primary" type="submit">Admin sifatida kirish</button>
        </form>
      </article>
      <aside class="glass-card">
        <span class="eyebrow">Eslatma</span>
        <h2>O'qituvchi boshqaruvi</h2>
        <div class="stack">
          <div class="mini-card">Olimpiada yaratish, vaqt belgilash va savollarni qo'lda kiritish shu panelda bajariladi.</div>
          <div class="mini-card">Faol testlar avtomatik ravishda o'quvchilarning dashboardiga chiqadi.</div>
        </div>
      </aside>
    </section>
  `;
}

function questionBuilderMarkup(index) {
  return `
    <article class="builder-card" data-question-card>
      <div class="builder-head">
        <strong>Savol ${index + 1}</strong>
        <button class="btn btn-secondary" type="button" data-remove-question>Olib tashlash</button>
      </div>
      <div class="stack">
        <div class="field full">
          <label>Savol matni</label>
          <textarea name="questionText" required placeholder="Savolni yozing"></textarea>
        </div>
        <div class="form-grid">
          <div class="field"><label>A variant</label><input name="option0" required></div>
          <div class="field"><label>B variant</label><input name="option1" required></div>
          <div class="field"><label>C variant</label><input name="option2" required></div>
          <div class="field"><label>D variant</label><input name="option3" required></div>
        </div>
        <div class="field">
          <label>To'g'ri javob</label>
          <select name="correctIndex" required>
            <option value="0">A variant</option>
            <option value="1">B variant</option>
            <option value="2">C variant</option>
            <option value="3">D variant</option>
          </select>
        </div>
      </div>
    </article>
  `;
}

function adminDashboardMarkup(payload) {
  const olympiadRows = payload.olympiads.length
    ? payload.olympiads.map((item) => `
        <div class="table-row">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <div class="helper">${escapeHtml(item.description || "Tavsif berilmagan")}</div>
            <div class="inline-actions">
              ${item.status !== "ended" ? `<button class="btn btn-danger" type="button" data-end-olympiad="${item.id}">${t("end_olympiad")}</button>` : `<span class="status-chip ended">${t("ended")}</span>`}
            </div>
          </div>
          <div><span class="subject-chip">${escapeHtml(item.subjectLabel)}</span></div>
          <div><span class="status-chip ${item.status}">${item.status}</span></div>
          <div>${item.gradeLevels.map((grade) => `${grade}-sinf`).join(", ")}</div>
          <div>${item.submissionCount} topshirish</div>
          <div>${formatDateTime(item.endAt)}</div>
        </div>
      `).join("")
    : `<div class="empty-state">Hozircha admin tomonidan yangi olimpiada yaratilmagan.</div>`;

  return `
    <section class="page-shell">
      <section class="banner">
        <strong>Admin panel</strong>
        <div class="helper">${escapeHtml(payload.admin.firstName)} ${escapeHtml(payload.admin.lastName)} tomonidan boshqariladi.</div>
      </section>

      <section class="overview-grid">
        <div class="stat-box"><span class="muted">Faol</span><strong>${payload.summary.active}</strong></div>
        <div class="stat-box"><span class="muted">Rejalashtirilgan</span><strong>${payload.summary.scheduled}</strong></div>
        <div class="stat-box"><span class="muted">Yakunlangan</span><strong>${payload.summary.ended}</strong></div>
        <div class="stat-box"><span class="muted">Jami topshirish</span><strong>${payload.summary.submissions}</strong></div>
      </section>

      <section class="admin-grid">
        <article class="panel">
          <div class="section-head">
            <div>
              <span class="eyebrow">No-code yaratish</span>
              <h2>Yangi olimpiada qo'shish</h2>
            </div>
            <button class="btn btn-secondary" type="button" data-add-question>Yangi savol</button>
          </div>
          <div class="message-box">
            ${t("admin_active_hint")}
          </div>
          <form id="admin-olympiad-form" class="stack">
            <div class="form-grid">
              <div class="field">
                <label for="title">Olimpiada nomi</label>
                <input id="title" name="title" required placeholder="Masalan: 8-sinf Ingliz Tili Olimpiadasi">
              </div>
              <div class="field">
                <label for="subject">Fan</label>
                <select id="subject" name="subject" required>
                  <option value="math">Matematika</option>
                  <option value="english">Ingliz tili</option>
                </select>
              </div>
              <div class="field full">
                <label for="description">Qisqacha tavsif</label>
                <textarea id="description" name="description" placeholder="Olimpiada haqida qisqacha ma'lumot"></textarea>
              </div>
              <div class="field">
                <label for="startAt">Boshlanish vaqti</label>
                <input id="startAt" name="startAt" type="datetime-local" value="${formatDateInput(new Date())}" required>
              </div>
              <div class="field">
                <label for="endAt">Tugash vaqti</label>
                <input id="endAt" name="endAt" type="datetime-local" value="${formatDateInput(new Date(Date.now() + 86400000))}" required>
              </div>
              <div class="field">
                <label for="durationMinutes">Davomiylik (daq.)</label>
                <input id="durationMinutes" name="durationMinutes" type="number" min="10" max="180" value="40" required>
              </div>
            </div>
            <div class="field full">
              <label>Mos sinflar</label>
              <div class="checkbox-grid">
                ${[5, 6, 7, 8, 9].map((grade) => `
                  <label class="checkbox-pill">
                    <input type="checkbox" name="gradeLevels" value="${grade}">
                    <span>${grade}-sinf</span>
                  </label>
                `).join("")}
              </div>
            </div>
            <div id="question-builder" class="question-builder">
              ${questionBuilderMarkup(0)}
              ${questionBuilderMarkup(1)}
            </div>
            <button class="btn btn-primary" type="submit">Olimpiadani saqlash</button>
          </form>
        </article>

        <article class="table-card">
          <span class="eyebrow">Yaratilgan olimpiadalar</span>
          <h3>Ro'yxat</h3>
          <div class="table-list">${olympiadRows}</div>
        </article>
      </section>
    </section>
  `;
}

function notFoundMarkup() {
  return `
    <section class="panel">
      <span class="eyebrow">404</span>
      <h1 class="page-title">${t("page_not_found")}</h1>
      <p class="section-copy">${t("page_not_found_body")}</p>
      <a class="btn btn-primary" href="/" data-link>${t("back_home")}</a>
    </section>
  `;
}

async function loadContext() {
  try {
    state.context = await api("/api/context");
  } catch (error) {
    state.context = {
      ok: false,
      offline: true,
      user: null,
      adminPortalPath: ADMIN_PORTAL_PATH,
    };
  }
}

async function handleLogout() {
  await api("/api/auth/logout", { method: "POST" });
  await loadContext();
  showToast(t("signed_out"));
  navigate("/", true);
}

function attachJumpButtons() {
  document.querySelectorAll("[data-jump-to]").forEach((button, index) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-jump-to]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const target = document.getElementById(button.dataset.jumpTo);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    if (index === 0) button.classList.add("active");
  });
}

function attachRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      // Backend ga so'rov yuborish
      const response = await api("/api/auth/register", { method: "POST", body: payload });

      // MUHIM: User ma'lumotini localStorage ga saqlash
      if (response.user) {
        localStorage.setItem('zukko_user', JSON.stringify(response.user));
        localStorage.setItem('zukko_student_code', response.user.studentCode);
      }

      showToast(`${t("registered_ok")} ${t("student_id")}: ${response.user.studentCode}`);

      // Dashboard ga o'tish
      navigate("/dashboard", true);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function attachLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;
  
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    
    try {
      const response = await api("/api/auth/login", {
        method: "POST",
        body: Object.fromEntries(data.entries()),
      });
      
      // MUHIM: User ma'lumotini localStorage ga saqlash
      if (response.user) {
        localStorage.setItem('zukko_user', JSON.stringify(response.user));
        localStorage.setItem('zukko_student_code', response.user.studentCode);
      }

      showToast(t("login_ok"));
      navigate("/dashboard", true);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function attachAdminLoginForm() {
  const form = document.getElementById("admin-login-form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    try {
      const response = await api("/api/auth/admin-login", {
        method: "POST",
        body: Object.fromEntries(data.entries()),
      });
      await loadContext();
      showToast(t("admin_login_ok"));
      navigate(response.redirectTo || ADMIN_PORTAL_PATH, true);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function attachOlympiadForm(olympiadId, questionCount) {
  const form = document.getElementById("olympiad-form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const answers = [];
    for (let i = 1; i <= questionCount; i += 1) {
      const selected = form.querySelector(`input[name="question-${i}"]:checked`);
      if (!selected) {
        showToast(t("all_answers_required"), "error");
        return;
      }
      answers.push(Number(selected.value));
    }

    try {
      const response = await api(`/api/student/olympiads/${olympiadId}/submit`, {
        method: "POST",
        body: { answers },
      });
      showToast(t("test_submitted"));
      navigate(response.redirectTo || "/dashboard", true);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
  attachJumpButtons();
}

function refreshQuestionIndexes() {
  document.querySelectorAll("[data-question-card]").forEach((card, index) => {
    const title = card.querySelector(".builder-head strong");
    if (title) title.textContent = `Savol ${index + 1}`;
  });
}

function attachAdminBuilder() {
  const addButton = document.querySelector("[data-add-question]");
  const builder = document.getElementById("question-builder");
  const form = document.getElementById("admin-olympiad-form");
  if (!builder || !form) return;

  addButton?.addEventListener("click", () => {
    builder.insertAdjacentHTML("beforeend", questionBuilderMarkup(builder.querySelectorAll("[data-question-card]").length));
    refreshQuestionIndexes();
  });

  builder.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-question]");
    if (!button) return;
    const cards = builder.querySelectorAll("[data-question-card]");
    if (cards.length <= 1) {
      showToast(t("at_least_one_question"), "error");
      return;
    }
    button.closest("[data-question-card]")?.remove();
    refreshQuestionIndexes();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const raw = new FormData(form);
    const gradeLevels = raw.getAll("gradeLevels").map(Number);
    const questions = Array.from(builder.querySelectorAll("[data-question-card]")).map((card) => ({
      text: card.querySelector('[name="questionText"]').value.trim(),
      options: [0, 1, 2, 3].map((index) => card.querySelector(`[name="option${index}"]`).value.trim()),
      correctIndex: Number(card.querySelector('[name="correctIndex"]').value),
    }));

    const payload = {
      title: raw.get("title"),
      subject: raw.get("subject"),
      description: raw.get("description"),
      startAt: new Date(raw.get("startAt")).toISOString(),
      endAt: new Date(raw.get("endAt")).toISOString(),
      durationMinutes: Number(raw.get("durationMinutes")),
      gradeLevels,
      questions,
    };

    try {
      await api("/api/admin/olympiads", { method: "POST", body: payload });
      showToast(t("olympiad_created"));
      navigate(ADMIN_PORTAL_PATH, true);
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  document.querySelectorAll("[data-end-olympiad]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!window.confirm(t("confirm_end"))) {
        return;
      }

      try {
        await api(`/api/admin/olympiads/${button.dataset.endOlympiad}/end`, { method: "POST" });
        showToast(t("olympiad_ended"));
        navigate(ADMIN_PORTAL_PATH, true);
      } catch (error) {
        showToast(error.message, "error");
      }
    });
  });
}

async function renderRoute() {
  renderHeader();
  renderFooter();
  renderLoading();

  const path = window.location.pathname;

  try {
    if (path === "/") {
      app.innerHTML = landingMarkup();
      return;
    }

    if (path === "/register") {
      if (isStudent()) {
        navigate("/dashboard", true);
        return;
      }
      app.innerHTML = registerMarkup();
      attachRegisterForm();
      return;
    }

    if (path === "/login") {
      if (isStudent()) {
        navigate("/dashboard", true);
        return;
      }
      app.innerHTML = loginMarkup();
      attachLoginForm();
      return;
    }

    if (path === "/dashboard") {
      if (!isStudent()) {
        navigate("/login", true);
        return;
      }
      const payload = await api("/api/student/dashboard");
      app.innerHTML = dashboardMarkup(payload.dashboard);
      document.querySelector("[data-open-help]")?.addEventListener("click", () => navigate("/help"));
      return;
    }

    if (path === "/help") {
      if (!isStudent()) {
        navigate("/login", true);
        return;
      }
      const payload = await api("/api/student/help");
      app.innerHTML = helpMarkup(payload.sections);
      return;
    }

    if (path.startsWith("/olympiads/")) {
      if (!isStudent()) {
        navigate("/login", true);
        return;
      }
      const olympiadId = path.split("/")[2];
      const payload = await api(`/api/student/olympiads/${olympiadId}`);
      app.innerHTML = olympiadMarkup(payload.olympiad);
      attachOlympiadForm(olympiadId, payload.olympiad.questions.length);
      return;
    }

    if (path.startsWith("/results/")) {
      if (!isStudent()) {
        navigate("/login", true);
        return;
      }
      const submissionId = path.split("/")[2];
      const payload = await api(`/api/student/results/${submissionId}`);
      app.innerHTML = resultMarkup(payload.result);
      attachJumpButtons();
      return;
    }

    if (path === ADMIN_PORTAL_PATH) {
      if (!isAdmin()) {
        app.innerHTML = adminLoginMarkup();
        attachAdminLoginForm();
        return;
      }
      const payload = await api("/api/admin/overview");
      app.innerHTML = adminDashboardMarkup(payload);
      attachAdminBuilder();
      return;
    }

    app.innerHTML = notFoundMarkup();
  } catch (error) {
    app.innerHTML = `
      <section class="panel">
        <span class="eyebrow">${t("generic_error")}</span>
        <h1 class="page-title">${t("page_load_error")}</h1>
        <p class="section-copy">${escapeHtml(error.message)}</p>
        <a class="btn btn-primary" href="/" data-link>${t("back_home")}</a>
      </section>
    `;
  }
}

document.addEventListener("click", async (event) => {
  const link = event.target.closest("[data-link]");
  if (link instanceof HTMLAnchorElement) {
    event.preventDefault();
    navigate(link.getAttribute("href"));
    return;
  }

  if (event.target.closest("[data-theme-toggle]")) {
    toggleTheme();
    return;
  }

  if (event.target.closest("[data-menu-toggle]")) {
    state.navOpen = !state.navOpen;
    renderHeader();
    return;
  }

  if (event.target.closest("[data-logout]")) {
    await handleLogout();
  }
});

document.addEventListener("change", (event) => {
  const select = event.target.closest("[data-language-select]");
  if (!select) {
    return;
  }

  applyLanguage(select.value);
  renderHeader();
  renderFooter();
  renderRoute();
});

window.addEventListener("popstate", renderRoute);

async function init() {
  applyLanguage(getLanguage());
  applyTheme(getTheme());
  renderHeader();
  renderFooter();
  await loadContext();
  await renderRoute();
}

init().catch((error) => {
  app.innerHTML = `<section class="panel"><h1 class="page-title">${t("generic_error")}</h1><p>${escapeHtml(error.message)}</p></section>`;
});
