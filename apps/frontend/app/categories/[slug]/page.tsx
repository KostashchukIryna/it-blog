"use client";

import { useState, use } from 'react';
import Link from 'next/link';

// Mock data
const ALL_ARTICLES = Array.from({ length: 143 }).map((_, i) => ({
  id: i + 1,
  title: `Цікава новина про IT №${i + 1}`,
  slug: `news-${i + 1}`,
  excerpt: "Дізнайтеся, як нові технології змінюють світ розробки та які навички будуть критично важливими...",
  category: i % 4 === 0 ? "JavaScript" : i % 4 === 1 ? "Backend / DevOps" : i % 4 === 2 ? "AI & ML" : "Cybersecurity",
  categorySlug: i % 4 === 0 ? "javascript" : i % 4 === 1 ? "backend-devops" : i % 4 === 2 ? "ai-ml" : "cybersecurity",
  author: "Олександр Технік",
  date: "30 Березня, 2026",
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400" 
}));

// Category descripion
const CATEGORY_INFO: Record<string, { name: string; desc: string }> = {
  'javascript': { name: 'JavaScript / Frontend', desc: 'Все про сучасний фронтенд, фреймворки та екосистему JS.' },
  'backend-devops': { name: 'Backend / DevOps', desc: 'Серверна логіка, бази даних, хмарні технології та автоматизація розгортання.' },
  'ai-ml': { name: 'AI & ML', desc: 'Огляди нейромереж, алгоритмів та майбутнього штучного інтелекту.' },
  'cybersecurity': { name: 'Кібербезпека', desc: 'Як захистити свої дані та створювати безпечні додатки.' },
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [limit, setLimit] = useState(12);

  const info = CATEGORY_INFO[slug] || { name: slug, desc: 'Перегляд публікацій за категорією.' };

  const filteredArticles = ALL_ARTICLES.filter(art => art.categorySlug === slug);
  const visibleArticles = filteredArticles.slice(0, limit);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Header */}
        <header className="mb-16 border-b border-slate-100 pb-12">
          <Link href="/" className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 inline-block hover:underline">
            ← На головну
          </Link>
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
            {info.name}
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">
            {info.desc}
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visibleArticles.length > 0 ? (
            visibleArticles.map((article) => (
              <article key={article.id} className="group flex flex-col">
                <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6">
                  <img src={article.image} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="text-slate-500 text-sm mt-3 line-clamp-2">{article.excerpt}</p>
              </article>
            ))
          ) : (
            <p className="text-slate-400 italic">У цій категорії ще немає публікацій.</p>
          )}
        </div>

        {/* Show more */}
        {limit < filteredArticles.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setLimit(prev => prev + 12)}
              className="px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-2xl"
            >
              Завантажити ще статті
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