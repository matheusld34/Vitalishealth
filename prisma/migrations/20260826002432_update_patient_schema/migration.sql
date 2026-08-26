/*
  Warnings:

  - You are about to drop the column `address` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "address",
ADD COLUMN     "address_complement" TEXT,
ADD COLUMN     "address_number" TEXT,
ADD COLUMN     "card_number" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "clinical_status" TEXT,
ADD COLUMN     "insurance_operator" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "plan_type" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT;

-- CreateTable
CREATE TABLE "patient_attachments" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "storage_key" TEXT NOT NULL,
    "url" TEXT,
    "category" TEXT DEFAULT 'EXAM',
    "notes" TEXT,
    "uploaded_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "patient_attachments_patient_id_idx" ON "patient_attachments"("patient_id");

-- AddForeignKey
ALTER TABLE "patient_attachments" ADD CONSTRAINT "patient_attachments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
