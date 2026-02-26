-- CreateTable
CREATE TABLE "password_reset" (
    "id" SERIAL NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "codigo" TEXT NOT NULL,
    "expira" TIMESTAMP(3) NOT NULL,
    "utilizado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_pkey" PRIMARY KEY ("id")
);
