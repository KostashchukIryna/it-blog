"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("ДАНІ З БЕКЕНДУ:", data);

      if (res.ok) {
        const token = data.token || data.data?.token;
        const user = data.user || data.data?.user;

        if (token && user) {
          localStorage.setItem("token", token);
          localStorage.setItem("user_name", user.name || "Користувач");
          
          const role = user.is_admin ? "admin" : "user";
          localStorage.setItem("user_role", role);

          window.location.href = "/admin/dashboard";
        } else {
          setError("Помилка: Сервер не надіслав дані користувача");
        }
      } else {
        setError(data.message || "Невірний email або пароль");
      }
    } catch (err) {
      setError("Не вдалося підключитися до сервера. Перевір бекенд.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border border-slate-100">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">BLOG.IT</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Вхід у систему</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <input 
              type="email" 
              placeholder="Електронна пошта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:border-blue-500 focus:bg-white outline-none text-sm font-bold transition-all"
            />
            <input 
              type="password" 
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:border-blue-500 focus:bg-white outline-none text-sm font-bold transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:-translate-y-1'}`}
          >
            {isLoading ? "Зачекайте..." : "Увійти в кабінет"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-[9px] font-black uppercase text-slate-300 hover:text-blue-600 tracking-widest transition-all">
            ← Повернутися на сайт
          </a>
        </div>
      </div>
    </div>
  );
}
