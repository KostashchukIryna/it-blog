import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const ALL_ARTICLES = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  title:
    i === 0
      ? "Майбутнє штучного інтелекту у 2026 році"
      : `Цікава новина про IT №${i + 1}`,
  slug: `news-${i + 1}`,
  content:
    "Це повний текст вашої статті. Згідно з ТЗ, тут має бути розгорнутий контент, аналітика та висновки. Штучний інтелект продовжує змінювати ландшафт розробки програмного забезпечення, впроваджуючи нові стандарти автоматизації та швидкості написання коду.",
  excerpt: "Короткий опис для анонсу...",
  category:
    i % 3 === 0 ? "JavaScript" : i % 3 === 1 ? "AI & ML" : "Cybersecurity",
  author: "Олександр Технік",
  authorSlug: "oleksandr-tekhnik",
  date: "30 Березня, 2026",
  views: 1240 + i,
  tags: i % 3 === 0 ? ['frontend', 'react', 'web'] : i % 3 === 1 ? ['ai', 'future', 'tech'] : ['security', 'devops', 'web'],
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
}));

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = ALL_ARTICLES.find((a) => a.slug === slug);

  if (!article) notFound();

  const relatedArticles = ALL_ARTICLES.filter(
    (a) => a.category === article.category && a.slug !== article.slug,
  ).slice(0, 3);

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-16 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded">
            {article.category}
          </span>
          <span className="text-slate-400 text-xs">{article.date}</span>
          <span className="text-slate-400 text-xs flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            {article.views}
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 py-6 border-y border-slate-100">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
            {article.author[0]}
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Автор
            </p>
            <Link
              href={`/authors/${article.authorSlug}`}
              className="text-slate-900 font-bold hover:text-blue-600 transition-colors"
            >
              {article.author}
            </Link>
          </div>
        </div>
      </header>

      {/* Banner img */}
      <div className="max-w-4xl mx-auto px-6 mb-14">
        <div className="aspect-[21/9] relative rounded-3xl overflow-hidden bg-slate-100 shadow-2xl">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="prose prose-slate lg:prose-xl font-medium text-slate-700 leading-relaxed mb-12">
          <p>{article.content}</p>
          <p className="mt-6">
            Додатковий абзац тексту для кращого вигляду сторінки...
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-20">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="text-xs font-bold text-slate-400 bg-slate-50 hover:bg-blue-600 hover:text-white transition-colors px-3 py-1 rounded-full italic cursor-pointer shadow-sm"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <hr className="border-slate-100 mb-20" />

        {/* Connected to this post */}
        <section>
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
            Читайте також
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/articles/${rel.slug}`}
                className="group"
              >
                <div className="aspect-video relative rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <Image
                    src={rel.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-all"
                  />
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {rel.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
