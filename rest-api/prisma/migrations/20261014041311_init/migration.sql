-- CreateTable
CREATE TABLE "Url" (
    "id" SERIAL NOT NULL,
    "original" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_short_key" ON "Url"("short");
