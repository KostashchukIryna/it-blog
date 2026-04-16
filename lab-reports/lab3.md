# Лабораторна робота №3. Семантичне ядро та структура сайту

### 1. Класифікація типів пошукових запитів

#### 1.2 - Практичне завдання

| № | Пошуковий запит | Тип інтенту | Обґрунтування |
| :--- | :--- | :--- | :--- |
| 1 | що таке react hooks | Informational | Користувач шукає пояснення концепції, хоче дізнатися як це працює. |
| 2 | як стати backend розробником з нуля | Informational | Пошук інструкції, гайду або покрокової дорожньої карти для навчання. |
| 3 | основи реляційних баз даних sql | Informational | Запит на навчальний теоретичний матеріал. |
| 4 | devops інженер чим займається | Informational | Користувач хоче зрозуміти суть професії та посадові обов'язки. |
| 5 | патерни проектування мікросервісної архітектури | Informational | Шукає теоретичну інформацію про архітектурні підходи. |
| 6 | react офіційна документація | Navigational | Мета - перейти на конкретний офіційний ресурс розробників React. |
| 7 | github login | Navigational | Користувач шукає конкретну сторінку входу до системи контролю версій. |
| 8 | aws console sign in | Navigational | Пошук точної сторінки авторизації відомого хмарного сервісу. |
| 9 | npm js | Navigational | Бажання перейти безпосередньо на головну сторінку реєстру пакетів Node.js. |
| 10 | node.js download | Navigational | Прямий пошук сторінки завантаження на офіційному сайті технології. |
| 11 | завантажити docker desktop | Transactional | Користувач має намір виконати конкретну дію — завантажити програму. |
| 12 | купити курс по javascript | Transactional | Явний намір здійснити транзакцію (витратити гроші на навчання). |
| 13 | підписка на it блог newsletter | Transactional | Намір здійснити цільову дію - зареєструватися для отримання розсилки. |
| 14 | vscode скачати | Transactional | Готовність виконати дію (завантаження та встановлення редактора коду). |
| 15 | замовити аудит архітектури бази даних | Transactional | Комерційний транзакційний запит, намір найняти спеціаліста або компанію. |
| 16 | react vs vue що обрати | Commercial | Користувач порівнює технології перед прийняттям рішення, що вивчати. |
| 17 | postgresql чи mysql порівняння продуктивності | Commercial | Дослідження та вибір між двома конкретними рішеннями для бази даних. |
| 18 | найкращі курси для devops | Commercial | Пошук списку варіантів (рейтингу чи відгуків) перед покупкою навчання. |
| 19 | macbook чи windows для програмування | Commercial | Дослідження варіантів і характеристик перед дорогою покупкою техніки. |
| 20 | aws vs azure для стартапу | Commercial | Порівняння хмарних платформ для прийняття зваженого бізнес-рішення. |
| 21 | курси it онлайн | Transactional | "Related search" для запиту "купити курс по javascript". |
| 22 | онлайн школа програмування | Transactional | "Related search" для запиту "купити курс по javascript". |
| 23 | для чого react | Informational | "People also ask" для запиту "що таке react hooks". |
| 24 | що таке state react | Informational | "People also ask" для запиту "що таке react hooks". |
| 25 | git windows | Navigational | "Related search" для запиту "github login". |
| 26 | github pages | Informational | "Related search" для запиту "github login". |

#### 1.3 - Аналіз через Google Search

Для детального аналізу було обрано 3 запити з основної таблиці. Нижче наведено зафіксовані результати з пошукової видачі Google, які допомогли розширити семантичне ядро:

**Запит 1: "що таке react hooks"**
* **Autocomplete:**
    * що таке react hooks простими словами
    * що таке react hooks українською
* **People also ask:**
    * для чого react
    * що таке state react
* **Related searches:**
    * react hooks приклади
    * custom hooks react

**Запит 2: "купити курс по javascript"**
* **Autocomplete:**
    * купити курс по javascript безкоштовно
    * купити курс по javascript українсбкою
    * купити курс по javascript з нуля
* **People also ask:**
    * Скільки коштують курси JavaScript?
* **Related searches:**
    * курси it онлайн
    * онлайн школа програмування
    * курс frontend

**Запит 3: "github login"**
* **Autocomplete:**
    * github login command
    * github login with microsoft
* **People also ask:**
    * Як увійти в свій акаунт GitHub?
    * Як підключити Git до GitHub?
* **Related searches:**
    * git windows
    * github pages
    * github desktop download

### 2. Збір семантичного ядра

#### 2.2 — Збір через Google Keyword Planner

На основі вивантаженої статистики з Google Keyword Planner було відібрано 40 найбільш релевантних ключових запитів для IT-блогу. 

| № | keyword | intent | volume | competion | cluster | target_page | priority | notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | бази даних sql | informational | 50 | Low | databases | `/bazy-danyh-sql` | 1 | Базовий запит |
| 2 | що таке штучний інтелект | informational | 5000 | Low | architecture | `/sho-take-shtuchniy-intelect` | 1 | Вічнозелений контент |
| 3 | sql база даних | informational | 50 | Low | databases | `/sql-baza-danyh` | 1 | Базовий запит |
| 4 | сервер баз даних | informational | 50 | High | databases | `/server-baz-danyh` | 1 | Базовий запит |
| 5 | react vs angular | commercial | 500 | Low | frontend-development | `/react-vs-angular` | 1 | Зростання інтересу +900% |
| 6 | system design basics | informational | 50 | Low | architecture | `/system-design-basics` | 2 | Підготовка до співбесід |
| 7 | best developer tools | informational | 50 | Medium | devops-engineering | `/best-developer-tools` | 2 | Оглядова стаття |
| 8 | docker compose tutorial | informational | 25 | Low | devops-engineering | `/docker-compose-tutorial` | 2 | Практичний гайд |
| 9 | best low code platform | informational | 50 | Unknown | architecture | `/best-low-code-platform` | 2 | Огляд платформ |
| 10 | best mobile app developers | informational | 50 | Low | career | `/best-mobile-app-developers` | 3 | Аналітика ринку |
| 11 | software development tools | informational | 50 | Medium | architecture | `/software-development-tools` | 2 | Інструментарій |
| 12 | vue vs react | commercial | 50 | Low | frontend-development | `/vue-vs-react` | 1 | Порівняння фреймворків |
| 13 | best ai tools for developers | informational | 50 | Medium | architecture | `/best-ai-tools-for-devs` | 2 | Тренди AI інструментів |
| 14 | blazor vs angular | commercial | 50 | Low | frontend-development | `/blazor-vs-angular` | 1 | Порівняння .NET та JS |
| 15 | spring mongodb | informational | 50 | Low | databases | `/spring-mongodb` | 1 | NoSQL інтеграція |
| 16 | unit testing tools | informational | 50 | Unknown | backend-development | `/unit-testing-tools` | 1 | Якість та тестування |
| 17 | spring boot kafka | informational | 50 | Low | backend-development | `/spring-boot-kafka` | 1 | Потокова обробка даних |
| 18 | react vs angular vs vue | commercial | 50 | Low | frontend-development | `/react-vs-angular-vs-vue` | 1 | Велике порівняння |
| 19 | best python debugger | informational | 50 | Unknown | backend-development | `/best-python-debugger` | 1 | Інструменти відладки |
| 20 | aws lambda spring boot example | informational | 50 | Unknown | devops-engineering | `/aws-lambda-spring-boot` | 2 | Serverless архітектура |
| 21 | best sdk | informational | 50 | Unknown | architecture | `/best-sdk-for-developers` | 2 | Огляд розробницьких SDK |
| 22 | dynamodb spring boot example | informational | 50 | Unknown | databases | `/dynamodb-spring-boot` | 1 | NoSQL інтеграція |
| 23 | flutter vs angular for web | commercial | 50 | Unknown | frontend-development | `/flutter-vs-angular-web` | 1 | Порівняння фреймворків |
| 24 | front end developer best practices | informational | 50 | Low | frontend-development | `/frontend-best-practices` | 1 | Поради для розробників |
| 25 | grpc spring boot example | informational | 50 | Low | backend-development | `/grpc-spring-boot` | 1 | Мікросервісна взаємодія |
| 26 | java ee spring boot | informational | 50 | Medium | backend-development | `/java-ee-spring-boot` | 1 | Enterprise розробка |
| 27 | java spring mongodb | informational | 50 | Medium | databases | `/java-spring-mongodb` | 1 | Робота з NoSQL |
| 28 | junit testing in spring boot | informational | 50 | Low | backend-development | `/junit-testing-spring-boot` | 1 | Тестування коду |
| 29 | keycloak spring boot example | informational | 50 | Low | backend-development | `/keycloak-spring-boot` | 1 | Авторизація та безпека |
| 30 | software programming tool | informational | 50 | Medium | architecture | `/software-programming-tool` | 2 | Інструментарій |
| 31 | spring boot opentelemetry example | informational | 50 | Medium | devops-engineering | `/spring-boot-opentelemetry` | 2 | Моніторинг та логування |
| 32 | springboot oracle | informational | 50 | Unknown | databases | `/springboot-oracle` | 1 | Реляційні БД |
| 33 | useful tools for programmers | informational | 50 | Medium | architecture | `/useful-tools-for-programmers` | 2 | Огляд інструментів |
| 34 | why react is better than angular | informational | 50 | Low | frontend-development | `/why-react-better-angular` | 1 | Аналітика фреймворків |
| 35 | which is better to learn react or angular | informational | 50 | Low | frontend-development | `/react-or-angular-to-learn` | 1 | Поради новачкам |
| 36 | unit testing tools for c++ | informational | 50 | Unknown | architecture | `/unit-testing-tools-cpp` | 2 | QA інструменти |
| 37 | test jpa repository spring boot | informational | 50 | Unknown | backend-development | `/test-jpa-repository` | 1 | Тестування БД |
| 38 | springboot mongodb example | informational | 50 | Medium | databases | `/springboot-mongodb-example` | 1 | Практичний код |
| 39 | python debugger atom | informational | 50 | Unknown | architecture | `/python-debugger-atom` | 2 | Налагодження коду |
| 40 | next js vs angular | commercial | 50 | Low | frontend-development | `/nextjs-vs-angular` | 1 | Порівняння технологій |




#### 2.3 - Розширення через Google Trends

Для перевірки пріоритетів, визначення сезонності та оптимізації фінального семантичного ядра було проведено аналіз ключових запитів у Google Trends (Регіон: Україна, Період: 12 місяців). 

**Пошук 1: "React" vs "Angular" vs "Vue.js"**
* **Висновок:** Аналіз чітко демонструє беззаперечну перевагу React на українському ринку (середній показник зацікавленості — 77, що майже в 4 рази вище за Angular з показником 21). Vue.js має найнижчий рівень інтересу (12). На графіку простежується сезонне просідання попиту на всі три технології в кінці грудня, після чого йде відновлення інтересу та різкий весняний пік для React. Це підтверджує необхідність фокусування Frontend-кластеру саме на екосистемі React.
![1](https://hackmd.io/_uploads/HJ8mBP0n-g.jpg)


**Пошук 2: "javascript" vs "js"**
* **Висновок:** Дані підтверджують, що скорочена абревіатура "js" (середній показник 67) використовується аудиторією в Україні значно частіше ніж повна назва "javascript" (середній показник 18). Отже, у SEO-заголовках та URL-адресах ефективніше використовувати коротке написання "js".
![2](https://hackmd.io/_uploads/rJZVBDC3bg.jpg)

### 3. Кластеризація запитів

Кластеризація - це групування ключових слів за спільним пошуковим інтентом та темою так, щоб кожен кластер відповідав одній сторінці сайту.

#### 3.2 - Практичне завдання

| cluster | Кількість запитів | Головний запит | Тип сторінки | Пріоритет |
| :--- | :--- | :--- | :--- | :--- |
| `frontend-development` | 9 | react vs angular | category | 1 |
| `backend-development` | 8 | java spring boot | category | 1 |
| `devops-engineering` | 4 | devops інструменти | category | 2 |
| `databases` | 8 | бази даних sql | category | 1 |
| `architecture` | 10 | system design basics | category | 2 |
| `career` | 1 | best mobile app developers | category | 3 |

**Пояснення до пріоритетів:**
* Кластери `frontend-development`, `backend-development` та `databases` отримали найвищий пріоритет (**1**). Це фундаментальні технічні напрямки, які містять найбільше запитів із високим попитом та генеруватимуть основний навчальний трафік блогу.
* Кластери `devops-engineering` та `architecture` (пріоритет **2**) є більш просунутими темами. Вони важливі для розширення аудиторії до рівня Middle/Senior фахівців і впроваджуватимуться паралельно з базовим контентом.
* Кластер `career` (пріоритет **3**) відіграє допоміжну роль. Він розширюватиметься поступово для підкріплення загальної експертності домену та залучення нетехнічного або суміжного трафіку.

### 4. Побудова Silo-структури сайту

#### 4.1 - Структура IT блогу

**Рівень 0 - Головна**

| URL | Назва сторінки | Тип  | Head keyword      | Опис                          |
|-----|----------------|------|-------------------|-------------------------------|
| `/` | Головна        | home | "Blog.IT" | Останні статті всіх категорій |

**Рівень 1 - Категорії (силоси)**

| URL | Назва | Тип | Head keyword | Пов'язані категорії |
| :--- | :--- | :--- | :--- | :--- |
| `/categories/architecture` | Architecture | category | "software architecture" | |
| `/categories/backend` | Backend | category | "backend development" | |
| `/categories/career` | Career | category | "it career advice" | |
| `/categories/databases` | Databases | category | "database systems" | |
| `/categories/devops` | DevOps | category | "devops для початківців" | |
| `/categories/frontend` | Frontend | category | "frontend development" | |
| `/categories/javascript` | JavaScript | category | "javascript tutorial" | |

**Рівень 2 - Статті всередині силосу**

| URL | Назва статті | Категорія | Target keyword | Посилається на | Отримує посилання від |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/articles/microservices-architecture-intro` | An Introduction to Microservices Architecture | architecture | "microservices architecture" | `/articles/getting-started-nodejs-express` | `/categories/architecture` |
| `/articles/getting-started-nodejs-express` | Getting Started with Node.js and Express | backend | "nodejs express tutorial" | `/articles/introduction-to-graphql` | `/categories/backend` |
| `/articles/introduction-to-graphql` | GraphQL: A Query Language for your API | backend | "introduction to graphql" | `/articles/postgresql-performance-tips` | `/categories/backend` |
| `/articles/postgresql-performance-tips` | PostgreSQL Performance Tips | databases | "postgresql performance" | `/articles/github-actions-ci-cd` | `/categories/databases` |
| `/articles/github-actions-ci-cd` | Automate Your Workflow with GitHub Actions | devops | "github actions ci cd" | `/articles/iac-with-terraform` | `/categories/devops` |
| `/articles/iac-with-terraform` | Infrastructure as Code with Terraform | devops | "iac with terraform" | `/articles/kubernetes-101-core-concepts` | `/categories/devops` |
| `/articles/kubernetes-101-core-concepts` | Kubernetes 101: Core Concepts | devops | "kubernetes 101 guide" | `/articles/github-actions-ci-cd` | `/categories/devops` |
| `/articles/react-hooks-deep-dive` | A Deep Dive into React Hooks | frontend | "react hooks deep dive" | `/articles/vue-3-pinia-state-management` | `/categories/frontend` |
| `/articles/vue-3-pinia-state-management` | Modern State Management in Vue 3 with Pinia | frontend | "vue 3 pinia state" | `/articles/react-hooks-deep-dive` | `/categories/frontend` |
| `/articles/mastering-typescript-generics` | Mastering TypeScript Generics | frontend | "typescript generics guide" | `/articles/react-hooks-deep-dive` | `/categories/frontend` |

**Рівень 3 - Допоміжні сторінки**

| URL            | Назва   | Тип        |
|----------------|---------|------------|
| `/about`       | Про нас | static     |
| `/authors`     | Автори  | listing    |
| `/tags/[slug]` | Теги    | dynamic    |
| `/search`      | Пошук   | functional |
| `/admin `      | Адмін   | functional |

#### 4.2 - Схема внутрішніх посилань

| Звідки | Куди | Тип посилання | Анкор текст |
| :--- | :--- | :--- | :--- |
| `/` | `/about` | info | "Про нас" |
| `/` | `/admin` | action | "Логін" |
| `/` | `/search` | action | "Пошук" |
| `/categories/javascript` | `/articles/react-hooks-deep-dive` | contextual | "повний гайд по React Hooks" |
| `/articles/react-hooks-deep-dive` | `/articles/vue-3-pinia-state-management` | related | "управління станом у Vue 3" |
| `/articles/vue-3-pinia-state-management` | `/categories/frontend` | breadcrumb | "Frontend" |
| `/articles/mastering-typescript-generics` | `/articles/react-hooks-deep-dive` | contextual | "типізація власних хуків" |
| `/articles/getting-started-nodejs-express` | `/articles/introduction-to-graphql` | contextual | "перехід на GraphQL" |
| `/articles/introduction-to-graphql` | `/categories/backend` | breadcrumb | "Backend" |
| `/articles/microservices-architecture-intro` | `/articles/getting-started-nodejs-express` | related | "реалізація на Node.js" |
| `/articles/postgresql-performance-tips` | `/categories/databases` | breadcrumb | "Databases" |
| `/articles/github-actions-ci-cd` | `/articles/iac-with-terraform` | contextual | "автоматизація Terraform" |
| `/articles/iac-with-terraform` | `/articles/kubernetes-101-core-concepts` | related | "деплой у Kubernetes" |
| `/articles/kubernetes-101-core-concepts` | `/categories/devops` | breadcrumb | "DevOps" |
| `/articles/react-hooks-deep-dive` | `/categories/javascript` | breadcrumb | "JavaScript" |
| `/articles/getting-started-nodejs-express` | `/articles/postgresql-performance-tips` | related | "робота з базою даних" |

Contextual (Контекстне) — посилання в тексті на споріднену тему.

Related (Пов’язане) — пропозиція схожих матеріалів для читання.

Breadcrumb (Навігаційне) — шлях для повернення до категорії.

Info (Інформаційне) — посилання на службові сторінки (про нас).

Action (Дія) — функціональне посилання для виконання конкретної операції (логін, реєстрація, пошук).

#### 4.3 - Перевірка структури

1.  Кожна категорія є окремим тематичним силосом, що групує споріднений контент.
2.  Майже немає перехресних посилань між різними силосами. є мінімальні (наприклад, TypeScript → React Hooks).
3.  Максимальна глибина 2 кліки. Маршрут: Головна сторінка → Категорія → Стаття.
4.  orphan pages відсутні. Усі статті мають вхідні посилання від своїх категорій, головної сторінки або через внутрішню перелінковку.

---

### Контрольні питання

#### Рівень 1 - Розуміння термінів

**1. Що таке пошуковий інтент і чому Google надає йому пріоритет над точним входженням ключового слова?**
Пошуковий інтент — це справжня мета користувача, який вводить запит. Google надає йому пріоритет, бо прагне задовольнити потребу людини, а не просто знайти збіг тексту. Якщо користувач шукає "React", він може шукати бібліотеку (інформаційний інтент), а не вакансію. Якщо контент не відповідає інтенту, точне входження ключового слова не допоможе сторінці піднятися в ТОП.

**2. Яка різниця між head keywords, mid-tail та long-tail запитами? Наведіть приклади для IT тематики.**
* **Head keywords:** Короткі, загальні запити з величезним обсягом пошуку та конкуренцією. Приклад: `Java`.
* **Mid-tail:** Більш конкретні фрази (2-3 слова). Приклад: `Java spring boot tutorial`.
* **Long-tail:** Довгі, дуже специфічні запити з низькою частотністю. Приклад: `how to connect postgresql to spring boot application`.

**3. Що таке семантичне ядро і чим воно відрізняється від простого списку ключових слів?**
Семантичне ядро — це структурована база запитів, які відображають тематику сайту. Від простого списку воно відрізняється наявністю **кластеризації** (групування слів за змістом та інтентом) та ієрархією, що дозволяє правильно розподілити запити по сторінках сайту.

**4. Поясніть концепцію silo-структури. Чому Google краще ранжує такі сайти?**
Silo-структура — це метод організації сайту, де контент групується в ізольовані тематичні розділи (силоси). Google краще ранжує такі сайти, бо чітка структура демонструє глибоку експертність (Topic Authority) у конкретній ніші, а пошуковим роботам легше сканувати та розуміти зв’язки між сторінками.

**5. Що таке канібалізація ключових слів і як вона шкодить SEO?**
Це ситуація, коли кілька сторінок одного сайту намагаються ранжуватися за однаковим ключовим словом. Це шкодить SEO, оскільки Google "розгублюється", яку сторінку показати, розмиваючи авторитет та посилання між ними, що часто призводить до падіння позицій обох сторінок.

---

#### Рівень 2 - Аналіз

**1. Чи варто молодому сайту орієнтуватись на запити High volume / High competition?**
**Ні, не варто.** Молодий сайт не має достатньої ваги (Domain Authority), щоб конкурувати з гігантами. Стратегія має полягати у фокусі на **Long-tail запитах**. Це дозволяє швидше вийти в ТОП за вузькими темами, отримати перший трафік і поступово нарощувати авторитет для складніших запитів.

**2. "як встановити node.js" та "node.js download": один кластер чи різні?**
Це **різні кластери**. Перший запит має **інформаційний інтент** (користувачу потрібна інструкція/алгоритм). Другий — **навігаційний/транзакційний** (користувачу потрібен лінк на файл). Хоча тема одна, Google покаже різні результати: статтю-гайд для першого та офіційну сторінку завантаження для другого.

**3. Топ-10 результатів для головного запиту блогу: що це каже про інтент?**
Якщо в топі переважають статті "Top 10...", "How to...", то інтент — інформаційний. Якщо там сторінки послуг або курсів — комерційний. Для вашого ІТ-блогу наявність статей-гайдів підтверджує, що користувачі шукають навчання та новини.

**4. Чому silo-структура передбачає мінімальну кількість посилань між різними силосами?**
Це робиться для того, щоб "вага" (PageRank) і релевантність накопичувалися всередині однієї теми. Якщо посилань між різними темами забагато, тематичний фокус розмивається, і Google стає складніше визначити основну спеціалізацію конкретного розділу.

**5. Як Google Trends допомагає у плануванні контент-календаря?**
Він показує сезонність або виникнення трендів. Наприклад, в ІТ перед релізом нової версії Java або iPhone зростає кількість запитів на ці теми. Плануючи статті саме під ці піки інтересу, можна отримати значно більше трафіку.

---

#### Рівень 3 - Синтез та висновки

**1. Порівняння структури сайту (it-blog-news.pp.ua) з відомими ресурсами (наприклад, dou.ua):**
Мій сайт має більш "плоску" структуру, орієнтовану на швидке читання новин. У таких гігантів, як **dou.ua** або **dev.to**, реалізована складна silo-структура з форумами, вакансіями та хабами. Я б запозичив систему підписки на конкретні теги та більш розгалужену внутрішню перелінковку між схожими статтями.

**2. Проблеми блогу без семантичного ядра:**
Основні проблеми: хаотичне ранжування, відсутність трафіку за цільовими запитами та велика кількість канібалізації. **Виправлення:** провести ревізію статей, зібрати семантику під наявний контент, переоптимізувати заголовки та налаштувати структуру категорій.

**3. Зміни семантичного ядра для англомовної аудиторії:**
Ядро доведеться створювати з нуля для англійської мови, оскільки прямий переклад часто не збігається з реальними пошуковими запитами. **Технічно:** потрібно додати підтримку багатомовності (i18n), змінити структуру URL (наприклад, `/en/`) та додати атрибути `hreflang` у код.

**4. Чому для новинного блогу silo-структура за категоріями краща за структуру за датами?**
Структура за датами ("архів") робить контент "одноразовим" — як тільки новина застаріла, вона зникає. **Silo-структура за категоріями** дозволяє старим новинам продовжувати підсилювати авторитет розділу (наприклад, "Frontend"), покращує навігацію для користувача та допомагає Google бачити сайт як структуроване джерело знань, а не випадкову стрічку подій.
