"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewArticlePage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [coverUrl, setCoverUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };
      
      try {
        const catRes = await fetch("http://localhost:3000/api/admin/categories", { headers });
        const catData = await catRes.json();
        setCategories(catData.data || []);

        const tagsRes = await fetch("http://localhost:3000/api/tags");
        const tagsData = await tagsRes.json();
        setAvailableTags(tagsData.data || tagsData || []);
      } catch (err) {
        console.error("Помилка завантаження даних", err);
      }
    };
    loadData();
  }, []);

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId] 
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/api/admin/upload", {
        method: "POST",
        body: formData,
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setCoverUrl(data.url || data.data?.url);
    } catch (err) {
      alert("Помилка завантаження фото");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalExcerpt = excerpt.trim() || content.substring(0, 150).replace(/[#*]/g, "") + "...";

    const res = await fetch("http://localhost:3000/api/admin/articles", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ 
        title, 
        content, 
        excerpt: finalExcerpt, 
        category_id: categoryId || null, 
        tag_ids: selectedTags,
        cover_url: coverUrl, 
        status: "published" 
      })
    });

    if (res.ok) {
      router.push("/admin/articles");
    } else {
      const err = await res.json();
      alert(`Помилка: ${err.message}`);
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <Link href="/admin/articles" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-6">
          ← Назад до статей
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Створити статтю</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[40px] shadow-sm border border-slate-100">
        
        <div className="group relative aspect-[21/9] w-full bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-400">
          {coverUrl ? (
            <>
              <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label htmlFor="file-upload" className="cursor-pointer bg-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-900">Змінити фото</label>
              </div>
            </>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer text-center">
              <span className="text-4xl mb-4 block">📸</span>
              <span className="font-black text-[10px] uppercase tracking-widest text-blue-600">Завантажити обкладинку</span>
            </label>
          )}
          <input id="file-upload" type="file" onChange={handleImageUpload} className="hidden" />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Заголовок статті</label>
          <input 
            value={title} onChange={e => setTitle(e.target.value)}
            className="w-full text-3xl font-bold border-none bg-slate-50 rounded-[24px] px-8 py-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Категорія</label>
            <select 
              value={categoryId} onChange={e => setCategoryId(e.target.value)}
              className="w-full p-6 bg-slate-50 rounded-full border-none font-bold text-sm outline-none cursor-pointer"
            >
              <option value="">Без категорії</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Анонс</label>
            <input 
              value={excerpt} onChange={e => setExcerpt(e.target.value)}
              className="w-full p-6 bg-slate-50 rounded-full border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Теги поста</label>
          <div className="flex flex-wrap gap-3 p-6 bg-slate-50 rounded-[32px]">
            {availableTags.length === 0 ? (
              <span className="text-slate-400 text-sm font-bold">Тегів ще немає в базі даних.</span>
            ) : (
              availableTags.map(tag => (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedTags.includes(tag.id)
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  #{tag.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Основний контент</label>
          <textarea 
            value={content} onChange={e => setContent(e.target.value)}
            className="w-full h-96 p-10 bg-slate-50 rounded-[40px] border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            required
          />
        </div>

        <button type="submit" className="w-full py-8 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl">
          Опублікувати статтю
        </button>
      </form>
    </div>
  );
}
