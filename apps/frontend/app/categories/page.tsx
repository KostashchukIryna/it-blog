import Link from "next/link";

export default async function CategoriesIndexPage() {
  const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  let categories = [];
  let fetchError = false;

  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: "no-store"
    });

    if (!res.ok) {
      console.warn("Бекенд відповів помилкою:", res.status);
      fetchError = true;
    } else {
      const responseData = await res.json();
      categories = responseData.data || responseData || [];
    }
  } catch (error) {
    console.warn("Бекенд недоступний (Connection Refused)");
    fetchError = true;
  }

  if (fetchError || categories.length === 0) {
    categories = [
      { id: 1, name: "Backend", slug: "backend", description: "Все про бекенд" },
      { id: 2, name: "Frontend", slug: "frontend", description: "Все про верстку тут" },
      { id: 3, name: "Architecture", slug: "architecture", description: "Все про архітектуру" },
      { id: 4, name: "JavaScript", slug: "javascript", description: "JS фреймворки і більше" },
      { id: 5, name: "Штучний Інтелект", slug: "ai", description: "Новини зі світу ШІ" }
    ];
  }

  return (
    <main className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        
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
            Оберіть тему, яка вас цікавить, щоб знайти відповідні статті.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
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
          ))}
        </div>

      </div>
    </main>
  );
}