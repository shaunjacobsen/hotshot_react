import { Dialog, DialogPanel } from '@headlessui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SidebarLayout({ children }) {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pay by Link', path: '/paybylink' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Hotshot</h2>

        <nav className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
