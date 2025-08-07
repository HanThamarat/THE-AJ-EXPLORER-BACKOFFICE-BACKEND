-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
