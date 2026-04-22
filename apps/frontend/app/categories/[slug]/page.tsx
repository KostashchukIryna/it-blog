import Link from 'next/link';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: Promise<{ limit?: string }> | { limit?: string };
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const limit = parseInt(resolvedSearchParams?.limit || '12', 10);
  const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

  let articles = [];
  let categoryInfo = null;

  try {
    const [catRes, articlesRes] = await Promise.all([
      fetch(`${API_URL}/api/categories/${slug}`, { cache: 'no-store' }),
      fetch(`${API_URL}/api/categories/${slug}/articles`, { cache: 'no-store' })
    ]);

    if (catRes.ok) {
      const catResult = await catRes.json();
      categoryInfo = catResult.data || catResult || null;
    }

    if (articlesRes.ok) {
      const articlesResult = await articlesRes.json();
      articles = articlesResult.data || articlesResult.rows || [];
    }
  } catch (error) {
    console.error("Помилка завантаження категорії:", error);
  }

  const info = categoryInfo || {
    name: slug, 
    description: 'Перегляд публікацій за обраною категорією.' 
  };

  const visibleArticles = articles.slice(0, limit);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <header className="mb-16 border-b border-slate-100 pb-12">
          
          <nav className="mb-8 text-[12px] font-black uppercase tracking-widest text-slate-400">
            <ol className="flex items-center space-x-2">
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
              <li className="text-slate-900 truncate max-w-[200px] sm:max-w-[400px]">
                {info.name}
              </li>
            </ol>
          </nav>

          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter capitalize">
            {info.name}
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">
            {info.description || 'Перегляд публікацій за обраною категорією.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visibleArticles.length > 0 ? (
            visibleArticles.map((article: any) => {
              
              const articleHref = `/${slug}/${article.slug}`;

              return (
                <article key={article.id} className="group flex flex-col">
                  <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6">
                    <img 
                      src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
                      alt={article.title} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    <Link href={articleHref}>{article.title}</Link>
                  </h2>
                  <p className="text-slate-500 text-sm mt-3 line-clamp-2">{article.excerpt}</p>
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 border border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                У цій категорії ще немає публікацій.
              </p>
            </div>
          )}
        </div>

        {limit < articles.length && (
          <div className="mt-20 text-center">
            {/* Пагінація: веде на правильний шлях категорії */}
            <Link 
              href={`/categories/${slug}?limit=${limit + 12}`}
              className="inline-block px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              Завантажити ще статті
            </Link>
          </div>
        )}

        {(limit >= articles.length || articles.length === 0) && (
          <div className="mt-20 text-center py-10 border-t border-slate-50">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              {articles.length === 0 ? "Статей у цій категорії не знайдено" : "Це всі доступні публікації на сьогодні"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}