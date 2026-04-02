"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Всі');
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [artRes, catRes] = await Promise.all([
          fetch("/api/articles"),
          fetch("/api/categories"),
        ]);

        const artResult = await artRes.json();
        const catResult = await catRes.json();

        setArticles(artResult.data || []);

        const realCategories = catResult.data || catResult || [];
        setCategories(["Всі", ...realCategories.map((c: any) => c.name)]);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-2xl font-black text-slate-300 uppercase tracking-widest">
          Завантаження...
        </p>
      </div>
    );
  }

  const filteredArticles = articles.filter((article: any) => {
    if (activeCategory === "Всі") return true;
    return article.category?.name === activeCategory;
  });

  const visibleArticles = filteredArticles.slice(0, limit);

  const showMore = () => {
    setLimit((prev) => prev + 12);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-16">
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
            Останні публікації
          </h1>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setLimit(12);
                }}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-slate-400 font-medium">
            Показано {visibleArticles.length} із {filteredArticles.length} статей
          </p>
        </header>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleArticles.map((article) => (
            <article key={article.id} className="group border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-video bg-slate-200 relative overflow-hidden">
                <img 
                  src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
                  alt={article.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6">
                <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                  {article.category?.name || "Без категорії"}
                </span>
                <h2 className="text-xl font-bold mt-2 leading-tight">
                  <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* LOAD MORE POSTS */}
        {limit < filteredArticles.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={showMore}
              className="px-12 py-5 uppercase bg-slate-900 text-white text-xs font-black rounded-[25px] hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Завантажити ще
            </button>
          </div>
        )}

        {/* NO MORE POSTS TO SHOW */}
        {(limit >= filteredArticles.length || filteredArticles.length === 0) && (
          <div className="mt-20 text-center py-10 border-t border-slate-50">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              {filteredArticles.length === 0 ? "Статей у цій категорії не знайдено" : "Це всі доступні публікації на сьогодні"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
