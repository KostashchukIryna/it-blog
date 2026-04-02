import Link from "next/link";
import SearchField from "./SearchField";
import AdminButton from "./AdminButton";
import { apiFetch } from "@/lib/api";

export default async function Navbar() {
  let categories = [];
  try {
    const res = await apiFetch("/api/categories", { cache: "no-store" });
    if (res.ok) {
      const result = await res.json();
      categories = result.data || result || [];
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
          BLOG.IT
        </Link>
        
        <div className="hidden md:flex space-x-8 items-center">
          {categories.map((item: any) => (
            <Link
              key={item.slug}
              href={`/categories/${item.slug}`}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <SearchField />
          <AdminButton />
        </div>
      </div>
    </nav>
  );
}