"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthorPage() {
  const { slug } = useParams();
  
  const [author, setAuthor] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!slug) return;
      try {
        const authorRes = await fetch(`/api/authors/${slug}`);
        if (authorRes.ok) {
          const authorData = await authorRes.json();
          setAuthor(authorData.data || authorData);
        }

        const articlesRes = await fetch(`/api/authors/${slug}/articles`);
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          setArticles(articlesData.data || articlesData.rows || []);
        }
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchAuthorData();
  }, [slug]);

  const visibleArticles = articles.slice(0, limit);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl font-bold text-slate-300 uppercase tracking-widest">Завантаження профілю...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl font-bold text-slate-400">Автора не знайдено ^_^</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      
      <section className="bg-slate-50 border-b border-slate-100 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-900 flex items-center justify-center text-white text-6xl font-black">
            {author.avatar_url ? (
              <img src={author.avatar_url} alt={author.name} className="w-full h-full object-cover" />
            ) : (
              author.name?.[0] || "А"
            )}
          </div>
          
          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
              {author.name}
            </h1>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-6 ml-[3px]">
              {author.role || "Автор блогу"}
            </p>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl ml-[3px]">
              {author.bio || "Цей автор ще не додав розгорнуту інформацію про себе."}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight border-l-4 border-blue-600 pl-4">
          Публікації автора ({articles.length})
        </h2>

        {articles.length === 0 ? (
           <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Цей автор ще не має статей</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {visibleArticles.map((article: any) => (
              <article key={article.id} className="group flex flex-col">
                <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-3xl mb-6 shadow-sm">
                  <img 
                    src={article.cover_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"} 
                    alt={article.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                  {/* Беремо ім'я категорії з об'єкта */}
                  {article.category?.name || "Без категорії"}
                </span>
                <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>
              </article>
            ))}
          </div>
        )}

        {limit < articles.length && (
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
