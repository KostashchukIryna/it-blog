import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://it-blog-news.pp.ua';

  try {
    const catRes = await fetch(`${API_URL}/api/categories/${slug}`, { cache: 'no-store' });
    
    if (catRes.ok) {
      const catResult = await catRes.json();
      const categoryInfo = catResult.data || catResult;
      
      if (categoryInfo) {
        const canonicalUrl = `${DOMAIN}/categories/${slug}`;
        return {
          title: `${categoryInfo.name} - Blog.IT`,
          description: categoryInfo.description || `Публікації про ${categoryInfo.name}`,
          alternates: {
            canonical: canonicalUrl,
          },
          openGraph: {
            title: `${categoryInfo.name} - Blog.IT`,
            description: categoryInfo.description || `Публікації про ${categoryInfo.name}`,
            type: "website",
            url: canonicalUrl,
          },
        };
      }
    }
  } catch (error) {
    console.error("Помилка отримання метаданих категорії:", error);
  }

  return { title: "Category" };
}

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

  try {
    const [catRes, articlesRes] = await Promise.all([
      fetch(`${API_URL}/api/categories/${slug}`, { cache: 'no-store' }),
      fetch(`${API_URL}/api/categories/${slug}/articles`, { cache: 'no-store' })
    ]);

    // Якщо категорія не знайдена в базі — одразу видаємо 404
    if (catRes.status === 404) {
      notFound();
    }

    if (catRes.ok) {
      const catResult = await catRes.json();
      categoryInfo = catResult.data || catResult || null;
    }

    if (articlesRes.ok) {
      const articlesResult = await articlesRes.json();
      articles = articlesResult.data || articlesResult.rows || [];
    }
  } catch (error) {
    console.error("Помилка з'єднання з бекендом:", error);
    // В разі критичної помилки мережі також можна видати 404 або повідомлення
  }

  // Якщо ми успішно з'єдналися, але бекенд не повернув інфо про категорію
  if (!categoryInfo && articles.length === 0) {
    notFound();
  }

  const info = categoryInfo || {
    name: slug, 
    description: 'Перегляд публікацій за обраною категорією.' 
  };

  const visibleArticles = articles.slice(0, limit);

  // JSON-LD Schema for Category/Collection
  const canonicalUrl = `https://it-blog-news.pp.ua/categories/${slug}`;
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: info.name,
    description: info.description,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Blog.IT",
      logo: {
        "@type": "ImageObject",
        url: "https://it-blog-news.pp.ua/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
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
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                У цій категорії ще немає публікацій у базі даних.
              </p>
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
    </>
  );
}