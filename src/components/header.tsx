"use client";

import Link from "next/link";
import { Film } from "lucide-react";

export function Header() {
  return (
    <header className="w-full h-16 shadow-sm bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
        >
          <Film className="w-6 h-6" />
          MovieDB
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-800 dark:text-gray-100 hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin"
            className="text-sm text-gray-800 dark:text-gray-100 hover:text-primary transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
