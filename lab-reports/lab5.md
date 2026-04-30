# Лабораторна робота №5. Внутрішня перелінковка


## Мета роботи
Навчитись аудитувати внутрішню перелінковку сайту, виявляти типові помилки (orphan pages, надлишкові посилання, неправильні анкори), будувати схему перелінковки відповідно до silo-структури та впроваджувати виправлення безпосередньо у проект.

---


## Завдання

### 1. Аудит поточної перелінковки

#### 1.1 - Інвентаризація сторінок


| URL | Тип сторінки | Назва | Вхідні посилання | Вихідні посилання | Статус |
|:---|:---|:---|:---:|:---:|:---|
| `/` | home | Головна | — | 3 | **nav-only** |
| `/categories/frontend` | category | Frontend | 1 | 4 | **linked** |
| `/categories/backend` | category | Backend | 1 | 3 | **linked** |
| `/categories/databases` | category | Databases | 1 | 1 | **linked** |
| `/frontend/core-web-vitals-guide` | article | Core Web Vitals Guide | 1 | 2 | **linked** |
| `/frontend/css-grid-vs-flexbox` | article | CSS Grid vs Flexbox | 1 | 2 | **linked** |
| `/frontend/react-hooks-deep-dive` | article | A Deep Dive into React Hooks | 1 | 2 | **linked** |
| `/frontend/vue-3-pinia-state-management` | article | Vue 3 + Pinia Management | 1 | 2 | **linked** |
| `/backend/nestjs-rest-api-tutorial` | article | NestJS REST API Tutorial | 1 | 2 | **linked** |
| `/backend/getting-started-nodejs-express` | article | Node.js and Express Guide | 1 | 2 | **linked** |
| `/backend/introduction-to-graphql` | article | GraphQL API Tutorial | 1 | 2 | **linked** |
| `/databases/postgresql-performance-tips` | article | PostgreSQL Performance Tips | 1 | 2 | **linked** |
| `/about` | static | Про проект | 1 | 1 | **nav-only** |
| `/authors` | listing | Автори | 1 | 1 | **nav-only** |
| `/tags/[slug]` | dynamic | Теги | 1 | 1 | **nav-only** |
| `/search` | functional | Пошук | 1 | 1 | **nav-only** |
| `/admin` | functional | Адмін-панель | — | 1 | **nav-only** |

#### 1.2 - Виявлення orphan pages

Orphan page відсутні:

```bash
curl https://it-blog-news.pp.ua/ | grep /categories/backend
```

Заповнити у таблиці колонку "Статус":

```
linked     - є мінімум одне вхідне посилання
orphan     - жодного вхідного посилання
nav-only   - посилання тільки з навігації (не контекстне)
```

#### 1.3 - Аналіз анкорів

Для декількох будь-яких статей свого блогу переглянути всі вихідні посилання та заповнити таблицю (аркуш **"Anchor Audit"**):

#### Аналіз анкорів (Anchor Audit)

| Сторінка-джерело | Анкор текст | URL призначення | Тип анкору | Оцінка |
|:---|:---|:---|:---|:---:|
| `/frontend/react-hooks-deep-dive` | "управління станом у Vue 3" | `/frontend/vue-3-pinia-state-management` | descriptive | ✅ |
| `/frontend/css-grid-vs-flexbox` | "гайд по Core Web Vitals" | `/frontend/core-web-vitals-guide` | descriptive | ✅ |
| `/backend/nestjs-rest-api-tutorial` | "налаштування Node.js та Express" | `/backend/getting-started-nodejs-express` | partial-match | ✅ |
| `/frontend/core-web-vitals-guide` | "тут" | `/categories/frontend` | generic | ❌ |
| `/databases/postgresql-performance-tips` | "оптимізація PostgreSQL" | `/databases/postgresql-performance-tips` | exact-match | ⚠️ |
| `/backend/introduction-to-graphql` | `https://it-blog-news.pp.ua/...` | `/backend/nestjs-rest-api-tutorial` | naked URL | ❌ |
| `/frontend/vue-3-pinia-state-management` | "Blog.IT" | `/` | branded | ✅ |
| `/backend/getting-started-nodejs-express` | "мова запитів GraphQL" | `/backend/introduction-to-graphql` | partial-match | ✅ |                          |

#### 1.4 - Перевірка глибини кліків

| Сторінка | Найкоротший шлях від головної | Кількість кліків | Статус |
|:---|:---|:---:|:---:|
| `/frontend/core-web-vitals-guide` | `/` → `/frontend/...` | 1 | ✅ |
| `/frontend/css-grid-vs-flexbox` | `/` → `/frontend/...` | 1 | ✅ |
| `/backend/nestjs-rest-api-tutorial` | `/` → `/backend/...` | 1 | ✅ |
| `/frontend/react-hooks-deep-dive` | `/` → `/frontend/...` | 1 | ✅ |
| `/backend/getting-started-nodejs-express` | `/` → `/backend/...` | 1 | ✅ |
| `/frontend/vue-3-pinia-state-management` | `/` → `/frontend/...` | 1 | ✅ |
| `/databases/postgresql-performance-tips` | `/` → `/databases/...` | 1 | ✅ |
| `/backend/introduction-to-graphql` | `/` → `/backend/...` | 1 | ✅ |

#### 1.5 - Типові помилки - чек-ліст аудиту

| Помилка | Присутня | Де саме | Як виправити |
|:---|:---:|:---|:---|
| **Orphan pages** | Ні | — | Всі сторінки пов'язані з категоріями або головною. |
| **Generic анкори ("тут", "click here")** | **Так** | Статті про React Hooks та PostgreSQL | Замінити на описові (descriptive) або часткові (partial-match) анкори. |
| **Посилання на себе** | Ні | — | Сторінки посилаються на інші статті всередині силосу. |
| **Зламані внутрішні посилання (404)** | Ні | — | Всі URL у структурі проекту є валідними. |
| **Надлишкова перелінковка (10+ на абзац)** | Ні | — | Кількість вихідних посилань (1-3 на статтю) відповідає нормі. |
| **Глибина кліків > 3** | Ні | — | Всі статті доступні за 2 кліки від головної. |
| **Посилання через JS (onclick) замість <a>** | Ні | Весь сайт | Використовувати стандартні компоненти Link. |
| **Nofollow на внутрішніх посиланнях** | Ні | — | Всі внутрішні посилання мають бути "dofollow" для передачі ваги. |

---

### 2. Побудова схеми перелінковки
#### 2.1 — Принципи схеми для IT-блогу

Перед побудовою схеми зафіксовано базові правила для проекту:

**Горизонтальна перелінковка (всередині розділів):**
* **Категорія** → список усіх статей розділу.
* **Стаття** → 2 схожі публікації у блоці "Також читайте".
* **Стаття** → Breadcrumbs для повернення у батьківську категорію.

**Вертикальна перелінковка (між рівнями):**
* **Головна** → прямі посилання на статті.
* **Головна** → посилання на `/categories/frontend`, `/categories/backend` та `/categories/databases`.
* **Будь-яка сторінка** → логотип для повернення на головну.

**Перехресна перелінковка (між категоріями):**
* **Backend → Databases:** стаття `nestjs-rest-api-tutorial` посилається на `postgresql-performance-tips`.
* **Frontend → Backend:** стаття `react-hooks-deep-dive` містить лінк на `introduction-to-graphql`.
* **Службові посилання**.

#### 2.2 - Схема у Google Sheets

На аркуші **"Link Scheme"** побудувати повну схему перелінковки у вигляді таблиці:


| № | Звідки (URL) | Куди (URL) | Анкор текст | Тип посилання | Розміщення |
|:---:|:---|:---|:---|:---:|:---|
| 1 | `/` | `/categories/frontend` | Frontend | nav | Header Menu |
| 2 | `/` | `/categories/backend` | Backend | nav | Header Menu |
| 3 | `/` | `/categories/databases` | Databases | nav | Header Menu |
| 4 | `/` | `/about` | Про проект | nav | Header Menu |
| 5 | `/` | `/search` | Пошук | nav | Header Icon |
| 6 | `/` | `/frontend/core-web-vitals-guide` | Core Web Vitals | contextual | Featured (Home) |
| 7 | `/` | `/backend/nestjs-rest-api-tutorial` | NestJS REST API | contextual | Featured (Home) |
| 8 | `/categories/frontend` | `/frontend/core-web-vitals-guide` | Core Web Vitals | contextual | Article Card |
| 9 | `/categories/frontend` | `/frontend/css-grid-vs-flexbox` | CSS Grid & Flexbox | contextual | Article Card |
| 10 | `/categories/frontend` | `/frontend/react-hooks-deep-dive` | React Hooks | contextual | Article Card |
| 11 | `/categories/frontend` | `/frontend/vue-3-pinia-state-management` | Vue 3 & Pinia | contextual | Article Card |
| 12 | `/categories/backend` | `/backend/nestjs-rest-api-tutorial` | NestJS Tutorial | contextual | Article Card |
| 13 | `/categories/backend` | `/backend/getting-started-nodejs-express` | Node.js & Express | contextual | Article Card |
| 14 | `/categories/backend` | `/backend/introduction-to-graphql` | GraphQL Guide | contextual | Article Card |
| 15 | `/categories/databases` | `/databases/postgresql-performance-tips` | PostgreSQL Tips | contextual | Article Card |
| 16 | `/frontend/core-web-vitals-guide` | `/categories/frontend` | Frontend | breadcrumb | Breadcrumbs |
| 17 | `/frontend/react-hooks-deep-dive` | `/categories/frontend` | Frontend | breadcrumb | Breadcrumbs |
| 18 | `/backend/nestjs-rest-api-tutorial` | `/categories/backend` | Backend | breadcrumb | Breadcrumbs |
| 19 | `/databases/postgresql-performance-tips` | `/categories/databases` | Databases | breadcrumb | Breadcrumbs |
| 20 | `/frontend/css-grid-vs-flexbox` | `/frontend/core-web-vitals-guide` | оптимізація швидкості | contextual | Body Text |
| 21 | `/backend/nestjs-rest-api-tutorial` | `/databases/postgresql-performance-tips` | оптимізація запитів | contextual | Body Text |
| 22 | `/frontend/react-hooks-deep-dive` | `/backend/introduction-to-graphql` | робота з GraphQL | contextual | Body Text |
| 23 | `/backend/getting-started-nodejs-express` | `/backend/nestjs-rest-api-tutorial` | перехід на NestJS | related | Related Block |
| 24 | `/frontend/vue-3-pinia-state-management` | `/frontend/react-hooks-deep-dive` | React Hooks Guide | related | Related Block |
| 25 | `/about` | `/` | На головну | nav | Header Logo |
| 26 | `/authors` | `/` | Blog.IT | nav | Header Logo |
| 27 | `/admin` | `/` | Повернутись на сайт | nav | Header |

### Завдання 2.3 - Впровадження блоку пов'язаних статей
**Опис завдання:** Додати на сторінку `/articles/[slug]` (або `/[category]/[slug]`) блок "Схожі статті", який автоматично підбирає публікації з тієї самої категорії.

**Реалізація:**
Для реалізації функціоналу було розроблено двосторонню взаємодію:
1. **На рівні API:** Використовується ендпоінт `/api/articles/:slug/related`, який повертає масив статей, відфільтрованих за спільною категорією або тегами поточної статті.
2. **На рівні Інтерфейсу:** Було додано асинхронний запит у серверному компоненті сторінки статті. 

**Отримання даних:**
```typescript
// Запит за схожими статтями
let related: any[] = [];
try {
  const relRes = await fetch(`${API_URL}/api/articles/${finalSlug}/related`, { cache: "no-store" });
  if (relRes.ok) {
    const relData = await relRes.json();
    related = relData.data || relData || [];
  }
} catch (error) {
  console.error("Помилка завантаження схожих статей:", error);
}
```

### Завдання 2.4 - Впровадження breadcrumbs
**Опис завдання:** Додати навігаційний ланцюжок (breadcrumbs) на сторінку статті у форматі: `Головна / [Категорія] / [Назва статті]`.

**Реалізація:**
Breadcrumbs реалізовано за допомогою HTML-тегу `<nav>` та маркованого списку `<ol>`. Для формування правильних посилань було використано параметри з URL (масив `slug`), що дозволило динамічно генерувати посилання на сторінку категорії. Для розділення елементів використано символ слешу `/`.

## 3. Виправлення виявлених проблем

---
## Контрольні питання

### Рівень 1 - Розуміння термінів

#### 1. Що таке PageRank і як внутрішня перелінковка впливає на передачу "ваги" між сторінками?
**PageRank** — це "авторитет" сторінки в очах Google. Уяви, що кожна сторінка має певну кількість балів сили. Коли сторінка А посилається на сторінку Б, вона ніби "голосує" за неї та передає частину своєї сили. Внутрішня перелінковка — це мережа труб, якими цей "авторитет" тече від головної сторінки до твоїх статтей.

#### 2. Що таке orphan page і чому сторінка може бути в sitemap, але не бути знайденою Google?
**Orphan page (сторінка-сирота)** — це сторінка, на яку не веде жодне внутрішнє посилання з твого сайту. Навіть якщо вона є в `sitemap.xml` (списку всіх адрес), Google може вважати її неважливою або "підозрілою", бо сам сайт ніяк на неї не посилається. Пошуковики люблять знаходити сторінки через реальні зв'язки.

#### 3. Яка різниця між `rel="nofollow"` та `rel="noopener"`?
* **`rel="nofollow"`**: Каже пошуковику: "Я даю це посилання, але не хочу передавати йому свою SEO-вагу". Використовується для реклами або коментарів.
* **`rel="noopener"`**: Це про безпеку та швидкість. Воно не дає новій вкладці (яка відкрилася за посиланням) керувати твоєю сторінкою. Google це любить, бо це захищає користувача.

#### 4. Чому контекстні посилання (contextual links) цінніші за посилання в меню чи футері?
Контекстні посилання знаходяться всередині тексту статті. Google розуміє: "Якщо автор згадав це посилання прямо в розповіді, воно дуже важливе і стосується теми". Посилання в меню — це просто частина дизайну, яка повторюється всюди, тому вони мають меншу вагу.

#### 5. Що таке "crawl depth" і яке значення є прийнятним?
**Crawl depth (глибина сканування)** — це кількість кліків, які треба зробити від Головної сторінки, щоб дістатися до потрібної. Прийнятне значення — **не більше 3-4 кліків**. Якщо стаття захована на 10-й клік, Google може ніколи її не знайти.

---

### Рівень 2 - Аналіз

#### 1. На сторінці категорії є 50 посилань. Як це впливає на кожне окреме посилання?
PageRank сторінки ділиться порівну між усіма посиланнями на ній. Якщо на сторінці 50 посилань, кожне отримає лише 1/50 частину ваги. Якщо посилань занадто багато, кожне з них передає дуже мало "сили", що погано для просування конкретних статтей.

#### 2. Який анкор кращий: (а) "читати тут" чи (б) "як працюють замикання в JavaScript"?
Варіант **(б)** набагато кращий. Анкор (текст посилання) каже Google, про що буде наступна сторінка. Фраза "читати тут" нічого не пояснює, а варіант (б) містить ключові слова, за якими користувачі шукають інформацію.

#### 3. Як відсутність посилань між статтями в одній категорії впливає на silo-структуру?
Silo-структура передбачає, що схожі теми мають бути міцно зв'язані. Якщо статті не посилаються одна на одну, "авторитет" не циркулює всередині теми. Google гірше розуміє, що твій сайт є експертним у цій конкретній ніші (наприклад, у JavaScript).

#### 4. Що відбудеться з PageRank, якщо сторінка посилається сама на себе?
Це називається "циклічне посилання". Це не є великою проблемою, але це даремна трата ваги. Сторінка витрачає частину своєї сили на посилання, яке просто повертає користувача туди ж. Краще витратити цю силу на посилання на інші корисні сторінки.

#### 5. Передача "link juice" через header чи contextual посилання?
Контекстне посилання (в тілі статті) сильніше. Google використовує алгоритм "розумного серфера", який надає більше ваги посиланням, які з більшою ймовірністю натиснуть у контексті читання.

---

### Рівень 3 - Синтез та висновки

#### 1. Які сторінки твого сайту отримують найбільше посилань?
Зазвичай це Головна сторінка та Категорії, бо на них ведуть посилання з меню (header). Якщо ти хочеш просунути конкретну важливу статтю, вона має отримувати більше посилань з інших статтей, а не лише з категорії.

#### 2. Розподіл ваги PageRank 10 від головної сторінки.
Якщо на головній (PR 10) є 5 посилань, кожна категорія отримає PR 2. Якщо в категорії JavaScript є 10 статтей, кожна стаття отримає PR 0.2. Найменше отримають сторінки на 3-4 рівні вкладеності, на які веде мало посилань.

#### 3. Аналіз IT-ресурсів (DOU, AIN).
Вони використовують:
* **Breadcrumbs**: для передачі ваги вгору (до категорій).
* **Related articles**: для горизонтальної передачі ваги між схожими статтями.
* **Теги**: для створення додаткових вузлів, які збирають і роздають вагу за вузькими темами.

#### 4. Схема для серії статей (Course/Series).
Для серії статей варто створити "батьківську" сторінку курсу, яка посилається на всі уроки. Кожен урок має посилатися на "Попередній" та "Наступний" уроки. Це створює міцний ланцюг, де вага рівномірно тече по всій серії, а Google розуміє логічну послідовність навчання.
