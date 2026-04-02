"use client";
import Link from "next/link";

export default function AdminButton() {
  return (
    <Link 
      href="/admin/dashboard"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white shadow-md hover:scale-110 transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A11.68 11.68 0 0 1 12 22.5c-2.786 0-5.433-.972-7.475-2.742a.75.75 0 0 1-.438-.695Z" clipRule="evenodd" />
      </svg>
    </Link>
  );
}