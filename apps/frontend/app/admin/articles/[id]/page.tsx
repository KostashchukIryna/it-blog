"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [status, setStatus] = useState("draft");
  const [coverUrl, setCoverUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        const catRes = await fetch("http://localhost:3000/api/admin/categories", { headers });
        const catData = await catRes.json();
        setCategories(catData.data || []);

        const tagsRes = await fetch("http://localhost:3000/api/tags");
        const tagsData = await tagsRes.json();
        setAvailableTags(tagsData.data || tagsData || []);

        const artRes = await fetch("http://localhost:3000/api/admin/articles", { headers });
        const artData = await artRes.json();
        const currentArticle = (artData.data || []).find((a: any) => a.id.toString() === id);

        if (currentArticle) {
          setTitle(currentArticle.title || "");
          setExcerpt(currentArticle.excerpt || "");
          setContent(currentArticle.content || "");
          setCategoryId(currentArticle.category_id?.toString() || "");
          setStatus(currentArticle.status || "draft");
          setCoverUrl(currentArticle.cover_url || "");
          
          if (currentArticle.tags && Array.isArray(currentArticle.tags)) {
            setSelectedTags(currentArticle.tags.map((t: any) => t.id));
          }
        }
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:3000/api/admin/upload", {
      method: "POST",
      body: formData,
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();
    if (res.ok) setCoverUrl(data.url || data.data?.url);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch(`http://localhost:3000/api/admin/articles/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify({ 
        title, 
        excerpt, 
        content, 
        category_id: categoryId || null, 
        tag_ids: selectedTags,
        status, 
        cover_url: coverUrl 
      }),
    });

    if (res.ok) {
      router.push("/admin/articles");
    } else {
      alert("Помилка при збереженні");
    }
  };

  if (isLoading) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-300">Завантаження статті...</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <Link href="/admin/articles" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-6">
          ← Назад до статей
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Редагування</h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">ID статті: #{id}</p>
      </header>

      <form onSubmit={handleUpdate} className="space-y-8 bg-white p-12 rounded-[40px] shadow-sm border border-slate-100">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="aspect-[16/9] bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100 relative group">
            {coverUrl ? (
              <img src={coverUrl} className="w-full h-full object-cover" alt="Cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-300 font-bold text-sm">Немає обкладинки</div>
            )}
          </div>
          <div className="pb-4">
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Змінити обкладинку</label>
            <input type="file" onChange={handleImageUpload} className="text-xs font-bold text-slate-500 cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Заголовок</label>
          <input 
            value={title} onChange={e => setTitle(e.target.value)}
            className="w-full text-2xl font-bold border-none bg-slate-50 rounded-[24px] px-8 py-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Категорія</label>
            <select 
              value={categoryId} onChange={e => setCategoryId(e.target.value)}
              className="w-full p-5 bg-slate-50 rounded-full border-none font-bold text-sm outline-none cursor-pointer"
            >
              <option value="">Без категорії</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Статус</label>
            <select 
              value={status} onChange={e => setStatus(e.target.value)}
              className="w-full p-5 bg-slate-50 rounded-full border-none font-bold text-sm outline-none cursor-pointer"
            >
              <option value="draft">Чернетка</option>
              <option value="published">Опубліковано</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Теги поста</label>
          <div className="flex flex-wrap gap-3 p-6 bg-slate-50 rounded-[32px]">
            {availableTags.length === 0 ? (
              <span className="text-slate-400 text-sm font-bold">Тегів ще немає в базі.</span>
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
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Анонс (Excerpt)</label>
          <textarea 
            value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
            className="w-full p-8 bg-slate-50 rounded-[30px] border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-4 tracking-widest">Текст статті</label>
          <textarea 
            value={content} onChange={e => setContent(e.target.value)}
            className="w-full h-80 p-10 bg-slate-50 rounded-[40px] border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed"
          />
        </div>

        <button className="w-full py-6 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100">
          Зберегти всі зміни
        </button>
      </form>
    </div>
  );
}
