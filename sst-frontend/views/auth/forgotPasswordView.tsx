"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

const ForgotPasswordView = () => {
  const [correo, setCorreo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { solicitarRecuperacion } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const data = await solicitarRecuperacion(correo);
      setSuccess(data.message);
      setTimeout(() => {
        router.push("/forgot-password/verify");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al enviar el código de recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#003d70] flex flex-col items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center justify-center w-full max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl bg-opacity-50 flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="HSE Logo"
              width={80}
              height={80}
              priority
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">HSE App</h1>
          <p className="text-blue-200 text-sm">Health Safety & Environment</p>
        </div>

        <div className="w-full bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-gray-600 text-sm">
              Ingresa tu correo electrónico y te enviaremos un código de
              recuperación
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu@empresa.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-full transition duration-300 shadow-lg"
            >
              {isLoading ? "Enviando..." : "Enviar código de recuperación"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium transition"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <p className="text-gray-400 text-xs mt-8 text-center">
          © 2026 HSE App - Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
