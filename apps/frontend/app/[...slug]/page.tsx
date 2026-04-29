// import { notFound, redirect } from "next/navigation";
// import Link from "next/link";

// export default async function ArticlePage({
//   params,
// }: {
//   params: Promise<{ slug: string[] }> | { slug: string[] };
// }) {
//   const resolvedParams = await params;
//   const slugArray = resolvedParams.slug;
//   const API_URL = process.env.BACKEND_URL || "http://localhost:3001";

//   if (!slugArray || slugArray.length !== 2) {
//     notFound();
//   }

//   const urlCategory = decodeURIComponent(slugArray[0]).toLowerCase();
//   const finalSlug = decodeURIComponent(slugArray[1]).toLowerCase();

//   let article: any = null;
//   let related: any[] = [];
//   let shouldCheckMocks = false;

//   try {
//     const artRes = await fetch(`${API_URL}/api/articles/${finalSlug}`, { cache: "no-store" });
    
//     if (artRes.status === 404) {
//       shouldCheckMocks = true; 
//     } else if (artRes.ok) {
//       const artData = await artRes.json();
//       article = artData.data || artData;

//       if (article?.id) {
//         fetch(`${API_URL}/api/articles/${article.id}/view`, { method: "POST", cache: "no-store" }).catch(() => {});
//         const relRes = await fetch(`${API_URL}/api/articles/${finalSlug}/related`, { cache: "no-store" });
//         if (relRes.ok) {
//           const relData = await relRes.json();
//           related = relData.data || relData || [];
//         }
//       }
//     } else {
//       shouldCheckMocks = true; 
//     }
//   } catch (error) {
//     console.error("Помилка підключення до БД:", error);
//     shouldCheckMocks = true;
//   }

//   if (shouldCheckMocks && !article) {
//     const mockArticlesDb = [
//       {
//         slug: 'why-clean-code-matters',
//         title: 'Why Clean Code Matters (And How to Write It)',
//         excerpt: 'Code is read more often than it is written. Learn the principles of writing clean, readable, and maintainable code.',
//         content: `<p>Чистий код — це не просто забаганка перфекціоністів...</p>`,
//         cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
//         category: { name: "Backend", slug: "backend" },
//       },
//       {
//         slug: 'mastering-typescript-generics',
//         title: 'Mastering TypeScript Generics',
//         excerpt: 'Unlock the full power of TypeScript by understanding generics.',
//         content: `<p>Дженерики (Generics) у TypeScript...</p>`,
//         cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
//         category: { name: "Frontend", slug: "frontend" },
//       },
//       {
//         slug: 'core-web-vitals',
//         title: 'Core Web Vitals: A Practical Guide to Web Performance',
//         excerpt: 'Improve your user experience and SEO rankings.',
//         content: `<p>Google Core Web Vitals — це набір метрик...</p>`,
//         cover_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
//         category: { name: "Frontend", slug: "frontend" },
//       },
//       {
//         slug: 'css-grid-vs-flexbox',
//         title: 'CSS Grid vs. Flexbox: Which One Should You Use?',
//         excerpt: 'They are both powerful layout tools.',
//         content: `<p>Flexbox створений для одновимірних макетів...</p>`,
//         cover_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&q=80',
//         category: { name: "Frontend", slug: "frontend" },
//       },
//       {
//         slug: 'building-rest-api-nestjs',
//         title: 'Building a Production-Ready REST API with NestJS',
//         excerpt: 'Leverage the power of TypeScript and a modular architecture.',
//         content: `<p>NestJS змінив правила гри у світі Node.js.</p>`,
//         cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
//         category: { name: "Backend", slug: "backend" },
//       },
//       {
//         slug: 'deep-dive-react-hooks',
//         title: 'A Deep Dive into React Hooks',
//         excerpt: 'Go beyond useState and useEffect.',
//         content: `<p>Ви вже знаєте useState та useEffect...</p>`,
//         cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
//         category: { name: "JavaScript", slug: "javascript" },
//       }
//     ];

//     const foundMock = mockArticlesDb.find(a => a.slug === finalSlug);
    
//     if (!foundMock) {
//       notFound();
//     }

//     article = {
//       ...foundMock,
//       id: `mock-${foundMock.slug}`,
//       published_at: new Date().toISOString(),
//       views: 120,
//       author: { name: "Редакція Blog.IT", slug: "editorial" }
//     };

//     related = mockArticlesDb.filter(a => a.slug !== finalSlug).slice(0, 3);
//   }

//   if (!article) return notFound();

//   const realCategorySlug = article.category?.slug?.toLowerCase();
  
//   if (urlCategory !== realCategorySlug) {
//     redirect(`/${realCategorySlug}/${finalSlug}`);
//   }

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "";
//     return new Date(dateString).toLocaleDateString("uk-UA");
//   };

//   return (
//     <article className="min-h-screen bg-white pb-20">
//       <header className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
//         <nav className="mb-10 text-[12px] font-black uppercase tracking-widest text-slate-400">
//           <ol className="flex items-center justify-center space-x-2">
//             <li><Link href="/" className="hover:text-blue-600 transition-colors">Головна</Link></li>
//             <li><span className="mx-2 opacity-50">/</span></li>
//             <li><Link href="/categories" className="hover:text-blue-600 transition-colors">Категорії</Link></li>
//             <li><span className="mx-2 opacity-50">/</span></li>
//             <li>
//               <Link href={`/categories/${realCategorySlug}`} className="hover:text-blue-600 transition-colors uppercase">
//                 {article.category?.name}
//               </Link>
//             </li>
//             <li><span className="mx-2 opacity-50">/</span></li>
//             <li className="text-slate-900 truncate max-w-[200px]">{article.title}</li>
//           </ol>
//         </nav>

//         <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
//           {article.title}
//         </h1>
//         <p className="text-xl text-slate-500 font-medium mb-8 max-w-2xl mx-auto">{article.excerpt}</p>
//       </header>

//       <div className="max-w-5xl mx-auto px-6 mb-16">
//         <div className="aspect-[21/9] w-full rounded-[40px] overflow-hidden bg-slate-100 border border-slate-100">
//           {article.cover_url && <img src={article.cover_url} alt={article.title} className="w-full h-full object-cover" />}
//         </div>
//       </div>

//       <div
//         className="whitespace-pre-wrap max-w-3xl mx-auto px-6 prose prose-lg prose-slate font-medium leading-relaxed mb-16"
//         dangerouslySetInnerHTML={{ __html: article.content }}
//       />
      
//       {/* Секція "Читайте також" */}
//       {related.length > 0 && (
//         <div className="bg-slate-50 py-20 border-t border-slate-100 mt-20">
//           <div className="max-w-6xl mx-auto px-6">
//             <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter">Читайте також</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {related.map((rel: any) => (
//                 <Link key={rel.slug} href={`/${rel.category.slug}/${rel.slug}`} className="group block bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all p-6">
//                   <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
//                     {rel.title}
//                   </h3>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </article>
//   );
// }

import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }> | { slug: string[] };
}) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  const API_URL = process.env.BACKEND_URL || "http://localhost:3001";

  // 1. ЛОГІКА РЕДИРЕКТУ ДЛЯ КАТЕГОРІЙ
  // Якщо в URL лише одне слово (наприклад, /frontend), перевіряємо, чи це категорія
  if (slugArray.length === 1) {
    const potentialCategory = decodeURIComponent(slugArray[0]).toLowerCase();
    
    // Список дійсних категорій для перевірки (можна додати запит до БД тут)
    const validCategories = ['backend', 'frontend', 'architecture', 'javascript', 'devops', 'databases', 'ai', 'career'];

    if (validCategories.includes(potentialCategory)) {
      // Робимо редирект на правильний шлях: /categories/[slug]
      redirect(`/categories/${potentialCategory}`);
    }
  }

  // 2. ВАЛІДАЦІЯ СТРУКТУРИ ДЛЯ СТАТТІ
  // Якщо ми тут, значить це не категорія. Для статті очікуємо 2 сегменти: /category/article-slug
  if (slugArray.length !== 2) {
    notFound();
  }

  const urlCategory = decodeURIComponent(slugArray[0]).toLowerCase();
  const finalSlug = decodeURIComponent(slugArray[1]).toLowerCase();

  let article: any = null;
  let related: any[] = [];
  let shouldCheckMocks = false;

  // --- 3. ПОШУК СТАТТІ В БД ---
  try {
    const artRes = await fetch(`${API_URL}/api/articles/${finalSlug}`, { cache: "no-store" });
    
    if (artRes.status === 404) {
      shouldCheckMocks = true;
    } else if (artRes.ok) {
      const artData = await artRes.json();
      article = artData.data || artData;

      if (article?.id) {
        fetch(`${API_URL}/api/articles/${article.id}/view`, { method: "POST", cache: "no-store" }).catch(() => {});
        const relRes = await fetch(`${API_URL}/api/articles/${finalSlug}/related`, { cache: "no-store" });
        if (relRes.ok) {
          const relData = await relRes.json();
          related = relData.data || relData || [];
        }
      }
    } else {
      shouldCheckMocks = true;
    }
  } catch (error) {
    console.error("Помилка підключення до БД:", error);
    shouldCheckMocks = true;
  }

  // --- 4. ПОШУК СТАТТІ В МОКАХ (якщо в БД немає або вона офлайн) ---
  if (shouldCheckMocks && !article) {
    const mockArticlesDb = [
      {
        slug: 'why-clean-code-matters',
        title: 'Why Clean Code Matters (And How to Write It)',
        excerpt: 'Code is read more often than it is written. Learn the principles of writing clean, readable, and maintainable code.',
        content: `<p>Чистий код — це не просто забаганка перфекціоністів...</p>`,
        cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
        category: { name: "Backend", slug: "backend" },
      },
      {
        slug: 'mastering-typescript-generics',
        title: 'Mastering TypeScript Generics',
        excerpt: 'Unlock the full power of TypeScript by understanding generics.',
        content: `<p>Дженерики (Generics) у TypeScript...</p>`,
        cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
        category: { name: "Frontend", slug: "frontend" },
      },
      {
        slug: 'css-grid-vs-flexbox',
        title: 'CSS Grid vs. Flexbox: Which One Should You Use?',
        excerpt: 'They are both powerful layout tools, but they solve different problems.',
        content: `<p>CSS Grid vs. Flexbox...</p>`,
        cover_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&q=80',
        category: { name: "Frontend", slug: "frontend" },
      }
    ];

    const foundMock = mockArticlesDb.find(a => a.slug === finalSlug);
    
    if (!foundMock) {
      notFound();
    }

    article = {
      ...foundMock,
      id: `mock-${foundMock.slug}`,
      published_at: new Date().toISOString(),
      views: 120,
      author: { name: "Редакція Blog.IT", slug: "editorial" }
    };

    related = mockArticlesDb.filter(a => a.slug !== finalSlug).slice(0, 3);
  }

  // --- 5. ВАЛІДАЦІЯ КОМБІНАЦІЇ КАТЕГОРІЯ + СТАТТЯ ---
  if (!article) return notFound();

  const realCategorySlug = article.category?.slug?.toLowerCase();
  
  // Якщо стаття існує, але категорія в URL вказана невірно — редирект на правильну категорію
  if (urlCategory !== realCategorySlug) {
    redirect(`/${realCategorySlug}/${finalSlug}`);
  }

  // --- 6. РЕНДЕРИНГ (Використовує твій дизайн) ---
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  return (
    <article className="min-h-screen bg-white pb-20">
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        <nav className="mb-10 text-[12px] font-black uppercase tracking-widest text-slate-400">
          <ol className="flex items-center justify-center space-x-2">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Головна</Link></li>
            <li><span className="mx-2 opacity-50">/</span></li>
            <li><Link href="/categories" className="hover:text-blue-600 transition-colors">Категорії</Link></li>
            <li><span className="mx-2 opacity-50">/</span></li>
            <li>
              <Link href={`/categories/${realCategorySlug}`} className="hover:text-blue-600 transition-colors uppercase">
                {article.category?.name}
              </Link>
            </li>
            <li><span className="mx-2 opacity-50">/</span></li>
            <li className="text-slate-900 truncate max-w-[200px]">{article.title}</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
          {article.title}
        </h1>
        <p className="text-xl text-slate-500 font-medium mb-8 max-w-2xl mx-auto">{article.excerpt}</p>
      </header>

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] w-full rounded-[40px] overflow-hidden bg-slate-100 border border-slate-100">
          {article.cover_url && <img src={article.cover_url} alt={article.title} className="w-full h-full object-cover" />}
        </div>
      </div>

      <div
        className="whitespace-pre-wrap max-w-3xl mx-auto px-6 prose prose-lg prose-slate font-medium leading-relaxed mb-16"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}