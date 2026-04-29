// // import Link from 'next/link';

// // export default async function CategoryPage({
// //   params,
// //   searchParams,
// // }: {
// //   params: Promise<{ slug: string }> | { slug: string };
// //   searchParams: Promise<{ limit?: string }> | { limit?: string };
// // }) {
// //   const resolvedParams = await params;
// //   const resolvedSearchParams = await searchParams;
// //   const slug = resolvedParams.slug;
// //   const limit = parseInt(resolvedSearchParams?.limit || '12', 10);
// //   const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// //   let articles: any[] = [];
// //   let categoryInfo = null;
// //   let fetchError = false;

// //   try {
// //     const [catRes, articlesRes] = await Promise.all([
// //       fetch(`${API_URL}/api/categories/${slug}`, { cache: 'no-store' }),
// //       fetch(`${API_URL}/api/categories/${slug}/articles`, { cache: 'no-store' })
// //     ]);

// //     if (catRes.ok) {
// //       const catResult = await catRes.json();
// //       categoryInfo = catResult.data || catResult || null;
// //     } else {
// //       fetchError = true;
// //     }

// //     if (articlesRes.ok) {
// //       const articlesResult = await articlesRes.json();
// //       articles = articlesResult.data || articlesResult.rows || [];
// //     } else {
// //       fetchError = true;
// //     }
// //   } catch (error) {
// //     console.error("Помилка завантаження категорії:", error);
// //     fetchError = true;
// //   }
// // //  || articles.length === 0
// //   if (fetchError) {
// //     articles = [
// //       {
// //         id: 'mock-1',
// //         slug: 'why-clean-code-matters',
// //         title: 'Why Clean Code Matters (And How to Write It)',
// //         excerpt: 'Code is read more often than it is written. Learn the principles of writing clean, readable, and maintainable code.',
// //         cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
// //       },
// //       {
// //         id: 'mock-2',
// //         slug: 'mastering-typescript-generics',
// //         title: 'Mastering TypeScript Generics',
// //         excerpt: 'Unlock the full power of TypeScript by understanding generics. Create reusable, type-safe components easily.',
// //         cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
// //       },
// //       {
// //         id: 'mock-3',
// //         slug: 'core-web-vitals',
// //         title: 'Core Web Vitals: A Practical Guide to Web Performance',
// //         excerpt: 'Improve your user experience and SEO rankings by focusing on Google\'s Core Web Vitals: LCP, FID, and CLS.',
// //         cover_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
// //       },
// //       {
// //         id: 'mock-4',
// //         slug: 'css-grid-vs-flexbox',
// //         title: 'CSS Grid vs. Flexbox: Which One Should You Use?',
// //         excerpt: 'They are both powerful layout tools, but they solve different problems. A deep dive into modern CSS layouts.',
// //         cover_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&q=80',
// //       },
// //       {
// //         id: 'mock-5',
// //         slug: 'building-rest-api-nestjs',
// //         title: 'Building a Production-Ready REST API with NestJS',
// //         excerpt: 'Leverage the power of TypeScript and a modular architecture to build scalable backend services.',
// //         cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
// //       },
// //       {
// //         id: 'mock-6',
// //         slug: 'deep-dive-react-hooks',
// //         title: 'A Deep Dive into React Hooks',
// //         excerpt: 'Go beyond useState and useEffect. Explore advanced hooks like useReducer, useCallback, and useMemo.',
// //         cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
// //       }
// //     ];
// //   }

// //   const info = categoryInfo || {
// //     name: fetchError ? `${slug}` : slug, 
// //     description: 'Перегляд публікацій за обраною категорією.' 
// //   };

// //   const visibleArticles = articles.slice(0, limit);

// //   return (
// //     <div className="bg-white min-h-screen">
// //       <div className="max-w-7xl mx-auto px-6 py-16">
        
// //         <header className="mb-16 border-b border-slate-100 pb-12">
          
// //           <nav className="mb-8 text-[12px] font-black uppercase tracking-widest text-slate-400">
// //             <ol className="flex items-center space-x-2">
// //               <li>
// //                 <Link href="/" className="hover:text-blue-600 transition-colors">
// //                   Головна
// //                 </Link>
// //               </li>
// //               <li><span className="mx-2 opacity-50">/</span></li>
// //               <li>
// //                 <Link href="/categories" className="hover:text-blue-600 transition-colors">
// //                   Категорії
// //                 </Link>
// //               </li>
// //               <li><span className="mx-2 opacity-50">/</span></li>
// //               <li className="text-slate-900 truncate max-w-[200px] sm:max-w-[400px]">
// //                 {info.name}
// //               </li>
// //             </ol>
// //           </nav>

// //           <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter capitalize">
// //             {info.name}
// //           </h1>
// //           <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">
// //             {info.description}
// //           </p>
// //         </header>

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
// //           {visibleArticles.length > 0 ? (
// //             visibleArticles.map((article: any) => {
              
// //               const articleHref = `/${slug}/${article.slug}`;

// //               return (
// //                 <article key={article.id} className="group flex flex-col">
// //                   <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6">
// //                     <img 
// //                       src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
// //                       alt={article.title} 
// //                       className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
// //                     />
// //                   </div>
// //                   <h2 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
// //                     <Link href={articleHref}>{article.title}</Link>
// //                   </h2>
// //                   <p className="text-slate-500 text-sm mt-3 line-clamp-2">{article.excerpt}</p>
// //                 </article>
// //               );
// //             })
// //           ) : (
// //             <div className="col-span-full text-center py-20 border border-dashed border-slate-200 rounded-3xl">
// //               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
// //                 У цій категорії ще немає публікацій.
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {limit < articles.length && (
// //           <div className="mt-20 text-center">
// //             {/* Пагінація: веде на правильний шлях категорії */}
// //             <Link 
// //               href={`/categories/${slug}?limit=${limit + 12}`}
// //               className="inline-block px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
// //             >
// //               Завантажити ще статті
// //             </Link>
// //           </div>
// //         )}

// //         {(limit >= articles.length || articles.length === 0) && (
// //           <div className="mt-20 text-center py-10 border-t border-slate-50">
// //             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
// //               {articles.length === 0 ? "Статей у цій категорії не знайдено" : "Це всі доступні публікації на сьогодні"}
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// import Link from 'next/link';
// import { notFound } from 'next/navigation';

// export default async function CategoryPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ slug: string }> | { slug: string };
//   searchParams: Promise<{ limit?: string }> | { limit?: string };
// }) {
//   const resolvedParams = await params;
//   const resolvedSearchParams = await searchParams;
//   const slug = resolvedParams.slug;
//   const limit = parseInt(resolvedSearchParams?.limit || '12', 10);
//   const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

//   let articles: any[] = [];
//   let categoryInfo = null;
//   let fetchError = false;

//   try {
//     const [catRes, articlesRes] = await Promise.all([
//       fetch(`${API_URL}/api/categories/${slug}`, { cache: 'no-store' }),
//       fetch(`${API_URL}/api/categories/${slug}/articles`, { cache: 'no-store' })
//     ]);

//     // 1. ВАЛІДАЦІЯ ЧЕРЕЗ БАЗУ ДАНИХ (БЕКЕНД)
//     // Якщо бекенд відповідає, що такої категорії не існує
//     if (catRes.status === 404) {
//       notFound();
//     }

//     if (catRes.ok) {
//       const catResult = await catRes.json();
//       categoryInfo = catResult.data || catResult || null;
//     } else {
//       fetchError = true;
//     }

//     if (articlesRes.ok) {
//       const articlesResult = await articlesRes.json();
//       articles = articlesResult.data || articlesResult.rows || [];
//     } else {
//       fetchError = true;
//     }
//   } catch (error) {
//     console.error("Помилка завантаження категорії:", error);
//     fetchError = true; // Бекенд недоступний
//   }

//   // 2. ВАЛІДАЦІЯ ТА ДАНІ ДЛЯ МОКІВ (Тільки якщо бекенд лежить)
//   if (fetchError) {
//     const validMockCategories = ['backend', 'frontend', 'architecture', 'javascript', 'devops', 'databases', 'ai', 'career'];
    
//     // Якщо працюємо на моках і URL введено неправильно
//     if (!validMockCategories.includes(slug.toLowerCase())) {
//       notFound();
//     }

//     articles = [
//       {
//         id: 'mock-1',
//         slug: 'why-clean-code-matters',
//         title: 'Why Clean Code Matters (And How to Write It)',
//         excerpt: 'Code is read more often than it is written. Learn the principles of writing clean, readable, and maintainable code.',
//         cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
//       },
//       {
//         id: 'mock-2',
//         slug: 'mastering-typescript-generics',
//         title: 'Mastering TypeScript Generics',
//         excerpt: 'Unlock the full power of TypeScript by understanding generics. Create reusable, type-safe components easily.',
//         cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
//       },
//       {
//         id: 'mock-3',
//         slug: 'core-web-vitals',
//         title: 'Core Web Vitals: A Practical Guide to Web Performance',
//         excerpt: 'Improve your user experience and SEO rankings by focusing on Google\'s Core Web Vitals: LCP, FID, and CLS.',
//         cover_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
//       },
//       {
//         id: 'mock-4',
//         slug: 'css-grid-vs-flexbox',
//         title: 'CSS Grid vs. Flexbox: Which One Should You Use?',
//         excerpt: 'They are both powerful layout tools, but they solve different problems. A deep dive into modern CSS layouts.',
//         cover_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&q=80',
//       },
//       {
//         id: 'mock-5',
//         slug: 'building-rest-api-nestjs',
//         title: 'Building a Production-Ready REST API with NestJS',
//         excerpt: 'Leverage the power of TypeScript and a modular architecture to build scalable backend services.',
//         cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
//       },
//       {
//         id: 'mock-6',
//         slug: 'deep-dive-react-hooks',
//         title: 'A Deep Dive into React Hooks',
//         excerpt: 'Go beyond useState and useEffect. Explore advanced hooks like useReducer, useCallback, and useMemo.',
//         cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
//       }
//     ];
//   }

//   const info = categoryInfo || {
//     name: fetchError ? `${slug}` : slug, 
//     description: 'Перегляд публікацій за обраною категорією.' 
//   };

//   const visibleArticles = articles.slice(0, limit);

//   return (
//     <div className="bg-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-6 py-16">
        
//         <header className="mb-16 border-b border-slate-100 pb-12">
          
//           <nav className="mb-8 text-[12px] font-black uppercase tracking-widest text-slate-400">
//             <ol className="flex items-center space-x-2">
//               <li>
//                 <Link href="/" className="hover:text-blue-600 transition-colors">
//                   Головна
//                 </Link>
//               </li>
//               <li><span className="mx-2 opacity-50">/</span></li>
//               <li>
//                 <Link href="/categories" className="hover:text-blue-600 transition-colors">
//                   Категорії
//                 </Link>
//               </li>
//               <li><span className="mx-2 opacity-50">/</span></li>
//               <li className="text-slate-900 truncate max-w-[200px] sm:max-w-[400px]">
//                {info.name}
//               </li>
//             </ol>
//           </nav>

//           <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter capitalize">
//             {info.name}
//           </h1>
//           <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">
//              {info.description}
//           </p>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//           {visibleArticles.length > 0 ? (
//             visibleArticles.map((article: any) => {
//               const articleHref = `/${slug}/${article.slug}`;

//               return (
//                 <article key={article.id} className="group flex flex-col">
//                   <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6">
//                     <img 
//                       src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
//                       alt={article.title} 
//                       className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
//                     />
//                   </div>
//                   <h2 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
//                     <Link href={articleHref}>{article.title}</Link>
//                   </h2>
//                   <p className="text-slate-500 text-sm mt-3 line-clamp-2">{article.excerpt}</p>
//                 </article>
//               );
//             })
//           ) : (
//             <div className="col-span-full text-center py-20 border border-dashed border-slate-200 rounded-3xl">
//               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
//                 У цій категорії ще немає публікацій.
//               </p>
//             </div>
//           )}
//         </div>

//         {limit < articles.length && (
//           <div className="mt-20 text-center">
//             <Link 
//               href={`/categories/${slug}?limit=${limit + 12}`}
//               className="inline-block px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
//             >
//               Завантажити ще статті
//             </Link>
//           </div>
//         )}

//         {(limit >= articles.length || articles.length === 0) && (
//           <div className="mt-20 text-center py-10 border-t border-slate-50">
//             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
//               {articles.length === 0 ? "Статей у цій категорії не знайдено" : "Це всі доступні публікації на сьогодні"}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: Promise<{ limit?: string }> | { limit?: string };
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug.toLowerCase();
  const limit = parseInt(resolvedSearchParams?.limit || '12', 10);
  const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

  let articles: any[] = [];
  let categoryInfo = null;
  let fetchError = false;

  try {
    const [catRes, articlesRes] = await Promise.all([
      fetch(`${API_URL}/api/categories/${slug}`, { cache: 'no-store' }),
      fetch(`${API_URL}/api/categories/${slug}/articles`, { cache: 'no-store' })
    ]);

    // Валідація: якщо бекенд каже, що категорії немає — 404
    if (catRes.status === 404) {
      notFound();
    }

    if (catRes.ok) {
      const catResult = await catRes.json();
      categoryInfo = catResult.data || catResult || null;
    } else {
      fetchError = true;
    }

    if (articlesRes.ok) {
      const articlesResult = await articlesRes.json();
      articles = articlesResult.data || articlesResult.rows || [];
    } else {
      fetchError = true;
    }
  } catch (error) {
    console.error("Помилка завантаження категорії:", error);
    fetchError = true;
  }

  // --- MOCK DATA З ФІЛЬТРАЦІЄЮ ЗА КАТЕГОРІЄЮ ---
  if (fetchError) {
    const validMockCategories = ['backend', 'frontend', 'architecture', 'javascript', 'devops', 'databases', 'ai', 'career'];
    
    if (!validMockCategories.includes(slug)) {
      notFound();
    }

    const allMockArticles = [
      {
        id: 'mock-1',
        slug: 'why-clean-code-matters',
        title: 'Why Clean Code Matters (And How to Write It)',
        excerpt: 'Code is read more often than it is written. Learn the principles of writing clean, readable, and maintainable code.',
        cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
        category: 'backend'
      },
      {
        id: 'mock-2',
        slug: 'mastering-typescript-generics',
        title: 'Mastering TypeScript Generics',
        excerpt: 'Unlock the full power of TypeScript by understanding generics. Create reusable, type-safe components easily.',
        cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
        category: 'frontend'
      },
      {
        id: 'mock-3',
        slug: 'core-web-vitals',
        title: 'Core Web Vitals: A Practical Guide to Web Performance',
        excerpt: 'Improve your user experience and SEO rankings by focusing on Google\'s Core Web Vitals.',
        cover_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
        category: 'frontend'
      },
      {
        id: 'mock-4',
        slug: 'css-grid-vs-flexbox',
        title: 'CSS Grid vs. Flexbox: Which One Should You Use?',
        excerpt: 'They are both powerful layout tools, but they solve different problems.',
        cover_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&q=80',
        category: 'frontend'
      },
      {
        id: 'mock-5',
        slug: 'building-rest-api-nestjs',
        title: 'Building a Production-Ready REST API with NestJS',
        excerpt: 'Leverage the power of TypeScript and a modular architecture to build scalable backend services.',
        cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
        category: 'backend'
      },
      {
        id: 'mock-6',
        slug: 'deep-dive-react-hooks',
        title: 'A Deep Dive into React Hooks',
        excerpt: 'Go beyond useState and useEffect. Explore advanced hooks like useReducer, useCallback, and useMemo.',
        cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
        category: 'javascript'
      }
    ];

    // Фільтруємо моки так само, як це робить база даних
    articles = allMockArticles.filter(art => art.category === slug);
  }

  const info = categoryInfo || {
    name: slug, 
    description: `Перегляд публікацій за категорією ${slug}.` 
  };

  const visibleArticles = articles.slice(0, limit);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <header className="mb-16 border-b border-slate-100 pb-12">
          <nav className="mb-8 text-[12px] font-black uppercase tracking-widest text-slate-400">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Головна</Link></li>
              <li><span className="mx-2 opacity-50">/</span></li>
              <li><Link href="/categories" className="hover:text-blue-600 transition-colors">Категорії</Link></li>
              <li><span className="mx-2 opacity-50">/</span></li>
              <li className="text-slate-900 truncate max-w-[200px] sm:max-w-[400px] capitalize">{info.name}</li>
            </ol>
          </nav>

          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter capitalize">{info.name}</h1>
          <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">{info.description}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visibleArticles.length > 0 ? (
            visibleArticles.map((article: any) => (
              <article key={article.id} className="group flex flex-col">
                <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6">
                  <img 
                    src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
                    alt={article.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  <Link href={`/${slug}/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="text-slate-500 text-sm mt-3 line-clamp-2">{article.excerpt}</p>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 border border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">У цій категорії ще немає публікацій.</p>
            </div>
          )}
        </div>

        {limit < articles.length && (
          <div className="mt-20 text-center">
            <Link 
              href={`/categories/${slug}?limit=${limit + 12}`}
              className="inline-block px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              Завантажити ще статті
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}