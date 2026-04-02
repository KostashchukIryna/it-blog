"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16">
      <header className="max-w-6xl mx-auto mb-16 flex justify-between items-end">
        <div>
          <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Адмін-панель</p>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Головне меню</h1>
        </div>

        <button 
          onClick={handleLogout}
          className="px-8 py-4 bg-white text-red-500 border border-red-50 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-100 transition-all active:scale-95"
        >
          Вийти з системи
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <MenuCard 
          title="Статті" 
          link="/admin/articles" 
          description="Створити, редагувати або видалити пости" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          }
        />
        <MenuCard 
          title="Категорії" 
          link="/admin/categories" 
          description="Керування розділами блогу" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
          }
        />
      </main>
    </div>
  );
}

function MenuCard({ title, icon, link, description }: any) {
  return (
    <Link 
      href={link} 
      className="group bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-start h-full"
    >
      <div className="text-blue-600 mb-6 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-[20px] group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-xs font-medium leading-relaxed">{description}</p>
      
      <div className="mt-auto pt-8 text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
        Відкрити розділ →
      </div>
    </Link>
  );
}