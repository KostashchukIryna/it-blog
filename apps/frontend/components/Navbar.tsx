import Link from "next/link";

const navItems = [
  { name: "Javascript / Frontend", slug: "javascript" },
  { name: "Backend / DevOps", slug: "backend-devops" },
  { name: "Штучний інтелект", slug: "ai-ml" },
  { name: "Кібербезпека", slug: "cybersecurity" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black text-blue-600 tracking-tighter"
        >
          BLOG.IT
        </Link>
        <div className="md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.slug}
              href={`/categories/${item.slug}`}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Admin Panel */}
        <Link
          href="/admin"
          title="Admin Panel"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white shadow-md hover:bg-slate-700 hover:scale-105 transition-all active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A11.68 11.68 0 0 1 12 22.5c-2.786 0-5.433-.972-7.475-2.742a.75.75 0 0 1-.438-.695Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
