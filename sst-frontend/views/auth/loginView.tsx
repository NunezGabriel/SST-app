"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#003d70] flex flex-col items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center justify-center w-full max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl bg-opacity-50 flex items-center justify-center border border-blue-400 border-opacity-30">
            <Image
              src="/sst-icon.png"
              alt="SST App Logo"
              width={80}
              height={80}
              priority
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">SST App</h1>
          <p className="text-blue-200 text-sm">
            Seguridad y Salud en el Trabajo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-3xl p-8 shadow-2xl"
        >
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2"></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-full transition duration-300 shadow-lg"
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>

          <div className="text-center mt-4">
            <Link
              href="/forgot-password"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium transition"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        <p className="text-gray-400 text-xs mt-8 text-center">
          © 2026 SST App - Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default LoginView;
