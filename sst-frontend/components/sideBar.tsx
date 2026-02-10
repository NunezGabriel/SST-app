"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  BookOpen,
  MessageSquare,
  Bell,
  BarChart3,
  User,
  Menu,
  X,
  ArrowLeftFromLine,
  ArrowRightToLine,
} from "lucide-react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    { icon: Home, label: "Inicio", href: "/dashboard" },
    { icon: BookOpen, label: "Biblioteca", href: "/biblioteca" },
    { icon: MessageSquare, label: "Charlas", href: "/charlas" },
    { icon: Bell, label: "Alertas", href: "/alertas", badge: 3 },
    { icon: BarChart3, label: "Reportes", href: "/reportes" },
    { icon: User, label: "Perfil", href: "/profile" },
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
          className="lg:hidden fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static top-0 left-0 h-screen bg-[#003366] text-white transition-all duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col overflow-y-auto ${
          isExpanded ? "w-64" : "lg:w-20 w-64"
        }`}
      >
        {" "}
        <div className={`p-6  ${!isExpanded && "lg:p-4"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10  rounded-lg flex items-center justify-center shrink-0">
              <Image
                src="/sst-icon.png"
                alt="SST Logo"
                width={50}
                height={50}
              />
            </div>
            {(isExpanded || isMobile) && (
              <div>
                <h1 className="font-bold text-lg">SST App</h1>
                <p className="text-xs text-blue-200">Seguridad y Salud</p>
              </div>
            )}
          </div>
        </div>
        {/* Botón expandir/contraer - solo en desktop */}
        <div className="hidden lg:flex px-6 py-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-[#1a4876] rounded-lg transition duration-200"
            title={isExpanded ? "Contraer" : "Expandir"}
          >
            {isExpanded ? (
              <div className="flex gap-2 items-center">
                <ArrowLeftFromLine size={20} />
                <p>Contraer</p>
              </div>
            ) : (
              <ArrowRightToLine size={20} />
            )}
          </button>
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
                      if (isMobile) {
                        setIsOpen(false);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1a4876] transition duration-200 group relative ${
                      !isExpanded && "lg:justify-center lg:px-2"
                    }`}
                    title={!isExpanded ? item.label : ""}
                  >
                    <div className="relative shrink-0">
                      <Icon size={20} />
                      {item.badge && !isExpanded && !isMobile && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {(isExpanded || isMobile) && (
                      <>
                        <span className="font-medium text-sm flex-1">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </>
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
