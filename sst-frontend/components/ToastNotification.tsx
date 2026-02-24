"use client";

import React, { useEffect, useState } from "react";
import { X, Bell, Trophy, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Type = "nuevo" | "pendiente" | "logro" | "NUEVO" | "PENDIENTE" | "LOGRO";

const normalize = (t: Type): "nuevo" | "pendiente" | "logro" => {
  return t.toLowerCase() as "nuevo" | "pendiente" | "logro";
};

const typeConfig = {
  logro: {
    icon: Trophy,
    bgIcon: "bg-gradient-to-br from-amber-400 to-yellow-500",
    border: "border-amber-200",
    bar: "bg-gradient-to-r from-amber-400 to-yellow-500",
  },
  nuevo: {
    icon: Bell,
    bgIcon: "bg-gradient-to-br from-[#003366] to-[#0066a3]",
    border: "border-blue-200",
    bar: "bg-gradient-to-r from-[#003366] to-[#0066a3]",
  },
  pendiente: {
    icon: AlertTriangle,
    bgIcon: "bg-gradient-to-br from-orange-400 to-red-500",
    border: "border-orange-200",
    bar: "bg-gradient-to-r from-orange-400 to-red-500",
  },
};

export default function ToastNotification({
  title,
  message,
  onClose,
  type = "nuevo",
}: {
  title?: string;
  message: string;
  onClose?: () => void;
  type?: Type;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const key = normalize(type);
  const config = typeConfig[key];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Esperar a que termine la animación de salida antes de llamar onClose
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            x: 100,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            x: 100,
            scale: 0.8,
            transition: { duration: 0.2 },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="w-80"
        >
          <motion.div
            initial={{ boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)" }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(0, 0, 0, 0)",
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              ],
            }}
            transition={{ duration: 0.3 }}
            className={`relative flex items-start gap-3 bg-white rounded-2xl p-4 border ${config.border} overflow-hidden`}
          >
            {/* Barra de progreso animada */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: "linear" }}
              className={`absolute left-0 bottom-0 h-1 ${config.bar} origin-left`}
              style={{ width: "100%" }}
            />

            {/* Barra de color lateral */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`absolute left-0 top-0 bottom-0 w-1 ${config.bar} origin-top`}
            />

            {/* Icono con animación */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                delay: 0.1,
              }}
              className={`w-10 h-10 rounded-xl ${config.bgIcon} flex items-center justify-center text-white shrink-0 shadow-md`}
            >
              <Icon size={18} />
            </motion.div>

            {/* Contenido con fade in */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 min-w-0"
            >
              {title && (
                <p className="font-bold text-slate-800 text-sm leading-tight truncate">
                  {title}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {message}
              </p>
            </motion.div>

            {/* Botón cerrar con hover animation */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 transition-colors shrink-0 mt-0.5"
            >
              <X size={14} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
