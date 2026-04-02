"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "login" | "error" | "ok">(
    "loading",
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_role");

    if (pathname === "/admin/login") {
      setStatus("ok");
      return;
    }
    console.log(role);
    if (!token) {
      setStatus("login");
    } else if (role !== "admin") {
      setStatus("error");
    } else {
      setStatus("ok");
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/admin/login";
  };

  if (status === "login") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4">
            Доступ обмежено
          </p>
          <h2 className="text-xl font-black mb-6 text-slate-900">
            Будь ласка, увійдіть у систему
          </h2>
          <Link
            href="/admin/login"
            className="inline-block px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
          >
            Увійти
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center mx-auto mb-8 border-2 border-red-100 shadow-inner shadow-red-100/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_2px_10px_rgba(239,68,68,0.3)]"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">
            Доступ заборонено
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
            Ця зона доступна лише для Адміністраторів. Спробуйте змінити акаунт
            або зверніться до підтримки.
          </p>

          <button
            onClick={handleLogout}
            className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-red-100"
          >
            Вийти з акаунту
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading") return null;

  return <>{children}</>;
}
