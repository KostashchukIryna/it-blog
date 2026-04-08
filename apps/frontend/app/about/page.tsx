import Link from "next/link";

export const metadata = {
  title: "Про нас | Blog-IT",
  description: "Дізнайтеся більше про наш блог, редакційну політику та як з нами зв'язатися.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block px-4 py-1.5 mb-6 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
          Про проєкт
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
          Про нас
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
          Blog.IT — це сучасний майданчик для розробників, ентузіастів технологій та всіх, 
          хто цікавиться світом ІТ та програмування.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        <div className="bg-slate-50 p-10 md:p-16 rounded-[40px] border border-slate-100 mb-12 shadow-sm">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-6">
            Редакційна політика та місія
          </h2>
          <div className="prose prose-lg prose-slate font-medium leading-relaxed">
            <p>
              Наша місія — робити складні технологічні концепції доступними та зрозумілими. 
              Ми прагнемо створювати контент, який допомагає новачкам навчатися, а професіоналам — 
              ділитися досвідом та бути в курсі останніх трендів індустрії.
            </p>
            <p className="mt-4">
              Ми дотримуємося суворої редакційної політики: публікуємо лише перевірену інформацію, 
              уникаємо клікбейту та поважаємо час наших читачів. Кожен матеріал проходить 
              ретельну перевірку перед тим, як потрапити на головну сторінку.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="group bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col h-full">
            <div className="text-blue-600 mb-6 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-[20px] group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Контакти</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 flex-grow">
              Маєте запитання, пропозиції щодо співпраці або хочете стати нашим автором? Напишіть нам.
            </p>
            <a 
              href="mailto:hello@blog-it.com" 
              className="mt-auto text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
            >
              hello@blog-it.com
            </a>
          </div>

          <div className="group bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col h-full">
            <div className="text-blue-600 mb-6 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-[20px] group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Ми у мережі</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 flex-grow">
              Слідкуйте за нами там, де вам найзручніше, щоб не пропустити нові публікації.
            </p>
            <div className="mt-auto flex flex-col gap-3 text-[10px] font-black uppercase tracking-widest">
              <Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Telegram</Link>
              <Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">LinkedIn</Link>
              <Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Twitter (X)</Link>
            </div>
          </div>
        </div>

        <div className="text-center pt-10 border-t border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Проєкт засновано у березні 2026 року
          </p>
        </div>
      </main>
    </div>
  );
}