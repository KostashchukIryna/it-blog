"use client";

import { useState } from 'react';
import Link from 'next/link';

// Mock data
const ALL_ARTICLES = Array.from({ length: 143 }).map((_, i) => ({
  id: i + 1,
  title: i === 0 ? "Майбутнє штучного інтелекту у 2026 році" : `Цікава новина про IT №${i + 1}`,
  slug: `news-${i + 1}`,
  info: "Дізнайтеся, як нові технології змінюють світ розробки та які навички будуть критично важливими...",
  category: i % 4 === 0 ? "JavaScript" : i % 4 === 1 ? "Backend" : i % 4 === 2 ? "Штучний інтелект" : "Кібербезпека",
  author: "Олександр Технік",
  date: "30 Березня, 2026",
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400" 
}));

export default function HomePage() {
  // Active category state
  const [activeCategory, setActiveCategory] = useState('Всі');
  const [limit, setLimit] = useState(12);

  const categories = ['Всі', 'JavaScript', 'Backend', 'Штучний інтелект', 'Кібербезпека'];

  // Filter array by category
  const filteredArticles = ALL_ARTICLES.filter(article => 
    activeCategory === 'Всі' || article.category === activeCategory
  );

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
                  src={article.image} 
                  alt="" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6">
                <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                  {article.category}
                </span>
                <h2 className="text-xl font-bold mt-2 leading-tight">
                  <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                  {article.info}
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
