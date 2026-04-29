import Link from "next/link";

export default async function CategoriesIndexPage() {
  const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  let categories = [];

  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: "no-store"
    });

    if (res.ok) {
      const responseData = await res.json();
      // Отримуємо дані з бекенду [cite: 4]
      categories = responseData.data || responseData || [];
    }
  } catch (error) {
    console.warn("Бекенд недоступний (Connection Refused) [cite: 5]");
  }

  return (
    <main className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Навігація (Хлібні крихти) [cite: 8, 9] */}
        <nav className="mb-10 text-[12px] font-black uppercase tracking-widest text-slate-400">
          <ol className="flex items-center justify-center md:justify-start space-x-2">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Головна
              </Link>
            </li>
            <li>
              <span className="mx-2 opacity-50">/</span>
            </li>
            <li className="text-slate-900">
              Категорії
            </li>
          </ol>
        </nav>
        
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Всі категорії
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Оберіть тему, яка вас цікавить, щоб знайти відповідні статті. [cite: 10]
          </p>
        </header>

        {/* Список категорій з БД [cite: 11] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category: any) => (
              <Link 
                key={category.id}
                href={`/categories/${category.slug}`} 
                className="group block p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:shadow-xl hover:bg-white transition-all"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h2>
                
                {category.description && (
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {category.description}
                  </p>
                )}
              </Link>
            ))
          ) : (
            /* Стан, коли категорії не знайдені в БД  */
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Категорій не знайдено в базі даних
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}