// import Link from 'next/link';

// export default async function HomePage({
//   searchParams,
// }: {
//   searchParams: Promise<{ category?: string; limit?: string }> | { category?: string; limit?: string };
// }) {
//   const resolvedSearchParams = await searchParams;
//   const activeCategory = resolvedSearchParams?.category || 'Всі';
//   const limit = parseInt(resolvedSearchParams?.limit || '12', 10);
//   const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

//   let articles = [];
//   let categories = ["Всі"];

//   try {
//     const [artRes, catRes] = await Promise.all([
//       fetch(`${API_URL}/api/articles`, { cache: 'no-store' }),
//       fetch(`${API_URL}/api/categories`, { cache: 'no-store' }),
//     ]);

//     const artResult = await artRes.json();
//     const catResult = await catRes.json();

//     articles = artResult.data || [];
//     const realCategories = catResult.data || catResult || [];
//     categories = ["Всі", ...realCategories.map((c: any) => c.name)];
//   } catch (error) {
//     console.error("Помилка завантаження даних:", error);
//   }

//   const filteredArticles = articles.filter((article: any) => {
//     if (activeCategory === "Всі") return true;
//     return article.category?.name === activeCategory;
//   });

//   const visibleArticles = filteredArticles.slice(0, limit);

//   return (
//     <div className="bg-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-6 py-16">
//         <header className="mb-16">
//           <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
//             Останні публікації
//           </h1>

//           <div className="flex flex-wrap gap-2 mb-8">
//             {categories.map((cat) => (
//               <Link 
//                 key={cat}
//                 href={`/?category=${encodeURIComponent(cat)}&limit=12`}
//                 className={`inline-block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
//                   activeCategory === cat 
//                     ? 'bg-slate-900 text-white border-slate-900' 
//                     : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
//                 }`}
//               >
//                 {cat}
//               </Link>
//             ))}
//           </div>

//           <p className="text-slate-400 font-medium">
//             Показано {visibleArticles.length} із {filteredArticles.length} статей
//           </p>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {visibleArticles.map((article: any) => (
//             <article key={article.id} className="group border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
//               <div className="aspect-video bg-slate-200 relative overflow-hidden">
//                 <img 
//                   src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
//                   alt={article.title} 
//                   className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
//                 />
//               </div>
//               <div className="p-6">
//                 <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">
//                   {article.category?.name || "Без категорії"}
//                 </span>
//                 <h2 className="text-xl font-bold mt-2 leading-tight">
//                   <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
//                     {article.title}
//                   </Link>
//                 </h2>
//                 <p className="text-slate-500 text-sm mt-3 line-clamp-2">
//                   {article.excerpt}
//                 </p>
//               </div>
//             </article>
//           ))}
//         </div>

//         {limit < filteredArticles.length && (
//           <div className="mt-20 text-center">
//             <Link 
//               href={`/?category=${encodeURIComponent(activeCategory)}&limit=${limit + 12}`}
//               className="inline-block px-12 py-5 uppercase bg-slate-900 text-white text-xs font-black rounded-[25px] hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
//             >
//               Завантажити ще
//             </Link>
//           </div>
//         )}

//         {(limit >= filteredArticles.length || filteredArticles.length === 0) && (
//           <div className="mt-20 text-center py-10 border-t border-slate-50">
//             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
//               {filteredArticles.length === 0 ? "Статей у цій категорії не знайдено" : "Це всі доступні публікації на сьогодні"}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import Link from 'next/link';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; limit?: string }> | { category?: string; limit?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams?.category || 'Всі';
  const limit = parseInt(resolvedSearchParams?.limit || '12', 10);
  const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

  let articles: any[] = [];
  let categories = ["Всі"];
  let fetchError = false; // Прапорець для відстеження помилок сервера

  try {
    const [artRes, catRes] = await Promise.all([
      fetch(`${API_URL}/api/articles`, { cache: 'no-store' }),
      fetch(`${API_URL}/api/categories`, { cache: 'no-store' }),
    ]);

    if (artRes.ok && catRes.ok) {
      const artResult = await artRes.json();
      const catResult = await catRes.json();

      articles = artResult.data || artResult.rows || [];
      const realCategories = catResult.data || catResult || [];
      categories = ["Всі", ...realCategories.map((c: any) => c.name)];
    } else {
      fetchError = true; // Бекенд повернув 500 або іншу помилку
    }
  } catch (error) {
    console.error("Помилка завантаження даних:", error);
    fetchError = true; // Бекенд взагалі не відповідає
  }

  // --- ЗАГЛУШКИ (MOCK DATA) ---
  if (fetchError || articles.length === 0) {
    const mockCategories = [
      { id: 1, name: "Backend", slug: "backend" },
      { id: 2, name: "Frontend", slug: "frontend" },
      { id: 3, name: "Architecture", slug: "architecture" },
      { id: 4, name: "JavaScript", slug: "javascript" },
      { id: 5, name: "Штучний Інтелект", slug: "ai" }
    ];

    categories = ["Всі", ...mockCategories.map((c) => c.name)];

    // Статті з прив'язкою до категорій, щоб фільтр працював
    articles = [
      {
        id: 'mock-1',
        slug: 'why-clean-code-matters',
        title: 'Why Clean Code Matters (And How to Write It)',
        excerpt: 'Code is read more often than it is written. Learn the principles of writing clean, readable, and maintainable code.',
        cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
        category: mockCategories[0] // Backend
      },
      {
        id: 'mock-2',
        slug: 'mastering-typescript-generics',
        title: 'Mastering TypeScript Generics',
        excerpt: 'Unlock the full power of TypeScript by understanding generics. Create reusable, type-safe components easily.',
        cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
        category: mockCategories[1] // Frontend
      },
      {
        id: 'mock-3',
        slug: 'core-web-vitals',
        title: 'Core Web Vitals: A Practical Guide to Web Performance',
        excerpt: 'Improve your user experience and SEO rankings by focusing on Google\'s Core Web Vitals: LCP, FID, and CLS.',
        cover_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
        category: mockCategories[1] // Frontend
      },
      {
        id: 'mock-4',
        slug: 'css-grid-vs-flexbox',
        title: 'CSS Grid vs. Flexbox: Which One Should You Use?',
        excerpt: 'They are both powerful layout tools, but they solve different problems. A deep dive into modern CSS layouts.',
        cover_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&q=80',
        category: mockCategories[1] // Frontend
      },
      {
        id: 'mock-5',
        slug: 'building-rest-api-nestjs',
        title: 'Building a Production-Ready REST API with NestJS',
        excerpt: 'Leverage the power of TypeScript and a modular architecture to build scalable backend services.',
        cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
        category: mockCategories[0] // Backend
      },
      {
        id: 'mock-6',
        slug: 'deep-dive-react-hooks',
        title: 'A Deep Dive into React Hooks',
        excerpt: 'Go beyond useState and useEffect. Explore advanced hooks like useReducer, useCallback, and useMemo.',
        cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
        category: mockCategories[3] // JavaScript
      }
    ];
  }

  // Логіка фільтрації
  const filteredArticles = articles.filter((article: any) => {
    if (activeCategory === "Всі") return true;
    return article.category?.name === activeCategory;
  });

  const visibleArticles = filteredArticles.slice(0, limit);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-16">
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
            Останні публікації
          </h1>

          {/* Індикатор помилки для розробника
          {fetchError && (
            <div className="mb-6 inline-block px-4 py-2 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200">
              ⚠️ Бекенд недоступний. Відображаються тестові дані.
            </div>
          )} */}

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <Link 
                key={cat}
                href={`/?category=${encodeURIComponent(cat)}&limit=12`}
                className={`inline-block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          <p className="text-slate-400 font-medium">
            Показано {visibleArticles.length} із {filteredArticles.length} статей
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleArticles.map((article: any) => {
            
            const categorySlug = article.category?.slug || 'uncategorized';
            const articleHref = `/${categorySlug}/${article.slug}`;

            return (
              <article key={article.id} className="group border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                  <img 
                    src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
                    alt={article.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                    {article.category?.name || "Без категорії"}
                  </span>
                  <h2 className="text-xl font-bold mt-2 leading-tight">
                    <Link href={articleHref} className="hover:text-blue-600 transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {limit < filteredArticles.length && (
          <div className="mt-20 text-center">
            <Link 
              href={`/?category=${encodeURIComponent(activeCategory)}&limit=${limit + 12}`}
              className="inline-block px-12 py-5 uppercase bg-slate-900 text-white text-xs font-black rounded-[25px] hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Завантажити ще
            </Link>
          </div>
        )}

        {(limit >= filteredArticles.length || filteredArticles.length === 0) && (
          <div className="mt-20 text-center py-10 border-t border-slate-50">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              {filteredArticles.length === 0 ? "Статей у цій категорії не знайдено" : "Це всі доступні публікації на сьогодні"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}