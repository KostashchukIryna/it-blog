import { notFound } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function getTag(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/tags`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const allTags = data.data || data || [];
    return allTags.find((t: any) => t.slug === slug);
  } catch (error) {
    console.error("Помилка завантаження тегу:", error);
    return null;
  }
}

async function getArticles(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/tags/${slug}/articles`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data.rows || [];
  } catch (error) {
    console.error("Помилка завантаження статей:", error);
    return [];
  }
}

export default async function TagPage({
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

  const [tagInfo, articles] = await Promise.all([
    getTag(slug),
    getArticles(slug),
  ]);

  const tagName = tagInfo?.name || slug;
  const visibleArticles = articles.slice(0, limit);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <header className="mb-16 border-b border-slate-100 pb-12">
          <Link href="/" className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block hover:text-blue-600 transition-colors">
            ← Повернутися
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 text-2xl font-black">
              #
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter capitalize">
              {tagName}
            </h1>
          </div>
          <p className="text-slate-500 font-medium tracking-wide">
            Знайдено {articles.length} публікацій за цим тегом
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visibleArticles.length > 0 ? (
            visibleArticles.map((article: any) => {
            
              const postTags = article.tags && Array.isArray(article.tags) 
                ? article.tags.map((t: any) => t.slug || t) 
                : [slug];

              return (
                <article key={article.id} className="group flex flex-col">
                  <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6 shadow-sm">
                    <img 
                      src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
                      alt={article.title} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {postTags.map((t: string) => (
                      <span key={t} className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded ${t === slug ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h2>
                </article>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
              <p className="text-slate-400 italic font-medium">Статей з тегом #{tagName} не знайдено.</p>
            </div>
          )}
        </div>

        {limit < articles.length && (
          <div className="mt-20 text-center">
            <Link 
              href={`/tags/${slug}?limit=${limit + 12}`}
              className="inline-block px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Завантажити ще статті
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}