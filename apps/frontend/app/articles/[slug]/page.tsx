"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ArticleReadPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const artRes = await fetch(
          `http://localhost:3000/api/articles/${slug}`,
        );
        if (artRes.ok) {
          const artData = await artRes.json();
          setArticle(artData.data || artData);

          if (artData.data?.id || artData.id) {
            fetch(
              `http://localhost:3000/api/articles/${artData.data?.id || artData.id}/view`,
              {
                method: "POST",
              },
            ).catch((e) => console.log("Помилка лічильника переглядів", e));
          }
        }

        const relRes = await fetch(
          `http://localhost:3000/api/articles/${slug}/related`,
        );
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelated(relData.data || relData || []);
        }
      } catch (error) {
        console.error("Помилка завантаження статті:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-300 uppercase tracking-widest">
        Завантаження...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-900 text-2xl">
        Статтю не знайдено 😕
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* ШАПКА СТАТТІ */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        {article.category && (
          <span className="inline-block px-4 py-1.5 mb-6 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
            {article.category.name || "Без категорії"}
          </span>
        )}

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
          {article.title}
        </h1>

        <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {article.author?.slug ? (
            <Link
              href={`/authors/${article.author.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {article.author.name}
            </Link>
          ) : (
            <span>{article.author?.name || "Редакція Blog.IT"}</span>
          )}

          <span>•</span>
          <span>
            {new Date(
              article.published_at || article.created_at,
            ).toLocaleDateString("uk-UA")}
          </span>
          <span>•</span>
          <div className="flex items-center gap-1.5 transition-colors hover:text-slate-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{article.views || 0}</span>
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {article.tags.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-4 py-2 bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors cursor-pointer"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] w-full rounded-[40px] overflow-hidden bg-slate-100 relative border border-slate-100">
          {article.cover_url ? (
            <img
              src={article.cover_url}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.classList.add(
                  "flex",
                  "items-center",
                  "justify-center",
                );
                e.currentTarget.parentElement!.innerHTML =
                  '<span class="text-slate-300 font-black text-2xl">Зображення недоступне</span>';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-300 font-black text-2xl">
                БЕЗ ОБКЛАДИНКИ
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="max-w-3xl mx-auto px-6 prose prose-lg prose-slate font-medium leading-relaxed mb-20"
        dangerouslySetInnerHTML={{
          __html: article.content || "<p>Текст статті відсутній.</p>",
        }}
      />

      {related.length > 0 && (
        <div className="bg-slate-50 py-20 border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-10">
              Читайте також
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/articles/${rel.slug}`}
                  className="group block bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="aspect-[16/9] w-full bg-slate-100 relative">
                    {rel.cover_url ? (
                      <img
                        src={rel.cover_url}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.classList.add(
                            "flex",
                            "items-center",
                            "justify-center",
                          );
                          e.currentTarget.parentElement!.innerHTML =
                            '<span class="text-slate-300 font-black text-[10px] uppercase tracking-widest">Немає фото</span>';
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="p-8">
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                      {rel.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
