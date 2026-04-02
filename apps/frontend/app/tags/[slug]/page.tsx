"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [limit, setLimit] = useState(12);

  const [tagInfo, setTagInfo] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        const tagsRes = await fetch('http://localhost:3000/api/tags');
        if (tagsRes.ok) {
          const tagsResult = await tagsRes.json();
          const allTags = tagsResult.data || tagsResult || [];
          const currentTag = allTags.find((t: any) => t.slug === slug);
          setTagInfo(currentTag);
        }

        const articlesRes = await fetch(`http://localhost:3000/api/tags/${slug}/articles`);
        if (articlesRes.ok) {
          const articlesResult = await articlesRes.json();
          setArticles(articlesResult.data || articlesResult.rows || []);
        }
      } catch (error) {
        console.error("Помилка завантаження тегу:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTagData();
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
            <button 
              onClick={() => setLimit(prev => prev + 12)}
              className="px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Завантажити ще статті
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
