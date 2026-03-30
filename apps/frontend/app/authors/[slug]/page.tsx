"use client";

import { useState, use } from 'react';
import Link from 'next/link';

// Mock data
const AUTHORS_INFO: Record<string, { name: string; role: string; bio: string; avatar: string }> = {
  'oleksandr-tekhnik': {
    name: 'Олександр Технік',
    role: 'Senior Software Engineer',
    bio: 'Розробник з 5-річним досвідом. Пишу про сучасні веб-технології, архітектуру додатків та розповідаю складні речі простими словами.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' // Фото профілю
  }
};

const ALL_ARTICLES = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  title: `Цікава новина про IT №${i + 1}`,
  slug: `news-${i + 1}`,
  excerpt: "Дізнайтеся, як нові технології змінюють світ розробки та які навички будуть критично важливими...",
  category: i % 3 === 0 ? "JavaScript" : "AI & ML",
  authorSlug: "oleksandr-tekhnik",
  date: "30 Березня, 2026",
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"
}));

export default function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [limit, setLimit] = useState(12);

  const author = AUTHORS_INFO[slug];
  
  const authorArticles = ALL_ARTICLES.filter(art => art.authorSlug === slug);
  const visibleArticles = authorArticles.slice(0, limit);

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl font-bold text-slate-400">Автора не знайдено ^_^</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      
      {/* Profile*/}
      <section className="bg-slate-50 border-b border-slate-100 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Picture */}
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>
          
          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
              {author.name}
            </h1>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-6 ml-[3px]">
              {author.role}
            </p>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl ml-[3px]">
              {author.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Authors posts */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight border-l-4 border-blue-600 pl-4">
          Публікації автора ({authorArticles.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visibleArticles.map((article) => (
            <article key={article.id} className="group flex flex-col">
              <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6 shadow-sm">
                <img src={article.image} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
              </div>
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                {article.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h3>
            </article>
          ))}
        </div>

        {/* Load more */}
        {limit < authorArticles.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setLimit(prev => prev + 12)}
              className="px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Більше статей
            </button>
          </div>
        )}
      </section>
      
    </div>
  );
}