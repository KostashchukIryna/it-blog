// import { notFound } from "next/navigation";
// import Link from "next/link";

// const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// async function getAuthor(slug: string) {
//   try {
//     const res = await fetch(`${API_URL}/api/authors/${slug}`, { cache: 'no-store' });
//     if (!res.ok) return null;
//     const data = await res.json();
//     return data.data || data;
//   } catch (error) {
//     console.error("Помилка завантаження автора:", error);
//     return null;
//   }
// }

// async function getArticles(slug: string) {
//   try {
//     const res = await fetch(`${API_URL}/api/authors/${slug}/articles`, { cache: 'no-store' });
//     if (!res.ok) return [];
//     const data = await res.json();
//     return data.data || data.rows || [];
//   } catch (error) {
//     console.error("Помилка завантаження статей:", error);
//     return [];
//   }
// }

// export default async function AuthorPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ slug: string }> | { slug: string };
//   searchParams: Promise<{ limit?: string }> | { limit?: string };
// }) {
//   const resolvedParams = await params;
//   const { slug } = resolvedParams;
  
//   const resolvedSearchParams = await searchParams;
//   const limit = parseInt(resolvedSearchParams?.limit || '12', 10);

//   if (!slug) return notFound();

//   const [author, articles] = await Promise.all([
//     getAuthor(slug),
//     getArticles(slug),
//   ]);

//   if (!author) return notFound();

//   const visibleArticles = articles.slice(0, limit);

//   return (
//     <div className="bg-white min-h-screen">
//       <section className="bg-slate-50 border-b border-slate-100 pt-20 pb-16 px-6">
//         <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
//           <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-900 flex items-center justify-center text-white text-6xl font-black">
//             {author.avatar_url ? (
//               <img src={author.avatar_url} alt={author.name} className="w-full h-full object-cover" />
//             ) : (
//               author.name?.[0] || "А"
//             )}
//           </div>
          
//           <div className="text-center md:text-left flex-1">
//             <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
//               {author.name}
//             </h1>
            
//             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4 ml-[3px]">
//               <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">
//                 Автор блогу
//               </p>
//               <span className="text-slate-300">•</span>
//               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
//                 Статей: {articles.length}
//               </p>
//             </div>

//             <p className="text-slate-600 text-lg leading-relaxed max-w-2xl ml-[3px] mb-6">
//               {author.bio || "Цей автор ще не додав інформацію про себе."}
//             </p>

//             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 ml-[3px]">
//               {author.social_links?.github && (
//                 <a 
//                   href={author.social_links.github} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="px-5 py-2 bg-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
//                 >
//                   GitHub
//                 </a>
//               )}
//               {author.social_links?.linkedin && (
//                 <a 
//                   href={author.social_links.linkedin} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
//                 >
//                   LinkedIn
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight border-l-4 border-blue-600 pl-4">
//           Публікації автора ({articles.length})
//         </h2>

//         {articles.length === 0 ? (
//            <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl">
//              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Цей автор ще не має статей</p>
//            </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//             {visibleArticles.map((article: any) => {
              
//               const articleHref = article.category?.slug 
//                 ? `/${article.category.slug}/${article.slug}` 
//                 : `/${article.slug}`;

//               return (
//                 <article key={article.id} className="group flex flex-col">
//                   <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6 shadow-sm">
//                     <img 
//                       src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
//                       alt={article.title} 
//                       className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
//                     />
//                   </div>
//                   <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
//                     {article.category?.name || "Без категорії"}
//                   </span>
//                   <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
//                     {/* Використовуємо нове посилання */}
//                     <Link href={articleHref}>{article.title}</Link>
//                   </h3>
//                 </article>
//               );
//             })}
//           </div>
//         )}

//         {limit < articles.length && (
//           <div className="mt-20 text-center">
//             <Link 
//               href={`/authors/${slug}?limit=${limit + 12}`}
//               className="inline-block px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
//             >
//               Більше статей
//             </Link>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }


import { notFound } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Змінив функцію, щоб вона повертала об'єкт з даними та статусом помилки
async function getAuthorData(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/authors/${slug}`, { cache: 'no-store' });
    if (!res.ok) return { data: null, isError: true };
    const data = await res.json();
    return { data: data.data || data, isError: false };
  } catch (error) {
    console.error("Помилка завантаження автора:", error);
    return { data: null, isError: true };
  }
}

// Змінив функцію, щоб вона повертала об'єкт з даними та статусом помилки
async function getArticlesData(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/authors/${slug}/articles`, { cache: 'no-store' });
    if (!res.ok) return { data: [], isError: true };
    const data = await res.json();
    return { data: data.data || data.rows || [], isError: false };
  } catch (error) {
    console.error("Помилка завантаження статей:", error);
    return { data: [], isError: true };
  }
}

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: Promise<{ limit?: string }> | { limit?: string };
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const resolvedSearchParams = await searchParams;
  const limit = parseInt(resolvedSearchParams?.limit || '12', 10);

  if (!slug) return notFound();

  // Викликаємо оновлені функції
  const [authorRes, articlesRes] = await Promise.all([
    getAuthorData(slug),
    getArticlesData(slug),
  ]);

  let author = authorRes.data;
  let articles = articlesRes.data;
  const fetchError = authorRes.isError || articlesRes.isError;

  // --- MOCK DATA (Якщо бекенд лежить) ---
  if (fetchError || !author) {
    // 1. Заглушка профілю автора
    author = {
      id: "mock-author",
      slug: slug,
      name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      bio: "Я обожнюю писати про чистий код, архітектуру та сучасний JavaScript.",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
      social_links: {
        github: "https://github.com",
        linkedin: "https://linkedin.com"
      }
    };

    // 2. Заглушка статей цього автора
    articles = [
      {
        id: 'mock-1',
        slug: 'why-clean-code-matters',
        title: 'Why Clean Code Matters (And How to Write It)',
        cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
        category: { name: "BACKEND", slug: "backend" },
      },
      {
        id: 'mock-5',
        slug: 'building-rest-api-nestjs',
        title: 'Building a Production-Ready REST API with NestJS',
        cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
        category: { name: "BACKEND", slug: "backend" },
      },
      {
        id: 'mock-6',
        slug: 'deep-dive-react-hooks',
        title: 'A Deep Dive into React Hooks',
        cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
        category: { name: "JAVASCRIPT", slug: "javascript" },
      }
    ];
  }

  if (!author) return notFound();

  const visibleArticles = articles.slice(0, limit);

  // ТВОЯ ВЕРСТКА: Без змін
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-slate-50 border-b border-slate-100 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-900 flex items-center justify-center text-white text-6xl font-black">
            {author.avatar_url ? (
              <img src={author.avatar_url} alt={author.name} className="w-full h-full object-cover" />
            ) : (
              author.name?.[0] || "А"
            )}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
              {author.name}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4 ml-[3px]">
              <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">
                Автор блогу
              </p>
              <span className="text-slate-300">•</span>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                Статей: {articles.length}
              </p>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl ml-[3px] mb-6">
              {author.bio || "Цей автор ще не додав інформацію про себе."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 ml-[3px]">
              {author.social_links?.github && (
                <a 
                  href={author.social_links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  GitHub
                </a>
              )}
              {author.social_links?.linkedin && (
                <a 
                  href={author.social_links.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  LinkedIn
                </a>
              )}
            </div>
            
            {/* {fetchError && (
              <div className="mt-6 inline-block bg-amber-100 text-amber-800 text-xs font-bold px-4 py-2 rounded-lg border border-amber-200">
                ⚠️ Відображаються тестові дані (Бекенд недоступний)
              </div>
            )} */}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight border-l-4 border-blue-600 pl-4">
          Публікації автора ({articles.length})
        </h2>

        {articles.length === 0 ? (
           <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Цей автор ще не має статей</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {visibleArticles.map((article: any) => {
              
              const articleHref = article.category?.slug 
                ? `/${article.category.slug}/${article.slug}` 
                : `/${article.slug}`;

              return (
                <article key={article.id} className="group flex flex-col">
                  <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6 shadow-sm">
                    <img 
                      src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
                      alt={article.title} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                    {article.category?.name || "Без категорії"}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    <Link href={articleHref}>{article.title}</Link>
                  </h3>
                </article>
              );
            })}
          </div>
        )}

        {limit < articles.length && (
          <div className="mt-20 text-center">
            <Link 
              href={`/authors/${slug}?limit=${limit + 12}`}
              className="inline-block px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Більше статей
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}