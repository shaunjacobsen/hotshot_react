import { Link } from 'react-router-dom';

export default function SidebarLayout({ children }) {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Drop-in Checkout', path: '/dropin' },
    { name: 'Terminal API', path: '/tapi' },
    { name: 'Pay by Link', path: '/paybylink' },
    { name: 'Capital', path: '/capital' },
  ];

  return (
    <div className="min-h-screen min-w-screen text-[#00112c]">
      <aside className="fixed left-0 top-0 h-full w-64 bg-adyengray border-r border-[#dadddf]">
        <h2 className="text-xl font-bold mb-6 p-6 text-tangerine">Hotshot</h2>

        <nav className="flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:bg-gray-200 px-3 py-3 pl-6"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 p-8 bg-white min-h-screen">{children}</main>
    </div>
  );
}
