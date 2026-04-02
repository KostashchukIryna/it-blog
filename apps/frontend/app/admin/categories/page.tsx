"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await res.json();
      setCategories(result.data || []);
    } catch (e) {
      console.error("Помилка мережі", e);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: newName, description: "" }),
    });

    if (res.ok) {
      setNewName("");
      await loadCategories();
    }
  };

  const handleUpdate = async (id: number) => {
    const res = await fetch(
      `/api/admin/categories/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: editName, description: "" }),
      },
    );

    if (res.ok) {
      setEditingId(null);
      await loadCategories();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цю категорію?")) return;

    const res = await fetch(
      `/api/admin/categories/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );

    if (res.ok) {
      await loadCategories();
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

        <div className="mb-10">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            Категорії
          </h1>
        </div>

        <form
          onSubmit={handleCreate}
          className="mb-12 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[32px] shadow-sm border border-slate-100"
        >
          <input
            type="text"
            placeholder="Назва нової категорії (напр. JavaScript)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 bg-slate-50 rounded-2xl border-none px-6 py-4 outline-none text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 whitespace-nowrap"
          >
             Додати категорію
          </button>
        </form>

        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden p-8 md:p-12">
          
          {categories.length === 0 && (
            <div className="text-center py-10 text-slate-400 font-bold text-sm">
              Категорій ще немає. Додайте першу вище!
            </div>
          )}

          <div className="grid grid-cols-1 divide-y divide-slate-50">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="py-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-50/50 transition-colors rounded-2xl -mx-4 px-4"
              >
                {editingId === cat.id ? (
                  <div className="flex flex-1 gap-4 items-center w-full">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-white border-2 border-blue-500 rounded-xl px-4 py-2 outline-none font-bold text-slate-900 text-sm"
                      autoFocus
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        className="text-green-500 hover:text-green-600 font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        Зберегти
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-slate-400 hover:text-slate-600 font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        Скасувати
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-3">
                      {cat.name}
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditName(cat.name);
                        }}
                        className="text-blue-600 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors"
                      >
                        Редагувати
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors"
                      >
                        Видалити
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
