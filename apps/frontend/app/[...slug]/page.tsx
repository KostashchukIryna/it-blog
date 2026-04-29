import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }> | { slug: string[] };
}) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  const API_URL = process.env.BACKEND_URL || "http://localhost:3001";

  // 1. ЛОГІКА РЕДИРЕКТУ ДЛЯ КАТЕГОРІЙ
  if (slugArray.length === 1) {
    const potentialCategory = decodeURIComponent(slugArray[0]).toLowerCase();
    
    try {
      const catRes = await fetch(`${API_URL}/api/categories/${potentialCategory}`, { cache: 'no-store' });
      if (catRes.ok) {
        redirect(`/categories/${potentialCategory}`);
      }
    } catch (e) {
      console.error("Помилка перевірки категорії:", e);
    }
  }

  // 2. ВАЛІДАЦІЯ СТРУКТУРИ ДЛЯ СТАТТІ
  if (slugArray.length !== 2) {
    notFound();
  }

  const urlCategory = decodeURIComponent(slugArray[0]).toLowerCase();
  const finalSlug = decodeURIComponent(slugArray[1]).toLowerCase();

  let article: any = null;
  let related: any[] = [];

  // --- 3. ПОШУК СТАТТІ В БД ---
  try {
    const artRes = await fetch(`${API_URL}/api/articles/${finalSlug}`, { cache: "no-store" });
    
    if (artRes.status === 404) {
      notFound();
    }

    if (artRes.ok) {
      const artData = await artRes.json();
      article = artData.data || artData;

      if (article?.id) {
        // Реєстрація перегляду
        fetch(`${API_URL}/api/articles/${article.id}/view`, { 
          method: "POST", 
          cache: "no-store" 
        }).catch(() => {});

        // Схожі статті
        const relRes = await fetch(`${API_URL}/api/articles/${finalSlug}/related`, { cache: "no-store" });
        if (relRes.ok) {
          const relData = await relRes.json();
          related = relData.data || relData || [];
        }
      }
    }
  } catch (error) {
    console.error("Помилка підключення до БД:", error);
    // Якщо бекенд лежить, а моків немає — показуємо 404
    notFound();
  }

  if (!article) return notFound();

  // --- 4. ВАЛІДАЦІЯ КАТЕГОРІЇ (SEO Редирект) ---
  const realCategorySlug = article.category?.slug?.toLowerCase();
  
  if (realCategorySlug && urlCategory !== realCategorySlug) {
    redirect(`/${realCategorySlug}/${finalSlug}`);
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  return (
    <article className="min-h-screen bg-white pb-20">
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        <nav className="mb-10 text-[12px] font-black uppercase tracking-widest text-slate-400">
          <ol className="flex items-center justify-center space-x-2">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Головна</Link></li>
            <li><span className="mx-2 opacity-50">/</span></li>
            <li><Link href="/categories" className="hover:text-blue-600 transition-colors">Категорії</Link></li>
            <li><span className="mx-2 opacity-50">/</span></li>
            <li>
              <Link href={`/categories/${realCategorySlug}`} className="hover:text-blue-600 transition-colors uppercase">
                {article.category?.name || realCategorySlug}
              </Link>
            </li>
            <li><span className="mx-2 opacity-50">/</span></li>
            <li className="text-slate-900 truncate max-w-[200px]">{article.title}</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
          {article.title}
        </h1>
        <p className="text-xl text-slate-500 font-medium mb-8 max-w-2xl mx-auto">{article.excerpt}</p>
        
        <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>{article.author?.name || "Редакція"}</span>
          <span>•</span>
          <span>{formatDate(article.published_at || article.created_at)}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] w-full rounded-[40px] overflow-hidden bg-slate-100 border border-slate-100">
          {article.cover_url && (
            <img src={article.cover_url} alt={article.title} className="w-full h-full object-cover" />
          )}
        </div>
      </div>

      <div
        className="whitespace-pre-wrap max-w-3xl mx-auto px-6 prose prose-lg prose-slate font-medium leading-relaxed mb-16"
        dangerouslySetInnerHTML={{ __html: article.content || "" }}
      />

      {related.length > 0 && (
        <div className="bg-slate-50 py-20 border-t border-slate-100 mt-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter">Читайте також</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rel: any) => (
                <Link key={rel.slug} href={`/${rel.category?.slug || realCategorySlug}/${rel.slug}`} className="group block bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {rel.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}