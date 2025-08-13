-- CreateTable
CREATE TABLE "public"."province" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,

    CONSTRAINT "province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."district" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subdistrict" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "districtId" INTEGER NOT NULL,
    "postalCode" TEXT NOT NULL,

    CONSTRAINT "subdistrict_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "province_code_key" ON "public"."province"("code");

-- CreateIndex
CREATE UNIQUE INDEX "district_code_key" ON "public"."district"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subdistrict_code_key" ON "public"."subdistrict"("code");

-- AddForeignKey
ALTER TABLE "public"."district" ADD CONSTRAINT "district_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "public"."province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subdistrict" ADD CONSTRAINT "subdistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
