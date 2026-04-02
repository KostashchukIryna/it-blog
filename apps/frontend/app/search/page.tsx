"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`);
        const result = await res.json();
        
        setArticles(result.data || result.rows || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-300 font-black uppercase tracking-widest animate-pulse">Шукаємо «{query}»...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
          Результати для: <span className="text-blue-600">«{query}»</span>
        </h1>
        <p className="text-slate-400 mt-4 font-medium uppercase text-[10px] tracking-widest">
          Знайдено {articles.length} публікацій
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article: any) => (
            <article key={article.id} className="group flex flex-col">
              <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6 shadow-sm">
                <img 
                  src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
                  alt="" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h2>
              <p className="text-slate-500 text-sm mt-3 line-clamp-2">{article.excerpt}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
          <p className="text-slate-400 italic font-medium">Нічого не знайдено. Спробуйте інші ключові слова.</p>
        </div>
      )}
    </main>
  );
}
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Завантаження...</div>}>
      <SearchContent />
    </Suspense>
  );
}
