"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  BookOpen,
  MessageSquare,
  Bell,
  BarChart3,
  User,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: Home, label: "Inicio", href: "/dashboard" },
    { icon: BookOpen, label: "Biblioteca", href: "/biblioteca" },
    { icon: MessageSquare, label: "Charlas", href: "/charlas" },
    { icon: Bell, label: "Alertas", href: "/alertas", badge: 3 },
    { icon: BarChart3, label: "Reportes", href: "/reportes" },
    { icon: User, label: "Perfil", href: "/perfil" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#003366] text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-blue-900 text-white transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:translate-x-0 flex flex-col overflow-y-auto`}
      >
        {/* Logo y título */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
              <Image
                src="/sst-icon.png"
                alt="SST Logo"
                width={32}
                height={32}
              />
            </div>
            <div>
              <h1 className="font-bold text-lg">SST App</h1>
              <p className="text-xs text-blue-200">Seguridad y Salud</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      // Cerrar sidebar en mobile cuando se selecciona un item
                      if (window.innerWidth < 1024) {
                        setIsOpen(false);
                      }
                    }}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <p className="text-xs text-blue-300 text-center">© 2026 SST App</p>
        </div>
      </div>
    </>
  );
};

export default SideBar;
