// import { notFound } from "next/navigation";
// import Link from "next/link";

// export default async function ArticlePage({
//   params,
// }: {
//   params: Promise<{ slug: string[] }> | { slug: string[] };
// }) {
//   const resolvedParams = await params;
//   const slugArray = resolvedParams.slug;
//   const API_URL = process.env.BACKEND_URL || "http://localhost:3001";

//   const finalSlug = slugArray[slugArray.length - 1];
  
//   const urlCategory = slugArray.length > 1 ? slugArray[0] : null;

//   let article: any = null;
//   let related: any[] = [];

//   try {
//     const artRes = await fetch(`${API_URL}/api/articles/${finalSlug}`, { cache: "no-store" });
    
//     if (artRes.status === 404) {
//       notFound();
//     }

//     if (artRes.ok) {
//       const artData = await artRes.json();
//       article = artData.data || artData;

//       const realCategorySlug = article.category?.slug;
//       if (urlCategory && realCategorySlug && realCategorySlug !== urlCategory) {
//         console.warn(`Невідповідність URL: очікувалась категорія ${realCategorySlug}, але введено ${urlCategory}`);
//         return notFound();
//       }

//       if (article?.id) {
//         fetch(`${API_URL}/api/articles/${article.id}/view`, {
//           method: "POST",
//           cache: "no-store"
//         }).catch((e) => console.log("Помилка лічильника переглядів", e));
//       }
//     }

//     const relRes = await fetch(`${API_URL}/api/articles/${finalSlug}/related`, { cache: "no-store" });
//     if (relRes.ok) {
//       const relData = await relRes.json();
//       related = relData.data || relData || [];
//     }
//   } catch (error) {
//     console.error("Помилка завантаження статті:", error);
//   }

//   if (!article) return notFound();

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "";
//     return new Date(dateString).toLocaleDateString("uk-UA");
//   };

//   const displayCategorySlug = urlCategory || article.category?.slug;
//   const displayCategoryName = article.category?.name || displayCategorySlug;

//   return (
//     <article className="min-h-screen bg-white pb-20">
//       <header className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        
//         <nav className="mb-10 text-[12px] font-black uppercase tracking-widest text-slate-400">
//           <ol className="flex items-center justify-center space-x-2">
//             <li>
//               <Link href="/" className="hover:text-blue-600 transition-colors">
//                 Головна
//               </Link>
//             </li>
//             <li><span className="mx-2 opacity-50">/</span></li>
//             <li>
//               <Link href="/categories" className="hover:text-blue-600 transition-colors">
//                 Категорії
//               </Link>
//             </li>
//             <li><span className="mx-2 opacity-50">/</span></li>
            
//             {displayCategorySlug && (
//               <>
//                 <li>
//                   <Link href={`/categories/${displayCategorySlug}`} className="hover:text-blue-600 transition-colors">
//                     {displayCategoryName}
//                   </Link>
//                 </li>
//                 <li><span className="mx-2 opacity-50">/</span></li>
//               </>
//             )}

//             <li className="text-slate-900 truncate max-w-[150px] sm:max-w-[300px]" title={article.title}>
//               {article.title}
//             </li>
//           </ol>
//         </nav>

//         {article.category?.name && (
//           <span className="inline-block px-4 py-1.5 mb-6 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
//             {article.category.name}
//           </span>
//         )}

//         <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
//           {article.title}
//         </h1>

//         <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
//           {article.excerpt}
//         </p>

//         <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
//           {article.author?.slug ? (
//             <Link
//               href={`/authors/${article.author.slug}`}
//               className="hover:text-blue-600 transition-colors"
//             >
//               {article.author.name}
//             </Link>
//           ) : (
//             <span>{article.author?.name || "Редакція Blog.IT"}</span>
//           )}

//           <span>•</span>
//           <span>
//             {formatDate(article.published_at || article.created_at)}
//           </span>
//           <span>•</span>
//           <div className="flex items-center gap-1.5 transition-colors hover:text-slate-600">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="opacity-80"
//             >
//               <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
//               <circle cx="12" cy="12" r="3" />
//             </svg>
//             <span>{article.views || 0}</span>
//           </div>
//         </div>

//         {article.tags && article.tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 justify-center mt-8">
//             {article.tags.map((tag: any) => (
//               <Link
//                 key={tag.id}
//                 href={`/tags/${tag.slug}`}
//                 className="px-4 py-2 bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors cursor-pointer"
//               >
//                 #{tag.name}
//               </Link>
//             ))}
//           </div>
//         )}
//       </header>

//       <div className="max-w-5xl mx-auto px-6 mb-16">
//         <div className="aspect-[21/9] w-full rounded-[40px] overflow-hidden bg-slate-100 relative border border-slate-100">
//           {article.cover_url ? (
//             <img
//               src={article.cover_url}
//               alt={article.title}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center">
//               <span className="text-slate-300 font-black text-2xl">
//                 БЕЗ ОБКЛАДИНКИ
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       <div
//         className="whitespace-pre-wrap max-w-3xl mx-auto px-6 prose prose-lg prose-slate font-medium leading-relaxed mb-16"
//         dangerouslySetInnerHTML={{
//           __html: article.content || "<p>Текст статті відсутній.</p>",
//         }}
//       />

//       {article.author && (
//         <div className="max-w-3xl mx-auto px-6 mb-20">
//           <div className="bg-slate-50 p-8 md:p-10 rounded-[40px] border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
            
//             <Link href={`/authors/${article.author.slug}`} className="flex-shrink-0 group">
//               <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-900 flex items-center justify-center text-white text-3xl font-black group-hover:scale-105 transition-transform">
//                 {article.author.avatar_url ? (
//                   <img src={article.author.avatar_url} alt={article.author.name} className="w-full h-full object-cover" />
//                 ) : (
//                   article.author.name?.[0] || "А"
//                 )}
//               </div>
//             </Link>
            
//             <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
//               <h3 className="text-2xl font-black text-slate-900 mb-3 hover:text-blue-600 transition-colors inline-block tracking-tight">
//                 <Link href={`/authors/${article.author.slug}`}>
//                   {article.author.name}
//                 </Link>
//               </h3>
              
//               <p className="text-slate-500 font-medium leading-relaxed mb-5 text-sm">
//                 {article.author.bio || "Автор ще не додав інформацію про себе."}
//               </p>

//               <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
//                 <span>Опубліковано: {formatDate(article.published_at || article.created_at)}</span>
                
//                 {article.updated_at && (article.updated_at !== article.published_at) && (
//                   <>
//                     <span className="hidden sm:inline">•</span>
//                     <span>Оновлено: {formatDate(article.updated_at)}</span>
//                   </>
//                 )}
//               </div>
//             </div>

//           </div>
//         </div>
//       )}

//       {related.length > 0 && (
//         <div className="bg-slate-50 py-20 border-t border-slate-100">
//           <div className="max-w-6xl mx-auto px-6">
//             <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-10">
//               Читайте також
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {related.map((rel) => {
//                 const relCategory = rel.category?.slug || displayCategorySlug;
//                 const relHref = relCategory ? `/${relCategory}/${rel.slug}` : `/${rel.slug}`;

//                 return (
//                   <Link
//                     key={rel.id}
//                     href={relHref}
//                     className="group block bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
//                   >
//                     <div className="aspect-[16/9] w-full bg-slate-100 relative">
//                       {rel.cover_url ? (
//                         <img
//                           src={rel.cover_url}
//                           alt={rel.title}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                         />
//                       ) : null}
//                     </div>

//                     <div className="p-8">
//                       <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
//                         {rel.title}
//                       </h3>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </article>
//   );
// }

import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }> | { slug: string[] };
}) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  const API_URL = process.env.BACKEND_URL || "http://localhost:3001";

  const finalSlug = slugArray[slugArray.length - 1];
  const urlCategory = slugArray.length > 1 ? slugArray[0] : null;

  let article: any = null;
  let related: any[] = [];
  let fetchError = false;

  try {
    const artRes = await fetch(`${API_URL}/api/articles/${finalSlug}`, { cache: "no-store" });
    
    if (artRes.status === 404) {
      // Якщо бекенд працює і каже, що статті нема - це реальна 404
      notFound();
    }

    if (artRes.ok) {
      const artData = await artRes.json();
      article = artData.data || artData;

      const realCategorySlug = article.category?.slug;
      if (urlCategory && realCategorySlug && realCategorySlug !== urlCategory) {
        console.warn(`Невідповідність URL: очікувалась категорія ${realCategorySlug}, але введено ${urlCategory}`);
        return notFound();
      }

      if (article?.id) {
        fetch(`${API_URL}/api/articles/${article.id}/view`, {
          method: "POST",
          cache: "no-store"
        }).catch((e) => console.log("Помилка лічильника переглядів", e));
      }
    } else {
      fetchError = true; // Статус 500 або інший
    }

    const relRes = await fetch(`${API_URL}/api/articles/${finalSlug}/related`, { cache: "no-store" });
    if (relRes.ok) {
      const relData = await relRes.json();
      related = relData.data || relData || [];
    }
  } catch (error) {
    console.error("Помилка завантаження статті:", error);
    fetchError = true; // Немає зв'язку з бекендом
  }

  // --- MOCK DATA (Якщо бекенд лежить) ---
  if (fetchError || !article) {
    const mockArticlesDb = [
      {
        slug: 'why-clean-code-matters',
        title: 'Why Clean Code Matters (And How to Write It)',
        excerpt: 'Code is read more often than it is written. Learn the principles of writing clean, readable, and maintainable code.',
        content: `
          <p>Чистий код — це не просто забаганка перфекціоністів, це необхідність для довготривалого успіху будь-якого проєкту. Коли ви пишете код, пам'ятайте: його будуть читати набагато частіше, ніж редагувати.</p>
          <h3>Принципи якісного коду:</h3>
          <ul>
            <li><strong>Зрозумілі назви:</strong> Змінна має відповідати на запитання "що це?", а функція — "що вона робить?".</li>
            <li><strong>Правило однієї дії (SRP):</strong> Функція повинна робити лише одну річ, але робити її добре.</li>
            <li><strong>Коментарі як вибачення:</strong> Якщо вам потрібно написати коментар, щоб пояснити, що робить код — ваш код недостатньо зрозумілий.</li>
          </ul>
          <blockquote>"Будь-який дурень може написати код, зрозумілий комп'ютеру. Хороші програмісти пишуть код, зрозумілий людям." — Мартін Фаулер</blockquote>
        `,
        cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
        category: { name: "Backend", slug: "backend" },
      },
      {
        slug: 'mastering-typescript-generics',
        title: 'Mastering TypeScript Generics',
        excerpt: 'Unlock the full power of TypeScript by understanding generics. Create reusable, type-safe components easily.',
        content: `
          <p>Дженерики (Generics) у TypeScript часто лякають новачків, але саме вони розкривають справжню силу строгої типізації. Вони дозволяють створювати компоненти, які працюють з будь-яким типом даних, зберігаючи при цьому безпеку.</p>
          <h3>Як це працює?</h3>
          <p>Уявіть дженерик як змінну для типів. Замість того, щоб жорстко прописувати <code>string</code> чи <code>number</code>, ви кажете TypeScript: "Я передам тобі тип пізніше, просто запам'ятай його як T".</p>
          <p>Це робить ваші хуки, функції-утиліти та API-клієнти неймовірно гнучкими.</p>
        `,
        cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
        category: { name: "Frontend", slug: "frontend" },
      },
      {
        slug: 'core-web-vitals',
        title: 'Core Web Vitals: A Practical Guide to Web Performance',
        excerpt: 'Improve your user experience and SEO rankings by focusing on Google\'s Core Web Vitals.',
        content: `
          <p>Google Core Web Vitals — це набір метрик, які вимірюють реальний користувацький досвід: швидкість завантаження, інтерактивність та візуальну стабільність.</p>
          <h3>Три головні метрики:</h3>
          <ul>
            <li><strong>LCP (Largest Contentful Paint):</strong> Час до появи найбільшого елемента на екрані.</li>
            <li><strong>FID (First Input Delay):</strong> Час реакції сайту на перший клік користувача.</li>
            <li><strong>CLS (Cumulative Layout Shift):</strong> Наскільки стрибає контент під час завантаження.</li>
          </ul>
        `,
        cover_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
        category: { name: "Frontend", slug: "frontend" },
      },
      {
        slug: 'css-grid-vs-flexbox',
        title: 'CSS Grid vs. Flexbox: Which One Should You Use?',
        excerpt: 'They are both powerful layout tools, but they solve different problems.',
        content: `
          <p>Вічна битва між CSS Grid та Flexbox насправді не має сенсу. Вони створені не для конкуренції, а для спільної роботи.</p>
          <h3>Золоте правило:</h3>
          <p><strong>Flexbox</strong> створений для одновимірних макетів (або рядок, або колонка). Він ідеальний для навігаційних меню, вирівнювання іконок чи розподілу простору всередині картки.</p>
          <p><strong>CSS Grid</strong> створений для двовимірних макетів (і рядки, і колонки одночасно). Це ваш вибір для побудови каркасу всієї сторінки, складних галерей або сіток товарів.</p>
        `,
        cover_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&q=80',
        category: { name: "Frontend", slug: "frontend" },
      },
      {
        slug: 'building-rest-api-nestjs',
        title: 'Building a Production-Ready REST API with NestJS',
        excerpt: 'Leverage the power of TypeScript and a modular architecture to build scalable backend services.',
        content: `
          <p>NestJS змінив правила гри у світі Node.js. Завдяки своїй Angular-подібній архітектурі, він змушує розробників писати чистий, масштабований та тестований код з коробки.</p>
          <h3>Чому NestJS?</h3>
          <ul>
            <li><strong>Модульність:</strong> Кожна фіча живе у своєму модулі зі своїми контролерами та сервісами.</li>
            <li><strong>Впровадження залежностей (DI):</strong> Робить тестування неймовірно простим.</li>
            <li><strong>Декоратори:</strong> Дозволяють легко налаштовувати валідацію DTO.</li>
          </ul>
        `,
        cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
        category: { name: "Backend", slug: "backend" },
      },
      {
        slug: 'deep-dive-react-hooks',
        title: 'A Deep Dive into React Hooks',
        excerpt: 'Go beyond useState and useEffect. Explore advanced hooks like useReducer, useCallback, and useMemo.',
        content: `
          <p>Ви вже знаєте useState та useEffect, але справжня магія React починається з просунутих хуків, які допомагають оптимізувати продуктивність та керувати складним станом.</p>
          <h3>Секрети оптимізації:</h3>
          <p><strong>useMemo</strong> та <strong>useCallback</strong> — це ваші інструменти для уникнення зайвих рендерів. Але пам'ятайте: сама мемоізація теж коштує ресурсів. Використовуйте їх лише для "важких" обчислень.</p>
        `,
        cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
        category: { name: "JavaScript", slug: "javascript" },
      }
    ];

    const foundMock = mockArticlesDb.find(a => a.slug === finalSlug);

    // Створюємо повноцінний об'єкт статті, який ідеально підходить під твій дизайн
    const baseArticle = foundMock || {
      slug: finalSlug,
      title: finalSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      excerpt: "Бекенд недоступний. Це автоматично згенерована стаття для перевірки дизайну.",
      content: "<p>Тестовий контент для невідомої статті. Перевірка верстки.</p>",
      cover_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
      category: { name: (urlCategory || "Тест").toUpperCase(), slug: urlCategory || "test" }
    };

    article = {
      ...baseArticle,
      id: `mock-${baseArticle.slug}`,
      published_at: new Date().toISOString(),
      views: Math.floor(Math.random() * 500) + 120,
      tags: [
        { id: 1, name: "dev", slug: "dev" },
        { id: 2, name: "tutorial", slug: "tutorial" }
      ],
      author: {
        name: "Test Author",
        slug: "test-author",
        bio: "Lead writer of blog",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
      }
    };

    // Підкидаємо схожі статті
    related = mockArticlesDb.filter(a => a.slug !== finalSlug).slice(0, 3).map(a => ({
      ...a,
      id: `rel-${a.slug}`
    }));
  }

  if (!article) return notFound();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  const displayCategorySlug = urlCategory || article.category?.slug;
  const displayCategoryName = article.category?.name || displayCategorySlug;

  // ТВОЯ ВЕРСТКА: Жодного символу не змінено!
  return (
    <article className="min-h-screen bg-white pb-20">
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        
        <nav className="mb-10 text-[12px] font-black uppercase tracking-widest text-slate-400">
          <ol className="flex items-center justify-center space-x-2">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Головна
              </Link>
            </li>
            <li><span className="mx-2 opacity-50">/</span></li>
            <li>
              <Link href="/categories" className="hover:text-blue-600 transition-colors">
                Категорії
              </Link>
            </li>
            <li><span className="mx-2 opacity-50">/</span></li>
            
            {displayCategorySlug && (
              <>
                <li>
                  <Link href={`/categories/${displayCategorySlug}`} className="hover:text-blue-600 transition-colors">
                    {displayCategoryName}
                  </Link>
                </li>
                <li><span className="mx-2 opacity-50">/</span></li>
              </>
            )}

            <li className="text-slate-900 truncate max-w-[150px] sm:max-w-[300px]" title={article.title}>
              {article.title}
            </li>
          </ol>
        </nav>

        {article.category?.name && (
          <span className="inline-block px-4 py-1.5 mb-6 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
            {article.category.name}
          </span>
        )}

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
          {article.title}
        </h1>

        <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {article.author?.slug ? (
            <Link
              href={`/authors/${article.author.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {article.author.name}
            </Link>
          ) : (
            <span>{article.author?.name || "Редакція Blog.IT"}</span>
          )}

          <span>•</span>
          <span>
            {formatDate(article.published_at || article.created_at)}
          </span>
          <span>•</span>
          <div className="flex items-center gap-1.5 transition-colors hover:text-slate-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{article.views || 0}</span>
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {article.tags.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-4 py-2 bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors cursor-pointer"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] w-full rounded-[40px] overflow-hidden bg-slate-100 relative border border-slate-100">
          {article.cover_url ? (
            <img
              src={article.cover_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-300 font-black text-2xl">
                БЕЗ ОБКЛАДИНКИ
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="whitespace-pre-wrap max-w-3xl mx-auto px-6 prose prose-lg prose-slate font-medium leading-relaxed mb-16"
        dangerouslySetInnerHTML={{
          __html: article.content || "<p>Текст статті відсутній.</p>",
        }}
      />

      {article.author && (
        <div className="max-w-3xl mx-auto px-6 mb-20">
          <div className="bg-slate-50 p-8 md:p-10 rounded-[40px] border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
            
            <Link href={`/authors/${article.author.slug}`} className="flex-shrink-0 group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-900 flex items-center justify-center text-white text-3xl font-black group-hover:scale-105 transition-transform">
                {article.author.avatar_url ? (
                  <img src={article.author.avatar_url} alt={article.author.name} className="w-full h-full object-cover" />
                ) : (
                  article.author.name?.[0] || "А"
                )}
              </div>
            </Link>
            
            <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
              <h3 className="text-2xl font-black text-slate-900 mb-3 hover:text-blue-600 transition-colors inline-block tracking-tight">
                <Link href={`/authors/${article.author.slug}`}>
                  {article.author.name}
                </Link>
              </h3>
              
              <p className="text-slate-500 font-medium leading-relaxed mb-5 text-sm">
                {article.author.bio || "Автор ще не додав інформацію про себе."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Опубліковано: {formatDate(article.published_at || article.created_at)}</span>
                
                {article.updated_at && (article.updated_at !== article.published_at) && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>Оновлено: {formatDate(article.updated_at)}</span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="bg-slate-50 py-20 border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-10">
              Читайте також
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((rel) => {
                const relCategory = rel.category?.slug || displayCategorySlug;
                const relHref = relCategory ? `/${relCategory}/${rel.slug}` : `/${rel.slug}`;

                return (
                  <Link
                    key={rel.id}
                    href={relHref}
                    className="group block bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="aspect-[16/9] w-full bg-slate-100 relative">
                      {rel.cover_url ? (
                        <img
                          src={rel.cover_url}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : null}
                    </div>

                    <div className="p-8">
                      <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                        {rel.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}