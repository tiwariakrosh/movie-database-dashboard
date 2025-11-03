"use client";

import Link from "next/link";
import { Film } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
            className="text-sm hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin"
            className="text-sm hover:text-primary transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
