import Link from "next/link";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export default async function ArticlesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const API_URL = process.env.BACKEND_URL || "http://localhost:3001";
  
  let articles: any[] = [];

  try {
    const res = await fetch(`${API_URL}/api/admin/articles`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const result = await res.json();
    articles = result.data || [];
  } catch (e) {
    console.error("Помилка завантаження статей:", e);
  }

  async function deleteArticle(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token || !id) return;

    try {
      const BACKEND = process.env.BACKEND_URL || "http://localhost:3001";
      await fetch(`${BACKEND}/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      revalidatePath("/admin/articles");
    } catch (e) {
      console.error("Помилка мережі при видаленні:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:-translate-x-1 transition-all mb-8"
        >
          ← Повернутися в меню
        </Link>

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Статті</h1>
          
          <Link 
            href="/admin/articles/new" 
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
          >
            Створити статтю
          </Link>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12">
          
          <div className="grid grid-cols-12 gap-4 pb-6 border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="col-span-6">Назва</div>
            <div className="col-span-3">Статус</div>
            <div className="col-span-3 text-right">Дії</div>
          </div>

          <div className="divide-y divide-slate-50">
            {articles.length === 0 ? (
              <div className="py-10 text-center font-bold text-slate-400 text-sm">
                Статей ще немає. Натисніть "+ Створити статтю", щоб додати першу.
              </div>
            ) : (
              articles.map((article) => (
                <div key={article.id} className="grid grid-cols-12 gap-4 py-6 items-center hover:bg-slate-50/50 transition-colors rounded-2xl -mx-4 px-4">
                  
                  <div className="col-span-6 font-bold text-slate-900 text-sm md:text-base pr-4">
                    {article.title}
                  </div>
                  
                  <div className="col-span-3">
                    <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full ${article.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {article.status || "draft"}
                    </span>
                  </div>
                  
                  <div className="col-span-3 flex justify-end items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                    <Link 
                      href={`/admin/articles/${article.id}`} 
                      className="text-blue-600 hover:text-slate-900 transition-colors"
                    >
                      Редагувати
                    </Link>
                    
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={article.id} />
                      <button 
                        type="submit"
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        Видалити
                      </button>
                    </form>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
