# Лабораторна робота №5. Внутрішня перелінковка


## Мета роботи
Навчитись аудитувати внутрішню перелінковку сайту, виявляти типові помилки (orphan pages, надлишкові посилання, неправильні анкори), будувати схему перелінковки відповідно до silo-структури та впроваджувати виправлення безпосередньо у проект.

---


## Завдання

### 1. Аудит поточної перелінковки

#### 1.1 - Інвентаризація сторінок


| URL | Тип сторінки | Назва | Вхідні посилання | Вихідні посилання | Статус |
|:---|:---|:---|:---:|:---:|:---|
| `/` | home | Головна | — | 7 | **nav-only** |
| `/categories/architecture` | category | Architecture | 1 | 1 | **linked** |
| `/categories/backend` | category | Backend | 2 | 2 | **linked** |
| `/categories/AI` | category | Career | 0 | 0 | **linked** |
| `/categories/databases` | category | Databases | 1 | 1 | **linked** |
| `/categories/devops` | category | DevOps | 3 | 3 | **linked** |
| `/categories/frontend` | category | Frontend | 3 | 3 | **linked** |
| `/categories/javascript` | category | JavaScript | 0 | 0 | **linked** |
| `/articles/microservices-architecture-intro` | article | An Introduction to Microservices Architecture | 1 | 1 | **linked** |
| `/articles/getting-started-nodejs-express` | article | Getting Started with Node.js and Express | 2 | 1 | **linked** |
| `/articles/introduction-to-graphql` | article | GraphQL: A Query Language for your API | 2 | 1 | **linked** |
| `/articles/postgresql-performance-tips` | article | PostgreSQL Performance Tips | 2 | 1 | **linked** |
| `/articles/github-actions-ci-cd` | article | Automate Your Workflow with GitHub Actions | 3 | 1 | **linked** |
| `/articles/iac-with-terraform` | article | Infrastructure as Code with Terraform | 2 | 1 | **linked** |
| `/articles/kubernetes-101-core-concepts` | article | Kubernetes 101: Core Concepts | 2 | 1 | **linked** |
| `/articles/react-hooks-deep-dive` | article | A Deep Dive into React Hooks | 3 | 1 | **linked** |
| `/articles/vue-3-pinia-state-management` | article | Modern State Management in Vue 3 with Pinia | 2 | 1 | **linked** |
| `/articles/mastering-typescript-generics` | article | Mastering TypeScript Generics | 1 | 1 | **linked** |
| `/about` | static | Про нас | — | — | **nav-only** |
| `/authors` | listing | Автори | — | — | **nav-only** |
| `/tags/[slug]` | dynamic | Теги | — | — | **nav-only** |
| `/search` | functional | Пошук | — | — | **nav-only** |
| `/admin` | functional | Адмін | — | — | **nav-only** |

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

Для 5 будь-яких статей свого блогу переглянути всі вихідні посилання та заповнити таблицю (аркуш **"Anchor Audit"**):

#### Аналіз анкорів (Anchor Audit)

| Сторінка-джерело | Анкор текст | URL призначення | Тип анкору | Оцінка |
|:---|:---|:---|:---|:---:|
| `/articles/react-hooks-deep-dive` | "тут" | `/articles/vue-3-pinia-state-management` | generic | ❌ |
| `/articles/react-hooks-deep-dive` | "react hooks deep dive" | `/articles/react-hooks-deep-dive` | exact-match | ⚠️ |
| `/articles/react-hooks-deep-dive` | "Головна → Frontend" | `/categories/frontend` | breadcrumb | ✅ |
| `/articles/microservices-architecture-intro` | "вступ до мікросервісів" | `/articles/microservices-architecture-intro` | partial-match | ✅ |
| `/articles/microservices-architecture-intro` | "https://blog.it/articles/nodejs-express" | `/articles/getting-started-nodejs-express` | naked URL | ❌ |
| `/articles/getting-started-nodejs-express` | "як налаштувати Express" | `/articles/getting-started-nodejs-express` | descriptive | ✅ |
| `/articles/github-actions-ci-cd` | "IT Blog" | `/` | branded | ✅ |
| `/articles/introduction-to-graphql` | "мова запитів GraphQL" | `/articles/introduction-to-graphql` | partial-match | ✅ |
| `/articles/postgresql-performance-tips` | "читати" | `/articles/github-actions-ci-cd` | generic | ❌ |         | ✅                           |

#### 1.4 - Перевірка глибини кліків

| Сторінка | Шлях від головної | Кількість кліків | Статус |
|:---|:---|:---:|:---:|
| `/articles/microservices-architecture-intro` | `/` → `/categories/architecture` → `/articles/...` | 2 | ✅ |
| `/articles/getting-started-nodejs-express` | `/` → `/categories/backend` → `/articles/...` | 2 | ✅ |
| `/articles/introduction-to-graphql` | `/` → `/categories/backend` → `/articles/...` | 2 | ✅ |
| `/articles/postgresql-performance-tips` | `/` → `/categories/databases` → `/articles/...` | 2 | ✅ |
| `/articles/github-actions-ci-cd` | `/` → `/categories/devops` → `/articles/...` | 2 | ✅ |
| `/articles/iac-with-terraform` | `/` → `/categories/devops` → `/articles/...` | 2 | ✅ |
| `/articles/kubernetes-101-core-concepts` | `/` → `/categories/devops` → `/articles/...` | 2 | ✅ |
| `/articles/react-hooks-deep-dive` | `/` → `/categories/frontend` → `/articles/...` | 2 | ✅ |
| `/articles/vue-3-pinia-state-management` | `/` → `/categories/frontend` → `/articles/...` | 2 | ✅ |
| `/articles/mastering-typescript-generics` | `/` → `/categories/frontend` → `/articles/...` | 2 | ✅ |

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

**Горизонтальна перелінковка (всередині силосу):**
* **Категорія** → список усіх статей цієї категорії.
* **Стаття** → 2-3 схожі статті тієї ж категорії (блок "Також читайте").
* **Стаття** → посилання на батьківську категорію (Breadcrumbs).

**Вертикальна перелінковка (між рівнями):**
* **Головна** → посилання на всі категорії (меню навігації).
* **Головна** → блоки з останніми публікаціями (картки статей).
* **Категорія** → повернення на головну (логотип у хедері).

**Перехресна перелінковка (між силосами) — з обережністю:**
* **Стаття Backend** → стаття **Databases** (логічний зв'язок API та БД). ✅
* **Стаття Frontend** → категорія **JavaScript** (контекстне посилання на мову). ✅
* **Стаття DevOps** → стаття **Architecture** (зв'язок інфраструктури та проектування). ✅
* **Будь-яка сторінка** → сторінка **Про нас** (структурне посилання у футері). ✅

#### 2.2 - Схема у Google Sheets

На аркуші **"Link Scheme"** побудувати повну схему перелінковки у вигляді таблиці:

#### 2.2 - Повна схема перелінковки (Link Scheme)

| № | Звідки (URL) | Куди (URL) | Анкор текст | Тип посилання | Розміщення |
|:---:|:---|:---|:---|:---:|:---|
| 1 | `/` | `/categories/architecture` | Architecture | nav | Header Menu |
| 2 | `/` | `/categories/backend` | Backend | nav | Header Menu |
| 3 | `/` | `/categories/career` | Career | nav | Header Menu |
| 4 | `/` | `/categories/databases` | Databases | nav | Header Menu |
| 5 | `/` | `/categories/devops` | DevOps | nav | Header Menu |
| 6 | `/` | `/categories/frontend` | Frontend | nav | Header Menu |
| 7 | `/` | `/categories/javascript` | JavaScript | nav | Header Menu |
| 8 | `/` | `/about` | Про блог | nav | Header Menu |
| 9 | `/` | `/search` | Пошук | nav | Header (Icon) |
| 10 | `/` | `/articles/react-hooks-deep-dive` | React Hooks Guide | contextual | Featured (Home) |
| 11 | `/` | `/articles/github-actions-ci-cd` | CI/CD Workflow | contextual | Featured (Home) |
| 12 | `/categories/architecture` | `/articles/microservices-architecture-intro` | Microservices Intro | contextual | Article Card |
| 13 | `/categories/backend` | `/articles/getting-started-nodejs-express` | Node.js & Express | contextual | Article Card |
| 14 | `/categories/backend` | `/articles/introduction-to-graphql` | GraphQL API | contextual | Article Card |
| 15 | `/categories/databases` | `/articles/postgresql-performance-tips` | PostgreSQL Tips | contextual | Article Card |
| 16 | `/categories/devops` | `/articles/github-actions-ci-cd` | GitHub Actions | contextual | Article Card |
| 17 | `/categories/devops` | `/articles/iac-with-terraform` | Terraform Guide | contextual | Article Card |
| 18 | `/categories/devops` | `/articles/kubernetes-101-core-concepts` | Kubernetes Basics | contextual | Article Card |
| 19 | `/categories/frontend` | `/articles/react-hooks-deep-dive` | Deep Dive: Hooks | contextual | Article Card |
| 20 | `/categories/frontend` | `/articles/vue-3-pinia-state-management` | Pinia State | contextual | Article Card |
| 21 | `/categories/frontend` | `/articles/mastering-typescript-generics` | TS Generics | contextual | Article Card |
| 22 | `/articles/microservices-architecture-intro` | `/categories/architecture` | Architecture | breadcrumb | Breadcrumbs |
| 23 | `/articles/getting-started-nodejs-express` | `/categories/backend` | Backend | breadcrumb | Breadcrumbs |
| 24 | `/articles/introduction-to-graphql` | `/categories/backend` | Backend | breadcrumb | Breadcrumbs |
| 25 | `/articles/postgresql-performance-tips` | `/categories/databases` | Databases | breadcrumb | Breadcrumbs |
| 26 | `/articles/github-actions-ci-cd` | `/categories/devops` | DevOps | breadcrumb | Breadcrumbs |
| 27 | `/articles/iac-with-terraform` | `/categories/devops` | DevOps | breadcrumb | Breadcrumbs |
| 28 | `/articles/kubernetes-101-core-concepts` | `/categories/devops` | DevOps | breadcrumb | Breadcrumbs |
| 29 | `/articles/react-hooks-deep-dive` | `/categories/frontend` | Frontend | breadcrumb | Breadcrumbs |
| 30 | `/articles/vue-3-pinia-state-management` | `/categories/frontend` | Frontend | breadcrumb | Breadcrumbs |
| 31 | `/articles/mastering-typescript-generics` | `/categories/frontend` | Frontend | breadcrumb | Breadcrumbs |
| 32 | `/articles/microservices-architecture-intro` | `/articles/getting-started-nodejs-express` | побудова API на Node.js | contextual | Body Text |
| 33 | `/articles/getting-started-nodejs-express` | `/articles/introduction-to-graphql` | використання GraphQL | contextual | Body Text |
| 34 | `/articles/introduction-to-graphql` | `/articles/postgresql-performance-tips` | оптимізація запитів БД | contextual | Body Text |
| 35 | `/articles/github-actions-ci-cd` | `/articles/iac-with-terraform` | розгортання через Terraform | contextual | Body Text |
| 36 | `/articles/react-hooks-deep-dive` | `/articles/vue-3-pinia-state-management` | управління стейтом у Vue | related | Related Block |
| 37 | `/articles/vue-3-pinia-state-management` | `/articles/mastering-typescript-generics` | TypeScript для розробника | related | Related Block |
| 38 | `/articles/iac-with-terraform` | `/articles/kubernetes-101-core-concepts` | оркестрація в Kubernetes | related | Related Block |
| 39 | `/about` | `/` | Повернутись на головну | nav | Header Logo |
| 40 | `/authors` | `/` | Головна сторінка | nav | Header Logo |
| 41 | `/tags/[slug]` | `/` | На головну | nav | Header Logo |
| 42 | `/admin` | `/` | На сайт | nav | Header |

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
