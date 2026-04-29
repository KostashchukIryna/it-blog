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

  try {
    const [artRes, catRes] = await Promise.all([
      fetch(`${API_URL}/api/articles`, { cache: 'no-store' }),
      fetch(`${API_URL}/api/categories`, { cache: 'no-store' }),
    ]);

    if (artRes.ok) {
      const artResult = await artRes.json();
      articles = artResult.data || artResult.rows || [];
    }

    if (catRes.ok) {
      const catResult = await catRes.json();
      const realCategories = catResult.data || catResult || [];
      categories = ["Всі", ...realCategories.map((c: any) => c.name)];
    }
  } catch (error) {
    console.error("Бекенд недоступний:", error);
  }

  // Фільтрація на рівні фронтенду (якщо API не підтримує фільтрацію)
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
          {visibleArticles.length > 0 ? (
            visibleArticles.map((article: any) => {
              const categorySlug = article.category?.slug || 'uncategorized';
              const articleHref = `/${categorySlug}/${article.slug}`;

              return (
                <article key={article.id} className="group border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col bg-white">
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img 
                      src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
                      alt={article.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                      {article.category?.name || "Без категорії"}
                    </span>
                    <h2 className="text-2xl font-black mt-2 leading-tight text-slate-900">
                      <Link href={articleHref} className="hover:text-blue-600 transition-colors">
                        {article.title}
                      </Link>
                    </h2>
                    <p className="text-slate-500 text-sm mt-4 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Статей не знайдено
              </p>
            </div>
          )}
        </div>

        {limit < filteredArticles.length && (
          <div className="mt-20 text-center">
            <Link 
              href={`/?category=${encodeURIComponent(activeCategory)}&limit=${limit + 12}`}
              className="inline-block px-12 py-5 uppercase bg-slate-900 text-white text-[10px] font-black rounded-full hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Завантажити ще
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}