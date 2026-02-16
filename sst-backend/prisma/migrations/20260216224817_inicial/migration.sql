/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMIN', 'WORKER');

-- CreateEnum
CREATE TYPE "EstadoCharla" AS ENUM ('PENDIENTE', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('PROCEDIMIENTO', 'INSTRUCTIVO', 'MANUAL');

-- CreateEnum
CREATE TYPE "EstadoVisualizacion" AS ENUM ('SIN_VER', 'VISTO');

-- CreateEnum
CREATE TYPE "RespuestaCorrecta" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "EstadoLogro" AS ENUM ('PENDIENTE', 'CONSEGUIDO');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('LOGRO', 'NUEVO', 'PENDIENTE');

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "dni" VARCHAR(20) NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "tipo" "TipoUsuario" NOT NULL DEFAULT 'WORKER',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charla" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "enlace" TEXT NOT NULL,
    "etiqueta" VARCHAR(100),
    "fecha_charla" DATE NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progreso_charla" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_charla" INTEGER NOT NULL,
    "estado" "EstadoCharla" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_completada" TIMESTAMP(3),

    CONSTRAINT "progreso_charla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento_seguridad" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "enlace" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documento_seguridad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visualizacion_documento" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_documento" INTEGER NOT NULL,
    "estado" "EstadoVisualizacion" NOT NULL DEFAULT 'SIN_VER',
    "fecha_visualizacion" TIMESTAMP(3),

    CONSTRAINT "visualizacion_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formato" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "tipo" VARCHAR(100),
    "enlace" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "induccion" (
    "id" SERIAL NOT NULL,
    "link_diapo" TEXT NOT NULL,
    "link_pdf" TEXT NOT NULL,
    "link_video" TEXT NOT NULL,
    "duracion" INTEGER NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "induccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_examen" (
    "id" SERIAL NOT NULL,
    "puntaje_aprobatorio" INTEGER NOT NULL DEFAULT 14,
    "puntaje_total" INTEGER NOT NULL DEFAULT 20,
    "intentos_maximos" INTEGER NOT NULL DEFAULT 3,
    "tiempo_espera_minutos" INTEGER NOT NULL DEFAULT 10,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pregunta_examen" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "opcion_a" VARCHAR(255) NOT NULL,
    "opcion_b" VARCHAR(255) NOT NULL,
    "opcion_c" VARCHAR(255) NOT NULL,
    "opcion_d" VARCHAR(255) NOT NULL,
    "respuesta_correcta" "RespuestaCorrecta" NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pregunta_examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intento_examen" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "numero_intento" INTEGER NOT NULL,
    "puntaje_obtenido" INTEGER NOT NULL,
    "aprobado" BOOLEAN NOT NULL,
    "respuestas_json" JSONB,
    "fecha_intento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intento_examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloqueo_examen" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "intentos_usados" INTEGER NOT NULL DEFAULT 0,
    "bloqueado_hasta" TIMESTAMP(3),
    "fecha_ultimo_intento" TIMESTAMP(3),

    CONSTRAINT "bloqueo_examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logro" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "icono" VARCHAR(100),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_logro" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_logro" INTEGER NOT NULL,
    "estado" "EstadoLogro" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_conseguido" TIMESTAMP(3),

    CONSTRAINT "usuario_logro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_lectura" TIMESTAMP(3),

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_dni_key" ON "usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_charla_id_usuario_id_charla_key" ON "progreso_charla"("id_usuario", "id_charla");

-- CreateIndex
CREATE UNIQUE INDEX "visualizacion_documento_id_usuario_id_documento_key" ON "visualizacion_documento"("id_usuario", "id_documento");

-- CreateIndex
CREATE UNIQUE INDEX "bloqueo_examen_id_usuario_key" ON "bloqueo_examen"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_logro_id_usuario_id_logro_key" ON "usuario_logro"("id_usuario", "id_logro");

-- AddForeignKey
ALTER TABLE "progreso_charla" ADD CONSTRAINT "progreso_charla_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_charla" ADD CONSTRAINT "progreso_charla_id_charla_fkey" FOREIGN KEY ("id_charla") REFERENCES "charla"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visualizacion_documento" ADD CONSTRAINT "visualizacion_documento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visualizacion_documento" ADD CONSTRAINT "visualizacion_documento_id_documento_fkey" FOREIGN KEY ("id_documento") REFERENCES "documento_seguridad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intento_examen" ADD CONSTRAINT "intento_examen_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloqueo_examen" ADD CONSTRAINT "bloqueo_examen_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_logro" ADD CONSTRAINT "usuario_logro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_logro" ADD CONSTRAINT "usuario_logro_id_logro_fkey" FOREIGN KEY ("id_logro") REFERENCES "logro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
