"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">Storm Shield</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/generators"
                className="text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Find Generators
              </Link>
              <Link
                href="/list-generator"
                className="text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                List Your Generator
              </Link>
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-slate-100 text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-slate-700 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/generators"
                className="text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Find Generators
              </Link>
              <Link
                href="/list-generator"
                className="text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                List Your Generator
              </Link>
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-slate-100 text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}