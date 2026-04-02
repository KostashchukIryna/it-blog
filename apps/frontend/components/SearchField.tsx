"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchField() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      
      setQuery("");
      
      if (e.target instanceof HTMLFormElement) {
        (e.target.querySelector('input') as HTMLInputElement).blur();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center group h-9 ml-6">
      <div className="
        absolute inset-0 bg-slate-50 border border-slate-100 rounded-full 
        transition-all duration-300 ease-out 
        group-focus-within:bg-white group-focus-within:ring-1 group-focus-within:ring-blue-500
      " />

      <div className="relative z-20 pl-3 pr-1 text-slate-400 pointer-events-none">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className="w-3.5 h-3.5" 
          strokeWidth="3"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Пошук..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          relative z-10 w-32 px-1 py-1.5 
          bg-transparent border-none outline-none 
          text-xs text-slate-900 placeholder:text-slate-400
        "
      />
    </form>
  );
}
