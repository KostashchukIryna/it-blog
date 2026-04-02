"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [limit, setLimit] = useState(12);

  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const catsRes = await fetch('http://localhost:3000/api/categories');
        if (catsRes.ok) {
          const catsResult = await catsRes.json();
          const allCats = catsResult.data || catsResult || [];
          const currentCat = allCats.find((c: any) => c.slug === slug);
          setCategoryInfo(currentCat);
        }

        const articlesRes = await fetch(`http://localhost:3000/api/categories/${slug}/articles`);
        if (articlesRes.ok) {
          const articlesResult = await articlesRes.json();
          setArticles(articlesResult.data || articlesResult.rows || []);
        }
      } catch (error) {
        console.error("Помилка завантаження категорії:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-2xl font-black text-slate-300 uppercase tracking-widest">
          Завантаження...
        </p>
      </div>
    );
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
          <Link href="/" className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 inline-block hover:underline">
            ← На головну
          </Link>
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter capitalize">
            {info.name}
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">
            {info.description || 'Перегляд публікацій за обраною категорією.'}
          </p>
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
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="text-slate-500 text-sm mt-3 line-clamp-2">{article.excerpt}</p>
              </article>
            ))
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
            <button 
              onClick={() => setLimit(prev => prev + 12)}
              className="px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              Завантажити ще статті
            </button>
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
